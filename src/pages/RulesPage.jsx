import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Terminal, 
  Gamepad2, 
  ChevronRight, 
  FileText, 
  MapPin, 
  Clock, 
  Users, 
  User, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';
import { OFFICIAL_EVENTS, GENERAL_GUIDELINES } from '../data/events';

export default function RulesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeEventId, setActiveEventId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const techEvents = OFFICIAL_EVENTS.filter(e => e.category === 'Technical');
  const gamingEvents = OFFICIAL_EVENTS.filter(e => e.category === 'Gaming');

  const filteredEvents = OFFICIAL_EVENTS.filter(e => {
    if (selectedCategory !== 'All' && e.category !== selectedCategory) return false;
    if (activeEventId !== 'all' && e.id !== activeEventId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = e.name.toLowerCase().includes(q);
      const matchRules = e.rules.some(r => r.toLowerCase().includes(q));
      return matchName || matchRules;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-20 text-slate-100 relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan uppercase tracking-[0.2em] font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>OFFICIAL COMPETITION DOSSIER</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase mt-1">
              RULES & REGULATIONS
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5 font-sans">
              All 9 events commence on 30 October 2026 at 12:30 PM.
            </p>
          </div>

          <Link
            to="/register"
            className="self-start sm:self-auto px-5 py-2.5 bg-[#E5385D] hover:bg-[#F43F68] text-white text-xs font-heading font-black uppercase tracking-wider rounded-full transition-all duration-200 shadow-magenta-pill flex items-center gap-1.5"
          >
            <span>REGISTER</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* GENERAL GUIDELINES - Compact Card */}
        <div className="bg-[#121622]/90 backdrop-blur-md border border-cyan/40 rounded-xl p-4 sm:p-5 mb-6 shadow-[0_4px_20px_rgba(70,199,222,0.08)]">
          <div className="flex items-center gap-2 text-[11px] font-mono text-cyan uppercase tracking-wider font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan" />
            <span>GENERAL GUIDELINES (MANDATORY)</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-200 font-sans">
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

        {/* Quick Filter & Selector Bar */}
        <div className="bg-[#121622] border border-[#232B3D] p-3 sm:p-4 rounded-xl mb-6 shadow-md">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => { setSelectedCategory('All'); setActiveEventId('all'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-white text-[#0B0D11]'
                    : 'bg-[#181F2C] text-slate-300 hover:text-white'
                }`}
              >
                All ({OFFICIAL_EVENTS.length})
              </button>
              <button
                type="button"
                onClick={() => { setSelectedCategory('Technical'); setActiveEventId('all'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                  selectedCategory === 'Technical'
                    ? 'bg-cyan text-[#0B0D11]'
                    : 'bg-[#181F2C] text-slate-300 hover:text-cyan'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" /> Technical ({techEvents.length})
              </button>
              <button
                type="button"
                onClick={() => { setSelectedCategory('Gaming'); setActiveEventId('all'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                  selectedCategory === 'Gaming'
                    ? 'bg-[#E5385D] text-white'
                    : 'bg-[#181F2C] text-slate-300 hover:text-[#F43F68]'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" /> Gaming ({gamingEvents.length})
              </button>
            </div>

            {/* Quick Event Jump */}
            <div className="flex items-center gap-2">
              <label htmlFor="event-select" className="text-[11px] font-mono text-slate-400 uppercase tracking-wider whitespace-nowrap">
                Jump to:
              </label>
              <select
                id="event-select"
                value={activeEventId}
                onChange={(e) => setActiveEventId(e.target.value)}
                className="bg-[#181F2C] border border-[#2B354A] text-white text-xs font-heading rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan"
              >
                <option value="all">Show All 9 Events</option>
                <optgroup label="Technical Events">
                  {techEvents.map(e => (
                    <option key={e.id} value={e.id}>{e.number}. {e.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Gaming Events">
                  {gamingEvents.map(e => (
                    <option key={e.id} value={e.id}>{e.number}. {e.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

          </div>
        </div>

        {/* Small, Compact Event Cards */}
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const isTech = event.category === 'Technical';
            const isSolo = event.format === 'solo';

            const formatLabel = isSolo 
              ? 'Solo Participation (1 Participant)' 
              : event.id === 'quiz' 
                ? 'Team Format (2 Participants)' 
                : 'Squad Format (4 Players)';

            return (
              <div 
                key={event.id}
                id={`event-rules-${event.id}`}
                className="bg-[#121622] border border-[#232B3D] rounded-xl p-4 sm:p-5 shadow-lg transition-all"
              >
                {/* Compact Header: Name + Badges + Metadata + Register Link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-[#1E2638]">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isTech 
                          ? 'bg-cyan/15 text-cyan border border-cyan/40' 
                          : 'bg-[#E5385D]/15 text-[#F43F68] border border-[#E5385D]/40'
                      }`}>
                        {event.badge || event.category}
                      </span>

                      {/* Format tag strictly permitted in Rules section */}
                      <span className="text-[11px] font-mono font-medium text-slate-300 flex items-center gap-1 px-2 py-0.5 rounded bg-[#0D1017] border border-[#1E2536]">
                        {isSolo ? <User className="w-3 h-3 text-cyan" /> : <Users className="w-3 h-3 text-[#FF4B72]" />}
                        <span>{formatLabel}</span>
                      </span>
                    </div>

                    <h2 className="font-heading font-black text-xl sm:text-2xl text-white tracking-wide uppercase">
                      {event.name}
                    </h2>

                    {/* Venue, Coordinator, Time Pills */}
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
                  </div>

                  {/* Register Link */}
                  <div className="shrink-0 self-start sm:self-center">
                    <Link
                      to="/register"
                      className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider rounded-lg transition-all ${
                        isTech 
                          ? 'bg-cyan text-[#0B0D11] hover:bg-white' 
                          : 'bg-[#E5385D] text-white hover:bg-[#F43F68]'
                      }`}
                    >
                      <span>Register</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Compact Rules List Only */}
                <div>
                  <h3 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                    Official Rules:
                  </h3>
                  <ol className="space-y-1.5">
                    {event.rules && event.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-300 font-sans leading-relaxed">
                        <span className="w-5 h-5 rounded bg-[#182030] border border-cyan/30 text-cyan font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ol>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
