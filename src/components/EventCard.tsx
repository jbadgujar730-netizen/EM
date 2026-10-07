import React from 'react';
import { EventItem } from '../types';
import { useRouter } from '../context/RouterContext';
import { Users, User, Phone, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { navigate } = useRouter();

  const getCategoryColor = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('gaming')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (c.includes('sports')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (c.includes('creativity') || c.includes('innovation')) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getTeamSizeLabel = () => {
    if (event.registration_type === 'individual') {
      return 'Individual';
    }
    if (event.min_team_size === event.max_team_size) {
      return `Team (${event.min_team_size} members)`;
    }
    return `Team (${event.min_team_size}–${event.max_team_size} members)`;
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      {/* Top Header Strip */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
          {event.registration_open ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Open
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <ShieldAlert className="w-3 h-3" />
              Closed
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
          {event.name}
        </h3>

        <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Meta Specs Grid */}
      <div className="px-6 py-3.5 bg-slate-50/80 border-y border-slate-100 grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          {event.registration_type === 'individual' ? (
            <User className="w-4 h-4 text-orange-600 shrink-0" />
          ) : (
            <Users className="w-4 h-4 text-orange-600 shrink-0" />
          )}
          <span className="font-semibold truncate">{getTeamSizeLabel()}</span>
        </div>

        <div className="flex items-center justify-end gap-1 font-mono">
          <span className="text-slate-500">Fee:</span>
          <span className="text-base font-extrabold text-slate-900">
            ₹{event.fee}
          </span>
          <span className="text-[11px] text-slate-500">
            /{event.registration_type === 'individual' ? 'person' : 'team'}
          </span>
        </div>
      </div>

      {/* Awards & Certificate Perk */}
      <div className="px-6 py-2.5 text-xs text-amber-700 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-bold text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Bumper Cash Prizes</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Certificate to All</span>
        </span>
      </div>

      {/* Action Footer */}
      <div className="p-6 pt-2 mt-auto flex items-center gap-2">
        <button
          onClick={() => navigate(`/events/${event.slug}`)}
          className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs transition-colors text-center"
        >
          View Rules
        </button>

        {event.registration_open ? (
          <button
            onClick={() => navigate(`/register/${event.slug}`)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-all shadow-md shadow-orange-600/20 active:scale-95"
          >
            <span>Register Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            disabled
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs cursor-not-allowed"
          >
            Registration Closed
          </button>
        )}
      </div>
    </div>
  );
};
