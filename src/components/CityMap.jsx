import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Terminal, 
  Gamepad2, 
  Layers, 
  ChevronRight, 
  Users, 
  User, 
  X,
  Plus,
  Minus,
  Sparkles,
  MapPin
} from 'lucide-react';
import { OFFICIAL_EVENTS } from '../data/events';

export default function CityMap({ events = OFFICIAL_EVENTS }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'Technical' | 'Gaming'
  const [selectedEvent, setSelectedEvent] = useState(events[0] || null);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredEvents = events.filter(e => {
    if (filter === 'all') return true;
    return e.category === filter;
  });

  return (
    <section className="relative w-full bg-[#0B0D11] select-none" id="city-map">
      
      {/* Top Header Controls Bar when rendered inside section or standalone */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1E2432]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan shadow-[0_0_8px_#46C7DE]" />
          <span className="text-xs font-mono font-bold tracking-widest text-ivory uppercase">
            HACKATHON INTERACTIVE DISTRICT GRID
          </span>
        </div>

        {/* View Mode Switcher: Map vs Accessible List */}
        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          className="px-3.5 py-1.5 bg-[#141822] hover:bg-[#1E2432] border border-[#232B3B] text-xs font-heading font-bold text-ivory uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
          aria-label={viewMode === 'map' ? 'Switch to list view' : 'Switch to interactive map'}
        >
          <Layers className="w-3.5 h-3.5 text-cyan" />
          <span>{viewMode === 'map' ? 'List View' : 'Map View'}</span>
        </button>
      </div>

      {viewMode === 'map' ? (
        /* =========================================================================
            PANEL 2 BLUEPRINT: INTERACTIVE 3D URBAN DISTRICT DISCOVERY MAP
        ========================================================================= */
        <div className="relative w-full bg-[#0A0D13] border border-[#1E2534] rounded-xl overflow-hidden shadow-2xl min-h-[620px] lg:min-h-[720px] flex items-center justify-center">
          
          {/* Subtle Ambient City Glow Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#172236]/40 via-[#0B0F17]/90 to-[#07090D] pointer-events-none" />

          {/* SVG Canvas for Map Topology, Roads, and Grids */}
          <div 
            className="relative w-full h-full min-h-[620px] lg:min-h-[720px] transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            <svg 
              viewBox="0 0 1200 600" 
              className="w-full h-full object-cover min-h-[620px] lg:min-h-[720px]"
              aria-label="Hackathon City Map showing Technical District and Gaming District"
            >
              <defs>
                {/* Tech Grid */}
                <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1"/>
                </pattern>
                
                {/* Neon Glows */}
                <radialGradient id="cyanPinGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#46C7DE" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#46C7DE" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="magentaPinGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E5385D" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#E5385D" stopOpacity="0"/>
                </radialGradient>
              </defs>

              {/* Grid Fill */}
              <rect width="1200" height="600" fill="url(#city-grid)"/>

              {/* Stylized City Coastline and Waterway */}
              <path 
                d="M 570 0 C 540 180, 610 320, 580 460 C 565 530, 600 600, 600 600 L 640 600 C 640 600, 605 530, 620 460 C 650 320, 580 180, 610 0 Z" 
                fill="#070C14" 
                stroke="#1B293C" 
                strokeWidth="1.5"
              />

              {/* District Alpha Boundaries (Technical) */}
              <path 
                d="M 60 50 L 540 50 L 560 550 L 60 550 Z" 
                fill="rgba(70, 199, 222, 0.02)" 
                stroke="rgba(70, 199, 222, 0.18)" 
                strokeDasharray="6 4" 
                strokeWidth="1.5"
              />

              {/* District Beta Boundaries (Gaming) */}
              <path 
                d="M 640 50 L 1140 50 L 1140 550 L 660 550 Z" 
                fill="rgba(229, 56, 93, 0.02)" 
                stroke="rgba(229, 56, 93, 0.18)" 
                strokeDasharray="6 4" 
                strokeWidth="1.5"
              />

              {/* Major Glowing Arterial Roads & Neon Expressways */}
              <g stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none">
                <line x1="100" y1="210" x2="1100" y2="210" />
                <line x1="100" y1="360" x2="1100" y2="360" />
                <line x1="280" y1="80" x2="280" y2="520" />
                <line x1="440" y1="80" x2="440" y2="520" />
                <line x1="760" y1="80" x2="760" y2="520" />
                <line x1="980" y1="80" x2="980" y2="520" />
              </g>

              {/* Bridge Connections */}
              <rect x="560" y="204" width="70" height="12" fill="#151C28" stroke="#46C7DE" strokeWidth="1" />
              <rect x="575" y="354" width="70" height="12" fill="#151C28" stroke="#E5385D" strokeWidth="1" />

              {/* Stylized Buildings / 3D Isometric City Silhouettes */}
              <g fill="#101520" stroke="#1D2636" strokeWidth="1">
                {/* Tech District Buildings */}
                <rect x="180" y="160" width="60" height="40" rx="3" />
                <rect x="340" y="100" width="70" height="45" rx="3" />
                <rect x="150" y="380" width="55" height="50" rx="3" />
                <rect x="310" y="290" width="65" height="50" rx="3" />
                <rect x="430" y="220" width="60" height="45" rx="3" />

                {/* Gaming District Buildings */}
                <rect x="690" y="120" width="70" height="45" rx="3" />
                <rect x="910" y="170" width="80" height="45" rx="3" />
                <rect x="770" y="340" width="60" height="45" rx="3" />
                <rect x="990" y="360" width="80" height="60" rx="4" />
              </g>

              {/* ========================================================
                  BLUEPRINT NUMBERED MARKERS (01 to 09)
              ======================================================== */}
              {filteredEvents.map((event) => {
                const isSelected = selectedEvent?.id === event.id;
                const isTech = event.category === 'Technical';
                const coords = event.mapCoords || { x: 600, y: 300 };
                const numText = event.number || (isTech ? '01' : '06');

                return (
                  <g 
                    key={event.id}
                    className="cursor-pointer group focus:outline-none"
                    onClick={() => setSelectedEvent(event)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Marker ${numText}: ${event.name} (${event.category})`}
                  >
                    {/* Glowing Aura Ring */}
                    <circle 
                      cx={coords.x} 
                      cy={coords.y} 
                      r={isSelected ? "28" : "20"} 
                      fill={isTech ? "url(#cyanPinGlow)" : "url(#magentaPinGlow)"}
                      className={isSelected ? "animate-pulse opacity-90" : "group-hover:opacity-100 opacity-50 transition-opacity"}
                    />

                    {/* Circular Pin Base */}
                    <circle 
                      cx={coords.x} 
                      cy={coords.y} 
                      r={isSelected ? "17" : "14"} 
                      fill="#0B0E14" 
                      stroke={isTech ? '#46C7DE' : '#E5385D'} 
                      strokeWidth={isSelected ? "3" : "2"}
                      className="transition-all duration-200"
                    />

                    {/* Pin Number Text */}
                    <text
                      x={coords.x}
                      y={coords.y + 4.5}
                      textAnchor="middle"
                      fill={isTech ? '#46C7DE' : '#E5385D'}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {numText}
                    </text>

                    {/* Floating Title Tooltip */}
                    <g transform={`translate(${coords.x}, ${coords.y - 24})`}>
                      <rect
                        x="-48"
                        y="-16"
                        width="96"
                        height="18"
                        rx="3"
                        fill="#0E121B"
                        stroke={isSelected ? (isTech ? '#46C7DE' : '#E5385D') : "rgba(255, 255, 255, 0.15)"}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        fill="#F3F0E8"
                        fontSize="8.5"
                        fontFamily="sans-serif"
                        fontWeight="bold"
                        letterSpacing="0.5"
                      >
                        {event.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ========================================================
              BLUEPRINT OVERLAYS MATCHING PANEL 2
          ======================================================== */}

          {/* 1. Top-Left Overlay: EXPLORE THE CITY */}
          <div className="absolute top-6 left-6 z-20 pointer-events-none max-w-sm">
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-ivory tracking-tight uppercase leading-none drop-shadow-lg">
              EXPLORE<br />THE CITY
            </h2>
            <p className="text-muted text-xs sm:text-sm font-sans font-medium mt-2 leading-snug drop-shadow-md">
              9 EVENTS. TWO DISTRICTS.<br />
              <span className="text-ivory font-semibold">ONE UNFORGETTABLE EXPERIENCE.</span>
            </p>
          </div>

          {/* 2. Top-Right Street Art: VEXORIS CITY Script */}
          <div className="absolute top-6 right-8 z-20 pointer-events-none hidden sm:block">
            <span className="font-script text-2xl sm:text-3xl text-cyan/70 tracking-widest drop-shadow-md -rotate-6 block">
              HACKATHON CITY
            </span>
          </div>

          {/* 3. District Overlay Card: TECH DISTRICT (Left side over map) */}
          <div className="absolute top-36 left-6 z-20 hidden md:flex items-center gap-3 px-4 py-2.5 bg-[#0C1018]/90 backdrop-blur-md border border-cyan/40 rounded-lg shadow-xl shadow-cyan/5">
            <div className="w-8 h-8 rounded-md bg-cyan/20 border border-cyan/40 flex items-center justify-center text-cyan">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-black text-ivory tracking-wider uppercase">
                TECH DISTRICT
              </div>
              <div className="text-[11px] font-mono text-cyan font-bold">
                5 Events
              </div>
            </div>
          </div>

          {/* 4. District Overlay Card: GAMING DISTRICT (Right side over map) */}
          <div className="absolute top-36 right-6 z-20 hidden md:flex items-center gap-3 px-4 py-2.5 bg-[#0C1018]/90 backdrop-blur-md border border-red/40 rounded-lg shadow-xl shadow-red/5">
            <div className="w-8 h-8 rounded-md bg-red/20 border border-red/40 flex items-center justify-center text-red">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-heading font-black text-ivory tracking-wider uppercase">
                GAMING DISTRICT
              </div>
              <div className="text-[11px] font-mono text-red font-bold">
                4 Events
              </div>
            </div>
          </div>

          {/* 5. Center Overlay Badge: MAIN ARENA (Opening - Closing) */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-[#121620]/90 backdrop-blur-md border border-amber-400/40 rounded-full shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <div className="text-center">
              <span className="text-[10px] font-heading font-bold text-amber-300 tracking-wider uppercase block leading-none">
                MAIN ARENA
              </span>
              <span className="text-[9px] font-mono text-muted block leading-none mt-0.5">
                OPENING · CLOSING · SPECIALS
              </span>
            </div>
          </div>

          {/* 6. Bottom-Left Category Filters matching Panel 2 */}
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-[#0B0E14]/90 backdrop-blur-md p-1.5 rounded-lg border border-[#202738] shadow-2xl">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded text-[11px] font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === 'all'
                  ? 'bg-ivory text-[#0B0D11] shadow-sm'
                  : 'text-muted hover:text-ivory'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${filter === 'all' ? 'bg-[#0B0D11]' : 'border border-muted'}`} />
              <span>ALL EVENTS</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('Technical')}
              className={`px-3 py-1.5 rounded text-[11px] font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === 'Technical'
                  ? 'bg-cyan text-[#0B0D11] shadow-sm'
                  : 'text-muted hover:text-cyan'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${filter === 'Technical' ? 'bg-[#0B0D11]' : 'border border-cyan'}`} />
              <span>TECHNICAL</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('Gaming')}
              className={`px-3 py-1.5 rounded text-[11px] font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === 'Gaming'
                  ? 'bg-red text-ivory shadow-sm'
                  : 'text-muted hover:text-red'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${filter === 'Gaming' ? 'bg-ivory' : 'border border-red'}`} />
              <span>GAMING</span>
            </button>
          </div>

          {/* 7. Bottom-Right Street Script & Zoom Controls matching Panel 2 */}
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-5">
            <span className="font-script text-xl sm:text-2xl text-pink-500/90 tracking-wider -rotate-3 select-none pointer-events-none drop-shadow-md hidden sm:inline-block">
              PICK A MISSION
            </span>

            {/* Zoom Controls */}
            <div className="flex items-center bg-[#0B0E14]/90 backdrop-blur-md rounded-lg border border-[#202738] p-1 shadow-lg">
              <button
                type="button"
                onClick={() => setZoomLevel(Math.min(zoomLevel + 0.15, 1.45))}
                className="p-1.5 text-muted hover:text-ivory rounded hover:bg-[#1A2230] transition-colors"
                title="Zoom In"
                aria-label="Zoom in on map"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(Math.max(zoomLevel - 0.15, 0.85))}
                className="p-1.5 text-muted hover:text-ivory rounded hover:bg-[#1A2230] transition-colors"
                title="Zoom Out"
                aria-label="Zoom out on map"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 8. Selected Event Interactive Floating Preview Card */}
          {selectedEvent && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-20 sm:left-1/2 sm:-translate-x-1/2 z-30 w-[92%] sm:w-[460px] bg-[#0E121B]/95 backdrop-blur-xl border border-[#232C3D] p-5 rounded-xl shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    selectedEvent.category === 'Technical' 
                      ? 'bg-cyan/20 text-cyan border border-cyan/40' 
                      : 'bg-red/20 text-red border border-red/40'
                  }`}>
                    {selectedEvent.badge || `${selectedEvent.number} ${selectedEvent.category.slice(0,4).toUpperCase()}`}
                  </span>
                  <span className="text-xs font-mono font-medium text-muted">
                    {selectedEvent.venue} • 12:30 PM
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 rounded text-muted hover:text-ivory hover:bg-white/10 transition-colors"
                  aria-label="Close preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-heading font-black text-xl text-ivory tracking-wide uppercase">
                {selectedEvent.name}
              </h3>

              <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-[#1C2330]">
                <span className="text-[11px] font-mono text-muted truncate">
                  {selectedEvent.district}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/events/${selectedEvent.id}`}
                    className="px-4 py-1.5 bg-[#1C2330] hover:bg-cyan hover:text-[#0B0D11] text-ivory text-xs font-heading font-bold uppercase tracking-wider rounded transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* =========================================================================
            ACCESSIBLE LIST VIEW FOR KEYBOARD / TOUCH AUDITING
        ========================================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <div 
              key={event.id}
              className="p-5 bg-[#121620] border border-[#202634] hover:border-cyan/40 rounded-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                  event.category === 'Technical' 
                    ? 'bg-cyan/15 text-cyan border border-cyan/30' 
                    : 'bg-red/15 text-red border border-red/30'
                }`}>
                  {event.badge || event.category}
                </span>
                <span className="text-xs font-mono text-muted">
                  {event.venue} • 12:30 PM
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl text-ivory mb-3 uppercase">
                {event.name}
              </h3>

              <div className="pt-3 border-t border-[#1C2330] flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted truncate">
                  {event.district}
                </span>
                <Link
                  to={`/events/${event.id}`}
                  className="text-xs font-heading font-bold text-cyan hover:text-ivory flex items-center gap-1 uppercase tracking-wider"
                >
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </section>
  );
}

