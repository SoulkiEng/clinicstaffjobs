import React from 'react';
import Link from 'next/link';
import { Stethoscope, ShieldCheck, Lock, CheckCircle2, Building2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      {/* Corporate Verification Trust Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>NPI-Verified Independent Practices</span>
          </div>
          <div className="flex items-center gap-2 text-teal-300 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Free Direct Hiring for B2B Clinics & B2C Staff</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Lock className="w-4 h-4" />
            <span>HIPAA & CCPA Candidate Data Privacy Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <Building2 className="w-4 h-4 text-teal-400" />
            <span>Covering All 52 US States & Jurisdictions</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white">
                ClinicStaff<span className="text-teal-400">Jobs</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              America’s 100% free, NPI-verified direct career network exclusively serving independent Dental, Family Medicine, Optometry, Physical Therapy, and Dermatology practices across all 52 US states and territories.
            </p>
            <div className="text-[11px] text-slate-500">
              Corporate Compliance & Verification Desk:<br />
              <span className="text-teal-400 font-semibold">compliance@clinicstaffjobs.com</span>
            </div>
          </div>

          {/* Col 2: Core Clinical Specialties */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Core Specialties
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/?specialty=Dental" className="hover:text-teal-400 transition-colors">Dental Practice Jobs (RDH / RDA / DDS)</Link></li>
              <li><Link href="/?specialty=Family+Medicine" className="hover:text-teal-400 transition-colors">Family Medicine & Primary Care (CMA)</Link></li>
              <li><Link href="/?specialty=Vision" className="hover:text-teal-400 transition-colors">Optometry & Ophthalmology (COA / Optician)</Link></li>
              <li><Link href="/?specialty=Physical+Therapy" className="hover:text-teal-400 transition-colors">Outpatient Physical Therapy (PTA / Tech)</Link></li>
              <li><Link href="/?specialty=Dermatology+%26+MedSpa" className="hover:text-teal-400 transition-colors">Dermatology, Mohs & Medical Aesthetics</Link></li>
            </ul>
          </div>

          {/* Col 3: B2B Practice Solutions */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              For Practices (B2B)
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/post-a-job" className="text-teal-400 font-bold hover:underline">+ Post a Practice Opening (100% Free)</Link></li>
              <li><Link href="/employers" className="hover:text-teal-400 transition-colors">B2B Direct Hiring & NPI Verification</Link></li>
              <li><Link href="/employers#google-jobs" className="hover:text-teal-400 transition-colors">Google for Jobs Structured Indexing</Link></li>
              <li><Link href="/dashboard/employer" className="hover:text-teal-400 transition-colors">Practice Employer Dashboard</Link></li>
              <li><Link href="/signup" className="hover:text-teal-400 transition-colors">Register Practice NPI Account</Link></li>
            </ul>
          </div>

          {/* Col 4: B2C Clinician Resources */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              For Clinicians (B2C)
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/career-resources" className="hover:text-teal-400 transition-colors">52-State Licensing & CE Directory</Link></li>
              <li><Link href="/salary-calculator" className="hover:text-teal-400 transition-colors">2026 Hourly Wage Benchmark Tool</Link></li>
              <li><Link href="/alerts" className="hover:text-teal-400 transition-colors">Free Instant Email & Browser Job Alerts</Link></li>
              <li><Link href="/dashboard/candidate" className="hover:text-teal-400 transition-colors">Clinician Profile & Saved Jobs</Link></li>
              <li><Link href="/career-resources#negotiation" className="hover:text-teal-400 transition-colors">Private Practice Pay Negotiation Guide</Link></li>
            </ul>
          </div>

          {/* Col 5: Legal, Privacy & Governance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Trust, Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy" className="hover:text-teal-400 transition-colors">Data Privacy & Candidate Protection</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400 transition-colors">Terms & Conditions (B2B & B2C)</Link></li>
              <li><Link href="/privacy#ccpa" className="hover:text-teal-400 transition-colors">CCPA / CPRA Privacy Rights</Link></li>
              <li><Link href="/terms#verification" className="hover:text-teal-400 transition-colors">NPI & State License Verification Policy</Link></li>
              <li><Link href="/terms#eeo" className="hover:text-teal-400 transition-colors">Equal Opportunity Healthcare Notice</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ClinicStaffJobs.com — US Healthcare Career Network. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <span>•</span>
            <Link href="/employers" className="hover:text-slate-300">Employer Verification</Link>
            <span>•</span>
            <Link href="/career-resources" className="hover:text-slate-300">52-State Licensing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
