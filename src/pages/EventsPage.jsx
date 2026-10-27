import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Terminal, Gamepad2, Search, Layers, ArrowRight } from 'lucide-react';
import EventCard from '../components/EventCard';
import { getEvents } from '../lib/db';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || 'All';
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getEvents().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const handleCategoryChange = (cat) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredEvents = events.filter(e => {
    // Category filter
    if (activeCategory !== 'All' && e.category !== activeCategory) {
      return false;
    }

    // Search keyword
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = e.name.toLowerCase().includes(term);
      const matchDesc = (e.tagline || '').toLowerCase().includes(term) || (e.shortDescription || '').toLowerCase().includes(term);
      const matchDist = (e.district || '').toLowerCase().includes(term);
      return matchName || matchDesc || matchDist;
    }
    return true;
  });

  return (
    <div className="pt-28 pb-24 min-h-screen text-slate-100 relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Header & Filter Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 mb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan uppercase tracking-[0.2em] mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>OFFICIAL DIRECTORY</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase">
              ALL EVENTS
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 font-normal max-w-xl leading-relaxed">
              5 Technical Disciplines · 4 Gaming Tournaments · 30 October 2026 at 12:30 PM
            </p>
          </div>

          {/* Live Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search event name, format..."
              className="w-full pl-10 pr-8 py-3 bg-[#111520] border border-[#232C3E] rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category & Format Filter Pills with High Contrast */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleCategoryChange('All')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-heading font-bold uppercase tracking-wider transition-all ${
                activeCategory === 'All'
                  ? 'bg-white text-[#0B0D11] shadow-md font-extrabold'
                  : 'bg-[#121622] text-slate-300 hover:text-white border border-[#232C3E]'
              }`}
            >
              All Events (9)
            </button>
            <button
              type="button"
              onClick={() => handleCategoryChange('Technical')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeCategory === 'Technical'
                  ? 'bg-cyan text-[#0B0D11] shadow-md shadow-cyan/20 font-extrabold'
                  : 'bg-[#121622] text-slate-300 hover:text-cyan border border-[#232C3E]'
              }`}
            >
              <Terminal className="w-4 h-4" /> Technical (5)
            </button>
            <button
              type="button"
              onClick={() => handleCategoryChange('Gaming')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeCategory === 'Gaming'
                  ? 'bg-red text-white shadow-md shadow-red/20 font-extrabold'
                  : 'bg-[#121622] text-slate-300 hover:text-red border border-[#232C3E]'
              }`}
            >
              <Gamepad2 className="w-4 h-4" /> Gaming (4)
            </button>
          </div>
        </div>

        {/* Spacious, Highly Readable Responsive Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <span className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full inline-block animate-spin mb-4" />
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Loading official events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center bg-[#121622] border border-[#232C3E] rounded-xl p-8">
            <p className="text-base text-white font-heading font-bold">No events matched your search query.</p>
            <p className="text-sm text-slate-400 mt-1">Try resetting your filters or search terms.</p>
            <button
              type="button"
              onClick={() => {
                handleCategoryChange('All');
                setSearchTerm('');
              }}
              className="mt-4 px-5 py-2.5 bg-white text-[#0B0D11] text-xs font-heading font-bold uppercase tracking-wider rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Bottom Banner to Rules & Regulations */}
        <div className="mt-16 p-6 sm:p-8 bg-[#10141E] border border-[#1E2535] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="font-heading font-black text-xl text-white uppercase tracking-wide">
              NEED COMPLETE ROUND RULES & SCORING MATRICES?
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Read the official dossier with eligibility, round rules, and judging rubrics.
            </p>
          </div>
          <Link
            to="/rules"
            className="px-6 py-3 bg-[#1A202C] hover:bg-[#252D3D] border border-white/20 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-2 shrink-0"
          >
            <span>RULES & REGULATIONS</span>
            <ArrowRight className="w-4 h-4 text-cyan" />
          </Link>
        </div>

      </div>
    </div>
  );
}
