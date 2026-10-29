'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Stethoscope, Lock, Mail, ArrowRight, ShieldCheck, Building2, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>('employer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || (role === 'employer' ? 'dr.sarah@prestonhollowdental.com' : 'jessica.rdh@gmail.com'), role);
    router.push(role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate');
  };

  const handleDemoLogin = (selectedRole: UserRole) => {
    login(selectedRole === 'employer' ? 'demo.clinic@clinicstaffjobs.com' : 'demo.candidate@clinicstaffjobs.com', selectedRole);
    router.push(selectedRole === 'employer' ? '/dashboard/employer' : '/dashboard/candidate');
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
          Sign In to Your Account
        </h2>
        <p className="text-xs text-slate-600">
          Access your clinical hiring dashboard or candidate profile
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
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
              <span>Practice / Doctor</span>
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
              <span>Job Seeker / Staff</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'employer' ? 'doctor@clinic.com' : 'hygienist@email.com'}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <a href="#" className="text-xs text-teal-600 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In as {role === 'employer' ? 'Practice' : 'Candidate'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Buttons */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="block text-[11px] font-semibold text-center text-slate-400 uppercase tracking-wider">
              Or Instant 1-Click Test Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemoLogin('employer')}
                className="py-2 px-3 text-xs font-semibold rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors"
              >
                Demo Clinic Doctor
              </button>
              <button
                onClick={() => handleDemoLogin('candidate')}
                className="py-2 px-3 text-xs font-semibold rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 transition-colors"
              >
                Demo Candidate (RDH)
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-600">
              Don't have an account yet?{' '}
              <Link href="/signup" className="text-teal-600 font-bold hover:underline">
                Register Free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
