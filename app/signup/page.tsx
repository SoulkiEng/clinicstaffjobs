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
  CheckCircle2
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [role, setRole] = useState<UserRole>('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Simple Role-Specific Fields
  const [practiceName, setPracticeName] = useState('');
  const [specialty, setSpecialty] = useState('Dental');
  const [candidateRole, setCandidateRole] = useState('Registered Dental Hygienist (RDH)');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Any'>('Female');
  const [city, setCity] = useState('Dallas');
  const [stateCode, setStateCode] = useState('TX');
  const [phone, setPhone] = useState('');
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
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (role === 'employer' && !practiceName.trim()) {
      setErrorMsg('Please enter your Clinic or Practice name.');
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
        gender,
        practiceName: role === 'employer' ? practiceName.trim() : undefined,
        practiceType: role === 'employer' ? specialty : undefined,
        specialty: role === 'candidate' ? candidateRole : undefined,
        city: city.trim() || 'Dallas',
        stateCode,
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            ClinicStaff<span className="text-teal-600">Jobs</span>
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Create Your Free Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Save your profile once—apply to jobs or post openings in 1 click.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-xs border border-slate-200 rounded-2xl sm:px-8 space-y-6">
          {/* Simple 2-Button Choice: Job Seeker vs Employer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 text-center">
              Who are you creating an account for?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRole('candidate');
                  setErrorMsg(null);
                }}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  role === 'candidate'
                    ? 'border-teal-600 bg-teal-50/60 text-slate-900 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
                  <User className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Job Seeker</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  I am looking for a clinic job & want to save my CV
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('employer');
                  setErrorMsg(null);
                }}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  role === 'employer'
                    ? 'border-teal-600 bg-teal-50/60 text-slate-900 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
                  <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Employer / Clinic</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  I want to post jobs & hire clinic staff for free
                </p>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder={role === 'employer' ? 'Dr. Sarah Mitchell' : 'Jessica Taylor'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Role-Specific Simple Row */}
            {role === 'candidate' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Job Title / Role *
                  </label>
                  <select
                    value={candidateRole}
                    onChange={(e) => setCandidateRole(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Registered Dental Hygienist (RDH)">Dental Hygienist (RDH)</option>
                    <option value="Dental Assistant (RDA / EFDA)">Dental Assistant (RDA)</option>
                    <option value="Certified Medical Assistant (CMA)">Medical Assistant (CMA)</option>
                    <option value="Physical Therapist Assistant (PTA)">Physical Therapy Assistant / Aide</option>
                    <option value="Optometric Tech / Optician">Optician / Eye Tech</option>
                    <option value="Dermatology / MedSpa Assistant">Dermatology / MedSpa Staff</option>
                    <option value="Front Desk / Receptionist / Manager">Front Desk / Clinic Manager</option>
                    <option value="Dentist / Doctor (DDS / MD / NP)">Dentist / Doctor / NP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className={inputClass}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Any">Prefer not to say</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Clinic / Practice Name *
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Clinic Type *
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Dental">Dental Clinic</option>
                    <option value="Family Medicine">Family Medicine / Medical</option>
                    <option value="Vision">Eye & Vision Clinic</option>
                    <option value="Physical Therapy">Physical Therapy Clinic</option>
                    <option value="Dermatology & MedSpa">Dermatology & MedSpa</option>
                  </select>
                </div>
              </div>
            )}

            {/* City, State & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
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
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  State *
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
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="(214) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Create a Password (At least 6 characters) *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {role === 'candidate'
                  ? '100% Free Job Seeker Account: Upload your CV, apply in 1 click, and track your applications.'
                  : '100% Free Employer Account: Post unlimited jobs, manage active/closed listings, and contact candidates.'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Your Account...</span>
                </>
              ) : (
                <>
                  <span>
                    Create Free {role === 'candidate' ? 'Job Seeker' : 'Employer'} Account
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-1 border-t border-slate-100">
            <p className="text-xs text-slate-600 pt-2">
              Already have an account?{' '}
              <Link href="/login" className="text-teal-600 font-bold hover:underline">
                Sign In Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
