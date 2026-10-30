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
  Sparkles,
  Bell,
  ShieldCheck,
  PlusCircle,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
  SlidersHorizontal,
  Bookmark,
  ArrowUpDown,
  Building2,
  X
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
    payComparison: raw.pay_comparison || '+15% Above City Avg',
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

const ROLE_QUICK_FILTERS = [
  { label: 'All Roles', query: '' },
  { label: 'Dental Hygienist (RDH)', query: 'Hygienist' },
  { label: 'Dental Assistant (RDA/EFDA)', query: 'Dental Assistant' },
  { label: 'Medical Assistant (CMA)', query: 'Medical Assistant' },
  { label: 'Optician & Eye Tech', query: 'Opt' },
  { label: 'Physical Therapy (PTA/Aide)', query: 'Physical Therap' },
  { label: 'Front Office & Coordinator', query: 'Coordinator' },
  { label: 'Associate Dentist (DDS)', query: 'Dentist' },
];

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>(ALL_JOBS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedWorkType, setSelectedWorkType] = useState<string>('All');
  const [minPay, setMinPay] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'recommended' | 'newest' | 'highest_pay'>('recommended');
  const [onlySaved, setOnlySaved] = useState<boolean>(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pageSize = 20;
  const categories = ['All', 'Dental', 'Family Medicine', 'Vision', 'Physical Therapy', 'Dermatology & MedSpa'];
  const workTypes = ['All', 'Full-time', 'Part-time', 'PRN / Temp'];

  // Sync saved jobs from localStorage
  useEffect(() => {
    const syncSaved = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('saved_clinic_jobs') || '[]');
        setSavedIds(Array.isArray(stored) ? stored : []);
      } catch {
        setSavedIds([]);
      }
    };
    syncSaved();
    window.addEventListener('savedJobsUpdated', syncSaved);
    return () => window.removeEventListener('savedJobsUpdated', syncSaved);
  }, []);

  // Dynamically extract available US Metros
  const availableLocations = useMemo(() => {
    const locSet = new Set<string>();
    jobs.forEach((j) => {
      if (j.location) locSet.add(j.location);
    });
    return ['All', ...Array.from(locSet).sort()];
  }, [jobs]);

  // Category counts for sidebar
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: jobs.length };
    jobs.forEach((j) => {
      counts[j.clinicType] = (counts[j.clinicType] || 0) + 1;
    });
    return counts;
  }, [jobs]);

  // Fetch live jobs from Supabase & localStorage on client mount
  useEffect(() => {
    async function loadLiveFeed() {
      try {
        setIsRefreshing(true);

        // 1. Fetch most recent jobs from Supabase
        const { data } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(600);

        // 2. Fetch locally posted jobs from localStorage (if any)
        const localRaw = typeof window !== 'undefined' ? localStorage.getItem('my_posted_jobs') : null;
        const localJobs = localRaw ? JSON.parse(localRaw).map(mapDbJob) : [];

        if ((data && data.length > 0) || localJobs.length > 0) {
          const liveMapped = data ? data.map(mapDbJob) : [];
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
        console.warn('Using static bundled job feed:', err);
      } finally {
        setIsRefreshing(false);
      }
    }

    loadLiveFeed();
  }, []);

  // Filter and sort jobs with strict 2-slot Sponsored cap
  const { finalJobs, pinnedIds } = useMemo(() => {
    const matched = jobs.filter((job) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        job.title.toLowerCase().includes(term) ||
        job.clinicName.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term) ||
        job.softwareUsed.some((s) => s.toLowerCase().includes(term));

      const matchesCategory = selectedCategory === 'All' || job.clinicType === selectedCategory;
      const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
      const matchesWorkType = selectedWorkType === 'All' || job.workType === selectedWorkType;
      const matchesPay = minPay === 0 || job.maxHourly >= minPay;
      const matchesSaved = !onlySaved || savedIds.includes(job.id);

      return matchesSearch && matchesCategory && matchesLocation && matchesWorkType && matchesPay && matchesSaved;
    });

    if (sortBy === 'highest_pay') {
      const sorted = [...matched].sort((a, b) => b.maxHourly - a.maxHourly);
      return { finalJobs: sorted, pinnedIds: new Set<string>() };
    }

    if (sortBy === 'newest') {
      const sorted = [...matched].sort(
        (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      );
      return { finalJobs: sorted, pinnedIds: new Set<string>() };
    }

    // Default 'recommended' sort:
    // Pick AT MOST 2 featured jobs for the top of the feed, then sort all remaining jobs chronologically!
    const featuredCandidates = matched.filter((j) => j.isFeatured).slice(0, 2);
    const pinnedSet = new Set(featuredCandidates.map((j) => j.id));
    const regularJobs = matched
      .filter((j) => !pinnedSet.has(j.id))
      .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());

    return {
      finalJobs: [...featuredCandidates, ...regularJobs],
      pinnedIds: pinnedSet,
    };
  }, [jobs, searchTerm, selectedCategory, selectedLocation, selectedWorkType, minPay, sortBy, onlySaved, savedIds]);

  const totalPages = Math.max(1, Math.ceil(finalJobs.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const displayedJobs = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return finalJobs.slice(start, start + pageSize);
  }, [finalJobs, safePage]);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSelectedWorkType('All');
    setSearchTerm('');
    setMinPay(0);
    setOnlySaved(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedLocation !== 'All' ||
    selectedWorkType !== 'All' ||
    searchTerm !== '' ||
    minPay > 0 ||
    onlySaved;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 text-center text-xs font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-teal-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Direct Practices:
          </span>
          <span className="text-slate-200">
            100% hourly pay transparency across {jobs.length.toLocaleString()} private dental & medical clinic openings.
          </span>
          <Link href="/salary-calculator" className="underline text-teal-300 hover:text-white font-semibold ml-1">
            Compare 2026 Metro Pay Rates →
          </Link>
        </div>
      </div>

      {/* Hero Search Section */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              <span>US Private Clinical Career Network • Direct Practice Hiring</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Browse Verified Private Practice & Clinic Jobs
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Connect directly with independent dentists, physicians, optometrists, and physical therapy clinics—every listing includes verified hourly pay and clinical software details.
            </p>
          </div>

          {/* Search Bar Box */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Keyword Input */}
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Role (RDH, CMA, RDA), software (Dentrix), or clinic..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Metro Selector */}
              <div className="sm:col-span-4 relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                >
                  <option value="All">All US Metros ({availableLocations.length - 1} Cities)</option>
                  {availableLocations
                    .filter((l) => l !== 'All')
                    .map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                </select>
              </div>

              {/* Minimum Hourly Rate */}
              <div className="sm:col-span-3">
                <select
                  value={minPay}
                  onChange={(e) => {
                    setMinPay(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                >
                  <option value={0}>Any Hourly Pay</option>
                  <option value={22}>$22+ / hr</option>
                  <option value={26}>$26+ / hr</option>
                  <option value={32}>$32+ / hr</option>
                  <option value={45}>$45+ / hr (RDH / Lead)</option>
                  <option value={85}>$85+ / hr (DDS / Provider)</option>
                </select>
              </div>
            </div>

            {/* Popular Role Quick Chips */}
            <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
                Quick Role:
              </span>
              {ROLE_QUICK_FILTERS.map((rf) => {
                const isActive = searchTerm.toLowerCase() === rf.query.toLowerCase();
                return (
                  <button
                    key={rf.label}
                    type="button"
                    onClick={() => {
                      setSearchTerm(rf.query);
                      setCurrentPage(1);
                    }}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-400 hover:text-teal-700'
                    }`}
                  >
                    {rf.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main 3-Column Job Board Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDEBAR: Faceted Search Filters (3 cols) */}
          <aside className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                  <span>Filter Openings</span>
                </h2>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-800 underline"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Saved Jobs Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setOnlySaved(!onlySaved);
                    setCurrentPage(1);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                    onlySaved
                      ? 'bg-teal-50 border-teal-500 text-teal-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? 'fill-teal-600 text-teal-600' : 'text-slate-500'}`} />
                    <span>Saved Jobs</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px]">
                    {savedIds.length}
                  </span>
                </button>
              </div>

              {/* Practice Specialty Filter */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Practice Specialty
                </label>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                          active
                            ? 'bg-teal-600 text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{cat === 'All' ? 'All Specialties' : cat}</span>
                        <span
                          className={`text-[11px] px-1.5 py-0.2 rounded ${
                            active ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {categoryCounts[cat] || 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Schedule / Work Type Filter */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Schedule Type
                </label>
                <div className="space-y-1">
                  {workTypes.map((wt) => {
                    const active = selectedWorkType === wt;
                    return (
                      <button
                        key={wt}
                        type="button"
                        onClick={() => {
                          setSelectedWorkType(wt);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          active
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{wt === 'All' ? 'All Schedules' : wt}</span>
                        {active && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Employer Hiring CTA Card */}
            <div className="bg-white rounded-xl border border-teal-200 p-5 space-y-3 shadow-2xs">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 text-teal-800 text-[11px] font-bold">
                <PlusCircle className="w-3 h-3 text-teal-600" />
                <span>For Practice Owners</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                Hiring RDH, RDA, CMA, or Clinic Staff?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reach verified local clinicians directly. Every listing is indexed on Google for Jobs with transparent pay.
              </p>
              <Link
                href="/post-a-job"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <span>Post a Practice Job ($99)</span>
              </Link>
            </div>

            {/* Instant Job Alerts Box */}
            <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                <Bell className="w-4 h-4" />
                <span>Instant Job Alerts</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Get notified via SMS, WhatsApp, or Email the moment a private clinic in your city posts a high-paying opening.
              </p>
              <Link
                href="/alerts"
                className="w-full inline-flex items-center justify-center py-2 px-3 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-colors"
              >
                Create Custom Job Alert
              </Link>
            </div>
          </aside>

          {/* RIGHT/MAIN JOB LISTING FEED (9 cols) */}
          <main className="lg:col-span-9 space-y-4">
            {/* Feed Toolbar: Count + Sort Dropdown */}
            <div className="bg-white rounded-xl border border-slate-200/90 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  {finalJobs.length.toLocaleString()} {selectedCategory !== 'All' ? selectedCategory : 'Clinical'} Positions
                  {selectedLocation !== 'All' ? ` in ${selectedLocation}` : ''}
                </h2>
                {isRefreshing && <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />}
                <span className="text-xs text-slate-500 hidden sm:inline">
                  (Page {safePage} of {totalPages})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-600 shrink-0">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:border-teal-600 focus:outline-none"
                >
                  <option value="recommended">Featured & Most Recent</option>
                  <option value="newest">Newest Posted First</option>
                  <option value="highest_pay">Highest Hourly Rate</option>
                </select>
              </div>
            </div>

            {/* Job Cards Feed */}
            <div className="space-y-3">
              {displayedJobs.length > 0 ? (
                displayedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isPinnedFeatured={safePage === 1 && pinnedIds.has(job.id)}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white space-y-3">
                  <p className="text-base font-bold text-slate-800">
                    No clinic openings match your exact filter combination.
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Try clearing your search keyword, lowering the minimum hourly filter, or selecting All US Metros.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                  >
                    Reset Filters & Show All {jobs.length.toLocaleString()} Jobs
                  </button>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl border border-slate-200/90 px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-600 font-medium">
                  Showing <strong className="text-slate-900">{(safePage - 1) * pageSize + 1}</strong> to{' '}
                  <strong className="text-slate-900">{Math.min(safePage * pageSize, finalJobs.length)}</strong> of{' '}
                  <strong className="text-slate-900">{finalJobs.length.toLocaleString()}</strong> verified jobs
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 280, behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 text-xs font-bold transition-colors"
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                    let pageNum = idx + 1;
                    if (totalPages > 5 && safePage > 3) {
                      pageNum = Math.min(totalPages - 4 + idx, safePage - 2 + idx);
                    }
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 280, behavior: 'smooth' });
                        }}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                          safePage === pageNum
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 280, behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 text-xs font-bold transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Embedded Wage Benchmark Calculator */}
            <div className="pt-8">
              <SalaryCalculator />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
