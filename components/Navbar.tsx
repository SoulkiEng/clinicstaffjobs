'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Stethoscope, Bell, PlusCircle, Menu, X, User, LogOut, Building2 } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                ClinicStaff<span className="text-teal-600">Jobs</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded border border-teal-200">
                  USA
                </span>
              </span>
              <span className="text-[11px] text-slate-700 font-medium tracking-tight">Private Healthcare & Dental Network</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <Link 
              href="/" 
              className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors"
            >
              Browse Jobs
            </Link>
            <Link 
              href="/salary-calculator" 
              className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors flex items-center gap-1.5"
            >
              <span>Salary Calculator</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full">
                FREE
              </span>
            </Link>
            <Link 
              href="/alerts" 
              className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors flex items-center gap-1.5"
            >
              <Bell className="w-4 h-4 text-amber-500" />
              <span>VIP Alerts</span>
            </Link>
          </nav>

          {/* User Auth & Employer CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
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
                  <span>Dashboard</span>
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
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-teal-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            <Link
              href="/post-a-job"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post a Job</span>
              <span className="text-[10px] bg-teal-700/80 px-1.5 py-0.2 rounded text-teal-100">
                $99
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Browse Jobs
          </Link>
          <Link
            href="/salary-calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
          >
            <span>Salary Calculator</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">FREE</span>
          </Link>
          <Link
            href="/alerts"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span>VIP Alerts</span>
          </Link>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            {user ? (
              <div className="space-y-2">
                <Link
                  href={user.role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-bold text-teal-700 bg-teal-50 rounded-lg"
                >
                  Go to {user.role === 'employer' ? 'Practice' : 'Candidate'} Dashboard
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
                  className="py-2 text-center text-xs font-bold text-white bg-teal-600 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}

            <Link
              href="/post-a-job"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 text-white font-semibold text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Clinic Job ($99)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
