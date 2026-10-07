import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EventItem, SiteSettings } from '../types';
import { fetchEvents, fetchSiteSettings } from '../lib/api';
import { useToast } from './ToastContext';

interface EventDataContextType {
  events: EventItem[];
  settings: SiteSettings | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  getEventBySlug: (slug: string) => EventItem | undefined;
}

const EventDataContext = createContext<EventDataContextType | undefined>(undefined);

export const EventDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [eventsData, settingsData] = await Promise.all([
        fetchEvents(),
        fetchSiteSettings()
      ]);
      setEvents(eventsData);
      setSettings(settingsData);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load initial event data:', err);
      setError('Unable to load event information. Please check connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Setup Realtime Server-Sent Events connection
    const eventSource = new EventSource('/api/realtime/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'registration_created') {
          showToast(`⚡ New registration received: ${data.payload.registration_id} (${data.payload.event_name})`, 'info');
        } else if (data.event === 'event_updated') {
          // Re-fetch events so dynamic fee/status changes are immediate
          fetchEvents().then(updatedEvents => setEvents(updatedEvents)).catch(() => {});
        } else if (data.event === 'settings_updated') {
          // Re-fetch settings so dynamic UPI/QR/dates changes are immediate
          fetchSiteSettings().then(updatedSettings => setSettings(updatedSettings)).catch(() => {});
        }
      } catch (e) {
        // ignore parse error
      }
    };

    eventSource.onerror = () => {
      // Reconnect handled automatically by EventSource
    };

    return () => {
      eventSource.close();
    };
  }, [loadData, showToast]);

  const getEventBySlug = useCallback((slug: string) => {
    return events.find(e => e.slug.toLowerCase() === slug.toLowerCase());
  }, [events]);

  return (
    <EventDataContext.Provider
      value={{
        events,
        settings,
        isLoading,
        error,
        refreshData: loadData,
        getEventBySlug
      }}
    >
      {children}
    </EventDataContext.Provider>
  );
};

export const useEventData = () => {
  const context = useContext(EventDataContext);
  if (!context) {
    throw new Error('useEventData must be used within an EventDataProvider');
  }
  return context;
};
