import React from 'react';
import Link from 'next/link';
import {
  BadgeCheck,
  CheckCircle2,
  PlusCircle,
  Laptop,
  ArrowRight,
  Globe,
  Sparkles,
  Users
} from 'lucide-react';

export const metadata = {
  title: 'For Employers & Clinics — 100% Free Healthcare & Dental Hiring | ClinicStaffJobs',
  description: 'Save your clinic profile once and post unlimited free jobs for Dental, Family Medicine, Vision, Physical Therapy, and Dermatology clinics across all 52 US states.'
};

export default function EmployersPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Employer Hero */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold">
            <BadgeCheck className="w-4 h-4 text-teal-400" />
            <span>For Private Clinics & Doctors • 100% Free Across All 52 States</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Hire Dental & Healthcare Staff Directly.<br />
            <span className="text-teal-400">Zero Posting Fees. Save Your Clinic Info Once.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Built for Dental, Family Medicine, Vision, Physical Therapy, and Dermatology clinics across all 52 US states. Create your free Employer Account once—manage active and closed jobs, view matched candidates, and use Gemini AI to write job posts in seconds.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup?role=employer&redirect=/post-a-job"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Free Job Now</span>
            </Link>
            <Link
              href="/signup?role=employer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all"
            >
              <span>Create Free Employer Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Clinics Choose Us */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Save Your Clinic Profile Once</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Save your clinic name, specialty, city, software, and optional 10-digit NPI number in your Employer Portal once. Whenever you post a new job or re-open an old job, your details are pre-filled automatically.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Smart Filters & Matched Candidates</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Filter by gender preference, years of experience, clinic software (Dentrix, Eaglesoft, AthenaHealth, ModMed), and work schedule. View matched candidates right inside your Employer Portal and invite them in 1 click.
            </p>
          </div>

          <div id="google-jobs" className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Built-In Gemini AI Hiring Assistant</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Don’t waste time writing job posts or emails from scratch. Click one button to let Gemini AI write your job description, duties, and personalized interview invitations automatically.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              How ClinicStaffJobs Compares to Other Job Sites
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Built specifically for private dental and healthcare clinics across all 52 US states.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3.5 px-6">Feature</th>
                  <th className="py-3.5 px-6 text-teal-700 bg-teal-50/50">ClinicStaffJobs.com</th>
                  <th className="py-3.5 px-6 text-slate-500">General Job Boards</th>
                  <th className="py-3.5 px-6 text-slate-500">Staffing Agencies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5 px-6 font-semibold">Job Posting Cost</td>
                  <td className="py-3.5 px-6 font-extrabold text-emerald-700 bg-teal-50/30">$0 (100% Free)</td>
                  <td className="py-3.5 px-6">$299 – $649 per post</td>
                  <td className="py-3.5 px-6">20% – 30% Placement Fee ($4,500+)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold">Active & Inactive Job Portal</td>
                  <td className="py-3.5 px-6 font-bold text-teal-700 bg-teal-50/30">✓ Re-open or pause jobs in 1 click</td>
                  <td className="py-3.5 px-6">Pay again to re-post</td>
                  <td className="py-3.5 px-6">Managed by recruiter</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold">Healthcare Filters (Software, Experience, Gender Pref)</td>
                  <td className="py-3.5 px-6 font-bold text-teal-700 bg-teal-50/30">✓ Built-In for All 5 Clinic Specialties</td>
                  <td className="py-3.5 px-6">Keyword Only</td>
                  <td className="py-3.5 px-6">Slow Phone Screening</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold">Candidate Contact Info & CV</td>
                  <td className="py-3.5 px-6 font-bold text-teal-700 bg-teal-50/30">✓ Direct Email, Phone & CV Included</td>
                  <td className="py-3.5 px-6">Paid Resume Subscription</td>
                  <td className="py-3.5 px-6">Hidden by Agency</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold">Gemini AI Job Writer & Interview Invites</td>
                  <td className="py-3.5 px-6 font-bold text-teal-700 bg-teal-50/30">✓ Included Free</td>
                  <td className="py-3.5 px-6">Extra Fee</td>
                  <td className="py-3.5 px-6">Not Available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Helpful Employer Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clinic Website Badge */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free Clinic Website Badge</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Add Our "Verified Hiring Clinic" Badge to Your Website
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Let local hygienists, assistants, and nurses know your clinic is hiring directly. Copy the code below and paste it onto your clinic website’s Careers page:
            </p>
            <div className="p-4 rounded-xl bg-slate-900 text-teal-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
              {`<a href="https://clinicstaffjobs.com" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:10px;background:#0f172a;color:#ffffff;font-family:sans-serif;font-size:12px;font-weight:700;text-decoration:none;border:1px solid #14b8a6;">✓ Verified Hiring Clinic on ClinicStaffJobs.com</a>`}
            </div>
            <p className="text-[11px] text-slate-500">
              ✓ Links job seekers directly to our 100% free 52-state healthcare job board.
            </p>
          </div>

          {/* Checklist for Getting More Applicants */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Tips for Hiring Faster</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              How to Get 3x More Applicants for Your Clinic
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Clinics that include these 4 simple details receive <strong>3x more applications</strong> in the first 48 hours:
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Show Patient Appointment Times:</strong> Mention "60-Min Adult Hygiene Slots" or "45-Min 1-on-1 Physical Therapy".</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>List Your Clinic Software:</strong> Mention Dentrix, Open Dental, iTero, AthenaHealth, or ModMed EMA.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Share Clear Hourly Pay:</strong> Post your exact hourly pay range (for example, $48–$56/hr).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Highlight Work-Life Balance:</strong> Mention "No Weekends" or "4-Day Workweek (Mon–Thu)".</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/signup?role=employer&redirect=/post-a-job"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-teal-700 hover:text-teal-900"
              >
                <span>Create Free Employer Account & Use Gemini AI Job Writer →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
