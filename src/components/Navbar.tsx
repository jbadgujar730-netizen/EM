import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ShieldCheck, Flame, ArrowRight, Trophy, Award } from 'lucide-react';
import { SitrcLogo, SandipFoundationLogo, IeiLogo, MesaLogo } from './logos/Logos';

export const Navbar: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'About', path: '/about' },
    { label: 'How to Register', path: '/#how-to-register' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      if (currentPath !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(path.replace('/#', ''));
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(path.replace('/#', ''));
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Topmost Institutional & Prize Announcement Bar */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 font-medium hidden sm:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 font-mono">
            <span className="font-bold text-orange-400">Sandip Foundation</span>
            <span>•</span>
            <span className="text-white">SITRC Nashik</span>
            <span>•</span>
            <span className="text-slate-300">IEI Student Chapter</span>
            <span>•</span>
            <span className="text-orange-400">MESA</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-300 font-black uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Bumper Cash Prizes
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-emerald-300 font-bold">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              Certificate of Participation to All Participants
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & College Identity */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-orange-500 font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Flame className="w-6 h-6 fill-orange-500 text-orange-500" />
              </div>
              <div className="hidden xl:flex items-center gap-1 pl-1 border-r border-slate-200 pr-3">
                <SitrcLogo className="h-8 w-auto" />
                <IeiLogo className="h-8 w-auto" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-mono">
                  MECH<span className="text-orange-600">VORTEX</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700 border border-orange-200">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium tracking-wide hidden sm:block">
                Dept. of Mechanical Engineering • SITRC Nashik
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(link => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-orange-600 bg-orange-50/80'
                      : 'text-slate-800 hover:text-orange-600 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAdminRoute ? (
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                Admin Panel
              </button>
            ) : isAuthenticated ? (
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                Admin Portal
              </button>
            ) : (
              <button
                onClick={() => navigate('/admin/login')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Super Admin & Coordinator Portal"
              >
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                <span>Admin Login</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('/events')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 transition-all shadow-md shadow-orange-600/20 hover:shadow-orange-600/30 group"
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-800 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.path)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  currentPath === link.path
                    ? 'text-orange-600 bg-orange-50 font-bold'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => handleNavClick('/events')}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-orange-600 text-white shadow-md shadow-orange-600/20"
              >
                <span>Register Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/admin/login');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200"
              >
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                {isAuthenticated ? 'Go to Admin Dashboard' : 'Admin Login'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
