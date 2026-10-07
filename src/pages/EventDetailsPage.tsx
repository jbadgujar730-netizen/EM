import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useEventData } from '../context/EventDataContext';
import { ArrowLeft, User, Users, Phone, Calendar, ShieldCheck, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export const EventDetailsPage: React.FC = () => {
  const { routeParams, navigate } = useRouter();
  const { getEventBySlug, isLoading } = useEventData();

  const slug = routeParams.slug;
  const event = getEventBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        <p className="text-sm font-medium">Loading event specifications...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Event Not Found</h2>
          <p className="text-sm text-slate-600">The requested competition &ldquo;{slug}&rdquo; does not exist or has been removed.</p>
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-900 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Events
          </button>
        </div>
      </div>
    );
  }

  const rulesList = event.rules
    ? event.rules.split('\n').filter(r => r.trim().length > 0)
    : [];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-700">
          <button onClick={() => navigate('/')} className="hover:text-slate-900 font-medium">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/events')} className="hover:text-slate-900 font-medium">Events</button>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate">{event.name}</span>
        </div>

        {/* Back Link */}
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events List
        </button>

        {/* Header Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-900 border border-orange-200 font-mono">
              {event.category}
            </span>

            {event.registration_open ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Registration Open
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                <ShieldAlert className="w-3.5 h-3.5" />
                Registration Closed
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            {event.name}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {event.description}
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs text-slate-700 font-medium uppercase font-mono">Dynamic Fee</span>
              <div className="mt-1 flex items-baseline gap-1 font-mono">
                <span className="text-2xl font-black text-slate-900">₹{event.fee}</span>
                <span className="text-xs text-slate-500">/{event.registration_type}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs text-slate-700 font-medium uppercase font-mono">Team Type</span>
              <div className="mt-1 flex items-center gap-1.5 text-slate-900 font-bold text-sm">
                {event.registration_type === 'individual' ? (
                  <>
                    <User className="w-4 h-4 text-orange-600" />
                    <span>Solo Participant</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 text-orange-600" />
                    <span>
                      {event.min_team_size === event.max_team_size
                        ? `${event.min_team_size} Members`
                        : `${event.min_team_size}–${event.max_team_size} Members`}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs text-slate-700 font-medium uppercase font-mono">Fest Dates</span>
              <div className="mt-1 flex items-center gap-1.5 text-slate-900 font-bold text-sm">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span>13 & 14 Sept 2026</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200">
              <span className="text-xs text-orange-950 font-bold uppercase font-mono">Central Helpline</span>
              <div className="mt-1 text-slate-900 font-bold text-xs truncate">
                Chief Student Coordinator
              </div>
              <a
                href="tel:7769829891"
                className="text-xs text-orange-600 hover:underline font-mono font-bold flex items-center gap-1 mt-0.5"
              >
                <Phone className="w-3 h-3" />
                +91 7769829891
              </a>
            </div>
          </div>

          {/* Attractive Bumper Cash Prizes & Certificate to All Highlight */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  🏆 Bumper Cash Prizes & Official Certificate to All Participants!
                </h4>
                <p className="text-xs text-slate-600">
                  Endorsed by Sandip Foundation, SITRC Nashik & The Institution of Engineers (India).
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-600 text-white shrink-0 font-mono shadow-xs">
              100% Certificate Guaranteed
            </span>
          </div>
        </div>

        {/* Rules & Guidelines Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <ShieldCheck className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Official Competition Rules & Guidelines
            </h2>
          </div>

          <div className="space-y-3">
            {rulesList.length > 0 ? (
              rulesList.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">Rules will be briefed at the venue prior to the round commencement.</p>
            )}
          </div>
        </div>

        {/* Registration CTA Card */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold">Ready to participate in {event.name}?</h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Registration amount is strictly <span className="font-mono text-orange-400 font-bold">₹{event.fee}</span> with verified manual UPI payment. Ensure you have your transaction UTR and screenshot ready.
            </p>
          </div>

          {event.registration_open ? (
            <button
              onClick={() => navigate(`/register/${event.slug}`)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base bg-orange-600 hover:bg-orange-700 active:scale-95 text-white transition-all shadow-lg shadow-orange-600/30 whitespace-nowrap"
            >
              <span>Proceed to Register</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              disabled
              className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed whitespace-nowrap"
            >
              Registration Closed
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
