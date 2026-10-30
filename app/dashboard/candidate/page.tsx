'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ALL_JOBS, Job } from '@/data/jobs';
import {
  User,
  MapPin,
  DollarSign,
  CheckCircle2,
  Upload,
  LogOut,
  ShieldCheck,
  Flame,
  Trash2
} from 'lucide-react';

export default function CandidateDashboardPage() {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'applications'>('profile');

  // Candidate Profile State
  const [name, setName] = useState(user?.name || 'Jessica Taylor, RDH');
  const [specialty, setSpecialty] = useState(user?.specialty || 'Registered Dental Hygienist (RDH)');
  const [license, setLicense] = useState(user?.licenseNumber || 'TX-DH-94821');
  const [desiredPay, setDesiredPay] = useState(user?.desiredHourly || 48);
  const [phone, setPhone] = useState(user?.phone || '(214) 555-8932');
  const [savedSuccess, setSavedSuccess] = useState(false);

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
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 'app-seed-2',
      job_id: 'job-1005',
      title: 'Dental Hygienist (RDH) - Mon–Thu Schedule',
      clinicName: 'Highland Park Smile Collective',
      location: 'Dallas, TX',
      appliedDate: '3 Days Ago',
      pay: '$46 - $54/hr',
      status: 'Application Viewed by Doctor',
      statusColor: 'bg-teal-50 text-teal-800 border-teal-200'
    }
  ]);

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.specialty) setSpecialty(user.specialty);
      if (user.licenseNumber) setLicense(user.licenseNumber);
      if (user.desiredHourly) setDesiredPay(user.desiredHourly);
      if (user.phone) setPhone(user.phone);
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

    // Load submitted applications from localStorage
    try {
      const localApps = JSON.parse(localStorage.getItem('my_submitted_applications') || '[]');
      if (Array.isArray(localApps) && localApps.length > 0) {
        const mapped = localApps.map((a: any) => ({
          id: a.id,
          job_id: a.job_id || 'job-1001',
          title: a.job_title || 'Clinical Position',
          clinicName: a.clinic_name || 'Private Practice',
          location: 'Verified Clinic',
          appliedDate: 'Just now',
          pay: a.desired_pay || '$45/hr',
          status: a.status || 'Submitted to Doctor',
          statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }));
        setApplications((prev) => [...mapped, ...prev]);
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
    } catch {
      // ignore
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      specialty,
      licenseNumber: license,
      desiredHourly: Number(desiredPay),
      phone
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium';

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Candidate Top Profile Header */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-extrabold text-xl shadow-xs">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified License
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-3">
                <span className="font-semibold text-teal-700">{specialty}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {user?.location || 'Dallas, TX'}
                </span>
                <span>•</span>
                <span className="text-slate-500">{user?.email || 'jessica.rdh@gmail.com'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/salary-calculator"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-colors"
            >
              <DollarSign className="w-4 h-4 text-teal-600" />
              <span>Check City Wage Benchmark</span>
            </Link>

            <button
              onClick={logout}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'profile'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Healthcare Profile
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'applications'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>My Applications ({applications.length})</span>
            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">Active</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'saved'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Saved Openings ({savedJobs.length})
          </button>
        </div>

        {/* Tab 1: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleSaveProfile}
              className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs"
            >
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Clinical Credentials & Pay Preferences
              </h3>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Your candidate profile was saved and synced to the database!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Specialty / Role
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    State License # (Optional)
                  </label>
                  <input
                    type="text"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    placeholder="e.g. TX-DH-94821"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Desired Hourly Wage ($/hr)
                  </label>
                  <input
                    type="number"
                    value={desiredPay}
                    onChange={(e) => setDesiredPay(Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mobile Number (for SMS & WhatsApp Job Alerts)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Clinical Resume (PDF)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-teal-500 cursor-pointer transition-colors bg-slate-50">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-slate-700">
                    {name.replace(/\s+/g, '_')}_Resume.pdf
                  </p>
                  <p className="text-[11px] text-slate-500">Verified clinical resume ready for 1-click apply</p>
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                Save Candidate Profile
              </button>
            </form>

            {/* Right Card: Candidate Status */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-400 uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Direct Clinician Protection</span>
                </div>
                <h4 className="text-lg font-bold text-white">Verified License Priority</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your clinical credentials are highlighted directly to private practice hiring doctors—your resume never goes into a staffing agency spam pool.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" /> 2026 Market Rate Note
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Independent practices in your metro are offering strong hourly premiums for licensed staff. Your target rate of <strong>${desiredPay}/hr</strong> is competitive with top private clinics.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: My Applications */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${app.statusColor}`}>
                      ● {app.status}
                    </span>
                    <span className="text-xs text-slate-400">Applied {app.appliedDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{app.title}</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="font-medium text-slate-800">{app.clinicName}</span>
                    <span>•</span>
                    <span>{app.location}</span>
                    <span>•</span>
                    <span className="text-teal-700 font-bold">{app.pay}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/jobs/${app.job_id || 'job-1001'}`}
                    className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                  >
                    View Practice Post
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Saved Jobs */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
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
                    <span className="text-xs text-slate-500">{job.appointmentTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="font-medium text-slate-800">{job.clinicName}</span>
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
                    className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
