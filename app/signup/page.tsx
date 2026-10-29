'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Stethoscope, Lock, Mail, Building2, User, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [role, setRole] = useState<UserRole>('employer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [practiceName, setPracticeName] = useState('');
  const [specialty, setSpecialty] = useState('Dental');
  const [location, setLocation] = useState('Dallas, TX');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup({
      name: name || (role === 'employer' ? 'Practice Manager' : 'Clinical Candidate'),
      email,
      role,
      practiceName: role === 'employer' ? practiceName : undefined,
      practiceType: role === 'employer' ? specialty : undefined,
      specialty: role === 'candidate' ? specialty : undefined,
      location,
      phone
    });

    router.push(role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">
            ClinicStaff<span className="text-teal-600">Jobs</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Your Account
        </h2>
        <p className="text-xs text-slate-600">
          Join the direct healthcare hiring network
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10 space-y-6">
          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                role === 'employer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>I am an Employer / Clinic</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                role === 'candidate'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-cyan-600" />
              <span>I am a Job Seeker / Staff</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {role === 'employer' ? 'Your Name / Title' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={role === 'employer' ? 'Dr. Sarah Mitchell' : 'Jessica Taylor'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Role specific inputs */}
            {role === 'employer' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Practice / Clinic Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. North Dallas Dental"
                    value={practiceName}
                    onChange={(e) => setPracticeName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Practice Specialty *
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Dental">Dental Practice</option>
                    <option value="Vision">Optometry & Eye Care</option>
                    <option value="Physical Therapy">Physical Therapy / Ortho</option>
                    <option value="Dermatology & MedSpa">Dermatology & MedSpa</option>
                    <option value="Family Medicine">Family Medicine Clinic</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Clinical Role *
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Registered Dental Hygienist">Registered Dental Hygienist (RDH)</option>
                    <option value="Dental Assistant (RDA/EFDA)">Dental Assistant (RDA/EFDA)</option>
                    <option value="Certified Medical Assistant">Certified Medical Assistant (CMA)</option>
                    <option value="Physical Therapy Aide">Physical Therapy Aide / Tech</option>
                    <option value="Optometric Tech">Optometric & Vision Tech</option>
                    <option value="Clinic Front Desk">Clinic Front Desk & Billing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Metro & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Metro Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dallas, TX"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Create {role === 'employer' ? 'Practice' : 'Candidate'} Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-teal-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
