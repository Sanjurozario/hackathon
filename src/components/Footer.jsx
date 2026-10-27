import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Terminal, Gamepad2, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#080A0E] border-t border-[#161B24] text-slate-300 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E5385D]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="font-bebas text-3xl sm:text-4xl tracking-[0.16em] text-white">
                HACKATHON<span className="text-[#E5385D] ml-1">26</span>
              </span>
            </div>
            <p className="text-[#E5385D] font-mono font-bold text-xs tracking-[0.25em] uppercase">
              INTRA-COLLEGIATE FESTIVAL
            </p>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md font-sans">
              Uniting competitive programming logic, strategic IT management, and high-speed esports arenas in one grand championship.
            </p>
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11151E] border border-cyan/30 text-xs font-mono text-cyan font-bold">
                <Terminal className="w-3.5 h-3.5" /> 5 TECHNICAL ARENAS
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11151E] border border-[#E5385D]/30 text-xs font-mono text-[#FF4B72] font-bold">
                <Gamepad2 className="w-3.5 h-3.5" /> 4 GAMING ARENAS
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="font-heading text-xs uppercase tracking-[0.2em] text-white font-bold">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan group-hover:translate-x-0.5 transition-transform" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan group-hover:translate-x-0.5 transition-transform" />
                  <span>All Events (9)</span>
                </Link>
              </li>
              <li>
                <Link to="/rules" className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan group-hover:translate-x-0.5 transition-transform" />
                  <span>Rules & Regulations</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan group-hover:translate-x-0.5 transition-transform" />
                  <span>Registration Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Festival Guidelines */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="font-heading text-xs uppercase tracking-[0.2em] text-white font-bold">
              Participant Information
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-sans">
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
                <span>Original College ID Card is mandatory for entry on festival day.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#FF4B72] shrink-0 mt-0.5" />
                <span>Zero registration fee. Free participation across all 9 official arenas.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Terminal className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Participants must report 10 minutes prior to their scheduled event round.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#161B24] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 HACKATHON Collegiate Festival. All rights reserved.</p>
          <p className="font-mono text-xs text-slate-400">
            Fair Play & Discipline Enforced · Valid Student ID Required
          </p>
        </div>
      </div>
    </footer>
  );
}
