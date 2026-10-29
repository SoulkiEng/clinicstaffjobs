'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Bookmark,
  Send,
  Bell,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  Upload,
  LogOut,
  ShieldCheck,
  Building2,
  Flame
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

  // Saved Jobs
  const [savedJobs, setSavedJobs] = useState([
    {
      id: 'job-1',
      title: 'Registered Dental Hygienist (RDH) - 60 Min Slots',
      clinicName: 'Preston Hollow Dental Studio',
      location: 'Dallas, TX',
      minHourly: 46,
      maxHourly: 52,
      payComparison: '+16% Above Dallas Avg',
      appointmentTime: '60-Min Adult Prophy Slots'
    },
    {
      id: 'job-3',
      title: 'Lead Dental Assistant (RDA) - Cosmetic & Implants',
      clinicName: 'Biscayne Bay Esthetic Dentistry',
      location: 'Miami, FL',
      minHourly: 27,
      maxHourly: 33,
      payComparison: '+18% Above Miami Avg',
      appointmentTime: 'Dedicated 1:1 Chairside'
    }
  ]);

  // Applied Jobs
  const [applications, setApplications] = useState([
    {
      id: 'app-1',
      title: 'Registered Dental Hygienist (RDH)',
      clinicName: 'Preston Hollow Dental Studio',
      location: 'Dallas, TX',
      appliedDate: 'Yesterday',
      pay: '$46 - $52/hr',
      status: 'Interview Requested',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 'app-2',
      title: 'Dental Hygienist (Part-time)',
      clinicName: 'Dallas Cosmetic Smiles',
      location: 'Dallas, TX',
      appliedDate: '3 Days Ago',
      pay: '$45 - $50/hr',
      status: 'Application Viewed by Doctor',
      statusColor: 'bg-teal-50 text-teal-800 border-teal-200'
    }
  ]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      specialty,
      licenseNumber: license,
      desiredHourly: Number(desiredPay),
      phone
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Candidate Top Profile Header */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-extrabold text-xl shadow-sm">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {user?.name || 'Jessica Taylor, RDH'}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified License
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-3">
                <span className="font-semibold text-teal-700">{user?.specialty || 'Registered Dental Hygienist'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {user?.location || 'Dallas, TX'}
                </span>
                <span>•</span>
                <span className="text-slate-400">{user?.email || 'jessica.rdh@gmail.com'}</span>
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
              className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Clinical Credentials & Preferences
              </h3>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Your candidate profile was saved successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Specialty / Role
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    State License # (Optional)
                  </label>
                  <input
                    type="text"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    placeholder="e.g. TX-DH-94821"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Desired Hourly Wage ($/hr)
                  </label>
                  <input
                    type="number"
                    value={desiredPay}
                    onChange={(e) => setDesiredPay(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Mobile Number (for SMS & WhatsApp Alerts)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Resume Upload Box */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Clinical Resume (PDF)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-teal-500 cursor-pointer transition-colors bg-slate-50">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-slate-700">
                    Jessica_Taylor_RDH_Resume.pdf
                  </p>
                  <p className="text-[11px] text-slate-400">Click to upload new PDF (Max 5MB)</p>
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Save Candidate Profile
              </button>
            </form>

            {/* Right Card: VIP Fast-Track Status */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-6 rounded-2xl border border-teal-800/40 shadow-xl space-y-3">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-teal-900/60 px-2.5 py-0.5 rounded border border-teal-700/50 uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>VIP Candidate Status</span>
                </div>
                <h4 className="text-lg font-bold text-white">Verified Fast-Track Priority</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your credentials are automatically flagged as "Verified License" to practice hiring doctors, pushing your application to the top of review queues.
                </p>
                <div className="pt-2 text-xs text-teal-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Active 24-Hour Early Access to High-Paying Jobs</span>
                </div>
              </div>

              {/* Wage Tip Box */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" /> Negotiation Tip
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Private practices in Dallas are paying $48–$54/hr for experienced RDHs with nitrous certifications. Your current rate of ${desiredPay}/hr matches the upper 15th percentile!
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
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
                    href="/jobs/job-1"
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
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
                    <span className="text-teal-700 font-bold">${job.minHourly} - ${job.maxHourly}/hr</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
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
