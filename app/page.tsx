'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SEED_JOBS, Job } from '@/data/jobs';
import JobCard from '@/components/JobCard';
import SalaryCalculator from '@/components/SalaryCalculator';
import { Search, MapPin, DollarSign, Filter, Sparkles, Bell, ShieldCheck, PlusCircle, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [minPay, setMinPay] = useState<number>(0);

  const categories = ['All', 'Dental', 'Physical Therapy', 'Vision', 'Dermatology & MedSpa', 'Family Medicine'];
  const locations = ['All', 'Dallas, TX', 'Houston, TX', 'Miami, FL', 'Orlando, FL', 'Atlanta, GA', 'Phoenix, AZ', 'Austin, TX', 'Tampa, FL'];

  const filteredJobs = useMemo(() => {
    return SEED_JOBS.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.softwareUsed.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || job.clinicType === selectedCategory;
      const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
      const matchesPay = minPay === 0 || job.maxHourly >= minPay;

      return matchesSearch && matchesCategory && matchesLocation && matchesPay;
    }).sort((a, b) => {
      // Featured jobs appear first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    });
  }, [searchTerm, selectedCategory, selectedLocation, minPay]);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Value Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white py-2 px-4 text-center text-xs font-medium border-b border-teal-800/40">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-teal-300 font-bold">
            <Sparkles className="w-3.5 h-3.5" /> 100% Salary Transparency:
          </span>
          <span>Every job verified with clear hourly pay & zero spam staffing agencies.</span>
          <Link href="/salary-calculator" className="underline text-teal-200 hover:text-white font-semibold ml-1">
            Check Your Metro's Rate →
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Exclusively for US Private Medical, Dental & Specialty Practices</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Find High-Paying Clinic Jobs <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
              With 100% Wage Transparency
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The direct hiring hub for Dental Hygienists, Dental Assistants, CMAs, and Clinic Staff. 
            No corporate hospital bureaucracy, no spam agencies, no hidden pay.
          </p>

          {/* Search Box Card */}
          <div className="mt-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/90 p-3 sm:p-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Keyword Search */}
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Job title, software (Dentrix), or skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Location Select */}
              <div className="sm:col-span-4 relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white text-slate-800"
                >
                  <option value="All">All US Metros</option>
                  {locations.filter((l) => l !== 'All').map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Pay Filter */}
              <div className="sm:col-span-3">
                <select
                  value={minPay}
                  onChange={(e) => setMinPay(Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white text-slate-800 font-medium"
                >
                  <option value={0}>Any Hourly Pay</option>
                  <option value={20}>Min $20/hr</option>
                  <option value={25}>Min $25/hr</option>
                  <option value={35}>Min $35/hr</option>
                  <option value={45}>Min $45/hr (RDH)</option>
                </select>
              </div>
            </div>

            {/* Category Quick Pills */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1 pr-1 hidden sm:inline">
                Practice:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'All' ? '🏥 All Practices' : cat === 'Dental' ? '🦷 Dental' : cat === 'Vision' ? '👁️ Optometry' : cat === 'Physical Therapy' ? '🏃 Physical Therapy' : cat === 'Dermatology & MedSpa' ? '✨ Dermatology' : '🩺 Family Med'}
                </button>
              ))}
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-4 flex items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500 font-medium flex-wrap">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 1,248 Active Positions
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 84 Verified Practices Added This Week
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Google for Jobs Indexed
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Job List */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Verified Practice Openings
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filteredJobs.length} active positions with verified pay rates
                </p>
              </div>

              {(selectedCategory !== 'All' || selectedLocation !== 'All' || searchTerm || minPay > 0) && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedLocation('All');
                    setSearchTerm('');
                    setMinPay(0);
                  }}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* List of Job Cards */}
            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white space-y-3">
                  <p className="text-sm font-semibold text-slate-700">
                    No openings found matching your exact filter criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedLocation('All');
                      setSearchTerm('');
                      setMinPay(0);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Inline Salary Calculator Banner */}
            <div className="mt-12">
              <SalaryCalculator />
            </div>
          </div>

          {/* Right Sidebar: Sticky Value Add & Employer CTA */}
          <div className="lg:w-80 space-y-6">
            {/* Employer Card ($99 Post a Job) */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950 text-white p-6 shadow-xl border border-teal-800/40 relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-900/60 px-2.5 py-1 rounded-md border border-teal-700/50">
                  For Practice Owners
                </span>
                <h3 className="text-xl font-extrabold tracking-tight leading-snug">
                  Hiring for your clinic? Fill your seat this week.
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Avoid paying $3,000 staffing agency fees or getting 200 spam resumes on Indeed. Reach local, certified clinic professionals directly.
                </p>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-black text-white">$99</span>
                    <span className="text-xs text-teal-300 font-medium">Flat 30-Day Listing</span>
                  </div>

                  <Link
                    href="/post-a-job"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Opening ($99)</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* VIP WhatsApp & SMS Network Card */}
            <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                <Bell className="w-4 h-4 animate-bounce" />
                <span>Instant Job Drops</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base leading-snug">
                Join our VIP Candidate SMS & WhatsApp Network
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-paying clinic roles get filled in 48 hours. Get notified the minute a top-paying practice lists an opening.
              </p>

              <Link
                href="/alerts"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
              >
                <span>Subscribe to Alerts (Free)</span>
              </Link>
            </div>

            {/* Practice Guarantee Box */}
            <div className="rounded-2xl bg-teal-50/60 p-5 border border-teal-100 space-y-2 text-xs text-teal-900">
              <span className="font-bold flex items-center gap-1.5 text-teal-800">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> Practice Standards
              </span>
              <p className="text-slate-600 leading-relaxed">
                All practices must specify exact appointment lengths and mandatory hourly compensation ranges. Zero blind listings permitted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
