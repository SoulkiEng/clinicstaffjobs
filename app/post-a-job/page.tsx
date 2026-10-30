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
  Lock,
  UserPlus,
  Edit3,
  Copy
} from 'lucide-react';

const SAVED_ROLE_TEMPLATES = [
  {
    label: 'Dental Hygienist (RDH)',
    title: 'Registered Dental Hygienist (RDH) - 60 Min Adult Recare',
    clinicType: 'Dental',
    minHourly: '46',
    maxHourly: '56',
    workType: 'Full-time',
    appointmentTime: '60-Minute Adult Patient Slots',
    software: 'Dentrix Ascend, Dexis Digital X-Ray, iTero 3D',
  },
  {
    label: 'Dental Assistant (RDA)',
    title: 'Lead Dental Assistant (RDA / EFDA) - Restorative & Digital Scanning',
    clinicType: 'Dental',
    minHourly: '26',
    maxHourly: '34',
    workType: 'Full-time',
    appointmentTime: 'Mon–Thu Schedule (No Weekends)',
    software: 'Open Dental, Dexis, iTero',
  },
  {
    label: 'Medical Assistant (CMA)',
    title: 'Certified Medical Assistant (CMA) - Outpatient Clinic',
    clinicType: 'Family Medicine',
    minHourly: '24',
    maxHourly: '31',
    workType: 'Full-time',
    appointmentTime: '18 Patients/Day (Weekday Only)',
    software: 'AthenaHealth EHR, eClinicalWorks',
  },
  {
    label: 'Optician / Eye Tech',
    title: 'Licensed Optician & Optometric Technician (COA)',
    clinicType: 'Vision',
    minHourly: '25',
    maxHourly: '33',
    workType: 'Full-time',
    appointmentTime: '30-Minute Comprehensive Eye Exams',
    software: 'RevolutionEHR, Optos Daytona, Zeiss OCT',
  },
  {
    label: 'Physical Therapy (PTA)',
    title: 'Physical Therapist Assistant (PTA) - 1-on-1 Outpatient Ortho',
    clinicType: 'Physical Therapy',
    minHourly: '34',
    maxHourly: '43',
    workType: 'Full-time',
    appointmentTime: '45-Minute 1-on-1 Rehab Sessions',
    software: 'WebPT, Prompt EMR',
  },
  {
    label: 'Front Desk / Coordinator',
    title: 'Front Office Treatment & Insurance Coordinator',
    clinicType: 'Dental',
    minHourly: '24',
    maxHourly: '30',
    workType: 'Full-time',
    appointmentTime: 'Mon–Fri 8am–5pm (No Weekends)',
    software: 'Dentrix, Eaglesoft, Insurance Billing',
  },
];

