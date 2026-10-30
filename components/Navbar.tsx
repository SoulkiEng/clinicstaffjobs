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
  Compass,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname() || '/';
  const { user, logout } = useAuth();

  const navItems = [
    { href: '/', label: 'Live Feed', icon: Compass },
    { href: '/employers', label: 'Practices (B2B)', icon: Building2 },
    { href: '/career-resources', label: 'Clinician Hub', icon: BookOpen },
    { href: '/salary-calculator', label: 'Pay Calculator', icon: DollarSign },
    { href: '/alerts', label: 'Job Alerts', icon: Bell, badge: 'Free' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_12px_-4px_rgba(15,23,42,0.06)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Brand Logo (Compact, Non-Overlapping, Modern Social Pulse) */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/25 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <Stethoscope className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white" />
              </span>
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900">
                  ClinicStaff<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Jobs</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded-md border border-teal-200/80 whitespace-nowrap">
                  52 States
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold tracking-tight whitespace-nowrap mt-0.5">
                NPI-Verified Career Network
              </span>
            </div>
          </Link>

          {/* Center: Social-Style Pill Navigation (Zero Wrapping) */}
          <nav className="hidden xl:flex items-center gap-1 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/70">
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
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                      isActive ? 'text-teal-600 scale-110' : 'text-slate-400'
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

          {/* Right: Auth & Animated Free Post CTA (Zero Wrapping) */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate'}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold whitespace-nowrap transition-all"
                >
                  {user.role === 'employer' ? (
                    <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  )}
                  <span>{user.role === 'employer' ? 'Practice Portal' : 'My Profile'}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl whitespace-nowrap transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200/90 rounded-xl whitespace-nowrap transition-all"
                >
                  Join Free
                </Link>
              </div>
            )}

            <Link
              href="/post-a-job"
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-extrabold whitespace-nowrap shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              <PlusCircle className="w-3.5 h-3.5 shrink-0 group-hover:rotate-90 transition-transform duration-300" />
              <span>Post a Job</span>
              <span className="text-[10px] bg-white/20 backdrop-blur-xs text-white font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide whitespace-nowrap">
                FREE
              </span>
            </Link>
          </div>

          {/* Mobile & Tablet Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <Link
              href="/post-a-job"
              className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Free</span>
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

      {/* Mobile / Tablet Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-2 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
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
                  className="block px-3.5 py-2.5 text-sm font-bold text-teal-700 bg-teal-50 rounded-xl"
                >
                  Open {user.role === 'employer' ? 'Practice' : 'Clinician'} Portal
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
                  Join Free
                </Link>
              </div>
            )}

            <Link
              href="/post-a-job"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-extrabold text-sm shadow-md"
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
