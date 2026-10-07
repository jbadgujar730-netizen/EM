import React, { useState, useEffect } from 'react';
import { useEventData } from '../../context/EventDataContext';
import { useToast } from '../../context/ToastContext';
import { updatePaymentSettings } from '../../lib/api';
import {
  CreditCard,
  QrCode,
  Upload,
  Save,
  CheckCircle2,
  Phone,
  HelpCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const AdminPaymentSettingsPage: React.FC = () => {
  const { settings, refreshData } = useEventData();
  const { showToast } = useToast();

  const [upiId, setUpiId] = useState('');
  const [instructions, setInstructions] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setUpiId(settings.upi_id || '');
      setInstructions(settings.payment_instructions || '');
      setContactPhone(settings.contact_phone || '');
      if (settings.qr_code_path && settings.qr_code_path !== 'Not configured') {
        setQrPreview(settings.qr_code_path);
      }
    }
  }, [settings]);

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQrFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setQrPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('upi_id', upiId);
      formData.append('payment_instructions', instructions);
      formData.append('contact_phone', contactPhone);
      if (qrFile) {
        formData.append('qr_code_image', qrFile);
      }

      await updatePaymentSettings(formData);
      showToast('Payment settings and QR code updated successfully!', 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update payment settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
          UPI Payment Settings & QR Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure the official receiver UPI ID, upload payment QR code, and update instructions
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        
        {/* UPI ID & QR Code Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* QR Code Upload & Preview */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
              Official Receiver QR Code
            </label>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50/50 hover:border-orange-500 transition-colors">
              <div className="w-48 h-48 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden mb-3 shadow-2xs">
                {qrPreview ? (
                  <img
                    src={qrPreview}
                    alt="Active UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-4 text-slate-400">
                    <QrCode className="w-12 h-12 mx-auto stroke-1 text-slate-300 mb-1" />
                    <span className="text-xs font-medium">No QR Code Uploaded</span>
                  </div>
                )}
              </div>

              <input
                type="file"
                id="qr-upload"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleQrChange}
                className="hidden"
              />
              <label
                htmlFor="qr-upload"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-orange-400" />
                <span>Upload New QR Image</span>
              </label>
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Supports PNG, JPG, WEBP (Max 5MB). Live across all registration pages.
              </p>
            </div>
          </div>

          {/* UPI ID & Contact Phone */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase font-mono tracking-wider mb-1.5">
                Receiver UPI ID (VPA) *
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. mechvortex@okhdfcbank or 8446058699@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900 focus:outline-hidden focus:border-orange-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Participants can copy this UPI ID directly from the payment screen.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase font-mono tracking-wider mb-1.5">
                Payment Helpline Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="e.g. 8446058699"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 focus:outline-hidden focus:border-orange-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Manual Verification Model:</span>
                <p>
                  MECHVORTEX uses strictly manual UPI verification. No gateway fees or Razorpay/Stripe cuts are deducted. Administrators inspect the UTR and bank credit before approving.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Payment Instructions Text Area */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
            Payment Instructions for Participants
          </label>
          <textarea
            rows={6}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-300 text-xs text-slate-800 leading-relaxed font-mono focus:outline-hidden focus:border-orange-500"
            placeholder="1. Scan the QR code...&#10;2. Pay the exact fee..."
          />
          <p className="text-[11px] text-slate-500">
            Displayed step-by-step to users during the checkout phase.
          </p>
        </div>

        {/* Save CTA */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Payment Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
