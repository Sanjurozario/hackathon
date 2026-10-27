import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { adminLogin } from '../lib/db';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07040C] flex items-center justify-center p-4 sm:p-6 lg:p-10 text-white relative overflow-hidden">
      
      {/* Background ambient sunset glow */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-25 scale-110 pointer-events-none"
        style={{ backgroundImage: `url('/hackathon-hero.png')` }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-4xl bg-[#0E121B]/95 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
        
        {/* LEFT COLUMN: Cinematic Sunset Art & Institutional Branding */}
        <div className="md:col-span-6 relative bg-[#090C12] border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between p-8 overflow-hidden min-h-[280px]">
          
          {/* City Sunset Artwork Backdrop */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-45"
            style={{ backgroundImage: `url('/hackathon-hero.png')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090C12] via-[#090C12]/70 to-[#090C12]/40" />

          {/* Top Back Link */}
          <div className="relative z-10">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Hackathon</span>
            </Link>
          </div>

          {/* Center Stylized Vector Character Back with "VEXORIS" embroidered on leather jacket */}
          <div className="relative z-10 my-auto text-center py-6">
            <div className="relative inline-block mx-auto">
              <svg 
                viewBox="0 0 200 240" 
                className="w-48 h-56 mx-auto drop-shadow-2xl" 
                aria-label="Character in Hackathon leather jacket facing city"
              >
                {/* Shoulders & Jacket Silhouette */}
                <path d="M 40 240 C 45 180, 50 140, 70 120 C 75 110, 85 105, 100 105 C 115 105, 125 110, 130 120 C 150 140, 155 180, 160 240 Z" fill="#131722" stroke="#252D3F" strokeWidth="2"/>
                {/* Jacket Seams & Collar */}
                <path d="M 80 125 Q 100 145 120 125" fill="none" stroke="#2D384D" strokeWidth="3"/>
                <path d="M 100 135 L 100 240" stroke="#0E121B" strokeWidth="3"/>
                {/* Character Head / Hair */}
                <ellipse cx="100" cy="80" rx="22" ry="26" fill="#0A0C10" />
                <path d="M 80 80 Q 100 60 120 80" fill="#151A24" />
                {/* Embroidered HACKATHON Script on back */}
                <text 
                  x="100" 
                  y="175" 
                  textAnchor="middle" 
                  fill="#E5385D" 
                  fontSize="15" 
                  fontFamily="'Permanent Marker', cursive, sans-serif" 
                  transform="rotate(-4 100 175)"
                  className="tracking-wider select-none"
                >
                  HACKATHON
                </text>
              </svg>
            </div>
          </div>

          {/* Bottom Security Tag */}
          <div className="relative z-10 flex items-center gap-2 text-[11px] font-mono text-muted">
            <Shield className="w-3.5 h-3.5 text-cyan" />
            <span>Authorized Organiser Gate · 256-bit TLS</span>
          </div>

        </div>

        {/* RIGHT COLUMN: ADMIN ACCESS LOGIN FORM (Panel 8) */}
        <div className="md:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
          
          <div>
            {/* HACKATHON Crown Wordmark */}
            <div className="flex items-center gap-2 mb-8">
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 text-amber-400 fill-amber-400/90 -rotate-6" 
                aria-hidden="true"
              >
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
              </svg>
              <span className="font-heading font-black text-xl tracking-[0.2em] text-ivory">
                HACKATHON
              </span>
            </div>

            {/* Card Header matching Panel 8 */}
            <div className="mb-6">
              <h1 className="font-heading font-black text-2xl text-ivory tracking-wide uppercase">
                ADMIN ACCESS
              </h1>
              <p className="text-muted text-xs font-sans mt-1">
                Sign in to manage event registrations.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red/10 border border-red/30 rounded flex items-center gap-2.5 text-xs text-red font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Fields matching Panel 8 */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Username Field */}
              <div>
                <label className="block text-xs font-heading font-bold text-ivory uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#131824] border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5385D] focus:ring-1 focus:ring-[#E5385D] transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#131824] border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5385D] focus:ring-1 focus:ring-[#E5385D] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#E5385D] hover:bg-[#F43F68] disabled:opacity-50 text-white font-heading font-black text-xs uppercase tracking-[0.16em] rounded-xl transition-all shadow-[0_4px_20px_rgba(229,56,93,0.45)] hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Verifying...</span>
                  ) : (
                    <span>Login &rarr;</span>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Secure Institutional Gateway Footer (No credentials exposed) */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>St. Paul's College · Portal</span>
            <span className="text-[#38BDF8] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
              Secure Gateway
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