export default function PostAJobPage() {
  const { user, isLoading, updateProfile } = useAuth();

  // Toggle to edit already-saved clinic info only if the employer wants to change it
  const [editingClinicInfo, setEditingClinicInfo] = useState(false);

  const [clinicName, setClinicName] = useState('');
  const [npiNumber, setNpiNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('Registered Dental Hygienist (RDH) - 60 Min Adult Recare');
  const [clinicType, setClinicType] = useState('Dental');
  const [workType, setWorkType] = useState('Full-time');
  const [genderPref, setGenderPref] = useState<'Any' | 'Female' | 'Male'>('Any');
  const [experienceLevel, setExperienceLevel] = useState<'Entry Level' | '1–3 Years' | '3+ Years'>('1–3 Years');
  const [city, setCity] = useState('Dallas');
  const [stateCode, setStateCode] = useState('TX');
  const [zipCode, setZipCode] = useState('75225');
  const [minHourly, setMinHourly] = useState('46');
  const [maxHourly, setMaxHourly] = useState('56');
  const [appointmentTime, setAppointmentTime] = useState('60-Minute Adult Patient Slots');
  const [software, setSoftware] = useState('Dentrix Ascend, Dexis Digital X-Ray, iTero 3D');
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
  const [applyEmail, setApplyEmail] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pastJobs, setPastJobs] = useState<any[]>([]);

  // Load saved clinic details & past job templates from logged-in employer profile
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
    try {
      const stored = JSON.parse(localStorage.getItem('my_posted_jobs') || '[]');
      if (Array.isArray(stored) && stored.length > 0) {
        setPastJobs(stored.slice(0, 3));
      }
    } catch {
      // ignore
    }
  }, [user]);

  const location = `${city.trim() || 'Dallas'}, ${stateCode}`;

  // Check if the logged-in user is missing any core clinic profile fields
  const hasSavedClinicProfile = Boolean(user?.practiceName && user?.city && user?.stateCode && user?.email);

  const applySavedTemplate = async (tpl: (typeof SAVED_ROLE_TEMPLATES)[0]) => {
    setJobTitle(tpl.title);
    setClinicType(tpl.clinicType);
    setMinHourly(tpl.minHourly);
    setMaxHourly(tpl.maxHourly);
    setWorkType(tpl.workType);
    setAppointmentTime(tpl.appointmentTime);
    setSoftware(tpl.software);

    const draft = await generateJobPostWithGemini({
      jobTitle: tpl.title,
      clinicName: clinicName || user?.practiceName || 'Our Private Clinic',
      clinicType: tpl.clinicType,
      city: city || 'Dallas',
      stateCode,
      minHourly: tpl.minHourly,
      maxHourly: tpl.maxHourly,
      workType: tpl.workType,
    });
    setDescription(draft.description);
    setResponsibilities(draft.responsibilities);
    setQualifications(draft.qualifications);
  };

  const handleGeminiWriteJob = async () => {
    setIsPolishing(true);
    try {
      const res = await generateJobPostWithGemini({
        jobTitle: jobTitle || 'Registered Dental Hygienist (RDH)',
        clinicName: clinicName || user?.practiceName || 'Our Private Clinic',
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
    if (!user) return;

    const finalClinicName = clinicName.trim() || user.practiceName || `${user.name} Clinic`;
    const finalEmail = applyEmail.trim() || user.email;
    const cleanCity = city.trim() || user.city || 'Dallas';

    if (!jobTitle.trim()) {
      alert('Please enter the Job Title.');
      return;
    }

    setIsSubmitting(true);
    const newId = `job-live-${Date.now()}`;

    // Save any newly entered or updated clinic fields directly to the user's profile so they never repeat it!
    await updateProfile({
      practiceName: finalClinicName,
      practiceType: clinicType,
      npiNumber: npiNumber.trim() || user.npiNumber || '1487920194',
      city: cleanCity,
      stateCode,
      zipCode: zipCode.trim() || user.zipCode || '75225',
      location: `${cleanCity}, ${stateCode}`,
    });

    const newJobRecord = {
      id: newId,
      title: jobTitle.trim(),
      clinic_name: finalClinicName,
      clinic_type: clinicType,
      location: `${cleanCity}, ${stateCode}`,
      city: cleanCity,
      state: stateCode,
      zip_code: zipCode.trim() || '75225',
      work_type: workType,
      gender_pref: genderPref,
      experience_level: experienceLevel,
      status: 'Active',
      min_hourly: Number(minHourly) || 35,
      max_hourly: Number(maxHourly) || 50,
      pay_period: 'hour',
      pay_comparison: `+16% Above ${cleanCity} Avg`,
      is_featured: false,
      is_urgent: isUrgent,
      verified_active: true,
      npi_number: npiNumber.trim() || user.npiNumber || '1487920194',
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
      apply_email: finalEmail,
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
    'w-full h-11 px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium';
  const labelClass = 'block text-xs font-bold text-slate-700 mb-1.5 truncate';

  // 1. Account Gate: If visitor is NOT logged in, require Employer Account creation / sign-in first!
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 text-center space-y-6 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
            <UserPlus className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              <BadgeCheck className="w-4 h-4 text-teal-600" />
              <span>Employer Account Required</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Create Your Free Employer Account to Post a Job
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              To keep our platform 100% verified and save your clinic details so you never have to re-type them, please create a free Employer account or sign in first.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 text-slate-700">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Save your Clinic Name, NPI, and Location once</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Use 1-Click Job Templates & Gemini AI so you never write from scratch</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Manage Active & Inactive jobs and view candidate CVs in your portal</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/signup?role=employer&redirect=/post-a-job"
              className="flex-1 py-3.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-xs transition-all"
            >
              Create Free Employer Account →
            </Link>
            <Link
              href="/login?role=employer&redirect=/post-a-job"
              className="py-3.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Success Screen After Publishing
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>Job Published • Active in Your Portal</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Your Job Opening is Now Live!
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your opening for <strong className="text-slate-900">{jobTitle}</strong> at{' '}
            <strong className="text-slate-900">{clinicName || user?.practiceName}</strong> ({location}) is now active on the job board and saved inside your Employer Portal.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2 text-slate-700">
            <div className="flex justify-between font-medium">
              <span>Status in Employer Portal:</span>
              <strong className="text-emerald-700">● Active (Can Pause or Edit Anytime)</strong>
            </div>
            <div className="flex justify-between font-medium">
              <span>Clinic Profile:</span>
              <strong className="text-teal-700">✓ Saved for Future Jobs</strong>
            </div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/employer"
              className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors shadow-xs"
            >
              Go to My Employer Portal →
            </Link>
            <Link
              href="/"
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
            >
              View on Job Board
            </Link>
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
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
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>Logged-In Employer Portal • 100% Free Job Posting</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Post a Job Opening for Your Clinic
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Your saved clinic profile is attached automatically. Pick a 1-click template or let Gemini AI write your job post in seconds.
          </p>
        </div>

        {/* Two-Column Perfectly Aligned Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 cols) */}
          <form
            onSubmit={handlePublishFree}
            className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                <span>Job Details & 1-Click Templates</span>
              </h2>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                $0 • Free Forever
              </span>
            </div>

            {/* 1. SAVED CLINIC PROFILE CARD (Only shows inputs if missing or if employer clicks "Edit") */}
            {hasSavedClinicProfile && !editingClinicInfo ? (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900">
                      {clinicName || user?.practiceName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ✓ Saved Clinic Profile Attached
                    </span>
                  </div>
                  <p className="text-slate-600">
                    {clinicType} Clinic • {city}, {stateCode} ({zipCode}) • CVs sent to: <strong>{applyEmail || user?.email}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingClinicInfo(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-teal-800 border border-teal-200 text-xs font-bold shrink-0 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Edit Clinic Info</span>
                </button>
              </div>
            ) : (
              /* Shown ONLY if clinic info is missing from profile OR employer clicked "Edit Clinic Info" */
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    Clinic Profile Details (Saved automatically so you never re-type them)
                  </span>
                  {hasSavedClinicProfile && (
                    <button
                      type="button"
                      onClick={() => setEditingClinicInfo(false)}
                      className="text-xs font-bold text-teal-700 underline cursor-pointer"
                    >
                      Done Editing
                    </button>
                  )}
                </div>

                {/* 2-Column Aligned Grid for Clinic Profile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <label htmlFor="post-clinic-name" className={labelClass}>
                      Clinic / Practice Name *
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
                    <label htmlFor="post-specialty" className={labelClass}>
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
                    <label htmlFor="post-npi" className={labelClass}>
                      10-Digit Clinic NPI (Optional)
                    </label>
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
                  </div>

                  <div>
                    <label htmlFor="post-email" className={labelClass}>
                      Hiring Email for Applicant CVs *
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

                  <div>
                    <label htmlFor="post-city" className={labelClass}>
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

                  <div className="grid grid-cols-2 gap-3 items-end">
                    <div>
                      <label htmlFor="post-state" className={labelClass}>
                        State *
                      </label>
                      <select
                        id="post-state"
                        value={stateCode}
                        onChange={(e) => setStateCode(e.target.value)}
                        className={inputClass}
                      >
                        {US_STATES_52.map((st) => (
                          <option key={st.code} value={st.code}>
                            {st.code} - {st.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="post-zip" className={labelClass}>
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
                </div>
              </div>
            )}

            {/* 2. 1-CLICK SAVED JOB TEMPLATES (No Need to Re-Build Templates!) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Copy className="w-3.5 h-3.5 text-teal-600" />
                  <span>1-Click Saved Job Templates (Click to Auto-Fill Role):</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SAVED_ROLE_TEMPLATES.map((tpl) => {
                  const isCurrent = jobTitle === tpl.title;
                  return (
                    <button
                      key={tpl.label}
                      type="button"
                      onClick={() => applySavedTemplate(tpl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      {tpl.label}
                    </button>
                  );
                })}
                {pastJobs.map((pj) => (
                  <button
                    key={pj.id}
                    type="button"
                    onClick={() => {
                      setJobTitle(pj.title);
                      setMinHourly(String(pj.min_hourly || 40));
                      setMaxHourly(String(pj.max_hourly || 52));
                      setWorkType(pj.work_type || 'Full-time');
                      if (pj.description) setDescription(pj.description);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-teal-200 bg-teal-50/60 hover:bg-teal-100 text-teal-900 transition-all cursor-pointer"
                  >
                    Reuse: {pj.title.slice(0, 28)}...
                  </button>
                ))}
              </div>
            </div>

            {/* 3. PERFECTLY ALIGNED ROLE DETAILS (Full-width Title + 2-Column Aligned Rows) */}
            <div className="space-y-5 pt-2 border-t border-slate-100">
              {/* Full-Width Job Title so long titles never get cut off */}
              <div>
                <label htmlFor="post-title" className={labelClass}>
                  Job Position Title *
                </label>
                <input
                  id="post-title"
                  type="text"
                  required
                  placeholder="e.g. Registered Dental Hygienist (RDH) - 60 Min Adult Recare"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Row A: Work Schedule & Experience Level (2 Equal Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="post-schedule" className={labelClass}>
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

                <div>
                  <label htmlFor="post-exp" className={labelClass}>
                    Experience Level Required *
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

              {/* Row B: Staff Gender Preference & Patient Schedule (2 Equal Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="post-gender" className={labelClass}>
                    Staff Gender Preference
                  </label>
                  <select
                    id="post-gender"
                    value={genderPref}
                    onChange={(e) => setGenderPref(e.target.value as 'Any' | 'Female' | 'Male')}
                    className={inputClass}
                  >
                    <option value="Any">Any Gender (Male & Female)</option>
                    <option value="Female">Female Staff Preferred</option>
                    <option value="Male">Male Staff Preferred</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="post-pace" className={labelClass}>
                    Daily Patient Schedule / Shifts
                  </label>
                  <input
                    id="post-pace"
                    type="text"
                    placeholder="e.g. 60-Minute Adult Patient Slots"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Row C: Min Hourly Pay & Max Hourly Pay (2 Equal Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="post-min-pay" className={labelClass}>
                    Minimum Hourly Pay ($/hr) *
                  </label>
                  <input
                    id="post-min-pay"
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="46"
                    value={minHourly}
                    onChange={(e) => setMinHourly(e.target.value.replace(/[^0-9]/g, ''))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="post-max-pay" className={labelClass}>
                    Maximum Hourly Pay ($/hr) *
                  </label>
                  <input
                    id="post-max-pay"
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="56"
                    value={maxHourly}
                    onChange={(e) => setMaxHourly(e.target.value.replace(/[^0-9]/g, ''))}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Row D: Clinic Software & Urgent Badge (2 Equal Aligned Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="post-software" className={labelClass}>
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

                <div>
                  <span className={labelClass}>Hiring Priority Badge</span>
                  <label
                    className={`h-11 px-3.5 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                      isUrgent ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 accent-teal-600"
                    />
                    <span className="text-xs font-bold text-slate-800 truncate">
                      Add &ldquo;Urgently Hiring&rdquo; Badge (Free)
                    </span>
                  </label>
                </div>
              </div>

              {/* Job Description + Gemini AI Full Job Writer Button */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <label htmlFor="post-desc" className="block text-xs font-bold text-slate-800">
                      Job Description *
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Click the Gemini AI button to write or refresh the full description automatically.
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
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                />
              </div>
            </div>

            {/* Publish Action */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Saved directly to your Employer Portal (Active Jobs tab)
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
                  <span>{clinicName || user?.practiceName || 'Your Clinic Name'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3 h-3" /> {location}
                  </span>
                </p>
              </div>

              <div className="pt-3 flex items-baseline justify-between border-t border-slate-100">
                <div className="text-xl font-black text-slate-900">
                  ${minHourly || '46'} – ${maxHourly || '56'}
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
                <span>Smart Employer Account Workflow:</span>
              </div>
              <ul className="space-y-2 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Saved Clinic Info:</strong> Your clinic profile is attached automatically so you only enter the role details.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>1-Click Templates:</strong> Pick any role template above or reuse a past job in 1 click.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Active & Inactive Control:</strong> Pause or re-open this job anytime inside your Employer Portal.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
