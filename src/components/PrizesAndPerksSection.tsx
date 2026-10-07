import React from 'react';
import { Trophy, Award, Gift, Sparkles, CheckCircle2, ShieldCheck, Flame, Star } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const PrizesAndPerksSection: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-amber-500/5 via-orange-500/10 to-transparent relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-orange-400/10 via-amber-300/15 to-yellow-400/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Header Tag */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20 uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grand Rewards & National Recognition</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Attractive & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500">Bumper Cash Prizes</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
            Every participant wins at MECHVORTEX 2026! Compete for generous cash rewards, grand winner trophies, and take home an official institutional certificate.
          </p>
        </div>

        {/* 3 Core Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          
          {/* Card 1: Bumper Cash Prizes */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-50 to-orange-50/80 border-2 border-amber-300 shadow-xl shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 mb-5 group-hover:scale-110 transition-transform">
              <Trophy className="w-7 h-7" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-amber-200 text-amber-900 mb-2 font-mono">
              For Winners & Runners-Up
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
              Bumper Cash Prizes
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Handsome cash rewards awarded for 1st & 2nd place in Technical Paper Presentation, Lathe War, Roborace, Box Cricket, BGMI, and CAD Modeling.
            </p>

            <ul className="space-y-2 text-xs font-semibold text-slate-700 border-t border-amber-200/80 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant spot disbursement on event day</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Separate cash pools for each competitive category</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Special prize for Best Inter-College Delegation</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Certificate to ALL Participants (USER EMPHASIS) */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-orange-600 to-amber-600 text-white shadow-2xl shadow-orange-600/25 hover:-translate-y-1 transition-all duration-300 relative group scale-100 md:scale-105 border-2 border-orange-400">
            <div className="absolute top-4 right-4 bg-yellow-300 text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider font-mono shadow-md">
              Guaranteed Perk
            </div>

            <div className="w-14 h-14 rounded-2xl bg-white text-orange-600 flex items-center justify-center shadow-lg shadow-black/10 mb-5 group-hover:scale-110 transition-transform">
              <Award className="w-7 h-7" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-orange-700/60 text-white mb-2 font-mono">
              100% Guaranteed
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              Certificate to All Participants
            </h3>

            <p className="text-xs sm:text-sm text-orange-100 leading-relaxed mb-4 font-medium">
              Every registered participant who attends their competition is awarded an official National-Level Certificate of Participation!
            </p>

            <ul className="space-y-2.5 text-xs font-semibold text-white/95 border-t border-white/20 pt-4">
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-300 shrink-0 fill-yellow-300" />
                <span>Endorsed by Sandip Foundation & SITRC</span>
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-300 shrink-0 fill-yellow-300" />
                <span>Jointly accredited with IEI (Royal Charter 1920)</span>
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-300 shrink-0 fill-yellow-300" />
                <span>Valid for Academic & NAAC/NBA Activity Credits</span>
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-300 shrink-0 fill-yellow-300" />
                <span>High resume value for engineering placements</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Prestigious Trophies & Mementos */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl shadow-black/15 hover:-translate-y-1 transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 mb-5 group-hover:scale-110 transition-transform">
              <Gift className="w-7 h-7" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-slate-800 text-amber-400 mb-2 font-mono">
              Championship Honors
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              Trophies & Mementos
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Grand winner trophies, runner-up silver plates, and departmental mementos presented on the grand valedictory stage by our distinguished guests.
            </p>

            <ul className="space-y-2 text-xs font-semibold text-slate-300 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Custom MECHVORTEX 2026 Champion Trophies</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Certificates of Merit & Excellence Citations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Media coverage & Department Wall of Fame</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-black text-slate-900">
              Ready to Win? Secure Your Seat Today!
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Individual and team registrations are currently live. Fees range from only ₹50 to ₹100 per event.
            </p>
          </div>

          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-600/30 transition-all shrink-0"
          >
            Explore Events & Register Now →
          </button>
        </div>

      </div>
    </section>
  );
};
