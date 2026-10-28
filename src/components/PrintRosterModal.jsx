import React from 'react';
import { Printer, X } from 'lucide-react';
import { OFFICIAL_EVENTS } from '../data/events.js';

export default function PrintRosterModal({ event, registrations = [], onClose }) {
  // Helper to determine the event metadata for a registration
  const getEventForReg = (reg) => {
    if (event && (event.id === reg.event_id || !reg.event_id)) {
      return event;
    }
    const found = OFFICIAL_EVENTS.find(e => e.id === reg.event_id);
    return found || event || null;
  };

  // Helper to check if a registration belongs to a group event under Technical or Gaming categories only
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
      // Group Event under Technical or Gaming:
      // Exactly ONE table row per team with ONE serial number.
      // All team members' names appear in the same Participant Name cell, on separate lines.
      // Each member's class appears on the corresponding line in Class column.
      // Each member's department appears on the corresponding line in Department column.
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
      // Solo events, or events from other categories (Cultural, etc.):
      // Each participant occupies their own row as before.
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

  // Determine Event Title for header and footer
  const uniqueEventIds = [...new Set(registrations.map(r => r.event_id).filter(Boolean))];
  let eventName = 'ALL EVENTS';
  if (uniqueEventIds.length === 1) {
    const ev = (event && event.id === uniqueEventIds[0])
      ? event
      : OFFICIAL_EVENTS.find(e => e.id === uniqueEventIds[0]) || event;
    eventName = ev ? ev.name : uniqueEventIds[0].toUpperCase();
  } else if (event && (!registrations.length || uniqueEventIds.length === 0)) {
    eventName = event.name;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-[#10141D] border border-[#1E2534] rounded-xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden print:bg-white print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none">
        
        {/* Modal Action Bar (no-print) */}
        <div className="no-print p-4 bg-[#141822] border-b border-[#1E2534] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan shadow-[0_0_8px_#46C7DE]" />
            <h3 className="font-heading font-black text-sm text-ivory uppercase tracking-wider">
              PRINT PREVIEW — ATTENDANCE & PARTICIPANT LIST
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-red hover:bg-red/90 text-ivory font-heading font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-muted hover:text-ivory rounded hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable White Sheet Document */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-900/60 print:p-0 print:bg-white print:overflow-visible">
          
          <div className="bg-white text-black p-8 sm:p-12 rounded shadow-2xl max-w-4xl mx-auto font-sans text-xs print:p-0 print:shadow-none print:max-w-none print:rounded-none">
            
            {/* Header: Main Title HACKATHON 2026, Event Name, Number of Participants */}
            <div className="border-b-2 border-black pb-4 mb-5 text-center">
              <h1 className="font-black text-2xl sm:text-3xl tracking-[0.16em] uppercase text-black font-sans">
                HACKATHON 2026
              </h1>
              <h2 className="font-bold text-base sm:text-lg text-black uppercase mt-1">
                {eventName}
              </h2>
              <div className="text-xs font-semibold text-gray-800 mt-1">
                Number of Participants: {totalParticipantCount}
              </div>
            </div>

            {/* Attendance Table: S.No | Participant Name | Class | Department | Sign */}
            {rows.length === 0 ? (
              <div className="py-12 text-center text-gray-500 italic">
                No participant records found for this event selection.
              </div>
            ) : (
              <div className="overflow-x-auto print:overflow-visible">
                <table className="w-full border-collapse border border-black text-xs text-black print-table">
                  <thead>
                    <tr className="bg-gray-100 border-b border-black text-left font-bold text-[11px]">
                      <th className="py-2 px-2.5 border border-black w-12 text-center">S.No</th>
                      <th className="py-2 px-3 border border-black min-w-[200px]">Participant Name</th>
                      <th className="py-2 px-3 border border-black w-36">Class</th>
                      <th className="py-2 px-3 border border-black w-36">Department</th>
                      <th className="py-2 px-3 border border-black w-28 text-center">Sign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      if (row.isGroupRow) {
                        return (
                          <tr key={`${row.referenceCode}-${row.serial}`} className="team-row border-b-2 border-black">
                            <td className="print-flush p-0 border border-black text-center font-mono font-bold text-xs align-middle w-12 bg-gray-50/20">
                              {row.serial}
                            </td>
                            <td className="print-flush p-0 border border-black font-medium align-top min-w-[200px]">
                              {row.members.map((m, idx) => (
                                <div 
                                  key={idx} 
                                  className={`px-3 py-2 min-h-[32px] flex items-center leading-tight ${
                                    idx !== 0 ? 'border-t border-gray-300' : ''
                                  }`}
                                >
                                  <span className="font-semibold text-black text-xs uppercase">
                                    {m.participantName}
                                  </span>
                                </div>
                              ))}
                            </td>
                            <td className="print-flush p-0 border border-black font-medium align-top w-36">
                              {row.members.map((m, idx) => (
                                <div 
                                  key={idx} 
                                  className={`px-3 py-2 min-h-[32px] flex items-center leading-tight ${
                                    idx !== 0 ? 'border-t border-gray-300' : ''
                                  }`}
                                >
                                  <span className="text-gray-900 text-xs uppercase font-medium">
                                    {m.classCourse}
                                  </span>
                                </div>
                              ))}
                            </td>
                            <td className="print-flush p-0 border border-black align-top w-36">
                              {row.members.map((m, idx) => (
                                <div 
                                  key={idx} 
                                  className={`px-3 py-2 min-h-[32px] flex items-center leading-tight ${
                                    idx !== 0 ? 'border-t border-gray-300' : ''
                                  }`}
                                >
                                  <span className="text-gray-900 text-xs uppercase">
                                    {m.department}
                                  </span>
                                </div>
                              ))}
                            </td>
                            <td className="print-flush p-0 border border-black bg-gray-50/20 align-top w-28">
                              {/* Blank signing space with adequate height for team signatures */}
                            </td>
                          </tr>
                        );
                      }

                      // Individual registrations and non-Technical/Gaming categories
                      return (
                        <tr key={`${row.referenceCode}-${row.serial}`} className="border-b border-black">
                          <td className="py-2.5 px-2.5 border border-black text-center font-mono font-medium align-middle w-12">
                            {row.serial}
                          </td>
                          <td className="py-2.5 px-3 border border-black font-medium min-w-[200px]">
                            <span className="font-semibold text-black uppercase">{row.participantName}</span>
                            {row.teamName && row.teamName !== 'Individual' && row.teamName !== '—' && (
                              <span className="block text-[10px] text-gray-600 font-normal">Team: {row.teamName}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 border border-black font-medium w-36 uppercase">
                            {row.classCourse}
                          </td>
                          <td className="py-2.5 px-3 border border-black w-36 uppercase">
                            {row.department}
                          </td>
                          <td className="py-2.5 px-3 border border-black bg-gray-50/20 w-28">
                            {/* Signature line for on-desk attendance */}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Clean Minimal Footer */}
            <div className="mt-6 pt-3 border-t border-black flex items-center justify-between text-xs font-bold text-black font-mono">
              <span>Event: {eventName}</span>
              <span>Total Participants: {totalParticipantCount}</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

