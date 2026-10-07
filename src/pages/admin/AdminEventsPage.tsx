import React, { useState } from 'react';
import { useEventData } from '../../context/EventDataContext';
import { useToast } from '../../context/ToastContext';
import { updateAdminEvent, createAdminEvent } from '../../lib/api';
import { EventItem } from '../../types';
import {
  Calendar,
  Plus,
  Edit2,
  CheckCircle2,
  ShieldAlert,
  IndianRupee,
  Users,
  Phone,
  Save,
  X,
  Loader2,
  Sparkles
} from 'lucide-react';

export const AdminEventsPage: React.FC = () => {
  const { events, refreshData } = useEventData();
  const { showToast } = useToast();

  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isNewEventModal, setIsNewEventModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // New Event Form State
  const [newForm, setNewForm] = useState<Partial<EventItem>>({
    name: '',
    slug: '',
    category: 'Engineering',
    fee: 100,
    registration_type: 'individual',
    min_team_size: 1,
    max_team_size: 1,
    coordinator_name: '',
    coordinator_phone: '',
    description: '',
    rules: '',
    registration_open: true
  });

  // Toggle registration_open quick action
  const handleToggleRegistration = async (event: EventItem) => {
    try {
      await updateAdminEvent(event.id, {
        registration_open: !event.registration_open
      });
      showToast(
        `Registration for "${event.name}" is now ${!event.registration_open ? 'OPEN' : 'CLOSED'}.`,
        'success'
      );
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update registration status', 'error');
    }
  };

  // Save edited event
  const handleSaveEdit = async () => {
    if (!editingEvent) return;
    setIsSaving(true);
    try {
      await updateAdminEvent(editingEvent.id, {
        name: editingEvent.name,
        category: editingEvent.category,
        fee: editingEvent.fee,
        registration_type: editingEvent.registration_type,
        min_team_size: editingEvent.min_team_size,
        max_team_size: editingEvent.max_team_size,
        coordinator_name: editingEvent.coordinator_name,
        coordinator_phone: editingEvent.coordinator_phone,
        description: editingEvent.description,
        rules: editingEvent.rules,
        registration_open: editingEvent.registration_open
      });
      showToast(`Event "${editingEvent.name}" updated successfully! Fee: ₹${editingEvent.fee}`, 'success');
      setEditingEvent(null);
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update event', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Create new event
  const handleCreateEvent = async () => {
    if (!newForm.name || !newForm.slug || newForm.fee === undefined) {
      showToast('Name, slug, and fee are required.', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await createAdminEvent(newForm);
      showToast(`New event "${newForm.name}" created successfully!`, 'success');
      setIsNewEventModal(false);
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create event', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            Event & Fee Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dynamic fee modification, team size reconfiguration, rules editing, and registration toggles
          </p>
        </div>

        <button
          onClick={() => setIsNewEventModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Events Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                  {event.category}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleRegistration(event)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                    event.registration_open
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                  }`}
                  title="Click to toggle registration status"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      event.registration_open ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                  />
                  <span>{event.registration_open ? 'Open' : 'Closed'}</span>
                </button>
              </div>

              <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{event.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{event.description}</p>
            </div>

            {/* Spec rows */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between items-center font-mono">
                <span className="text-slate-500 font-sans">Dynamic Fee:</span>
                <span className="text-lg font-black text-slate-900">₹{event.fee}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Team Format:</span>
                <span className="font-semibold text-slate-800">
                  {event.registration_type === 'individual'
                    ? 'Individual'
                    : event.min_team_size === event.max_team_size
                    ? `${event.min_team_size} members`
                    : `${event.min_team_size} to ${event.max_team_size} members`}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Coordinator:</span>
                <span className="font-semibold text-slate-800">
                  {event.coordinator_name} ({event.coordinator_phone})
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setEditingEvent(event)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Edit2 className="w-3.5 h-3.5 text-orange-400" />
              <span>Edit Event & Fee</span>
            </button>
          </div>
        ))}
      </div>

      {/* EDIT EVENT MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-orange-600 uppercase">
                  Event Configurator
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Edit &ldquo;{editingEvent.name}&rdquo;
                </h3>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                className="p-2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Name</label>
                  <input
                    type="text"
                    value={editingEvent.name}
                    onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option>Engineering</option>
                    <option>Sports</option>
                    <option>Creativity</option>
                    <option>Gaming</option>
                    <option>Creativity / Innovation</option>
                  </select>
                </div>

                {/* DYNAMIC FEE INPUT */}
                <div>
                  <label className="block font-bold text-orange-950 mb-1 font-mono uppercase">
                    Registration Fee (₹ INR) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingEvent.fee}
                    onChange={(e) => setEditingEvent({ ...editingEvent, fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-orange-500 font-mono font-bold text-sm bg-orange-50/30"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Modifying this immediately updates the public website fee.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration Type</label>
                  <select
                    value={editingEvent.registration_type}
                    onChange={(e) => setEditingEvent({ ...editingEvent, registration_type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="individual">Individual</option>
                    <option value="team">Team</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Team Size</label>
                  <input
                    type="number"
                    min={1}
                    value={editingEvent.min_team_size}
                    onChange={(e) => setEditingEvent({ ...editingEvent, min_team_size: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Team Size</label>
                  <input
                    type="number"
                    min={1}
                    value={editingEvent.max_team_size}
                    onChange={(e) => setEditingEvent({ ...editingEvent, max_team_size: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coordinator Name</label>
                  <input
                    type="text"
                    value={editingEvent.coordinator_name}
                    onChange={(e) => setEditingEvent({ ...editingEvent, coordinator_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coordinator Phone</label>
                  <input
                    type="text"
                    value={editingEvent.coordinator_phone}
                    onChange={(e) => setEditingEvent({ ...editingEvent, coordinator_phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rules & Guidelines (1 per line)</label>
                <textarea
                  rows={4}
                  value={editingEvent.rules}
                  onChange={(e) => setEditingEvent({ ...editingEvent, rules: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="reg_toggle_check"
                  checked={editingEvent.registration_open}
                  onChange={(e) => setEditingEvent({ ...editingEvent, registration_open: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <label htmlFor="reg_toggle_check" className="font-bold text-slate-800 cursor-pointer">
                  Registration is Open for this Event
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW EVENT MODAL */}
      {isNewEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-900">Create New Event</h3>
              <button onClick={() => setIsNewEventModal(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Robot War"
                    value={newForm.name}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slug (URL friendly) *</label>
                  <input
                    type="text"
                    placeholder="e.g. robot-war"
                    value={newForm.slug}
                    onChange={(e) => setNewForm({ ...newForm, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newForm.category}
                    onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option>Engineering</option>
                    <option>Sports</option>
                    <option>Creativity</option>
                    <option>Gaming</option>
                    <option>Creativity / Innovation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-orange-950 mb-1 font-mono uppercase">Registration Fee (₹) *</label>
                  <input
                    type="number"
                    min={0}
                    value={newForm.fee}
                    onChange={(e) => setNewForm({ ...newForm, fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={newForm.registration_type}
                    onChange={(e) => setNewForm({ ...newForm, registration_type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="individual">Individual</option>
                    <option value="team">Team</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Team Size</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={newForm.min_team_size}
                      onChange={(e) => setNewForm({ ...newForm, min_team_size: Number(e.target.value) })}
                      className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={newForm.max_team_size}
                      onChange={(e) => setNewForm({ ...newForm, max_team_size: Number(e.target.value) })}
                      className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coordinator Name</label>
                  <input
                    type="text"
                    value={newForm.coordinator_name}
                    onChange={(e) => setNewForm({ ...newForm, coordinator_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coordinator Phone</label>
                  <input
                    type="text"
                    value={newForm.coordinator_phone}
                    onChange={(e) => setNewForm({ ...newForm, coordinator_phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newForm.description}
                  onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rules</label>
                <textarea
                  rows={3}
                  value={newForm.rules}
                  onChange={(e) => setNewForm({ ...newForm, rules: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewEventModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateEvent}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Create Event</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
