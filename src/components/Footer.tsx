import React from 'react';
import { useRouter } from '../context/RouterContext';
import { Flame, MapPin, Mail, Phone, ShieldCheck, Heart, Award, Trophy } from 'lucide-react';
import { SandipFoundationLogo, SitrcLogo, IeiLogo, MesaLogo } from './logos/Logos';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Institutional Affiliation & Logos Row */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4 text-center sm:text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest font-extrabold text-orange-400">
              Official Institutional Patronage
            </span>
            <div className="flex items-center gap-3 text-xs text-amber-300 font-bold">
              <span className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Bumper Cash Prizes
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Certificate to All Participants
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {/* 1. Sandip Foundation */}
            <div className="bg-white rounded-xl p-3 flex flex-col items-center text-center shadow-xs">
              <SandipFoundationLogo className="h-14 w-auto" />
              <span className="text-[11px] font-bold text-slate-900 mt-1">Sandip Foundation</span>
            </div>

            {/* 2. SITRC */}
            <div className="bg-white rounded-xl p-3 flex flex-col items-center text-center shadow-xs">
              <SitrcLogo className="h-12 w-auto" />
              <span className="text-[11px] font-bold text-slate-900 mt-1">SITRC Nashik</span>
            </div>

            {/* 3. IEI India */}
            <div className="bg-white rounded-xl p-3 flex flex-col items-center text-center shadow-xs">
              <IeiLogo className="h-14 w-auto" />
              <span className="text-[11px] font-bold text-slate-900 mt-1">IEI India (Estd 1920)</span>
            </div>

            {/* 4. MESA SITRC */}
            <div className="bg-white rounded-xl p-3 flex flex-col items-center text-center shadow-xs">
              <MesaLogo className="h-12 w-auto" />
              <span className="text-[11px] font-bold text-slate-900 mt-1">MESA SITRC</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & College */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-extrabold shadow-md">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white font-mono">
                MECH<span className="text-orange-500">VORTEX</span> 2026
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              National Level Technical & Cultural Festival organized by the Department of Mechanical Engineering, 
              Sandip Institute of Technology & Research Centre (SITRC), Nashik.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">In Association With:</p>
              <p>• Mechanical Engineering Student Association (MESA)</p>
              <p>• Institution of Engineers India (IEI) Student Chapter</p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-slate-400 hover:text-orange-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/events')}
                  className="text-slate-400 hover:text-orange-400 transition-colors"
                >
                  All Events & Competitions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-slate-400 hover:text-orange-400 transition-colors"
                >
                  About MECHVORTEX & SITRC
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-slate-400 hover:text-orange-400 transition-colors"
                >
                  Contact & Support Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin/login')}
                  className="inline-flex items-center gap-1.5 text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Login
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Event Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Fest Domains
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                Engineering
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Sports
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                Creativity
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-800">
                Gaming
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-orange-950 text-orange-300 border border-orange-800">
                Innovation
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              9 exciting events designed to test engineering prowess, tactical gaming skills, sportsmanship, and creative innovation.
            </p>
          </div>

          {/* Column 4: Venue & Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Venue & Support
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>
                  Department of Mechanical Engineering, D-Building, Sandip Institute of Technology & Research Centre (SITRC), Mahiravani, Nashik – 422213
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="tel:7769829891" className="hover:text-white transition-colors">
                  +91 7769829891 (Chief Student Coordinator)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="mailto:hiteshbadgujar.mech@sitrc.org" className="hover:text-white transition-colors break-all">
                  hiteshbadgujar.mech@sitrc.org
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 MECHVORTEX. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            Organized by Department of Mechanical Engineering, SITRC, Nashik
          </p>
        </div>
      </div>
    </footer>
  );
};
