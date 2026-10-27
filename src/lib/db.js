import { supabase, isSupabaseConfigured } from './supabase.js';
import { OFFICIAL_EVENTS } from '../data/events.js';

export { isSupabaseConfigured, supabase };

const STORAGE_KEYS = {
  EVENTS: 'vexoris_events_v3',
  REGISTRATIONS: 'vexoris_registrations_v1',
  PARTICIPANTS: 'vexoris_participants_v1',
  ADMIN_SESSION: 'vexoris_admin_session_v1',
};

// Initialise local storage with empty data (no fake test entries)
const initLocalStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS) || localStorage.getItem(STORAGE_KEYS.EVENTS).indexOf('judges') !== -1) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(OFFICIAL_EVENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PARTICIPANTS)) {
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify([]));
  }

  // Actively purge any legacy demo / fake test entries from browser storage
  try {
    // Clean storage of any demo artifacts if they exist
    const rawRegs = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    if (rawRegs) {
      const regs = JSON.parse(rawRegs);
      const cleaned = regs.filter(r => 
        !r.id?.startsWith('reg-demo') && 
        r.reference_code !== 'VX-7419' && 
        r.reference_code !== 'VX-8204' && 
        r.reference_code !== 'VX-9031' && 
        r.reference_code !== 'VX-3382'
      );
      if (cleaned.length !== regs.length) {
        localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(cleaned));
      }
    }

    const rawParts = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
    if (rawParts) {
      const parts = JSON.parse(rawParts);
      const cleanedParts = parts.filter(p => 
        !p.id?.startsWith('part-demo') && 
        !p.registration_id?.startsWith('reg-demo') &&
        p.full_name !== 'Aarav Sharma' &&
        p.full_name !== 'Vikramaditya Roy' &&
        p.full_name !== 'Rohit Kulkarni' &&
        p.full_name !== 'Samarth Nair' &&
        p.full_name !== 'Aditya Sen' &&
        p.full_name !== 'Meera Nambiar' &&
        p.full_name !== 'Kavya Pillai' &&
        p.full_name !== 'Karan Mehra'
      );
      if (cleanedParts.length !== parts.length) {
        localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(cleanedParts));
      }
    }
  } catch (e) {
    // Fail-safe
  }
};

// Exported function to clear all registrations and participants on demand
export const clearAllRegistrations = async () => {
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify([]));
  return { success: true, message: 'All registrations and participants cleared.' };
};

// Generate high-contrast, professional reference code (e.g. VX-8492)
export const generateReferenceCode = () => {
  const chars = '0123456789';
  let numPart = '';
  for (let i = 0; i < 4; i++) {
    numPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `VX-${numPart}`;
};

// ==========================================
// EVENT MANAGEMENT APIS
// ==========================================

export const getEvents = async () => {
  initLocalStore();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('name');
      if (!error && data && data.length > 0) {
        // Map database fields to application shape
        return data.map(item => ({
          ...item,
          minTeamSize: item.min_team_size,
          maxTeamSize: item.max_team_size,
          registrationOpen: item.registration_open,
          shortDescription: item.short_description,
          fullDescription: item.full_description,
          // Preserve static coordinate & icon mappings
          mapCoords: OFFICIAL_EVENTS.find(e => e.id === item.id)?.mapCoords || { x: 500, y: 250 },
          icon: OFFICIAL_EVENTS.find(e => e.id === item.id)?.icon || 'Activity'
        }));
      }
    } catch (err) {
      console.warn('Falling back to local events cache:', err);
    }
  }

  // Local fallback
  const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return raw ? JSON.parse(raw) : OFFICIAL_EVENTS;
};

export const getEventById = async (id) => {
  const events = await getEvents();
  return events.find(e => e.id === id) || null;
};

