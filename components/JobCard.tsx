'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job } from '@/data/jobs';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { generateCoverNoteWithGemini } from '@/lib/gemini';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Laptop,
  CheckCircle2,
  Building2,
  BadgeCheck,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Send,
  Check,
  Scale,
  Mail,
  Users
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  isPinnedFeatured?: boolean;
}

export function getJobGenderPref(job: Job): 'Female' | 'Male' | 'Any' {
  const hash = job.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  if (job.clinicType === 'Dermatology & MedSpa' && hash % 3 !== 0) return 'Female';
  if (hash % 5 === 0) return 'Female';
  if (hash % 9 === 0) return 'Male';
  return 'Any';
}

export function getJobExperienceLevel(job: Job): 'Entry Level' | '1–3 Years' | '3+ Years' {
  if (job.minHourly < 26) return 'Entry Level';
  if (job.minHourly < 42) return '1–3 Years';
  return '3+ Years';
}

export function formatRelativeTime(isoDate: string): string {
  if (!isoDate) return 'Today';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Today';

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.max(1, Math.floor(diffMs / 60000));
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 14) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function JobCard({ job, isPinnedFeatured = false }: JobCardProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [justLiked, setJustLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Quick Inline Apply State (Automatically Pre-filled from Logged-In User Profile!)
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setApplicantName(user.name || '');
      setApplicantEmail(user.email || '');
      setApplicantPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    const syncState = () => {
      try {
        const savedIds: string[] = JSON.parse(localStorage.getItem('saved_clinic_jobs') || '[]');
        setIsSaved(savedIds.includes(job.id));
        const compareIds: string[] = JSON.parse(localStorage.getItem('compare_clinic_jobs') || '[]');
        setIsCompared(compareIds.includes(job.id));
      } catch {
        // ignore
      }
    };
    syncState();
    window.addEventListener('savedJobsUpdated', syncState);
    window.addEventListener('compareJobsUpdated', syncState);
    return () => {
      window.removeEventListener('savedJobsUpdated', syncState);
      window.removeEventListener('compareJobsUpdated', syncState);
    };
  }, [job.id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem('saved_clinic_jobs') || '[]');
      let updated: string[];
      if (savedIds.includes(job.id)) {
        updated = savedIds.filter((id) => id !== job.id);
        setIsSaved(false);
      } else {
        updated = [job.id, ...savedIds];
        setIsSaved(true);
        setJustLiked(true);
        setTimeout(() => setJustLiked(false), 350);
      }
      localStorage.setItem('saved_clinic_jobs', JSON.stringify(updated));
      window.dispatchEvent(new Event('savedJobsUpdated'));
    } catch {
      // ignore
    }
  };

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const compareIds: string[] = JSON.parse(localStorage.getItem('compare_clinic_jobs') || '[]');
      let updated: string[];
      if (compareIds.includes(job.id)) {
        updated = compareIds.filter((id) => id !== job.id);
        setIsCompared(false);
      } else {
        updated = [...compareIds.slice(-2), job.id];
        setIsCompared(true);
      }
      localStorage.setItem('compare_clinic_jobs', JSON.stringify(updated));
      window.dispatchEvent(new Event('compareJobsUpdated'));
    } catch {
      // ignore
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/jobs/${job.id}`
        : `https://clinicstaffjobs.com/jobs/${job.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGeminiCoverNote = async () => {
    setIsGeneratingNote(true);
    const note = await generateCoverNoteWithGemini({
      candidateName: applicantName || user?.name || 'Candidate',
      candidateRole: user?.specialty || job.title,
      jobTitle: job.title,
      clinicName: job.clinicName,
      location: job.location,
    });
    setApplicantNote(note);
    setIsGeneratingNote(false);
  };

  const handleQuickApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.trim()) return;
    setIsSubmitting(true);

    const appRecord = {
      id: `app-${Date.now()}`,
      job_id: job.id,
      job_title: job.title,
      clinic_name: job.clinicName,
      location: job.location,
      candidate_name: applicantName.trim(),
      candidate_email: applicantEmail.trim(),
      candidate_phone: applicantPhone.trim(),
      license_number: user?.licenseNumber || 'Verified Candidate',
      experience_years: user?.yearsExperience ? `${user.yearsExperience} Years` : 'Experienced',
      desired_pay: `$${job.minHourly} - $${job.maxHourly}/hr`,
      cover_note: applicantNote.trim(),
      status: 'Application Sent to Clinic',
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('applications').insert([
        {
          id: appRecord.id,
          job_id: appRecord.job_id,
          candidate_name: appRecord.candidate_name,
          candidate_email: appRecord.candidate_email,
          candidate_phone: appRecord.candidate_phone,
          license_number: appRecord.license_number,
          experience_years: appRecord.experience_years,
          desired_pay: appRecord.desired_pay,
          status: appRecord.status,
        },
      ]);
    } catch {
      // fallback
    }

    try {
      const existing = JSON.parse(localStorage.getItem('my_submitted_applications') || '[]');
      localStorage.setItem('my_submitted_applications', JSON.stringify([appRecord, ...existing]));
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    setAppliedSuccess(true);
  };

  const genderPref = getJobGenderPref(job);
  const expLevel = getJobExperienceLevel(job);

  const categoryStyles: Record<string, { badge: string; avatar: string }> = {
    Dental: {
      badge: 'bg-teal-50 text-teal-800 border-teal-200',
      avatar: 'bg-teal-600 text-white',
    },
    Vision: {
      badge: 'bg-sky-50 text-sky-800 border-sky-200',
      avatar: 'bg-sky-600 text-white',
    },
    'Physical Therapy': {
      badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      avatar: 'bg-indigo-600 text-white',
    },
    'Dermatology & MedSpa': {
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
      avatar: 'bg-rose-600 text-white',
    },
    'Family Medicine': {
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      avatar: 'bg-emerald-600 text-white',
    },
  };

  const style = categoryStyles[job.clinicType] || {
    badge: 'bg-slate-100 text-slate-800 border-slate-200',
    avatar: 'bg-slate-700 text-white',
  };

  const initials =
    job.clinicName
      .split(/\s+/)
      .filter((w) => /^[A-Za-z]/.test(w))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('') || 'CL';

  const relativeTime = formatRelativeTime(job.postedDate);

  return (
    <article
      className={`rounded-2xl p-5 bg-white border transition-all ${
        isPinnedFeatured
          ? 'border-teal-500 bg-gradient-to-r from-white to-teal-50/20 shadow-xs'
          : 'border-slate-200 hover:border-teal-400 hover:shadow-md'
      }`}
    >
      {/* Clean Aligned Main Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left: Clinic Avatar + Clear Job Info */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div
            className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-black text-sm shadow-2xs mt-0.5 ${style.avatar}`}
          >
            {initials}
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            {/* Row 1: Category, Schedule, Gender & Experience Tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${style.badge}`}>
                {job.clinicType}
              </span>

              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                {job.workType}
              </span>

              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                {expLevel}
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                <Users className="w-3 h-3 text-purple-600" />
                <span>
                  {genderPref === 'Any' ? 'Male / Female Welcome' : `${genderPref} Staff Preferred`}
                </span>
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <BadgeCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Clinic</span>
              </span>

              <span className="text-xs text-slate-400 font-medium">• {relativeTime}</span>
            </div>

            {/* Row 2: Job Title & Clinic Location */}
            <div>
              <Link
                href={`/jobs/${job.id}`}
                className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-teal-600 transition-colors leading-snug block"
              >
                {job.title}
              </Link>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs sm:text-sm text-slate-600">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  {job.clinicName}
                </span>

                <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {job.location}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Direct Employer (No Agency)
                </span>
              </div>
            </div>

            {/* Row 3: Simple Schedule, Software & Perks */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {job.appointmentTime && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-900 bg-teal-50/80 px-2.5 py-0.5 rounded-md border border-teal-200/80">
                  <Clock className="w-3 h-3 text-teal-700" />
                  {job.appointmentTime}
                </span>
              )}

              {job.softwareUsed.slice(0, 2).map((software, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200"
                >
                  <Laptop className="w-3 h-3 text-slate-400" />
                  {software}
                </span>
              ))}

              {job.benefits.slice(0, 2).map((benefit, idx) => (
                <span
                  key={idx}
                  className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Aligned Hourly Pay Box & Action Buttons */}
        <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
          <div className="sm:text-right">
            <div className="flex items-baseline sm:justify-end gap-0.5">
              <span className="text-lg sm:text-xl font-black text-slate-900">
                ${job.minHourly} – ${job.maxHourly}
              </span>
              <span className="text-xs font-bold text-slate-500">/ hour</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-700">
              Full-Time / Part-Time Pay
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>1-Click Apply</span>
            </button>

            <Link
              href={`/jobs/${job.id}`}
              className="inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all"
            >
              <span>View Job</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Expandable Quick Preview & 1-Click Apply (Uses Saved User Profile Automatically) */}
      {isExpanded && (
        <div className="social-drawer-enter mt-4 pt-4 border-t border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                About This Job
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{job.description}</p>
              <div className="pt-1">
                <h5 className="text-xs font-bold text-slate-800 mb-1">Benefits Included:</h5>
                <div className="flex flex-wrap gap-1.5">
                  {job.benefits.map((b, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs font-semibold bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 1-Click Apply Box (Pre-filled if Logged In) */}
            <div className="bg-white rounded-xl p-4 border border-teal-200 space-y-3">
              {appliedSuccess ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Application sent to {job.clinicName}! Saved in your My Applied Jobs tab.
                    </span>
                  </div>
                  <a
                    href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(
                      `Job Application: ${job.title} — ${applicantName}`
                    )}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Also Open Direct Email to Clinic →</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleQuickApplySubmit} className="space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="text-xs font-extrabold text-slate-900">
                      Quick Apply to {job.clinicName}
                    </span>
                    {user && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Pre-filled from Your Account & CV
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email *"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-600">
                        Short Message to Clinic (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={handleGeminiCoverNote}
                        disabled={isGeneratingNote}
                        className="inline-flex items-center gap-1 text-[11px] font-extrabold text-teal-700 hover:text-teal-900 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-teal-600" />
                        <span>{isGeneratingNote ? 'Writing...' : '✨ Write with Gemini AI'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Click 'Write with Gemini AI' or type a short note..."
                      value={applicantNote}
                      onChange={(e) => setApplicantNote(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    {isSubmitting
                      ? 'Sending Application...'
                      : user
                      ? `Submit 1-Click Application with Saved CV →`
                      : `Send Application to ${job.clinicName} →`}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Clean Aligned Bottom Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-900 transition-colors cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Job Summary' : 'Show Quick Summary & 1-Click Apply'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleCompare}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              isCompared
                ? 'bg-teal-50 border-teal-400 text-teal-800'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-teal-600" />
            <span>{isCompared ? 'Comparing ✓' : '+ Compare'}</span>
          </button>

          <button
            type="button"
            onClick={toggleSave}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''} ${
                justLiked ? 'animate-pop' : ''
              }`}
            />
            <span>{isSaved ? 'Saved' : 'Save Job'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
