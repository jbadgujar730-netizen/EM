import React from 'react';
import { EventsSection } from '../components/EventsSection';

export const EventsPage: React.FC = () => {
  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <EventsSection />
      </div>
    </div>
  );
};
