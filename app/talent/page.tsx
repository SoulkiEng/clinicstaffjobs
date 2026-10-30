'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { US_STATES_52 } from '@/data/jobs';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import {
  generateCandidateBioWithGemini,
  generateInterviewInviteWithGemini
} from '@/lib/gemini';
import {
  BadgeCheck,
  ShieldCheck,
  MapPin,
  Clock,
  Laptop,
  Sparkles,
  CheckCircle2,
  PlusCircle,
  Lock,
  Mail,
  Loader2,
  Building2,
  UserPlus,
  Send,
  X
} from 'lucide-react';

interface TalentProfile {
  id: string;
  alias: string;
  role: string;
  specialty: string;
  gender?: 'Female' | 'Male' | 'Any';
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
    alias: 'Verified RDH #4821 (Private Profile)',
    role: 'Registered Dental Hygienist (RDH)',
    specialty: 'Dental',
    gender: 'Female',
    state: 'TX',
    city: 'Dallas / Plano',
    minRate: 56,
    experienceYears: 7,
    schedulePref: 'Mon–Thu (No Weekends) • 60-Min Adult Prophy Only',
    softwareSkills: ['Dentrix Ascend', 'Dexis', 'iTero 5D', 'Laser Certified'],
    licenseNote: 'Active TX State Board License + Local Anesthesia & Nitrous Certified',
    bio: 'Gentle, prevention-focused Dental Hygienist with 7 years in private family dentistry. High patient comfort and strong recall retention.',
    contactEmail: 'rdh.dallas.talent@clinicstaffjobs.com',
    postedAgo: 'Active today',
  },
  {
    id: 'tal-102',
    alias: 'Verified CMA #3190 (Private Profile)',
    role: 'Certified Medical Assistant (CMA - AAMA)',
    specialty: 'Family Medicine',
    gender: 'Female',
    state: 'AZ',
    city: 'Scottsdale / Phoenix',
    minRate: 28,
    experienceYears: 5,
    schedulePref: 'Full-Time Weekday Clinic (8:00 AM – 4:30 PM)',
    softwareSkills: ['AthenaHealth EHR', 'eClinicalWorks', 'Phlebotomy', 'EKG'],
    licenseNote: 'Active AAMA National CMA Certification + BLS',
    bio: 'Experienced primary care lead Medical Assistant skilled in patient rooming, blood draws, vaccine inventory, and prior authorizations.',
    contactEmail: 'cma.scottsdale.talent@clinicstaffjobs.com',
    postedAgo: 'Active today',
  },
  {
    id: 'tal-103',
    alias: 'Verified PTA #7742 (Private Profile)',
    role: 'Physical Therapist Assistant (PTA)',
    specialty: 'Physical Therapy',
    gender: 'Male',
    state: 'FL',
    city: 'Miami / Coral Gables',
    minRate: 40,
    experienceYears: 6,
    schedulePref: 'Full-Time or 4-Day Outpatient Ortho (1-on-1 Care)',
    softwareSkills: ['Prompt EMR', 'WebPT', 'Manual Therapy', 'Post-Op Ortho'],
    licenseNote: 'Active FL State PTA License + PT Compact Privilege',
    bio: 'Sports & orthopedic Physical Therapist Assistant focused on 1-on-1 manual therapy and post-surgical rehab.',
    contactEmail: 'pta.miami.talent@clinicstaffjobs.com',
    postedAgo: 'Active today',
  },
  {
    id: 'tal-104',
    alias: 'Verified Derm MA #5518 (Private Profile)',
    role: 'Dermatology Medical Assistant & Scribe',
    specialty: 'Dermatology & MedSpa',
    gender: 'Female',
    state: 'GA',
    city: 'Atlanta / Buckhead',
    minRate: 30,
    experienceYears: 4,
    schedulePref: 'Mon–Thu (4x10s) • Surgical & Cosmetic Suite',
    softwareSkills: ['ModMed EMA (iPad)', 'Mohs Tray Setup', 'Biopsy Assist', 'VISIA'],
    licenseNote: 'Certified Medical Assistant + 4 Yrs Mohs & Cosmetic Derm Experience',
    bio: 'Fast, accurate ModMed EMA scribe and surgical dermatology assistant experienced in excisions, biopsies, and cosmetic prep.',
    contactEmail: 'dermma.atlanta.talent@clinicstaffjobs.com',
    postedAgo: 'Active today',
  },
  {
    id: 'tal-105',
    alias: 'Verified Optician #6094 (Private Profile)',
    role: 'ABO/NCLE Licensed Dispensing Optician & COA',
    specialty: 'Vision',
    gender: 'Male',
    state: 'CA',
    city: 'San Diego / La Jolla',
    minRate: 34,
    experienceYears: 8,
    schedulePref: 'Full-Time Private Optical Boutique',
    softwareSkills: ['RevolutionEHR', 'Optos Daytona', 'Zeiss Cirrus OCT', 'Frame Styling'],
    licenseNote: 'ABO & NCLE Certified + CA Registered Spectacle Lens Dispenser',
    bio: 'Optical manager and eye technician with strong progressive lens sales and warm patient care.',
    contactEmail: 'optician.sandiego.talent@clinicstaffjobs.com',
    postedAgo: 'Active today',
  },
  {
    id: 'tal-106',
    alias: 'Verified EFDA #8920 (Private Profile)',
    role: 'Expanded Functions Dental Assistant (EFDA / RDA)',
    specialty: 'Dental',
    gender: 'Female',
    state: 'NC',
    city: 'Charlotte / SouthPark',
    minRate: 32,
    experienceYears: 6,
    schedulePref: 'Mon–Thu Full-Time Private Practice',
    softwareSkills: ['Open Dental', 'CEREC Primescan', 'CBCT 3D', '4-Handed Implant Assist'],
    licenseNote: 'Active NC Dental Assistant II + Coronal Polishing & Sealant Certified',
    bio: 'Lead chairside dental assistant experienced in same-day CEREC crown design, implant surgery setup, and Invisalign scans.',
    contactEmail: 'efda.charlotte.talent@clinicstaffjobs.com',
    postedAgo: 'Active today',
  },
];

