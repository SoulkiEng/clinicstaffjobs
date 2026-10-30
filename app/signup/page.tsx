'use client';

import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Upload
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [role, setRole] = useState<UserRole>('candidate');
  const [redirectTo, setRedirectTo] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Role-Specific Fields (Saved once so user never has to re-type them)
  const [practiceName, setPracticeName] = useState('');
  const [npiNumber, setNpiNumber] = useState('');
  const [specialty, setSpecialty] = useState('Dental');
  const [candidateRole, setCandidateRole] = useState('Registered Dental Hygienist (RDH)');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Any'>('Female');
  const [yearsExperience, setYearsExperience] = useState('1–3 Years');
  const [city, setCity] = useState('Dallas');
  const [stateCode, setStateCode] = useState('TX');
  const [zipCode, setZipCode] = useState('75225');
  const [phone, setPhone] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('role');
      const red = params.get('redirect');
      if (r === 'employer' || r === 'candidate') {
        setRole(r);
      }
      if (red) {
        setRedirectTo(red);
      }
    }
  }, []);

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
        npiNumber: role === 'employer' && npiNumber.trim() ? npiNumber.trim() : undefined,
        specialty: role === 'candidate' ? candidateRole : undefined,
        yearsExperience: role === 'candidate' ? yearsExperience : undefined,
        resumeFileName:
          role === 'candidate'
            ? resumeFileName || `${name.trim().replace(/\s+/g, '_')}_Resume.pdf`
            : undefined,
        city: city.trim() || 'Dallas',
        stateCode,
        zipCode: zipCode.trim() || '75225',
        location: fullLocation,
        phone: phone.trim() || undefined,
      });

      if (!res.ok) {
        setErrorMsg(res.error || 'Could not create account.');
        return;
      }

      if (redirectTo && redirectTo.startsWith('/')) {
        router.push(redirectTo);
      } else {
        router.push(role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            ClinicStaff<span className="text-teal-600">Jobs</span>
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900">
          {redirectTo === '/post-a-job'
            ? 'Create Your Free Employer Account to Post a Job'
            : redirectTo.startsWith('/jobs/')
            ? 'Create Your Free Job Seeker Account to Apply'
            : 'Create Your Free Account'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Save your information once in your account—never re-type the same details again.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xs border border-slate-200 rounded-2xl sm:px-8 space-y-6">
          {/* 2-Button Account Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 text-center">
              Choose your account type:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <span>I Need a Job (Job Seeker)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Save your CV & profile once to apply to any clinic job
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
                  <span>I Want to Hire (Employer)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Save your clinic profile once & post unlimited free jobs
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
            {/* Row 1: Full Name & Email (2 Equal Aligned Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="signup-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  id="signup-name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder={role === 'employer' ? 'Dr. Sarah Mitchell' : 'Jessica Taylor'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 2: Role-Specific Fields */}
            {role === 'candidate' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <label htmlFor="signup-cand-role" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Job Role / Specialty *
                    </label>
                    <select
                      id="signup-cand-role"
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
                    <label htmlFor="signup-cand-gender" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Gender
                    </label>
                    <select
                      id="signup-cand-gender"
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

                {/* Experience & Optional CV Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <label htmlFor="signup-cand-exp" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Experience Level
                    </label>
                    <select
                      id="signup-cand-exp"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      className={inputClass}
                    >
                      <option value="Entry Level">Entry Level / New Grad</option>
                      <option value="1–3 Years">1–3 Years Experience</option>
                      <option value="3+ Years">3+ Years (Senior / Lead)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Upload CV / Resume (Optional)
                    </label>
                    <label className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-dashed border-teal-400 bg-teal-50/50 hover:bg-teal-50 text-teal-900 font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="truncate">
                        {resumeFileName ? `Attached: ${resumeFileName}` : 'Choose CV File (PDF / DOCX)'}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setResumeFileName(f.name);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <label htmlFor="signup-clinic-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Clinic / Practice Name *
                    </label>
                    <input
                      id="signup-clinic-name"
                      type="text"
                      required
                      placeholder="Preston Hollow Dental"
                      value={practiceName}
                      onChange={(e) => setPracticeName(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="signup-clinic-type" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Clinic Specialty *
                    </label>
                    <select
                      id="signup-clinic-type"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <label htmlFor="signup-npi" className="block text-xs font-bold text-slate-700 mb-1.5">
                      10-Digit Clinic NPI (Optional)
                    </label>
                    <input
                      id="signup-npi"
                      type="text"
                      inputMode="numeric"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      maxLength={10}
                      placeholder="e.g. 1487920319"
                      value={npiNumber}
                      onChange={(e) => setNpiNumber(e.target.value.replace(/\D/g, ''))}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="signup-zip" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Clinic ZIP Code *
                    </label>
                    <input
                      id="signup-zip"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      required
                      placeholder="75225"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Row 3: City & State (2 Equal Aligned Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="signup-city" className="block text-xs font-bold text-slate-700 mb-1.5">
                  City *
                </label>
                <input
                  id="signup-city"
                  type="text"
                  required
                  placeholder="Dallas"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="signup-state" className="block text-xs font-bold text-slate-700 mb-1.5">
                  State (All 52 States) *
                </label>
                <select
                  id="signup-state"
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
            </div>

            {/* Row 4: Phone & Password (2 Equal Aligned Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="signup-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number *
                </label>
                <input
                  id="signup-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="(214) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password (6+ characters) *
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {role === 'candidate'
                  ? 'Saved Once: Your name, phone, role, and CV will be saved to your profile so you can apply to any job in 1 click.'
                  : 'Saved Once: Your clinic name, specialty, NPI, and location will be saved so you never have to re-type them when posting jobs.'}
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
                  <span>Saving Account...</span>
                </>
              ) : (
                <>
                  <span>
                    {redirectTo === '/post-a-job'
                      ? 'Create Employer Account & Continue to Post Job'
                      : redirectTo.startsWith('/jobs/')
                      ? 'Create Job Seeker Account & Continue to Apply'
                      : `Create Free ${role === 'candidate' ? 'Job Seeker' : 'Employer'} Account`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-1 border-t border-slate-100">
            <p className="text-xs text-slate-600 pt-2">
              Already have an account?{' '}
              <Link
                href={`/login${
                  redirectTo ? `?role=${role}&redirect=${encodeURIComponent(redirectTo)}` : ''
                }`}
                className="text-teal-600 font-bold hover:underline"
              >
                Sign In Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
