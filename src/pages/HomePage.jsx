import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Terminal, 
  Gamepad2, 
  MapPin, 
  Clock, 
  User, 
  Users, 
  UserCheck, 
  ChevronRight, 
  ShieldCheck, 
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { OFFICIAL_EVENTS, GENERAL_GUIDELINES } from '../data/events';

export default function HomePage() {
  const [selectedMobileCategory, setSelectedMobileCategory] = useState('All');

  const techEvents = OFFICIAL_EVENTS.filter(e => e.category === 'Technical');
  const gamingEvents = OFFICIAL_EVENTS.filter(e => e.category === 'Gaming');

  const filteredMobileEvents = OFFICIAL_EVENTS.filter(e => {
    if (selectedMobileCategory === 'All') return true;
    return e.category === selectedMobileCategory;
  });

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#0A0412] text-white">
      {/* 
        =============================================================================
        1. HERO BANNER
        - Full-screen on desktop (preserving the widescreen poster layout the user loved)
        - Naturally proportioned with scroll prompt on mobile
        ============================================================================= 
      */}
      <Hero />

      {/* 
        =============================================================================
        2. DEDICATED MOBILE CONTINUOUS SCROLL FEED (VISIBLE ONLY ON MOBILE < md)
        Provides an ultra-smooth, continuous vertical scroll experience on phones
        ============================================================================= 
      */}
      <div className="md:hidden flex flex-col space-y-12 px-4 sm:px-6 pt-6 pb-16 relative z-10">
        
        {/* --- SECTION A: EVENTS SHOWCASE FEED --- */}
        <section id="events-section" className="scroll-mt-20 space-y-5">
          
          {/* Section Header */}
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan uppercase tracking-[0.2em] font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>9 OFFICIAL FESTIVAL ARENAS</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase mt-1">
              CHAMPIONSHIP EVENTS
            </h2>
            <p className="text-slate-400 text-xs mt-1 font-sans">
              5 Technical Arenas · 4 Gaming Tournaments · 30 Oct @ 12:30 PM
            </p>
          </div>

          {/* Quick Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedMobileCategory('All')}
              className={`px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider shrink-0 transition-all ${
                selectedMobileCategory === 'All'
                  ? 'bg-white text-[#0B0D11] shadow-md'
                  : 'bg-[#151924] text-slate-300 border border-white/10'
              }`}
            >
              All Events ({OFFICIAL_EVENTS.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedMobileCategory('Technical')}
              className={`px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 ${
                selectedMobileCategory === 'Technical'
                  ? 'bg-cyan text-[#0B0D11] shadow-[0_0_15px_rgba(70,199,222,0.4)]'
                  : 'bg-[#151924] text-slate-300 border border-white/10'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Technical ({techEvents.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMobileCategory('Gaming')}
              className={`px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 ${
                selectedMobileCategory === 'Gaming'
                  ? 'bg-[#E5385D] text-white shadow-[0_0_15px_rgba(229,56,93,0.4)]'
                  : 'bg-[#151924] text-slate-300 border border-white/10'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Gaming ({gamingEvents.length})</span>
            </button>
          </div>

          {/* Continuous List of Event Cards */}
          <div className="space-y-4">
            {filteredMobileEvents.map((event) => {
              const isTech = event.category === 'Technical';
              const isSolo = event.format === 'solo';

              const formatLabel = isSolo 
                ? 'Solo (1 Participant)' 
                : event.id === 'quiz' 
                  ? 'Team (2 Participants)' 
                  : 'Squad (4 Players)';

              return (
                <div 
                  key={event.id}
                  className="bg-[#121622] border border-[#232B3D] rounded-xl p-4 shadow-lg space-y-3"
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isTech 
                        ? 'bg-cyan/15 text-cyan border border-cyan/40' 
                        : 'bg-[#E5385D]/15 text-[#FF4B72] border border-[#E5385D]/40'
                    }`}>
                      {event.badge || event.category}
                    </span>

                    <span className="text-[11px] font-mono text-slate-300 flex items-center gap-1 px-2 py-0.5 rounded bg-[#0D1017] border border-[#1E2536]">
                      {isSolo ? <User className="w-3 h-3 text-cyan" /> : <Users className="w-3 h-3 text-[#FF4B72]" />}
                      <span>{formatLabel}</span>
                    </span>
                  </div>

                  {/* Event Title */}
                  <h3 className="font-heading font-black text-xl text-white tracking-wide uppercase">
                    {event.name}
                  </h3>

                  {/* Metadata: Venue, Coordinator, Time */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-300">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0D1017] border border-[#1E2536]">
                      <MapPin className="w-3 h-3 text-cyan" /> {event.venue}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0D1017] border border-[#1E2536]">
                      <UserCheck className="w-3 h-3 text-cyan" /> Coord: {event.coordinator}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0D1017] border border-[#1E2536]">
                      <Clock className="w-3 h-3 text-cyan" /> 30 Oct · 12:30 PM
                    </span>
                  </div>

                  {/* Action Button: View Details matching desktop */}
                  <div className="pt-2">
                    <Link
                      to={`/events/${event.id}`}
                      className={`w-full py-2.5 px-4 rounded-lg text-xs font-heading font-bold tracking-[0.14em] uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
                        isTech 
                          ? 'bg-[#141C2B] text-cyan hover:bg-cyan hover:text-[#0B0D11] border border-cyan/30' 
                          : 'bg-[#1C1422] text-[#FF4B72] hover:bg-[#E5385D] hover:text-white border border-[#E5385D]/30'
                      }`}
                    >
                      <span>View Event Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- SECTION B: RULES & REGULATIONS CONTINUOUS DOSSIER --- */}
        <section id="rules-section" className="scroll-mt-20 space-y-5">
          
          {/* Section Header */}
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan uppercase tracking-[0.2em] font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>OFFICIAL PROTOCOLS</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase mt-1">
              RULES & GUIDELINES
            </h2>
            <p className="text-slate-400 text-xs mt-1 font-sans">
              Decisions made by the organizers are final and binding across all events.
            </p>
          </div>

          {/* Mandatory General Guidelines Card */}
          <div className="bg-[#121622] border border-cyan/40 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan uppercase tracking-wider font-bold">
              <ShieldCheck className="w-4 h-4 text-cyan" />
              <span>GENERAL GUIDELINES (MANDATORY)</span>
            </div>
            
            <div className="space-y-2 text-xs text-slate-200 font-sans">
              {GENERAL_GUIDELINES.map((guideline, gIdx) => (
                <div key={gIdx} className="flex items-start gap-2.5 p-2.5 bg-[#0C1018] rounded-lg border border-[#1E2638]">
                  <span className="w-5 h-5 rounded bg-cyan/15 text-cyan border border-cyan/40 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold mt-0.5">
                    {gIdx + 1}
                  </span>
                  <span className="leading-snug">{guideline}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Event Rules Cards List */}
          <div className="space-y-4">
            {OFFICIAL_EVENTS.map((event) => (
              <div 
                key={event.id}
                id={`rules-${event.id}`}
                className="bg-[#121622] border border-[#232B3D] rounded-xl p-4 shadow-lg space-y-3 scroll-mt-24"
              >
                <div className="border-b border-[#1E2638] pb-2.5">
                  <span className="text-[10px] font-mono text-cyan uppercase font-bold block">
                    {event.category} ARENA
                  </span>
                  <h4 className="font-heading font-black text-lg text-white uppercase tracking-wide">
                    {event.name}
                  </h4>
                </div>

                <ol className="space-y-1.5 pt-1">
                  {event.rules && event.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-sans leading-relaxed">
                      <span className="w-5 h-5 rounded bg-[#182030] border border-cyan/30 text-cyan font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION C: VENUE & FESTIVAL INFORMATION --- */}
        <section id="venue-section" className="scroll-mt-20">
          <div className="p-5 sm:p-6 bg-gradient-to-br from-[#141824] to-[#0D1017] border border-cyan/30 rounded-2xl shadow-xl space-y-4 text-center">
            <span className="text-[11px] font-mono text-cyan uppercase tracking-widest font-bold block">
              ST. PAUL'S COLLEGE · DEPT. OF COMPUTER SCIENCE
            </span>

            <h3 className="font-heading font-black text-2xl text-white uppercase tracking-wide">
              HACKATHON 2026
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-mono text-slate-300 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B0E14] border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-red" /> 30 October 2026
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B0E14] border border-white/10">
                <Clock className="w-3.5 h-3.5 text-cyan" /> 12:30 PM Sharp
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B0E14] border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-red" /> College Campus
              </span>
            </div>
          </div>
        </section>

        {/* --- SECTION D: MOBILE FOOTER (TERMINATES CONTINUOUS SCROLL) --- */}
        <div className="pt-4 border-t border-white/10">
          <Footer />
        </div>

      </div>
    </main>
  );
}
