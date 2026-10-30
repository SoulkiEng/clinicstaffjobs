'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ALL_JOBS, Job } from '@/data/jobs';
import { supabase } from '@/lib/supabase';
import DirectApplyBox from '@/components/DirectApplyBox';
import GeminiJobInsightsCard from '@/components/GeminiJobInsightsCard';
import { getJobGenderPref, getJobExperienceLevel } from '@/components/JobCard';
import {
  MapPin,
  Clock,
  TrendingUp,
  Laptop,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Building2,
  BadgeCheck,
  Lock,
  Users
} from 'lucide-react';

function mapRawToJob(raw: any): Job & { genderPref?: string; experienceLevel?: string } {
  return {
    id: raw.id,
    title: raw.title,
    clinicName: raw.clinic_name || raw.clinicName || 'Verified Private Clinic',
    clinicType: raw.clinic_type || raw.clinicType || 'Dental',
    location: raw.location || `${raw.city || 'Dallas'}, ${raw.state || 'TX'}`,
    city: raw.city || 'Dallas',
    state: raw.state || 'TX',
    zipCode: raw.zip_code || raw.zipCode || '75225',
    workType: raw.work_type || raw.workType || 'Full-time',
    minHourly: Number(raw.min_hourly || raw.minHourly || 40),
    maxHourly: Number(raw.max_hourly || raw.maxHourly || 52),
    payPeriod: 'hour',
    payComparison: raw.pay_comparison || raw.payComparison || '+15% Above City Avg',
    isFeatured: Boolean(raw.is_featured ?? raw.isFeatured),
    isUrgent: Boolean(raw.is_urgent ?? raw.isUrgent),
    verifiedActive: true,
    npiNumber: raw.npi_number || raw.npiNumber || '',
    appointmentTime: raw.appointment_time || raw.appointmentTime || 'Regular Weekday Schedule',
    softwareUsed: Array.isArray(raw.software_used)
      ? raw.software_used
      : Array.isArray(raw.softwareUsed)
      ? raw.softwareUsed
      : ['Digital Clinic Software'],
    benefits: Array.isArray(raw.benefits)
      ? raw.benefits
      : ['Paid Time Off (PTO)', 'Health & Dental Coverage', '401(k) Match'],
    description:
      raw.description ||
      'Private clinic seeking a reliable, licensed healthcare professional. Friendly team environment and competitive hourly pay.',
    responsibilities: Array.isArray(raw.responsibilities)
      ? raw.responsibilities
      : [
          'Provide welcoming, high-quality care to patients',
          'Update digital patient charts accurately',
          'Work closely with the doctor and clinical team',
        ],
    qualifications: Array.isArray(raw.qualifications)
      ? raw.qualifications
      : ['Active state license or certification', 'Friendly communication and teamwork skills'],
    applyEmail: raw.apply_email || raw.applyEmail || 'hiring@clinicstaffjobs.com',
    applyUrl: '',
    postedDate: raw.created_at || raw.postedDate || new Date().toISOString(),
    genderPref: raw.gender_pref || raw.genderPref,
    experienceLevel: raw.experience_level || raw.experienceLevel,
  };
}

export default function DynamicJobViewPage() {
  const [job, setJob] = useState<(Job & { genderPref?: string; experienceLevel?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJob() {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id') || '';

      // 1. Check localStorage my_posted_jobs first
      try {
        const localRaw = JSON.parse(localStorage.getItem('my_posted_jobs') || '[]');
        if (Array.isArray(localRaw)) {
          const foundLocal = localRaw.find((r: any) => r.id === id);
          if (foundLocal) {
            setJob(mapRawToJob(foundLocal));
            setLoading(false);
            return;
          }
        }
      } catch {
        // ignore
      }

      // 2. Check static ALL_JOBS
      const foundStatic = ALL_JOBS.find((j) => j.id === id);
      if (foundStatic) {
        setJob(foundStatic);
        setLoading(false);
        return;
      }

      // 3. Check Supabase jobs table
      if (id) {
        try {
          const { data } = await supabase.from('jobs').select('*').eq('id', id).maybeSingle();
          if (data) {
            setJob(mapRawToJob(data));
            setLoading(false);
            return;
          }
        } catch {
          // ignore
        }
      }

      setJob(ALL_JOBS[0]);
      setLoading(false);
    }

    loadJob();
  }, []);

  if (loading || !job) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-base font-extrabold text-slate-900">Loading Job Opening...</p>
          <p className="text-xs text-slate-500">Fetching clinic details and application form.</p>
        </div>
      </div>
    );
  }

  const genderPref = job.genderPref || getJobGenderPref(job);
  const expLevel = job.experienceLevel || getJobExperienceLevel(job);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Clinic Jobs</span>
          </Link>

          <Link
            href="/dashboard/employer"
            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
          >
            Employer Portal →
          </Link>
        </div>

        {/* Main Job Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  {job.clinicType} Clinic
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
                  {job.workType}
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
                  {expLevel}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                  <Users className="w-3 h-3 text-purple-600" />
                  <span>{genderPref === 'Any' ? 'Male / Female Welcome' : `${genderPref} Staff Preferred`}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2.5 text-sm font-semibold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  {job.clinicName}
                </span>
                <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location} ({job.zipCode})
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Clinic
                </span>
              </div>
            </div>

            {/* Pay Highlight */}
            <div className="sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-xl border sm:border-0 border-slate-200 shrink-0">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                ${job.minHourly} – ${job.maxHourly}
                <span className="text-sm font-semibold text-slate-500">/hr</span>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 mt-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>{job.payComparison}</span>
              </div>
            </div>
          </div>

          {/* Key Job Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" /> Patient Schedule
              </span>
              <p className="text-sm font-bold text-slate-900">{job.appointmentTime || '1-on-1 Patient Care'}</p>
              <p className="text-[11px] text-slate-500">Unrushed clinic schedule</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                <Laptop className="w-3.5 h-3.5 text-slate-600" /> Clinic Software
              </span>
              <p className="text-sm font-bold text-slate-900">{job.softwareUsed.join(', ')}</p>
              <p className="text-[11px] text-slate-500">Digital charting & imaging</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Top Benefit
              </span>
              <p className="text-sm font-bold text-slate-900">{job.benefits[0] || 'Full Clinic Benefits'}</p>
              <p className="text-[11px] text-slate-500">Full benefits listed below</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-teal-950">
            <div className="flex items-center gap-2 font-semibold">
              <Lock className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                <strong>Direct Application:</strong> Your CV goes straight to {job.clinicName} and is never shared with outside agencies.
              </span>
            </div>
          </div>
        </div>

        {/* Gemini AI Salary & Interview Coach Card */}
        <GeminiJobInsightsCard job={job} />

        {/* Full Role Description */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">About the Clinic & Job</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          <div className="pt-5 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Daily Responsibilities</h2>
            <ul className="space-y-2.5">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-5 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Requirements & Qualifications</h2>
            <ul className="space-y-2.5">
              {job.qualifications.map((qual, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{qual}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-5 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Pay & Benefits</h2>
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((benefit, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-900 border border-teal-200/80"
                >
                  ✓ {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Account-Gated Application Box */}
        <DirectApplyBox job={job} />
      </div>
    </div>
  );
}
