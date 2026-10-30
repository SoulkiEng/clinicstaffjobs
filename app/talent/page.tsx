'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { US_STATES_52 } from '@/data/jobs';
import { supabase } from '@/lib/supabase';
import {
  BadgeCheck,
  ShieldCheck,
  MapPin,
  Clock,
  Laptop,
  DollarSign,
  Send,
  UserCheck,
  Sparkles,
  CheckCircle2,
  PlusCircle,
  Lock,
  Mail
} from 'lucide-react';

interface TalentProfile {
  id: string;
  alias: string;
  role: string;
  specialty: string;
  state: string;
  city: string;
  minRate: number;
  experienceYears: number;
  schedulePref: string;
  softwareSkills: string[];
  licenseNote: string;
  bio: string;
  contactEmail: string;
  postedAgo: string;
}

const INITIAL_TALENT_PROFILES: TalentProfile[] = [
  {
    id: 'tal-101',
    alias: 'Verified RDH #4821 (Confidential)',
    role: 'Registered Dental Hygienist (RDH)',
    specialty: 'Dental',
    state: 'TX',
    city: 'Dallas / Plano',
    minRate: 56,
    experienceYears: 7,
    schedulePref: 'Mon–Thu (No Weekends) • 60-Min Adult Prophy Only',
    softwareSkills: ['Dentrix Ascend', 'Dexis', 'iTero 5D', 'Laser Certified'],
    licenseNote: 'Active TX State Board License + Local Anesthesia & Nitrous Certified',
    bio: 'Gentle, prevention-focused RDH with 7 years in private fee-for-service dentistry. High treatment acceptance and strong patient retention.',
    contactEmail: 'rdh.dallas.talent@clinicstaffjobs.com',
    postedAgo: 'Active 18m ago',
  },
  {
    id: 'tal-102',
    alias: 'Verified CMA #3190 (Confidential)',
    role: 'Certified Medical Assistant (CMA - AAMA)',
    specialty: 'Family Medicine',
    state: 'AZ',
    city: 'Scottsdale / Phoenix',
    minRate: 28,
    experienceYears: 5,
    schedulePref: 'Full-Time Weekday Outpatient (8:00 AM – 4:30 PM)',
    softwareSkills: ['AthenaHealth EHR', 'eClinicalWorks', 'Phlebotomy', 'EKG'],
    licenseNote: 'Active AAMA National CMA Certification + BLS',
    bio: 'Experienced primary care lead CMA skilled in rapid triage, painless venipuncture, vaccine inventory, and prior authorizations.',
    contactEmail: 'cma.scottsdale.talent@clinicstaffjobs.com',
    postedAgo: 'Active 42m ago',
  },
  {
    id: 'tal-103',
    alias: 'Verified PTA #7742 (Confidential)',
    role: 'Physical Therapist Assistant (PTA)',
    specialty: 'Physical Therapy',
    state: 'FL',
    city: 'Miami / Coral Gables',
    minRate: 40,
    experienceYears: 6,
    schedulePref: 'Full-Time or 4-Day Outpatient Ortho (1-on-1 Care)',
    softwareSkills: ['Prompt EMR', 'WebPT', 'Manual Therapy', 'Post-Op Ortho'],
    licenseNote: 'Active FL State PTA License + PT Compact Privilege',
    bio: 'Sports & orthopedic outpatient PTA passionate about 1-on-1 manual therapy and post-ACL/rotator cuff rehabilitation.',
    contactEmail: 'pta.miami.talent@clinicstaffjobs.com',
    postedAgo: 'Active 1h ago',
  },
  {
    id: 'tal-104',
    alias: 'Verified Derm MA #5518 (Confidential)',
    role: 'Dermatology Medical Assistant & Scribe',
    specialty: 'Dermatology & MedSpa',
    state: 'GA',
    city: 'Atlanta / Buckhead',
    minRate: 30,
    experienceYears: 4,
    schedulePref: 'Mon–Thu (4x10s) • Surgical & Cosmetic Suite',
    softwareSkills: ['ModMed EMA (iPad)', 'Mohs Tray Setup', 'Biopsy Assist', 'VISIA'],
    licenseNote: 'Certified Medical Assistant + 4 Yrs Mohs & Cosmetic Derm Experience',
    bio: 'Fast, accurate ModMed EMA scribe and surgical dermatology assistant experienced in excisions, biopsies, and neurotoxin prep.',
    contactEmail: 'dermma.atlanta.talent@clinicstaffjobs.com',
    postedAgo: 'Active 2h ago',
  },
  {
    id: 'tal-105',
    alias: 'Verified Optician #6094 (Confidential)',
    role: 'ABO/NCLE Licensed Dispensing Optician & COA',
    specialty: 'Vision',
    state: 'CA',
    city: 'San Diego / La Jolla',
    minRate: 34,
    experienceYears: 8,
    schedulePref: 'Full-Time Private Optical Boutique',
    softwareSkills: ['RevolutionEHR', 'Optos Daytona', 'Zeiss Cirrus OCT', 'Luxury Frame Styling'],
    licenseNote: 'ABO & NCLE Certified + CA Registered Spectacle Lens Dispenser',
    bio: 'Boutique optical manager and ophthalmic technician with high multi-pair digital progressive sales and warm patient rapport.',
    contactEmail: 'optician.sandiego.talent@clinicstaffjobs.com',
    postedAgo: 'Active 3h ago',
  },
  {
    id: 'tal-106',
    alias: 'Verified EFDA #8920 (Confidential)',
    role: 'Expanded Functions Dental Assistant (EFDA / RDA)',
    specialty: 'Dental',
    state: 'NC',
    city: 'Charlotte / SouthPark',
    minRate: 32,
    experienceYears: 6,
    schedulePref: 'Mon–Thu Full-Time Private Practice',
    softwareSkills: ['Open Dental', 'CEREC Primescan', 'CBCT 3D', '4-Handed Implant Surgery'],
    licenseNote: 'Active NC Dental Assistant II + Coronal Polishing & Sealant Certified',
    bio: 'Lead chairside dental assistant experienced in same-day CEREC crown design, implant surgical guides, and Invisalign records.',
    contactEmail: 'efda.charlotte.talent@clinicstaffjobs.com',
    postedAgo: 'Active 4h ago',
  },
];

