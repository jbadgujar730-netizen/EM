import React, { useState, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { fetchAdminDashboard, fetchSystemStatus } from '../../lib/api';
import { DashboardStats } from '../../types';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
  Calendar,
  ArrowRight,
  TrendingUp,
  Download,
  Database,
  Radio,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Eye
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { navigate } = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sysStatus, setSysStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [data, sys] = await Promise.all([
        fetchAdminDashboard(),
        fetchSystemStatus()
      ]);
      setStats(data);
      setSysStatus(sys);
    } catch (err) {
      console.error('Failed to load dashboard statistics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen for realtime events
    const eventSource = new EventSource('/api/realtime/stream');
    eventSource.onmessage = () => {
      // Re-fetch stats on any registration or verification
      loadData();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations,
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Verified Registrations',
      value: stats.verifiedRegistrations,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Pending Verification',
      value: stats.pendingRegistrations,
      icon: Clock,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Rejected Registrations',
      value: stats.rejectedRegistrations,
      icon: XCircle,
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      title: 'Total Collection',
      value: `₹${stats.totalCollection.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-300'
    },
    {
      title: "Today's Registrations",
      value: stats.todayRegistrations,
      icon: Calendar,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              MECHVORTEX Admin Dashboard
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Department of Mechanical Engineering, SITRC Nashik • Real-time database metrics
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadData()}
            className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <a
            href="/api/admin/export/csv"
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 line-clamp-1">
                  {card.title}
                </span>
                <div className={`p-2 rounded-lg border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Event Breakdown + Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Event-wise registrations */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">
              Event-Wise Registrations & Collection
            </h3>
            <button
              onClick={() => navigate('/admin/events')}
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              Manage Fees & Events →
            </button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {stats.eventBreakdown.map((item, idx) => {
              const maxCount = Math.max(1, ...stats.eventBreakdown.map(b => b.count));
              const pct = (item.count / maxCount) * 100;
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="font-semibold text-slate-800 truncate pr-2">{item.eventName}</span>
                    <div className="flex items-center gap-3 shrink-0 font-mono">
                      <span className="font-bold text-slate-900">{item.count} reg.</span>
                      <span className="text-emerald-700 font-semibold">₹{item.amount}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Verification Distribution & Supabase Status */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Payment Verification Distribution
            </h3>

            <div className="space-y-3">
              {stats.statusDistribution.map((item, idx) => {
                const total = Math.max(1, stats.totalRegistrations);
                const pct = ((item.count / total) * 100).toFixed(1);
                const isVerified = item.status === 'Verified';
                const isRejected = item.status === 'Rejected';

                return (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          isVerified ? 'bg-emerald-500' : isRejected ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                      />
                      <span className="font-bold text-slate-800">{item.status}</span>
                    </div>
                    <div className="font-mono flex items-center gap-2">
                      <span className="font-black text-slate-900">{item.count}</span>
                      <span className="text-slate-400">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate('/admin/registrations')}
              className="w-full py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Review Pending Payments</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Supabase Connection Status Card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
                <Database className="w-4 h-4 text-emerald-400" />
                DATABASE ENGINE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                ONLINE
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p>Type: <span className="font-mono text-emerald-400 font-bold">{sysStatus?.database?.type || 'Integrated PostgreSQL / Store'}</span></p>
              <p>Supabase Config: <span className="font-mono text-slate-300">{sysStatus?.database?.supabase_configured ? 'Active' : 'Ready (schema ready)'}</span></p>
            </div>

            <p className="text-[11px] text-slate-400">
              Full Supabase schema and RLS policies are generated in <code className="text-slate-200">supabase/schema.sql</code>.
            </p>
          </div>

        </div>

      </div>

      {/* Recent Registrations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-slate-900">
            Recent Submissions
          </h3>
          <button
            onClick={() => navigate('/admin/registrations')}
            className="text-xs font-bold text-orange-600 hover:underline"
          >
            View All ({stats.totalRegistrations}) →
          </button>
        </div>

        {stats.recentRegistrations.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No registrations received yet. Once participants submit, they will appear here in real time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Reg ID</th>
                  <th className="py-3 px-3">Candidate / Team</th>
                  <th className="py-3 px-3">Event</th>
                  <th className="py-3 px-3">College</th>
                  <th className="py-3 px-3 font-mono">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {stats.recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {reg.registration_id}
                    </td>
                    <td className="py-3 px-3 text-slate-800">
                      <div className="font-bold">{reg.leader_name}</div>
                      {reg.team_name && <div className="text-[11px] text-slate-500">{reg.team_name}</div>}
                    </td>
                    <td className="py-3 px-3 text-slate-700">{reg.event_name}</td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{reg.college}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">₹{reg.amount}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate('/admin/registrations')}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-slate-100 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
