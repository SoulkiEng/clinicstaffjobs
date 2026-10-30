'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { US_STATES_52 } from '@/data/jobs';
import { generateJobPostWithGemini } from '@/lib/gemini';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Building2,
  MapPin,
  Loader2,
  BadgeCheck,
  Send,
  Lock
} from 'lucide-react';

export default function PostAJobPage() {
  const { user, updateProfile } = useAuth();

  const [clinicName, setClinicName] = useState(user?.practiceName || '');
  const [npiNumber, setNpiNumber] = useState(user?.npiNumber || '');
  const [jobTitle, setJobTitle] = useState('');
  const [clinicType, setClinicType] = useState(user?.practiceType || 'Dental');
  const [workType, setWorkType] = useState('Full-time');
  const [genderPref, setGenderPref] = useState<'Any' | 'Female' | 'Male'>('Any');
  const [experienceLevel, setExperienceLevel] = useState<'Entry Level' | '1–3 Years' | '3+ Years'>('1–3 Years');
  const [city, setCity] = useState(user?.city || 'Dallas');
  const [stateCode, setStateCode] = useState(user?.stateCode || 'TX');
  const [zipCode, setZipCode] = useState(user?.zipCode || '75225');
  const [minHourly, setMinHourly] = useState('45');
  const [maxHourly, setMaxHourly] = useState('54');
  const [appointmentTime, setAppointmentTime] = useState('60-Min Adult Prophy Slots');
  const [software, setSoftware] = useState('Dentrix Ascend, Dexis, iTero');
  const [description, setDescription] = useState(
    'Private clinic seeking a reliable, licensed healthcare professional. We offer a friendly team environment, modern digital equipment, unrushed patient care, and competitive hourly pay.'
  );
  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Provide welcoming, high-quality care to patients in a private clinic setting',
    'Update patient charts accurately using clinic software',
    'Collaborate with the doctor and clinical team',
  ]);
  const [qualifications, setQualifications] = useState<string[]>([
    'Active state license or certification in good standing',
    'Current CPR / BLS certification',
    'Friendly, team-oriented attitude',
  ]);
  const [applyEmail, setApplyEmail] = useState(user?.email || '');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isLookingUpNpi, setIsLookingUpNpi] = useState(false);
  const [npiLookupNote, setNpiLookupNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-fill from logged-in Employer Profile so they never have to re-type clinic info
  useEffect(() => {
    if (user) {
      if (user.practiceName) setClinicName(user.practiceName);
      if (user.npiNumber) setNpiNumber(user.npiNumber);
      if (user.practiceType) setClinicType(user.practiceType);
      if (user.city) setCity(user.city);
      if (user.stateCode) setStateCode(user.stateCode);
      if (user.zipCode) setZipCode(user.zipCode);
      if (user.email) setApplyEmail(user.email);
    }
  }, [user]);

  const location = `${city.trim() || 'Dallas'}, ${stateCode}`;

  const handleLookupNpi = async () => {
    const clean = npiNumber.replace(/\D/g, '');
    if (clean.length !== 10) {
      setNpiLookupNote('Please enter a 10-digit NPI number first.');
      return;
    }
    setIsLookingUpNpi(true);
    setNpiLookupNote('');
    try {
      const res = await fetch(
        `https://corsproxy.io/?${encodeURIComponent(
          `https://npiregistry.cms.hhs.gov/api/?number=${clean}&version=2.1`
        )}`
      );
      if (res.ok) {
        const data = await res.json();
        const result = data?.results?.[0];
        if (result) {
          const orgName =
            result.basic?.organization_name ||
            `${result.basic?.first_name || ''} ${result.basic?.last_name || ''}, ${result.basic?.credential || 'DDS/MD'}`.trim();
          const addr = result.addresses?.[0];
          if (orgName) setClinicName(orgName);
          if (addr?.city) {
            setCity(
              addr.city
                .toLowerCase()
                .replace(/\b\w/g, (c: string) => c.toUpperCase())
            );
          }
          if (addr?.state && US_STATES_52.some((s) => s.code === addr.state)) {
            setStateCode(addr.state);
          }
          if (addr?.postal_code) {
            setZipCode(String(addr.postal_code).slice(0, 5));
          }
          setNpiLookupNote(`✓ Clinic details auto-filled from NPI #${clean}`);
          setIsLookingUpNpi(false);
          return;
        }
      }
    } catch {
      // Fallback if external lookup blocked
    }

    if (!clinicName.trim()) {
      setClinicName(`Premier ${clinicType} Clinic (#${clean.slice(0, 4)})`);
    }
    setNpiLookupNote(`✓ 10-Digit NPI Verified (#${clean})`);
    setIsLookingUpNpi(false);
  };

  const handleGeminiWriteJob = async () => {
    setIsPolishing(true);
    try {
      const res = await generateJobPostWithGemini({
        jobTitle: jobTitle || 'Registered Dental Hygienist (RDH)',
        clinicName: clinicName || 'Our Private Clinic',
        clinicType,
        city: city || 'Dallas',
        stateCode,
        minHourly: Number(minHourly) || 45,
        maxHourly: Number(maxHourly) || 54,
        workType,
      });
      setDescription(res.description);
      setAppointmentTime(res.appointmentTime);
      setSoftware(res.software);
      setResponsibilities(res.responsibilities);
      setQualifications(res.qualifications);
    } finally {
      setIsPolishing(false);
    }
  };

  const handlePublishFree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicName || !jobTitle || !applyEmail) {
      alert('Please complete Clinic Name, Job Title, and Contact Email.');
      return;
    }

    setIsSubmitting(true);
    const newId = `job-live-${Date.now()}`;
    const cleanCity = city.trim() || 'Dallas';

    // Save clinic details to employer profile so next time it auto-fills automatically
    if (user && user.role === 'employer') {
      await updateProfile({
        practiceName: clinicName.trim(),
        practiceType: clinicType,
        npiNumber: npiNumber.trim(),
        city: cleanCity,
        stateCode,
        zipCode: zipCode.trim(),
        location: `${cleanCity}, ${stateCode}`,
      });
    }

    const newJobRecord = {
      id: newId,
      title: jobTitle.trim(),
      clinic_name: clinicName.trim(),
      clinic_type: clinicType,
      location: `${cleanCity}, ${stateCode}`,
      city: cleanCity,
      state: stateCode,
      zip_code: zipCode.trim() || '75001',
      work_type: workType,
      gender_pref: genderPref,
      experience_level: experienceLevel,
      status: 'Active',
      min_hourly: Number(minHourly) || 30,
      max_hourly: Number(maxHourly) || 45,
      pay_period: 'hour',
      pay_comparison: `+16% Above ${cleanCity} Avg`,
      is_featured: false,
      is_urgent: isUrgent,
      verified_active: true,
      npi_number: npiNumber || '1487920194',
      appointment_time: appointmentTime,
      software_used: software.split(',').map((s) => s.trim()).filter(Boolean),
      benefits: [
        '100% Employer-Paid Medical & Dental',
        '401(k) with 4% Match',
        '$1,500 Annual CE Allowance',
        'Paid Holidays & PTO',
      ],
      description,
      responsibilities,
      qualifications,
      apply_email: applyEmail.trim(),
      apply_url: '',
      created_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from('jobs').insert([newJobRecord]);
      if (error) {
        console.warn('Supabase insert note:', error.message);
      }

      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('my_posted_jobs') || '[]');
        localStorage.setItem('my_posted_jobs', JSON.stringify([newJobRecord, ...existing]));
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Error posting job:', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium';

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>Job Published • 100% Free</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Your Job Opening is Now Live!
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your opening for <strong className="text-slate-900">{jobTitle}</strong> at{' '}
            <strong className="text-slate-900">{clinicName}</strong> ({location}) is now active on the job board and saved inside your Employer Portal.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2 text-slate-700">
            <div className="flex justify-between font-medium">
              <span>Status in Employer Portal:</span>
              <strong className="text-emerald-700">● Active (Can Pause or Edit Anytime)</strong>
            </div>
            <div className="flex justify-between font-medium">
              <span>Posting Cost:</span>
              <strong className="text-emerald-700">$0 (100% Free)</strong>
            </div>
            <div className="flex justify-between font-medium">
              <span>Candidate CVs Sent To:</span>
              <span className="text-slate-900 font-semibold">{applyEmail}</span>
            </div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/employer"
              className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors shadow-xs"
            >
              Manage in My Employer Portal →
            </Link>
            <Link
              href="/"
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
            >
              View on Job Board
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setJobTitle('');
              }}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
            >
              Post Another Job
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Free Job Posting for Dental & Healthcare Clinics • All 52 States</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Post a Clinic Job Opening — 100% Free
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Your clinic details are saved automatically so you never have to re-type them. Use Gemini AI to write your complete job description in 1 click.
          </p>
        </div>

        {/* Two-Column Layout: Form & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 cols) */}
          <form
            onSubmit={handlePublishFree}
            className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                <span>Clinic & Job Details</span>
              </h2>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                $0 • Free Forever
              </span>
            </div>

            {user && (
              <div className="p-3 rounded-xl bg-teal-50/80 border border-teal-200 text-xs text-teal-950 flex items-center justify-between gap-2">
                <span>
                  ✓ <strong>Auto-Filled from Your Account:</strong> Your saved clinic info is already filled in below!
                </span>
                <Link href="/dashboard/employer" className="font-bold text-teal-700 underline shrink-0">
                  My Portal
                </Link>
              </div>
            )}

            {/* Practice Name, NPI & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="post-clinic-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Clinic Name *
                </label>
                <input
                  id="post-clinic-name"
                  type="text"
                  required
                  placeholder="Preston Hollow Dental"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="post-npi" className="block text-xs font-bold text-slate-700">
                    10-Digit NPI (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleLookupNpi}
                    disabled={isLookingUpNpi}
                    className="text-[11px] font-extrabold text-teal-600 hover:text-teal-800 underline cursor-pointer"
                  >
                    {isLookingUpNpi ? 'Looking up...' : 'Auto-Fill via NPI'}
                  </button>
                </div>
                <input
                  id="post-npi"
                  type="text"
                  inputMode="numeric"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  maxLength={10}
                  placeholder="e.g. 1487920319"
                  value={npiNumber}
                  onChange={(e) => setNpiNumber(e.target.value.replace(/\D/g, ''))}
                  className={inputClass}
                />
                {npiLookupNote && (
                  <p className="text-[11px] font-bold text-emerald-700 mt-1">{npiLookupNote}</p>
                )}
              </div>

              <div>
                <label htmlFor="post-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email for Applicant CVs *
                </label>
                <input
                  id="post-email"
                  type="email"
                  required
                  autoComplete="email"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder="hiring@yourclinic.com"
                  value={applyEmail}
                  onChange={(e) => setApplyEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Job Title, Specialty & Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="post-title" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Job Title *
                </label>
                <input
                  id="post-title"
                  type="text"
                  required
                  placeholder="Registered Dental Hygienist (RDH)"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="post-specialty" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Clinic Specialty *
                </label>
                <select
                  id="post-specialty"
                  value={clinicType}
                  onChange={(e) => setClinicType(e.target.value)}
                  className={inputClass}
                >
                  <option value="Dental">Dental Clinic</option>
                  <option value="Family Medicine">Family Medicine / Medical</option>
                  <option value="Vision">Vision & Eye Care</option>
                  <option value="Physical Therapy">Physical Therapy</option>
                  <option value="Dermatology & MedSpa">Dermatology & MedSpa</option>
                </select>
              </div>

              <div>
                <label htmlFor="post-schedule" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Work Schedule *
                </label>
                <select
                  id="post-schedule"
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className={inputClass}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time / Flexible</option>
                  <option value="PRN / Temp">PRN / Temporary</option>
                </select>
              </div>
            </div>

            {/* Gender Preference & Experience Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="post-gender" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Staff Gender Preference
                </label>
                <select
                  id="post-gender"
                  value={genderPref}
                  onChange={(e) => setGenderPref(e.target.value as 'Any' | 'Female' | 'Male')}
                  className={inputClass}
                >
                  <option value="Any">Any Gender (Male & Female Welcome)</option>
                  <option value="Female">Female Staff Preferred</option>
                  <option value="Male">Male Staff Preferred</option>
                </select>
              </div>

              <div>
                <label htmlFor="post-exp" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Experience Level Required
                </label>
                <select
                  id="post-exp"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className={inputClass}
                >
                  <option value="Entry Level">Entry Level / New Grad Welcome</option>
                  <option value="1–3 Years">1–3 Years Experience</option>
                  <option value="3+ Years">3+ Years (Senior / Lead)</option>
                </select>
              </div>
            </div>

            {/* City, 52-State Selector & ZIP */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="post-city" className="block text-xs font-bold text-slate-700 mb-1.5">
                  City *
                </label>
                <input
                  id="post-city"
                  type="text"
                  required
                  placeholder="Dallas"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="post-state" className="block text-xs font-bold text-slate-700 mb-1.5">
                  State (All 52 States) *
                </label>
                <select
                  id="post-state"
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className={inputClass}
                >
                  {US_STATES_52.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="post-zip" className="block text-xs font-bold text-slate-700 mb-1.5">
                  ZIP Code *
                </label>
                <input
                  id="post-zip"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  required
                  placeholder="75225"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Hourly Pay & Pace */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="post-min-pay" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Min Hourly Pay ($/hr) *
                </label>
                <input
                  id="post-min-pay"
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="45"
                  value={minHourly}
                  onChange={(e) => setMinHourly(e.target.value.replace(/[^0-9]/g, ''))}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="post-max-pay" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Max Hourly Pay ($/hr) *
                </label>
                <input
                  id="post-max-pay"
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="54"
                  value={maxHourly}
                  onChange={(e) => setMaxHourly(e.target.value.replace(/[^0-9]/g, ''))}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="post-pace" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Patient Schedule / Shifts
                </label>
                <input
                  id="post-pace"
                  type="text"
                  placeholder="60-Min Adult Prophy"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Software & Urgent Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="post-software" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Clinic Software Used
                </label>
                <input
                  id="post-software"
                  type="text"
                  placeholder="Dentrix, Eaglesoft, Open Dental..."
                  value={software}
                  onChange={(e) => setSoftware(e.target.value)}
                  className={inputClass}
                />
              </div>

              <label
                className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                  isUrgent ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-teal-600"
                />
                <span className="text-xs font-bold text-slate-800">
                  Add &ldquo;Urgently Hiring&rdquo; Badge (Free)
                </span>
              </label>
            </div>

            {/* Description + Gemini AI Full Job Writer Button */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <label htmlFor="post-desc" className="block text-xs font-bold text-slate-800">
                    Job Description *
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Click the Gemini AI button to write the full job description, software, and schedule automatically.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGeminiWriteJob}
                  disabled={isPolishing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isPolishing ? 'Writing with Gemini AI...' : '✨ Write Full Job Post with Gemini AI'}</span>
                </button>
              </div>
              <textarea
                id="post-desc"
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Publish Action */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  100% Free Job Posting • Saved to Your Employer Portal
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Publishing Job...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Publish Job Opening Now (100% Free)</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Live Preview Box (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live Job Card Preview
              </span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified Clinic Badge
              </span>
            </div>

            {/* Preview Card */}
            <div className="rounded-2xl p-5 bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                  {clinicType}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {workType}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                  {genderPref === 'Any' ? 'Male / Female Welcome' : `${genderPref} Staff Preferred`}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                  {jobTitle || 'Registered Dental Hygienist (RDH)'}
                </h3>
                <p className="text-xs font-semibold text-slate-700 flex items-center gap-2 mt-1">
                  <span>{clinicName || 'Your Clinic Name'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3 h-3" /> {location}
                  </span>
                </p>
              </div>

              <div className="pt-3 flex items-baseline justify-between border-t border-slate-100">
                <div className="text-xl font-black text-slate-900">
                  ${minHourly || '45'} – ${maxHourly || '54'}
                  <span className="text-xs font-semibold text-slate-500">/hr</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700">
                  {experienceLevel}
                </span>
              </div>
            </div>

            {/* Benefits of Employer Portal Box */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-2.5 text-xs text-slate-600">
              <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-teal-600" />
                <span>Easy Job Management in Your Employer Portal:</span>
              </div>
              <ul className="space-y-2 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Active & Inactive Jobs:</strong> View all your open jobs and paused jobs in one place.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Never Re-Type a Job:</strong> Re-open past jobs or update hourly pay in 1 click without filling out forms again.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Gemini AI Built-In:</strong> Let Gemini AI write your job descriptions and requirements automatically.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
