import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SEED_JOBS } from '@/data/jobs';
import { generateJobPostingSchema } from '@/lib/schema';
import {
  MapPin,
  Clock,
  DollarSign,
  ShieldCheck,
  Flame,
  Laptop,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Mail,
  ExternalLink,
  HeartHandshake
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = SEED_JOBS.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  const schemaData = generateJobPostingSchema(job);

  return (
    <>
      {/* Inject Google for Jobs Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Openings</span>
          </Link>

          {/* Main Job Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                    {job.clinicType} Practice
                  </span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location} ({job.zipCode})
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {job.workType}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {job.title}
                </h1>

                <p className="text-base font-semibold text-teal-800 flex items-center gap-2">
                  <span>{job.clinicName}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Verified Independent Clinic
                  </span>
                </p>
              </div>

              {/* Compensation Highlight */}
              <div className="sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-xl">
                <div className="text-3xl font-black text-slate-900 text-teal-700">
                  ${job.minHourly} - ${job.maxHourly}
                  <span className="text-sm font-semibold text-slate-500">/hr</span>
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full mt-1.5">
                  <Flame className="w-3 h-3 text-emerald-600" />
                  <span>{job.payComparison}</span>
                </div>
              </div>
            </div>

            {/* Clinic Culture & Vibe Breakdown Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" /> Pace & Appointment Time
                </span>
                <p className="text-sm font-extrabold text-slate-900">{job.appointmentTime || '1-on-1 Patient Flow'}</p>
                <p className="text-[11px] text-slate-500">No rushed assembly-line scheduling</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Laptop className="w-3.5 h-3.5 text-slate-600" /> Practice Software
                </span>
                <p className="text-sm font-extrabold text-slate-900">{job.softwareUsed.join(', ')}</p>
                <p className="text-[11px] text-slate-500">Modern digital clinical systems</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Key Perks
                </span>
                <p className="text-sm font-extrabold text-slate-900">{job.benefits[0]}</p>
                <p className="text-[11px] text-slate-500">Plus 401(k) & PTO perks</p>
              </div>
            </div>
          </div>

          {/* Job Details, Responsibilities & Benefits */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Practice Overview</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{job.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Core Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Required Credentials & Qualifications</h2>
              <ul className="space-y-2">
                {job.qualifications.map((qual, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Benefits & Practice Perks</h2>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80"
                  >
                    ✓ {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Application & VIP Fast-Track Box */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 space-y-5 border border-teal-800/40 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-900/60 px-2.5 py-0.5 rounded border border-teal-700/50">
                  Direct Clinic Application
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  Apply Directly to {job.clinicName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  No 20-page applicant tracking systems. Send your credentials straight to the practice hiring doctor.
                </p>
              </div>
            </div>

            {/* VIP Fast Track Candidate Upsell ($9.99) */}
            <div className="p-4 rounded-xl bg-teal-900/40 border border-teal-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>VIP Fast-Track Priority Badge ($9.99)</span>
                </div>
                <p className="text-xs text-slate-200">
                  Pin your resume to the very top of the doctor's review queue with a verified license badge.
                </p>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shrink-0 transition-colors">
                Add Priority (+$9.99)
              </button>
            </div>

            {/* Apply Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`mailto:${job.applyEmail}?subject=Application for ${encodeURIComponent(job.title)} via ClinicStaffJobs`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Apply via Practice Email ({job.applyEmail})</span>
              </a>

              {job.applyUrl && (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all"
                >
                  <span>Practice Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Google for Jobs Verified Direct Feed • Applications sent directly to practice management
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
