import React from 'react';
import Link from 'next/link';
import {
  Building2,
  BadgeCheck,
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  TrendingUp,
  Users,
  Laptop,
  ArrowRight,
  Globe
} from 'lucide-react';

export const metadata = {
  title: 'For Practices & Employers (B2B) — 100% Free Direct Clinic Hiring | ClinicStaffJobs',
  description: 'Post verified openings for Dental, Family Medicine, Optometry, Physical Therapy, and Dermatology practices across all 52 US states for 100% free.'
};

export default function EmployersB2BPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Corporate B2B Hero */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold">
            <BadgeCheck className="w-4 h-4 text-teal-400" />
            <span>B2B Direct Employer Network • 100% Free for Verified US Practices</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Hire Licensed Clinical Staff Directly.<br />
            <span className="text-teal-400">Zero Posting Fees. Zero Agency Commissions.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Built exclusively for independent Dental, Family Medicine, Vision, Physical Therapy, and Dermatology practices across all 52 US States & Territories.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/post-a-job"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Your Practice Opening (100% Free)</span>
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all"
            >
              <span>Register Practice NPI Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Practices Switch from General Job Boards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">NPI Practice Verification</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every practice on our network is verified with a 10-digit National Provider Identifier (NPI). Licensed clinicians trust your listing immediately because they know they are applying directly to the doctor—not a staffing agency.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Clinical Software & Pace Matching</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Generic job boards don't filter by Dentrix, Eaglesoft, AthenaHealth, ModMed EMA, or 60-minute hygiene slots. Our specialty-built filters match you with clinicians already trained on your exact practice stack.
            </p>
          </div>

          <div id="google-jobs" className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Google for Jobs JSON-LD Syndication</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every free job posting automatically generates structured Schema.org `JobPosting` metadata, syndicating your opening across Google Search and state clinical job alerts in all 52 US jurisdictions.
            </p>
          </div>
        </div>

        {/* Comparison Table: ClinicStaffJobs vs Legacy Boards */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              How ClinicStaffJobs Compares to Legacy Healthcare Job Boards
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Designed specifically for independent private practices across our 5 core outpatient specialties.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3.5 px-6">Platform Feature</th>
                  <th className="py-3.5 px-6 text-teal-700 bg-teal-50/50">ClinicStaffJobs.com</th>
                  <th className="py-3.5 px-6 text-slate-500">Legacy Healthcare Boards</th>
                  <th className="py-3.5 px-6 text-slate-500">Staffing Agencies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5 px-6 font-semibold">30-Day Job Posting Cost</td>
                  <td className="py-3.5 px-6 font-extrabold text-emerald-700 bg-teal-50/30">$0 (100% Free)</td>
                  <td className="py-3.5 px-6">$299 – $649 per post</td>
                  <td className="py-3.5 px-6">20% – 30% Placement Fee ($4,500+)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold">NPI Practice Verification Badge</td>
                  <td className="py-3.5 px-6 font-bold text-teal-700 bg-teal-50/30">✓ Included Free</td>
                  <td className="py-3.5 px-6">Not Available</td>
                  <td className="py-3.5 px-6">Hidden (Blind Agency Ads)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold">Clinical Software & Appointment Pace Filters</td>
                  <td className="py-3.5 px-6 font-bold text-teal-700 bg-teal-50/30">✓ Built-In (Dentrix, Athena, ModMed, WebPT)</td>
                  <td className="py-3.5 px-6">Keyword Only</td>
                  <td className="py-3.5 px-6">Manual Phone Screening</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold">Direct Candidate Contact Info</td>
                  <td className="py-3.5 px-6 font-bold text-teal-700 bg-teal-50/30">✓ Instant Direct Email, Phone & License #</td>
                  <td className="py-3.5 px-6">Locked Behind Resume Upsell</td>
                  <td className="py-3.5 px-6">Withheld by Recruiter</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold">Coverage Across All 52 US States</td>
                  <td className="py-3.5 px-6 font-bold text-teal-700 bg-teal-50/30">✓ 50 States + DC + PR</td>
                  <td className="py-3.5 px-6">Hospital-Heavy</td>
                  <td className="py-3.5 px-6">Regional Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
