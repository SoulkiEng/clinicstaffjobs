'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ALL_JOBS, US_STATES_52, Job } from '@/data/jobs';
import { generateCandidateBioWithGemini } from '@/lib/gemini';
import {
  User,
  MapPin,
  DollarSign,
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
  Search
} from 'lucide-react';

export default function CandidateDashboardPage() {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'applications' | 'saved' | 'notifications'>('profile');

  // Candidate Profile State
  const [name, setName] = useState(user?.name || 'Jessica Taylor, RDH');
  const [specialty, setSpecialty] = useState(user?.specialty || 'Registered Dental Hygienist (RDH)');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Any'>(user?.gender || 'Female');
  const [city, setCity] = useState(user?.city || 'Dallas');
  const [stateCode, setStateCode] = useState(user?.stateCode || 'TX');
  const [license, setLicense] = useState(user?.licenseNumber || 'TX-DH-94821');
  const [yearsExperience, setYearsExperience] = useState(user?.yearsExperience || '3+ Years');
  const [desiredPay, setDesiredPay] = useState(user?.desiredHourly || 48);
  const [phone, setPhone] = useState(user?.phone || '(214) 555-8932');
  const [bio, setBio] = useState(
    user?.bio ||
      'Experienced Registered Dental Hygienist skilled in gentle preventive care, periodontal therapy, digital X-rays, and patient education.'
  );
  const [skillsText, setSkillsText] = useState(
    Array.isArray(user?.skills)
      ? user.skills.join(', ')
      : user?.skills || 'Dentrix, Digital X-Rays, Periodontal Scaling, Patient Care, HIPAA'
  );
  const [resumeFileName, setResumeFileName] = useState(user?.resumeFileName || 'Jessica_Taylor_Resume.pdf');
  const [resumeUpdatedAt, setResumeUpdatedAt] = useState(user?.resumeUpdatedAt || 'Ready for 1-Click Apply');

  // Notification Settings State
  const [notifyEmailJobs, setNotifyEmailJobs] = useState(user?.notifyEmailJobs ?? true);
  const [notifyApplicationUpdates, setNotifyApplicationUpdates] = useState(user?.notifyApplicationUpdates ?? true);
  const [notifyEmployerMessages, setNotifyEmployerMessages] = useState(user?.notifyEmployerMessages ?? true);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([
    {
      id: 'app-seed-1',
      job_id: 'job-1001',
      title: 'Registered Dental Hygienist (RDH) - 60 Min Adult Recare',
      clinicName: 'Preston Hollow Dental Studio',
      location: 'Dallas, TX',
      appliedDate: 'Yesterday',
      pay: '$47 - $56/hr',
      status: 'Interview Requested',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'app-seed-2',
      job_id: 'job-1005',
      title: 'Dental Hygienist (RDH) - Mon–Thu Schedule',
      clinicName: 'Highland Park Smile Collective',
      location: 'Dallas, TX',
      appliedDate: '3 Days Ago',
      pay: '$46 - $54/hr',
      status: 'Viewed by Clinic',
      statusColor: 'bg-teal-50 text-teal-800 border-teal-200',
    },
  ]);

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.specialty) setSpecialty(user.specialty);
      if (user.gender) setGender(user.gender);
      if (user.city) setCity(user.city);
      if (user.stateCode) setStateCode(user.stateCode);
      if (user.licenseNumber) setLicense(user.licenseNumber);
      if (user.yearsExperience) setYearsExperience(user.yearsExperience);
      if (user.desiredHourly) setDesiredPay(user.desiredHourly);
      if (user.phone) setPhone(user.phone);
      if (user.bio) setBio(user.bio);
      if (user.skills) {
        setSkillsText(Array.isArray(user.skills) ? user.skills.join(', ') : user.skills);
      }
      if (user.resumeFileName) setResumeFileName(user.resumeFileName);
      if (user.resumeUpdatedAt) setResumeUpdatedAt(user.resumeUpdatedAt);
      if (user.notifyEmailJobs !== undefined) setNotifyEmailJobs(user.notifyEmailJobs);
      if (user.notifyApplicationUpdates !== undefined) setNotifyApplicationUpdates(user.notifyApplicationUpdates);
      if (user.notifyEmployerMessages !== undefined) setNotifyEmployerMessages(user.notifyEmployerMessages);
    }

    // Load saved jobs from localStorage
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem('saved_clinic_jobs') || '[]');
      if (savedIds.length > 0) {
        const matched = ALL_JOBS.filter((j) => savedIds.includes(j.id));
        setSavedJobs(matched);
      } else {
        setSavedJobs(ALL_JOBS.slice(0, 3));
      }
    } catch {
      setSavedJobs(ALL_JOBS.slice(0, 3));
    }

    // Load all submitted applications from both 1-click apply and job detail page
    try {
      const oneClickApps = JSON.parse(localStorage.getItem('my_applied_jobs') || '[]');
      const detailApps = JSON.parse(localStorage.getItem('my_submitted_applications') || '[]');
      const combined: any[] = [];

      if (Array.isArray(oneClickApps)) {
        oneClickApps.forEach((a: any) => {
          combined.push({
            id: a.id || `app-${Math.random()}`,
            job_id: a.job_id || 'job-1001',
            title: a.job_title || 'Clinic Opening',
            clinicName: a.clinic_name || 'Verified Clinic',
            location: a.location || 'United States',
            appliedDate: 'Today',
            pay: a.pay || '$45/hr',
            status: a.status || 'Application Sent',
            statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          });
        });
      }

      if (Array.isArray(detailApps)) {
        detailApps.forEach((a: any) => {
          if (!combined.some((c) => c.job_id === a.job_id)) {
            combined.push({
              id: a.id || `app-${Math.random()}`,
              job_id: a.job_id || 'job-1001',
              title: a.job_title || 'Clinic Opening',
              clinicName: a.clinic_name || 'Verified Clinic',
              location: a.location || 'United States',
              appliedDate: 'Today',
              pay: a.desired_pay || '$45/hr',
              status: a.status || 'Application Sent',
              statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            });
          }
        });
      }

      if (combined.length > 0) {
        setApplications((prev) => {
          const existingIds = new Set(combined.map((c) => c.job_id));
          return [...combined, ...prev.filter((p) => !existingIds.has(p.job_id))];
        });
      }
    } catch {
      // ignore
    }
  }, [user]);

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
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
      licenseNumber: license,
      yearsExperience,
      desiredHourly: Number(desiredPay),
      phone,
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

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Candidate Top Profile Header */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-extrabold text-xl shadow-xs">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {name}
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

        {/* 4-Tab Navigation (Indeed-Style) */}
        <div className="bg-white rounded-2xl border border-slate-200 px-4 pt-3 flex gap-4 sm:gap-8 text-xs sm:text-sm font-bold overflow-x-auto">
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

        {/* TAB 1: MY PROFILE & CV */}
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
                    Save your details once here—every time you click &ldquo;1-Click Apply&rdquo; on any job, your info and CV are filled automatically.
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
                  <span>Your profile and CV have been saved! All 1-click applications will now use this updated info.</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cand-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="cand-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="cand-role" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Job Title / Specialty
                  </label>
                  <input
                    id="cand-role"
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="cand-gender" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Gender
                  </label>
                  <select
                    id="cand-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Female' | 'Male' | 'Any')}
                    className={inputClass}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Any">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="cand-exp" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Experience Level
                  </label>
                  <select
                    id="cand-exp"
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
                  <label htmlFor="cand-pay" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Desired Hourly Pay ($/hr)
                  </label>
                  <input
                    id="cand-pay"
                    type="text"
                    inputMode="numeric"
                    value={desiredPay}
                    onChange={(e) => setDesiredPay(Number(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="cand-city" className="block text-xs font-bold text-slate-700 mb-1.5">
                    City
                  </label>
                  <input
                    id="cand-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="cand-state" className="block text-xs font-bold text-slate-700 mb-1.5">
                    State
                  </label>
                  <select
                    id="cand-state"
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

                <div>
                  <label htmlFor="cand-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="cand-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cand-license" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Professional License Number (Optional)
                </label>
                <input
                  id="cand-license"
                  type="text"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="e.g. TX-DH-94821"
                  className={inputClass}
                />
              </div>

              {/* Gemini AI Resume Summary & Skills Section */}
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label htmlFor="cand-bio" className="block text-xs font-bold text-slate-800">
                      Resume Summary & Bio
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Let Gemini AI write a professional summary and skill tags for your profile.
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
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={inputClass}
                />

                <div>
                  <label htmlFor="cand-skills" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Key Clinical & Software Skills (comma separated)
                  </label>
                  <input
                    id="cand-skills"
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

            {/* Right Sidebar: How 1-Click Apply Works */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400">
                  <Sparkles className="w-4 h-4" />
                  <span>No Repeated Typing</span>
                </div>
                <h3 className="text-lg font-extrabold text-white">Apply in 1 Click Anywhere</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Once you save your profile and CV here, every job on ClinicStaffJobs automatically pre-fills your name, phone, email, and attached CV so you never have to fill out forms again.
                </p>
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
                    <span>Applied Jobs:</span>
                    <span className="font-bold text-slate-900">{applications.length}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>Email Job Alerts:</span>
                    <span className="font-bold text-emerald-700">{notifyEmailJobs ? 'Active' : 'Paused'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY APPLIED JOBS */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  My Job Applications ({applications.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Track every clinic you have applied to and view their response status.
                </p>
              </div>
              <Link
                href="/"
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
              >
                Browse More Jobs
              </Link>
            </div>

            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${app.statusColor}`}>
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
                    href={`/jobs/${app.job_id || 'job-1001'}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                  >
                    View Job Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SAVED JOBS */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
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

            {savedJobs.map((job) => (
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
                    href={`/jobs/${job.id}`}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Apply Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: EMAIL & NOTIFICATION SETTINGS */}
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
                  <p className="text-sm font-extrabold text-slate-900">New Matching Jobs in {city}, {stateCode}</p>
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
              onClick={handleSaveProfile}
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
