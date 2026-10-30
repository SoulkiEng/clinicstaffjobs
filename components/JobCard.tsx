'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job } from '@/data/jobs';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Laptop,
  Bookmark,
  CheckCircle2,
  Building2,
  TrendingUp
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  isPinnedFeatured?: boolean;
}

export function formatRelativeTime(isoDate: string): string {
  if (!isoDate) return 'Posted recently';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Posted recently';

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.max(1, Math.floor(diffMs / 60000));
  if (diffMins < 60) return `Posted ${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Posted ${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Posted yesterday';
  if (diffDays < 14) return `Posted ${diffDays}d ago`;
  return `Posted ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

export default function JobCard({ job, isPinnedFeatured = false }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem('saved_clinic_jobs') || '[]');
      setIsSaved(savedIds.includes(job.id));
    } catch {
      // ignore storage error
    }
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
      }
      localStorage.setItem('saved_clinic_jobs', JSON.stringify(updated));
      window.dispatchEvent(new Event('savedJobsUpdated'));
    } catch {
      // ignore
    }
  };

  const categoryStyles: Record<string, { badge: string; avatar: string }> = {
    'Dental': {
      badge: 'bg-teal-50 text-teal-800 border-teal-200',
      avatar: 'bg-teal-600 text-white'
    },
    'Vision': {
      badge: 'bg-sky-50 text-sky-800 border-sky-200',
      avatar: 'bg-sky-600 text-white'
    },
    'Physical Therapy': {
      badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      avatar: 'bg-indigo-600 text-white'
    },
    'Dermatology & MedSpa': {
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
      avatar: 'bg-rose-600 text-white'
    },
    'Family Medicine': {
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      avatar: 'bg-emerald-600 text-white'
    }
  };

  const style = categoryStyles[job.clinicType] || {
    badge: 'bg-slate-100 text-slate-800 border-slate-200',
    avatar: 'bg-slate-700 text-white'
  };

  // Generate clean 2-letter clinic initials
  const initials = job.clinicName
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'CL';

  const relativeTime = formatRelativeTime(job.postedDate);

  return (
    <article
      className={`group relative rounded-xl transition-all duration-150 p-5 bg-white border ${
        isPinnedFeatured
          ? 'border-teal-500/70 bg-gradient-to-r from-white via-white to-teal-50/20 shadow-sm ring-1 ring-teal-500/20'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        {/* Left Column: Avatar + Core Job Info */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Practice Initials Avatar */}
          <div
            className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center font-extrabold text-sm shadow-xs mt-0.5 ${style.avatar}`}
          >
            {initials}
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            {/* Top Meta Row: Specialty, Sponsored/Urgent, Relative Time */}
            <div className="flex flex-wrap items-center gap-2">
              {isPinnedFeatured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/90">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Sponsored Practice</span>
                </span>
              )}

              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${style.badge}`}>
                {job.clinicType}
              </span>

              <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {job.workType}
              </span>

              {job.isUrgent && !isPinnedFeatured && (
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Actively Interviewing
                </span>
              )}

              <span className="text-xs text-slate-400 font-medium ml-auto sm:ml-0">
                • {relativeTime}
              </span>
            </div>

            {/* Job Title */}
            <div>
              <Link
                href={`/jobs/${job.id}`}
                className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug block"
              >
                {job.title}
              </Link>

              {/* Practice Name & Location */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs sm:text-sm text-slate-600">
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {job.clinicName}
                </span>

                {job.verifiedActive && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Direct Employer
                  </span>
                )}

                <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {job.location}
                </span>
              </div>
            </div>

            {/* Clinical Workflow & Software Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {job.appointmentTime && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-900 bg-teal-50/80 px-2 py-0.5 rounded border border-teal-200/70">
                  <Clock className="w-3 h-3 text-teal-700" />
                  {job.appointmentTime}
                </span>
              )}

              {job.softwareUsed.slice(0, 2).map((software, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/90"
                >
                  <Laptop className="w-2.5 h-2.5 text-slate-400" />
                  {software}
                </span>
              ))}

              {job.benefits.slice(0, 2).map((benefit, idx) => (
                <span
                  key={idx}
                  className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/70"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Compensation & Action Buttons */}
        <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
          <div className="sm:text-right">
            <div className="flex items-baseline sm:justify-end gap-0.5">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                ${job.minHourly} – ${job.maxHourly}
              </span>
              <span className="text-xs font-semibold text-slate-500">/hr</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mt-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>{job.payComparison}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSave}
              title={isSaved ? 'Remove from Saved Jobs' : 'Save Job'}
              className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
                isSaved
                  ? 'bg-teal-50 border-teal-300 text-teal-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-teal-600 text-teal-600' : ''}`} />
            </button>

            <Link
              href={`/jobs/${job.id}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              <span>Quick Apply</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
