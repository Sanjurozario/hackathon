import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import EventArtwork from './EventArtwork';

export default function EventCard({ event }) {
  const isTech = event.category === 'Technical';
  const badgeText = event.badge || `${event.number} ${event.category.toUpperCase()}`;

  return (
    <div className={`group relative bg-[#121622]/85 backdrop-blur-md border border-[#222C3E] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
      isTech 
        ? 'hover:border-cyan/50 hover:shadow-[0_14px_40px_rgba(70,199,222,0.15)]' 
        : 'hover:border-[#E5385D]/50 hover:shadow-[0_14px_40px_rgba(229,56,93,0.18)]'
    }`}>
      
      {/* Top Category Accent Line */}
      <div 
        className={`absolute top-0 left-0 right-0 h-[2px] z-20 transition-all duration-300 ${
          isTech 
            ? 'bg-cyan group-hover:h-[3px] shadow-[0_0_8px_#46C7DE]' 
            : 'bg-[#E5385D] group-hover:h-[3px] shadow-[0_0_8px_#E5385D]'
        }`} 
      />

      <div>
        {/* Cinematic Event Artwork Banner */}
        <Link to={`/events/${event.id}`} className="block relative overflow-hidden group/art">
          <EventArtwork 
            eventId={event.id} 
            category={event.category} 
            className="w-full h-44 sm:h-48 transition-transform duration-500 group-hover/art:scale-[1.04]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10141D] via-[#10141D]/20 to-transparent" />
          
          {/* Category Badge Overlay - No solo/group mention */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md ${
              isTech 
                ? 'bg-[#0B0D11]/90 text-cyan border border-cyan/40' 
                : 'bg-[#0B0D11]/90 text-red border border-red/40'
            }`}>
              {badgeText}
            </span>
          </div>

          {/* Status Indicator */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-[#0B0D11]/90 text-cyan border border-cyan/40 backdrop-blur-md">
              OFFICIAL ARENA
            </span>
          </div>
        </Link>

        {/* Content Body: Clean Event Title, Venue & Time without descriptions */}
        <div className="p-5 sm:p-6 space-y-2">
          
          {/* Event Name */}
          <Link to={`/events/${event.id}`} className="block">
            <h3 className="font-heading font-black text-xl sm:text-2xl text-white tracking-wide group-hover:text-cyan transition-colors uppercase">
              {event.name}
            </h3>
          </Link>

          {/* Venue & Schedule metadata */}
          <div className="pt-1 flex items-center gap-2.5 text-xs font-mono text-slate-300">
            <span className="text-cyan font-bold">{event.venue}</span>
            <span className="text-slate-600">•</span>
            <span>30 OCT · 12:30 PM</span>
          </div>

        </div>
      </div>

      {/* Card Actions Footer: Clear contrast and comfortable click targets */}
      <div className="px-5 sm:px-6 py-3.5 border-t border-[#1C2332] bg-[#0C0F17]">
        <Link
          to={`/events/${event.id}`}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-heading font-bold tracking-[0.14em] uppercase transition-all duration-200 flex items-center justify-center gap-2 group/btn ${
            isTech 
              ? 'bg-[#141C2B] text-cyan hover:bg-cyan hover:text-[#0B0D11] border border-cyan/30 shadow-[0_0_12px_rgba(70,199,222,0.15)]' 
              : 'bg-[#1C1422] text-[#FF4B72] hover:bg-[#E5385D] hover:text-white border border-[#E5385D]/30 shadow-[0_0_12px_rgba(229,56,93,0.15)]'
          }`}
        >
          <span>VIEW EVENT DETAILS</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
