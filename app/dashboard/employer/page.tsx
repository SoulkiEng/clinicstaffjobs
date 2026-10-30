'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { US_STATES_52 } from '@/data/jobs';
import { supabase } from '@/lib/supabase';
import { generateInterviewInviteWithGemini } from '@/lib/gemini';
import {
  Building2,
  Users,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  Phone,
  FileText,
  Settings,
  ShieldCheck,
  LogOut,
  PauseCircle,
  PlayCircle,
  Edit3,
  Archive,
  Trash2,
  UserPlus,
  Send
} from 'lucide-react';

interface EmployerJobItem {
  id: string;
  title: string;
  location: string;
  minHourly: number;
  maxHourly: number;
  workType: string;
  isFeatured: boolean;
  status: 'Active' | 'Inactive';
  views: number;
  applications: number;
  postedDate: string;
}

const MATCHED_CANDIDATE_POOL = [
  {
    id: 'cand-match-1',
    name: 'Jessica M., RDH',
    role: 'Registered Dental Hygienist (RDH)',
    specialty: 'Dental',
    experience: '3+ Years Experience',
    license: 'Active State Board License',
    desiredPay: '$48/hr',
    workDays: 'Mon–Thu or Mon–Fri',
    software: 'Dentrix, Dexis, iTero 3D',
  },
  {
    id: 'cand-match-2',
    name: 'Michael C., RDA',
    role: 'Lead Dental Assistant (RDA / EFDA)',
    specialty: 'Dental',
    experience: '1–3 Years Experience',
    license: 'Radiology & Nitrous Certified',
    desiredPay: '$28/hr',
    workDays: 'Full-time (Mon–Fri)',
    software: 'Open Dental, Eaglesoft',
  },
  {
    id: 'cand-match-3',
    name: 'Amanda R., CMA',
    role: 'Certified Medical Assistant (CMA)',
    specialty: 'Family Medicine',
    experience: '3+ Years Experience',
    license: 'AAMA Certified + BLS',
    desiredPay: '$26/hr',
    workDays: 'Full-time (No Weekends)',
    software: 'AthenaHealth EHR, eClinicalWorks',
  },
  {
    id: 'cand-match-4',
    name: 'David K., PTA',
    role: 'Physical Therapist Assistant (PTA)',
    specialty: 'Physical Therapy',
    experience: '1–3 Years Experience',
    license: 'State Licensed PTA',
    desiredPay: '$36/hr',
    workDays: 'Full-time / Flexible',
    software: 'WebPT, Prompt EMR',
  },
  {
    id: 'cand-match-5',
    name: 'Sophia L., COA',
    role: 'Optometric Technician & Optician',
    specialty: 'Vision',
    experience: '1–3 Years Experience',
    license: 'ABO & COA Certified',
    desiredPay: '$27/hr',
    workDays: 'Mon–Fri',
    software: 'RevolutionEHR, Zeiss OCT',
  },
];

