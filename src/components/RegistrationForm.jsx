import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Check,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { createRegistration } from '../lib/db';

export default function RegistrationForm({ event, onComplete }) {
  const isSolo = event.format === 'solo';
  const minTeam = event.minTeamSize || (isSolo ? 1 : 2);
  const maxTeam = event.maxTeamSize || (isSolo ? 1 : 4);

  // Pill counts available for group events
  const countOptions = [];
  for (let c = minTeam; c <= maxTeam; c++) {
    countOptions.push(c);
  }

  // Form State
  const [teamName, setTeamName] = useState('');
  const [participantCount, setParticipantCount] = useState(isSolo ? 1 : minTeam);
  const [participants, setParticipants] = useState(() => {
    const initial = [];
    const count = isSolo ? 1 : minTeam;
    for (let i = 0; i < count; i++) {
      initial.push({ fullName: '', classCourse: '', department: '' });
    }
    return initial;
  });

  // Flow State: 'fill' | 'review' | 'success'
  const [step, setStep] = useState('fill');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);



  // Adjust participant array when count pill is clicked
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

  // Step 1 Validation -> Review
  const handleProceedToReview = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Check participants
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      if (!p.fullName.trim()) {
        setErrorMessage(`Please enter the full name for Participant ${i + 1}.`);
        return;
      }
      if (!p.classCourse.trim()) {
        setErrorMessage(`Please enter the class for Participant ${i + 1}.`);
        return;
      }
      if (!p.department.trim()) {
        setErrorMessage(`Please enter the department for Participant ${i + 1}.`);
        return;
      }
    }

    setStep('review');
  };

  // Final Database Submission
  const handleConfirmSubmission = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await createRegistration({
        eventId: event.id,
        teamName: isSolo ? null : (teamName.trim() || `${event.name} Squad`),
        format: event.format,
        participants
      });

      setSubmissionResult(result);
      setStep('success');
      if (onComplete) onComplete(result);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please verify details and try again.');
      setStep('fill');
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // SUCCESS CONFIRMATION SCREEN
  // =========================================================================
  if (step === 'success' && submissionResult) {
    const formattedDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return (
      <div className="relative w-full max-w-2xl mx-auto bg-[#121622] border border-[#232B3D] rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
        
        {/* Luminous Green Checkmark */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>

        {/* Big Bold Headline */}
        <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight uppercase mb-2">
          REGISTRATION CONFIRMED
        </h2>
        <p className="text-slate-300 text-sm font-sans mb-6">
          Your entry for <strong className="text-white">{event.name}</strong> is officially locked in.
        </p>

        {/* Confirmation Details Card */}
        <div className="bg-[#0D1017] border border-[#1E2536] rounded-2xl p-6 mb-8 text-left space-y-3.5 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-[#1A2230]">
            <span className="text-slate-400 font-mono text-xs uppercase tracking-wider">Registration Reference</span>
            <span className="text-cyan font-mono font-bold tracking-wider text-base">
              {submissionResult.referenceCode}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#1A2230]">
            <span className="text-slate-400 font-mono text-xs uppercase tracking-wider">Event Arena</span>
            <span className="text-white font-semibold font-heading uppercase">{event.name} ({event.category})</span>
          </div>

          {!isSolo && teamName && (
            <div className="flex items-center justify-between py-2 border-b border-[#1A2230]">
              <span className="text-slate-400 font-mono text-xs uppercase tracking-wider">Team Name</span>
              <span className="text-white font-semibold">{teamName}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-b border-[#1A2230]">
            <span className="text-slate-400 font-mono text-xs uppercase tracking-wider">Participants Registered</span>
            <span className="text-white font-semibold">{participants.length} Participant{participants.length > 1 ? 's' : ''}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-400 font-mono text-xs uppercase tracking-wider">Timestamp</span>
            <span className="text-slate-200 font-mono text-xs">{formattedDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/events"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#E5385D] hover:bg-[#F43F68] text-white text-xs font-heading font-black uppercase tracking-wider rounded-full transition-all shadow-magenta-pill"
          >
            Explore Other Events →
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#182030] hover:bg-[#222C42] border border-[#2B364C] text-slate-200 text-xs font-heading font-bold uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 text-cyan" />
            <span>Save Confirmation</span>
          </button>
        </div>

      </div>
    );
  }

  // =========================================================================
  // REVIEW STEP
  // =========================================================================
  if (step === 'review') {
    return (
      <div className="bg-[#121622] border border-[#232B3D] rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto shadow-2xl">
        <div className="border-b border-[#1E2638] pb-5 mb-6">
          <span className="text-xs font-mono text-cyan uppercase tracking-widest font-bold block mb-1">
            STEP 2 OF 2 · REVIEW ENTRY
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            VERIFY DETAILS
          </h2>
          <p className="text-slate-300 text-sm font-sans mt-1.5 leading-relaxed">
            Please confirm your information. Official certificates and schedules will use these exact credentials.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-sm text-red-400 font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-5 mb-8">
          <div className="p-5 bg-[#0D1017] border border-[#1E2536] rounded-xl text-sm space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-mono text-xs uppercase">Target Arena</span>
              <span className="text-white font-bold">{event.name} ({event.category})</span>
            </div>
            {!isSolo && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono text-xs uppercase">Team Name</span>
                <span className="text-white font-semibold">{teamName || '(No team name)'}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-mono text-xs uppercase">Format</span>
              <span className="text-cyan font-semibold">{isSolo ? 'Solo Participation' : `Team (${participants.length} Members)`}</span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Registered Participants:
            </span>
            {participants.map((p, idx) => (
              <div key={idx} className="p-4 bg-[#182030] border border-[#263248] rounded-xl text-sm flex items-center justify-between">
                <div>
                  <span className="text-white font-heading font-bold text-base block">
                    {idx + 1}. {p.fullName}
                  </span>
                  <span className="text-slate-300 text-xs sm:text-sm font-sans mt-0.5 block">
                    {p.classCourse} · {p.department}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#1E2638]">
          <button
            type="button"
            onClick={() => setStep('fill')}
            className="w-full sm:w-auto px-6 py-3 bg-[#182030] hover:bg-[#222C42] text-slate-300 hover:text-white text-xs font-heading font-bold uppercase tracking-wider rounded-full border border-[#2B364C] transition-colors"
          >
            ← Back & Edit
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirmSubmission}
            className={`w-full sm:w-auto px-8 py-3.5 text-xs font-heading font-black uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 shadow-magenta-pill ${
              isSubmitting
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-[#E5385D] hover:bg-[#F43F68] text-white hover:scale-[1.02]'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>CONFIRMING REGISTRATION...</span>
              </>
            ) : (
              <>
                <span>Complete Free Registration →</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN REGISTRATION FORM
  // =========================================================================
  return (
    <div className="relative w-full bg-[#121622] border border-[#232B3D] rounded-3xl overflow-hidden shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* LEFT COLUMN: CRISP, HIGH-CONTRAST FORM FIELDS */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between z-10">
          
          <div>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-cyan uppercase tracking-widest">
                  STEP 1 OF 2 · FREE ENTRY
                </span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight uppercase">
                Register for {event.name}
              </h1>
              <p className="text-slate-300 text-sm font-sans font-normal mt-2 leading-relaxed">
                {isSolo 
                  ? 'Enter your name, class, and department to secure your championship slot.' 
                  : `Enter details for all team members (maximum ${maxTeam} participants).`}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-sm text-red-400 font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleProceedToReview} className="space-y-6">
              
              {/* SOLO EVENT FIELDS */}
              {isSolo ? (
                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={participants[0]?.fullName || ''}
                      onChange={(e) => handleParticipantChange(0, 'fullName', e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-3.5 bg-[#0D1017] border border-[#263146] rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
                    />
                  </div>

                  {/* Class */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-2">
                      Class *
                    </label>
                    <input
                      type="text"
                      required
                      value={participants[0]?.classCourse || ''}
                      onChange={(e) => handleParticipantChange(0, 'classCourse', e.target.value)}
                      placeholder="e.g. FY BCA, 3rd Year"
                      className="w-full px-4 py-3.5 bg-[#0D1017] border border-[#263146] rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-2">
                      Academic Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={participants[0]?.department || ''}
                      onChange={(e) => handleParticipantChange(0, 'department', e.target.value)}
                      placeholder="e.g. Computer Science"
                      className="w-full px-4 py-3.5 bg-[#0D1017] border border-[#263146] rounded-xl text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
                    />
                  </div>
                </div>
              ) : (
                /* GROUP EVENT FIELDS */
                <div className="space-y-6">
                  
                  {/* Team Name */}
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

                  {/* Number of Participants Pills */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                        Number of Team Members *
                      </label>
                      <span className="text-xs font-mono text-cyan">
                        {event.id === 'bgmi' || event.id === 'free-fire' ? 'Squad of 4 Players' : event.id === 'quiz' ? 'Team of 2 Members' : `Range: ${minTeam} to ${maxTeam}`}
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

                  {/* Participant Details Cards */}
                  <div className="space-y-4 pt-2">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                      Team Member Credentials
                    </span>

                    {participants.map((p, idx) => (
                      <div key={idx} className="p-5 bg-[#0D1017] border border-[#1E2536] rounded-2xl space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-cyan uppercase tracking-wider">
                            {idx === 0 ? 'Participant 1 (Team Leader)' : `Participant ${idx + 1}`}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          {/* Full Name */}
                          <div>
                            <input
                              type="text"
                              required
                              value={p.fullName}
                              onChange={(e) => handleParticipantChange(idx, 'fullName', e.target.value)}
                              placeholder="Full Name *"
                              className="w-full px-3.5 py-3 bg-[#161D2B] border border-[#28344A] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan"
                            />
                          </div>

                          {/* Class */}
                          <div>
                            <input
                              type="text"
                              required
                              value={p.classCourse}
                              onChange={(e) => handleParticipantChange(idx, 'classCourse', e.target.value)}
                              placeholder="Class (e.g. FY BCA, 3rd Year) *"
                              className="w-full px-3.5 py-3 bg-[#161D2B] border border-[#28344A] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan"
                            />
                          </div>

                          {/* Department */}
                          <div>
                            <input
                              type="text"
                              required
                              value={p.department}
                              onChange={(e) => handleParticipantChange(idx, 'department', e.target.value)}
                              placeholder="Department *"
                              className="w-full px-3.5 py-3 bg-[#161D2B] border border-[#28344A] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#1E2638]">
                <Link
                  to={`/events/${event.id}`}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#182030] hover:bg-[#222C42] text-slate-300 hover:text-white text-xs font-heading font-bold uppercase tracking-wider rounded-full border border-[#2B364C] transition-colors text-center"
                >
                  ← Back to Event
                </Link>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#E5385D] hover:bg-[#F43F68] text-white text-xs font-heading font-black uppercase tracking-wider rounded-full transition-all shadow-magenta-pill hover:scale-[1.02] text-center"
                >
                  Review Details →
                </button>
              </div>

            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: ELEGANT FESTIVAL DOSSIER & ATMOSPHERE */}
        <div className="lg:col-span-5 relative bg-[#090C12] border-t lg:border-t-0 lg:border-l border-[#1E2534] min-h-[360px] flex flex-col justify-between p-8 sm:p-10 overflow-hidden">
          
          {/* Subtle Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
            style={{ backgroundImage: `url('/hero-bg.jpg')` }}
          />

          {/* Deep Gradient Overlays for Elegance & High Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-[#0B0D11]/80 to-[#0B0D11]/60" />

          {/* Top Dossier Card */}
          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan/15 border border-cyan/40 text-cyan text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>OFFICIAL COMPETITOR ROSTER</span>
            </div>

            <div>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
                {event.name}
              </h3>
              <p className="text-slate-300 text-sm font-sans mt-1 leading-relaxed">
                {event.shortDescription}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="space-y-3 pt-3 border-t border-white/10 text-xs sm:text-sm font-sans">
              <div className="flex items-center gap-3 text-slate-300">
                <Calendar className="w-4 h-4 text-cyan shrink-0" />
                <span>Date: <strong className="text-white">{event.date || 'FEB 21, 2025'}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Clock className="w-4 h-4 text-cyan shrink-0" />
                <span>Time: <strong className="text-white">{event.time || '10:00 AM – 12:00 PM'}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan shrink-0" />
                <span>Venue: <strong className="text-white">{event.venue || 'CAMPUS LAB'}</strong></span>
              </div>
            </div>
          </div>

          {/* Bottom Fast Assurance Badge */}
          <div className="relative z-10 pt-8">
            <div className="p-4 rounded-2xl bg-[#121622]/80 border border-[#232B3D] backdrop-blur-md">
              <p className="text-xs font-mono text-slate-300 leading-relaxed">
                <strong className="text-cyan block uppercase mb-1 font-bold">Instant Registration Confirmation</strong>
                No student accounts or login credentials needed. Simply submit to secure your team slot immediately.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
