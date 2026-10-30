'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { US_STATES_52 } from '@/data/jobs';
import { supabase } from '@/lib/supabase';
import {
  Building2,
  Users,
  Eye,
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
  Archive
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

export default function EmployerDashboardPage() {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'active_jobs' | 'inactive_jobs' | 'applicants' | 'settings'>('active_jobs');

  const [myJobs, setMyJobs] = useState<EmployerJobItem[]>([
    {
      id: 'job-1001',
      title: 'Registered Dental Hygienist (RDH) - 60 Min Adult Recare',
      location: 'Dallas, TX',
      minHourly: 47,
      maxHourly: 56,
      workType: 'Full-time',
      isFeatured: true,
      status: 'Active',
      views: 284,
      applications: 9,
      postedDate: 'Active • Posted 2 days ago',
    },
    {
      id: 'job-1002',
      title: 'Lead Dental Assistant (RDA / EFDA) - Restorative & Digital Scanning',
      location: 'Dallas, TX',
      minHourly: 27,
      maxHourly: 34,
      workType: 'Full-time',
      isFeatured: false,
      status: 'Active',
      views: 146,
      applications: 6,
      postedDate: 'Active • Posted 4 days ago',
    },
    {
      id: 'job-1009',
      title: 'Part-Time Front Desk Treatment Coordinator (2 Days/Wk)',
      location: 'Dallas, TX',
      minHourly: 24,
      maxHourly: 29,
      workType: 'Part-time',
      isFeatured: false,
      status: 'Inactive',
      views: 192,
      applications: 11,
      postedDate: 'Paused / Position Filled last month',
    },
  ]);

  // Inline quick-edit state so employer never has to re-type a job
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editMinPay, setEditMinPay] = useState(35);
  const [editMaxPay, setEditMaxPay] = useState(50);
  const [editWorkType, setEditWorkType] = useState('Full-time');

  const [applicants, setApplicants] = useState([
    {
      id: 'app-1',
      name: 'Jessica Taylor, RDH',
      role: 'Registered Dental Hygienist',
      license: 'Active State License #94821',
      experience: '3+ Years Experience',
      desiredPay: '$48/hr',
      email: 'jessica.rdh@gmail.com',
      phone: '(214) 555-8932',
      resumeFile: 'Jessica_Taylor_Resume.pdf',
      isVip: true,
      appliedFor: 'Registered Dental Hygienist (RDH)',
      appliedDate: 'Yesterday',
      status: 'Interview Requested',
    },
    {
      id: 'app-2',
      name: 'Michael Chen, RDA',
      role: 'Lead Dental Assistant',
      license: 'Nitrous & Radiology Certified',
      experience: '1–3 Years Experience',
      desiredPay: '$29/hr',
      email: 'mchen.rda@outlook.com',
      phone: '(214) 555-4421',
      resumeFile: 'Michael_Chen_RDA_CV.pdf',
      isVip: false,
      appliedFor: 'Lead Dental Assistant (RDA / EFDA)',
      appliedDate: '2 Days Ago',
      status: 'Shortlisted',
    },
  ]);

  // Clinic Profile State (auto-pre-filled when posting new jobs)
  const [practiceNameInput, setPracticeNameInput] = useState(user?.practiceName || 'Preston Hollow Dental Studio');
  const [practiceTypeInput, setPracticeTypeInput] = useState(user?.practiceType || 'Dental');
  const [npiInput, setNpiInput] = useState(user?.npiNumber || '1487920194');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '(214) 555-0192');
  const [cityInput, setCityInput] = useState(user?.city || 'Dallas');
  const [stateInput, setStateInput] = useState(user?.stateCode || 'TX');
  const [zipInput, setZipInput] = useState(user?.zipCode || '75225');
  const [notifyNewApplicants, setNotifyNewApplicants] = useState(user?.notifyEmailJobs ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.practiceName) setPracticeNameInput(user.practiceName);
      if (user.practiceType) setPracticeTypeInput(user.practiceType);
      if (user.npiNumber) setNpiInput(user.npiNumber);
      if (user.phone) setPhoneInput(user.phone);
      if (user.city) setCityInput(user.city);
      if (user.stateCode) setStateInput(user.stateCode);
      if (user.zipCode) setZipInput(user.zipCode);
      if (user.notifyEmailJobs !== undefined) setNotifyNewApplicants(user.notifyEmailJobs);
    }

    // Load locally posted jobs (both Active and Inactive)
    try {
      const localPosted = JSON.parse(localStorage.getItem('my_posted_jobs') || '[]');
      if (Array.isArray(localPosted) && localPosted.length > 0) {
        const mapped: EmployerJobItem[] = localPosted.map((j: any) => ({
          id: j.id || 'job-1001',
          title: j.title,
          location: j.location || `${cityInput}, ${stateInput}`,
          minHourly: Number(j.min_hourly) || 35,
          maxHourly: Number(j.max_hourly) || 48,
          workType: j.work_type || 'Full-time',
          isFeatured: Boolean(j.is_featured),
          status: j.status === 'Inactive' ? 'Inactive' : 'Active',
          views: j.views || 48,
          applications: j.applications || 3,
          postedDate: j.status === 'Inactive' ? 'Paused / Inactive' : 'Posted Recently',
        }));
        setMyJobs((prev) => {
          const seen = new Set(mapped.map((m) => m.id));
          return [...mapped, ...prev.filter((p) => !seen.has(p.id))];
        });
      }
    } catch {
      // ignore
    }

    // Load live applications from localStorage and Supabase
    async function loadApplications() {
      try {
        const localApps = JSON.parse(localStorage.getItem('my_applied_jobs') || '[]');
        const localMapped = Array.isArray(localApps)
          ? localApps.map((a: any, idx: number) => ({
              id: a.id || `local-app-${idx}`,
              name: a.candidate_name || 'Verified Candidate',
              role: a.job_title || 'Clinical Applicant',
              license: 'Verified Profile',
              experience: 'Experienced',
              desiredPay: a.pay || '$45/hr',
              email: a.candidate_email || 'candidate@email.com',
              phone: a.candidate_phone || '(555) 234-5678',
              resumeFile: a.resume_file || 'Candidate_Resume.pdf',
              isVip: true,
              appliedFor: a.job_title || 'Clinic Opening',
              appliedDate: 'Today',
              status: 'New Applicant',
            }))
          : [];

        const { data } = await supabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        const dbApps =
          data && data.length > 0
            ? data.map((a: any) => ({
                id: a.id,
                name: a.candidate_name || a.full_name || 'Verified Candidate',
                role: a.job_title || 'Clinical Applicant',
                license: a.license_number || 'Active State License',
                experience: a.experience_years || '3+ Years Experience',
                desiredPay: a.desired_pay || '$45/hr',
                email: a.candidate_email || a.email || 'candidate@email.com',
                phone: a.candidate_phone || a.phone || '(555) 019-2831',
                resumeFile: 'Attached_Candidate_CV.pdf',
                isVip: Boolean(a.is_vip),
                appliedFor: a.job_title || `Job #${a.job_id}`,
                appliedDate: 'Recent',
                status: a.status || 'New Applicant',
              }))
            : [];

        if (localMapped.length > 0 || dbApps.length > 0) {
          setApplicants((prev) => {
            const combined = [...localMapped, ...dbApps];
            const seen = new Set(combined.map((d) => d.id));
            return [...combined, ...prev.filter((p) => !seen.has(p.id))];
          });
        }
      } catch {
        // ignore
      }
    }
    loadApplications();
  }, [user]);

  // Persist job changes back to localStorage so homepage & portal stay synced
  const syncJobsToStorage = (updatedJobs: EmployerJobItem[]) => {
    setMyJobs(updatedJobs);
    try {
      const localPosted = JSON.parse(localStorage.getItem('my_posted_jobs') || '[]');
      if (Array.isArray(localPosted)) {
        const synced = localPosted.map((raw: any) => {
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

  const startQuickEdit = (job: EmployerJobItem) => {
    setEditingJobId(job.id);
    setEditTitle(job.title);
    setEditMinPay(job.minHourly);
    setEditMaxPay(job.maxHourly);
    setEditWorkType(job.workType);
  };

  const saveQuickEdit = (id: string) => {
    const updated = myJobs.map((j) =>
      j.id === id
        ? {
            ...j,
            title: editTitle.trim() || j.title,
            minHourly: Number(editMinPay) || j.minHourly,
            maxHourly: Number(editMaxPay) || j.maxHourly,
            workType: editWorkType,
            postedDate: 'Updated Just Now',
          }
        : j
    );
    syncJobsToStorage(updated);
    setEditingJobId(null);
  };

  const handleApplicantStatusChange = (id: string, nextStatus: string) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a)));
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

  const activeJobs = myJobs.filter((j) => j.status === 'Active');
  const inactiveJobs = myJobs.filter((j) => j.status === 'Inactive');

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Clinic Header */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-extrabold text-xl shadow-xs">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {practiceNameInput}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  <ShieldCheck className="w-3 h-3 text-teal-600" /> Employer Portal
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2.5">
                <span className="font-bold text-teal-700">{practiceTypeInput} Clinic</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {cityInput}, {stateInput}
                </span>
                <span>•</span>
                <span className="text-slate-500">{user?.email || 'dr.mitchell@prestonhollowdental.com'}</span>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('active_jobs')}
            className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-400 shadow-xs flex items-center justify-between cursor-pointer transition-all"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Jobs</span>
              <div className="text-2xl font-black text-emerald-700">{activeJobs.length} Open</div>
              <span className="text-[11px] text-slate-500">Visible to job seekers right now</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PlayCircle className="w-6 h-6" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inactive_jobs')}
            className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-400 shadow-xs flex items-center justify-between cursor-pointer transition-all"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Inactive / Closed Jobs</span>
              <div className="text-2xl font-black text-slate-800">{inactiveJobs.length} Paused</div>
              <span className="text-[11px] text-slate-500">Re-open anytime in 1 click</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Archive className="w-6 h-6" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('applicants')}
            className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-400 shadow-xs flex items-center justify-between cursor-pointer transition-all"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Received Applicants</span>
              <div className="text-2xl font-black text-teal-700">{applicants.length} CVs</div>
              <span className="text-[11px] text-slate-500">Direct candidate applications</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </button>
        </div>

        {/* 4-Tab Navigation (Indeed Employer Style) */}
        <div className="bg-white rounded-2xl border border-slate-200 px-4 pt-3 flex gap-4 sm:gap-8 text-xs sm:text-sm font-bold overflow-x-auto">
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
            onClick={() => setActiveTab('settings')}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Clinic Profile & Auto-Fill Settings</span>
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
                <span>Post Another Job</span>
              </Link>
            </div>

            {activeJobs.length > 0 ? (
              activeJobs.map((job) => (
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
                          Hourly Pay: <strong className="text-teal-700">${job.minHourly} – ${job.maxHourly}/hr</strong>
                        </span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.views} Views</span>
                        <span>•</span>
                        <strong className="text-slate-900">{job.applications} Applicants</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => startQuickEdit(job)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Quick Edit Pay / Title</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleJobStatus(job.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pause / Mark Inactive</span>
                      </button>

                      <Link
                        href={`/jobs/${job.id}`}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                      >
                        View Live Job
                      </Link>
                    </div>
                  </div>

                  {/* Inline Quick Edit Drawer (No Repeated Form Filling!) */}
                  {editingJobId === job.id && (
                    <div className="pt-4 border-t border-slate-200 bg-slate-50/80 p-4 rounded-xl space-y-3">
                      <p className="text-xs font-extrabold text-slate-800">
                        Quick Update Job (Changes go live immediately)
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-5">
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Job Title</label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Min $/hr</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={editMinPay}
                            onChange={(e) => setEditMinPay(Number(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                            className={inputClass}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Max $/hr</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={editMaxPay}
                            onChange={(e) => setEditMaxPay(Number(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                            className={inputClass}
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Schedule</label>
                          <select
                            value={editWorkType}
                            onChange={(e) => setEditWorkType(e.target.value)}
                            className={inputClass}
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="PRN / Temp">PRN / Temp</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingJobId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => saveQuickEdit(job.id)}
                          className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer"
                        >
                          Save Update
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3">
                <p className="text-base font-extrabold text-slate-800">No Active Jobs Right Now</p>
                <p className="text-xs text-slate-500">
                  Post a new job or re-open one of your paused jobs from the Inactive Jobs tab.
                </p>
                <Link
                  href="/post-a-job"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post a New Job</span>
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
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-95"
                >
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
                      {job.location} • {job.applications} Past Applicants
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleToggleJobStatus(job.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-xs transition-colors cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Re-Open Job (Make Active)</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-2">
                <p className="text-base font-extrabold text-slate-800">No Inactive or Closed Jobs</p>
                <p className="text-xs text-slate-500">
                  When you pause or fill an active job, it will stay saved here so you can re-open it anytime in 1 click.
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
                Direct Candidate Applications & CVs ({applicants.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review candidate details, update their hiring stage, or contact them directly by phone or email.
              </p>
            </div>

            {applicants.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
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
                    <span>
                      Attached CV: <strong className="text-slate-900">{app.resumeFile}</strong>
                    </span>
                  </p>

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
                    <option value="New Applicant">New Applicant</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Requested">Interview Requested</option>
                    <option value="Hired">Hired</option>
                  </select>

                  <a
                    href={`mailto:${app.email}?subject=Interview Invitation for ${encodeURIComponent(app.appliedFor)} at ${encodeURIComponent(practiceNameInput)}`}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Email Candidate
                  </a>
                  <a
                    href={`tel:${app.phone}`}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: CLINIC PROFILE & AUTO-FILL SETTINGS */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSaveSettings}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl"
          >
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-600" />
                <span>Clinic Profile & Auto-Fill Settings</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Save your clinic details once here. Every time you click <strong>&ldquo;Post a Job&rdquo;</strong>, your clinic name, NPI, specialty, and location will be filled in automatically.
              </p>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emp-clinic-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Clinic / Practice Name
                </label>
                <input
                  id="emp-clinic-name"
                  type="text"
                  value={practiceNameInput}
                  onChange={(e) => setPracticeNameInput(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="emp-clinic-type" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Clinic Specialty
                </label>
                <select
                  id="emp-clinic-type"
                  value={practiceTypeInput}
                  onChange={(e) => setPracticeTypeInput(e.target.value)}
                  className={inputClass}
                >
                  <option value="Dental">Dental Clinic</option>
                  <option value="Family Medicine">Family Medicine / Medical</option>
                  <option value="Vision">Vision / Optometry</option>
                  <option value="Physical Therapy">Physical Therapy</option>
                  <option value="Dermatology & MedSpa">Dermatology & MedSpa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emp-npi" className="block text-xs font-bold text-slate-700 mb-1.5">
                  10-Digit Clinic NPI Number
                </label>
                <input
                  id="emp-npi"
                  type="text"
                  inputMode="numeric"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  maxLength={10}
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
                  type="tel"
                  autoComplete="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="emp-city" className="block text-xs font-bold text-slate-700 mb-1.5">
                  City
                </label>
                <input
                  id="emp-city"
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="emp-state" className="block text-xs font-bold text-slate-700 mb-1.5">
                  State
                </label>
                <select
                  id="emp-state"
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

              <div>
                <label htmlFor="emp-zip" className="block text-xs font-bold text-slate-700 mb-1.5">
                  ZIP Code
                </label>
                <input
                  id="emp-zip"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  className={inputClass}
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
