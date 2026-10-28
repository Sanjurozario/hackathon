// Comprehensive Test Suite for Print / Save PDF Roster Logic
import { OFFICIAL_EVENTS } from './src/data/events.js';

// Replicate the exact logic from PrintRosterModal for automated verification
function computePrintRows(event, registrations) {
  const getEventForReg = (reg) => {
    if (event && (event.id === reg.event_id || !reg.event_id)) {
      return event;
    }
    const found = OFFICIAL_EVENTS.find(e => e.id === reg.event_id);
    return found || event || null;
  };

  const isTechOrGamingGroup = (reg) => {
    const ev = getEventForReg(reg);
    const category = (ev?.category || '').trim().toLowerCase();
    const isTechOrGaming = category === 'technical' || category === 'gaming';
    if (!isTechOrGaming) return false;

    const isGroup = (ev?.format === 'group') ||
                    (reg.format === 'group') ||
                    ((ev?.maxTeamSize || 1) > 1);
    return Boolean(isGroup);
  };

  const rows = [];
  let serialCounter = 1;
  let totalParticipantCount = 0;

  registrations.forEach(reg => {
    const participantsList = reg.participants || [];
    const pCount = participantsList.length > 0 ? participantsList.length : (reg.participant_count || 0);
    totalParticipantCount += pCount;

    if (participantsList.length === 0) {
      return;
    }

    if (isTechOrGamingGroup(reg)) {
      rows.push({
        isGroupRow: true,
        serial: serialCounter++,
        teamName: reg.team_name,
        referenceCode: reg.reference_code,
        format: reg.format,
        members: participantsList.map(p => ({
          participantName: p.full_name || p.fullName || '—',
          classCourse: p.class_course || p.classCourse || '—',
          department: p.department || '—'
        }))
      });
    } else {
      participantsList.forEach((p) => {
        rows.push({
          isGroupRow: false,
          serial: serialCounter++,
          teamName: reg.team_name || (reg.format === 'solo' ? 'Individual' : '—'),
          participantName: p.full_name || p.fullName || '—',
          classCourse: p.class_course || p.classCourse || '—',
          department: p.department || '—',
          referenceCode: reg.reference_code,
          format: reg.format
        });
      });
    }
  });

  return { rows, totalParticipantCount };
}

console.log('=== TEST SUITE: PRINT ROSTER GROUPING & METRICS ===\n');

// 1. Technical Group: Debate (Duo - 2 members)
console.log('Test 1: Technical Group Event (DEBATE - 2 members)');
const debateRegs = [
  {
    reference_code: 'VX-1001',
    event_id: 'debate',
    format: 'group',
    participants: [
      { full_name: 'SANJAY', class_course: '3RD YEAR', department: 'CS' },
      { full_name: 'UNKNOWN', class_course: '1ST YEAR', department: 'BCOM' }
    ]
  }
];
const res1 = computePrintRows(null, debateRegs);
console.log(`  Rows created: ${res1.rows.length} (Expected: 1)`);
console.log(`  Total Participants: ${res1.totalParticipantCount} (Expected: 2)`);
console.log(`  Row 1 Serial: ${res1.rows[0].serial} (Expected: 1)`);
console.log(`  Row 1 isGroupRow: ${res1.rows[0].isGroupRow} (Expected: true)`);
console.log(`  Members in row: ${res1.rows[0].members.length} (Expected: 2)`);
console.log(`  Member 1: ${res1.rows[0].members[0].participantName} - ${res1.rows[0].members[0].classCourse} - ${res1.rows[0].members[0].department}`);
console.log(`  Member 2: ${res1.rows[0].members[1].participantName} - ${res1.rows[0].members[1].classCourse} - ${res1.rows[0].members[1].department}`);
if (res1.rows.length !== 1 || res1.totalParticipantCount !== 2 || res1.rows[0].members.length !== 2) {
  throw new Error('Test 1 Failed: Debate was not grouped into 1 row!');
}
console.log('  PASSED\n');

// 2. Gaming Group: BGMI (Squad - 4 members)
console.log('Test 2: Gaming Group Event (BGMI - 4 members)');
const bgmiRegs = [
  {
    reference_code: 'VX-2001',
    event_id: 'bgmi',
    format: 'group',
    participants: [
      { full_name: 'Kunal Verma', class_course: 'B.Tech IT 4th Sem', department: 'IT' },
      { full_name: 'Zaid Khan', class_course: 'BCA 2nd Year', department: 'BCA' },
      { full_name: 'Pooja Hegde', class_course: 'B.Sc Data Science', department: 'Stats' },
      { full_name: 'Ananya Roy', class_course: 'B.Tech AI 6th Sem', department: 'AI' }
    ]
  }
];
const res2 = computePrintRows(null, bgmiRegs);
console.log(`  Rows created: ${res2.rows.length} (Expected: 1)`);
console.log(`  Total Participants: ${res2.totalParticipantCount} (Expected: 4)`);
console.log(`  Row 1 isGroupRow: ${res2.rows[0].isGroupRow} (Expected: true)`);
console.log(`  Members in row: ${res2.rows[0].members.length} (Expected: 4)`);
if (res2.rows.length !== 1 || res2.totalParticipantCount !== 4 || res2.rows[0].members.length !== 4) {
  throw new Error('Test 2 Failed: BGMI was not grouped into 1 row!');
}
console.log('  PASSED\n');