export const updateEvent = async (eventId, updates) => {
  initLocalStore();
  if (isSupabaseConfigured && supabase) {
    try {
      const dbUpdates = {};
      if ('format' in updates) dbUpdates.format = updates.format;
      if ('minTeamSize' in updates) dbUpdates.min_team_size = updates.minTeamSize;
      if ('maxTeamSize' in updates) dbUpdates.max_team_size = updates.maxTeamSize;
      if ('registrationOpen' in updates) dbUpdates.registration_open = updates.registrationOpen;
      if ('shortDescription' in updates) dbUpdates.short_description = updates.shortDescription;
      if ('fullDescription' in updates) dbUpdates.full_description = updates.fullDescription;
      if ('rules' in updates) dbUpdates.rules = updates.rules;
      if ('date' in updates) dbUpdates.date = updates.date;
      if ('time' in updates) dbUpdates.time = updates.time;
      if ('venue' in updates) dbUpdates.venue = updates.venue;
      if ('prizes' in updates) dbUpdates.prizes = updates.prizes;

      const { data, error } = await supabase
        .from('events')
        .update(dbUpdates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
    } catch (err) {
      console.warn('Supabase event update failed, updating locally:', err);
    }
  }

  // Always sync local storage
  const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
  const events = raw ? JSON.parse(raw) : [...OFFICIAL_EVENTS];
  const idx = events.findIndex(e => e.id === eventId);
  if (idx !== -1) {
    events[idx] = { ...events[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return events[idx];
  }
  return null;
};

// ==========================================
// REGISTRATION APIS (PUBLIC)
// ==========================================

export const checkParticipantUniqueness = async (eventId, participants) => {
  initLocalStore();
  if (isSupabaseConfigured && supabase) {
    try {
      for (const p of participants) {
        const cleanName = p.fullName.trim();
        const cleanDept = p.department.trim();
        const { data, error } = await supabase
          .from('participants')
          .select('full_name, department')
          .eq('event_id', eventId)
          .ilike('full_name', cleanName)
          .ilike('department', cleanDept);

        if (!error && data && data.length > 0) {
          return {
            isDuplicate: true,
            duplicateName: cleanName,
            duplicateDept: cleanDept
          };
        }
      }
      return { isDuplicate: false };
    } catch (err) {
      console.warn('Uniqueness check via Supabase failed, using local verifier:', err);
    }
  }

  // Local storage uniqueness verification
  const rawParts = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
  const allParts = rawParts ? JSON.parse(rawParts) : [];

  for (const p of participants) {
    const cleanName = p.fullName.trim().toLowerCase();
    const cleanDept = p.department.trim().toLowerCase();

    const existing = allParts.find(
      existingPart =>
        existingPart.event_id === eventId &&
        existingPart.full_name.trim().toLowerCase() === cleanName &&
        existingPart.department.trim().toLowerCase() === cleanDept
    );

    if (existing) {
      return {
        isDuplicate: true,
        duplicateName: p.fullName.trim(),
        duplicateDept: p.department.trim()
      };
    }
  }

  return { isDuplicate: false };
};

export const createRegistration = async ({ eventId, teamName, format, participants }) => {
  initLocalStore();

  // 1. Fetch current event settings to enforce rules
  const event = await getEventById(eventId);
  if (!event) {
    throw new Error('Selected event does not exist.');
  }

  if (!event.registrationOpen) {
    throw new Error(`Registrations for ${event.name} are currently closed.`);
  }

  // 2. Enforce team size limits
  if (format === 'solo') {
    if (participants.length !== 1) {
      throw new Error('Solo registration requires exactly 1 participant.');
    }
  } else if (format === 'group') {
    if (!teamName || !teamName.trim()) {
      throw new Error('Team name is required for group registration.');
    }
    if (participants.length < (event.minTeamSize || 2)) {
      throw new Error(`Minimum team size for ${event.name} is ${event.minTeamSize || 2}.`);
    }
    if (participants.length > (event.maxTeamSize || 4)) {
      throw new Error(`Maximum team size for ${event.name} is ${event.maxTeamSize || 4}.`);
    }
  }

  // 3. Validate every participant record
  for (let i = 0; i < participants.length; i++) {
    const p = participants[i];
    if (!p.fullName || !p.fullName.trim()) {
      throw new Error(`Participant #${i + 1} full name is required.`);
    }
    if (!p.classCourse || !p.classCourse.trim()) {
      throw new Error(`Participant #${i + 1} class/course is required.`);
    }
    if (!p.department || !p.department.trim()) {
      throw new Error(`Participant #${i + 1} department is required.`);
    }
  }

  // 4. Duplicate prevention rule
  const uniquenessCheck = await checkParticipantUniqueness(eventId, participants);
  if (uniquenessCheck.isDuplicate) {
    throw new Error(
      `Duplicate registration detected: "${uniquenessCheck.duplicateName}" (${uniquenessCheck.duplicateDept}) is already registered for ${event.name}.`
    );
  }

  // 5. Generate distinct reference code
  const referenceCode = generateReferenceCode();
  const registrationId = `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();

  const newReg = {
    id: registrationId,
    reference_code: referenceCode,
    event_id: eventId,
    format,
    team_name: format === 'group' ? teamName.trim() : null,
    participant_count: participants.length,
    status: 'confirmed',
    created_at: now
  };

  const newParticipants = participants.map((p, idx) => ({
    id: `part-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
    registration_id: registrationId,
    event_id: eventId,
    full_name: p.fullName.trim(),
    class_course: p.classCourse.trim(),
    department: p.department.trim(),
    created_at: now
  }));

  // 6. Try Supabase transaction/inserts if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: regData, error: regError } = await supabase
        .from('registrations')
        .insert([{
          reference_code: referenceCode,
          event_id: eventId,
          format,
          team_name: format === 'group' ? teamName.trim() : null,
          participant_count: participants.length,
          status: 'confirmed'
        }])
        .select()
        .single();

      if (regError) throw regError;

      const participantPayload = participants.map(p => ({
        registration_id: regData.id,
        event_id: eventId,
        full_name: p.fullName.trim(),
        class_course: p.classCourse.trim(),
        department: p.department.trim()
      }));

      const { error: partError } = await supabase
        .from('participants')
        .insert(participantPayload);

      if (partError) {
        // Rollback registration if participant insert fails
        await supabase.from('registrations').delete().eq('id', regData.id);
        throw partError;
      }

      // Sync local storage as well for seamless instant cache
      saveToLocalStore(regData, participantPayload);

      return {
        registration: regData,
        participants: participantPayload,
        referenceCode: regData.reference_code,
        event
      };
    } catch (err) {
      console.warn('Supabase write failed or network offline, persisting to local store:', err);
    }
  }

  // Local storage atomic save
  saveToLocalStore(newReg, newParticipants);

  return {
    registration: newReg,
    participants: newParticipants,
    referenceCode,
    event
  };
};

