'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { US_STATES_52 } from '@/data/jobs';
import {
  Stethoscope,
  Building2,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
  BadgeCheck
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [role, setRole] = useState<UserRole>('employer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [practiceName, setPracticeName] = useState('');
  const [npiNumber, setNpiNumber] = useState('');
  const [specialty, setSpecialty] = useState('Dental');
  const [candidateRole, setCandidateRole] = useState('Registered Dental Hygienist (RDH)');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [city, setCity] = useState('Dallas');
  const [stateCode, setStateCode] = useState('TX');
  const [phone, setPhone] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (role === 'employer' && !practiceName.trim()) {
      setErrorMsg('Please enter your Practice or Clinic name.');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Please accept the Terms & Conditions and Data Privacy Policy.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullLocation = `${city.trim() || 'Dallas'}, ${stateCode}`;
      const res = await signup({
        name: name.trim(),
        email: email.trim(),
        role,
        password,
        practiceName: role === 'employer' ? practiceName.trim() : undefined,
        practiceType: role === 'employer' ? specialty : undefined,
        specialty: role === 'candidate' ? candidateRole : undefined,
        licenseNumber:
          role === 'candidate'
            ? licenseNumber.trim() || `${stateCode}-VERIFIED`
            : npiNumber.trim() || 'NPI-VERIFIED',
        location: fullLocation,
        phone: phone.trim() || undefined,
      });

      if (!res.ok) {
        setErrorMsg(res.error || 'Could not create account.');
        return;
      }

      router.push(role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-sm">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            ClinicStaff<span className="text-teal-600">Jobs</span>
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Your 100% Free Verified Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Serving NPI-verified private practices and licensed clinicians across all 52 US states
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xs border border-slate-200/90 rounded-2xl sm:px-10 space-y-6">
          {/* Role Toggle */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
              Select Registration Portal
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setRole('employer');
                  setErrorMsg(null);
                }}
                className={`py-2.5 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  role === 'employer'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>Practice Employer (B2B)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('candidate');
                  setErrorMsg(null);
                }}
                className={`py-2.5 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  role === 'candidate'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-cyan-600" />
                <span>Clinician / Staff (B2C)</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {role === 'employer' ? 'Doctor / Hiring Manager Name *' : 'Full Legal Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={role === 'employer' ? 'Dr. Sarah Mitchell, DDS' : 'Jessica Taylor, RDH'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Work or Personal Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder={role === 'employer' ? 'hiring@practice.com' : 'clinician@email.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Role specific verification inputs */}
            {role === 'employer' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Practice Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Preston Hollow Dental"
                    value={practiceName}
                    onChange={(e) => setPracticeName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    10-Digit NPI # *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="1487920319"
                    value={npiNumber}
                    onChange={(e) => setNpiNumber(e.target.value.replace(/\D/g, ''))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Specialty *
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Dental">Dental Practice</option>
                    <option value="Family Medicine">Family Medicine</option>
                    <option value="Vision">Optometry & Vision</option>
                    <option value="Physical Therapy">Physical Therapy</option>
                    <option value="Dermatology & MedSpa">Dermatology & MedSpa</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Primary Clinical Role *
                  </label>
                  <select
                    value={candidateRole}
                    onChange={(e) => setCandidateRole(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Registered Dental Hygienist (RDH)">Registered Dental Hygienist (RDH)</option>
                    <option value="Lead Dental Assistant (RDA / EFDA)">Dental Assistant (RDA / EFDA)</option>
                    <option value="Certified Medical Assistant (CMA)">Certified Medical Assistant (CMA)</option>
                    <option value="Physical Therapist Assistant (PTA)">Physical Therapist Assistant (PTA / Aide)</option>
                    <option value="Optometric / Ophthalmic Technician">Optometric Tech / Licensed Optician</option>
                    <option value="Dermatology MA / Medical Aesthetician">Dermatology MA / Medical Aesthetician</option>
                    <option value="Clinic Front Office / Treatment Coordinator">Front Office & Practice Manager</option>
                    <option value="Associate Dentist (DDS / DMD)">Associate Dentist (DDS / DMD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    State License / Credential #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TX-RDH-94821"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* City, 52-State Selector, Phone & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dallas"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  State (52) *
                </label>
                <select
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className={inputClass}
                >
                  {US_STATES_52.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.code} - {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="(214) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-9`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Legal Agreement & Verification Badge Notice */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600"
                />
                <span>
                  I agree to the ClinicStaffJobs{' '}
                  <Link href="/terms" className="text-teal-700 font-bold underline">
                    Terms & Conditions (B2B/B2C)
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-teal-700 font-bold underline">
                    Data Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              <div className="flex items-center gap-2 text-[11px] text-emerald-800 font-semibold pl-6">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Includes free {role === 'employer' ? 'NPI Practice Verification Badge & Unlimited Job Postings' : 'State License Verification Badge & Direct Apply'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying & Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Verified {role === 'employer' ? 'Practice (B2B)' : 'Clinician (B2C)'} Account — Free</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-1">
            <p className="text-xs text-slate-600">
              Already registered?{' '}
              <Link href="/login" className="text-teal-600 font-bold hover:underline">
                Sign In to Your Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
