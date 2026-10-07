import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { fetchRegistrationReceipt } from '../lib/api';
import { Registration } from '../types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Printer,
  ArrowRight,
  Clock,
  Building,
  User,
  Users,
  Calendar,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Loader2
} from 'lucide-react';

export const RegistrationSuccessPage: React.FC = () => {
  const { routeParams, navigate } = useRouter();
  const registrationId = routeParams.registrationId;

  const [receipt, setReceipt] = useState<Registration | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!registrationId) return;

    fetchRegistrationReceipt(registrationId)
      .then((data) => {
        setReceipt(data);
        setLoading(false);
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      })
      .catch((err) => {
        setError(err.message || 'Receipt could not be loaded');
        setLoading(false);
      });
  }, [registrationId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        <p className="text-sm font-semibold">Generating official registration receipt...</p>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Receipt Not Found</h2>
          <p className="text-xs text-slate-600">
            Could not retrieve registration details for ID: {registrationId}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Success Banner (Hidden during print) */}
        <div className="print:hidden text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Registration Submitted Successfully!
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Your registration has been submitted successfully. Your payment will be manually verified by the event administration team.
          </p>
        </div>

        {/* Official Printable Receipt Card */}
        <div id="receipt-card" className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6 print:border-none print:shadow-none print:p-0">
          
          {/* Receipt Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-2xl tracking-tight text-slate-950">
                  MECH<span className="text-orange-600">VORTEX</span> 2026
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  RECEIPT
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1">
                Sandip Institute of Technology & Research Centre (SITRC), Nashik
              </p>
              <p className="text-[11px] text-slate-700">
                Department of Mechanical Engineering • MESA & IEI Student Chapter
              </p>
            </div>

            <div className="text-left sm:text-right font-mono">
              <span className="text-[11px] text-slate-700 uppercase block font-semibold">Registration ID</span>
              <span className="text-xl sm:text-2xl font-black text-orange-600 tracking-wider">
                {receipt.registration_id}
              </span>
              <span className="text-[11px] text-slate-700 block mt-0.5">
                {new Date(receipt.submitted_at).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Payment Status Alert Strip */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <span className="font-bold text-amber-950 block">Payment Verification Status:</span>
                <span className="text-amber-800">
                  {receipt.payment_status === 'Verified'
                    ? 'Payment verified by event committee.'
                    : receipt.payment_status === 'Rejected'
                    ? 'Payment rejected. Please contact event desk.'
                    : 'Pending manual UPI transaction verification.'}
                </span>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                receipt.payment_status === 'Verified'
                  ? 'bg-emerald-100 text-emerald-800'
                  : receipt.payment_status === 'Rejected'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {receipt.payment_status}
            </span>
          </div>

          {/* Core Registration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Event & Amount */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-[11px] font-bold text-slate-700 uppercase font-mono tracking-wider block">
                Event Details
              </span>
              <div>
                <span className="text-slate-500">Event:</span>{' '}
                <span className="font-bold text-slate-900 text-sm block">{receipt.event_name}</span>
              </div>
              <div>
                <span className="text-slate-500">Registration Type:</span>{' '}
                <span className="font-semibold text-slate-800 uppercase">{receipt.registration_type}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-mono">
                <span className="text-slate-500 font-sans">Amount Paid:</span>
                <span className="text-lg font-black text-slate-900">₹{receipt.amount}</span>
              </div>
              <div className="font-mono text-[11px]">
                <span className="text-slate-500 font-sans">Transaction UTR:</span>{' '}
                <span className="font-bold text-slate-900">{receipt.utr}</span>
              </div>
            </div>

            {/* Candidate / Team Details */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-[11px] font-bold text-slate-700 uppercase font-mono tracking-wider block">
                Candidate Information
              </span>
              {receipt.team_name && (
                <div>
                  <span className="text-slate-500">Team Name:</span>{' '}
                  <span className="font-bold text-slate-900">{receipt.team_name}</span>
                </div>
              )}
              <div>
                <span className="text-slate-500">Leader / Participant:</span>{' '}
                <span className="font-bold text-slate-900">{receipt.leader_name}</span>
              </div>
              <div>
                <span className="text-slate-500">Email:</span>{' '}
                <span className="font-semibold text-slate-800">{receipt.leader_email}</span>
              </div>
              <div>
                <span className="text-slate-500">Mobile:</span>{' '}
                <span className="font-semibold text-slate-800">+91 {receipt.leader_mobile}</span>
              </div>
              <div>
                <span className="text-slate-500">College:</span>{' '}
                <span className="font-semibold text-slate-800">{receipt.college}</span>
              </div>
              <div>
                <span className="text-slate-500">Branch & Year:</span>{' '}
                <span className="font-semibold text-slate-800">{receipt.department} ({receipt.year})</span>
              </div>
            </div>
          </div>

          {/* Team Members List (If Applicable) */}
          {receipt.team_members && receipt.team_members.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase font-mono tracking-wider block">
                Registered Team Members
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {receipt.team_members.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200">
                    <User className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="font-bold text-slate-800">{m.name}</span>
                    {m.mobile && <span className="text-slate-500">({m.mobile})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Festival Guidelines */}
          <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-900">Important Instructions for Participants:</p>
            <p>1. Please carry this printed receipt or digital copy on your phone to the SITRC campus entry gate.</p>
            <p>2. Carry your official College Identity Card for verification at the registration desk.</p>
            <p>3. Report to Department of Mechanical Engineering (D-Building) by 8:30 AM on the event morning.</p>
            <p>4. In case of verification queries, mention your Registration ID: <span className="font-mono font-bold text-slate-900">{receipt.registration_id}</span>.</p>
            <p className="pt-1 text-emerald-800 font-bold">
              📜 Certificate of Participation: All verified participants will receive an official Sandip Foundation & IEI endorsed certificate!
            </p>
            <p className="text-amber-800 font-bold">
              🏆 Bumper Cash Prizes & Trophies: Winner announcements and cash disbursement will take place at the grand valedictory stage!
            </p>
          </div>

          {/* Receipt Footer Signature */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">MECHVORTEX 2026 Organizing Committee</p>
              <p>Sandip Institute of Technology & Research Centre, Nashik</p>
            </div>
            <div className="text-left sm:text-right font-mono text-[10px]">
              Computer Generated Digital Receipt • Valid Without Physical Signature
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="print:hidden flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Register for Another Event
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Download / Print Registration Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
};
