'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Stethoscope,
  Bell,
  PlusCircle,
  Menu,
  X,
  User,
  LogOut,
  Building2,
  ShieldCheck,
  BookOpen,
  DollarSign
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Corporate Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                ClinicStaff<span className="text-teal-600">Jobs</span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 bg-teal-50 text-teal-800 rounded border border-teal-200">
                  52 States
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium tracking-tight">
                NPI-Verified US Healthcare & Dental Career Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="text-xs font-bold text-slate-700 hover:text-teal-600 transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              href="/employers"
              className="text-xs font-bold text-slate-700 hover:text-teal-600 transition-colors flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              <span>For Practices (B2B)</span>
            </Link>
            <Link
              href="/career-resources"
              className="text-xs font-bold text-slate-700 hover:text-teal-600 transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
              <span>Clinician Hub (B2C)</span>
            </Link>
            <Link
              href="/salary-calculator"
              className="text-xs font-bold text-slate-700 hover:text-teal-600 transition-colors flex items-center gap-1"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Wage Calculator</span>
            </Link>
            <Link
              href="/alerts"
              className="text-xs font-bold text-slate-700 hover:text-teal-600 transition-colors flex items-center gap-1"
            >
              <Bell className="w-3.5 h-3.5 text-amber-500" />
              <span>Free Job Alerts</span>
            </Link>
          </nav>

          {/* Auth & Free Employer Job Post CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  {user.role === 'employer' ? (
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-cyan-600" />
                  )}
                  <span>{user.role === 'employer' ? 'Practice Portal' : 'Clinician Portal'}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-teal-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            <Link
              href="/post-a-job"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post a Job</span>
              <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.2 rounded uppercase">
                100% Free
              </span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Browse All Clinic Jobs (52 States)
          </Link>
          <Link
            href="/employers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            For Practices & Employers (B2B)
          </Link>
          <Link
            href="/career-resources"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Clinician Career & Licensing Hub (B2C)
          </Link>
          <Link
            href="/salary-calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            2026 Wage Benchmark Calculator
          </Link>
          <Link
            href="/alerts"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Free Instant Job Alerts
          </Link>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            {user ? (
              <div className="space-y-2">
                <Link
                  href={user.role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-bold text-teal-700 bg-teal-50 rounded-lg"
                >
                  Open {user.role === 'employer' ? 'Practice' : 'Clinician'} Portal
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-rose-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-bold text-white bg-slate-900 rounded-lg"
                >
                  Create Account
                </Link>
              </div>
            )}

            <Link
              href="/post-a-job"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Practice Job (100% Free)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