export default function ClinicianTalentPoolPage() {
  const [profiles, setProfiles] = useState<TalentProfile[]>(INITIAL_TALENT_PROFILES);
  const [filterSpecialty, setFilterSpecialty] = useState('All');
  const [filterState, setFilterState] = useState('All');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // New Anonymous Profile Form State
  const [role, setRole] = useState('Registered Dental Hygienist (RDH)');
  const [specialty, setSpecialty] = useState('Dental');
  const [stateCode, setStateCode] = useState('TX');
  const [city, setCity] = useState('Dallas');
  const [minRate, setMinRate] = useState('52');
  const [experienceYears, setExperienceYears] = useState('5');
  const [schedulePref, setSchedulePref] = useState('Mon–Thu (No Weekends) • 60-Min Slots');
  const [softwareInput, setSoftwareInput] = useState('Dentrix, Dexis, iTero');
  const [licenseNote, setLicenseNote] = useState('Active State License Verified in Good Standing');
  const [bio, setBio] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [createdSuccess, setCreatedSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('anonymous_talent_profiles') || '[]');
      if (Array.isArray(saved) && saved.length > 0) {
        setProfiles([...saved, ...INITIAL_TALENT_PROFILES]);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: TalentProfile = {
      id: `tal-${Date.now()}`,
      alias: `Verified Clinician #${Math.floor(1000 + Math.random() * 9000)} (Confidential)`,
      role,
      specialty,
      state: stateCode,
      city: city.trim() || 'Metro Area',
      minRate: Number(minRate) || 40,
      experienceYears: Number(experienceYears) || 3,
      schedulePref,
      softwareSkills: softwareInput.split(',').map((s) => s.trim()).filter(Boolean),
      licenseNote,
      bio:
        bio.trim() ||
        `Licensed ${role} seeking an unrushed, patient-focused private ${specialty} practice in ${city}, ${stateCode}.`,
      contactEmail: contactEmail.trim(),
      postedAgo: 'Just now',
    };

    const updated = [newProfile, ...profiles];
    setProfiles(updated);
    try {
      const existing = JSON.parse(localStorage.getItem('anonymous_talent_profiles') || '[]');
      localStorage.setItem('anonymous_talent_profiles', JSON.stringify([newProfile, ...existing]));
      await supabase.from('profiles').insert([
        {
          id: newProfile.id,
          role: 'candidate',
          full_name: newProfile.alias,
          specialty: newProfile.specialty,
        },
      ]);
    } catch {
      // ignore if offline
    }
    setCreatedSuccess(true);
    setShowCreateForm(false);
  };

  const filteredProfiles = profiles.filter((p) => {
    const matchSpec = filterSpecialty === 'All' || p.specialty === filterSpecialty;
    const matchState = filterState === 'All' || p.state === filterState;
    return matchSpec && matchState;
  });

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none font-medium';

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Reverse Job Board • 100% Confidential Clinician Talent Pool</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Let Verified Private Practices <span className="text-teal-400">Apply to You</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Post your anonymous clinical profile (your name and current employer stay 100% hidden) with your desired hourly rate, schedule, and software stack. NPI-verified practice owners send you direct interview & pay offers.
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{showCreateForm ? 'Close Form' : 'Create Confidential Profile (Free)'}</span>
              </button>
            </div>
          </div>
        </div>

        {createdSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Your confidential clinician profile is now live! NPI-verified practice owners can now send interview & hourly rate offers directly to your inbox.
            </span>
          </div>
        )}

        {/* Create Anonymous Profile Drawer */}
        {showCreateForm && (
          <form
            onSubmit={handleCreateProfile}
            className="social-drawer-enter bg-white rounded-3xl border border-teal-300 p-6 sm:p-8 space-y-5 shadow-md"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Create Your Confidential Clinician Card (100% Free)
                </h2>
                <p className="text-xs text-slate-500">
                  Your real name is automatically replaced with a verified confidential alias so your current clinic never knows you are exploring offers.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <Lock className="w-3.5 h-3.5" /> Identity Hidden
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Clinical Role & Credential *
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Specialty *
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className={inputClass}
                >
                  <option value="Dental">Dental</option>
                  <option value="Family Medicine">Family Medicine</option>
                  <option value="Vision">Vision & Optical</option>
                  <option value="Physical Therapy">Physical Therapy</option>
                  <option value="Dermatology & MedSpa">Dermatology & MedSpa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Minimum Hourly Rate ($/hr) *
                </label>
                <input
                  type="number"
                  required
                  value={minRate}
                  onChange={(e) => setMinRate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  State (52) *
                </label>
                <select
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className={inputClass}
                >
                  {US_STATES_52.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Preferred City / Metro *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  required
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Private Contact Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Preferred Schedule & Patient Pace *
                </label>
                <input
                  type="text"
                  required
                  value={schedulePref}
                  onChange={(e) => setSchedulePref(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Software & Clinical Skills (Comma Separated)
                </label>
                <input
                  type="text"
                  value={softwareInput}
                  onChange={(e) => setSoftwareInput(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Publish Confidential Clinician Profile (100% Free) →
            </button>
          </form>
        )}

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-extrabold text-slate-900">
            Showing {filteredProfiles.length} Verified Confidential Clinicians Open to Practice Offers
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-900"
            >
              <option value="All">All 5 Specialties</option>
              <option value="Dental">Dental</option>
              <option value="Family Medicine">Family Medicine</option>
              <option value="Vision">Vision & Optical</option>
              <option value="Physical Therapy">Physical Therapy</option>
              <option value="Dermatology & MedSpa">Dermatology & MedSpa</option>
            </select>

            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-900"
            >
              <option value="All">All 52 US States</option>
              {US_STATES_52.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clinician Talent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProfiles.map((prof) => (
            <div
              key={prof.id}
              className="social-card-lift bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{prof.alias}</span>
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                        {prof.specialty}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">• {prof.postedAgo}</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-1.5">{prof.role}</h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      <span>
                        {prof.city}, {prof.state}
                      </span>
                      <span>•</span>
                      <span>{prof.experienceYears} Yrs Clinical Exp</span>
                    </div>
                  </div>

                  <div className="text-right bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Target Rate</div>
                    <div className="text-lg font-black text-slate-900">${prof.minRate}+/hr</div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{prof.bio}</p>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-teal-900 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{prof.schedulePref}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{prof.licenseNote}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {prof.softwareSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
                    >
                      <Laptop className="w-3 h-3 text-slate-400" />
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold text-slate-500">
                  100% Free Direct Practice Outreach
                </span>
                <a
                  href={`mailto:${prof.contactEmail}?subject=${encodeURIComponent(
                    `Direct Practice Interview & Rate Offer for ${prof.role} (${prof.city}, ${prof.state})`
                  )}&body=${encodeURIComponent(
                    `Hello ${prof.alias},\n\nWe saw your confidential profile on ClinicStaffJobs.com and would love to invite you for a brief, confidential conversation at our private ${prof.specialty} practice in ${prof.city}, ${prof.state}.\n\nWe can match or exceed your $${prof.minRate}/hr target rate and ${prof.schedulePref} schedule.\n\nBest regards,\n[Practice Name & NPI #]`
                  )}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Direct Interview Offer →</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
