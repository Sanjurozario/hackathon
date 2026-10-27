import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focused 4 navigation items
  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'EVENTS', path: '/events' },
    { name: 'RULES', path: '/rules' },
    { name: 'REGISTER', path: '/register' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0A0412]/92 backdrop-blur-xl border-b border-white/10 py-2.5 sm:py-3 shadow-[0_8px_30px_rgba(0,0,0,0.8)]' 
          : 'bg-gradient-to-b from-[#0A0412]/80 via-[#0A0412]/20 to-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          
          {/* 1. Left Side Top Corner: HACKATHON */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="group flex items-center focus:outline-none py-1"
              aria-label="Hackathon Home"
              id="nav-brand"
            >
              <span className="font-bebas text-2xl sm:text-3xl lg:text-4xl tracking-[0.18em] text-white group-hover:text-[#E5385D] transition-colors leading-none drop-shadow-[0_2px_12px_rgba(229,56,93,0.4)]">
                HACKATHON<span className="text-[#E5385D] ml-1">26</span>
              </span>
            </Link>
          </div>

          {/* 2. Centre: Navigation Buttons (HOME, EVENTS, RULES, REGISTER) */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 sm:px-5 py-2 font-heading text-xs sm:text-[13px] tracking-[0.16em] font-bold transition-all duration-200 rounded-full ${
                    active
                      ? 'text-white bg-[#E5385D] border border-[#E5385D] shadow-[0_0_18px_rgba(229,56,93,0.55)] scale-[1.03]'
                      : 'text-slate-200 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                  id={`nav-link-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Side: College Logo ONLY (No Pegasus logo) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              to="/admin"
              className="py-1 px-1 rounded-lg hover:opacity-100 transition-all duration-300 group focus:outline-none flex items-center"
              title="St. Paul's College Portal"
              aria-label="St. Paul's College Portal"
              id="college-logo-link"
            >
              <img
                src="/st-pauls-logo.png"
                alt="St. Paul's College"
                className="h-8 sm:h-10 md:h-12 w-auto max-w-[150px] sm:max-w-[220px] object-contain filter brightness-125 contrast-110 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-all duration-300"
              />
            </Link>

            {/* Mobile Hamburger Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
              id="mobile-menu-button"
            >
              {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0A0412]/98 backdrop-blur-2xl border-b border-white/10 px-6 pt-3 pb-6 space-y-2 shadow-2xl animate-in fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-heading text-sm tracking-wider font-bold transition-all ${
                isActive(link.path)
                  ? 'bg-[#E5385D]/15 text-[#FF4B72] border-l-2 border-[#E5385D]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{link.name}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
