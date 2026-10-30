import React from 'react';
import Link from 'next/link';
import { Stethoscope, ShieldCheck, Lock, CheckCircle2, Building2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      {/* Top Trust Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Private Clinics & Doctors</span>
          </div>
          <div className="flex items-center gap-2 text-teal-300 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Free for Job Seekers & Employers</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Lock className="w-4 h-4" />
            <span>Private & Secure Resume Protection</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <Building2 className="w-4 h-4 text-teal-400" />
            <span>Jobs in All 52 US States</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand */}
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
              America’s 100% free healthcare job board for Dental, Family Medicine, Vision, Physical Therapy, and Dermatology clinics across all 52 US states.
            </p>
            <div className="text-[11px] text-slate-500">
              Support & Help Desk:<br />
              <span className="text-teal-400 font-semibold">support@clinicstaffjobs.com</span>
            </div>
          </div>

          {/* Col 2: Job Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Job Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/?specialty=Dental" className="hover:text-teal-400 transition-colors">Dental Clinic Jobs (Hygienist / Assistant)</Link></li>
              <li><Link href="/?specialty=Family+Medicine" className="hover:text-teal-400 transition-colors">Family Medicine Jobs (Medical Assistant / RN)</Link></li>
              <li><Link href="/?specialty=Vision" className="hover:text-teal-400 transition-colors">Eye & Vision Clinic Jobs (Optician / Tech)</Link></li>
              <li><Link href="/?specialty=Physical+Therapy" className="hover:text-teal-400 transition-colors">Physical Therapy Jobs (PTA / Rehab Aide)</Link></li>
              <li><Link href="/?specialty=Dermatology+%26+MedSpa" className="hover:text-teal-400 transition-colors">Dermatology & MedSpa Jobs</Link></li>
            </ul>
          </div>

          {/* Col 3: For Employers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              For Employers (Clinics)
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/post-a-job" className="text-teal-400 font-bold hover:underline">+ Post a Job (100% Free)</Link></li>
              <li><Link href="/talent" className="text-emerald-400 font-semibold hover:underline">Browse Available Candidates</Link></li>
              <li><Link href="/employers" className="hover:text-teal-400 transition-colors">Why Clinics Use Us</Link></li>
              <li><Link href="/dashboard/employer" className="hover:text-teal-400 transition-colors">Employer Portal & My Jobs</Link></li>
              <li><Link href="/signup?role=employer" className="hover:text-teal-400 transition-colors">Create Free Employer Account</Link></li>
            </ul>
          </div>

          {/* Col 4: For Job Seekers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              For Job Seekers
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard/candidate" className="text-teal-400 font-bold hover:underline">My Profile, CV & Applied Jobs</Link></li>
              <li><Link href="/salary-calculator" className="hover:text-teal-400 transition-colors">Hourly Salary Calculator</Link></li>
              <li><Link href="/alerts" className="hover:text-teal-400 transition-colors">Free Email Job Alerts</Link></li>
              <li><Link href="/career-resources" className="hover:text-teal-400 transition-colors">Career & State License Advice</Link></li>
              <li><Link href="/signup?role=candidate" className="hover:text-teal-400 transition-colors">Create Free Job Seeker Account</Link></li>
            </ul>
          </div>

          {/* Col 5: Legal & Privacy */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Privacy & Terms
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy#ccpa" className="hover:text-teal-400 transition-colors">Your Data Privacy Rights</Link></li>
              <li><Link href="/terms#verification" className="hover:text-teal-400 transition-colors">Clinic Verification Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ClinicStaffJobs.com — US Healthcare & Dental Job Board. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <span>•</span>
            <Link href="/employers" className="hover:text-slate-300">For Employers</Link>
            <span>•</span>
            <Link href="/career-resources" className="hover:text-slate-300">State Licenses</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
