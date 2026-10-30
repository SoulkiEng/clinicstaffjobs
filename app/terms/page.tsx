import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, Building2, UserCheck, CheckCircle2, ArrowLeft, BadgeCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions of Service | ClinicStaffJobs.com',
  description: 'Simple, clear terms of service for healthcare employers and job seekers across all 52 US states.'
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Jobs</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-4 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <Scale className="w-3.5 h-3.5 text-teal-600" />
            <span>Platform Terms • All 52 US States</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms & Conditions of Service
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            These Terms & Conditions govern the use of ClinicStaffJobs.com by healthcare clinics ("Employers") and healthcare staff ("Job Seekers"). By creating an account, posting a job, or applying to an opening, you agree to these simple community rules.
          </p>
        </div>

        {/* Sections */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xs text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              <span>1. Free Job Postings for Healthcare Clinics</span>
            </h2>
            <p>
              ClinicStaffJobs provides 100% free job postings for healthcare clinics across our five main specialties: <strong>Dental, Family Medicine, Vision / Optical, Physical Therapy, and Dermatology & MedSpa</strong>.
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Clear Hourly Pay Required:</strong> Every employer must list an honest hourly pay range on every job post so job seekers know what the role pays upfront.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Real Clinic Openings Only:</strong> Third-party staffing agencies may not post fake or unnamed ads pretending to be private clinics.
                </span>
              </li>
            </ul>
          </section>

          <section id="verification" className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-emerald-600" />
              <span>2. Clinic & License Verification</span>
            </h2>
            <p>
              To keep our community safe and trustworthy across all 52 states:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Clinic Verification:</strong> Clinics showing the "Verified Clinic" badge have provided their clinic details or 10-digit National Provider Identifier (NPI).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Job Seeker Licenses:</strong> Job seekers applying for licensed roles (such as RDH, RDA, CMA, PTA, Optician, or Dentist) confirm they hold or qualify for a valid license in their state. Hiring clinics are responsible for final license checks before a candidate treats patients.
                </span>
              </li>
            </ul>
          </section>

          <section id="eeo" className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-600" />
              <span>3. Fair & Equal Hiring</span>
            </h2>
            <p>
              All clinics using ClinicStaffJobs must follow federal, state, and local Equal Employment Opportunity laws.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>4. No Spam or Automated Scraping</span>
            </h2>
            <p>
              Automated scraping, copying clinic emails for spam marketing, or reselling job seeker profiles is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900">
              5. Questions & Support
            </h2>
            <p>
              Have questions about your account or a job post? Email us at{' '}
              <a href="mailto:support@clinicstaffjobs.com" className="text-teal-700 font-bold underline">
                support@clinicstaffjobs.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
