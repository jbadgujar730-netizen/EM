import React from 'react';
import { ShieldCheck, Cpu, Trophy, Palette, Gamepad2, Award } from 'lucide-react';
import { SandipFoundationLogo, SitrcLogo, IeiLogo, MesaLogo } from './logos/Logos';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      title: 'Engineering Rigor',
      desc: 'Technical Paper Presentation, CAD War, and Technical Treasure Hunt pushing problem-solving and design boundaries.',
      icon: Cpu,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Competitive Sports',
      desc: 'High-octane Neon Cricket under fluorescent arena lighting and tactical Grandmaster Chess tournaments.',
      icon: Trophy,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Creativity & Innovation',
      desc: 'Poster Presentation and IdeaPitch (Kumbh Mela) challenging students to design sustainable solutions for society.',
      icon: Palette,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Tactical Gaming',
      desc: 'Free Fire Squad Battle Royale where communication, split-second reflexes, and teamwork crown champions.',
      icon: Gamepad2,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200 uppercase font-mono tracking-wider">
            About the Festival
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About MECHVORTEX 2026
          </h2>
          <p className="text-base text-slate-700 leading-relaxed">
            MECHVORTEX is the signature annual multidisciplinary symposium conceived and hosted by the 
            <span className="font-semibold text-slate-900"> Department of Mechanical Engineering</span> at 
            <span className="font-semibold text-slate-900"> Sandip Institute of Technology & Research Centre (SITRC), Nashik</span>.
          </p>
        </div>

        {/* Official Consortium Logos Showcase Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-12">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-xs font-mono uppercase font-black tracking-widest text-orange-600 block mb-1">
              Organizing Bodies & Accreditation
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Jointly Hosted Under Prestigious Institutional Patronage
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* 1. Sandip Foundation */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <SandipFoundationLogo className="h-16 w-auto mb-3" />
              <h4 className="font-bold text-sm text-slate-900">Sandip Foundation</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Premier educational foundation providing world-class engineering infrastructure and campus excellence.
              </p>
            </div>

            {/* 2. SITRC */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <SitrcLogo className="h-14 w-auto mb-3" />
              <h4 className="font-bold text-sm text-slate-900">SITRC Nashik</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Sandip Institute of Technology & Research Centre, accredited for academic rigor and technical prowess.
              </p>
            </div>

            {/* 3. IEI India */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <IeiLogo className="h-16 w-auto mb-3" />
              <h4 className="font-bold text-sm text-slate-900">IEI Student Chapter</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                The Institution of Engineers (India), royal charter established 1920. Apex engineering professional body.
              </p>
            </div>

            {/* 4. MESA SITRC */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <MesaLogo className="h-14 w-auto mb-3" />
              <h4 className="font-bold text-sm text-slate-900">MESA SITRC</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Mechanical Engineering Student Association, empowering student engineers through experiential leadership.
              </p>
            </div>
          </div>
        </div>

        {/* Overview Banner */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">
                Fostering Innovation, Athleticism, and Technical Excellence
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Conducted under the joint patronage of the 
                <span className="font-semibold text-slate-900"> Mechanical Engineering Student Association (MESA)</span> and the 
                <span className="font-semibold text-slate-900"> Institution of Engineers India (IEI) Student Chapter</span>, MECHVORTEX provides an inclusive collegiate platform for undergraduate and diploma students from engineering colleges across the state.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Whether fabricating technical papers, drafting intricate mechanical CAD models, solving rapid-fire aptitude quizzes, or competing in high-spirited neon cricket and Free Fire arenas, the symposium celebrates both technical intellect and extracurricular spirit.
              </p>
            </div>

            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Institutional Excellence</h4>
                  <p className="text-xs text-slate-600">SITRC Nashik (Approved by AICTE)</p>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-3 text-xs text-slate-700 space-y-1">
                <p><span className="font-semibold text-slate-900">Campus:</span> Mahiravani, Trimbak Road, Nashik</p>
                <p><span className="font-semibold text-slate-900">Host Department:</span> Mechanical Engineering (D-Building)</p>
                <p><span className="font-semibold text-slate-900">Event Frequency:</span> Annual Flagship Symposium</p>
                <p className="pt-1 text-emerald-700 font-bold flex items-center gap-1">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Certificate to All Registered Participants
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
