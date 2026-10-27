import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Terminal, Gamepad2, ArrowRight, ShieldCheck, Mail, Phone } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-transparent relative text-slate-100">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Editorial Header */}
        <div className="border-b border-[#1A1F29] pb-8 mb-12">
          <div className="space-y-1 text-xs font-mono uppercase tracking-[0.2em] text-muted-light mb-3">
            <span className="text-ivory font-bold">ST. PAUL'S COLLEGE</span>
            <span className="text-muted-dark mx-2">/</span>
            <span className="text-muted">DEPARTMENT OF COMPUTER SCIENCE</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-ivory tracking-wide uppercase">
            ABOUT HACKATHON
          </h1>
          <p className="font-script text-2xl sm:text-3xl text-red mt-2 tracking-wide">
            RULE THE PLAYGROUND
          </p>
          <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            A premier college fest uniting cutting-edge computer science challenges with competitive esports championships. 5 Technical Events. 4 Gaming Events. One Unforgettable Experience.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141822] border border-white/10 text-xs font-mono text-ivory">
              <Calendar className="w-3.5 h-3.5 text-red" /> OCTOBER 30, 2026 · 12:30 PM
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141822] border border-white/10 text-xs font-mono text-ivory">
              <MapPin className="w-3.5 h-3.5 text-red" /> HACKATHON CAMPUS
            </span>
          </div>
        </div>

        <div className="space-y-12">
          
          {/* Fest Philosophy & Focus */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-7 bg-[#141822] border border-surface-border rounded-xs space-y-2.5">
              <span className="font-mono text-[10px] text-cyan uppercase tracking-wider font-bold">THE FESTIVAL</span>
              <h3 className="font-heading font-bold text-xl text-ivory">What is HACKATHON?</h3>
              <p className="text-xs text-muted leading-relaxed">
                HACKATHON is the flagship inter-collegiate festival organized by the Department of Computer Science at St. Paul's College. It combines intellectual programming rigor with high-speed digital gaming reflexes.
              </p>
            </div>

            <div className="p-6 sm:p-7 bg-[#141822] border border-surface-border rounded-xs space-y-2.5">
              <span className="font-mono text-[10px] text-cyan uppercase tracking-wider font-bold">TECHNICAL SECTOR</span>
              <h3 className="font-heading font-bold text-xl text-ivory">District Alpha</h3>
              <p className="text-xs text-muted leading-relaxed">
                5 official technical competitions covering IT management crises, algorithmic quizzes, blind code relays, keynote public lectures, and parliamentary computing debates.
              </p>
            </div>

            <div className="p-6 sm:p-7 bg-[#141822] border border-surface-border rounded-xs space-y-2.5">
              <span className="font-mono text-[10px] text-red uppercase tracking-wider font-bold">GAMING ARENA</span>
              <h3 className="font-heading font-bold text-xl text-ivory">District Beta</h3>
              <p className="text-xs text-muted leading-relaxed">
                4 premier esports tournaments featuring battle royale in BGMI, precision street racing in NFS, survival combat in Free Fire, and tactical pitch battles in E-Football.
              </p>
            </div>
          </div>

          {/* Nine Events Grid Overview */}
          <div>
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#1A1F29]">
              <h2 className="font-heading font-bold text-2xl text-ivory uppercase tracking-wider">
                CHAMPIONSHIP MATRIX (9 ARENAS)
              </h2>
              <Link to="/events" className="text-xs font-heading font-bold text-red hover:text-ivory flex items-center gap-1 uppercase tracking-wider">
                View All Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Technical 5 */}
              <div className="p-6 bg-[#141822] border border-surface-border rounded-xs">
                <div className="flex items-center gap-2 text-cyan font-mono text-xs uppercase tracking-wider font-bold mb-4">
                  <Terminal className="w-4 h-4" />
                  <span>5 TECHNICAL DISCIPLINES</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#0B0D11] rounded-xs border border-surface-border flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-cyan mr-2">01</span>
                      <strong className="text-ivory font-heading text-sm">IT MANAGER</strong>
                      <p className="text-muted text-[11px] mt-0.5">Corporate simulation, crisis handling & stress leadership</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0B0D11] rounded-xs border border-surface-border flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-cyan mr-2">02</span>
                      <strong className="text-ivory font-heading text-sm">QUIZ</strong>
                      <p className="text-muted text-[11px] mt-0.5">Hardware history, algorithms, cybersecurity & tech culture</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0B0D11] rounded-xs border border-surface-border flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-cyan mr-2">03</span>
                      <strong className="text-ivory font-heading text-sm">FUNZOVA</strong>
                      <p className="text-muted text-[11px] mt-0.5">Blind code relays, reverse engineering & logic puzzles</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0B0D11] rounded-xs border border-surface-border flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-cyan mr-2">04</span>
                      <strong className="text-ivory font-heading text-sm">VEXTALK</strong>
                      <p className="text-muted text-[11px] mt-0.5">Frontier tech keynotes, AI ethics & keynote presentations</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0B0D11] rounded-xs border border-surface-border flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-cyan mr-2">05</span>
                      <strong className="text-ivory font-heading text-sm">DEBATE</strong>
                      <p className="text-muted text-[11px] mt-0.5">Parliamentary clash on autonomous systems & digital power</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gaming 4 */}
              <div className="p-6 bg-[#141822] border border-surface-border rounded-xs">
                <div className="flex items-center gap-2 text-red font-mono text-xs uppercase tracking-wider font-bold mb-4">
                  <Gamepad2 className="w-4 h-4" />
                  <span>4 GAMING CHAMPIONSHIPS</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#0B0D11] rounded-xs border border-surface-border flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-red mr-2">06</span>
                      <strong className="text-ivory font-heading text-sm">BGMI</strong>
                      <p className="text-muted text-[11px] mt-0.5">Battle royale combat rotations, airdrops & strategic survival</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0B0D11] rounded-xs border border-surface-border flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-red mr-2">07</span>
                      <strong className="text-ivory font-heading text-sm">NFS</strong>
                      <p className="text-muted text-[11px] mt-0.5">Underground circuit racing, apex drift & nitrous timing</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0B0D11] rounded-xs border border-surface-border flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-red mr-2">08</span>
                      <strong className="text-ivory font-heading text-sm">FREE FIRE</strong>
                      <p className="text-muted text-[11px] mt-0.5">High-intensity mobile battle royale across Bermuda & Kalahari</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0B0D11] rounded-xs border border-surface-border flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-red mr-2">09</span>
                      <strong className="text-ivory font-heading text-sm">E-FOOTBALL</strong>
                      <p className="text-muted text-[11px] mt-0.5">Authentic pitch tactics, fluid dribbling & knockout cup drama</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Contact & Organiser Desk */}
          <div className="p-7 bg-[#141822] border border-surface-border rounded-xs">
            <h3 className="font-heading font-bold text-lg text-ivory mb-3 uppercase tracking-wider">
              ORGANISER & DESK CONTACT
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted">
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-light">Institution</span>
                <span className="text-ivory font-medium mt-0.5 block">St. Paul's College</span>
                <span className="text-muted text-[11px]">Dept. of Computer Science</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-light">Venue & Dates</span>
                <span className="text-ivory font-medium mt-0.5 block">Hackathon Campus Grounds</span>
                <span className="text-muted text-[11px]">Oct 30, 2026 · 12:30 PM</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-light">Registration Access</span>
                <span className="text-cyan font-medium mt-0.5 block">Public Student Entry</span>
                <span className="text-muted text-[11px]">Valid Collegiate ID Required</span>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="p-8 bg-gradient-to-r from-[#141822] to-[#1A1F2B] border border-surface-border text-center rounded-xs">
            <h3 className="font-heading font-bold text-2xl text-ivory mb-2 uppercase">
              JOIN THE FESTIVAL
            </h3>
            <p className="text-xs text-muted mb-6 max-w-md mx-auto">
              Read the event guidelines, pick your arena, and submit your registration.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/events"
                className="px-8 py-3.5 bg-red hover:bg-[#F43F68] text-white font-heading font-bold text-xs uppercase tracking-[0.16em] rounded-full transition-colors shadow-magenta-pill"
              >
                BROWSE 9 EVENTS
              </Link>
              <Link
                to="/rules"
                className="px-8 py-3.5 bg-[#141822] hover:bg-[#1E2433] border border-white/15 text-ivory font-heading font-bold text-xs uppercase tracking-[0.16em] rounded-full transition-colors"
              >
                RULES BROCHURE
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
