import React, { useState, useEffect } from 'react';
import { useEventData } from '../../context/EventDataContext';
import { useToast } from '../../context/ToastContext';
import { updateAdminSettings } from '../../lib/api';
import {
  Settings,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Save,
  Database,
  Code2,
  Copy,
  Check,
  Loader2,
  Sparkles
} from 'lucide-react';

export const AdminSiteSettingsPage: React.FC = () => {
  const { settings, refreshData } = useEventData();
  const { showToast } = useToast();

  const [eventName, setEventName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [venue, setVenue] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (settings) {
      setEventName(settings.event_name || 'MECHVORTEX 2026');
      setTagline(settings.event_tagline || '');
      setDescription(settings.event_description || '');
      setStartDate(settings.start_date || '13 September 2026');
      setEndDate(settings.end_date || '14 September 2026');
      setVenue(settings.venue || '');
      setEmail(settings.contact_email || '');
      setPhone(settings.contact_phone || '');
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateAdminSettings({
        event_name: eventName,
        event_tagline: tagline,
        event_description: description,
        start_date: startDate,
        end_date: endDate,
        venue,
        contact_email: email,
        contact_phone: phone
      });
      showToast('Global fest settings updated successfully!', 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const sampleSql = `-- Run this in your Supabase SQL Editor if connecting a remote Supabase project:
-- Schema file is saved in: /supabase/schema.sql
-- Tables created: events, registrations, team_members, admin_profiles, site_settings
-- Bucket created: payment-proofs (private)`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sampleSql);
    setCopiedSql(true);
    showToast('Schema reference snippet copied!', 'info');
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
          Global Festival & Venue Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Store event dates, venue location, institutional contact info, and branding dynamically in the database
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase font-mono tracking-wider mb-1">
              Event Official Title *
            </label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase font-mono tracking-wider mb-1">
              Event Theme Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900"
            />
          </div>

          {/* DYNAMIC DATES */}
          <div>
            <label className="block text-xs font-bold text-orange-900 uppercase font-mono tracking-wider mb-1">
              Start Date (Dynamic) *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-orange-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-orange-400 font-bold text-sm text-slate-900 bg-orange-50/20"
                placeholder="13 September 2026"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-orange-900 uppercase font-mono tracking-wider mb-1">
              End Date (Dynamic) *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-orange-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-orange-400 font-bold text-sm text-slate-900 bg-orange-50/20"
                placeholder="14 September 2026"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase font-mono tracking-wider mb-1">
              Helpdesk Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase font-mono tracking-wider mb-1">
              Helpdesk Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* DYNAMIC VENUE */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase font-mono tracking-wider mb-1">
            Official Campus Venue (Dynamic) *
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-orange-600 absolute left-3.5 top-3.5" />
            <textarea
              rows={2}
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 leading-relaxed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase font-mono tracking-wider mb-1">
            Global Fest Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Global Settings</span>
          </button>
        </div>
      </form>

      {/* Supabase Schema Reference Card */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="font-mono font-bold text-base text-slate-200">
              Supabase Architecture & DDL Migration
            </h3>
          </div>

          <button
            onClick={handleCopySql}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold transition-colors"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Reference</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The full production database schema, RLS policies, storage bucket policies, and seeds are stored in <code className="text-orange-400">supabase/schema.sql</code>. It creates all tables: <code className="text-slate-300">events</code>, <code className="text-slate-300">registrations</code>, <code className="text-slate-300">team_members</code>, <code className="text-slate-300">site_settings</code>, and <code className="text-slate-300">admin_profiles</code>.
        </p>

        <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-400 border border-slate-800">
          <code>VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY can be provided in .env to connect directly to your remote Supabase cloud project.</code>
        </div>
      </div>

    </div>
  );
};
