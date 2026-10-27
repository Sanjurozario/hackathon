import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  X 
} from 'lucide-react';
import { getEvents, createRegistration } from '../lib/db';

export default function EventRegisterPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allEvents, setAllEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading, setLoading] = useState(true);

  // Form State
  const [teamName, setTeamName] = useState('');
  const [participantCount, setParticipantCount] = useState(1);
  const [participants, setParticipants] = useState([
    { fullName: '', classCourse: '', department: '' }
  ]);

  // Submission & Validation State
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalData, setSuccessModalData] = useState(null);



  // Load events
  useEffect(() => {
    getEvents().then(events => {
      setAllEvents(events);
      if (events.length > 0) {
        if (id) {
          const matched = events.find(e => e.id.toLowerCase() === id.toLowerCase());
          setSelectedEventId(matched ? matched.id : events[0].id);
        } else {
          setSelectedEventId(events[0].id);
        }
      }
      setLoading(false);
    });
  }, [id]);

  // Get currently selected event object
  const currentEvent = allEvents.find(e => e.id === selectedEventId) || allEvents[0];
  const isSolo = currentEvent?.format === 'solo';
  const minTeam = currentEvent?.minTeamSize || (isSolo ? 1 : 2);
  const maxTeam = currentEvent?.maxTeamSize || (isSolo ? 1 : 4);

  // When selected event changes, re-sync team size & participants
  useEffect(() => {
    if (!currentEvent) return;
    const initialCount = isSolo ? 1 : minTeam;
    setParticipantCount(initialCount);

    const initialParts = [];
    for (let i = 0; i < initialCount; i++) {
      initialParts.push({ fullName: '', classCourse: '', department: '' });
    }
    setParticipants(initialParts);
    setTeamName('');
    setErrorMessage('');
  }, [selectedEventId]);

  // Handle count change for group events
  const handleCountChange = (newCount) => {
    setParticipantCount(newCount);
    setParticipants(prev => {
      const updated = [...prev];
      if (newCount > prev.length) {
        for (let i = prev.length; i < newCount; i++) {
          updated.push({ fullName: '', classCourse: '', department: '' });
        }
      } else if (newCount < prev.length) {
        return updated.slice(0, newCount);
      }
      return updated;
    });
  };

  const handleParticipantChange = (index, field, value) => {
    setParticipants(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleEventSelectChange = (e) => {
    const newId = e.target.value;
    setSelectedEventId(newId);
    navigate(`/events/${newId}/register`, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentEvent) {
      setErrorMessage('Please select an event to register.');
      return;
    }

    // Validate all participants
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      if (!p.fullName.trim()) {
        setErrorMessage(`Please enter the full name for ${isSolo ? 'Participant' : `Member ${i + 1}`}.`);
        return;
      }
      if (!p.classCourse.trim()) {
        setErrorMessage(`Please enter the class for ${isSolo ? 'Participant' : `Member ${i + 1}`}.`);
        return;
      }
      if (!p.department.trim()) {
        setErrorMessage(`Please enter the department for ${isSolo ? 'Participant' : `Member ${i + 1}`}.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const result = await createRegistration({
        eventId: currentEvent.id,
        teamName: isSolo ? null : (teamName.trim() || `${currentEvent.name} Squad`),
        format: currentEvent.format,
        participants
      });

      // Show the Success Pop-up Modal
      setSuccessModalData(result);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check the details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForAnother = () => {
    setSuccessModalData(null);
    setParticipants([
      { fullName: '', classCourse: '', department: '' }
    ]);
    setTeamName('');
    setErrorMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D11] pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <span className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full inline-block animate-spin mb-4" />
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Opening registration portal...</p>
        </div>
      </div>
    );
  }

  // Count pills for group events
  const countOptions = [];
  for (let c = minTeam; c <= maxTeam; c++) {
    countOptions.push(c);
  }

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-24 text-slate-100 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/events" 
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Events Directory
          </Link>
        </div>

        {/* Form Container Card with Premium Glassmorphism */}
        <div className="bg-[#121622]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_25px_70px_rgba(0,0,0,0.65)] relative overflow-hidden">
          
          {/* Subtle Top Cyan-Magenta Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan via-50% to-[#E5385D]" />
          
          {/* Header */}
          <div className="border-b border-[#1E2638] pb-6 mb-8">
            <span className="text-xs font-mono font-bold text-cyan uppercase tracking-widest block mb-1.5">
              OFFICIAL REGISTRATION
            </span>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
              REGISTER FOR AN EVENT
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 font-normal leading-relaxed">
              Select your competition, enter your student credentials, and submit to register.
            </p>
          </div>

          {/* Validation Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-sm text-red-400 font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Clean Unified Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. SELECT EVENT DROPDOWN */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-2">
                Select Event *
              </label>
              <div className="relative">
                <select
                  value={selectedEventId}
                  onChange={handleEventSelectChange}
                  className="w-full px-4 py-3.5 bg-[#0D1017] border border-[#263146] rounded-xl text-base sm:text-sm text-white focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all appearance-none pr-10 font-medium cursor-pointer"
                >
                  <optgroup label="TECHNICAL COMPETITIONS">
                    {allEvents.filter(e => e.category === 'Technical').map(evt => (
                      <option key={evt.id} value={evt.id}>
                        {evt.name} — {evt.format === 'solo' ? 'Solo' : 'Team'}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="GAMING TOURNAMENTS">
                    {allEvents.filter(e => e.category === 'Gaming').map(evt => (
                      <option key={evt.id} value={evt.id}>
                        {evt.name} — {evt.id === 'bgmi' || evt.id === 'free-fire' ? 'Squad (4 Players)' : evt.format === 'solo' ? 'Solo' : 'Team'}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* 2. TEAM NAME (If Group Event) */}
            {!isSolo && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Team / Squad Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Cyber Ravens"
                    className="w-full px-4 py-3.5 bg-[#0D1017] border border-[#263146] rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
                  />
                </div>

                {/* Team Size Pill Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                      Number of Team Members *
                    </label>
                    <span className="text-xs font-mono text-cyan">
                      {currentEvent?.id === 'bgmi' || currentEvent?.id === 'free-fire' ? 'Squad of 4 Players' : currentEvent?.id === 'quiz' ? 'Team of 2 Members' : `Allowed: ${minTeam} to ${maxTeam}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {countOptions.map(cnt => {
                      const isSelected = participantCount === cnt;
                      return (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => handleCountChange(cnt)}
                          className={`w-12 h-12 rounded-xl text-sm font-heading font-black transition-all ${
                            isSelected
                              ? 'bg-cyan text-[#0B0D11] shadow-lg shadow-cyan/25 scale-105'
                              : 'bg-[#182030] text-slate-300 hover:text-white border border-[#263248]'
                          }`}
                        >
                          {cnt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* PARTICIPANT FIELDS (NAME, CLASS, DEPARTMENT) */}
            <div className="space-y-5 pt-2">
              <label className="block text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Participant Details *
              </label>

              {participants.map((p, idx) => (
                <div 
                  key={idx} 
                  className={`p-5 rounded-2xl border space-y-4 ${
                    isSolo 
                      ? 'bg-[#0D1017] border-[#1E2536]' 
                      : 'bg-[#0E131C] border-[#222B3D]'
                  }`}
                >
                  {!isSolo && (
                    <div className="flex items-center justify-between border-b border-[#1E2638] pb-2">
                      <span className="text-xs font-mono font-bold text-cyan uppercase tracking-wider">
                        {idx === 0 ? 'Member 1 (Team Leader)' : `Member ${idx + 1}`}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={p.fullName}
                        onChange={(e) => handleParticipantChange(idx, 'fullName', e.target.value)}
                        placeholder="Enter full name"
                        className="w-full px-3.5 py-3 bg-[#161D2B] border border-[#28344A] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan"
                      />
                    </div>

                    {/* Class */}
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                        Class *
                      </label>
                      <input
                        type="text"
                        required
                        value={p.classCourse}
                        onChange={(e) => handleParticipantChange(idx, 'classCourse', e.target.value)}
                        placeholder="e.g. FY BCA, 3rd Year"
                        className="w-full px-3.5 py-3 bg-[#161D2B] border border-[#28344A] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan"
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                        Department *
                      </label>
                      <input
                        type="text"
                        required
                        value={p.department}
                        onChange={(e) => handleParticipantChange(idx, 'department', e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="w-full px-3.5 py-3 bg-[#161D2B] border border-[#28344A] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-6 border-t border-[#1E2638]">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-xs font-heading font-black uppercase tracking-[0.18em] rounded-full transition-all shadow-magenta-pill flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-[#E5385D] hover:bg-[#F43F68] text-white hover:scale-[1.01]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>REGISTERING...</span>
                  </>
                ) : (
                  <span>REGISTER NOW →</span>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

      {/* =========================================================================
          POP-UP MODAL: "YOU HAVE SUCCESSFULLY REGISTERED!"
          ========================================================================= */}
      {successModalData && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#121622] border border-[#2A354A] rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
            
            {/* Close Button in corner */}
            <button
              type="button"
              onClick={() => setSuccessModalData(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-[#1A2230] hover:bg-[#253044] transition-colors"
              aria-label="Close pop-up"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Green Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>

            {/* Success Heading */}
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase mb-1">
              YOU HAVE SUCCESSFULLY REGISTERED!
            </h2>
            <p className="text-slate-300 text-sm font-sans mb-6">
              Your registration slot has been officially confirmed.
            </p>

            {/* Confirmation Details Card */}
            <div className="bg-[#0D1017] border border-[#1E2536] rounded-2xl p-4 sm:p-5 mb-6 text-left space-y-2.5 text-xs sm:text-sm font-sans">
              <div className="flex justify-between items-center py-1.5 border-b border-[#1A2230]">
                <span className="text-slate-400 font-mono text-xs uppercase">Reference Code</span>
                <span className="text-cyan font-mono font-bold text-base">
                  {successModalData.referenceCode}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#1A2230]">
                <span className="text-slate-400 font-mono text-xs uppercase">Event Arena</span>
                <span className="text-white font-bold font-heading uppercase">
                  {successModalData.event?.name || currentEvent?.name}
                </span>
              </div>

              {teamName && (
                <div className="flex justify-between items-center py-1.5 border-b border-[#1A2230]">
                  <span className="text-slate-400 font-mono text-xs uppercase">Team Name</span>
                  <span className="text-white font-semibold">{teamName}</span>
                </div>
              )}

              <div className="py-1.5">
                <span className="text-slate-400 font-mono text-xs uppercase block mb-1">Registered Participants</span>
                <div className="space-y-1">
                  {participants.map((p, i) => (
                    <div key={i} className="text-slate-200 text-xs flex justify-between">
                      <span className="font-medium text-white">{i + 1}. {p.fullName}</span>
                      <span className="text-slate-400">{p.classCourse} ({p.department})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetForAnother}
                className="w-full sm:w-auto px-6 py-3 bg-[#1A2230] hover:bg-[#253044] border border-[#2E3B52] text-white text-xs font-heading font-bold uppercase tracking-wider rounded-full transition-colors"
              >
                Register Another Event
              </button>

              <Link
                to="/events"
                className="w-full sm:w-auto px-6 py-3 bg-[#E5385D] hover:bg-[#F43F68] text-white text-xs font-heading font-black uppercase tracking-wider rounded-full transition-all shadow-magenta-pill"
              >
                Back to Events →
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