export default function ClinicianTalentPoolPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<TalentProfile[]>(INITIAL_TALENT_PROFILES);
  const [filterSpecialty, setFilterSpecialty] = useState('All');
  const [filterState, setFilterState] = useState('All');
  const [filterGender, setFilterGender] = useState<'All' | 'Female' | 'Male'>('All');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Pre-filled Candidate Profile Form State
  const [role, setRole] = useState('Registered Dental Hygienist (RDH)');
  const [specialty, setSpecialty] = useState('Dental');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Any'>('Female');
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
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  // Gemini AI Employer Invite Modal State
  const [inviteTarget, setInviteTarget] = useState<TalentProfile | null>(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [sentInviteIds, setSentInviteIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('anonymous_talent_profiles') || '[]');
      if (Array.isArray(saved) && saved.length > 0) {
        setProfiles([...saved, ...INITIAL_TALENT_PROFILES]);
      }
      const invited = JSON.parse(localStorage.getItem('employer_invited_candidates') || '[]');
      if (Array.isArray(invited)) {
        setSentInviteIds(invited);
      }
    } catch {
      // ignore
    }
  }, []);

  // Auto-fill from saved Candidate Account when logged in
  useEffect(() => {
    if (user && user.role === 'candidate') {
      if (user.specialty) setRole(user.specialty);
      if (user.gender) setGender(user.gender);
      if (user.stateCode) setStateCode(user.stateCode);
      if (user.city) setCity(user.city);
      if (user.desiredHourly) setMinRate(String(user.desiredHourly));
      if (user.skills) {
        setSoftwareInput(
          Array.isArray(user.skills) ? user.skills.join(', ') : String(user.skills)
        );
      }
      if (user.bio) setBio(user.bio);
      if (user.email) setContactEmail(user.email);
      if (user.licenseNumber) {
        setLicenseNote(`Active ${user.stateCode || 'State'} License (${user.licenseNumber})`);
      }
    }
  }, [user]);

  const handleGeminiBio = async () => {
    setIsGeneratingBio(true);
    try {
      const generated = await generateCandidateBioWithGemini({
        name: user?.name || 'Verified Healthcare Professional',
        role,
        experienceYears,
        city: `${city}, ${stateCode}`,
        desiredPay: minRate,
      });
      setBio(generated.bio);
      if (!softwareInput.trim()) {
        setSoftwareInput(generated.skills);
      }
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: TalentProfile = {
      id: `tal-${Date.now()}`,
      alias: `Verified Candidate #${Math.floor(1000 + Math.random() * 9000)} (Private Profile)`,
      role,
      specialty,
      gender,
      state: stateCode,
      city: city.trim() || 'Metro Area',
      minRate: Number(minRate) || 40,
      experienceYears: Number(experienceYears) || 3,
      schedulePref,
      softwareSkills: softwareInput.split(',').map((s) => s.trim()).filter(Boolean),
      licenseNote,
      bio:
        bio.trim() ||
        `Licensed ${role} seeking a patient-focused private ${specialty} clinic in ${city}, ${stateCode}.`,
      contactEmail: contactEmail.trim() || user?.email || 'talent@clinicstaffjobs.com',
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

  const handleOpenEmployerInvite = (prof: TalentProfile) => {
    setInviteTarget(prof);
    setIsGeneratingInvite(true);
    try {
      const res = generateInterviewInviteWithGemini({
        candidateName: prof.alias,
        role: prof.role,
        clinicName: user?.practiceName || 'Our Private Healthcare Clinic',
        city: `${prof.city}, ${prof.state}`,
        payRange: `$${prof.minRate}–$${prof.minRate + 6}/hr`,
      });
      setInviteMessage(res.emailDraft);
    } finally {
      setIsGeneratingInvite(false);
    }
  };

  const handleConfirmSendInvite = () => {
    if (!inviteTarget) return;
    const next = Array.from(new Set([...sentInviteIds, inviteTarget.id]));
    setSentInviteIds(next);
    localStorage.setItem('employer_invited_candidates', JSON.stringify(next));
    setInviteTarget(null);
  };

  const filteredProfiles = profiles.filter((p) => {
    const matchSpec = filterSpecialty === 'All' || p.specialty === filterSpecialty;
    const matchState = filterState === 'All' || p.state === filterState;
    const matchGender =
      filterGender === 'All' || !p.gender || p.gender === 'Any' || p.gender === filterGender;
    return matchSpec && matchState && matchGender;
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
                <span>Available Healthcare Candidates • 100% Free & Private</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Let Verified Private Clinics <span className="text-teal-400">Invite You to Interview</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Job Seekers: List your private candidate card (your real name and current employer stay hidden) with your target hourly pay, preferred days, and software skills. Clinic Owners: Browse available staff and send interview offers with Gemini AI.
              </p>
            </div>

            <div className="shrink-0">
              {!user ? (
                <Link
                  href="/signup?role=candidate&redirect=/talent"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-lg transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account to List Your Profile (Free)</span>
                </Link>
              ) : user.role === 'employer' ? (
                <Link
                  href="/dashboard/employer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm shadow-lg transition-all"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Open Employer Portal</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{showCreateForm ? 'Close Form' : 'List My Candidate Profile (Pre-Filled)'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {createdSuccess && (
          <div
            role="status"
            aria-live="polite"
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-sm font-bold"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Your private candidate card is now live! Verified clinics can now send interview & hourly pay offers directly to your account.
            </span>
          </div>
        )}

        {/* Create Candidate Profile Drawer (2-Column Aligned Layout) */}
        {showCreateForm && user?.role === 'candidate' && (
          <form
            onSubmit={handleCreateProfile}
            className="social-drawer-enter bg-white rounded-3xl border border-teal-300 p-6 sm:p-8 space-y-5 shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  List Your Private Candidate Card (Pre-Filled From Your Account)
                </h2>
                <p className="text-xs text-slate-500">
                  Your real name is hidden behind a private ID so your current clinic never knows you are open to offers.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <Lock className="w-3.5 h-3.5" /> Name Hidden from Public
              </span>
            </div>

            {/* Row 1: Role & Specialty (2 Equal Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="tal-role" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Your Job Role / Title *
                </label>
                <input
                  id="tal-role"
                  name="role"
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="tal-spec" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Clinic Specialty *
                </label>
                <select
                  id="tal-spec"
                  name="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className={inputClass}
                >
                  <option value="Dental">Dental Clinic</option>
                  <option value="Family Medicine">Family Medicine / Medical</option>
                  <option value="Vision">Eye & Vision Clinic</option>
                  <option value="Physical Therapy">Physical Therapy</option>
                  <option value="Dermatology & MedSpa">Dermatology & MedSpa</option>
                </select>
              </div>
            </div>

            {/* Row 2: Min Hourly Pay & Years of Experience (2 Equal Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="tal-rate" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Desired Hourly Pay ($/hr) *
                </label>
                <input
                  id="tal-rate"
                  name="minRate"
                  type="text"
                  inputMode="numeric"
                  required
                  value={minRate}
                  onChange={(e) => setMinRate(e.target.value.replace(/[^\d]/g, ''))}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="tal-exp" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Years of Experience *
                </label>
                <input
                  id="tal-exp"
                  name="experienceYears"
                  type="text"
                  inputMode="numeric"
                  required
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value.replace(/[^\d]/g, ''))}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 3: State & Preferred City (2 Equal Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="tal-state" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  State (All 52 States) *
                </label>
                <select
                  id="tal-state"
                  name="stateCode"
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
                <label htmlFor="tal-city" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Preferred City *
                </label>
                <input
                  id="tal-city"
                  name="city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 4: Preferred Schedule & Software Skills (2 Equal Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="tal-sched" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Preferred Work Schedule *
                </label>
                <input
                  id="tal-sched"
                  name="schedulePref"
                  type="text"
                  required
                  value={schedulePref}
                  onChange={(e) => setSchedulePref(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="tal-soft" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Clinic Software & Skills (Comma Separated)
                </label>
                <input
                  id="tal-soft"
                  name="softwareInput"
                  type="text"
                  value={softwareInput}
                  onChange={(e) => setSoftwareInput(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 5: Short Bio with Gemini AI Writer */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="tal-bio" className="block text-xs font-bold uppercase text-slate-700">
                  Short Candidate Summary
                </label>
                <button
                  type="button"
                  onClick={handleGeminiBio}
                  disabled={isGeneratingBio}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold cursor-pointer"
                >
                  {isGeneratingBio ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                      <span>Gemini AI Writing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>✨ Write Summary with Gemini AI</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="tal-bio"
                name="bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your clinic experience, patient care style, and what kind of clinic you want to join..."
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Publish My Private Candidate Card (100% Free) →
            </button>
          </form>
        )}

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-extrabold text-slate-900">
            Showing {filteredProfiles.length} Verified Candidates Open to Clinic Offers
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Filter by Specialty"
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-900"
            >
              <option value="All">All 5 Specialties</option>
              <option value="Dental">Dental Clinics</option>
              <option value="Family Medicine">Family Medicine</option>
              <option value="Vision">Eye & Vision</option>
              <option value="Physical Therapy">Physical Therapy</option>
              <option value="Dermatology & MedSpa">Dermatology & MedSpa</option>
            </select>

            <select
              aria-label="Filter by Gender"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value as any)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-900"
            >
              <option value="All">Any Gender (Male & Female)</option>
              <option value="Female">Female Staff</option>
              <option value="Male">Male Staff</option>
            </select>

            <select
              aria-label="Filter by US State"
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
          {filteredProfiles.map((prof) => {
            const alreadyInvited = sentInviteIds.includes(prof.id);
            return (
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
                        {prof.gender && prof.gender !== 'Any' && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                            {prof.gender}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900 mt-1.5">{prof.role}</h3>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        <span>
                          {prof.city}, {prof.state}
                        </span>
                        <span>•</span>
                        <span>{prof.experienceYears} Yrs Experience</span>
                      </div>
                    </div>

                    <div className="text-right bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
                      <div className="text-[10px] font-bold uppercase text-slate-500">Desired Pay</div>
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
                    🟢 Open to Clinic Interview Offers
                  </span>

                  {!user ? (
                    <Link
                      href="/signup?role=employer&redirect=/talent"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Sign In as Clinic to Invite →</span>
                    </Link>
                  ) : user.role === 'employer' ? (
                    alreadyInvited ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Interview Invite Sent</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenEmployerInvite(prof)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Invite with Gemini AI →</span>
                      </button>
                    )
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      Visible to Verified Employers
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gemini AI Interview Invitation Modal for Logged-In Employers */}
      {inviteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="talent-invite-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Gemini AI Interview Invitation
                </span>
                <h3 id="talent-invite-modal-title" className="text-lg font-extrabold text-slate-900 mt-0.5">
                  Invite {inviteTarget.alias}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInviteTarget(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                aria-label="Close invite modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isGeneratingInvite ? (
              <div className="py-8 text-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-teal-600 mx-auto" />
                <p className="text-xs font-bold text-slate-600">
                  Gemini AI is writing a personalized interview invitation from {user?.practiceName || 'your clinic'}...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <label htmlFor="invite-msg-box" className="block text-xs font-bold text-slate-700">
                  Review or Edit Your Invitation Message:
                </label>
                <textarea
                  id="invite-msg-box"
                  name="inviteMessage"
                  rows={6}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className={inputClass}
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInviteTarget(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSendInvite}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Interview Invitation</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
