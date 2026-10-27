import React from 'react';

export default function EventArtwork({ eventId, category, className = "w-full h-44" }) {
  const isTech = category === 'Technical';
  const primaryAccent = isTech ? '#56C8D8' : '#D75A55';

  switch (eventId) {
    // 1. IT MANAGER
    case 'it-manager':
      return (
        <div className={`relative bg-[#0F1217] overflow-hidden select-none border-b border-[#1E242F] ${className}`}>
          <svg viewBox="0 0 400 180" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="itm-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#121720" />
                <stop offset="100%" stopColor="#0B0D11" />
              </linearGradient>
              <linearGradient id="itm-cyan" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#56C8D8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#56C8D8" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <rect width="400" height="180" fill="url(#itm-sky)" />
            {/* Grid Lines */}
            <path d="M 0 40 L 400 40 M 0 80 L 400 80 M 0 120 L 400 120 M 0 160 L 400 160" stroke="#1E232D" strokeWidth="0.8" />
            <path d="M 80 0 L 80 180 M 160 0 L 160 180 M 240 0 L 240 180 M 320 0 L 320 180" stroke="#1E232D" strokeWidth="0.8" />
            {/* Executive Corporate Towers Silhouette */}
            <rect x="50" y="60" width="45" height="120" fill="#151922" stroke="#252C3B" strokeWidth="1" />
            <rect x="110" y="35" width="60" height="145" fill="#181D27" stroke="#252C3B" strokeWidth="1" />
            <rect x="185" y="50" width="50" height="130" fill="#151922" stroke="#252C3B" strokeWidth="1" />
            <rect x="250" y="25" width="70" height="155" fill="#1A202C" stroke="#2F384A" strokeWidth="1.2" />
            <rect x="335" y="70" width="45" height="110" fill="#151922" stroke="#252C3B" strokeWidth="1" />
            {/* Skyscraper Windows */}
            <line x1="265" y1="45" x2="305" y2="45" stroke="#56C8D8" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="265" y1="65" x2="305" y2="65" stroke="#F3F0E8" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="265" y1="85" x2="305" y2="85" stroke="#56C8D8" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="125" y1="55" x2="155" y2="55" stroke="#F3F0E8" strokeWidth="1" strokeOpacity="0.3" />
            {/* Holographic Budget & Crisis Telemetry Trend Line */}
            <path d="M 20 130 Q 80 120 140 145 T 240 90 T 320 70 L 380 45" fill="none" stroke="url(#itm-cyan)" strokeWidth="2.5" />
            <circle cx="320" cy="70" r="4" fill="#56C8D8" />
            <circle cx="380" cy="45" r="4.5" fill="#F3F0E8" />
            {/* Telemetry Tag */}
            <text x="25" y="30" fill="#56C8D8" fontSize="10" fontFamily="monospace" letterSpacing="1.5">EXECUTIVE COMMAND HUD // V4.2</text>
          </svg>
        </div>
      );

    // 2. QUIZ
    case 'quiz':
      return (
        <div className={`relative bg-[#0F1217] overflow-hidden select-none border-b border-[#1E242F] ${className}`}>
          <svg viewBox="0 0 400 180" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="qz-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#141822" />
                <stop offset="100%" stopColor="#0B0D11" />
              </linearGradient>
            </defs>
            <rect width="400" height="180" fill="url(#qz-bg)" />
            {/* Neural Network Circuit Pathways */}
            <path d="M 30 90 L 100 90 L 140 40 L 220 40 L 260 110 L 340 110 L 370 140" fill="none" stroke="#252D3D" strokeWidth="1.5" />
            <path d="M 60 140 L 120 140 L 160 90 L 250 90 L 300 40 L 360 40" fill="none" stroke="#252D3D" strokeWidth="1.5" />
            <path d="M 100 90 L 160 90 L 220 140 L 290 140" fill="none" stroke="#56C8D8" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="4 3" />
            {/* Logic Nodes */}
            <circle cx="100" cy="90" r="5" fill="#141822" stroke="#56C8D8" strokeWidth="2" />
            <circle cx="160" cy="90" r="4" fill="#56C8D8" />
            <circle cx="220" cy="40" r="6" fill="#141822" stroke="#F3F0E8" strokeWidth="2" />
            <circle cx="260" cy="110" r="5" fill="#141822" stroke="#56C8D8" strokeWidth="2" />
            <circle cx="340" cy="110" r="4" fill="#56C8D8" />
            <circle cx="300" cy="40" r="5" fill="#F3F0E8" />
            {/* Central Holographic Glyphs */}
            <text x="180" y="115" fill="#56C8D8" fontSize="42" fontFamily="monospace" fontWeight="bold" opacity="0.3">?</text>
            <text x="215" y="85" fill="#9298A2" fontSize="10" fontFamily="monospace" letterSpacing="2">0x7F_ALGO_TREE</text>
            <text x="35" y="30" fill="#56C8D8" fontSize="10" fontFamily="monospace" letterSpacing="1.5">CIRCUIT KNOWLEDGE MATRIX</text>
          </svg>
        </div>
      );

    // 3. FUNZOVA
    case 'funzova':
      return (
        <div className={`relative bg-[#0F1217] overflow-hidden select-none border-b border-[#1E242F] ${className}`}>
          <svg viewBox="0 0 400 180" className="w-full h-full object-cover">
            <rect width="400" height="180" fill="#0C0E13" />
            {/* Code Fragment Grid */}
            <g opacity="0.25" fill="#9298A2" fontFamily="monospace" fontSize="9">
              <text x="25" y="45">{`01 > function decodeRelay(cipher, key) {`}</text>
              <text x="25" y="65">{`02 >   return cipher.map(x => x ^ 0xAF);`}</text>
              <text x="25" y="85">{`03 > } // REVERSE ENGINEER STACK`}</text>
              <text x="25" y="105">{`04 > while (puzzle.unsolved) execute();`}</text>
            </g>
            {/* Interlocking Puzzle Vector */}
            <path d="M 240 50 L 290 50 C 290 40, 310 40, 310 50 L 360 50 L 360 100 C 370 100, 370 120, 360 120 L 360 150 L 310 150 C 310 160, 290 160, 290 150 L 240 150 Z" 
              fill="#161B24" stroke="#56C8D8" strokeWidth="1.5" strokeOpacity="0.7" />
            {/* Cyan Glitch Accent */}
            <rect x="270" y="85" width="40" height="6" fill="#56C8D8" opacity="0.8" />
            <circle cx="310" cy="100" r="12" fill="none" stroke="#F3F0E8" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="25" y="150" fill="#56C8D8" fontSize="10" fontFamily="monospace" letterSpacing="1.5">CRYPTIC RELAY & TECH DECODE</text>
          </svg>
        </div>
      );

    // 4. VEXTALK
    case 'vextalk':
      return (
        <div className={`relative bg-[#0F1217] overflow-hidden select-none border-b border-[#1E242F] ${className}`}>
          <svg viewBox="0 0 400 180" className="w-full h-full object-cover">
            <rect width="400" height="180" fill="#0D1016" />
            {/* Keynote Spotlight Cone */}
            <polygon points="200,0 120,180 280,180" fill="rgba(86, 200, 216, 0.05)" />
            {/* Soundwaves / Frequency Rings */}
            <circle cx="200" cy="90" r="30" fill="none" stroke="#56C8D8" strokeWidth="1.2" strokeOpacity="0.7" />
            <circle cx="200" cy="90" r="55" fill="none" stroke="#56C8D8" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="200" cy="90" r="85" fill="none" stroke="#56C8D8" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="4 4" />
            {/* Microphone Vector */}
            <rect x="194" y="65" width="12" height="24" rx="6" fill="#191F2B" stroke="#F3F0E8" strokeWidth="1.5" />
            <path d="M 188 78 C 188 95, 212 95, 212 78" fill="none" stroke="#F3F0E8" strokeWidth="1.5" />
            <line x1="200" y1="95" x2="200" y2="115" stroke="#F3F0E8" strokeWidth="1.5" />
            <line x1="190" y1="115" x2="210" y2="115" stroke="#F3F0E8" strokeWidth="2" />
            {/* Audio Waveforms */}
            <path d="M 40 90 L 70 90 L 80 60 L 90 120 L 100 70 L 110 110 L 120 90 L 150 90" fill="none" stroke="#56C8D8" strokeWidth="1.2" strokeOpacity="0.6" />
            <path d="M 250 90 L 280 90 L 290 60 L 300 120 L 310 70 L 320 110 L 330 90 L 360 90" fill="none" stroke="#56C8D8" strokeWidth="1.2" strokeOpacity="0.6" />
            <text x="25" y="30" fill="#56C8D8" fontSize="10" fontFamily="monospace" letterSpacing="1.5">KEYNOTE DISCOURSE // ACOUSTIC SPECTRUM</text>
          </svg>
        </div>
      );

    // 5. DEBATE
    case 'debate':
      return (
        <div className={`relative bg-[#0F1217] overflow-hidden select-none border-b border-[#1E242F] ${className}`}>
          <svg viewBox="0 0 400 180" className="w-full h-full object-cover">
            <rect width="400" height="180" fill="#0C0E13" />
            {/* Opposing Parliamentary Pillars */}
            <rect x="70" y="40" width="30" height="110" fill="#141822" stroke="#252D3D" strokeWidth="1.2" />
            <rect x="65" y="32" width="40" height="8" fill="#1C2230" stroke="#56C8D8" strokeWidth="1" />
            <rect x="65" y="150" width="40" height="8" fill="#1C2230" stroke="#252D3D" strokeWidth="1" />

            <rect x="300" y="40" width="30" height="110" fill="#141822" stroke="#252D3D" strokeWidth="1.2" />
            <rect x="295" y="32" width="40" height="8" fill="#1C2230" stroke="#56C8D8" strokeWidth="1" />
            <rect x="295" y="150" width="40" height="8" fill="#1C2230" stroke="#252D3D" strokeWidth="1" />

            {/* Scale of Justice / Rhetoric Fulcrum in Center */}
            <line x1="200" y1="50" x2="200" y2="135" stroke="#56C8D8" strokeWidth="2" />
            <polygon points="190,135 210,135 200,120" fill="#56C8D8" />
            <line x1="140" y1="65" x2="260" y2="65" stroke="#F3F0E8" strokeWidth="2" />
            {/* Scale Pans */}
            <path d="M 140 65 L 125 105 L 155 105 Z" fill="none" stroke="#9298A2" strokeWidth="1.2" />
            <path d="M 260 65 L 245 105 L 275 105 Z" fill="none" stroke="#9298A2" strokeWidth="1.2" />

            <text x="115" y="25" fill="#56C8D8" fontSize="9" fontFamily="monospace" letterSpacing="1">PROPOSITION</text>
            <text x="245" y="25" fill="#D75A55" fontSize="9" fontFamily="monospace" letterSpacing="1">OPPOSITION</text>
            <text x="25" y="168" fill="#9298A2" fontSize="9" fontFamily="monospace">PARLIAMENTARY RULES OF ORDER</text>
          </svg>
        </div>
      );

    // 6. BGMI
    case 'bgmi':
      return (
        <div className={`relative bg-[#0F1217] overflow-hidden select-none border-b border-[#1E242F] ${className}`}>
          <svg viewBox="0 0 400 180" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="bgmi-radial" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#D75A55" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#D75A55" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="400" height="180" fill="#101217" />
            {/* Topographic Elevation Map Contours */}
            <path d="M 10 30 Q 80 15 150 45 T 280 40 T 390 20" fill="none" stroke="#252126" strokeWidth="1.2" />
            <path d="M 0 70 Q 110 50 180 85 T 320 80 T 400 60" fill="none" stroke="#2B2329" strokeWidth="1.2" />
            <path d="M 10 120 Q 90 95 190 125 T 330 115 T 390 140" fill="none" stroke="#252126" strokeWidth="1.2" />
            {/* Playzone Circle Boundary */}
            <circle cx="200" cy="90" r="65" fill="none" stroke="#D75A55" strokeWidth="1.8" strokeDasharray="6 3" />
            <circle cx="200" cy="90" r="40" fill="url(#bgmi-radial)" stroke="#F3F0E8" strokeWidth="1.2" />
            {/* Compass / Coordinate Center */}
            <line x1="200" y1="40" x2="200" y2="140" stroke="#D75A55" strokeWidth="0.8" opacity="0.6" />
            <line x1="150" y1="90" x2="250" y2="90" stroke="#D75A55" strokeWidth="0.8" opacity="0.6" />
            {/* Airdrop Box Vector */}
            <rect x="190" y="80" width="20" height="20" fill="#D75A55" stroke="#F3F0E8" strokeWidth="1.2" />
            <line x1="190" y1="90" x2="210" y2="90" stroke="#101216" strokeWidth="2" />
            <text x="25" y="30" fill="#D75A55" fontSize="10" fontFamily="monospace" letterSpacing="1.5">ZONE COLLAPSE // TACTICAL DROP</text>
          </svg>
        </div>
      );

    // 7. NFS
    case 'nfs':
      return (
        <div className={`relative bg-[#0F1217] overflow-hidden select-none border-b border-[#1E242F] ${className}`}>
          <svg viewBox="0 0 400 180" className="w-full h-full object-cover">
            <rect width="400" height="180" fill="#0D0F14" />
            {/* Asphalt Highway Grid & Perspective Horizon */}
            <path d="M 0 180 L 160 80 L 240 80 L 400 180" fill="#12151D" stroke="#1D222E" strokeWidth="1" />
            <line x1="200" y1="80" x2="200" y2="180" stroke="#2A3244" strokeWidth="2" strokeDasharray="12 10" />
            {/* Glowing Red Taillight Trails (Evoking the Hero car atmosphere) */}
            <path d="M 220 85 Q 260 110 330 165" fill="none" stroke="#D75A55" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
            <path d="M 228 85 Q 275 112 355 168" fill="none" stroke="#D75A55" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            <path d="M 210 85 Q 240 110 270 170" fill="none" stroke="#FFA39E" strokeWidth="1.8" strokeLinecap="round" />
            {/* Tachometer Dial Arc in Background */}
            <path d="M 90 140 A 50 50 0 0 1 170 100" fill="none" stroke="#D75A55" strokeWidth="3" strokeOpacity="0.7" />
            <text x="125" y="130" fill="#F3F0E8" fontSize="14" fontFamily="monospace" fontWeight="bold">8.5k</text>
            <text x="125" y="142" fill="#9298A2" fontSize="7" fontFamily="monospace">RPM REDLINE</text>
            <text x="25" y="30" fill="#D75A55" fontSize="10" fontFamily="monospace" letterSpacing="1.5">METROPOLITAN DRIFT CORRIDOR</text>
          </svg>
        </div>
      );

    // 8. FREE FIRE
    case 'free-fire':
    case 'deadshot':
      return (
        <div className={`relative bg-[#0F1217] overflow-hidden select-none border-b border-[#1E242F] ${className}`}>
          <svg viewBox="0 0 400 180" className="w-full h-full object-cover">
            <rect width="400" height="180" fill="#0C0E13" />
            {/* Free Fire Zone Safe Circle & Airdrop Grid */}
            <circle cx="200" cy="90" r="75" fill="none" stroke="#E5385D" strokeWidth="1.8" strokeOpacity="0.4" strokeDasharray="6 4" />
            <circle cx="200" cy="90" r="45" fill="none" stroke="#FFA39E" strokeWidth="2" strokeOpacity="0.8" />
            <circle cx="200" cy="90" r="18" fill="none" stroke="#F3F0E8" strokeWidth="1.2" strokeOpacity="0.6" />
            <circle cx="200" cy="90" r="3" fill="#E5385D" />
            
            {/* Airdrop Flare / Trajectory Rays */}
            <line x1="80" y1="90" x2="320" y2="90" stroke="#E5385D" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="200" y1="15" x2="200" y2="165" stroke="#E5385D" strokeWidth="1.5" strokeOpacity="0.7" />
            
            {/* Tactical Bermuda / Kalahari Contour vectors */}
            <path d="M 60 140 Q 130 90 200 130 T 340 100" fill="none" stroke="#FFA39E" strokeWidth="1.2" strokeOpacity="0.5" />
            <rect x="188" y="78" width="24" height="24" fill="none" stroke="#E5385D" strokeWidth="1.2" strokeDasharray="3 2" />
            
            {/* Booyah / Kill Target Readouts */}
            <text x="212" y="74" fill="#FFA39E" fontSize="9" fontFamily="monospace">ZONE: SAFE</text>
            <text x="212" y="116" fill="#9298A2" fontSize="8" fontFamily="monospace">SURVIVAL: BERMUDA</text>
            <text x="25" y="30" fill="#E5385D" fontSize="10" fontFamily="monospace" letterSpacing="1.5">FREE FIRE BATTLEGROUND</text>
          </svg>
        </div>
      );

    // 9. E-FOOTBALL
    case 'efootball':
    case 'e-football':
    case 'real-cricket':
      return (
        <div className={`relative bg-[#0F1217] overflow-hidden select-none border-b border-[#1E242F] ${className}`}>
          <svg viewBox="0 0 400 180" className="w-full h-full object-cover">
            <rect width="400" height="180" fill="#0D0F14" />
            {/* Floodlit Football Pitch Outer Boundary */}
            <rect x="60" y="35" width="280" height="120" rx="6" fill="#121620" stroke="#252D3D" strokeWidth="1.8" />
            {/* Halfway Line & Center Circle */}
            <line x1="200" y1="35" x2="200" y2="155" stroke="#252D3D" strokeWidth="1.5" />
            <circle cx="200" cy="95" r="28" fill="none" stroke="#E5385D" strokeWidth="1.8" strokeOpacity="0.8" />
            <circle cx="200" cy="95" r="3" fill="#F3F0E8" />
            
            {/* Penalty Boxes */}
            <rect x="60" y="65" width="45" height="60" fill="none" stroke="#252D3D" strokeWidth="1.2" />
            <rect x="295" y="65" width="45" height="60" fill="none" stroke="#252D3D" strokeWidth="1.2" />
            
            {/* Precision Pass & Curler Trajectory Arc */}
            <path d="M 120 130 Q 200 45 285 85" fill="none" stroke="#E5385D" strokeWidth="2.5" strokeDasharray="6 3" />
            <circle cx="285" cy="85" r="5" fill="#F3F0E8" stroke="#E5385D" strokeWidth="1.5" />
            
            {/* Pitch HUD Diagnostics */}
            <text x="25" y="26" fill="#E5385D" fontSize="10" fontFamily="monospace" letterSpacing="1.5">eFOOTBALL 1v1 CHAMPIONSHIP PITCH</text>
            <text x="220" y="145" fill="#9298A2" fontSize="8" fontFamily="monospace">TACTICAL SQUAD ENGINE</text>
          </svg>
        </div>
      );

    default:
      return null;
  }
}
