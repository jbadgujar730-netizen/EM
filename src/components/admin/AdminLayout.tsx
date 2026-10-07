import React, { useState, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { fetchAdminUsers } from '../../lib/api';
import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  CreditCard,
  Settings,
  Download,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Flame,
  Radio,
  UserCheck,
  Activity
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentPath, navigate } = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);

  const isSuperAdmin = user?.role === 'super_admin' || user?.email.toLowerCase() === 'hiteshbadgujar.mech@sitrc.org';

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdminUsers()
        .then(res => setPendingApprovalsCount(res.pendingCount))
        .catch(() => {});
    }
  }, [isSuperAdmin, currentPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p className="text-sm font-semibold">Verifying administrative credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const baseMenuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Registrations', path: '/admin/registrations', icon: ClipboardList },
    { label: 'Manage Events', path: '/admin/events', icon: Calendar },
    { label: 'Payment Settings', path: '/admin/settings/payment', icon: CreditCard },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  // Append Super Admin only item
  const menuItems = [
    ...baseMenuItems,
    ...(isSuperAdmin
      ? [{ label: 'Admin Approvals', path: '/admin/users', icon: UserCheck, badge: pendingApprovalsCount }]
      : []),
    { label: 'Audit Logs', path: '/admin/logs', icon: Activity }
  ];

  const handleNav = (path: string) => {
    setMobileSidebarOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 text-slate-300 border-r border-slate-800 shrink-0 select-none">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white font-mono tracking-tight">
              MECH<span className="text-orange-500">VORTEX</span>
            </span>
            <span className="text-[10px] block font-mono text-orange-400 font-bold uppercase tracking-wider">
              {isSuperAdmin ? 'Super Admin Console' : 'Admin Control Center'}
            </span>
          </div>
        </div>

        {/* Live SSE status indicator */}
        <div className="px-6 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-400 font-mono text-[11px]">Realtime Active</span>
          </div>
          {isSuperAdmin && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800 font-mono">
              SUPER
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            const badgeCount = (item as any).badge;

            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {badgeCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-orange-400 flex items-center justify-center font-bold text-xs uppercase border border-slate-700">
              {user?.name?.substring(0, 2) || 'AD'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden bg-slate-950 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
            <Flame className="w-4 h-4 fill-white" />
          </div>
          <span className="font-extrabold text-base font-mono">
            MECH<span className="text-orange-500">VORTEX</span> ADMIN
          </span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950 flex flex-col p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="font-mono font-bold text-lg text-white">MECHVORTEX ADMIN</span>
            </div>
            <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="py-6 flex-1 space-y-2 overflow-y-auto">
            {menuItems.map(item => {
              const Icon = item.icon;
              const badgeCount = (item as any).badge;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold ${
                    currentPath === item.path ? 'bg-orange-600 text-white' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {badgeCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950">
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-800 flex flex-col gap-3">
            <button
              onClick={() => { setMobileSidebarOpen(false); navigate('/'); }}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Back to Public Website</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-rose-900 text-rose-100 text-xs font-bold flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {children}
      </main>

    </div>
  );
};
