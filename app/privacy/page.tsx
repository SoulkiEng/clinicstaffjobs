import React from 'react';
import Link from 'next/link';
import { Lock, FileCheck, EyeOff, Server, CheckCircle2, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy & Candidate Data Protection | ClinicStaffJobs.com',
  description: 'How ClinicStaffJobs protects job seeker resumes, license numbers, and clinic records across all 52 US states.'
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
          <span>Back to All Jobs</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-4 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            <span>Data Privacy & Protection • Updated October 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy & Candidate Protection
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            ClinicStaffJobs.com ("We", "Our") is a free healthcare job board serving private clinics ("Employers") and healthcare professionals ("Job Seekers") across all 50 US States, Washington DC, and Puerto Rico. We protect your personal information, CV, and clinic details with strict privacy standards.
          </p>

          {/* 3-Pillar Privacy Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <EyeOff className="w-4 h-4 text-emerald-600" />
                <span>Never Sold to Agencies</span>
              </div>
              <p className="text-xs text-slate-600">
                We never sell or rent job seeker resumes, phone numbers, or emails to staffing agencies or spam marketers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
                <Server className="w-4 h-4 text-teal-600" />
                <span>Encrypted & Secure</span>
              </div>
              <p className="text-xs text-slate-600">
                All job applications, CVs, state license numbers, and clinic NPI records are encrypted in transit and at rest.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-800">
                <FileCheck className="w-4 h-4 text-cyan-600" />
                <span>Full Control Over Your Data</span>
              </div>
              <p className="text-xs text-slate-600">
                You can hide your profile, withdraw applications, or delete your account at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xs text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900">
              1. Information We Save in Your Account
            </h2>
            <p>
              We save your information in your profile so you never have to re-type the same details when applying for jobs or posting clinic openings:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>For Job Seekers:</strong> Your name, job role (such as RDH, RDA, CMA, PTA, Optician, or DDS), optional state license number, email address, phone number, CV file name, and cover notes you send to clinics.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>For Employers (Clinics):</strong> Your clinic name, optional 10-digit NPI number, clinic specialty (Dental, Family Medicine, Vision, Physical Therapy, or Dermatology & MedSpa), city/state, and hiring contact email.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900">
              2. How Your Job Applications Are Shared
            </h2>
            <p>
              When you apply to a clinic job on ClinicStaffJobs.com:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Your application and CV are sent only to the specific clinic whose job you applied for.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>You can toggle your profile between "Open to Clinic Offers" and "Private" anytime inside your Candidate Portal.</span>
              </li>
            </ul>
          </section>

          <section id="ccpa" className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900">
              3. Your Privacy Rights Across All 52 US States
            </h2>
            <p>
              No matter which state you live in, you have the right to:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>View & Edit Your Profile:</strong> Update your CV, phone number, or clinic details anytime in your account dashboard.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Delete Your Data:</strong> Request complete removal of your account, job alerts, and application history within 24 hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>No Sale of Personal Information:</strong> We never sell your personal data to third parties.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900">
              4. Patient Privacy Reminder (HIPAA)
            </h2>
            <p>
              ClinicStaffJobs is a healthcare hiring site and never collects patient medical records. Job Seekers and Employers agree never to include patient names, X-rays, or medical charts in resumes or job descriptions.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900">
              5. Contact Our Support & Privacy Team
            </h2>
            <p>
              For privacy questions or account deletion requests, email us anytime at{' '}
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
