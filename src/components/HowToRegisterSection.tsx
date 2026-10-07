import React from 'react';
import { useRouter } from '../context/RouterContext';
import { ClipboardList, QrCode, FileCheck, Award, ArrowRight } from 'lucide-react';

export const HowToRegisterSection: React.FC = () => {
  const { navigate } = useRouter();

  const steps = [
    {
      num: '01',
      title: 'Select Event & Review Rules',
      desc: 'Browse through our 9 engineering, sports, gaming, and creativity competitions. Check eligibility and team size requirements.',
      icon: ClipboardList,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      num: '02',
      title: 'Fill Participant Details',
      desc: 'Provide your personal, academic, and team details. For team events, enter member names and contact information accurately.',
      icon: FileCheck,
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    {
      num: '03',
      title: 'Scan UPI QR & Pay Exact Fee',
      desc: 'Open Google Pay, PhonePe, Paytm, or BHIM. Scan the official event QR code and pay the exact dynamically calculated registration fee.',
      icon: QrCode,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      num: '04',
      title: 'Submit UTR & Download Receipt',
      desc: 'Enter the 12-digit UTR transaction number, upload the payment screenshot, and get your unique Registration ID (MVX-2026-XXXXXX).',
      icon: Award,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    }
  ];

  return (
    <section id="how-to-register" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 uppercase font-mono tracking-wider">
            Registration Guide
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How to Register for MECHVORTEX 2026
          </h2>
          <p className="text-base text-slate-600">
            A transparent 4-step registration process with verified manual UPI confirmation and instant downloadable digital receipts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-3xl font-black text-slate-300">
                      {step.num}
                    </span>
                    <div className={`p-3 rounded-xl border ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80 flex items-center text-xs font-semibold text-slate-500">
                  <span>Step {step.num} of 04</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span>Start Registration Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
