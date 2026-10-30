import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_JOBS } from '@/data/jobs';
import { generateJobPostingSchema } from '@/lib/schema';
import DirectApplyBox from '@/components/DirectApplyBox';
import {
  MapPin,
  Clock,
  ShieldCheck,
  TrendingUp,
  Laptop,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Building2,
  ArrowRight
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return ALL_JOBS.map((job) => ({ id: job.id }));
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = ALL_JOBS.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  const schemaData = generateJobPostingSchema(job);

  // Find 3 similar openings in the same specialty or metro
  const similarJobs = ALL_JOBS.filter(
    (j) => j.id !== job.id && (j.clinicType === job.clinicType || j.city === job.city)
  ).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Breadcrumb Back Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Clinical Openings</span>
            </Link>

            <span className="text-xs text-slate-400 font-medium">
              Job ID: {job.id} • {job.location}
            </span>
          </div>

          {/* Main Job Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    {job.clinicType} Practice
                  </span>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
                    {job.workType}
                  </span>
                  <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location} ({job.zipCode})
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
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Direct Practice
                  </span>
                </div>
              </div>

              {/* Compensation Highlight */}
              <div className="sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-xl border sm:border-0 border-slate-200 shrink-0">
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  ${job.minHourly} – ${job.maxHourly}
                  <span className="text-sm font-semibold text-slate-500">/hr</span>
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 mt-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{job.payComparison}</span>
                </div>
                <div className="mt-3">
                  <a
                    href="#apply-section"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    Apply Now ↓
                  </a>
                </div>
              </div>
            </div>

            {/* Clinical Workflow Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-slate-100">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" /> Patient Scheduling Pace
                </span>
                <p className="text-sm font-bold text-slate-900">{job.appointmentTime || '1-on-1 Patient Care'}</p>
                <p className="text-[11px] text-slate-500">Quality-focused private clinic flow</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  <Laptop className="w-3.5 h-3.5 text-slate-600" /> EHR & Clinical Tech
                </span>
                <p className="text-sm font-bold text-slate-900">{job.softwareUsed.join(', ')}</p>
                <p className="text-[11px] text-slate-500">Modern digital charting & imaging</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Highlighted Benefit
                </span>
                <p className="text-sm font-bold text-slate-900">{job.benefits[0]}</p>
                <p className="text-[11px] text-slate-500">Full package listed below</p>
              </div>
            </div>
          </div>

          {/* Full Role Description, Responsibilities, Qualifications & Benefits */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">About the Practice & Role</h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            <div className="pt-5 border-t border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Clinical & Daily Responsibilities</h2>
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
              <h2 className="text-lg font-bold text-slate-900 mb-3">Licensure & Qualifications</h2>
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
              <h2 className="text-lg font-bold text-slate-900 mb-3">Compensation & Benefits Package</h2>
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

          {/* Interactive 1-Click Direct Application Form */}
          <DirectApplyBox job={job} />

          {/* Similar Openings Section */}
          {similarJobs.length > 0 && (
            <div className="pt-4 space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                Similar Verified Openings You May Like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similarJobs.map((sim) => (
                  <Link
                    key={sim.id}
                    href={`/jobs/${sim.id}`}
                    className="bg-white rounded-xl border border-slate-200 p-4 hover:border-teal-400 hover:shadow-sm transition-all flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        {sim.clinicType} • {sim.location}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mt-1">
                        {sim.title}
                      </h4>
                      <p className="text-xs text-slate-600 truncate">{sim.clinicName}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold">
                      <span className="text-slate-900">${sim.minHourly}–${sim.maxHourly}/hr</span>
                      <span className="text-teal-600 flex items-center gap-0.5">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
