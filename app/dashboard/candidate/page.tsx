'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ALL_JOBS, US_STATES_52, Job } from '@/data/jobs';
import { generateCandidateBioWithGemini } from '@/lib/gemini';
import {
  User,
  MapPin,
  CheckCircle2,
  Upload,
  LogOut,
  ShieldCheck,
  Trash2,
  FileText,
  Bell,
  Sparkles,
  Bookmark,
  Briefcase,
  Search,
  Building2
} from 'lucide-react';

export default function CandidateDashboardPage() {
  const { user, isLoading, logout, updateProfile, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'profile' | 'matched' | 'applications' | 'saved' | 'notifications'
  >('profile');

  // Candidate Profile State (Zero fake license numbers or fake phones for new accounts!)
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('Registered Dental Hygienist (RDH)');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Any'>('Female');
  const [city, setCity] = useState('Dallas');
  const [stateCode, setStateCode] = useState('TX');
  const [license, setLicense] = useState('');
  const [yearsExperience, setYearsExperience] = useState('1–3 Years');
  const [desiredPay, setDesiredPay] = useState(45);
  const [workDays, setWorkDays] = useState('Mon–Fri (Flexible)');
  const [availabilityStatus, setAvailabilityStatus] = useState<'open' | 'private'>('open');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState(
    'Dedicated healthcare professional skilled in gentle patient care, digital charting, and teamwork.'
  );
  const [skillsText, setSkillsText] = useState(
    'Patient Care, Digital Charting, Sterilization, HIPAA'
  );
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeUpdatedAt, setResumeUpdatedAt] = useState('Ready for 1-Click Apply');

  // Notification Settings State
  const [notifyEmailJobs, setNotifyEmailJobs] = useState(true);
  const [notifyApplicationUpdates, setNotifyApplicationUpdates] = useState(true);
  const [notifyEmployerMessages, setNotifyEmployerMessages] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Clean start: Only show the user's actual saved jobs and actual submitted applications!
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setSpecialty(user.specialty || 'Registered Dental Hygienist (RDH)');
      setGender(user.gender || 'Any');
      setCity(user.city || 'Dallas');
      setStateCode(user.stateCode || 'TX');
      setLicense(user.licenseNumber || '');
      setYearsExperience(user.yearsExperience || '1–3 Years');
      setDesiredPay(user.desiredHourly || 45);
      setWorkDays(user.workDays || 'Mon–Fri (Flexible)');
      setAvailabilityStatus(user.availabilityStatus || 'open');
      setPhone(user.phone || '');
      if (user.bio) setBio(user.bio);
      if (user.skills) {
        setSkillsText(Array.isArray(user.skills) ? user.skills.join(', ') : user.skills);
      }
      setResumeFileName(
        user.resumeFileName || `${(user.name || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`
      );
      if (user.resumeUpdatedAt) setResumeUpdatedAt(user.resumeUpdatedAt);
      if (user.notifyEmailJobs !== undefined) setNotifyEmailJobs(user.notifyEmailJobs);
      if (user.notifyApplicationUpdates !== undefined)
        setNotifyApplicationUpdates(user.notifyApplicationUpdates);
      if (user.notifyEmployerMessages !== undefined)
        setNotifyEmployerMessages(user.notifyEmployerMessages);
    }

    // Load saved jobs (including newly posted custom jobs + ALL_JOBS)
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem('saved_clinic_jobs') || '[]');
      const customRaw = JSON.parse(localStorage.getItem('my_posted_jobs') || '[]');
      const customJobs: Job[] = Array.isArray(customRaw)
        ? customRaw.map((r: any) => ({
            id: r.id,
            title: r.title,
            clinicName: r.clinic_name || 'Verified Clinic',
            clinicType: r.clinic_type || 'Dental',
            location: r.location || `${r.city || 'Dallas'}, ${r.state || 'TX'}`,
            city: r.city || 'Dallas',
            state: r.state || 'TX',
            zipCode: r.zip_code || '75225',
            workType: r.work_type || 'Full-time',
            minHourly: Number(r.min_hourly) || 40,
            maxHourly: Number(r.max_hourly) || 52,
            payPeriod: 'hour',
            payComparison: '+15% Above Avg',
            isFeatured: false,
            isUrgent: false,
            verifiedActive: true,
            softwareUsed: [],
            benefits: [],
            description: r.description || '',
            responsibilities: [],
            qualifications: [],
            applyEmail: r.apply_email || '',
            applyUrl: '',
            postedDate: r.created_at || new Date().toISOString(),
          }))
        : [];

      if (savedIds.length > 0) {
        const allPool = [...customJobs, ...ALL_JOBS];
        const matched = allPool.filter((j) => savedIds.includes(j.id));
        setSavedJobs(matched);
      } else {
        setSavedJobs([]);
      }
    } catch {
      setSavedJobs([]);
    }

    // Load actual submitted applications from localStorage
    try {
      const oneClickApps = JSON.parse(localStorage.getItem('my_applied_jobs') || '[]');
      if (Array.isArray(oneClickApps) && oneClickApps.length > 0) {
        const mapped = oneClickApps.map((a: any) => ({
          id: a.id || `app-${Math.random()}`,
          job_id: a.job_id || 'job-1001',
          title: a.job_title || 'Clinic Opening',
          clinicName: a.clinic_name || 'Verified Clinic',
          location: a.location || 'United States',
          appliedDate: 'Recent',
          pay: a.pay || a.desired_pay || '$45/hr',
          status: a.status || 'Application Sent',
        }));
        setApplications(mapped);
      } else {
        setApplications([]);
      }
    } catch {
      setApplications([]);
    }
  }, [user]);

  // Competitor Feature (Vivian / Indeed): Automatically match jobs to the candidate's saved Role & State!
  const matchedJobsForUser = useMemo(() => {
    const roleKeywords = specialty
      .toLowerCase()
      .replace(/[()]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const stateMatches = ALL_JOBS.filter((j) => j.state === stateCode);
    const pool = stateMatches.length > 0 ? stateMatches : ALL_JOBS;

    const scored = pool.map((j) => {
      let score = 80;
      if (j.state === stateCode) score += 10;
      if (roleKeywords.some((kw) => j.title.toLowerCase().includes(kw))) score += 8;
      if (j.maxHourly >= desiredPay) score += 2;
      return { job: j, score: Math.min(99, score) };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 8);
  }, [specialty, stateCode, desiredPay]);

  const removeSavedJob = (id: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== id));
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem('saved_clinic_jobs') || '[]');
      localStorage.setItem('saved_clinic_jobs', JSON.stringify(savedIds.filter((x) => x !== id)));
      window.dispatchEvent(new Event('savedJobsUpdated'));
    } catch {
      // ignore
    }
  };

  const handleWithdrawApplication = (id: string) => {
    const next = applications.filter((a) => a.id !== id);
    setApplications(next);
    try {
      const stored = JSON.parse(localStorage.getItem('my_applied_jobs') || '[]');
      if (Array.isArray(stored)) {
        localStorage.setItem(
          'my_applied_jobs',
          JSON.stringify(stored.filter((a: any) => a.id !== id))
        );
        window.dispatchEvent(new Event('appliedJobsUpdated'));
      }
    } catch {
      // ignore
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const timestamp = `Updated ${new Date().toLocaleDateString()}`;
    setResumeFileName(file.name);
    setResumeUpdatedAt(timestamp);
    await updateProfile({
      resumeFileName: file.name,
      resumeUpdatedAt: timestamp,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleGeminiBioWrite = async () => {
    setAiGenerating(true);
    try {
      const res = await generateCandidateBioWithGemini({
        name,
        role: specialty,
        experienceYears: yearsExperience,
        city: `${city}, ${stateCode}`,
        desiredPay,
      });
      setBio(res.bio);
      setSkillsText(res.skills);
    } finally {
      setAiGenerating(false);
    }
  };

  const saveAllProfileData = async () => {
    const parsedSkills = skillsText
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);

    await updateProfile({
      name,
      specialty,
      gender,
      city,
      stateCode,
      location: `${city}, ${stateCode}`,
      licenseNumber: license.trim(),
      yearsExperience,
      desiredHourly: Number(desiredPay),
      workDays,
      availabilityStatus,
      phone: phone.trim(),
      bio,
      skills: parsedSkills,
      resumeFileName,
      resumeUpdatedAt,
      notifyEmailJobs,
      notifyApplicationUpdates,
      notifyEmployerMessages,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveAllProfileData();
  };

  // Auth Guard: Require Login
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
            <User className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Sign In to Your Job Seeker Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Save your CV and profile once to get matched with clinics in your state, apply in 1 click, and track your applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/signup?role=candidate&redirect=/dashboard/candidate"
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm transition-colors"
            >
              Create Free Job Seeker Account →
            </Link>
            <Link
              href="/login?role=candidate&redirect=/dashboard/candidate"
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Role Guard: If logged in as an Employer, offer 1-click redirect or role switch
  if (!isLoading && user && user.role === 'employer') {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            You Are Signed In with an Employer Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Would you like to open your Employer Portal for <strong>{user.practiceName || user.name}</strong>, or switch your account to a Job Seeker Account?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/dashboard/employer"
              className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm transition-colors"
            >
              Open My Employer Portal →
            </Link>
            <button
              type="button"
              onClick={() => switchRole('candidate')}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Switch My Account to Job Seeker
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile Completion Meter (Vivian Health / DentalPost Style)
  let profileCompletion = 45;
  if (name.trim()) profileCompletion += 10;
  if (phone.trim()) profileCompletion += 15;
  if (license.trim()) profileCompletion += 15;
  if (resumeFileName.trim()) profileCompletion += 15;
  profileCompletion = Math.min(100, profileCompletion);

  const inputClass =
    'w-full h-11 px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Candidate Top Profile Header */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-extrabold text-xl shadow-xs">
                <User className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {name || 'My Job Seeker Profile'}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Job Seeker Account
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2.5">
                  <span className="font-bold text-teal-700">{specialty}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {city}, {stateCode}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">CV: {resumeFileName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* 1-Click Availability Status Toggle (Vivian / DentalPost Feature) */}
              <button
                type="button"
                onClick={async () => {
                  const next = availabilityStatus === 'open' ? 'private' : 'open';
                  setAvailabilityStatus(next);
                  await updateProfile({ availabilityStatus: next });
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${
                  availabilityStatus === 'open'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-slate-100 border-slate-300 text-slate-700'
                }`}
              >
                <span>
                  {availabilityStatus === 'open'
                    ? '🟢 Open to Clinic Offers'
                    : '🔒 Profile Private'}
                </span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Find Jobs</span>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Profile Completion Meter */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs flex-wrap gap-2">
              <span className="font-bold text-slate-700">
                Profile Strength: <strong className="text-teal-700">{profileCompletion}% Complete</strong>
              </span>
              <span className="text-slate-500">
                {!license.trim()
                  ? '💡 Tip: Add your License / Certificate # below to reach 100% and get 3x more clinic offers!'
                  : !phone.trim()
                  ? '💡 Tip: Add your phone number so clinics can invite you for interviews!'
                  : '✓ Your profile is 100% ready for 1-click applications!'}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
        </div>

        {/* 5-Tab Navigation (Indeed / Vivian Style) */}
        <div className="bg-white rounded-2xl border border-slate-200 px-4 pt-3 flex gap-4 sm:gap-7 text-xs sm:text-sm font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Profile & CV</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matched')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'matched'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Matched Jobs For You ({matchedJobsForUser.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'applications'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Applied Jobs ({applications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'saved'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Jobs ({savedJobs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'notifications'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Email & Notification Settings</span>
          </button>
        </div>

        {/* TAB 1: MY PROFILE & CV (Strictly 2-Column Aligned Form Rows) */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleSaveProfile}
              className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    My Profile & Saved CV (Auto-Filled on Every Job)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Save your details once here — whenever you apply to a clinic job, your info and CV are attached automatically.
                  </p>
                </div>
              </div>

              {savedSuccess && (
                <div
                  role="status"
                  aria-live="polite"
                  className="p-3.5 bg-emerald-50 text-emerald-900 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your profile and CV have been saved! All applications will now use this updated info.</span>
                </div>
              )}

              {/* CV Upload & Update Card */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-extrabold text-slate-900">{resumeFileName}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Active CV
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {resumeUpdatedAt} • Automatically attached when you apply to jobs
                    </p>
                  </div>
                </div>

                <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-teal-800 border border-teal-300 font-bold text-xs cursor-pointer shadow-2xs shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-teal-600" />
                  <span>Upload / Replace CV (PDF/DOCX)</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Row 1: Full Name & Job Role Dropdown (2 Equal Aligned Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="cand-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="cand-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="cand-role" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Job Role / Specialty *
                  </label>
                  <select
                    id="cand-role"
                    name="specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Registered Dental Hygienist (RDH)">Dental Hygienist (RDH)</option>
                    <option value="Dental Assistant (RDA / EFDA)">Dental Assistant (RDA / EFDA)</option>
                    <option value="Certified Medical Assistant (CMA)">Medical Assistant (CMA)</option>
                    <option value="Physical Therapist Assistant (PTA)">Physical Therapy Assistant / Aide</option>
                    <option value="Optometric Tech / Optician">Optician / Eye Tech (COA)</option>
                    <option value="Dermatology / MedSpa Assistant">Dermatology / MedSpa Staff</option>
                    <option value="Front Desk / Receptionist / Manager">Front Desk / Clinic Manager</option>
                    <option value="Dentist / Doctor (DDS / MD / NP)">Dentist / Doctor / NP</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Experience Level & Gender (2 Equal Aligned Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="cand-exp" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Experience Level
                  </label>
                  <select
                    id="cand-exp"
                    name="yearsExperience"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Entry Level">Entry Level / New Grad</option>
                    <option value="1–3 Years">1–3 Years Experience</option>
                    <option value="3+ Years">3+ Years (Senior / Lead)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="cand-gender" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Gender
                  </label>
                  <select
                    id="cand-gender"
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Female' | 'Male' | 'Any')}
                    className={inputClass}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Any">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Desired Hourly Pay & Preferred Working Days (2 Equal Aligned Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="cand-pay" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Desired Hourly Pay ($/hr)
                  </label>
                  <input
                    id="cand-pay"
                    name="desiredPay"
                    type="text"
                    inputMode="numeric"
                    value={desiredPay}
                    onChange={(e) => setDesiredPay(Number(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="cand-days" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Preferred Work Days / Shift
                  </label>
                  <select
                    id="cand-days"
                    name="workDays"
                    value={workDays}
                    onChange={(e) => setWorkDays(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Mon–Fri (Flexible)">Mon–Fri (Full-Time / Flexible)</option>
                    <option value="Mon–Thu Only (Fridays Off)">Mon–Thu Only (Fridays Off)</option>
                    <option value="Part-Time (2–3 Days/Week)">Part-Time (2–3 Days/Week)</option>
                    <option value="PRN / Fill-In Shifts">Temp / Fill-In Shifts (PRN)</option>
                  </select>
                </div>
              </div>

              {/* Row 4: City & State (2 Equal Aligned Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="cand-city" className="block text-xs font-bold text-slate-700 mb-1.5">
                    City *
                  </label>
                  <input
                    id="cand-city"
                    name="city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="cand-state" className="block text-xs font-bold text-slate-700 mb-1.5">
                    State (All 52 US States) *
                  </label>
                  <select
                    id="cand-state"
                    name="stateCode"
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    className={inputClass}
                  >
                    {US_STATES_52.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Phone Number & License Number (2 Equal Aligned Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="cand-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="cand-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(214) 555-0192"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="cand-license" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Professional License / Cert # (Optional)
                  </label>
                  <input
                    id="cand-license"
                    name="licenseNumber"
                    type="text"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    placeholder="Enter your state license # (if applicable)"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Gemini AI Resume Summary & Skills Section */}
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label htmlFor="cand-bio" className="block text-xs font-bold text-slate-800">
                      Resume Summary & Bio
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Let Gemini AI write a tailored summary and skill tags for your role ({yearsExperience}).
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={aiGenerating}
                    onClick={handleGeminiBioWrite}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{aiGenerating ? 'Writing with Gemini AI...' : '✨ Write My Bio & Skills with Gemini AI'}</span>
                  </button>
                </div>

                <textarea
                  id="cand-bio"
                  name="bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-teal-600 focus:outline-none font-medium"
                />

                <div>
                  <label htmlFor="cand-skills" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Key Clinical & Software Skills (comma separated)
                  </label>
                  <input
                    id="cand-skills"
                    name="skills"
                    type="text"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    placeholder="Dentrix, Digital X-Rays, Patient Care, OSHA/HIPAA"
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto py-3 px-8 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-sm transition-all cursor-pointer"
              >
                Save My Profile & CV
              </button>
            </form>

            {/* Right Sidebar: Gemini AI Profile Coach & Quick Summary */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini AI Profile Coach</span>
                </div>
                <h3 className="text-lg font-extrabold text-white">Apply in 1 Click Anywhere</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your saved profile and CV are automatically attached whenever you click &ldquo;Apply Now&rdquo; on any clinic opening—you never have to type the same details twice.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('matched')}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs transition-colors cursor-pointer"
                >
                  View {matchedJobsForUser.length} Jobs Matched For You →
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-sm font-extrabold text-slate-900">Quick Account Summary</h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span>Saved CV:</span>
                    <span className="font-bold text-teal-700 truncate max-w-[160px]">{resumeFileName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span>Target Pay:</span>
                    <span className="font-bold text-slate-900">${desiredPay}/hr</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span>Preferred Days:</span>
                    <span className="font-bold text-slate-900">{workDays}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span>Applied Jobs:</span>
                    <span className="font-bold text-slate-900">{applications.length}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>Switch Account Type:</span>
                    <button
                      type="button"
                      onClick={() => switchRole('employer')}
                      className="font-bold text-teal-700 hover:underline cursor-pointer"
                    >
                      Switch to Employer →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MATCHED JOBS FOR YOUR PROFILE (Vivian / Indeed Style Automatic Matching) */}
        {activeTab === 'matched' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Top Clinic Jobs Matched For Your Profile ({specialty} in {stateCode})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automatically selected based on your saved role, state ({stateCode}), and target pay (${desiredPay}/hr).
                </p>
              </div>
              <Link
                href={`/?state=${stateCode}`}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shrink-0"
              >
                Browse All {stateCode} Jobs →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedJobsForUser.map(({ job, score }) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-teal-400 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                        {job.clinicType} • {job.workType}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                        <Sparkles className="w-3 h-3 text-emerald-700" />
                        <span>{score}% Match</span>
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">{job.title}</h3>
                    <p className="text-xs text-slate-600">
                      <strong>{job.clinicName}</strong> • {job.location}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-base font-black text-slate-900">
                      ${job.minHourly} – ${job.maxHourly}
                      <span className="text-xs font-semibold text-slate-500">/hr</span>
                    </div>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold transition-colors"
                    >
                      1-Click Apply →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MY APPLIED JOBS */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  My Job Applications ({applications.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Track every clinic you have applied to and view their real-time response status.
                </p>
              </div>
              <Link
                href="/"
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
              >
                Browse More Jobs
              </Link>
            </div>

            {applications.length > 0 ? (
              applications.map((app) => {
                const jobHref = String(app.job_id || '').startsWith('job-live-')
                  ? `/jobs/view?id=${app.job_id}`
                  : `/jobs/${app.job_id || 'job-1001'}`;
                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200">
                          ● {app.status}
                        </span>
                        <span className="text-xs text-slate-400">Applied {app.appliedDate}</span>
                        <span className="text-xs text-slate-500 font-semibold">• CV Sent: {resumeFileName}</span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900">{app.title}</h3>
                      <p className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800">{app.clinicName}</span>
                        <span>•</span>
                        <span>{app.location}</span>
                        <span>•</span>
                        <span className="text-teal-700 font-bold">{app.pay}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={jobHref}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                      >
                        View Job →
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleWithdrawApplication(app.id)}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Withdraw Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3">
                <p className="text-base font-extrabold text-slate-800">
                  You Haven&apos;t Applied to Any Jobs Yet
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your profile and CV are saved! Check your Matched Jobs tab or browse the job board to apply in 1 click.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('matched')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>See Jobs Matched For My Profile →</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SAVED JOBS */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  My Saved Jobs ({savedJobs.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Jobs you bookmarked to review or apply to later.
                </p>
              </div>
              <Link
                href="/"
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
              >
                Explore All Jobs
              </Link>
            </div>

            {savedJobs.length > 0 ? (
              savedJobs.map((job) => {
                const jobHref = job.id.startsWith('job-live-') ? `/jobs/view?id=${job.id}` : `/jobs/${job.id}`;
                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {job.payComparison}
                        </span>
                        <span className="text-xs text-slate-500">{job.workType}</span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900">{job.title}</h3>
                      <p className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800">{job.clinicName}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span className="text-teal-700 font-bold">${job.minHourly} – ${job.maxHourly}/hr</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => removeSavedJob(job.id)}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove Saved Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={jobHref}
                        className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        Apply Now →
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3">
                <p className="text-base font-extrabold text-slate-800">No Saved Jobs Yet</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click the &ldquo;Save Job&rdquo; button on any job card while browsing to bookmark it here.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold"
                >
                  <span>Browse Clinic Jobs →</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: EMAIL & NOTIFICATION SETTINGS */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-3xl space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900">
                Email & Notification Preferences
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose which free email updates you want to receive at <strong>{user?.email || 'your email'}</strong>.
              </p>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Your notification preferences have been saved!</span>
              </div>
            )}

            <div className="space-y-4">
              <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">
                    New Matching Jobs in {city}, {stateCode}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Get a daily email alert when clinics near you post new {specialty} jobs paying ${desiredPay}+/hr.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyEmailJobs}
                  onChange={(e) => setNotifyEmailJobs(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-teal-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">Application Status Updates</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Receive an instant email when a clinic views your CV or updates your application status.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyApplicationUpdates}
                  onChange={(e) => setNotifyApplicationUpdates(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-teal-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">Direct Clinic Interview Invitations</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Allow verified private clinics to email you interview invitations when your profile matches their opening.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyEmployerMessages}
                  onChange={(e) => setNotifyEmployerMessages(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-teal-600 rounded cursor-pointer"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={saveAllProfileData}
              className="py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer"
            >
              Save Notification Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
