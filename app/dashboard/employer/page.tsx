'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
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
  Edit3,
  Settings,
  ShieldCheck,
  LogOut
} from 'lucide-react';

export default function EmployerDashboardPage() {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'applicants' | 'settings'>('listings');

  // Simulated practice jobs
  const [myJobs, setMyJobs] = useState([
    {
      id: 'emp-job-1',
      title: 'Registered Dental Hygienist (RDH) - 60 Min Slots',
      location: 'Dallas, TX',
      minHourly: 46,
      maxHourly: 52,
      isFeatured: true,
      status: 'Active',
      views: 248,
      applications: 8,
      postedDate: 'Oct 26, 2026'
    },
    {
      id: 'emp-job-2',
      title: 'Dental Assistant (RDA) - Cosmetic Chairside',
      location: 'Dallas, TX',
      minHourly: 25,
      maxHourly: 29,
      isFeatured: false,
      status: 'Active',
      views: 124,
      applications: 6,
      postedDate: 'Oct 27, 2026'
    }
  ]);

  // Simulated applicants
  const [applicants, setApplicants] = useState([
    {
      id: 'app-1',
      name: 'Jessica Taylor, RDH',
      role: 'Registered Dental Hygienist',
      license: 'Active TX License #94821',
      experience: '4 Years Clinical',
      desiredPay: '$48/hr',
      email: 'jessica.rdh@gmail.com',
      phone: '(214) 555-8932',
      isVip: true,
      appliedFor: 'Registered Dental Hygienist (RDH)',
      appliedDate: 'Yesterday',
      status: 'Interview Requested'
    },
    {
      id: 'app-2',
      name: 'Michael Chen, RDA',
      role: 'Lead Dental Assistant',
      license: 'Nitrous & Radiology Certified',
      experience: '3 Years Chairside',
      desiredPay: '$27/hr',
      email: 'mchen.rda@outlook.com',
      phone: '(214) 555-4421',
      isVip: false,
      appliedFor: 'Dental Assistant (RDA)',
      appliedDate: '2 Days Ago',
      status: 'Under Review'
    }
  ]);

  const [phoneInput, setPhoneInput] = useState(user?.phone || '(214) 555-0192');
  const [locationInput, setLocationInput] = useState(user?.location || 'Dallas, TX');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ phone: phoneInput, location: locationInput });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleMarkFilled = (id: string) => {
    setMyJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: j.status === 'Filled' ? 'Active' : 'Filled' } : j))
    );
  };

  const handleUpgradeFeatured = (id: string) => {
    setMyJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, isFeatured: true } : j))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Practice Top Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-extrabold text-xl shadow-sm">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {user?.practiceName || 'Preston Hollow Dental Studio'}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  <ShieldCheck className="w-3 h-3 text-teal-600" /> Verified Practice
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-3">
                <span>{user?.name || 'Dr. Sarah Mitchell, DDS'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {user?.location || 'Dallas, TX'}
                </span>
                <span>•</span>
                <span className="text-slate-400">{user?.email || 'practice@clinic.com'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/post-a-job"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Post New Opening ($99)</span>
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

        {/* Analytics Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Openings</span>
              <div className="text-2xl font-black text-slate-900">
                {myJobs.filter((j) => j.status === 'Active').length} Positions
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Candidate Views</span>
              <div className="text-2xl font-black text-slate-900">372 Views</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Applications Received</span>
              <div className="text-2xl font-black text-emerald-800">14 Verified</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex gap-4 text-sm font-bold">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'listings'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Job Listings ({myJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applicants')}
            className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'applicants'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Applicant Inquiries ({applicants.length})</span>
            <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded-full text-[10px]">NEW</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'settings'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Practice Profile Settings
          </button>
        </div>

        {/* Tab 1: My Listings */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            {myJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        job.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      ● {job.status}
                    </span>

                    {job.isFeatured && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        <Sparkles className="w-3 h-3 text-amber-500" /> FEATURED PINNED
                      </span>
                    )}

                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Posted {job.postedDate}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                  <p className="text-xs text-slate-600">
                    Pay: <strong className="text-teal-700">${job.minHourly} - ${job.maxHourly}/hr</strong> •{' '}
                    {job.views} Views • <strong className="text-slate-900">{job.applications} Applicants</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {!job.isFeatured && (
                    <button
                      onClick={() => handleUpgradeFeatured(job.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors"
                    >
                      ⚡ Upgrade to Featured ($99)
                    </button>
                  )}

                  <button
                    onClick={() => handleMarkFilled(job.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                  >
                    {job.status === 'Filled' ? 'Reopen Position' : 'Mark as Filled'}
                  </button>

                  <Link
                    href={`/jobs/${job.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                  >
                    View Live Post
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Applicant Inquiries */}
        {activeTab === 'applicants' && (
          <div className="space-y-4">
            {applicants.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{app.name}</h3>
                    {app.isVip && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Sparkles className="w-3 h-3 text-amber-600" /> VIP Priority Applicant
                      </span>
                    )}
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                      Applied for: {app.appliedFor}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Credentials: <strong className="text-slate-800">{app.license}</strong></span>
                    <span>Experience: <strong className="text-slate-800">{app.experience}</strong></span>
                    <span>Target Pay: <strong className="text-teal-700">{app.desiredPay}</strong></span>
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {app.email}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {app.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${app.email}?subject=Interview Invitation for ${encodeURIComponent(app.appliedFor)} at ${encodeURIComponent(user?.practiceName || 'Clinic')}`}
                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Contact Candidate
                  </a>
                  <button
                    onClick={() => alert(`Opening verified resume for ${app.name}`)}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Resume</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Practice Settings */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSaveSettings}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm max-w-2xl"
          >
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-teal-600" />
              <span>Practice Profile & Verification</span>
            </h3>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Practice profile updated successfully!</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Practice Name
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.practiceName || 'Preston Hollow Dental Studio'}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Office Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Metro Location
                </label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Save Practice Profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