export default function EmployerDashboardPage() {
  const { user, isLoading, logout, updateProfile, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'active_jobs' | 'inactive_jobs' | 'applicants' | 'matched_candidates' | 'settings'
  >('active_jobs');

  // Clean start: Only show the employer's actual posted jobs (Zero fake Dallas jobs for new accounts!)
  const [myJobs, setMyJobs] = useState<EmployerJobItem[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const [aiInviteForId, setAiInviteForId] = useState<string | null>(null);
  const [aiInviteData, setAiInviteData] = useState<{
    emailDraft: string;
    screeningQuestions: string[];
  } | null>(null);

  // Inline quick-edit state so employer never has to re-type a job
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editMinPay, setEditMinPay] = useState(35);
  const [editMaxPay, setEditMaxPay] = useState(50);
  const [editWorkType, setEditWorkType] = useState('Full-time');

  // Clinic Profile State (auto-pre-filled when posting new jobs)
  const [practiceNameInput, setPracticeNameInput] = useState('');
  const [practiceTypeInput, setPracticeTypeInput] = useState('Dental');
  const [npiInput, setNpiInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [cityInput, setCityInput] = useState('Dallas');
  const [stateInput, setStateInput] = useState('TX');
  const [zipInput, setZipInput] = useState('75225');
  const [notifyNewApplicants, setNotifyNewApplicants] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setPracticeNameInput(user.practiceName || `${user.name} Clinic`);
      setPracticeTypeInput(user.practiceType || 'Dental');
      setNpiInput(user.npiNumber || '');
      setPhoneInput(user.phone || '');
      setCityInput(user.city || 'Dallas');
      setStateInput(user.stateCode || 'TX');
      setZipInput(user.zipCode || '75225');
      if (user.notifyEmailJobs !== undefined) setNotifyNewApplicants(user.notifyEmailJobs);
    }

    // Load locally posted jobs (both Active and Inactive)
    try {
      const localPosted = JSON.parse(localStorage.getItem('my_posted_jobs') || '[]');
      if (Array.isArray(localPosted) && localPosted.length > 0) {
        const mapped: EmployerJobItem[] = localPosted.map((j: any) => ({
          id: j.id || `job-live-${Date.now()}`,
          title: j.title,
          location: j.location || `${j.city || 'Dallas'}, ${j.state || 'TX'}`,
          minHourly: Number(j.min_hourly) || 35,
          maxHourly: Number(j.max_hourly) || 48,
          workType: j.work_type || 'Full-time',
          isFeatured: Boolean(j.is_featured),
          status: j.status === 'Inactive' ? 'Inactive' : 'Active',
          views: j.views || 12,
          applications: j.applications || 1,
          postedDate: j.status === 'Inactive' ? 'Paused / Inactive' : 'Active Opening',
        }));
        setMyJobs(mapped);
      } else {
        setMyJobs([]);
      }
    } catch {
      setMyJobs([]);
    }

    // Load real submitted applications from localStorage
    try {
      const localApps = JSON.parse(localStorage.getItem('my_applied_jobs') || '[]');
      if (Array.isArray(localApps) && localApps.length > 0) {
        const localMapped = localApps.map((a: any, idx: number) => ({
          id: a.id || `local-app-${idx}`,
          job_id: a.job_id,
          name: a.candidate_name || 'Verified Candidate',
          role: a.job_title || 'Clinical Applicant',
          license: a.license_number || 'Verified Profile',
          experience: a.experience_years || '1–3 Years',
          desiredPay: a.pay || a.desired_pay || '$45/hr',
          email: a.candidate_email || 'candidate@email.com',
          phone: a.candidate_phone || '(Saved in Profile)',
          resumeFile: a.resume_file || 'Candidate_Resume.pdf',
          coverNote: a.cover_note || '',
          appliedFor: a.job_title || 'Clinic Opening',
          appliedDate: 'Recent',
          status: a.status || 'New Applicant',
        }));
        setApplicants(localMapped);
      } else {
        setApplicants([]);
      }
    } catch {
      setApplicants([]);
    }

    try {
      const inv = JSON.parse(localStorage.getItem('employer_invited_candidates') || '[]');
      if (Array.isArray(inv)) setInvitedIds(inv);
    } catch {
      // ignore
    }
  }, [user]);

  // Persist job changes back to localStorage & Supabase so homepage & portal stay synced
  const syncJobsToStorage = async (updatedJobs: EmployerJobItem[]) => {
    setMyJobs(updatedJobs);
    try {
      const localPosted = JSON.parse(localStorage.getItem('my_posted_jobs') || '[]');
      if (Array.isArray(localPosted)) {
        const keptIds = new Set(updatedJobs.map((u) => u.id));
        const synced = localPosted
          .filter((raw: any) => keptIds.has(raw.id))
          .map((raw: any) => {
            const match = updatedJobs.find((u) => u.id === raw.id);
            if (match) {
              return {
                ...raw,
                title: match.title,
                min_hourly: match.minHourly,
                max_hourly: match.maxHourly,
                work_type: match.workType,
                status: match.status,
                is_featured: match.isFeatured,
              };
            }
            return raw;
          });
        localStorage.setItem('my_posted_jobs', JSON.stringify(synced));
      }
    } catch {
      // ignore
    }
  };

  const handleToggleJobStatus = (id: string) => {
    const updated = myJobs.map((j) => {
      if (j.id === id) {
        const nextStatus: 'Active' | 'Inactive' = j.status === 'Active' ? 'Inactive' : 'Active';
        return {
          ...j,
          status: nextStatus,
          postedDate: nextStatus === 'Active' ? 'Re-Opened Just Now' : 'Paused / Marked Inactive',
        };
      }
      return j;
    });
    syncJobsToStorage(updated);
  };

  const handleDeleteJob = (id: string) => {
    const updated = myJobs.filter((j) => j.id !== id);
    syncJobsToStorage(updated);
  };

  const startQuickEdit = (job: EmployerJobItem) => {
    setEditingJobId(job.id);
    setEditTitle(job.title);
    setEditMinPay(job.minHourly);
    setEditMaxPay(job.maxHourly);
    setEditWorkType(job.workType);
  };

  const saveQuickEdit = (id: string) => {
    const safeMin = Number(editMinPay) || 30;
    const safeMax = Math.max(safeMin, Number(editMaxPay) || safeMin + 8);
    const updated = myJobs.map((j) =>
      j.id === id
        ? {
            ...j,
            title: editTitle.trim() || j.title,
            minHourly: safeMin,
            maxHourly: safeMax,
            workType: editWorkType,
            postedDate: 'Updated Just Now',
          }
        : j
    );
    syncJobsToStorage(updated);
    setEditingJobId(null);
  };

  // Real-time sync of applicant status to localStorage so the Candidate's "Applied Jobs" tab updates too!
  const handleApplicantStatusChange = (id: string, nextStatus: string) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a)));
    try {
      const localApps = JSON.parse(localStorage.getItem('my_applied_jobs') || '[]');
      if (Array.isArray(localApps)) {
        const updatedApps = localApps.map((a: any) =>
          a.id === id ? { ...a, status: nextStatus } : a
        );
        localStorage.setItem('my_applied_jobs', JSON.stringify(updatedApps));
        window.dispatchEvent(new Event('appliedJobsUpdated'));
      }
    } catch {
      // ignore
    }
  };

  const handleGenerateAiInvite = (app: any) => {
    if (aiInviteForId === app.id) {
      setAiInviteForId(null);
      setAiInviteData(null);
      return;
    }
    const generated = generateInterviewInviteWithGemini({
      candidateName: app.name,
      role: app.appliedFor || app.role,
      clinicName: practiceNameInput || 'Our Private Clinic',
      city: `${cityInput}, ${stateInput}`,
      payRange: app.desiredPay || '$45/hr',
    });
    setAiInviteForId(app.id);
    setAiInviteData(generated);
  };

  const handleInviteCandidate = (candId: string, candName: string, candRole: string) => {
    const next = [...invitedIds, candId];
    setInvitedIds(next);
    try {
      localStorage.setItem('employer_invited_candidates', JSON.stringify(next));
      const existingInvites = JSON.parse(localStorage.getItem('candidate_interview_invites') || '[]');
      const inviteRecord = {
        id: `inv-${Date.now()}`,
        clinicName: practiceNameInput || 'Verified Private Clinic',
        location: `${cityInput}, ${stateInput}`,
        role: candRole,
        candidateName: candName,
        sentAt: 'Today',
      };
      localStorage.setItem(
        'candidate_interview_invites',
        JSON.stringify([inviteRecord, ...existingInvites])
      );
    } catch {
      // ignore
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      practiceName: practiceNameInput,
      practiceType: practiceTypeInput,
      npiNumber: npiInput,
      phone: phoneInput,
      city: cityInput,
      stateCode: stateInput,
      zipCode: zipInput,
      location: `${cityInput}, ${stateInput}`,
      notifyEmailJobs: notifyNewApplicants,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Auth Guard: Require Employer Login
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Sign In to Your Employer Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Create a free Employer Account or sign in to post jobs, manage active and closed openings, and review candidate CVs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/signup?role=employer&redirect=/dashboard/employer"
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm transition-colors"
            >
              Create Free Employer Account →
            </Link>
            <Link
              href="/login?role=employer&redirect=/dashboard/employer"
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Role Guard: If logged in as a Job Seeker, offer 1-click go to Candidate Portal or Role Switch
  if (!isLoading && user && user.role === 'candidate') {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            You Are Signed In with a Job Seeker Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Would you like to open your Job Seeker Portal, or switch your account to an Employer (Clinic) Account to post jobs?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/dashboard/candidate"
              className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm transition-colors"
            >
              Open My Job Seeker Portal →
            </Link>
            <button
              type="button"
              onClick={() => switchRole('employer')}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Switch My Account to Employer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeJobs = myJobs.filter((j) => j.status === 'Active');
  const inactiveJobs = myJobs.filter((j) => j.status === 'Inactive');

  // Clinic Profile Completion Meter (Competitor Feature)
  let profileCompletion = 50;
  if (practiceNameInput.trim()) profileCompletion += 15;
  if (phoneInput.trim()) profileCompletion += 15;
  if (npiInput.trim()) profileCompletion += 20;
  profileCompletion = Math.min(100, profileCompletion);

  const inputClass =
    'w-full h-11 px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Clinic Header */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-extrabold text-xl shadow-xs">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {practiceNameInput || 'Your Clinic Portal'}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    <ShieldCheck className="w-3 h-3 text-teal-600" /> Verified Employer Account
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2.5">
                  <span className="font-bold text-teal-700">{practiceTypeInput} Clinic</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {cityInput}, {stateInput}
                  </span>
                  <span>•</span>
                  <span className="text-slate-500">{user?.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href="/post-a-job"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Post a New Job (Auto-Filled)</span>
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

          {/* Clinic Profile Strength Meter (Vivian Health / DentalPost Style) */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Clinic Profile Strength: <strong className="text-teal-700">{profileCompletion}% Complete</strong>
                </span>
                {profileCompletion < 100 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="text-teal-700 font-bold hover:underline cursor-pointer"
                  >
                    + Add Clinic NPI / Phone to reach 100% →
                  </button>
                )}
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('active_jobs')}
            className="text-left bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 shadow-xs flex items-center justify-between cursor-pointer transition-all"
          >
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Jobs</span>
              <div className="text-2xl font-black text-emerald-700">{activeJobs.length} Open</div>
              <span className="text-[11px] text-slate-500">Live on job board</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PlayCircle className="w-5 h-5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inactive_jobs')}
            className="text-left bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 shadow-xs flex items-center justify-between cursor-pointer transition-all"
          >
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Inactive Jobs</span>
              <div className="text-2xl font-black text-slate-800">{inactiveJobs.length} Paused</div>
              <span className="text-[11px] text-slate-500">Re-open in 1 click</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('applicants')}
            className="text-left bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 shadow-xs flex items-center justify-between cursor-pointer transition-all"
          >
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Applicants</span>
              <div className="text-2xl font-black text-teal-700">{applicants.length} CVs</div>
              <span className="text-[11px] text-slate-500">Received applications</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matched_candidates')}
            className="text-left bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 shadow-xs flex items-center justify-between cursor-pointer transition-all"
          >
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">Matched Staff</span>
              <div className="text-2xl font-black text-slate-900">{MATCHED_CANDIDATE_POOL.length} Ready</div>
              <span className="text-[11px] text-slate-500">1-Click Invite to Apply</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* 5-Tab Navigation */}
        <div className="bg-white rounded-2xl border border-slate-200 px-4 pt-3 flex gap-4 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('active_jobs')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'active_jobs'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Active Jobs ({activeJobs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inactive_jobs')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'inactive_jobs'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PauseCircle className="w-4 h-4" />
            <span>Inactive / Closed Jobs ({inactiveJobs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('applicants')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'applicants'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Applicants & CVs ({applicants.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matched_candidates')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'matched_candidates'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Matched Candidates ({MATCHED_CANDIDATE_POOL.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Clinic Profile & Auto-Fill</span>
          </button>
        </div>

        {/* TAB 1: ACTIVE JOBS */}
        {activeTab === 'active_jobs' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Your Active Job Postings ({activeJobs.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Update pay or details anytime with &ldquo;Quick Edit&rdquo;, or pause a job in 1 click when filled.
                </p>
              </div>
              <Link
                href="/post-a-job"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Post a Job Opening</span>
              </Link>
            </div>

            {activeJobs.length > 0 ? (
              activeJobs.map((job) => {
                const liveHref = job.id.startsWith('job-live-')
                  ? `/jobs/view?id=${job.id}`
                  : `/jobs/${job.id}`;
                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ● Active Job
                          </span>
                          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                            {job.workType}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {job.postedDate}
                          </span>
                        </div>

                        <h3 className="text-lg font-extrabold text-slate-900">{job.title}</h3>
                        <p className="text-xs text-slate-600 flex items-center gap-3 flex-wrap">
                          <span>
                            Hourly Pay:{' '}
                            <strong className="text-teal-700">
                              ${job.minHourly} – ${job.maxHourly}/hr
                            </strong>
                          </span>
                          <span>•</span>
                          <span>{job.location}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => startQuickEdit(job)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                          <span>Quick Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleJobStatus(job.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pause Job</span>
                        </button>

                        <Link
                          href={liveHref}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                        >
                          View Live Job
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 2-Column Aligned Quick Edit Drawer */}
                    {editingJobId === job.id && (
                      <div className="pt-4 border-t border-slate-200 bg-slate-50/80 p-4 rounded-xl space-y-4">
                        <p className="text-xs font-extrabold text-slate-800">
                          Quick Update Job (Changes go live immediately)
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Job Title</label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Work Schedule</label>
                            <select
                              value={editWorkType}
                              onChange={(e) => setEditWorkType(e.target.value)}
                              className={inputClass}
                            >
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="PRN / Temp">Temp / Fill-In Shifts (PRN)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Minimum Hourly Pay ($/hr)
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={editMinPay}
                              onChange={(e) =>
                                setEditMinPay(Number(e.target.value.replace(/[^0-9]/g, '')) || 0)
                              }
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Maximum Hourly Pay ($/hr)
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={editMaxPay}
                              onChange={(e) =>
                                setEditMaxPay(Number(e.target.value.replace(/[^0-9]/g, '')) || 0)
                              }
                              className={inputClass}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingJobId(null)}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveQuickEdit(job.id)}
                            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer"
                          >
                            Save Update
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3">
                <p className="text-base font-extrabold text-slate-800">
                  You Have 0 Active Job Postings Yet
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your clinic profile ({practiceNameInput || 'Clinic'}) is saved and ready! Click below to post your first job using our 1-click templates and Gemini AI writer.
                </p>
                <Link
                  href="/post-a-job"
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Your First Job (100% Free) →</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INACTIVE / CLOSED JOBS */}
        {activeTab === 'inactive_jobs' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-base font-extrabold text-slate-900">
                Inactive & Closed Jobs ({inactiveJobs.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Need to hire for a past role again? Click <strong>&ldquo;Re-Open Job (Make Active)&rdquo;</strong> to publish it immediately without re-typing anything.
              </p>
            </div>

            {inactiveJobs.length > 0 ? (
              inactiveJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          ● Inactive / Paused
                        </span>
                        <span className="text-xs text-slate-500">{job.postedDate}</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-800">{job.title}</h3>
                      <p className="text-xs text-slate-600">
                        Pay: <strong className="text-slate-900">${job.minHourly} – ${job.maxHourly}/hr</strong> •{' '}
                        {job.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => startQuickEdit(job)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Edit Pay / Title</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleJobStatus(job.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-xs transition-colors cursor-pointer"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Re-Open Job (Make Active)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-2">
                <p className="text-base font-extrabold text-slate-800">No Inactive or Closed Jobs</p>
                <p className="text-xs text-slate-500">
                  When you pause an active job, it stays saved here so you can re-open it anytime in 1 click.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: APPLICANTS & CVS */}
        {activeTab === 'applicants' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-base font-extrabold text-slate-900">
                Received Candidate Applications & CVs ({applicants.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review candidate details, update their hiring status (synced with the candidate&apos;s portal), or use Gemini AI to draft an interview invitation.
              </p>
            </div>

            {applicants.length > 0 ? (
              applicants.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-extrabold text-slate-900">{app.name}</h3>
                        <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                          {app.status}
                        </span>
                        <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md font-semibold">
                          Applied for: {app.appliedFor}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                        <span>
                          License: <strong className="text-slate-800">{app.license}</strong>
                        </span>
                        <span>
                          Experience: <strong className="text-slate-800">{app.experience}</strong>
                        </span>
                        <span>
                          Target Pay: <strong className="text-teal-700">{app.desiredPay}</strong>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-teal-600" />
                          Attached CV: <strong className="text-slate-900">{app.resumeFile}</strong>
                        </span>
                      </p>

                      {app.coverNote && (
                        <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 italic">
                          &ldquo;{app.coverNote}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-slate-600 pt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {app.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {app.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        aria-label="Update applicant status"
                        value={app.status}
                        onChange={(e) => handleApplicantStatusChange(app.id, e.target.value)}
                        className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800"
                      >
                        <option value="Application Sent">Application Received</option>
                        <option value="Viewed by Clinic">Viewed by Clinic</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Requested">Interview Requested</option>
                        <option value="Hired">Hired ✓</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleGenerateAiInvite(app)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>✨ Gemini AI Interview Invite</span>
                      </button>

                      <a
                        href={`mailto:${app.email}?subject=Interview Invitation for ${encodeURIComponent(
                          app.appliedFor
                        )} at ${encodeURIComponent(practiceNameInput)}`}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        Email Candidate
                      </a>
                    </div>
                  </div>

                  {/* Gemini AI Interview Invitation & Screening Questions Drawer */}
                  {aiInviteForId === app.id && aiInviteData && (
                    <div className="p-4 rounded-xl bg-indigo-950 text-white space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-teal-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          <span>Gemini AI Interview Message & Screening Questions for {app.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setAiInviteForId(null)}
                          className="text-slate-300 hover:text-white font-bold cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                      <div className="p-3 rounded-lg bg-white/10 border border-white/15 whitespace-pre-line text-slate-100">
                        {aiInviteData.emailDraft}
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-emerald-300">
                          Recommended 15-Minute Phone Interview Questions:
                        </p>
                        <ul className="space-y-1 text-slate-200">
                          {aiInviteData.screeningQuestions.map((q, i) => (
                            <li key={i}>• {q}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3">
                <p className="text-base font-extrabold text-slate-800">
                  No Candidate Applications Received Yet
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  As soon as a Job Seeker applies to one of your jobs, their CV, phone number, and license details will appear here automatically. You can also invite matching candidates right now!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('matched_candidates')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Browse Matched Candidates & Send 1-Click Invite →</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MATCHED CANDIDATES NEAR YOUR CLINIC (DentalPost / Vivian Competitor Feature) */}
        {activeTab === 'matched_candidates' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Matched Candidates Near {cityInput}, {stateInput}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Don&apos;t wait for applications — invite verified healthcare professionals in {stateInput} to apply to {practiceNameInput || 'your clinic'} in 1 click.
                </p>
              </div>
              <Link
                href="/talent"
                className="text-xs font-bold text-teal-700 hover:underline shrink-0"
              >
                Open Full Candidate Directory →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MATCHED_CANDIDATE_POOL.map((cand) => {
                const isInvited = invitedIds.includes(cand.id);
                return (
                  <div
                    key={cand.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                          {cand.specialty} • {stateInput}
                        </span>
                        <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          95% Clinic Match
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {cand.name} — {cand.role}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {cand.experience} • {cand.license} • Target Pay: <strong>{cand.desiredPay}</strong>
                      </p>
                      <p className="text-xs text-slate-500">
                        Software: {cand.software} • Schedule: {cand.workDays}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-emerald-700">
                        🟢 Open to Job Offers in {cityInput}, {stateInput}
                      </span>
                      {isInvited ? (
                        <span className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Interview Invite Sent ✓</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleInviteCandidate(cand.id, cand.name, cand.role)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>1-Click Invite to Interview</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: CLINIC PROFILE & AUTO-FILL SETTINGS (Strictly 2-Column Aligned) */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSaveSettings}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-teal-600" />
                  <span>Clinic Profile & Auto-Fill Settings</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Save your clinic details once here. Every time you click <strong>&ldquo;Post a Job&rdquo;</strong>, your clinic name, NPI, specialty, and location are filled in automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => switchRole('candidate')}
                className="text-xs font-bold text-slate-500 hover:text-teal-700 underline shrink-0 cursor-pointer"
              >
                Need a Job Seeker Account Instead? Switch Role
              </button>
            </div>

            {savedSuccess && (
              <div
                role="status"
                aria-live="polite"
                className="p-3.5 bg-emerald-50 text-emerald-900 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Clinic profile saved! Your details will now auto-fill whenever you post a new job.</span>
              </div>
            )}

            {/* Row 1: Clinic Name & Specialty (2 Equal Aligned Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="emp-clinic-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Clinic / Practice Name *
                </label>
                <input
                  id="emp-clinic-name"
                  name="practiceName"
                  type="text"
                  required
                  value={practiceNameInput}
                  onChange={(e) => setPracticeNameInput(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="emp-clinic-type" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Clinic Specialty *
                </label>
                <select
                  id="emp-clinic-type"
                  name="practiceType"
                  value={practiceTypeInput}
                  onChange={(e) => setPracticeTypeInput(e.target.value)}
                  className={inputClass}
                >
                  <option value="Dental">Dental Clinic</option>
                  <option value="Family Medicine">Family Medicine / Medical</option>
                  <option value="Vision">Eye & Vision Clinic</option>
                  <option value="Physical Therapy">Physical Therapy</option>
                  <option value="Dermatology & MedSpa">Dermatology & MedSpa</option>
                </select>
              </div>
            </div>

            {/* Row 2: NPI & Phone (2 Equal Aligned Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="emp-npi" className="block text-xs font-bold text-slate-700 mb-1.5">
                  10-Digit Clinic NPI Number (Optional)
                </label>
                <input
                  id="emp-npi"
                  name="npiNumber"
                  type="text"
                  inputMode="numeric"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  maxLength={10}
                  placeholder="e.g. 1487920319"
                  value={npiInput}
                  onChange={(e) => setNpiInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="emp-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Clinic Phone Number
                </label>
                <input
                  id="emp-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(214) 555-0192"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 3: City & State (2 Equal Aligned Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="emp-city" className="block text-xs font-bold text-slate-700 mb-1.5">
                  City *
                </label>
                <input
                  id="emp-city"
                  name="city"
                  type="text"
                  required
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="emp-state" className="block text-xs font-bold text-slate-700 mb-1.5">
                  State (All 52 US States) *
                </label>
                <select
                  id="emp-state"
                  name="stateCode"
                  value={stateInput}
                  onChange={(e) => setStateInput(e.target.value)}
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

            {/* Row 4: ZIP Code & Hiring Email (2 Equal Aligned Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="emp-zip" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Clinic ZIP Code *
                </label>
                <input
                  id="emp-zip"
                  name="zipCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Account Email for Applicant CVs
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className={`${inputClass} bg-slate-100 text-slate-500`}
                />
              </div>
            </div>

            <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="text-sm font-extrabold text-slate-900">Instant Email Alert on New Applicant CV</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Email me immediately whenever a job seeker applies to one of our active openings.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyNewApplicants}
                onChange={(e) => setNotifyNewApplicants(e.target.checked)}
                className="mt-1 w-5 h-5 accent-teal-600 rounded cursor-pointer"
              />
            </label>

            <button
              type="submit"
              className="py-3 px-8 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-sm transition-all cursor-pointer"
            >
              Save Clinic Profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
