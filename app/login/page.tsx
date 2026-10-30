'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import {
  Stethoscope,
  Lock,
  Mail,
  ArrowRight,
  Building2,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>('employer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResetSent(false);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid work or personal email address.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Please enter your account password (minimum 4 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, role, password);
      if (!res.ok) {
        setErrorMsg(res.error || 'Unable to sign in. Please check your credentials.');
        return;
      }
      router.push(role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (selectedRole: UserRole) => {
    setIsSubmitting(true);
    const demoEmail =
      selectedRole === 'employer'
        ? 'dr.mitchell@prestonhollowdental.com'
        : 'jessica.taylor.rdh@gmail.com';
    await login(demoEmail, selectedRole, 'demo1234');
    router.push(selectedRole === 'employer' ? '/dashboard/employer' : '/dashboard/candidate');
  };

  const handleForgotPassword = () => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Enter your email address above first so we can send a password reset link.');
      return;
    }
    setErrorMsg(null);
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
            <Stethoscope className="w-5 h-5" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">
            ClinicStaff<span className="text-teal-600">Jobs</span>
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Your Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage your practice job postings or access your clinical candidate profile
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/90 rounded-2xl sm:px-10 space-y-6">
          {/* Role Selector Tabs */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
              Select Account Portal
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
                <span>Practice / Employer</span>
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
                <span>Clinician / Staff</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {resetSent && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Password reset instructions have been sent to <strong>{email}</strong>.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'employer' ? 'dr.mitchell@practice.com' : 'clinician@email.com'}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to {role === 'employer' ? 'Practice Portal' : 'Candidate Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Instant Demo Access for Testing */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <span className="block text-[11px] font-bold text-center text-slate-400 uppercase tracking-wider">
              Instant Demo Portal Access
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('employer')}
                className="py-2 px-3 text-xs font-bold rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 transition-colors"
              >
                Practice Owner Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('candidate')}
                className="py-2 px-3 text-xs font-bold rounded-xl bg-slate-50 hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 border border-slate-200 hover:border-cyan-300 transition-colors"
              >
                Clinician (RDH) Demo
              </button>
            </div>
          </div>

          <div className="text-center pt-1">
            <p className="text-xs text-slate-600">
              New to ClinicStaffJobs?{' '}
              <Link href="/signup" className="text-teal-600 font-bold hover:underline">
                Create a Free Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
