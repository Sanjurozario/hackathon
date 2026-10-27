import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const scrollToEvents = (e) => {
    e.preventDefault();
    const el = document.getElementById('events-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/events';
    }
  };

  return (
    <section className="relative w-full md:h-screen md:min-h-screen flex flex-col md:flex-row md:items-center md:justify-center overflow-x-hidden md:overflow-hidden bg-[#0A0412] select-none pt-20 sm:pt-24 md:pt-0 pb-8 sm:pb-12 md:pb-0">
      
      {/* 1. Full-viewport Ambient Sunset Glow */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-3xl opacity-30 scale-110 pointer-events-none -z-10"
        style={{ backgroundImage: `url('/hackathon-hero.png')` }}
      />

      {/* 2. Main Artwork Container */}
      <div className="relative w-full max-w-[1920px] md:max-h-screen flex flex-col items-center justify-center px-3 sm:px-6 md:px-0">
        
        {/* Exact Aspect Ratio (1024 / 409) Container */}
        <div className="relative w-full aspect-[1024/409] md:max-h-screen flex items-center justify-center">
          
          <img
            src="/hackathon-hero.png"
            alt="HACKATHON 26 - Same City. New Possibilities."
            className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
            loading="eager"
          />

          {/* 3. Desktop / Tablet Action Buttons: Placed right on the asphalt road under the tagline */}
          <div className="hidden md:flex absolute left-[16%] md:left-[17%] bottom-[11%] md:bottom-[13%] z-20 items-center gap-3.5 md:gap-4 pointer-events-auto">
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2.5 px-8 md:px-10 py-3 md:py-3.5 bg-[#E5385D] hover:bg-[#F43F68] text-white font-heading font-black text-xs md:text-sm tracking-[0.18em] uppercase rounded-full transition-all duration-300 shadow-[0_4px_28px_rgba(229,56,93,0.6)] hover:scale-[1.04] active:scale-[0.98] group"
              id="hero-primary-cta"
            >
              <span>EXPLORE EVENTS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2.5 px-8 md:px-10 py-3 md:py-3.5 bg-[#1B1028]/90 hover:bg-[#28163D] border border-white/30 hover:border-cyan/60 text-white hover:text-cyan font-heading font-bold text-xs md:text-sm tracking-[0.18em] uppercase rounded-full transition-all duration-300 backdrop-blur-md shadow-lg hover:scale-[1.04] active:scale-[0.98]"
              id="hero-secondary-cta"
            >
              <span>REGISTER</span>
            </Link>
          </div>

        </div>

        {/* Mobile Festival Date & Time Banner Badge */}
        <div className="md:hidden mt-4 flex items-center gap-2 flex-wrap justify-center">
          <span className="px-3 py-1 rounded-full bg-[#161B26]/90 border border-cyan/40 text-[11px] font-mono text-cyan font-bold tracking-wider">
            30 OCTOBER 2026 · 12:30 PM
          </span>
          <span className="px-3 py-1 rounded-full bg-[#161B26]/90 border border-[#E5385D]/40 text-[11px] font-mono text-[#FF4B72] font-bold tracking-wider">
            ST. PAUL'S COLLEGE
          </span>
        </div>

        {/* Mobile Action Buttons: Neatly placed directly below artwork so it flows naturally */}
        <div className="md:hidden mt-5 w-full flex flex-col items-center gap-3 px-4 pointer-events-auto">
          <button
            type="button"
            onClick={scrollToEvents}
            className="w-full max-w-xs inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#E5385D] hover:bg-[#F43F68] text-white font-heading font-black text-xs tracking-[0.18em] uppercase rounded-full transition-all duration-300 shadow-[0_4px_28px_rgba(229,56,93,0.6)] group"
            id="hero-mobile-primary-cta"
          >
            <span>EXPLORE 9 EVENTS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <Link
            to="/register"
            className="w-full max-w-xs inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#1B1028]/95 hover:bg-[#28163D] border border-white/30 text-white font-heading font-bold text-xs tracking-[0.18em] uppercase rounded-full transition-all duration-300 backdrop-blur-md"
            id="hero-mobile-secondary-cta"
          >
            <span>REGISTER ONLINE</span>
          </Link>

          {/* Continuous Scroll Indicator */}
          <button
            type="button"
            onClick={scrollToEvents}
            className="mt-2 text-slate-400 hover:text-cyan text-[11px] font-mono tracking-widest uppercase flex items-center gap-1.5 animate-pulse"
          >
            <span>CONTINUOUS SCROLL FEED</span>
            <span className="text-cyan font-bold">↓</span>
          </button>
        </div>

      </div>

    </section>
  );
}
