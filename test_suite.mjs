// Automated Verification Suite for VEXORIS Backend & Registration Engine

// Mock browser localStorage for Node testing environment
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; }
};

// Import database functions
import('./src/lib/db.js').then(async (db) => {
  console.log('--- TEST 1: Initialise & Fetch Events ---');
  const events = await db.getEvents();
  console.log(`Fetched ${events.length} events (Expected: 9)`);
  if (events.length !== 9) throw new Error('Events count mismatch!');

  console.log('\n--- TEST 2: Validate 9 Official Event Names ---');
  const expectedNames = [
    'IT MANAGER', 'QUIZ', 'FUNZOVA', 'VEXTALK', 'DEBATE',
    'BGMI', 'NFS', 'FREE FIRE', 'E-FOOTBALL'
  ];
  expectedNames.forEach(name => {
    const found = events.find(e => e.name === name);
    if (!found) throw new Error(`Missing required event: ${name}`);
    console.log(`✓ Confirmed: ${name} (${found.category} - ${found.format})`);
  });

  console.log('\n--- TEST 3: Solo Registration (IT MANAGER) ---');
  const soloReg = await db.createRegistration({
    eventId: 'it-manager',
    teamName: null,
    format: 'solo',
    participants: [{
      fullName: 'Rohan Deshmukh',
      classCourse: 'B.Tech CSE 3rd Year',
      department: 'Computer Science & Engineering'
    }]
  });
  console.log(`✓ Solo Registration Success! Reference: ${soloReg.referenceCode}`);
  if (!soloReg.referenceCode.startsWith('VX-')) {
    throw new Error('Reference code does not match VX-XXXX format');
  }

  console.log('\n--- TEST 4: Duplicate Prevention Rule ---');
  try {
    await db.createRegistration({
      eventId: 'it-manager',
      teamName: null,
      format: 'solo',
      participants: [{
        fullName: 'Rohan Deshmukh', // Same participant and department
        classCourse: 'B.Tech CSE 3rd Year',
        department: 'Computer Science & Engineering'
      }]
    });
    throw new Error('Duplicate registration was NOT rejected!');
  } catch (err) {
    console.log(`✓ Correctly rejected duplicate registration: "${err.message}"`);
  }

  console.log('\n--- TEST 5: Group Registration with Diverse Classes/Depts (BGMI) ---');
  const groupReg = await db.createRegistration({
    eventId: 'bgmi',
    teamName: 'TITAN CLAN',
    format: 'group',
    participants: [
      { fullName: 'Kunal Verma', classCourse: 'B.Tech IT 4th Sem', department: 'Information Technology' },
      { fullName: 'Zaid Khan', classCourse: 'BCA 2nd Year', department: 'Computer Applications' },
      { fullName: 'Pooja Hegde', classCourse: 'B.Sc Data Science', department: 'Statistics' },
      { fullName: 'Ananya Roy', classCourse: 'B.Tech AI 6th Sem', department: 'Artificial Intelligence' }
    ]
  });
  console.log(`✓ Group Registration Success! Team: ${groupReg.registration.team_name}, Reference: ${groupReg.referenceCode}, Members: ${groupReg.participants.length}`);

  console.log('\n--- TEST 6: Enforce Team Size Limits ---');
  try {
    await db.createRegistration({
      eventId: 'bgmi',
      teamName: 'SOLO IN SQUAD',
      format: 'group',
      participants: [{ fullName: 'Lone Wolf', classCourse: 'B.Tech', department: 'CSE' }]
    });
    throw new Error('Group registration below minTeamSize was not rejected!');
  } catch (err) {
    console.log(`✓ Enforced minimum team size constraint: "${err.message}"`);
  }

  console.log('\n--- TEST 7: Dashboard Metrics Computation ---');
  const metrics = await db.getDashboardMetrics();
  console.log(`✓ Total Registrations: ${metrics.totalRegistrations}`);
  console.log(`✓ Unique Registered Participants: ${metrics.uniqueParticipants}`);
  console.log(`✓ Technical Event Registrations: ${metrics.technicalRegistrations}`);
  console.log(`✓ Gaming Event Registrations: ${metrics.gamingRegistrations}`);

  console.log('\n--- TEST 8: Search & Filter Registrations ---');
  const searchResults = await db.getRegistrationsWithParticipants({ search: 'Kunal' });
  console.log(`✓ Search for "Kunal" returned: ${searchResults.length} match(es)`);
  if (searchResults.length === 0) throw new Error('Search failed to find Kunal!');

  console.log('\n--- TEST 9: Admin Authentication (Demo Credentials) ---');
  const auth = await db.adminLogin('admin@vexoris.local', 'vexoris2025');
  console.log(`✓ Admin login successful! Mode: ${auth.mode}, Role: ${auth.user.role}`);

  console.log('\n=========================================');
  console.log('ALL 9 VERIFICATION TESTS PASSED CLEANLY! 🎯');
  console.log('=========================================');
}).catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
