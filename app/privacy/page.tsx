import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, FileCheck, EyeOff, Server, CheckCircle2, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Data Privacy, CCPA & Candidate Protection Policy | ClinicStaffJobs.com',
  description: 'How ClinicStaffJobs protects clinician resumes, state license numbers, and B2B practice NPI records under US privacy standards across all 52 states and territories.'
};

export default function PrivacyPolicyPage() {
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
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            <span>Corporate Data Governance • Effective October 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Data Privacy & Candidate Protection Policy
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            ClinicStaffJobs.com ("Company", "We", "Our") operates as a direct healthcare career network serving independent clinical practices (B2B) and licensed healthcare professionals (B2C) across all 50 US States, the District of Columbia, and Puerto Rico (52 Jurisdictions). We enforce strict data minimization, encryption, and anti-spam safeguards.
          </p>

          {/* 3-Pillar Privacy Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <EyeOff className="w-4 h-4 text-emerald-600" />
                <span>Zero Agency Resale</span>
              </div>
              <p className="text-xs text-slate-600">
                We never sell, rent, or broker clinician resumes, phone numbers, or emails to third-party staffing agencies.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
                <Server className="w-4 h-4 text-teal-600" />
                <span>256-Bit Encryption</span>
              </div>
              <p className="text-xs text-slate-600">
                All candidate applications, state license identifiers, and employer NPI records are encrypted in transit (TLS 1.3) and at rest.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-800">
                <FileCheck className="w-4 h-4 text-cyan-600" />
                <span>CCPA / CPRA & State Rights</span>
              </div>
              <p className="text-xs text-slate-600">
                Full 1-click data export and permanent account deletion rights for residents of all 52 US states and territories.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Legal Sections */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xs text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900">
              1. Information We Collect (B2C Clinicians & B2B Practices)
            </h2>
            <p>
              We collect only the information necessary to facilitate direct clinical employment between licensed healthcare staff and verified private practices:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>For Healthcare Professionals (B2C):</strong> Full name, professional credential (e.g., RDH, RDA, EFDA, CMA, RMA, PTA, COA, DDS), optional State Licensing Board number, contact email, mobile number (for optional job alerts), and direct application notes submitted to specific practices.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>For Clinical Employers (B2B):</strong> Practice legal/DBA name, 10-digit National Provider Identifier (NPI) number, practice specialty (Dental, Family Medicine, Vision, Physical Therapy, or Dermatology & MedSpa), clinic street/metro address, and hiring contact email.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900">
              2. Direct Application Routing & Anti-Recruiter Firewall
            </h2>
            <p>
              Unlike legacy healthcare job boards that monetize candidate profiles by selling searchable resume databases to commissioned staffing brokers, ClinicStaffJobs operates a strict <strong>Direct-to-Practice Routing Protocol</strong>:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>When you click "Submit Direct Application" on a clinic listing, your credentials are transmitted exclusively to that specific NPI-verified practice.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Third-party recruiting agencies, locum tenens brokers, and cold-call marketers are strictly prohibited from accessing candidate contact data.</span>
              </li>
            </ul>
          </section>

          <section id="ccpa" className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900">
              3. State Privacy Rights (CCPA, CPRA, VCDPA, CPA, CTDPA & All 52 Jurisdictions)
            </h2>
            <p>
              Regardless of which of the 52 US states or territories you reside in, we extend comprehensive statutory privacy rights to every user:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Right to Know & Access:</strong> Request a complete copy of your stored clinician profile or employer job postings at any time.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Right to Deletion (Right to be Forgotten):</strong> Request permanent erasure of your account, job alerts, and application history within 24 hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Do Not Sell or Share My Personal Information:</strong> ClinicStaffJobs does not sell personal data or share cross-context behavioral advertising data.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900">
              4. HIPAA & Clinical Confidentiality Notice
            </h2>
            <p>
              ClinicStaffJobs is an employment and credential networking platform and does not collect Protected Health Information (PHI) of patients. Both B2B employers and B2C candidates agree never to upload patient identifiable records, radiographs, or clinical charts inside resumes, job descriptions, or interview notes.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900">
              5. Contact Our Data Privacy Officer
            </h2>
            <p>
              For privacy inquiries, NPI verification updates, or immediate data deletion requests, contact our US Compliance & Privacy Desk at{' '}
              <a href="mailto:privacy@clinicstaffjobs.com" className="text-teal-700 font-bold underline">
                privacy@clinicstaffjobs.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
