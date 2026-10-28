import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight,
  Users
} from 'lucide-react';
import { getEventById } from '../lib/db';
import EventArtwork from '../components/EventArtwork';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventById(id).then(data => {
      setEvent(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D11] pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <span className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full inline-block animate-spin mb-4" />
          <p className="text-xs font-mono uppercase tracking-widest text-muted">Retrieving event specification...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0B0D11] pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading font-black text-2xl text-ivory mb-2">EVENT NOT FOUND</h2>
          <p className="text-muted text-xs mb-6">The requested competition arena was not found in the official registry.</p>
          <Link
            to="/events"
            className="px-5 py-2.5 bg-ivory text-[#0B0D11] text-xs font-heading font-bold uppercase rounded"
          >
            Back to Events Directory
          </Link>
        </div>
      </div>
    );
  }

  const isTech = event.category === 'Technical';
  const numberBadge = event.badge || `${event.number || '01'} ${event.category.toUpperCase()} EVENT`;

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-24 text-slate-100 relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            to="/events" 
            className="inline-flex items-center gap-2 text-xs font-heading font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Link>
        </div>

        {/* Hero Banner Card */}
        <div className="relative bg-[#121622]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl mb-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[340px] items-stretch">
            
            {/* Left Content Area */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between z-10">
              
              <div>
                {/* Badge without crown */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider ${
                    isTech 
                      ? 'bg-cyan text-[#0B0D11]' 
                      : 'bg-red text-ivory'
                  }`}>
                    {event.number ? `${event.number} ${event.category.toUpperCase()} EVENT` : numberBadge}
                  </span>

                  <span className="px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-[#141A26] text-cyan border border-cyan/40">
                    {event.id === 'debate' || event.id === 'quiz'
                      ? 'FORMAT: DUO (2 PARTICIPANTS)'
                      : event.format === 'solo'
                        ? 'FORMAT: SOLO (1 PARTICIPANT)'
                        : `FORMAT: SQUAD (${event.minTeamSize}-${event.maxTeamSize} PLAYERS)`}
                  </span>
                </div>

                {/* Big Bold Headline */}
                <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase mb-2">
                  {event.name}
                </h1>

                {/* Subtitle / Tagline */}
                <p className="font-heading font-bold text-slate-300 sm:text-base tracking-wider uppercase">
                  {event.headline || event.tagline || 'COMPETE · CONQUER · PREVAIL'}
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-6 flex flex-wrap items-center gap-4">
                <Link
                  to={`/events/${event.id}/register`}
                  className={`px-7 py-3 text-xs font-heading font-black uppercase tracking-[0.16em] rounded-xl transition-all shadow-lg flex items-center gap-2 ${
                    isTech 
                      ? 'bg-cyan text-[#0B0D11] hover:bg-white' 
                      : 'bg-[#E5385D] text-white hover:bg-[#F43F68]'
                  }`}
                >
                  <span>Register for Event</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/rules"
                  className="px-6 py-3 bg-[#171D27] hover:bg-[#202735] text-slate-200 hover:text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl border border-[#232C3D] transition-colors"
                >
                  View Event Rules
                </Link>

                <Link
                  to="/events"
                  className="px-6 py-3 bg-[#171D27] hover:bg-[#202735] text-slate-200 hover:text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl border border-[#232C3D] transition-colors"
                >
                  Back to All Events
                </Link>
              </div>

            </div>

            {/* Right Column: Original Artwork matching hacker/server room / arena visual */}
            <div className="lg:col-span-5 relative bg-[#090C12] border-t lg:border-t-0 lg:border-l border-[#1E2534] min-h-[260px] flex items-center justify-center overflow-hidden">
              <EventArtwork 
                eventId={event.id} 
                category={event.category} 
                className="w-full h-full object-cover min-h-[260px]" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#10141D] via-transparent to-transparent hidden lg:block opacity-70" />
            </div>

          </div>

          {/* Horizontal Pill Metadata Bar */}
          <div className="px-6 sm:px-10 py-3.5 bg-[#0C0F16] border-t border-[#1C2331] flex flex-wrap items-center gap-4 sm:gap-7 text-xs font-heading font-bold uppercase tracking-wider text-muted">
            <span className="flex items-center gap-2 text-ivory">
              <Calendar className="w-3.5 h-3.5 text-cyan" />
              <span>OCTOBER 30, 2026</span>
            </span>

            <span className="text-white/20 hidden sm:inline">|</span>

            <span className="flex items-center gap-2 text-ivory">
              <Clock className="w-3.5 h-3.5 text-cyan" />
              <span>12:30 PM</span>
            </span>

            <span className="text-white/20 hidden sm:inline">|</span>

            <span className="flex items-center gap-2 text-cyan font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>{event.id === 'debate' || event.id === 'quiz' ? 'DUO (2 PARTICIPANTS)' : event.format === 'solo' ? 'SOLO (1 PARTICIPANT)' : `SQUAD (${event.minTeamSize}-${event.maxTeamSize} PLAYERS)`}</span>
            </span>

            <span className="text-white/20 hidden sm:inline">|</span>

            <span className="flex items-center gap-2 text-ivory">
              <MapPin className="w-3.5 h-3.5 text-cyan" />
              <span>VENUE: {event.venue}</span>
            </span>

            {event.coordinator && (
              <>
                <span className="text-white/20 hidden sm:inline">|</span>
                <span className="flex items-center gap-2 text-cyan">
                  <span>COORDINATOR: {event.coordinator}</span>
                </span>
              </>
            )}
          </div>

        </div>

        {/* Lower Two-Column Section matching Blueprint Panel 4: About & Eligibility on Left, Rules on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-[#10141D] border border-[#1E2534] rounded-xl p-6 sm:p-10 shadow-xl">
          
          {/* Left Column: About & Eligibility */}
          <div className="space-y-8">
            <div>
              <h2 className="font-heading font-black text-xl text-ivory tracking-wide uppercase mb-3">
                About
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans font-normal">
                {event.fullDescription || event.shortDescription}
              </p>
            </div>

            <div className="pt-6 border-t border-[#1C2331]">
              <h3 className="font-heading font-black text-base text-white tracking-wide uppercase mb-2">
                Eligibility
              </h3>
              <p className="text-slate-300 text-sm font-sans font-normal leading-relaxed">
                {event.eligibility || 'Open to all departments and registered undergraduate/postgraduate students.'}
              </p>
            </div>
          </div>

          {/* Right Column: Rules matching Blueprint Panel 4 */}
          <div className="border-t lg:border-t-0 lg:border-l border-[#1C2331] pt-6 lg:pt-0 lg:pl-10">
            <h2 className="font-heading font-black text-xl text-white tracking-wide uppercase mb-4">
              Rules & Regulations
            </h2>

            <ul className="space-y-4">
              {event.rules && event.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-sm sm:text-[15px] text-slate-200 font-sans font-normal">
                  <span className="w-6 h-6 rounded-md bg-[#161D2B] border border-cyan/40 text-cyan text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-[#1C2331] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs font-mono text-slate-400">
                Official tournament guidelines & scoring criteria
              </span>

              <Link
                to="/rules"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider text-cyan hover:text-white transition-colors"
              >
                <span>Full Rules Dossier</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

