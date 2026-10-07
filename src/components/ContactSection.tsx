import React from 'react';
import { useEventData } from '../context/EventDataContext';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings } = useEventData();

  const officialEmail = settings?.contact_email || 'hiteshbadgujar.mech@sitrc.org';
  const helplinePhone = settings?.contact_phone || '7769829891';

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-200 uppercase font-mono tracking-wider">
            Get in Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Event Coordination & Support
          </h2>
          <p className="text-base text-slate-600">
            Have questions regarding MECHVORTEX 2026 guidelines, venue directions, or registration verification? Connect directly with the festival desk.
          </p>
        </div>

        {/* Campus & Department Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Venue Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-100 text-orange-600 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Campus Venue</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {settings?.venue || 'Department of Mechanical Engineering, D-Building, Sandip Institute of Technology & Research Centre (SITRC), Mahiravani, Nashik – 422213'}
              </p>
            </div>
          </div>

          {/* Official Email Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600 shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 mb-1">Official Email</h4>
              <p className="text-xs text-slate-600 mb-2">
                For official festival correspondence:
              </p>
              <a
                href={`mailto:${officialEmail}`}
                className="text-xs sm:text-sm font-bold text-orange-600 hover:underline break-all"
              >
                {officialEmail}
              </a>
            </div>
          </div>

          {/* Central Helpline Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Central Helpline</h4>
              <p className="text-xs text-slate-600 mb-2 font-medium">
                Chief Student Coordinator:
              </p>
              <a
                href={`tel:${helplinePhone}`}
                className="text-sm font-mono font-bold text-orange-600 hover:underline"
              >
                +91 {helplinePhone}
              </a>
            </div>
          </div>
        </div>

        {/* Institutional Assurance */}
        <div className="mt-12 max-w-3xl mx-auto p-5 rounded-2xl bg-slate-50/80 border border-slate-200 text-center text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">
            Department of Mechanical Engineering, SITRC, Nashik
          </p>
          <p>
            In association with Mechanical Engineering Student Association (MESA) & Institution of Engineers India (IEI) Student Chapter
          </p>
        </div>

      </div>
    </section>
  );
};
