import React from 'react';
import { Printer, X } from 'lucide-react';

export default function PrintRosterModal({ event, registrations = [], onClose }) {
  // Flatten records into individual participant rows matching Panel 11
  const rows = [];
  let serialCounter = 1;

  registrations.forEach(reg => {
    if (reg.participants && reg.participants.length > 0) {
      reg.participants.forEach((p) => {
        rows.push({
          serial: serialCounter++,
          teamName: reg.team_name || (reg.format === 'solo' ? 'Individual' : '—'),
          participantName: p.full_name,
          classCourse: p.class_course,
          department: p.department,
          referenceCode: reg.reference_code,
          format: reg.format
        });
      });
    }
  });

  const eventName = event ? event.name : 'ALL EVENTS';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#10141D] border border-[#1E2534] rounded-xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
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
              className="px-4 py-2 bg-red hover:bg-red/90 text-ivory font-heading font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-2 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-muted hover:text-ivory rounded hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable White Sheet Document */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-900/60">
          
          <div className="bg-white text-black p-8 sm:p-12 rounded shadow-2xl max-w-4xl mx-auto font-sans text-xs">
            
            {/* Header: Main Title HACKATHON 2026, Event Name, Number of Participants */}
            <div className="border-b-2 border-black pb-4 mb-5 text-center">
              <h1 className="font-black text-2xl sm:text-3xl tracking-[0.16em] uppercase text-black font-sans">
                HACKATHON 2026
              </h1>
              <h2 className="font-bold text-base sm:text-lg text-black uppercase mt-1">
                {eventName}
              </h2>
              <div className="text-xs font-semibold text-gray-800 mt-1">
                Number of Participants: {rows.length}
              </div>
            </div>

            {/* Attendance Table: S.No | Participant Name | Class | Department | Sign */}
            {rows.length === 0 ? (
              <div className="py-12 text-center text-gray-500 italic">
                No participant records found for this event selection.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-black text-xs text-black">
                  <thead>
                    <tr className="bg-gray-100 border-b border-black text-left font-bold text-[11px]">
                      <th className="py-2 px-2.5 border border-black w-12 text-center">S.No</th>
                      <th className="py-2 px-3 border border-black">Participant Name</th>
                      <th className="py-2 px-3 border border-black w-36">Class</th>
                      <th className="py-2 px-3 border border-black">Department</th>
                      <th className="py-2 px-3 border border-black w-28 text-center">Sign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={`${row.referenceCode}-${row.serial}`} className="border-b border-gray-400">
                        <td className="py-2.5 px-2.5 border border-black text-center font-mono font-medium">
                          {row.serial}
                        </td>
                        <td className="py-2.5 px-3 border border-black font-medium">
                          {row.participantName}
                          {row.teamName && row.teamName !== 'Individual' && row.teamName !== '—' && (
                            <span className="block text-[10px] text-gray-600 font-normal">Team: {row.teamName}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 border border-black font-medium">
                          {row.classCourse}
                        </td>
                        <td className="py-2.5 px-3 border border-black">
                          {row.department}
                        </td>
                        <td className="py-2.5 px-3 border border-black bg-gray-50/20">
                          {/* Signature line for on-desk attendance */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Clean Minimal Footer */}
            <div className="mt-6 pt-3 border-t border-black flex items-center justify-between text-xs font-bold text-black font-mono">
              <span>Event: {eventName}</span>
              <span>Total Participants: {rows.length}</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

