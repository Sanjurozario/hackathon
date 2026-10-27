import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0412] select-none">
      
      {/* 1. Full-viewport Ambient Sunset Glow (Extends background colors seamlessly without any hard borders) */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-3xl opacity-30 scale-110 pointer-events-none -z-10"
        style={{ backgroundImage: `url('/hackathon-hero.png')` }}
      />

      {/* 2. Main Artwork Container - Accurately Visible, NEVER Shrunk, NEVER Stretched, NEVER Cropped */}
      <div className="relative w-full max-w-[1920px] max-h-screen flex items-center justify-center">
        
        {/* Exact Aspect Ratio (1024 / 409) Container */}
        <div className="relative w-full aspect-[1024/409] max-h-screen flex items-center justify-center">
          
          <img
            src="/hackathon-hero.png"
            alt="HACKATHON 26 - Same City. New Possibilities."
            className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
            loading="eager"
          />

          {/* 3. The Two Action Buttons: Desktop / Tablet placement right on the road under the tagline */}
          <div className="hidden sm:flex absolute left-[16%] md:left-[17%] bottom-[11%] md:bottom-[13%] z-20 items-center gap-3.5 md:gap-4 pointer-events-auto">
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

      {/* Mobile Action Buttons (Displayed clearly on small screens so they don't crowd the artwork) */}
      <div className="sm:hidden absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-3 px-6 pointer-events-auto">
        <Link
          to="/events"
          className="w-full max-w-xs inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#E5385D] hover:bg-[#F43F68] text-white font-heading font-black text-xs tracking-[0.18em] uppercase rounded-full transition-all duration-300 shadow-[0_4px_28px_rgba(229,56,93,0.6)] group"
          id="hero-mobile-primary-cta"
        >
          <span>EXPLORE EVENTS</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/register"
          className="w-full max-w-xs inline-flex items-center justify-center gap-2.5 px-8 py-3 bg-[#1B1028]/90 hover:bg-[#28163D] border border-white/30 text-white font-heading font-bold text-xs tracking-[0.18em] uppercase rounded-full transition-all duration-300 backdrop-blur-md"
          id="hero-mobile-secondary-cta"
        >
          <span>REGISTER</span>
        </Link>
      </div>

    </section>
  );
}
