import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { requestAdminAccess } from '../../lib/api';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  AlertTriangle,
  Building,
  CheckCircle2
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { navigate } = useRouter();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'request'>('login');
  
  // Login form state (empty by default for security)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPendingApproval, setIsPendingApproval] = useState(false);

  // Request access form state
  const [reqName, setReqName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqDept, setReqDept] = useState('Mechanical Engineering');
  const [reqPassword, setReqPassword] = useState('');
  const [reqRole, setReqRole] = useState('admin');
  const [requestSuccess, setRequestSuccess] = useState(false);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsPendingApproval(false);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back, Administrator!', 'success');
      navigate('/admin');
    } catch (err: any) {
      const msg = err.message || 'Invalid admin credentials.';
      setErrorMessage(msg);
      if (msg.includes('pending approval') || msg.includes('approval by Super Admin')) {
        setIsPendingApproval(true);
      }
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!reqName || !reqEmail || !reqPassword) {
      setErrorMessage('All required fields must be completed.');
      return;
    }

    setLoading(true);
    try {
      await requestAdminAccess({
        name: reqName,
        email: reqEmail,
        department: reqDept,
        password: reqPassword,
        role: reqRole
      });
      setRequestSuccess(true);
      showToast('Admin request submitted to Super Admin for approval.', 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to submit admin request.');
      showToast(err.message || 'Request submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Public Website
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-orange-600/25">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            MECH<span className="text-orange-500">VORTEX</span> 2026
          </h1>
          <p className="text-xs text-slate-400">
            Official Administration & Super Admin Control Portal
          </p>
        </div>

        {/* Main Card */}
        <div className="mt-8 bg-slate-950/95 backdrop-blur-md py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          {/* Tabs */}
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-bold">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('request');
                setErrorMessage(null);
                setRequestSuccess(false);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'request'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Request Admin Access
            </button>
          </div>

          {/* Error Alert Banner */}
          {errorMessage && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
              isPendingApproval
                ? 'bg-amber-950/70 border-amber-800 text-amber-200'
                : 'bg-rose-950/70 border-rose-800 text-rose-200'
            }`}>
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <span className="font-bold block">
                  {isPendingApproval ? 'Approval Required' : 'Authentication Error'}
                </span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* MODE 1: LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-orange-500"
                    placeholder="name@sitrc.org"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-orange-500"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-orange-600 hover:bg-orange-700 active:scale-95 text-white transition-all shadow-md shadow-orange-600/30 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Authorize & Enter Admin Portal</span>
              </button>
            </form>
          ) : (
            /* MODE 2: REQUEST ACCESS */
            <div className="space-y-4">
              {requestSuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="font-bold text-sm text-white">Access Request Submitted!</h3>
                  <p className="text-xs text-emerald-300 leading-relaxed">
                    Your account has been registered in the system. Because <strong className="text-white">Admin access is strictly approved by Super Admin</strong>, you will be able to log in once Prof. Hitesh Badgujar (<code className="text-emerald-100">hiteshbadgujar.mech@sitrc.org</code>) verifies and approves your request.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setRequestSuccess(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs border border-slate-700"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequestAccess} className="space-y-4">
                  <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-800/60 text-orange-200 text-xs">
                    <span className="font-bold block">Super Admin Approval Policy:</span>
                    All new admin accounts require approval by Super Admin (Prof. Hitesh Badgujar) before activation.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={reqName}
                        onChange={(e) => setReqName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-orange-500"
                        placeholder="Faculty / Staff / Coordinator Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Institutional / Official Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={reqEmail}
                        onChange={(e) => setReqEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-orange-500"
                        placeholder="staff.name@sitrc.ac.in"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Department
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={reqDept}
                        onChange={(e) => setReqDept(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-orange-500"
                        placeholder="Mechanical Engineering"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Requested Role
                    </label>
                    <select
                      value={reqRole}
                      onChange={(e) => setReqRole(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-orange-500"
                    >
                      <option value="admin">Festival Administrator (Full Event Access)</option>
                      <option value="coordinator">Event Coordinator (Verification Only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Desired Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={reqPassword}
                        onChange={(e) => setReqPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-orange-500"
                        placeholder="Create secure password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-orange-600 hover:bg-orange-700 active:scale-95 text-white transition-all shadow-md shadow-orange-600/30 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>Submit Request for Super Admin Approval</span>
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
            Protected by Sandip University / SITRC Security Protocol
          </div>

        </div>

      </div>
    </div>
  );
};
