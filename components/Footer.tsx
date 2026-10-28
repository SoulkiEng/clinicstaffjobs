import React from 'react';
import Link from 'next/link';
import { Stethoscope, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">
                ClinicStaff<span className="text-teal-400">Jobs</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The premier direct hiring marketplace exclusively for independent US healthcare, dental, optometry, and physical medicine clinics.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Private Clinics Only</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Clinic Roles</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/?category=Dental" className="hover:text-teal-400 transition-colors">Dental Hygienist Jobs (RDH)</Link></li>
              <li><Link href="/?category=Dental" className="hover:text-teal-400 transition-colors">Dental Assistant Jobs (RDA/EFDA)</Link></li>
              <li><Link href="/?category=Physical+Therapy" className="hover:text-teal-400 transition-colors">Certified Medical Assistant (CMA)</Link></li>
              <li><Link href="/?category=Physical+Therapy" className="hover:text-teal-400 transition-colors">Physical Therapy Aide / Tech</Link></li>
              <li><Link href="/?category=Vision" className="hover:text-teal-400 transition-colors">Optometric & Vision Technician</Link></li>
              <li><Link href="/?category=Dermatology" className="hover:text-teal-400 transition-colors">Aesthetic & Dermatology Nurse</Link></li>
            </ul>
          </div>

          {/* Top States & Metros */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Top US Metros</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-teal-400" /> Dallas & Fort Worth, TX</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-teal-400" /> Houston & The Woodlands, TX</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-teal-400" /> Miami & Fort Lauderdale, FL</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-teal-400" /> Orlando & Tampa Bay, FL</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-teal-400" /> Atlanta Metro, GA</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-teal-400" /> Phoenix & Scottsdale, AZ</li>
            </ul>
          </div>

          {/* Employers & Tools */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">For Practices</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/post-a-job" className="text-teal-300 font-medium hover:underline">+ Post a Practice Opening ($99 Flat)</Link></li>
              <li><Link href="/salary-calculator" className="hover:text-teal-400 transition-colors">Free Clinic Wage Benchmark Tool</Link></li>
              <li><Link href="/alerts" className="hover:text-teal-400 transition-colors">Join Candidate SMS / WhatsApp Network</Link></li>
              <li><span className="text-slate-400">Google for Jobs Verified Direct Feed</span></li>
              <li className="pt-2 text-[11px] text-slate-400">Support: hiring@clinicstaffjobs.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ClinicStaffJobs.com. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <span>Mandatory Wage Transparency</span>
            <span>•</span>
            <span>Zero Spam Guarantee</span>
            <span>•</span>
            <span>Equal Opportunity Healthcare</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
