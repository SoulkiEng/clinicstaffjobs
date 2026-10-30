'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  BookOpen,
  DollarSign,
  Search,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname() || '/';
  const { user, logout } = useAuth();

  const navItems = [
    { href: '/', label: 'Find Jobs', icon: Search },
    { href: '/talent', label: 'Candidates', icon: Sparkles },
    { href: '/employers', label: 'For Employers', icon: Building2 },
    { href: '/salary-calculator', label: 'Salary Calculator', icon: DollarSign },
    { href: '/career-resources', label: 'Career Advice', icon: BookOpen },
    { href: '/alerts', label: 'Job Alerts', icon: Bell, badge: 'Free' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 transition-colors">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900">
                  ClinicStaff<span className="text-teal-600">Jobs</span>
                </span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded border border-teal-200 whitespace-nowrap">
                  USA
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap mt-0.5">
                US Healthcare & Dental Jobs
              </span>
            </div>
          </Link>

          {/* Center: Clean Pill Navigation (Zero Wrapping) */}
          <nav className="hidden xl:flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-2xs ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-teal-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 whitespace-nowrap">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Auth & Post a Job Button */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate'}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold whitespace-nowrap transition-all"
                >
                  {user.role === 'employer' ? (
                    <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  )}
                  <span>{user.role === 'employer' ? 'Employer Account' : 'My Account & CV'}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl whitespace-nowrap transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl whitespace-nowrap transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}

            <Link
              href="/post-a-job"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold whitespace-nowrap shadow-xs transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Post a Job (Free)</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <Link
              href="/post-a-job"
              className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Job</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-teal-600" />
                  <span>{item.label}</span>
                </span>
                {item.badge && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {user ? (
              <div className="space-y-2">
                <Link
                  href={user.role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 text-sm font-bold text-teal-800 bg-teal-50 rounded-xl"
                >
                  Open {user.role === 'employer' ? 'Employer Account' : 'My Account & CV'}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm font-semibold text-rose-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-white bg-slate-900 rounded-xl"
                >
                  Create Account
                </Link>
              </div>
            )}

            <Link
              href="/post-a-job"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-600 text-white font-extrabold text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Job (100% Free)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
