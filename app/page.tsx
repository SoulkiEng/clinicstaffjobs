'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ALL_JOBS, Job } from '@/data/jobs';
import { supabase } from '@/lib/supabase';
import JobCard from '@/components/JobCard';
import SalaryCalculator from '@/components/SalaryCalculator';
import {
  Search,
  MapPin,
  DollarSign,
  Filter,
  Sparkles,
  Bell,
  ShieldCheck,
  PlusCircle,
  CheckCircle2,
  ChevronDown,
  RefreshCw
} from 'lucide-react';

function mapDbJob(raw: any): Job {
  return {
    id: raw.id,
    title: raw.title,
    clinicName: raw.clinic_name,
    clinicType: raw.clinic_type,
    location: raw.location,
    city: raw.city,
    state: raw.state,
    zipCode: raw.zip_code,
    workType: raw.work_type || 'Full-time',
    minHourly: Number(raw.min_hourly),
    maxHourly: Number(raw.max_hourly),
    payPeriod: raw.pay_period || 'hour',
    payComparison: raw.pay_comparison || '+16% Above City Avg',
    isFeatured: Boolean(raw.is_featured),
    isUrgent: Boolean(raw.is_urgent),
    verifiedActive: Boolean(raw.verified_active),
    appointmentTime: raw.appointment_time,
    softwareUsed: Array.isArray(raw.software_used) ? raw.software_used : [],
    benefits: Array.isArray(raw.benefits) ? raw.benefits : [],
    description: raw.description,
    responsibilities: Array.isArray(raw.responsibilities) ? raw.responsibilities : [],
    qualifications: Array.isArray(raw.qualifications) ? raw.qualifications : [],
    applyEmail: raw.apply_email,
    applyUrl: raw.apply_url || '',
    postedDate: raw.created_at || new Date().toISOString(),
  };
}

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>(ALL_JOBS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [minPay, setMinPay] = useState<number>(0);
  const [visibleCount, setVisibleCount] = useState<number>(25);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categories = ['All', 'Dental', 'Physical Therapy', 'Vision', 'Dermatology & MedSpa', 'Family Medicine'];

  // Dynamically extract all available US Metros from the jobs list
  const availableLocations = useMemo(() => {
    const locSet = new Set<string>();
    jobs.forEach((j) => {
      if (j.location) locSet.add(j.location);
    });
    return ['All', ...Array.from(locSet).sort()];
  }, [jobs]);

  // Fetch live jobs from Supabase & localStorage on client mount
  useEffect(() => {
    async function loadLiveFeed() {
      try {
        setIsRefreshing(true);

        // 1. Fetch live jobs from Supabase
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(800);

        if (data && data.length > 0) {
          const liveMapped = data.map(mapDbJob);

          // 2. Fetch locally posted jobs from localStorage (if any)
          const localRaw = typeof window !== 'undefined' ? localStorage.getItem('my_posted_jobs') : null;
          const localJobs = localRaw ? JSON.parse(localRaw).map(mapDbJob) : [];

          // Merge: Locally created jobs at top, then Supabase records, then remaining ALL_JOBS
          const seenIds = new Set<string>();
          const merged: Job[] = [];

          [...localJobs, ...liveMapped, ...ALL_JOBS].forEach((j) => {
            if (!seenIds.has(j.id)) {
              seenIds.add(j.id);
              merged.push(j);
            }
          });

          setJobs(merged);
        }
      } catch (err) {
        console.warn('Network note loading live jobs:', err);
      } finally {
        setIsRefreshing(false);
      }
    }

    loadLiveFeed();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(term) ||
        job.clinicName.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term) ||
        job.softwareUsed.some((s) => s.toLowerCase().includes(term));

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
  }, [jobs, searchTerm, selectedCategory, selectedLocation, minPay]);

  const displayedJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 25);
  };

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
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setVisibleCount(25);
                  }}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Location Select */}
              <div className="sm:col-span-4 relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setVisibleCount(25);
                  }}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white text-slate-800"
                >
                  <option value="All">All US Metros ({availableLocations.length - 1} cities)</option>
                  {availableLocations.filter((l) => l !== 'All').map((loc) => (
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
                  onChange={(e) => {
                    setMinPay(Number(e.target.value));
                    setVisibleCount(25);
                  }}
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
                  onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleCount(25);
                  }}
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
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {jobs.length.toLocaleString()} Active Positions Live
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 46 US Metros Covered
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
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Verified Practice Openings</span>
                  {isRefreshing && <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {displayedJobs.length} of {filteredJobs.length} matching positions ({jobs.length.toLocaleString()} total in database)
                </p>
              </div>

              {(selectedCategory !== 'All' || selectedLocation !== 'All' || searchTerm || minPay > 0) && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedLocation('All');
                    setSearchTerm('');
                    setMinPay(0);
                    setVisibleCount(25);
                  }}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* List of Job Cards */}
            <div className="space-y-4">
              {displayedJobs.length > 0 ? (
                displayedJobs.map((job) => <JobCard key={job.id} job={job} />)
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
                      setVisibleCount(25);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredJobs.length && (
              <div className="pt-6 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-teal-500 text-slate-800 hover:text-teal-700 font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <span>Load More Openings ({filteredJobs.length - visibleCount} remaining)</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Inline Salary Calculator Banner */}
            <div className="mt-12">
              <SalaryCalculator />
            </div>
          </div>

          {/* Right Sidebar: Sticky Value Add & Employer CTA */}
          <div className="lg:w-80 space-y-6">
            {/* Post a Job Box */}
            <div className="bg-white rounded-2xl border border-teal-200/80 shadow-md p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-500/10 to-transparent rounded-bl-full pointer-events-none" />
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold">
                <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
                <span>For Private Practices</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                Hiring Dental or Clinic Staff?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Skip the $3,000 staffing recruiter fees. Reach local, licensed healthcare candidates with mandatory wage transparency.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>30-Day Featured Job Post ($99 Flat)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Google for Jobs Structured Indexing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Zero Spam Guarantee</span>
                </div>
              </div>
              <Link
                href="/post-a-job"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all"
              >
                <span>+ Post a Practice Opening ($99)</span>
              </Link>
            </div>

            {/* Candidate Alerts Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-md">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Get Instant SMS & WhatsApp Job Alerts
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Be the first to know when a high-paying private practice opens in your area.
              </p>
              <Link
                href="/alerts"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-colors"
              >
                Join Candidate Alert Network
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
