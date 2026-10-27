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
    <>
      {/* =========================================================================
          1. DESKTOP HERO (VISIBLE ONLY ON md AND LARGER)
          Preserves the exact widescreen cinematic poster layout you loved
      ========================================================================= */}
      <section className="hidden md:flex relative w-full h-screen min-h-screen items-center justify-center overflow-hidden bg-[#0A0412] select-none">
        {/* Full-viewport Ambient Sunset Glow */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-3xl opacity-30 scale-110 pointer-events-none -z-10"
          style={{ backgroundImage: `url('/hackathon-hero.png')` }}
        />

        {/* Main Landscape Artwork Container */}
        <div className="relative w-full max-w-[1920px] max-h-screen flex items-center justify-center">
          <div className="relative w-full aspect-[1024/409] max-h-screen flex items-center justify-center">
            <img
              src="/hackathon-hero.png"
              alt="HACKATHON 26 - Same City. New Possibilities."
              className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
              loading="eager"
            />

            {/* Desktop Action Buttons: Placed right on the asphalt road under the tagline */}
            <div className="absolute left-[16%] md:left-[17%] bottom-[11%] md:bottom-[13%] z-20 flex items-center gap-3.5 md:gap-4 pointer-events-auto">
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
        </div>
      </section>

      {/* =========================================================================
          2. MOBILE HERO (VISIBLE ONLY ON MOBILE < md)
          Full-screen filled vertical wallpaper with seamless flow into feed below
      ========================================================================= */}
      <section className="md:hidden relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-end overflow-hidden bg-[#0A0412] select-none">
        {/* Full-bleed vertical background filling the screen completely */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/hackathon-mobile-hero.jpg')` }}
        />

        {/* Subtle bottom gradient to highlight CTAs on the lower asphalt road */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0412] via-[#0A0412]/35 to-transparent pointer-events-none z-10" />

        {/* Mobile Action Controls & Scroll Prompt */}
        <div className="relative z-20 pb-8 px-5 flex flex-col items-center gap-3 w-full pointer-events-auto">
          {/* Festival Date & Venue Pills */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="px-3.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-cyan/50 text-[11px] font-mono text-cyan font-bold tracking-wider shadow-lg">
              30 OCT 2026 · 12:30 PM
            </span>
            <span className="px-3.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#E5385D]/50 text-[11px] font-mono text-[#FF4B72] font-bold tracking-wider shadow-lg">
              ST. PAUL'S COLLEGE
            </span>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col items-center gap-2.5 max-w-xs">
            <button
              type="button"
              onClick={scrollToEvents}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#E5385D] hover:bg-[#F43F68] text-white font-heading font-black text-xs tracking-[0.18em] uppercase rounded-full transition-all duration-300 shadow-[0_4px_28px_rgba(229,56,93,0.7)] group"
              id="hero-mobile-primary-cta"
            >
              <span>EXPLORE 9 EVENTS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/register"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-black/80 hover:bg-black border border-white/40 text-white font-heading font-bold text-xs tracking-[0.18em] uppercase rounded-full transition-all duration-300 backdrop-blur-md shadow-lg"
              id="hero-mobile-secondary-cta"
            >
              <span>REGISTER ONLINE</span>
            </Link>
          </div>

          {/* Smooth Continuous Scroll Indicator */}
          <button
            type="button"
            onClick={scrollToEvents}
            className="mt-1 text-slate-300 hover:text-cyan text-[11px] font-mono tracking-widest uppercase flex items-center gap-1.5 animate-pulse bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10"
          >
            <span>CONTINUOUS SCROLL FEED</span>
            <span className="text-cyan font-bold">↓</span>
          </button>
        </div>
      </section>
    </>
  );
}
