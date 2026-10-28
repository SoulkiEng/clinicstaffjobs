import React from 'react';
import Link from 'next/link';
import { Job } from '@/data/jobs';
import { MapPin, DollarSign, Clock, ShieldCheck, Flame, Sparkles, ArrowRight, Laptop } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const categoryColors: Record<string, string> = {
    'Dental': 'bg-teal-50 text-teal-800 border-teal-200',
    'Vision': 'bg-cyan-50 text-cyan-800 border-cyan-200',
    'Physical Therapy': 'bg-indigo-50 text-indigo-800 border-indigo-200',
    'Dermatology & MedSpa': 'bg-rose-50 text-rose-800 border-rose-200',
    'Family Medicine': 'bg-emerald-50 text-emerald-800 border-emerald-200'
  };

  const badgeClass = categoryColors[job.clinicType] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <div
      className={`group relative rounded-xl transition-all duration-200 p-5 sm:p-6 bg-white border ${
        job.isFeatured
          ? 'border-amber-400/80 shadow-md shadow-amber-500/5 ring-1 ring-amber-400/30'
          : 'border-slate-200/90 hover:border-teal-300 hover:shadow-md'
      }`}
    >
      {/* Featured Ribbon */}
      {job.isFeatured && (
        <div className="absolute -top-3 left-6 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold shadow-sm">
          <Sparkles className="w-3 h-3" />
          <span>FEATURED CLINIC</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Job Info */}
        <div className="space-y-2 flex-1">
          {/* Tags Header */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${badgeClass}`}>
              {job.clinicType}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              <MapPin className="w-3 h-3 text-slate-600" />
              {job.location}
            </span>

            {job.appointmentTime && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                <Clock className="w-3 h-3 text-emerald-700" />
                {job.appointmentTime}
              </span>
            )}

            {job.verifiedActive && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3 h-3 text-teal-700" />
                Verified Practice
              </span>
            )}
          </div>

          {/* Job Title & Clinic Name */}
          <div>
            <Link
              href={`/jobs/${job.id}`}
              className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors inline-block"
            >
              {job.title}
            </Link>
            <p className="text-sm font-medium text-slate-700 flex items-center gap-2 mt-0.5">
              <span>{job.clinicName}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 text-xs">{job.workType}</span>
            </p>
          </div>

          {/* Software used badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 mr-1">
              <Laptop className="w-3 h-3" /> Stack:
            </span>
            {job.softwareUsed.slice(0, 3).map((software, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-slate-700 bg-slate-100/90 px-2 py-0.5 rounded border border-slate-200"
              >
                {software}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Compensation & CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 gap-3">
          <div className="lg:text-right">
            <div className="flex items-baseline gap-1 text-slate-900">
              <span className="text-2xl font-extrabold tracking-tight text-teal-700">
                ${job.minHourly} - ${job.maxHourly}
              </span>
              <span className="text-xs font-semibold text-slate-600">/hr</span>
            </div>

            {/* Pay Gauge Badge */}
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full mt-1">
              <Flame className="w-3 h-3 text-emerald-700" />
              <span>{job.payComparison}</span>
            </div>
          </div>

          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-teal-600 text-white text-sm font-semibold transition-all group-hover:shadow-sm"
          >
            <span>View & Apply</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
