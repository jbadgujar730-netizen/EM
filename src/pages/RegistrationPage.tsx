import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useEventData } from '../context/EventDataContext';
import { useToast } from '../context/ToastContext';
import { submitRegistration } from '../lib/api';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Users,
  QrCode,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Loader2,
  Plus,
  Trash2,
  Info
} from 'lucide-react';

interface MemberForm {
  name: string;
  email: string;
  mobile: string;
  college: string;
  department: string;
  year: string;
}

export const RegistrationPage: React.FC = () => {
  const { routeParams, navigate } = useRouter();
  const { getEventBySlug, settings, isLoading: dataLoading } = useEventData();
  const { showToast } = useToast();

  const slug = routeParams.slug;
  const event = getEventBySlug(slug);

  // Wizard Step: 1 (Details) -> 2 (Payment) -> 3 (Review)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Form Fields
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderMobile, setLeaderMobile] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('Second Year (SE)');
  const [division, setDivision] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<MemberForm[]>([]);

  // Payment Fields
  const [utr, setUtr] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize team members according to event team requirements
  useEffect(() => {
    if (event && event.registration_type === 'team') {
      const requiredAdditional = Math.max(0, event.min_team_size - 1);
      const initial: MemberForm[] = [];
      for (let i = 0; i < requiredAdditional; i++) {
        initial.push({
          name: '',
          email: '',
          mobile: '',
          college: '',
          department: '',
          year: 'Second Year (SE)'
        });
      }
      setTeamMembers(initial);
    }
  }, [event]);

  if (dataLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">Event not found</h2>
          <button
            onClick={() => navigate('/events')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Explore Events
          </button>
        </div>
      </div>
    );
  }

  if (!event.registration_open) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Registration Closed</h2>
          <p className="text-sm text-slate-600">
            Registrations for &ldquo;{event.name}&rdquo; have concluded.
          </p>
          <button
            onClick={() => navigate('/events')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Check Other Events
          </button>
        </div>
      </div>
    );
  }

  // Handle Screenshot Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

      if (!validTypes.includes(file.type.toLowerCase())) {
        showToast('Please upload an image file (JPG, JPEG, PNG, or WEBP)', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('File size exceeds the 5MB limit. Please upload a smaller image.', 'error');
        return;
      }

      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setScreenshotPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyUpi = () => {
    if (settings?.upi_id && settings.upi_id !== 'Not configured') {
      navigator.clipboard.writeText(settings.upi_id);
      setCopiedUpi(true);
      showToast('UPI ID copied to clipboard!', 'success');
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!leaderName.trim()) errs.leaderName = 'Full Name is required.';
    
    if (!leaderEmail.trim()) {
      errs.leaderEmail = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leaderEmail.trim())) {
      errs.leaderEmail = 'Please provide a valid email address.';
    }

    const cleanMob = leaderMobile.replace(/\D/g, '');
    if (!cleanMob) {
      errs.leaderMobile = 'Mobile number is required.';
    } else if (cleanMob.length !== 10) {
      errs.leaderMobile = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!college.trim()) errs.college = 'College/Institute name is required.';
    if (!department.trim()) errs.department = 'Department name is required.';

    if (event.registration_type === 'team') {
      if (!teamName.trim()) errs.teamName = 'Team Name is required.';

      const totalTeam = 1 + teamMembers.length;
      if (totalTeam < event.min_team_size || totalTeam > event.max_team_size) {
        errs.teamMembers = `Team size must be between ${event.min_team_size} and ${event.max_team_size} members (including leader). Current: ${totalTeam}`;
      }

      teamMembers.forEach((m, idx) => {
        if (!m.name.trim()) errs[`member_${idx}_name`] = `Member ${idx + 2} name is required.`;
        if (m.mobile) {
          const mob = m.mobile.replace(/\D/g, '');
          if (mob.length !== 10) {
            errs[`member_${idx}_mobile`] = `Member ${idx + 2} mobile must be 10 digits.`;
          }
        }
      });
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!utr.trim()) {
      errs.utr = 'UTR / Transaction ID is required.';
    } else if (utr.trim().length < 6) {
      errs.utr = 'UTR / Transaction ID must be at least 6 characters.';
    }

    if (!screenshotFile) {
      errs.screenshot = 'Please upload your payment screenshot proof.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextToPayment = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast('Please fix the highlighted fields in the form.', 'error');
    }
  };

  const handleNextToReview = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast('Please provide your UTR and upload the payment screenshot.', 'error');
    }
  };

  // Dynamic team members management
  const handleAddMember = () => {
    const maxAllowedMembers = event.max_team_size - 1; // excluding leader
    if (teamMembers.length < maxAllowedMembers) {
      setTeamMembers(prev => [
        ...prev,
        {
          name: '',
          email: '',
          mobile: '',
          college: college || '',
          department: department || '',
          year: 'Second Year (SE)'
        }
      ]);
    } else {
      showToast(`Maximum ${event.max_team_size} members allowed for this event.`, 'info');
    }
  };

  const handleRemoveMember = (index: number) => {
    const minAllowedMembers = event.min_team_size - 1;
    if (teamMembers.length > minAllowedMembers) {
      setTeamMembers(prev => prev.filter((_, idx) => idx !== index));
    } else {
      showToast(`Minimum ${event.min_team_size} members required for ${event.name}.`, 'info');
    }
  };

  const handleMemberChange = (index: number, field: keyof MemberForm, value: string) => {
    setTeamMembers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Final Submission
  const handleSubmitRegistration = async () => {
    if (!screenshotFile) {
      showToast('Payment screenshot is required', 'error');
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('event_id', event.id);
      formData.append('event_slug', event.slug);
      formData.append('leader_name', leaderName);
      formData.append('leader_email', leaderEmail);
      formData.append('leader_mobile', leaderMobile);
      formData.append('college', college);
      formData.append('department', department);
      formData.append('year', year);
      if (division) formData.append('division', division);
      if (event.registration_type === 'team') {
        formData.append('team_name', teamName);
        formData.append('team_members', JSON.stringify(teamMembers));
      }
      formData.append('utr', utr);
      formData.append('payment_screenshot', screenshotFile);

      const res = await submitRegistration(formData);

      showToast('Registration submitted successfully!', 'success');
      navigate(`/registration-success/${res.registration.registration_id}`);
    } catch (err: any) {
      showToast(err.message || 'Unable to submit registration. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/events/${event.slug}`)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Event Details
          </button>

          <span className="text-xs font-mono font-bold text-slate-500 uppercase">
            MECHVORTEX 2026 Registration
          </span>
        </div>

        {/* Event Banner */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-orange-400 uppercase tracking-wider">
                {event.category}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                🏆 Bumper Cash Prizes
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                📜 Certificate to All
              </span>
            </div>
            <h1 className="text-2xl font-bold mt-1">{event.name}</h1>
            <p className="text-xs text-slate-400 mt-1">
              {event.registration_type === 'individual' ? 'Individual Registration' : 'Team Registration'} •{' '}
              {event.registration_type === 'team'
                ? event.min_team_size === event.max_team_size
                  ? `${event.min_team_size} Members`
                  : `${event.min_team_size} to ${event.max_team_size} Members`
                : '1 Participant'}
            </p>
          </div>

          <div className="bg-slate-800 px-5 py-3 rounded-xl border border-slate-700/80 text-right sm:text-right shrink-0 font-mono">
            <span className="text-[11px] text-slate-400 block uppercase">Registration Fee</span>
            <span className="text-2xl font-black text-orange-400">₹{event.fee}</span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: 1, label: '1. Details' },
              { num: 2, label: '2. Payment' },
              { num: 3, label: '3. Review' }
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <div
                  key={step.num}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-xs'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isPast ? <Check className="w-4 h-4" /> : null}
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: PARTICIPANT / TEAM DETAILS */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" />
                {event.registration_type === 'team' ? 'Team & Leader Information' : 'Participant Information'}
              </h2>
              <p className="text-xs text-slate-700 mt-1">
                Please enter your accurate academic and contact details for official certification and fest entry.
              </p>
            </div>

            {/* Team Name for Team Events */}
            {event.registration_type === 'team' && (
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-orange-950">
                  Team Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Turbo Warriors / Apex Innovators"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-orange-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
                {errors.teamName && <p className="text-xs text-rose-600 font-semibold">{errors.teamName}</p>}
              </div>
            )}

            {/* Leader / Participant Inputs */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">
                {event.registration_type === 'team' ? 'Team Leader Details' : 'Personal Details'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                  {errors.leaderName && <p className="text-xs text-rose-600 mt-1">{errors.leaderName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                  {errors.leaderEmail && <p className="text-xs text-rose-600 mt-1">{errors.leaderEmail}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    10-Digit Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={leaderMobile}
                      onChange={(e) => setLeaderMobile(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 rounded-r-xl border border-slate-300 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                  {errors.leaderMobile && <p className="text-xs text-rose-600 mt-1">{errors.leaderMobile}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    College / Institute Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SITRC Nashik"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                  {errors.college && <p className="text-xs text-rose-600 mt-1">{errors.college}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Department / Branch <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mechanical Engineering"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                  {errors.department && <p className="text-xs text-rose-600 mt-1">{errors.department}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Academic Year <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-white"
                  >
                    <option>First Year (FE)</option>
                    <option>Second Year (SE)</option>
                    <option>Third Year (TE)</option>
                    <option>Final Year (BE)</option>
                    <option>Diploma</option>
                    <option>Postgraduate / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Class / Division (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A / B"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Team Members List (If Team Event) */}
            {event.registration_type === 'team' && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-600" />
                      Additional Team Members ({teamMembers.length} member{teamMembers.length === 1 ? '' : 's'})
                    </h3>
                    <p className="text-xs text-slate-700">
                      Total team requirement: {event.min_team_size === event.max_team_size
                        ? `${event.min_team_size} members`
                        : `${event.min_team_size} to ${event.max_team_size} members`} (including Team Leader).
                    </p>
                  </div>

                  {/* Add member button if within max_team_size */}
                  {1 + teamMembers.length < event.max_team_size && (
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Member
                    </button>
                  )}
                </div>

                {errors.teamMembers && (
                  <p className="text-xs text-rose-600 font-semibold">{errors.teamMembers}</p>
                )}

                <div className="space-y-4">
                  {teamMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 relative space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 font-mono">
                          Member #{idx + 2}
                        </span>
                        {1 + teamMembers.length > event.min_team_size && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(idx)}
                            className="text-rose-500 hover:text-rose-700 text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Full Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Member name"
                            value={member.name}
                            onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:border-orange-500 bg-white"
                          />
                          {errors[`member_${idx}_name`] && (
                            <p className="text-[10px] text-rose-600 mt-0.5">{errors[`member_${idx}_name`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Mobile (10 Digits)
                          </label>
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="Optional"
                            value={member.mobile || ''}
                            onChange={(e) => handleMemberChange(idx, 'mobile', e.target.value.replace(/\D/g, ''))}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:border-orange-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Email (Optional)
                          </label>
                          <input
                            type="email"
                            placeholder="Optional"
                            value={member.email || ''}
                            onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:border-orange-500 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Button */}
            <div className="pt-6 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={handleNextToPayment}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20 transition-all"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: MANUAL UPI PAYMENT */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200 uppercase font-mono tracking-wider mb-2">
                Manual UPI Verification
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Pay Registration Fee
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-1">
                Scan the official event QR code or pay using UPI ID. Enter your transaction UTR and upload the payment proof for manual committee verification.
              </p>
            </div>

            {/* Payment Display Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
              
              {/* Left Column: QR Code */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-56 h-56 bg-white p-3 rounded-2xl border-2 border-slate-300 shadow-sm flex items-center justify-center overflow-hidden">
                  {settings?.qr_code_path && settings.qr_code_path !== 'Not configured' ? (
                    <img
                      src={settings.qr_code_path}
                      alt="MECHVORTEX Official UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-4 space-y-2">
                      <QrCode className="w-16 h-16 stroke-1 text-slate-400" />
                      <p className="text-xs font-semibold text-slate-500">QR Code: Not configured</p>
                      <p className="text-[11px] text-slate-400 leading-tight">Admin will configure official QR soon</p>
                    </div>
                  )}
                </div>
                <span className="text-xs text-slate-700 font-semibold">
                  Scan via GPay, PhonePe, Paytm, or BHIM
                </span>
              </div>

              {/* Right Column: Dynamic Fee & UPI ID */}
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-700 uppercase font-mono tracking-wider block">
                    Exact Amount to Pay
                  </span>
                  <div className="text-3xl font-black text-slate-900 font-mono mt-0.5">
                    ₹{event.fee}
                  </div>
                  <span className="text-xs text-emerald-800 font-medium mt-1 block">
                    Fixed dynamic registration fee for {event.name}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <span className="text-xs text-slate-700 uppercase font-mono tracking-wider block">
                    Official Event UPI ID
                  </span>
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-mono text-sm font-bold text-slate-900 truncate">
                      {settings?.upi_id || 'Not configured'}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
                      title="Copy UPI ID"
                      disabled={!settings?.upi_id || settings.upi_id === 'Not configured'}
                    >
                      {copiedUpi ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed space-y-1">
                  <p className="font-bold text-slate-900">Payment Instructions:</p>
                  <p>1. Scan the QR code using any UPI application.</p>
                  <p>2. Pay the exact registration amount (₹{event.fee}).</p>
                  <p>3. Complete the payment.</p>
                  <p>4. Copy the UTR / Transaction ID.</p>
                  <p>5. Upload the payment screenshot.</p>
                  <p>6. Submit the registration.</p>
                </div>
              </div>
            </div>

            {/* Inputs: UTR & Screenshot */}
            <div className="space-y-6 pt-4 border-t border-slate-200">
              {/* UTR Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  UTR / Transaction ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 423589123456 (12-digit UPI reference)"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono text-sm tracking-wide focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                <p className="text-[11px] text-slate-500">
                  Found in your UPI app transaction history (UPI Ref No. / Transaction ID / UTR).
                </p>
                {errors.utr && <p className="text-xs text-rose-600 font-semibold">{errors.utr}</p>}
              </div>

              {/* Screenshot Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Upload Payment Screenshot Proof <span className="text-rose-500">*</span>
                </label>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-orange-500 transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    id="screenshot-input"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="screenshot-input" className="cursor-pointer space-y-3 block">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-orange-600 hover:underline">
                        Click to upload screenshot
                      </span>
                      <span className="text-sm text-slate-500"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-slate-700">
                      Supports JPG, JPEG, PNG, WEBP (Maximum size: 5 MB)
                    </p>
                  </label>
                </div>

                {errors.screenshot && <p className="text-xs text-rose-600 font-semibold">{errors.screenshot}</p>}

                {/* Screenshot Preview */}
                {screenshotPreview && (
                  <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={screenshotPreview}
                        alt="Screenshot Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-300"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate max-w-xs">
                          {screenshotFile?.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {((screenshotFile?.size || 0) / 1024 / 1024).toFixed(2)} MB • Ready to upload
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setScreenshotFile(null);
                        setScreenshotPreview(null);
                      }}
                      className="text-xs font-semibold text-rose-600 hover:underline px-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Back & Next Buttons */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Details</span>
              </button>

              <button
                type="button"
                onClick={handleNextToReview}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20 transition-all"
              >
                <span>Review Submission</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW DETAILS */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200 uppercase font-mono tracking-wider mb-2">
                Step 3 of 3: Verification Review
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Review Registration Details
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-1">
                Please verify that your contact info and payment transaction reference are correct before final submission.
              </p>
            </div>

            {/* Summary Information Cards */}
            <div className="space-y-4">
              {/* Event Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-700 uppercase font-mono font-semibold">Selected Event</span>
                  <div className="text-lg font-bold text-slate-900">{event.name}</div>
                  <div className="text-xs text-slate-500">{event.category} • {event.registration_type}</div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-slate-700 uppercase block font-semibold">Fee Amount</span>
                  <span className="text-2xl font-black text-orange-600">₹{event.fee}</span>
                </div>
              </div>

              {/* Personal / Team Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  {event.registration_type === 'team' ? 'Team & Leader Information' : 'Participant Details'}
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {event.registration_type === 'team' && (
                    <div>
                      <span className="text-slate-500">Team Name:</span>{' '}
                      <span className="font-bold text-slate-900">{teamName}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500">Leader Name:</span>{' '}
                    <span className="font-bold text-slate-900">{leaderName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Email:</span>{' '}
                    <span className="font-bold text-slate-900">{leaderEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Mobile:</span>{' '}
                    <span className="font-bold text-slate-900">+91 {leaderMobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">College:</span>{' '}
                    <span className="font-bold text-slate-900">{college}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Dept & Year:</span>{' '}
                    <span className="font-bold text-slate-900">{department} ({year})</span>
                  </div>
                </div>

                {/* Team Members List */}
                {event.registration_type === 'team' && teamMembers.length > 0 && (
                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-xs font-semibold text-slate-500 block mb-1">Additional Members:</span>
                    <div className="space-y-1">
                      {teamMembers.map((m, idx) => (
                        <div key={idx} className="text-xs text-slate-700">
                          • <span className="font-semibold text-slate-900">{m.name}</span> {m.mobile ? `(${m.mobile})` : ''}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Payment Verification Data
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Transaction UTR:</span>{' '}
                    <span className="font-mono font-bold text-slate-900">{utr}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Payment Status:</span>{' '}
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      Pending Verification
                    </span>
                  </div>
                </div>

                {screenshotPreview && (
                  <div className="pt-2 flex items-center gap-3">
                    <img
                      src={screenshotPreview}
                      alt="Proof"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-300"
                    />
                    <span className="text-xs text-slate-600">
                      Screenshot attached ({((screenshotFile?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy & Anti-Tampering Notice */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed">
                <p className="font-bold">Security Notice:</p>
                <p>
                  Payment proofs are kept strictly confidential and accessible exclusively by SITRC festival administrators for audit verification. Your registration ID will be generated atomically upon submission.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Payment</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitRegistration}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-orange-600 hover:bg-orange-700 active:scale-95 text-white shadow-lg shadow-orange-600/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Registration...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Submit Registration</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
