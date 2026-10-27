import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  UserCheck, 
  Download, 
  Settings, 
  LogOut, 
  Search, 
  Printer, 
  RefreshCw, 
  MoreVertical, 
  ChevronDown, 
  CheckCircle, 
  Clock, 
  Edit3, 
  Save, 
  X,
  Terminal,
  Gamepad2,
  ArrowLeft,
  ExternalLink,
  Building2
} from 'lucide-react';
import { 
  getAdminSession, 
  adminLogout, 
  getEvents, 
  updateEvent, 
  getDashboardMetrics, 
  getRegistrationsWithParticipants,
  clearAllRegistrations
} from '../lib/db';
import PrintRosterModal from '../components/PrintRosterModal';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => getAdminSession());

  // Redirect if not authenticated
  useEffect(() => {
    if (!session) {
      navigate('/admin/login');
    }
  }, [session, navigate]);

  // Active Sidebar View: 'dashboard' | 'events' | 'registrations' | 'participants' | 'export' | 'settings'
  const [activeNav, setActiveNav] = useState('dashboard');

  // Data state
  const [metrics, setMetrics] = useState(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Event Editing
  const [editingEventId, setEditingEventId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  // Fetch metrics & records (Always load complete dataset for instant client filtering & analytics)
  const loadData = async () => {
    setLoading(true);
    try {
      const [m, evts, regs] = await Promise.all([
        getDashboardMetrics(),
        getEvents(),
        getRegistrationsWithParticipants({
          eventId: 'all',
          status: 'all',
          search: ''
        })
      ]);
      setMetrics(m);
      setEvents(evts);
      setRegistrations(regs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, []);

  // =========================================================================
  // DEPARTMENT SEGREGATION & ANALYTICS COMPUTATION
  // =========================================================================
  const departmentStats = useMemo(() => {
    const stats = {};
    registrations.forEach(reg => {
      const eventObj = events.find(e => e.id === reg.event_id);
      const eventName = eventObj ? eventObj.name : reg.event_id;
      (reg.participants || []).forEach(p => {
        const dept = (p.department || 'General').trim();
        if (!stats[dept]) {
          stats[dept] = {
            name: dept,
            totalParticipants: 0,
            registrationsCount: 0,
            events: {}
          };
        }
        stats[dept].totalParticipants += 1;
        stats[dept].events[eventName] = (stats[dept].events[eventName] || 0) + 1;
      });
    });
    return stats;
  }, [registrations, events]);

  const departmentList = useMemo(() => {
    return Object.keys(departmentStats).sort((a, b) => 
      departmentStats[b].totalParticipants - departmentStats[a].totalParticipants
    );
  }, [departmentStats]);

  const totalParticipantsAcrossDepts = useMemo(() => {
    return Object.values(departmentStats).reduce((acc, curr) => acc + curr.totalParticipants, 0);
  }, [departmentStats]);

  // Filtered registrations for Table, Print, and CSV export
  const displayRegistrations = useMemo(() => {
    return registrations.filter(reg => {
      // Event filter
      if (selectedEventId !== 'all' && reg.event_id !== selectedEventId) return false;

      // Department filter
      if (selectedDepartment !== 'all') {
        const matchesDept = (reg.participants || []).some(
          p => (p.department || '').trim().toLowerCase() === selectedDepartment.trim().toLowerCase()
        );
        if (!matchesDept) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const term = searchQuery.trim().toLowerCase();
        const matchRef = reg.reference_code?.toLowerCase().includes(term);
        const matchTeam = reg.team_name?.toLowerCase().includes(term);
        const matchMember = (reg.participants || []).some(
          p => p.full_name?.toLowerCase().includes(term) ||
               p.class_course?.toLowerCase().includes(term) ||
               p.department?.toLowerCase().includes(term)
        );
        return matchRef || matchTeam || matchMember;
      }

      return true;
    });
  }, [registrations, selectedEventId, selectedDepartment, searchQuery]);

  // Filtered participants list for Participants view
  const filteredParticipants = useMemo(() => {
    const list = [];
    registrations.forEach(r => {
      (r.participants || []).forEach(p => {
        if (selectedDepartment !== 'all') {
          if ((p.department || '').trim().toLowerCase() !== selectedDepartment.trim().toLowerCase()) {
            return;
          }
        }
        if (selectedEventId !== 'all' && r.event_id !== selectedEventId) {
          return;
        }
        if (searchQuery.trim()) {
          const term = searchQuery.trim().toLowerCase();
          const match = p.full_name?.toLowerCase().includes(term) ||
                        p.class_course?.toLowerCase().includes(term) ||
                        p.department?.toLowerCase().includes(term);
          if (!match) return;
        }
        list.push({ ...p, event_id: r.event_id });
      });
    });
    return list;
  }, [registrations, selectedDepartment, selectedEventId, searchQuery]);

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  // CSV Export
  const handleExportCSV = () => {
    if (displayRegistrations.length === 0) {
      alert('No registrations available to export with current filters.');
      return;
    }

    const headers = [
      'Reference Code',
      'Event Name',
      'Category',
      'Format',
      'Team Name',
      'Participant Name',
      'Class/Course',
      'Department',
      'Status',
      'Registration Timestamp'
    ];

    const rows = [];
    displayRegistrations.forEach(reg => {
      const eventName = events.find(e => e.id === reg.event_id)?.name || reg.event_id;
      const category = events.find(e => e.id === reg.event_id)?.category || 'General';

      if (reg.participants && reg.participants.length > 0) {
        reg.participants.forEach(p => {
          rows.push([
            `"${reg.reference_code}"`,
            `"${eventName}"`,
            `"${category}"`,
            `"${reg.format}"`,
            `"${reg.team_name || 'N/A'}"`,
            `"${p.full_name}"`,
            `"${p.class_course}"`,
            `"${p.department}"`,
            `"${reg.status}"`,
            `"${new Date(reg.created_at).toLocaleString()}"`
          ]);
        });
      } else {
        rows.push([
          `"${reg.reference_code}"`,
          `"${eventName}"`,
          `"${category}"`,
          `"${reg.format}"`,
          `"${reg.team_name || 'N/A'}"`,
          `"N/A"`,
          `"N/A"`,
          `"N/A"`,
          `"${reg.status}"`,
          `"${new Date(reg.created_at).toLocaleString()}"`
        ]);
      }
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HACKATHON_Registrations_${selectedEventId}_${selectedDepartment}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Event editing handlers
  const startEdit = (ev) => {
    setEditingEventId(ev.id);
    setEditForm({
      ...ev,
      rulesText: (ev.rules || []).join('\n')
    });
  };

  const saveEdit = async () => {
    if (!editForm) return;
    try {
      const updatedRules = editForm.rulesText
        ? editForm.rulesText.split('\n').map(r => r.trim()).filter(Boolean)
        : editForm.rules;

      await updateEvent(editingEventId, {
        format: editForm.format,
        minTeamSize: parseInt(editForm.minTeamSize, 10) || 1,
        maxTeamSize: parseInt(editForm.maxTeamSize, 10) || 1,
        registrationOpen: editForm.registrationOpen,
        shortDescription: editForm.shortDescription,
        rules: updatedRules,
        venue: editForm.venue,
        date: editForm.date
      });

      setEditingEventId(null);
      await loadData();
    } catch (err) {
      alert('Error updating event: ' + err.message);
    }
  };

  if (!session) return null;

  // Selected event for print / table view
  const currentEvent = selectedEventId === 'all' 
    ? (events.find(e => e.id === 'nfs') || events[0] || null) 
    : events.find(e => e.id === selectedEventId);

  // Group events into Technical and Gaming
  const techEvents = events.filter(e => e.category === 'Technical');
  const gamingEvents = events.filter(e => e.category === 'Gaming');

  // Compute maximum count for bar width scaling
  const maxBarValue = metrics?.eventBreakdown
    ? Math.max(...Object.values(metrics.eventBreakdown).map(b => b.registrations), 10)
    : 100;

  return (
    <div className="min-h-screen bg-[#0B0D11] text-ivory flex">
      
      {/* =========================================================================
          PANEL 9 SIDEBAR: VEXORIS LOGO + NAVIGATION MENU
      ========================================================================= */}
      <aside className="w-64 bg-[#0E121A] border-r border-[#1B2230] flex flex-col justify-between shrink-0 hidden md:flex">
        
        <div>
          {/* Logo with Gold Crown */}
          <div className="p-6 border-b border-[#1B2230] flex items-center gap-2">
            <svg 
              viewBox="0 0 24 24" 
              className="w-5 h-5 text-amber-400 fill-amber-400/90 -rotate-6" 
              aria-hidden="true"
            >
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
            <span className="font-heading font-black text-xl tracking-[0.2em] text-ivory">
              HACKATHON
            </span>
          </div>

          {/* Navigation Links matching Panel 9 */}
          <nav className="p-3 space-y-1">
            <button
              type="button"
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                activeNav === 'dashboard'
                  ? 'bg-red/15 text-red border border-red/40 shadow-sm'
                  : 'text-muted hover:text-ivory hover:bg-[#141924]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('events')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                activeNav === 'events'
                  ? 'bg-red/15 text-red border border-red/40 shadow-sm'
                  : 'text-muted hover:text-ivory hover:bg-[#141924]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Events</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('registrations')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                activeNav === 'registrations'
                  ? 'bg-red/15 text-red border border-red/40 shadow-sm'
                  : 'text-muted hover:text-ivory hover:bg-[#141924]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registrations</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('participants')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                activeNav === 'participants'
                  ? 'bg-red/15 text-red border border-red/40 shadow-sm'
                  : 'text-muted hover:text-ivory hover:bg-[#141924]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Participants</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-muted hover:text-ivory hover:bg-[#141924] transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('settings')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                activeNav === 'settings'
                  ? 'bg-red/15 text-red border border-red/40 shadow-sm'
                  : 'text-muted hover:text-ivory hover:bg-[#141924]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Back to Website & Logout */}
        <div className="p-4 border-t border-[#1B2230] space-y-1">
          <Link
            to="/"
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-cyan" />
            <span>Public Website</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-muted hover:text-red hover:bg-red/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* =========================================================================
          MAIN CONTENT AREA (PANELS 9 & 10)
      ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar matching Panel 9 */}
        <header className="h-16 bg-[#0E121A] border-b border-[#1B2230] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Nav Pills */}
            <div className="flex md:hidden items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveNav('dashboard')}
                className={`px-2.5 py-1 text-[11px] font-heading font-bold uppercase rounded ${activeNav === 'dashboard' ? 'bg-red text-white' : 'text-muted'}`}
              >
                Dash
              </button>
              <button
                type="button"
                onClick={() => setActiveNav('registrations')}
                className={`px-2.5 py-1 text-[11px] font-heading font-bold uppercase rounded ${activeNav === 'registrations' ? 'bg-red text-white' : 'text-muted'}`}
              >
                Regs
              </button>
              <button
                type="button"
                onClick={() => setActiveNav('events')}
                className={`px-2.5 py-1 text-[11px] font-heading font-bold uppercase rounded ${activeNav === 'events' ? 'bg-red text-white' : 'text-muted'}`}
              >
                Events
              </button>
              <Link
                to="/"
                className="px-2.5 py-1 text-[11px] font-heading font-bold uppercase rounded text-cyan hover:bg-cyan/10"
              >
                Site
              </Link>
            </div>
            <span className="text-xs font-mono text-muted hidden sm:inline">
              Mode: <strong className="text-cyan">{session.mode === 'supabase' ? 'PostgreSQL Live' : 'Local Atomic DB'}</strong>
            </span>
          </div>

          {/* User Profile Pill & Quick Actions matching Panel 9: Admin ▼ */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#141924] hover:bg-[#1C2332] border border-[#202838] hover:border-cyan/40 rounded-full text-xs font-heading font-bold text-slate-300 hover:text-white transition-all"
              title="Return to Public Festival Website"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan" />
              <span>Exit to Website</span>
            </Link>

            <button
              type="button"
              onClick={loadData}
              className="p-1.5 text-muted hover:text-ivory rounded hover:bg-[#171D27] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan' : ''}`} />
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141924] border border-[#202838] rounded-full">
              <div className="w-6 h-6 rounded-full bg-cyan/20 border border-cyan/40 flex items-center justify-center text-[11px] font-bold text-cyan">
                A
              </div>
              <span className="text-xs font-heading font-bold text-ivory">Admin</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted" />
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          
          {/* =====================================================================
              VIEW 1: DASHBOARD OVERVIEW (MATCHING BLUEPRINT PANEL 9)
          ===================================================================== */}
          {activeNav === 'dashboard' && metrics && (
            <div className="space-y-8 max-w-6xl">
              
              {/* Header Title & Subtitle */}
              <div>
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-ivory tracking-tight uppercase">
                  Dashboard
                </h1>
                <p className="text-muted text-xs sm:text-sm font-sans mt-0.5 font-medium">
                  Overview of event registrations
                </p>
              </div>

              {/* 3 Overview Metric Cards matching Panel 9 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                
                {/* 1. Total Events */}
                <div className="bg-[#121622] border border-[#1E2536] rounded-xl p-6 shadow-lg">
                  <div className="font-heading font-black text-4xl sm:text-5xl text-ivory tracking-tight mb-2">
                    {events.length || 9}
                  </div>
                  <div className="text-xs font-heading font-bold uppercase tracking-wider text-muted">
                    Total Events
                  </div>
                </div>

                {/* 2. Total Registrations */}
                <div className="bg-[#121622] border border-[#1E2536] rounded-xl p-6 shadow-lg">
                  <div className="font-heading font-black text-4xl sm:text-5xl text-cyan tracking-tight mb-2">
                    {metrics.totalRegistrations}
                  </div>
                  <div className="text-xs font-heading font-bold uppercase tracking-wider text-muted">
                    Total Registrations
                  </div>
                </div>

                {/* 3. Total Participants */}
                <div className="bg-[#121622] border border-[#1E2536] rounded-xl p-6 shadow-lg">
                  <div className="font-heading font-black text-4xl sm:text-5xl text-red tracking-tight mb-2">
                    {metrics.uniqueParticipants}
                  </div>
                  <div className="text-xs font-heading font-bold uppercase tracking-wider text-muted">
                    Total Participants
                  </div>
                </div>

              </div>

              {/* Category Breakdown Badges matching Panel 9 */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="px-4 py-2.5 bg-[#121622] border border-cyan/40 rounded-lg flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-cyan" />
                  <span className="font-heading font-black text-base text-cyan">
                    {techEvents.length || 5}
                  </span>
                  <span className="text-xs font-heading font-bold text-ivory uppercase tracking-wider">
                    Technical Events
                  </span>
                </div>

                <div className="px-4 py-2.5 bg-[#121622] border border-red/40 rounded-lg flex items-center gap-2.5">
                  <Gamepad2 className="w-4 h-4 text-red" />
                  <span className="font-heading font-black text-base text-red">
                    {gamingEvents.length || 4}
                  </span>
                  <span className="text-xs font-heading font-bold text-ivory uppercase tracking-wider">
                    Gaming Events
                  </span>
                </div>
              </div>

              {/* EVENT-WISE REGISTRATIONS (HORIZONTAL PROGRESS BARS - PANEL 9) */}
              <div className="bg-[#121622] border border-[#1E2536] rounded-xl p-6 sm:p-8 shadow-xl">
                <h2 className="font-heading font-black text-lg text-ivory uppercase tracking-wider mb-6">
                  Event-wise Registrations
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  
                  {/* LEFT COLUMN: TECHNICAL EVENTS (CYAN BARS) */}
                  <div className="space-y-4">
                    {techEvents.map((ev) => {
                      const count = metrics.eventBreakdown?.[ev.id]?.registrations || 0;
                      const percentage = Math.min(Math.max((count / maxBarValue) * 100, 15), 100);

                      return (
                        <div key={ev.id} className="flex items-center gap-4 text-xs font-heading font-bold">
                          <span className="w-24 text-muted truncate text-right">
                            {ev.name}
                          </span>

                          <div className="flex-1 bg-[#1A2030] h-4 rounded-full overflow-hidden">
                            <div 
                              className="bg-cyan h-full rounded-full transition-all duration-500" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          <span className="w-8 font-mono text-ivory text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* RIGHT COLUMN: GAMING EVENTS (PINK/MAGENTA BARS) */}
                  <div className="space-y-4">
                    {gamingEvents.map((ev) => {
                      const count = metrics.eventBreakdown?.[ev.id]?.registrations || 0;
                      const percentage = Math.min(Math.max((count / maxBarValue) * 100, 15), 100);

                      return (
                        <div key={ev.id} className="flex items-center gap-4 text-xs font-heading font-bold">
                          <span className="w-24 text-muted truncate text-right">
                            {ev.name}
                          </span>

                          <div className="flex-1 bg-[#1A2030] h-4 rounded-full overflow-hidden">
                            <div 
                              className="bg-red h-full rounded-full transition-all duration-500" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          <span className="w-8 font-mono text-ivory text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* =========================================================================
                  DEPARTMENT-WISE SEGREGATION & ANALYSIS FEATURE
              ========================================================================= */}
              <div className="bg-[#121622] border border-[#1E2536] rounded-xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2536]">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-5 h-5 text-cyan" />
                    <div>
                      <h2 className="font-heading font-black text-lg text-ivory uppercase tracking-wider">
                        Department-wise Segregation
                      </h2>
                      <p className="text-muted text-xs font-sans mt-0.5">
                        Analyze registration counts and event preferences segregated by academic department.
                      </p>
                    </div>
                  </div>

                  {/* Department Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted uppercase">Select Dept:</span>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="px-3.5 py-2 bg-[#141924] border border-[#202838] rounded-lg text-xs font-heading font-bold text-ivory uppercase focus:outline-none focus:border-cyan"
                    >
                      <option value="all">All Departments ({departmentList.length} depts • {totalParticipantsAcrossDepts} students)</option>
                      {departmentList.map(dept => (
                        <option key={dept} value={dept}>
                          {dept} ({departmentStats[dept].totalParticipants} registered)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Active Selected Department Spotlight Card */}
                {selectedDepartment !== 'all' && departmentStats[selectedDepartment] ? (
                  <div className="p-5 bg-[#0E131E] rounded-xl border border-cyan/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan font-bold block">
                          SELECTED DEPARTMENT SPOTLIGHT
                        </span>
                        <h3 className="font-heading font-black text-xl sm:text-2xl text-ivory uppercase tracking-wide">
                          {selectedDepartment}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-cyan/15 border border-cyan/40 rounded-lg text-center">
                          <span className="font-heading font-black text-2xl text-cyan block leading-none">
                            {departmentStats[selectedDepartment].totalParticipants}
                          </span>
                          <span className="text-[10px] font-mono text-slate-300 uppercase font-bold mt-1 block">
                            Total Participants
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedDepartment('all')}
                          className="p-2 text-muted hover:text-ivory rounded bg-white/5 hover:bg-white/10 text-xs font-heading"
                          title="Reset department filter"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Event distribution inside this selected department */}
                    <div>
                      <span className="text-xs font-mono text-muted uppercase font-bold block mb-2.5">
                        Event Registrations in {selectedDepartment}:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {Object.entries(departmentStats[selectedDepartment].events).map(([eventName, count]) => (
                          <div key={eventName} className="p-3 bg-[#131824] rounded-lg border border-[#202838] flex items-center justify-between">
                            <span className="font-heading font-bold text-xs text-ivory truncate">{eventName}</span>
                            <span className="font-mono text-xs font-bold text-cyan bg-cyan/15 px-2 py-0.5 rounded">
                              {count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Grid of all departments */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {departmentList.length === 0 ? (
                      <div className="col-span-full py-8 text-center text-muted text-xs font-mono">
                        No department registrations recorded yet.
                      </div>
                    ) : (
                      departmentList.map(dept => {
                        const d = departmentStats[dept];
                        const percent = totalParticipantsAcrossDepts > 0 
                          ? Math.round((d.totalParticipants / totalParticipantsAcrossDepts) * 100) 
                          : 0;

                        return (
                          <button
                            key={dept}
                            type="button"
                            onClick={() => setSelectedDepartment(dept)}
                            className="p-4 bg-[#0E131E] hover:bg-[#141A28] border border-[#1E2536] hover:border-cyan/50 rounded-xl text-left transition-all group space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-heading font-bold text-sm text-ivory group-hover:text-cyan transition-colors">
                                {dept}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-cyan/15 text-cyan font-mono text-xs font-bold">
                                {d.totalParticipants}
                              </span>
                            </div>

                            {/* Mini progress bar */}
                            <div className="w-full bg-[#1A2030] h-1.5 rounded-full overflow-hidden">
                              <div className="bg-cyan h-full rounded-full" style={{ width: `${Math.max(percent, 8)}%` }} />
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                              <span>{Object.keys(d.events).length} arena(s) entered</span>
                              <span>{percent}% of students</span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* =====================================================================
              VIEW 2: REGISTRATIONS LIST TABLE (MATCHING BLUEPRINT PANEL 10)
          ===================================================================== */}
          {activeNav === 'registrations' && (
            <div className="space-y-6 max-w-6xl">
              
              {/* Header Title with Active Count */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading font-black text-2xl sm:text-3xl text-ivory tracking-tight uppercase">
                    {currentEvent ? currentEvent.name : 'ALL EVENTS'} — Registrations ({displayRegistrations.length})
                  </h1>
                  <p className="text-muted text-xs font-sans mt-0.5">
                    Official verified entries and team rosters{selectedDepartment !== 'all' ? ` for ${selectedDepartment}` : ''}.
                  </p>
                </div>

                {/* Event & Department Filter Selectors */}
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="px-3.5 py-2 bg-[#141924] border border-[#202838] rounded-lg text-xs font-heading font-bold text-ivory uppercase focus:outline-none focus:border-cyan"
                  >
                    <option value="all">All Events ({events.length})</option>
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.name} ({ev.category})</option>
                    ))}
                  </select>

                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className={`px-3.5 py-2 bg-[#141924] border rounded-lg text-xs font-heading font-bold uppercase focus:outline-none ${
                      selectedDepartment !== 'all' ? 'border-cyan text-cyan' : 'border-[#202838] text-ivory'
                    }`}
                  >
                    <option value="all">All Departments ({departmentList.length})</option>
                    {departmentList.map(dept => (
                      <option key={dept} value={dept}>{dept} ({departmentStats[dept]?.totalParticipants || 0})</option>
                    ))}
                  </select>

                  {selectedDepartment !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setSelectedDepartment('all')}
                      className="px-2 py-1 text-[11px] font-mono text-cyan hover:text-white bg-cyan/15 rounded flex items-center gap-1"
                      title="Clear department filter"
                    >
                      <span>{selectedDepartment}</span>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Action & Search Row matching Panel 10 */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Search Input */}
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, class or department..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#121622] border border-[#1E2536] rounded-lg text-xs text-ivory placeholder-muted focus:outline-none focus:border-cyan transition-colors"
                  />
                </div>

                {/* Red Buttons matching Panel 10: Export CSV & Print List */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-red hover:bg-red/90 text-ivory font-heading font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md"
                  >
                    Export CSV
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPrintModal(true)}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-red/90 hover:bg-red text-ivory font-heading font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md"
                  >
                    Print List
                  </button>
                </div>

              </div>

              {/* Data Table matching Panel 10: # | Team Name | Participants | Class / Department | Status | ... */}
              <div className="bg-[#121622] border border-[#1E2536] rounded-xl overflow-hidden shadow-xl">
                {displayRegistrations.length === 0 ? (
                  <div className="p-12 text-center text-muted text-xs">
                    No registrations found matching this filter query.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead>
                        <tr className="border-b border-[#1E2536] bg-[#0E121A] text-muted font-heading font-bold uppercase text-[11px] tracking-wider">
                          <th className="py-3 px-4 w-12">#</th>
                          <th className="py-3 px-4">Team Name</th>
                          <th className="py-3 px-4">Participants</th>
                          <th className="py-3 px-4">Class / Department</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 w-10 text-center">...</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#171D2A]">
                        {displayRegistrations.map((reg, index) => {
                          const primaryMember = reg.participants?.[0];
                          const classDept = primaryMember 
                            ? `${primaryMember.class_course} / ${primaryMember.department}`
                            : '—';
                          const participantCount = reg.participants?.length || reg.participant_count || 1;

                          return (
                            <tr key={reg.id} className="hover:bg-[#151B28] transition-colors">
                              <td className="py-3.5 px-4 font-mono text-muted">
                                {index + 1}
                              </td>

                              <td className="py-3.5 px-4 font-heading font-bold text-ivory">
                                {reg.team_name || (reg.format === 'solo' ? primaryMember?.full_name : 'Team Entry')}
                              </td>

                              <td className="py-3.5 px-4 font-mono text-cyan">
                                {participantCount}
                              </td>

                              <td className="py-3.5 px-4 text-muted truncate max-w-xs font-medium">
                                {classDept}
                              </td>

                              <td className="py-3.5 px-4">
                                <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-heading font-bold uppercase ${
                                  reg.status === 'confirmed'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                }`}>
                                  {reg.status || 'Confirmed'}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-center text-muted hover:text-ivory cursor-pointer">
                                <MoreVertical className="w-4 h-4 mx-auto" />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* =====================================================================
              VIEW 3: EVENTS MANAGEMENT (Configurable Formats & Open/Close)
          ===================================================================== */}
          {activeNav === 'events' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-ivory tracking-tight uppercase">
                  Events Directory Configuration
                </h1>
                <p className="text-muted text-xs font-sans mt-0.5">
                  Configure format (Solo / Group), team size constraints, and registration gates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {events.map((ev) => {
                  const isEditing = editingEventId === ev.id;
                  const isTech = ev.category === 'Technical';

                  return (
                    <div key={ev.id} className="bg-[#121622] border border-[#1E2536] rounded-xl p-5 shadow-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          isTech ? 'bg-cyan/15 text-cyan' : 'bg-red/15 text-red'
                        }`}>
                          {ev.badge || ev.category}
                        </span>

                        <span className={`text-[11px] font-mono font-bold uppercase ${
                          ev.registrationOpen ? 'text-cyan' : 'text-muted'
                        }`}>
                          ● {ev.registrationOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-heading font-black text-lg text-ivory uppercase">
                          {ev.name}
                        </h3>
                        <p className="text-muted text-xs line-clamp-2 mt-1">
                          {ev.shortDescription}
                        </p>
                      </div>

                      {isEditing ? (
                        <div className="space-y-3 pt-3 border-t border-[#1C2331] text-xs">
                          <div>
                            <label className="block text-muted text-[10px] uppercase font-mono mb-1">Participation Format</label>
                            <select
                              value={editForm.format}
                              onChange={(e) => setEditForm({ ...editForm, format: e.target.value })}
                              className="w-full px-2.5 py-1.5 bg-[#171D27] border border-[#232C3D] rounded text-ivory"
                            >
                              <option value="solo">Solo Event</option>
                              <option value="group">Group / Team Event</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-ivory cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editForm.registrationOpen}
                                onChange={(e) => setEditForm({ ...editForm, registrationOpen: e.target.checked })}
                                className="rounded"
                              />
                              <span>Registrations Open</span>
                            </label>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              type="button"
                              onClick={saveEdit}
                              className="px-3 py-1.5 bg-cyan text-[#0B0D11] font-heading font-bold uppercase text-[11px] rounded"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingEventId(null)}
                              className="px-3 py-1.5 bg-[#171D27] text-muted font-heading font-bold uppercase text-[11px] rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-3 border-t border-[#1C2331] flex items-center justify-between text-xs">
                          <span className="text-muted font-heading">
                            {ev.format === 'solo' ? 'Solo Event' : `Team (${ev.minTeamSize}-${ev.maxTeamSize})`}
                          </span>

                          <button
                            type="button"
                            onClick={() => startEdit(ev)}
                            className="px-3 py-1 bg-[#171D27] hover:bg-[#202735] text-cyan text-xs font-heading font-bold uppercase rounded flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW 4: UNIQUE PARTICIPANTS ROSTER (WITH DEPARTMENT FILTER)
          ===================================================================== */}
          {activeNav === 'participants' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading font-black text-2xl sm:text-3xl text-ivory tracking-tight uppercase">
                    Registered Participants ({filteredParticipants.length})
                  </h1>
                  <p className="text-muted text-xs font-sans mt-0.5">
                    Individual students enrolled{selectedDepartment !== 'all' ? ` in ${selectedDepartment}` : ' across all events'}.
                  </p>
                </div>

                {/* Department & Event Filter Selectors */}
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="px-3.5 py-2 bg-[#141924] border border-[#202838] rounded-lg text-xs font-heading font-bold text-ivory uppercase focus:outline-none focus:border-cyan"
                  >
                    <option value="all">All Events ({events.length})</option>
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.name}</option>
                    ))}
                  </select>

                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className={`px-3.5 py-2 bg-[#141924] border rounded-lg text-xs font-heading font-bold uppercase focus:outline-none ${
                      selectedDepartment !== 'all' ? 'border-cyan text-cyan' : 'border-[#202838] text-ivory'
                    }`}
                  >
                    <option value="all">All Departments ({departmentList.length})</option>
                    {departmentList.map(dept => (
                      <option key={dept} value={dept}>{dept} ({departmentStats[dept]?.totalParticipants || 0})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-[#121622] border border-[#1E2536] rounded-xl overflow-hidden shadow-xl">
                {filteredParticipants.length === 0 ? (
                  <div className="p-12 text-center text-muted text-xs font-mono">
                    No participants found matching current department or event filter.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead>
                        <tr className="border-b border-[#1E2536] bg-[#0E121A] text-muted font-heading font-bold uppercase text-[11px] tracking-wider">
                          <th className="py-3 px-4 w-12">#</th>
                          <th className="py-3 px-4">Participant Name</th>
                          <th className="py-3 px-4">Class</th>
                          <th className="py-3 px-4">Department</th>
                          <th className="py-3 px-4">Event Registered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#171D2A]">
                        {filteredParticipants.map((p, idx) => (
                          <tr key={idx} className="hover:bg-[#151B28] transition-colors">
                            <td className="py-3 px-4 font-mono text-muted">{idx + 1}</td>
                            <td className="py-3 px-4 font-heading font-bold text-ivory">{p.full_name}</td>
                            <td className="py-3 px-4 text-muted">{p.class_course}</td>
                            <td className="py-3 px-4 text-muted">{p.department}</td>
                            <td className="py-3 px-4 font-mono text-cyan uppercase">{p.event_id}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW 5: SETTINGS & DEPLOYMENT
          ===================================================================== */}
          {activeNav === 'settings' && (
            <div className="space-y-6 max-w-2xl bg-[#121622] border border-[#1E2536] rounded-xl p-6 sm:p-8 shadow-xl">
              <div>
                <h2 className="font-heading font-black text-xl text-ivory uppercase tracking-tight">
                  System Settings & Database Mode
                </h2>
                <p className="text-muted text-xs font-sans mt-1">
                  Database storage configuration and active authentication credentials.
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 bg-[#0C0F16] rounded-lg border border-[#1C2331] space-y-1">
                  <span className="text-muted block text-[10px] uppercase">Storage Engine</span>
                  <div className="text-cyan font-bold">{session.mode === 'supabase' ? 'Supabase Live Connected' : 'Local Atomic Resilient Cache'}</div>
                </div>

                <div className="p-4 bg-[#0C0F16] rounded-lg border border-[#1C2331] space-y-1">
                  <span className="text-muted block text-[10px] uppercase">Logged In Role</span>
                  <div className="text-ivory font-bold">{session.user?.role || 'authorized_administrator'}</div>
                </div>

                <div className="p-4 bg-[#0C0F16] rounded-lg border border-[#1C2331] space-y-1">
                  <span className="text-muted block text-[10px] uppercase">Active User</span>
                  <div className="text-ivory">{session.email}</div>
                </div>

                <div className="p-4 bg-[#0C0F16] rounded-lg border border-red/20 space-y-3">
                  <div>
                    <span className="text-red block text-[10px] uppercase font-bold">Data Management</span>
                    <p className="text-slate-400 text-xs font-sans mt-0.5">Wipe all registrations and reset metrics to zero.</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to permanently clear all registration entries? This action cannot be undone.')) {
                        await clearAllRegistrations();
                        await loadData();
                        alert('All registrations have been cleared.');
                      }
                    }}
                    className="px-4 py-2 bg-red/20 hover:bg-red/30 border border-red/40 text-red text-xs font-heading font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Clear All Registrations
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* =========================================================================
          PRINT ROSTER MODAL (MATCHING BLUEPRINT PANEL 11)
      ========================================================================= */}
      {showPrintModal && (
        <PrintRosterModal
          event={currentEvent}
          registrations={displayRegistrations}
          onClose={() => setShowPrintModal(false)}
        />
      )}

    </div>
  );
}
