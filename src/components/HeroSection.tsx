import React from 'react';
import { useEventData } from '../context/EventDataContext';
import { useRouter } from '../context/RouterContext';
import { Calendar, MapPin, ArrowRight, ShieldCheck, Trophy, Sparkles, Flame, CheckCircle2, Award, Star } from 'lucide-react';
import { SandipFoundationLogo, SitrcLogo, IeiLogo, MesaLogo } from './logos/Logos';

export const HeroSection: React.FC = () => {
  const { settings, events } = useEventData();
  const { navigate } = useRouter();

  const formattedDate = settings?.start_date && settings?.end_date
    ? `${settings.start_date} to ${settings.end_date}`
    : '13 September 2026 to 14 September 2026';

  const venueText = settings?.venue || 'Department of Mechanical Engineering, D-Building, SITRC, Nashik';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50 pt-8 pb-16 md:pt-12 md:pb-24 border-b border-slate-200">
      {/* Subtle grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#0B1B3D 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">

        {/* 1. Official Institutional Logos Consortium Strip */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-3 text-center sm:text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest font-extrabold text-orange-600 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Official Institutional Patronage & Technical Consortium
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Sandip Institute of Technology & Research Centre (SITRC), Nashik
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            {/* Sandip Foundation */}
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <SandipFoundationLogo className="h-12 w-auto shrink-0" />
              <div className="text-left">
                <span className="block text-xs font-black text-slate-900 leading-tight">Sandip Foundation</span>
                <span className="text-[10px] text-slate-500 font-medium">Campus Trust</span>
              </div>
            </div>

            {/* SITRC */}
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <SitrcLogo className="h-10 w-auto shrink-0" />
              <div className="text-left">
                <span className="block text-xs font-black text-slate-900 leading-tight">SITRC Nashik</span>
                <span className="text-[10px] text-slate-500 font-medium">Host Engineering Institute</span>
              </div>
            </div>

            {/* IEI India */}
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <IeiLogo className="h-12 w-auto shrink-0" />
              <div className="text-left">
                <span className="block text-xs font-black text-slate-900 leading-tight">IEI India</span>
                <span className="text-[10px] text-slate-500 font-medium">Student Chapter (Estd 1920)</span>
              </div>
            </div>

            {/* MESA SITRC */}
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <MesaLogo className="h-10 w-auto shrink-0" />
              <div className="text-left">
                <span className="block text-xs font-black text-slate-900 leading-tight">MESA SITRC</span>
                <span className="text-[10px] text-slate-500 font-medium">Mechanical Students Assoc.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Grand Prizes Banner Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-xs sm:text-sm font-black tracking-wide shadow-md shadow-orange-500/25">
              <Trophy className="w-4 h-4 text-yellow-200 fill-yellow-200 animate-bounce" />
              <span>BUMPER CASH PRIZES • CERTIFICATE TO ALL PARTICIPANTS</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.08] font-mono">
                MECH<span className="text-orange-600">VORTEX</span> 2026
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Engineering • Sports • Creativity • Gaming
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-700 max-w-2xl leading-relaxed">
              Organized by the <span className="font-extrabold text-slate-900">Department of Mechanical Engineering, SITRC</span> in association with <span className="font-extrabold text-slate-900">MESA</span> and <span className="font-extrabold text-slate-900">IEI Student Chapter</span>. Join Maharashtra&apos;s most prestigious technical and cultural battleground!
            </p>

            {/* Attractive Bumper Cash Prizes & Certificate Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 shadow-md space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-black text-sm uppercase tracking-wide font-mono">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>Rewards & Recognition Guaranteed</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2 bg-white/90 p-2.5 rounded-xl border border-amber-200">
                  <Trophy className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-900 block">Attractive Cash Prizes</span>
                    <span className="text-slate-600 text-[11px]">Bumper cash awards + trophies for winners across all 9 events!</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-white/90 p-2.5 rounded-xl border border-amber-200">
                  <Award className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-900 block">Certificate to ALL Participants</span>
                    <span className="text-slate-600 text-[11px]">Official participation certificate for every registered candidate!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Event Metadata Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="p-2.5 rounded-lg bg-orange-50 text-orange-600 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-700 font-semibold uppercase tracking-wider">Event Dates</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{formattedDate}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-700 font-semibold uppercase tracking-wider">Official Venue</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-2">{venueText}</div>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/events')}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-black text-base bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 transition-all shadow-xl shadow-orange-600/30 hover:shadow-orange-600/40 group active:scale-95"
              >
                <span>Register Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('events-section');
                  el ? el.scrollIntoView({ behavior: 'smooth' }) : navigate('/events');
                }}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-base bg-white border-2 border-slate-300 text-slate-800 hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-xs"
              >
                <span>Explore Events & Prizes</span>
              </button>
            </div>

            {/* Trust Signals */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-700 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Official SITRC & IEI Certification
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Transparent Manual UPI Verification
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Instant Registration Receipt
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Visual Spotlight */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative card frame */}
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-orange-400 border border-slate-700 font-semibold">
                      EDITION 2026
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Nashik, Maharashtra
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-orange-400 font-mono font-bold tracking-widest uppercase">
                      FLAGSHIP COMPETITION
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      Where Mechanical Engineering Meets Fierce Competition
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      9 curated arenas spanning technical research, rapid CAD modeling, eSports battles, tactical chess, and campus-wide treasure hunts.
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <div className="text-xl font-black text-amber-400 font-mono flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        <span>Bumper</span>
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5 font-semibold">Cash Prizes</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <div className="text-xl font-black text-emerald-400 font-mono flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>100%</span>
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5 font-semibold">Certificate to All</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <div className="text-2xl font-black text-white font-mono">9</div>
                      <div className="text-xs text-slate-400 mt-0.5">Competitions</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <div className="text-2xl font-black text-orange-400 font-mono">₹50–₹100</div>
                      <div className="text-xs text-slate-400 mt-0.5">Affordable Fees</div>
                    </div>
                  </div>

                  {/* Quick Domain Badges */}
                  <div className="pt-2 border-t border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider mb-2">
                      Featured Domains
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-blue-900/50 text-blue-200 border border-blue-700/50">Technical Paper</span>
                      <span className="px-2.5 py-1 rounded-md bg-purple-900/50 text-purple-200 border border-purple-700/50">Free Fire Squad</span>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-900/50 text-emerald-200 border border-emerald-700/50">Neon Cricket</span>
                      <span className="px-2.5 py-1 rounded-md bg-amber-900/50 text-amber-200 border border-amber-700/50">CAD War</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
