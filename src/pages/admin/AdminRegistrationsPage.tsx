import React, { useState, useEffect } from 'react';
import { useEventData } from '../../context/EventDataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  fetchAdminRegistrations,
  verifyPayment,
  rejectPayment,
  deleteAdminRegistration,
  getPaymentProofUrl
} from '../../lib/api';
import { Registration, PaymentStatus } from '../../types';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  AlertTriangle,
  X,
  FileSpreadsheet,
  Loader2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  User,
  Users,
  Trash2
} from 'lucide-react';

export const AdminRegistrationsPage: React.FC = () => {
  const { events } = useEventData();
  const { user } = useAuth();
  const { showToast } = useToast();

  const isSuperAdmin = user?.role === 'super_admin' || user?.email.toLowerCase() === 'hiteshbadgujar.mech@sitrc.org';

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Selected registration for modal detail & verification
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Reject confirmation dialog state
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Verify confirmation dialog state
  const [verifyModalOpen, setVerifyModalOpen] = useState<boolean>(false);

  // Super Admin Delete confirmation dialog state
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [regToDelete, setRegToDelete] = useState<Registration | null>(null);

  const loadRegistrations = async () => {
    try {
      const data = await fetchAdminRegistrations({
        event_id: selectedEvent,
        status: selectedStatus,
        search
      });
      setRegistrations(data.registrations);
    } catch (err: any) {
      showToast('Failed to load registrations: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();

    // Listen for realtime SSE events
    const eventSource = new EventSource('/api/realtime/stream');
    eventSource.onmessage = () => {
      loadRegistrations();
    };

    return () => {
      eventSource.close();
    };
  }, [selectedEvent, selectedStatus, search]);

  const handleVerify = async () => {
    if (!selectedReg) return;
    setActionLoading(true);
    try {
      const updated = await verifyPayment(selectedReg.id);
      showToast(`Payment for ${updated.registration_id} verified successfully!`, 'success');
      setSelectedReg(updated);
      setVerifyModalOpen(false);
      loadRegistrations();
    } catch (err: any) {
      showToast(err.message || 'Failed to verify payment', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReg) return;
    setActionLoading(true);
    try {
      const updated = await rejectPayment(selectedReg.id, rejectionReason);
      showToast(`Payment for ${updated.registration_id} marked as rejected.`, 'info');
      setSelectedReg(updated);
      setRejectModalOpen(false);
      setRejectionReason('');
      loadRegistrations();
    } catch (err: any) {
      showToast(err.message || 'Failed to reject payment', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!regToDelete) return;
    setActionLoading(true);
    try {
      await deleteAdminRegistration(regToDelete.id);
      showToast(`Registration ${regToDelete.registration_id} permanently deleted.`, 'success');
      setDeleteModalOpen(false);
      if (selectedReg && selectedReg.id === regToDelete.id) {
        setSelectedReg(null);
      }
      setRegToDelete(null);
      loadRegistrations();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete registration', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getExportUrl = () => {
    const params = new URLSearchParams();
    if (selectedEvent !== 'all') params.set('event_id', selectedEvent);
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    return `/api/admin/export/csv?${params.toString()}`;
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            Registrations & Payment Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manual UPI transaction inspection, proof review, and participant audit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadRegistrations()}
            className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <a
            href={getExportUrl()}
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Filtered CSV</span>
          </a>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, name, email, mobile, UTR, college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
          />
        </div>

        {/* Filter by Event */}
        <div className="sm:col-span-4">
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-orange-500"
          >
            <option value="all">All Events</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.name}</option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-orange-500"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-2">
            <Filter className="w-10 h-10 mx-auto stroke-1 text-slate-300" />
            <p className="font-bold text-sm text-slate-700">No registrations found</p>
            <p className="text-xs">Try adjusting your search criteria or resetting filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200 select-none">
                <tr>
                  <th className="py-3 px-3.5">Registration ID</th>
                  <th className="py-3 px-3.5">Date & Time</th>
                  <th className="py-3 px-3.5">Event</th>
                  <th className="py-3 px-3.5">Candidate / Team</th>
                  <th className="py-3 px-3.5">Contact</th>
                  <th className="py-3 px-3.5">College</th>
                  <th className="py-3 px-3.5 font-mono">Amount</th>
                  <th className="py-3 px-3.5 font-mono">UTR</th>
                  <th className="py-3 px-3.5">Payment Status</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID */}
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {reg.registration_id}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3.5 text-slate-500 whitespace-nowrap text-[11px]">
                      {new Date(reg.submitted_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    {/* Event */}
                    <td className="py-3 px-3.5 text-slate-800 font-semibold max-w-[150px] truncate">
                      {reg.event_name}
                    </td>

                    {/* Candidate */}
                    <td className="py-3 px-3.5 text-slate-800">
                      <div className="font-bold">{reg.leader_name}</div>
                      {reg.team_name && (
                        <div className="text-[11px] text-orange-700 font-medium truncate">
                          Team: {reg.team_name}
                        </div>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3.5 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      <div>+91 {reg.leader_mobile}</div>
                      <div className="text-slate-400 truncate max-w-[140px] font-sans">{reg.leader_email}</div>
                    </td>

                    {/* College */}
                    <td className="py-3 px-3.5 text-slate-600 max-w-[140px] truncate">
                      {reg.college}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3.5 font-mono font-black text-slate-900">
                      ₹{reg.amount}
                    </td>

                    {/* UTR */}
                    <td className="py-3 px-3.5 font-mono text-slate-700 font-semibold uppercase">
                      {reg.utr}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          reg.payment_status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : reg.payment_status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {reg.payment_status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReg(reg)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect & Verify</span>
                        </button>

                        {isSuperAdmin && (
                          <button
                            onClick={() => {
                              setRegToDelete(reg);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 hover:border-rose-300 transition-colors"
                            title="Super Admin: Permanently Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL & VERIFICATION MODAL */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-orange-600 block">
                  Registration Verification Console
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-xl font-bold font-mono text-slate-900">
                    {selectedReg.registration_id}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      selectedReg.payment_status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedReg.payment_status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedReg.payment_status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedReg(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Details */}
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-700 uppercase font-mono block">Event & Fee</span>
                  <div className="text-sm font-bold text-slate-900">{selectedReg.event_name}</div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-slate-500 font-sans">Amount Expected:</span>
                    <span className="text-base font-black text-slate-900">₹{selectedReg.amount}</span>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-slate-500 font-sans">Submitted UTR:</span>
                    <span className="font-bold text-orange-600">{selectedReg.utr}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-700 uppercase font-mono block">Participant Details</span>
                  {selectedReg.team_name && (
                    <p><span className="text-slate-500">Team:</span> <span className="font-bold text-slate-900">{selectedReg.team_name}</span></p>
                  )}
                  <p><span className="text-slate-500">Leader / Name:</span> <span className="font-bold text-slate-900">{selectedReg.leader_name}</span></p>
                  <p><span className="text-slate-500">Mobile:</span> <span className="font-mono font-bold text-slate-900">+91 {selectedReg.leader_mobile}</span></p>
                  <p><span className="text-slate-500">Email:</span> <span className="text-slate-800">{selectedReg.leader_email}</span></p>
                  <p><span className="text-slate-500">College:</span> <span className="text-slate-800">{selectedReg.college}</span></p>
                  <p><span className="text-slate-500">Department:</span> <span className="text-slate-800">{selectedReg.department} ({selectedReg.year})</span></p>
                </div>

                {/* Team Members */}
                {selectedReg.team_members && selectedReg.team_members.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-700 uppercase font-mono block">Registered Team Members</span>
                    {selectedReg.team_members.map((m, idx) => (
                      <div key={idx} className="flex justify-between border-t border-slate-200 pt-1 text-[11px]">
                        <span className="font-bold text-slate-800">• {m.name}</span>
                        <span className="text-slate-500 font-mono">{m.mobile || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Audit notes if verified or rejected */}
                {selectedReg.verified_at && (
                  <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-600 space-y-0.5">
                    <p><span className="font-semibold text-slate-800">Action Timestamp:</span> {new Date(selectedReg.verified_at).toLocaleString()}</p>
                    <p><span className="font-semibold text-slate-800">Audited By:</span> {selectedReg.verified_by || 'Admin'}</p>
                    {selectedReg.rejection_reason && (
                      <p className="text-rose-700"><span className="font-semibold">Rejection Note:</span> {selectedReg.rejection_reason}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Private Payment Screenshot Proof */}
              <div className="space-y-3">
                <span className="font-bold text-xs text-slate-700 uppercase font-mono block">
                  Confidential Payment Screenshot Proof
                </span>

                <div className="border border-slate-200 rounded-2xl p-2 bg-slate-900 flex items-center justify-center min-h-[260px] max-h-[360px] overflow-hidden relative group">
                  <img
                    src={getPaymentProofUrl(selectedReg.payment_screenshot_path)}
                    alt={`Payment Proof ${selectedReg.registration_id}`}
                    className="max-h-[340px] max-w-full object-contain rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  
                  {/* Fallback button to open proof in new tab */}
                  <a
                    href={getPaymentProofUrl(selectedReg.payment_screenshot_path)}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Full Proof</span>
                  </a>
                </div>
                <p className="text-[11px] text-slate-500 text-center">
                  Verify that the UTR and ₹{selectedReg.amount} match the bank account statement.
                </p>
              </div>

            </div>

            {/* Modal Verification Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReg(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100"
                >
                  Close
                </button>

                {isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setRegToDelete(selectedReg);
                      setDeleteModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs transition-all shadow-xs"
                    title="Super Admin Exclusive Action"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(true)}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Payment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVerifyModalOpen(true)}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Payment</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: VERIFY PAYMENT */}
      {verifyModalOpen && selectedReg && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Confirm Payment Verification</h4>
              <p className="text-xs text-slate-600">
                Are you sure you want to mark payment for <span className="font-mono font-bold">{selectedReg.registration_id}</span> ({selectedReg.leader_name}) as <span className="font-bold text-emerald-600">Verified</span>?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setVerifyModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                {actionLoading ? 'Verifying...' : 'Yes, Confirm Verification'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: REJECT PAYMENT */}
      {rejectModalOpen && selectedReg && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Confirm Payment Rejection</h4>
              <p className="text-xs text-slate-600">
                Are you sure you want to reject payment for <span className="font-mono font-bold">{selectedReg.registration_id}</span>?
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Rejection (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. UTR mismatch or screenshot unreadable"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-rose-500"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20"
              >
                {actionLoading ? 'Rejecting...' : 'Yes, Reject Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: SUPER ADMIN DELETE REGISTRATION RECORD */}
      {deleteModalOpen && regToDelete && (
        <div className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Super Admin Exclusive Authority
              </span>
              <h4 className="text-lg font-bold text-slate-900">Permanently Delete Registration?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete <span className="font-mono font-bold text-slate-900">{regToDelete.registration_id}</span> ({regToDelete.leader_name}, {regToDelete.event_name})?
              </p>
              <div className="text-[11px] text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-100 text-left space-y-1">
                <span className="font-bold block">⚠️ Permanent Action:</span>
                <p>This will completely remove the participant record, team members, payment UTR, and delete the payment screenshot proof from disk storage.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setRegToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Yes, Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
