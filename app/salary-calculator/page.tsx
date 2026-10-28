import React from 'react';
import Link from 'next/link';
import SalaryCalculator from '@/components/SalaryCalculator';
import { ArrowLeft, TrendingUp, ShieldCheck, DollarSign, Award, Users } from 'lucide-react';

export const metadata = {
  title: 'US Private Clinic Salary Calculator & Wage Benchmark 2026 | ClinicStaffJobs',
  description: 'Find out if you are getting underpaid as a Dental Hygienist, Dental Assistant, Medical Assistant, or Physical Therapy Aide in Dallas, Houston, Miami, and top US metros.'
};

export default function SalaryCalculatorPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Openings</span>
        </Link>

        {/* Hero title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>2026 Live Market Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Private Practice Healthcare Wage Benchmark
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Calculated from over 1,200 verified independent dental and medical practice openings across the United States.
          </p>
        </div>

        {/* The Interactive Calculator */}
        <SalaryCalculator />

        {/* Why Wage Transparency Matters for Clinic Staff */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Private vs Corporate Gap</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Private clinics frequently pay $3 to $7/hr higher than large corporate DSOs or hospital systems to retain high-quality talent.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Certification Premium</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Expanded duties (EFDA), Nitrous certification, and Ortho casting certifications command an immediate $2-$4/hr boost in Texas and Florida.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Severe Labor Shortage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              With 82% of practices reporting staff shortages, certified clinic workers hold tremendous negotiation leverage this year.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
