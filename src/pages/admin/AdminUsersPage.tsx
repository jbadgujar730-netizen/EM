import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  fetchAdminUsers,
  approveAdminUser,
  rejectAdminUser,
  deleteAdminUser
} from '../../lib/api';
import { AdminUser } from '../../types';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Loader2,
  UserCheck,
  UserX,
  Sparkles
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);

  const loadUsers = async () => {
    try {
      const data = await fetchAdminUsers();
      setUsersList(data.users);
      setIsSuperAdmin(data.isSuperAdmin);
    } catch (err: any) {
      showToast('Failed to load admin list: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();

    // Listen to realtime events for admin updates
    const eventSource = new EventSource('/api/realtime/stream');
    eventSource.onmessage = () => {
      loadUsers();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleApprove = async (id: string, name: string) => {
    setActionLoading(id);
    try {
      await approveAdminUser(id);
      showToast(`Admin account for ${name} has been APPROVED! They can now log in.`, 'success');
      await loadUsers();
    } catch (err: any) {
      showToast(err.message || 'Approval failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string, name: string) => {
    setActionLoading(id);
    try {
      await rejectAdminUser(id);
      showToast(`Admin access for ${name} has been revoked.`, 'info');
      await loadUsers();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete admin ${name}?`)) return;
    setActionLoading(id);
    try {
      await deleteAdminUser(id);
      showToast(`Admin profile for ${name} deleted.`, 'info');
      await loadUsers();
    } catch (err: any) {
      showToast(err.message || 'Deletion failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = usersList.filter(u => u.approval_status === 'pending').length;

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              Admin Approvals & Role Governance
            </h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                {pendingCount} Pending Approval{pendingCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Super Admin Control Center: Only accounts approved by Super Admin (Prof. Hitesh Badgujar) can access festival tools
          </p>
        </div>

        <button
          onClick={() => loadUsers()}
          className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shrink-0 self-start sm:self-auto"
          title="Refresh admin list"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Super Admin Status Banner */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                Master Authority
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Super Admin
              </span>
            </div>
            <p className="text-sm font-bold text-white mt-0.5">
              Prof. Hitesh Badgujar <span className="font-mono text-xs text-slate-400 font-normal">(hiteshbadgujar.mech@sitrc.org)</span>
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-300 sm:text-right">
          <span className="block font-semibold">Security Policy:</span>
          <span>Only Super Admin can approve, promote, or revoke administrator accounts.</span>
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Approval Status</th>
                  <th className="py-3 px-4">Approved By</th>
                  <th className="py-3 px-4 text-right">Super Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {usersList.map((admin) => {
                  const isMasterSuper = admin.email.toLowerCase() === 'hiteshbadgujar.mech@sitrc.org';
                  const isPending = admin.approval_status === 'pending';
                  const isApproved = admin.approval_status === 'approved';
                  const isRejected = admin.approval_status === 'rejected';

                  return (
                    <tr
                      key={admin.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isPending ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4 text-slate-900 font-bold flex items-center gap-2">
                        <span>{admin.name}</span>
                        {isMasterSuper && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                            Super Admin
                          </span>
                        )}
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {admin.email}
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {admin.department || 'Mechanical Engineering'}
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 uppercase font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-bold">
                          {admin.role}
                        </span>
                      </td>

                      {/* Approval Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isPending
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold animate-pulse'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {isPending && <Clock className="w-3 h-3 text-amber-600" />}
                          {isRejected && <XCircle className="w-3 h-3 text-rose-600" />}
                          <span>{admin.approval_status || 'Approved'}</span>
                        </span>
                      </td>

                      {/* Approved By */}
                      <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                        {admin.approved_by ? (
                          <div>
                            <span className="font-semibold text-slate-800">{admin.approved_by}</span>
                            {admin.approved_at && (
                              <span className="text-slate-400 block text-[10px]">
                                {new Date(admin.approved_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Pending Super Admin</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isMasterSuper ? (
                          <span className="text-[11px] text-slate-400 font-mono italic">
                            Protected Super Admin
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {/* Approve button */}
                            {(!isApproved || isPending) && (
                              <button
                                onClick={() => handleApprove(admin.id, admin.name)}
                                disabled={actionLoading === admin.id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-colors disabled:opacity-50"
                                title="Approve admin account"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                            )}

                            {/* Revoke / Reject button */}
                            {isApproved && (
                              <button
                                onClick={() => handleReject(admin.id, admin.name)}
                                disabled={actionLoading === admin.id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[11px] transition-colors disabled:opacity-50"
                                title="Revoke admin access"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>Revoke</span>
                              </button>
                            )}

                            {/* Delete button */}
                            <button
                              onClick={() => handleDelete(admin.id, admin.name)}
                              disabled={actionLoading === admin.id}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-50"
                              title="Delete admin account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
