import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import IntroVideoOverlay from './components/IntroVideoOverlay';

import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import EventRegisterPage from './pages/EventRegisterPage';
import AboutPage from './pages/AboutPage';
import RulesPage from './pages/RulesPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { syncLocalRegistrationsToCloud } from './lib/db';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper to conditionally render public header/footer
function AppLayout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';

  // Automatically attempt background cloud sync for any offline registrations on this device
  useEffect(() => {
    syncLocalRegistrationsToCloud().catch(() => {});
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0D11] text-[#F3F0E8] relative selection:bg-[#E5385D]/30 selection:text-[#FFFFFF]">
      <ScrollToTop />
      
      {/* Intro Video Overlay (Plays full screen on site arrival with Skip button and auto-fade on finish) */}
      {!isAdminPage && <IntroVideoOverlay />}

      {/* Custom smooth desktop cursor */}
      <CustomCursor />

      {/* Unified Cinematic City Sunset Backdrop across Interior Pages */}
      {!isHomePage && !isAdminPage && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {/* Subtle City Skyline & Sunset Ambient Wash */}
          <div 
            className="absolute top-0 left-0 right-0 h-[680px] bg-cover bg-top opacity-[0.22] filter saturate-125 mix-blend-screen"
            style={{ backgroundImage: `url('/hero-bg.jpg')` }}
          />
          <div className="absolute top-0 left-0 right-0 h-[680px] bg-gradient-to-b from-[#0B0D11]/25 via-[#0B0D11]/75 to-[#0B0D11]" />

          {/* Luminous Atmospheric Auroras (Cyan left, Crimson sunset right) */}
          <div className="absolute top-[-120px] left-[-100px] w-[620px] h-[620px] bg-[#46C7DE]/10 rounded-full blur-[160px]" />
          <div className="absolute top-[-100px] right-[-100px] w-[640px] h-[640px] bg-[#E5385D]/12 rounded-full blur-[170px]" />
        </div>
      )}

      {/* Public Navigation - Rendered on all public pages including HomePage */}
      {!isAdminPage && <Navbar />}

      <main className="flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/events/:id/register" element={<EventRegisterPage />} />
          <Route path="/register/:id" element={<EventRegisterPage />} />
          <Route path="/register" element={<EventRegisterPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          {/* Catch-all */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Footer rendered on all public content pages, excluded from single-screen HomePage and Admin */}
      {!isAdminPage && !isHomePage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
