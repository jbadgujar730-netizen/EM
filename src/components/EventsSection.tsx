import React, { useState, useMemo } from 'react';
import { useEventData } from '../context/EventDataContext';
import { EventCard } from './EventCard';
import { Search, Filter, Loader2, AlertCircle } from 'lucide-react';

export const EventsSection: React.FC = () => {
  const { events, isLoading, error } = useEventData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Engineering', 'Sports', 'Creativity', 'Gaming'];

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchCat =
        selectedCategory === 'All'
          ? true
          : selectedCategory === 'Creativity'
          ? e.category.toLowerCase().includes('creativity') || e.category.toLowerCase().includes('innovation')
          : e.category.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.coordinator_name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  return (
    <section id="events-section" className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-200 uppercase font-mono tracking-wider">
              Official Competitions
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Events & Challenges
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              Choose your arena from technical presentations and CAD battles to tactical eSports and sports tournaments. Fees are dynamically retrieved from the event database.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search competitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-2xs"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            <p className="text-sm font-medium">Fetching real-time event schedule and live fees from database...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Failed to connect to event database</h4>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No events matched your search</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or searching with different keywords.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Event Cards Grid */}
        {!isLoading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