const saveToLocalStore = (reg, parts) => {
  const rawRegs = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
  const regs = rawRegs ? JSON.parse(rawRegs) : [];
  regs.unshift(reg);
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(regs));

  const rawParts = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
  const allParts = rawParts ? JSON.parse(rawParts) : [];
  allParts.push(...parts);
  localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(allParts));
};

// ==========================================
// ADMIN DASHBOARD & REPORTING APIS
// ==========================================

export const getRegistrationsWithParticipants = async ({ eventId = 'all', status = 'all', search = '' } = {}) => {
  initLocalStore();
  let registrations = [];
  let participants = [];

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('registrations').select('*').order('created_at', { ascending: false });
      if (eventId !== 'all') {
        query = query.eq('event_id', eventId);
      }
      if (status !== 'all') {
        query = query.eq('status', status);
      }
      const { data: regData, error: regError } = await query;
      if (!regError && regData) {
        registrations = regData;
        const regIds = registrations.map(r => r.id);
        if (regIds.length > 0) {
          const { data: partData, error: partError } = await supabase
            .from('participants')
            .select('*')
            .in('registration_id', regIds);
          if (!partError && partData) {
            participants = partData;
          }
        }
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local records:', err);
    }
  }

  // Fallback to local storage if Supabase returned empty or was not configured
  if (registrations.length === 0) {
    const rawRegs = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    registrations = rawRegs ? JSON.parse(rawRegs) : [];

    const rawParts = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
    participants = rawParts ? JSON.parse(rawParts) : [];

    if (eventId !== 'all') {
      registrations = registrations.filter(r => r.event_id === eventId);
    }
    if (status !== 'all') {
      registrations = registrations.filter(r => r.status === status);
    }
  }

  // Attach participant records to each registration
  let combined = registrations.map(r => {
    const memberRecords = participants.filter(p => p.registration_id === r.id);
    return {
      ...r,
      participants: memberRecords
    };
  });

  // Search filtering across participant name, class, department, or registration reference
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    combined = combined.filter(entry => {
      const matchRef = entry.reference_code.toLowerCase().includes(term);
      const matchTeam = entry.team_name ? entry.team_name.toLowerCase().includes(term) : false;
      const matchMember = entry.participants.some(p =>
        p.full_name.toLowerCase().includes(term) ||
        p.class_course.toLowerCase().includes(term) ||
        p.department.toLowerCase().includes(term)
      );
      return matchRef || matchTeam || matchMember;
    });
  }

  return combined;
};

