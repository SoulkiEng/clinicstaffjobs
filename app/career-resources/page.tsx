import React from 'react';
import Link from 'next/link';
import { US_STATES_52 } from '@/data/jobs';
import GeminiCareerCoach from '@/components/GeminiCareerCoach';
import {
  BookOpen,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  UserPlus
} from 'lucide-react';

export const metadata = {
  title: 'Healthcare Career, State License & Pay Advice | ClinicStaffJobs',
  description: 'Simple career guides, state license transfer help across all 52 US states, and hourly pay advice for Dental Hygienists, Dental Assistants, Medical Assistants, PTAs, and Opticians.'
};

export default function CareerResourcesPage() {
  const specialtyGuides = [
    {
      specialty: 'Dental Clinics (RDH, RDA, EFDA, DDS)',
      title: 'Dental Clinic Career & Hourly Pay Guide',
      points: [
        'Why 60-minute hygiene appointments and assisted hygiene make daily work calmer and easier on your hands and back',
        'Certifications like Nitrous Oxide, Local Anesthesia, and Expanded Duties (EFDA) that add +$3 to +$6/hr to your pay',
        'How to compare private family dental offices vs. corporate dental chains'
      ],
      link: '/?specialty=Dental'
    },
    {
      specialty: 'Medical Clinics (CMA, RMA, Phlebotomist, Manager)',
      title: 'Private Medical Clinic vs. Hospital Shifts Guide',
      points: [
        'Switching from exhausting 12-hour hospital shifts to steady Monday–Friday (8:00 AM – 4:30 PM) private clinic schedules',
        'Popular clinic software skills that boost your pay: AthenaHealth, eClinicalWorks, and Epic',
        'How Certified Medical Assistants (CMA) with blood-draw (phlebotomy) and EKG skills earn top hourly rates'
      ],
      link: '/?specialty=Family+Medicine'
    },
    {
      specialty: 'Eye & Vision Clinics (Optician, Eye Tech, COA)',
      title: 'Optical & Eye Clinic Career Guide',
      points: [
        'How ABO & NCLE certification and frame styling bonuses help Opticians earn $32+/hr',
        'Helpful eye clinic tools to highlight on your CV: Optos imaging, OCT scans, and RevolutionEHR',
        'How to find private eye doctors who pay for your COA certification training'
      ],
      link: '/?specialty=Vision'
    },
    {
      specialty: 'Physical Therapy Clinics (PTA, PT Aide, Front Desk)',
      title: 'Physical Therapy & Rehab Clinic Guide',
      points: [
        'How to spot great 1-on-1 physical therapy clinics (45-minute sessions) instead of rushed clinics where you juggle 3 patients at once',
        'Using PT Aide experience in private sports clinics to get strong recommendation letters for PT school',
        'Highlighting Prompt EMR and WebPT experience on your job profile'
      ],
      link: '/?specialty=Physical+Therapy'
    },
    {
      specialty: 'Dermatology & MedSpa (Derm MA, Aesthetician, Nurse)',
      title: 'Dermatology & MedSpa Career Guide',
      points: [
        'How to get hired at top-paying dermatology and cosmetic clinics with 4-day (Mon–Thu) schedules',
        'Skills that dermatology doctors look for: ModMed EMA iPad charting, biopsy tray setup, and patient photography',
        'Understanding hourly base pay plus treatment and skincare bonus plans'
      ],
      link: '/?specialty=Dermatology+%26+MedSpa'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
            <span>Free Career & License Help • All 52 US States</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Healthcare Career, State License & Pay Advice
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Easy-to-read guides, state license transfer rules, and Gemini AI career tools built to help dental and medical staff find better-paying clinic jobs.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup?role=candidate"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Free Job Seeker Account</span>
            </Link>
            <Link
              href="/salary-calculator"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all"
            >
              <DollarSign className="w-4 h-4 text-teal-400" />
              <span>Check Hourly Pay Calculator</span>
            </Link>
            <Link
              href="/alerts"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
            >
              <span>Get Free Job Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Interactive Gemini AI Career & State License Coach */}
        <GeminiCareerCoach />

        {/* 5 Core Specialty Playbooks */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Career Tips by Clinic Specialty
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialtyGuides.map((g, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    {g.specialty}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900">{g.title}</h3>
                  <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                    {g.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={g.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900"
                  >
                    <span>Browse Open {g.specialty.split(' ')[0]} Jobs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-State License Transfer Guide */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Moving to a New State?</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              How to Transfer Your Healthcare License to Another State
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Here is how license transfers work across our main clinic roles:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-extrabold text-teal-800 uppercase tracking-wider text-[11px]">
                🦷 Dental Hygienists & Dentists
              </span>
              <p className="font-bold text-slate-900">Easy License Transfer by Credentials</p>
              <p className="text-slate-600 leading-relaxed">
                Active Dental Hygienists (RDH) and Dentists (DDS/DMD) with 1,000+ work hours and National Board passing scores qualify for fast license transfer in 40+ states without retaking clinical board exams.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-extrabold text-indigo-800 uppercase tracking-wider text-[11px]">
                🏃 Physical Therapy (PT & PTA)
              </span>
              <p className="font-bold text-slate-900">PT Compact Multi-State Privilege</p>
              <p className="text-slate-600 leading-relaxed">
                Licensed Physical Therapists and PTAs in a PT Compact member state can get online approval to work in 35+ participating states in just a few minutes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-extrabold text-emerald-800 uppercase tracking-wider text-[11px]">
                🩺 Medical Assistants, RNs & Opticians
              </span>
              <p className="font-bold text-slate-900">National Certifications Work Nationwide</p>
              <p className="text-slate-600 leading-relaxed">
                National CMA (AAMA), RMA (AMT), COA, and ABO/NCLE Optician certifications are recognized in all 52 US states, and RNs can use the Nurse Licensure Compact in 41+ states.
              </p>
            </div>
          </div>
        </div>

        {/* 52-State Job Directory */}
        <div id="negotiation" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
              <BadgeCheck className="w-4 h-4 text-emerald-600" />
              <span>All 52 US States Covered</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Browse Clinic Jobs by State
            </h2>
            <p className="text-xs text-slate-600">
              Click your state below to see open Dental, Medical, Vision, Physical Therapy, and Dermatology jobs near you.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {US_STATES_52.map((st) => (
              <Link
                key={st.code}
                href={`/states/${st.code.toLowerCase()}`}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-xs font-semibold text-slate-700 hover:text-teal-900 flex items-center justify-between transition-all"
              >
                <span className="truncate">{st.name}</span>
                <span className="text-[10px] font-bold text-slate-400 ml-1">{st.code}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
