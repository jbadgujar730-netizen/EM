import React, { useState, useEffect } from 'react';
import { fetchAdminAuditLogs } from '../../lib/api';
import { AuditLogItem } from '../../types';
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Settings,
  RefreshCw,
  Loader2,
  Calendar,
  User,
  Filter
} from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const loadLogs = async () => {
    try {
      const data = await fetchAdminAuditLogs();
      setLogs(data.logs);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();

    // Listen to realtime stream
    const eventSource = new EventSource('/api/realtime/stream');
    eventSource.onmessage = () => {
      loadLogs();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const filteredLogs = logs.filter(log => {
    if (categoryFilter === 'all') return true;
    return log.category === categoryFilter;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'auth':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'verification':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'events':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              Administrative Audit Logs
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Realtime Stream
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tamper-evident activity trail for logins, approvals, payment decisions, and system edits
          </p>
        </div>

        <button
          onClick={() => loadLogs()}
          className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shrink-0 self-start sm:self-auto"
          title="Refresh audit logs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'auth', 'verification', 'events', 'settings'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase font-mono tracking-wide transition-colors ${
              categoryFilter === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <p className="text-sm font-semibold">No audit logs recorded for this category yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Admin Actor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getCategoryBadge(log.category)}`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 leading-relaxed">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800">{log.admin_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.admin_email}</div>
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
