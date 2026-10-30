import React from 'react';
import Link from 'next/link';
import { US_STATES_52 } from '@/data/jobs';
import {
  BookOpen,
  Award,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  BadgeCheck,
  FileText
} from 'lucide-react';

export const metadata = {
  title: 'Clinician Career, 52-State Licensing & Salary Negotiation Hub (B2C) | ClinicStaffJobs',
  description: 'Comprehensive career guides, state licensing board directory across all 52 US states, and private practice hourly pay negotiation strategies for RDH, RDA, CMA, PTA, and Opticians.'
};

export default function CareerResourcesB2CPage() {
  const specialtyGuides = [
    {
      specialty: 'Dental (RDH, RDA, EFDA, DDS)',
      title: '2026 Private Dental Practice Career & Pay Guide',
      points: [
        'Why 60-minute adult prophy slots and Assisted Hygiene reduce RDH musculoskeletal burnout by 62%',
        'Expanded Functions (EFDA), Nitrous Oxide, and Local Anesthesia certifications that add +$3 to +$6/hr',
        'How to evaluate private fee-for-service vs. corporate DSO benefits packages'
      ],
      link: '/?specialty=Dental'
    },
    {
      specialty: 'Family Medicine (CMA, RMA, Phlebotomist, Manager)',
      title: 'Outpatient Primary Care vs. Hospital System Guide',
      points: [
        'Transitioning from 12-hour hospital floor shifts to predictable Monday–Friday 8:00am–4:30pm private clinics',
        'High-demand EHR certifications: AthenaHealth, eClinicalWorks, and Elation Health workflows',
        'Average 2026 hourly wage premiums for AAMA Certified Medical Assistants (CMA) with phlebotomy skills'
      ],
      link: '/?specialty=Family+Medicine'
    },
    {
      specialty: 'Vision & Ophthalmology (COA, COT, Licensed Optician)',
      title: 'Optical Boutique & Ophthalmology Scribe Career Path',
      points: [
        'How ABO & NCLE certification and luxury frame styling commissions boost Optician earnings above $32/hr',
        'Mastering Optos Daytona ultra-widefield imaging, Zeiss Cirrus OCT, and ModMed EMA ophthalmic scribing',
        'JCAHPO Certified Ophthalmic Assistant (COA) employer sponsorship programs'
      ],
      link: '/?specialty=Vision'
    },
    {
      specialty: 'Physical Therapy (PTA, Rehab Aide, Front Office)',
      title: '1-on-1 Outpatient Orthopedic Rehab Career Playbook',
      points: [
        'Identifying therapist-owned 1-on-1 outpatient clinics (45-min sessions) vs. high-volume double-booked mills',
        'Using Pre-PT Rehab Aide experience in private sports clinics to secure Doctor of Physical Therapy (DPT) letters',
        'Prompt EMR and WebPT documentation efficiency tips for Physical Therapist Assistants (PTAs)'
      ],
      link: '/?specialty=Physical+Therapy'
    },
    {
      specialty: 'Dermatology & MedSpa (Derm MA, Aesthetician, Mohs Tech)',
      title: 'Cosmetic Dermatology, Laser & Mohs Surgery Career Guide',
      points: [
        'Breaking into high-paying cosmetic dermatology and Mohs micrographic surgery suites (Mon–Thu schedules)',
        'ModMed EMA iPad scribing, biopsy tray setup, and VISIA digital skin consultation best practices',
        'Understanding hourly base + service/retail commission structures in physician-owned MedSpas'
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
            <span>B2C Clinician Resource Center • All 52 US States & Territories</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Clinician Licensing, Career & Wage Negotiation Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Actionable market intelligence, specialty workflow checklists, and state-by-state licensing resources built to help US clinic professionals earn more without burnout.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/salary-calculator"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              <DollarSign className="w-4 h-4" />
              <span>Launch 2026 Hourly Wage Calculator</span>
            </Link>
            <Link
              href="/alerts"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all"
            >
              <span>Set Up Free Job Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 5 Core Specialty Playbooks */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Specialty Clinical Career Playbooks
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
                    <span>Browse Verified Openings in {g.specialty.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-State Clinical License Compact & Reciprocity Guide */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>2026 Multi-State Licensure Portability</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Interstate Clinical License Reciprocity & Compact Guide
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Relocating to a new state? Here is how interstate licensure compacts work across our 5 core outpatient specialties:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-extrabold text-teal-800 uppercase tracking-wider text-[11px]">
                🦷 Dental & Hygiene (DDH Compact)
              </span>
              <p className="font-bold text-slate-900">Dentist & Dental Hygienist Compact + Licensure by Credentials</p>
              <p className="text-slate-600 leading-relaxed">
                Active RDHs and DDS clinicians with 1,000+ clinical hours and National Board passing scores qualify for expedited Licensure by Credentials or Compact privilege in 40+ states without retaking clinical manikin exams.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-extrabold text-indigo-800 uppercase tracking-wider text-[11px]">
                🏃 Physical Therapy (PT Compact)
              </span>
              <p className="font-bold text-slate-900">PT & PTA Interstate Compact Privilege</p>
              <p className="text-slate-600 leading-relaxed">
                Licensed Physical Therapists (DPT) and Physical Therapist Assistants (PTA) holding a home-state license in a PT Compact member state can obtain instant compact practice privileges in 35+ participating states online.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-extrabold text-emerald-800 uppercase tracking-wider text-[11px]">
                🩺 CMA / RMA, RN (NLC) & Opticians
              </span>
              <p className="font-bold text-slate-900">National AAMA / AMT & Nurse Licensure Compact (41+ States)</p>
              <p className="text-slate-600 leading-relaxed">
                AAMA (CMA), AMT (RMA), JCAHPO (COA), and ABO/NCLE credentials are nationally portable across all 52 US jurisdictions, while Outpatient RNs enjoy multi-state privilege across 41+ NLC states.
              </p>
            </div>
          </div>
        </div>

        {/* 52-State Clinical Licensing & Job Directory */}
        <div id="negotiation" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
              <BadgeCheck className="w-4 h-4 text-emerald-600" />
              <span>Nationwide State Board Coverage</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Browse Verified Clinic Jobs by US State & Territory (All 52 Jurisdictions)
            </h2>
            <p className="text-xs text-slate-600">
              Select your state below to filter NPI-verified Dental, Family Medicine, Vision, Physical Therapy, and Dermatology openings in your jurisdiction.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {US_STATES_52.map((st) => (
              <Link
                key={st.code}
                href={`/?state=${st.code}`}
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
