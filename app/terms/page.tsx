import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, Building2, UserCheck, CheckCircle2, ArrowLeft, BadgeCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions of Service (B2B & B2C) | ClinicStaffJobs.com',
  description: 'Corporate terms of service governing NPI-verified healthcare practices (B2B) and licensed clinical candidates (B2C) across all 52 US states and territories.'
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
          <span>Back to 52-State Job Board</span>
        </Link>

        {/* Corporate Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-4 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <Scale className="w-3.5 h-3.5 text-teal-600" />
            <span>B2B & B2C Platform Agreement • All 52 US Jurisdictions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms & Conditions of Service
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            These Terms & Conditions ("Agreement") govern access to and use of ClinicStaffJobs.com by healthcare employers ("B2B Practices") and clinical job seekers ("B2C Clinicians"). By accessing our platform, posting an opening, or submitting an application, you agree to abide by these professional healthcare marketplace standards.
          </p>
        </div>

        {/* Detailed Governance Sections */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xs text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              <span>1. B2B Practice Eligibility & 100% Free Direct Posting Terms</span>
            </h2>
            <p>
              ClinicStaffJobs provides 100% free job postings exclusively to legitimate outpatient healthcare practices operating within our five core specialties: <strong>Dental, Family Medicine, Vision / Optometry, Physical Therapy, and Dermatology & MedSpa</strong>.
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Mandatory Wage Transparency:</strong> Every B2B employer must disclose a truthful, good-faith hourly or daily compensation range on every listing, in compliance with state pay transparency laws (including CA, NY, CO, WA, IL, MD, DC, and nationwide best practices).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>No Third-Party Staffing Agencies:</strong> Unsolicited third-party recruiting firms may not post blind "lead-capture" ads disguised as private clinics.
                </span>
              </li>
            </ul>
          </section>

          <section id="verification" className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-emerald-600" />
              <span>2. NPI & State Board License Verification Standards</span>
            </h2>
            <p>
              To maintain high trust across all 52 US states and territories:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Practice NPI Verification (B2B):</strong> Practices displaying the "NPI Verified Practice" badge have supplied a 10-digit National Provider Identifier corresponding to an active outpatient practice or licensed healthcare provider.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Clinician Credential Representation (B2C):</strong> Candidates applying for licensed positions (including RDH, RDA, EFDA, CMA, PTA, COA, Licensed Optician, Aesthetician, or DDS/DMD) affirm that they hold or are eligible for an active state license or certification in the state of employment. Practices remain responsible for final primary-source credential verification prior to clinical patient contact.
                </span>
              </li>
            </ul>
          </section>

          <section id="eeo" className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-600" />
              <span>3. Equal Employment Opportunity (EEO) & Non-Discrimination</span>
            </h2>
            <p>
              All B2B practices using ClinicStaffJobs must comply with federal, state, and local Equal Employment Opportunity laws. Job postings may not discriminate on the basis of race, color, religion, sex, pregnancy, national origin, age, disability, veteran status, or genetic information.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>4. Anti-Scraping & Intellectual Property Protection</span>
            </h2>
            <p>
              Automated scraping, harvesting of practice hiring emails, bulk downloading of clinician profiles, or republication of our proprietary 52-State Wage Benchmark data without written authorization is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900">
              5. Legal & Compliance Contact
            </h2>
            <p>
              Questions regarding B2B employer compliance or B2C terms may be directed to{' '}
              <a href="mailto:compliance@clinicstaffjobs.com" className="text-teal-700 font-bold underline">
                compliance@clinicstaffjobs.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