// 3. Technical Solo: IT Manager (1 member)
console.log('Test 3: Technical Solo Event (IT MANAGER - 1 member each)');
const itManagerRegs = [
  {
    reference_code: 'VX-3001',
    event_id: 'it-manager',
    format: 'solo',
    participants: [{ full_name: 'Rohan Deshmukh', class_course: 'B.Tech CSE', department: 'CSE' }]
  },
  {
    reference_code: 'VX-3002',
    event_id: 'it-manager',
    format: 'solo',
    participants: [{ full_name: 'Aarav Mehta', class_course: 'BCA 3rd Year', department: 'CA' }]
  }
];
const res3 = computePrintRows(null, itManagerRegs);
console.log(`  Rows created: ${res3.rows.length} (Expected: 2)`);
console.log(`  Total Participants: ${res3.totalParticipantCount} (Expected: 2)`);
console.log(`  Row 1 isGroupRow: ${res3.rows[0].isGroupRow} (Expected: false)`);
console.log(`  Row 2 isGroupRow: ${res3.rows[1].isGroupRow} (Expected: false)`);
if (res3.rows.length !== 2 || res3.rows[0].isGroupRow !== false || res3.rows[1].isGroupRow !== false) {
  throw new Error('Test 3 Failed: Solo Technical event should not be group row!');
}
console.log('  PASSED\n');

// 4. Cultural Group Event (e.g. Cultural Dance with 3 members): Must NOT be grouped!
console.log('Test 4: Cultural Group Event (Must NOT be grouped)');
const culturalRegs = [
  {
    reference_code: 'VX-4001',
    event_id: 'cultural-dance',
    format: 'group',
    participants: [
      { full_name: 'Dancer 1', class_course: 'BA 1st', department: 'Arts' },
      { full_name: 'Dancer 2', class_course: 'BA 2nd', department: 'Arts' },
      { full_name: 'Dancer 3', class_course: 'BA 3rd', department: 'Arts' }
    ]
  }
];
const mockCulturalEvent = {
  id: 'cultural-dance',
  name: 'CULTURAL DANCE',
  category: 'Cultural',
  format: 'group',
  minTeamSize: 3,
  maxTeamSize: 3
};
const res4 = computePrintRows(mockCulturalEvent, culturalRegs);
console.log(`  Rows created: ${res4.rows.length} (Expected: 3 individual rows)`);
console.log(`  Total Participants: ${res4.totalParticipantCount} (Expected: 3)`);
console.log(`  Row 1 isGroupRow: ${res4.rows[0].isGroupRow} (Expected: false)`);
console.log(`  Row 2 isGroupRow: ${res4.rows[1].isGroupRow} (Expected: false)`);
console.log(`  Row 3 isGroupRow: ${res4.rows[2].isGroupRow} (Expected: false)`);
if (res4.rows.length !== 3 || res4.rows[0].isGroupRow !== false) {
  throw new Error('Test 4 Failed: Cultural event must not be grouped into one row!');
}
console.log('  PASSED\n');

// 5. Mixed Multiple Teams (Debate + Quiz + Free Fire)
console.log('Test 5: Multiple Teams Across Technical & Gaming');
const mixedRegs = [
  {
    reference_code: 'VX-5001',
    event_id: 'quiz',
    format: 'group',
    participants: [
      { full_name: 'Quiz Master 1', class_course: 'B.Sc 1st', department: 'Maths' },
      { full_name: 'Quiz Master 2', class_course: 'B.Sc 2nd', department: 'Stats' }
    ]
  },
  {
    reference_code: 'VX-5002',
    event_id: 'free-fire',
    format: 'group',
    participants: [
      { full_name: 'FF 1', class_course: 'B.Com 1', department: 'Commerce' },
      { full_name: 'FF 2', class_course: 'B.Com 2', department: 'Commerce' },
      { full_name: 'FF 3', class_course: 'B.Com 3', department: 'Commerce' },
      { full_name: 'FF 4', class_course: 'B.Com 4', department: 'Commerce' }
    ]
  },
  {
    reference_code: 'VX-5003',
    event_id: 'nfs',
    format: 'solo',
    participants: [
      { full_name: 'Racer Solo', class_course: 'BBA', department: 'Management' }
    ]
  }
];
const res5 = computePrintRows(null, mixedRegs);
console.log(`  Total Rows: ${res5.rows.length} (Expected: 3 rows: 1 Quiz + 1 FF + 1 NFS)`);
console.log(`  Total Participants: ${res5.totalParticipantCount} (Expected: 7: 2 + 4 + 1)`);
console.log(`  Row 1 (Quiz): Serial ${res5.rows[0].serial}, Members ${res5.rows[0].members.length}`);
console.log(`  Row 2 (FF): Serial ${res5.rows[1].serial}, Members ${res5.rows[1].members.length}`);
console.log(`  Row 3 (NFS): Serial ${res5.rows[2].serial}, Individual ${res5.rows[2].participantName}`);
if (res5.rows.length !== 3 || res5.totalParticipantCount !== 7) {
  throw new Error('Test 5 Failed: Multi-team calculation mismatch!');
}
console.log('  PASSED\n');

console.log(' ALL 5 TESTS PASSED WITH ZERO ERRORS!');