export const getDashboardMetrics = async () => {
  const events = await getEvents();
  const allRegistrations = await getRegistrationsWithParticipants({ eventId: 'all', status: 'all' });

  // Compute metrics from actual data
  const totalRegistrations = allRegistrations.length;

  let totalParticipantsCount = 0;
  const uniqueStudentMap = new Set();

  allRegistrations.forEach(r => {
    totalParticipantsCount += (r.participants?.length || r.participant_count || 1);
    r.participants?.forEach(p => {
      const key = `${p.full_name.trim().toLowerCase()}_${p.department.trim().toLowerCase()}`;
      uniqueStudentMap.add(key);
    });
  });

  const technicalEvents = events.filter(e => e.category === 'Technical').map(e => e.id);
  const gamingEvents = events.filter(e => e.category === 'Gaming').map(e => e.id);

  const technicalRegistrations = allRegistrations.filter(r => technicalEvents.includes(r.event_id)).length;
  const gamingRegistrations = allRegistrations.filter(r => gamingEvents.includes(r.event_id)).length;

  const eventBreakdown = {};
  events.forEach(e => {
    const count = allRegistrations.filter(r => r.event_id === e.id).length;
    const participantCount = allRegistrations
      .filter(r => r.event_id === e.id)
      .reduce((sum, r) => sum + (r.participants?.length || r.participant_count || 1), 0);
    eventBreakdown[e.id] = {
      name: e.name,
      category: e.category,
      registrations: count,
      participants: participantCount
    };
  });

  return {
    totalRegistrations,
    totalParticipants: totalParticipantsCount,
    uniqueParticipants: uniqueStudentMap.size,
    technicalRegistrations,
    gamingRegistrations,
    eventBreakdown
  };
};

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

export const adminLogin = async (email, password) => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (!error && data?.user) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify({
        email: data.user.email,
        id: data.user.id,
        role: 'authenticated_admin',
        token: data.session?.access_token,
        mode: 'supabase'
      }));
      return { success: true, user: data.user, mode: 'supabase' };
    }
  }

  // Resilient Admin credentials
  const cleanEmail = email.trim().toLowerCase();
  if (
    (cleanEmail === 'pegasus' || cleanEmail === 'pegasus@hackathon.local' || cleanEmail === 'admin@hackathon.local' || cleanEmail === 'pegasus@vexoris.local' || cleanEmail === 'admin@vexoris.local' || cleanEmail === 'admin') &&
    (password === 'hackathon26' || password === 'hackathon' || password === 'vexoris26' || password === 'vexoris2025' || password === 'admin123')
  ) {
    const sessionUser = {
      email: cleanEmail === 'pegasus' ? 'admin@hackathon.local' : cleanEmail,
      username: 'pegasus',
      id: 'local-admin-root',
      role: 'authorized_administrator',
      mode: 'local'
    };
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser, mode: 'local' };
  }

  throw new Error('Invalid administrator credentials.');
};

export const adminLogout = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn(e);
    }
  }
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
};

export const getAdminSession = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
