import React, { useState, useEffect } from 'react';
import { Compass, Terminal, Gamepad2, Navigation, Layers } from 'lucide-react';
import CityMap from '../components/CityMap';
import { getEvents } from '../lib/db';

export default function MapPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#101216]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mb-8">
        
        {/* Page Title */}
        <div className="border-b border-[#191D23] pb-6 mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan uppercase tracking-[0.2em] mb-2">
            <Compass className="w-4 h-4" />
            <span>METROPOLITAN CARTOGRAPHY</span>
          </div>
          <h1 className="font-headline font-black text-4xl sm:text-5xl lg:text-6xl text-ivory tracking-wide uppercase">
            CITY ARENA MAP
          </h1>
          <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl">
            Interactive tactical map of the HACKATHON campus grounds. Explore the two dedicated districts to discover competition venues, event rules, and registration access.
          </p>
        </div>

        {/* Embedded Map Component */}
        <CityMap events={events} />

        {/* District Territory Briefings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pt-12 border-t border-[#191D23]">
          
          <div className="p-6 bg-[#14171E] border border-surface-border rounded-sm">
            <div className="flex items-center gap-2 text-cyan font-mono text-xs uppercase tracking-wider mb-2">
              <Terminal className="w-4 h-4" />
              <span>DISTRICT ALPHA • TECHNICAL QUADRANT</span>
            </div>
            <h3 className="font-headline font-bold text-xl text-ivory mb-2">
              The Inland Command Posts
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-4">
              District Alpha constitutes the analytical and strategic backbone of HACKATHON. Featuring executive simulation suites for IT Manager, rapid buzzer setups for Quiz, code relays for Funzova, oratory chambers for VexTalk, and parliamentary chambers for Debate.
            </p>
            <div className="text-[11px] font-mono text-muted-dark space-y-1">
              <div>Venues: Room 106, Room 107, Room 116, Room 212, Mini Audi</div>
              <div>Access: Open to all verified student credentials</div>
            </div>
          </div>

          <div className="p-6 bg-[#14171E] border border-surface-border rounded-sm">
            <div className="flex items-center gap-2 text-red font-mono text-xs uppercase tracking-wider mb-2">
              <Gamepad2 className="w-4 h-4" />
              <span>DISTRICT BETA • GAMING CORRIDOR</span>
            </div>
            <h3 className="font-headline font-bold text-xl text-ivory mb-2">
              The Coastal Esports Arena
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Positioned along the vibrant esports wing, District Beta houses mobile battle royale zones for BGMI, simulator rigs for NFS, fast-paced battle zones for Free Fire, and football championship pitches for E-Football.
            </p>
            <div className="text-[11px] font-mono text-muted-dark space-y-1">
              <div>Venues: Room 112, Room 205, Room 206, Small Lab</div>
              <div>Hardware: Tournament-grade network hubs and organizer oversight</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
