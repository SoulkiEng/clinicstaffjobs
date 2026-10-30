'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ALL_JOBS, US_STATES_52, Job } from '@/data/jobs';
import { supabase } from '@/lib/supabase';
import JobCard from '@/components/JobCard';
import SalaryCalculator from '@/components/SalaryCalculator';
import {
  Search,
  MapPin,
  Bell,
  ShieldCheck,
  PlusCircle,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  Bookmark,
  ArrowUpDown,
  Building2,
  X,
  BadgeCheck,
  Laptop,
  Calendar,
  Gift,
  Globe
} from 'lucide-react';

function mapDbJob(raw: any, idx = 0): Job {
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
    npiNumber: raw.npi_number || `1${String(482910300 + idx * 71).slice(0, 9)}`,
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
  { label: 'All Clinical Roles', query: '' },
  { label: 'Dental Hygienist (RDH)', query: 'Hygienist' },
  { label: 'Dental Assistant (RDA/EFDA)', query: 'Dental Assistant' },
  { label: 'Medical Assistant (CMA)', query: 'Medical Assistant' },
  { label: 'Optician & Eye Tech', query: 'Opt' },
  { label: 'Physical Therapy (PTA/Aide)', query: 'Physical Therap' },
  { label: 'Dermatology & MedSpa', query: 'Dermatology' },
  { label: 'Front Office & Manager', query: 'Coordinator' },
  { label: 'Associate Dentist (DDS)', query: 'Dentist' },
];

const SOFTWARE_OPTIONS = [
  { label: 'All Practice Software', value: 'All' },
  { label: 'Dentrix / Ascend', value: 'Dentrix' },
  { label: 'Eaglesoft', value: 'Eaglesoft' },
  { label: 'Open Dental', value: 'Open Dental' },
  { label: 'AthenaHealth EHR', value: 'AthenaHealth' },
  { label: 'ModMed EMA', value: 'ModMed' },
  { label: 'Prompt EMR / WebPT', value: 'Prompt' },
  { label: 'RevolutionEHR / Optical', value: 'RevolutionEHR' },
  { label: 'iTero / CEREC 3D', value: 'iTero' },
];

const BENEFIT_OPTIONS = [
  { label: 'All Benefits & Perks', value: 'All' },
  { label: '100% Employer-Paid Medical', value: '100% Employer-Paid' },
  { label: '401(k) Safe Harbor Match', value: '401(k)' },
  { label: 'No Weekends / Weekday Only', value: 'No Weekends' },
  { label: 'Annual CE Allowance ($1,500+)', value: 'CE' },
  { label: 'Monthly Profit-Sharing Bonus', value: 'Bonus' },
];

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>(ALL_JOBS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedWorkType, setSelectedWorkType] = useState<string>('All');
  const [selectedSoftware, setSelectedSoftware] = useState<string>('All');
  const [selectedBenefit, setSelectedBenefit] = useState<string>('All');
  const [postedWithinDays, setPostedWithinDays] = useState<number>(0);
  const [minPay, setMinPay] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'recommended' | 'newest' | 'highest_pay'>('recommended');
  const [onlySaved, setOnlySaved] = useState<boolean>(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tickerPaused, setTickerPaused] = useState(false);

  const pageSize = 20;
  const categories = ['All', 'Dental', 'Family Medicine', 'Vision', 'Physical Therapy', 'Dermatology & MedSpa'];
  const workTypes = ['All', 'Full-time', 'Part-time', 'PRN / Temp'];

  const SPECIALTY_STORIES = [
    {
      id: 'All',
      title: 'All 52 States',
      subtitle: 'Live Feed',
      emoji: '⚡',
      ring: 'from-teal-500 via-emerald-500 to-cyan-500',
      bg: 'bg-teal-50 text-teal-800',
    },
    {
      id: 'Dental',
      title: 'Dental Clinics',
      subtitle: 'RDH • RDA • DDS',
      emoji: '🦷',
      ring: 'from-teal-500 via-emerald-400 to-teal-600',
      bg: 'bg-teal-50 text-teal-800',
    },
    {
      id: 'Family Medicine',
      title: 'Family Med',
      subtitle: 'CMA • RN • NP',
      emoji: '🩺',
      ring: 'from-emerald-500 via-green-500 to-teal-600',
      bg: 'bg-emerald-50 text-emerald-800',
    },
    {
      id: 'Vision',
      title: 'Vision & Eye',
      subtitle: 'Optician • COA',
      emoji: '👁️',
      ring: 'from-sky-500 via-blue-500 to-cyan-500',
      bg: 'bg-sky-50 text-sky-800',
    },
    {
      id: 'Physical Therapy',
      title: 'Outpatient PT',
      subtitle: 'PTA • DPT • Aide',
      emoji: '🏃',
      ring: 'from-indigo-500 via-violet-500 to-purple-600',
      bg: 'bg-indigo-50 text-indigo-800',
    },
    {
      id: 'Dermatology & MedSpa',
      title: 'Derm & MedSpa',
      subtitle: 'MA • Aesthetic RN',
      emoji: '✨',
      ring: 'from-rose-500 via-pink-500 to-amber-500',
      bg: 'bg-rose-50 text-rose-800',
    },
  ];

  const LIVE_ACTIVITY_ITEMS = [
    '🟢 Preston Hollow Dental (Dallas, TX) verified NPI #148792••• & posted Lead RDH ($56/hr) • 2m ago',
    '⚡ Jessica M., RDH applied via 1-Click Feed to Camelback Smiles (Phoenix, AZ) • 4m ago',
    '🟢 Buckhead Dermatology & MedSpa (Atlanta, GA) posted Cosmetic MA ($31/hr) • 7m ago',
    '🔥 19 clinicians viewing Brickell Vision & Optical (Miami, FL) • Live now',
    '🟢 Pacific Coast Physical Therapy (San Diego, CA) verified NPI #192834••• & hired PTA • 11m ago',
    '⚡ Marcus T., CMA saved Cherry Creek Family Practice (Denver, CO) • 14m ago',
  ];

  // Read URL params (?state=TX or ?specialty=Dental) on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const st = params.get('state');
      const spec = params.get('specialty') || params.get('category');
      if (st && US_STATES_52.some((s) => s.code === st.toUpperCase())) {
        setSelectedState(st.toUpperCase());
      }
      if (spec && categories.includes(spec)) {
        setSelectedCategory(spec);
      }
    }
  }, []);

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

  // State counts across all 52 states
  const stateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((j) => {
      if (j.state) counts[j.state] = (counts[j.state] || 0) + 1;
    });
    return counts;
  }, [jobs]);

  // Dynamically extract available US Metros (filtered by selectedState if a state is chosen)
  const availableLocations = useMemo(() => {
    const locSet = new Set<string>();
    jobs.forEach((j) => {
      if (selectedState === 'All' || j.state === selectedState) {
        if (j.location) locSet.add(j.location);
      }
    });
    return ['All', ...Array.from(locSet).sort()];
  }, [jobs, selectedState]);

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

        const { data } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(600);

        const localRaw = typeof window !== 'undefined' ? localStorage.getItem('my_posted_jobs') : null;
        const localJobs = localRaw ? JSON.parse(localRaw).map((r: any, i: number) => mapDbJob(r, i)) : [];

        if ((data && data.length > 0) || localJobs.length > 0) {
          const liveMapped = data ? data.map((r: any, i: number) => mapDbJob(r, i)) : [];
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
        console.warn('Using bundled 52-state job feed:', err);
      } finally {
        setIsRefreshing(false);
      }
    }

    loadLiveFeed();
  }, []);

  // Multi-facet filter and sort with strict 2-slot priority cap
  const { finalJobs, pinnedIds } = useMemo(() => {
    const nowMs = Date.now();

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
      const matchesState = selectedState === 'All' || job.state === selectedState;
      const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
      const matchesWorkType = selectedWorkType === 'All' || job.workType === selectedWorkType;
      const matchesPay = minPay === 0 || job.maxHourly >= minPay;
      const matchesSaved = !onlySaved || savedIds.includes(job.id);

      const matchesSoftware =
        selectedSoftware === 'All' ||
        job.softwareUsed.some((s) => s.toLowerCase().includes(selectedSoftware.toLowerCase()));

      const matchesBenefit =
        selectedBenefit === 'All' ||
        job.benefits.some((b) => b.toLowerCase().includes(selectedBenefit.toLowerCase()));

      let matchesDate = true;
      if (postedWithinDays > 0) {
        const jobTime = new Date(job.postedDate).getTime();
        const maxAgeMs = postedWithinDays * 24 * 3600 * 1000;
        matchesDate = !isNaN(jobTime) && nowMs - jobTime <= maxAgeMs;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesState &&
        matchesLocation &&
        matchesWorkType &&
        matchesPay &&
        matchesSaved &&
        matchesSoftware &&
        matchesBenefit &&
        matchesDate
      );
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

    const featuredCandidates = matched.filter((j) => j.isFeatured).slice(0, 2);
    const pinnedSet = new Set(featuredCandidates.map((j) => j.id));
    const regularJobs = matched
      .filter((j) => !pinnedSet.has(j.id))
      .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());

    return {
      finalJobs: [...featuredCandidates, ...regularJobs],
      pinnedIds: pinnedSet,
    };
  }, [
    jobs,
    searchTerm,
    selectedCategory,
    selectedState,
    selectedLocation,
    selectedWorkType,
    selectedSoftware,
    selectedBenefit,
    postedWithinDays,
    minPay,
    sortBy,
    onlySaved,
    savedIds,
  ]);

  const totalPages = Math.max(1, Math.ceil(finalJobs.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const displayedJobs = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return finalJobs.slice(start, start + pageSize);
  }, [finalJobs, safePage]);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedState('All');
    setSelectedLocation('All');
    setSelectedWorkType('All');
    setSelectedSoftware('All');
    setSelectedBenefit('All');
    setPostedWithinDays(0);
    setSearchTerm('');
    setMinPay(0);
    setOnlySaved(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedState !== 'All' ||
    selectedLocation !== 'All' ||
    selectedWorkType !== 'All' ||
    selectedSoftware !== 'All' ||
    selectedBenefit !== 'All' ||
    postedWithinDays > 0 ||
    searchTerm !== '' ||
    minPay > 0 ||
    onlySaved;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Live Social Career Network Activity Ticker (with Accessible Pause Control) */}
      <div className="bg-slate-950 text-white py-2 px-4 text-xs font-medium border-b border-slate-800 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0 z-10 bg-slate-950 pr-3 border-r border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-extrabold text-emerald-400 tracking-wide uppercase text-[11px] whitespace-nowrap">
              Live 52-State Pulse
            </span>
          </div>

          <div className="overflow-hidden flex-1">
            <div
              className="live-ticker-track gap-8 items-center"
              style={tickerPaused ? { animationPlayState: 'paused' } : undefined}
            >
              {[...LIVE_ACTIVITY_ITEMS, ...LIVE_ACTIVITY_ITEMS].map((item, idx) => (
                <span key={idx} className="text-slate-300 whitespace-nowrap text-xs font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 z-10 bg-slate-950 pl-3 border-l border-slate-800">
            <button
              type="button"
              onClick={() => setTickerPaused(!tickerPaused)}
              className="text-[11px] font-bold text-slate-400 hover:text-white px-2 py-0.5 rounded border border-slate-800 hover:border-slate-700 cursor-pointer whitespace-nowrap"
              aria-label={tickerPaused ? 'Resume live activity ticker' : 'Pause live activity ticker'}
            >
              {tickerPaused ? '▶ Play' : '⏸ Pause'}
            </button>
            <Link
              href="/post-a-job"
              className="hidden sm:inline-flex items-center gap-1 text-teal-300 hover:text-white font-bold whitespace-nowrap"
            >
              <span>+ Post Free Job</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Search, Specialty Story Rings & 52-State Command Bar */}
      <section className="relative bg-gradient-to-b from-white via-teal-50/20 to-white border-b border-slate-200/80 pt-7 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="max-w-3xl space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{jobs.length.toLocaleString()} Live Verified Roles • All 52 US States • 100% Free Network</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                The Social Career Feed for{' '}
                <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  Private Healthcare & Dental Clinics
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600">
                Preview clinic workflows, compare live hourly pay, and apply in 1 click directly to NPI-verified practice owners—zero staffing agencies or middlemen.
              </p>
            </div>

            {/* Corporate Trust Pills */}
            <div className="flex flex-wrap gap-2 text-xs font-bold shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs">
                <BadgeCheck className="w-4 h-4 text-emerald-600" /> 10-Digit NPI Verified
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white text-slate-800 border border-slate-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> 1-Click Direct Apply
              </span>
            </div>
          </div>

          {/* Interactive Social-Media "Specialty Story Rings" Bar */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Explore Specialty Channels (Tap to Filter Feed)
              </span>
              {selectedCategory !== 'All' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setCurrentPage(1);
                  }}
                  className="text-xs font-bold text-teal-600 hover:text-teal-800 cursor-pointer"
                >
                  Show All Specialties ({jobs.length})
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {SPECIALTY_STORIES.map((story) => {
                const isSelected = selectedCategory === story.id;
                const count = categoryCounts[story.id] || 0;
                return (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(story.id);
                      setCurrentPage(1);
                    }}
                    className={`social-card-lift group text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-teal-500/40'
                        : 'bg-white hover:bg-slate-50/90 text-slate-900 border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    {/* Story Gradient Ring Avatar */}
                    <div
                      className={`p-0.5 rounded-full bg-gradient-to-tr ${story.ring} shrink-0 transition-transform duration-200 group-hover:scale-105`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                          isSelected ? 'bg-slate-900' : 'bg-white'
                        }`}
                      >
                        {story.emoji}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`text-xs font-extrabold truncate ${
                            isSelected ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {story.title}
                        </p>
                      </div>
                      <p
                        className={`text-[11px] truncate ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {story.subtitle}
                      </p>
                      <span
                        className={`inline-block mt-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                          isSelected ? 'bg-teal-500/20 text-teal-300' : story.bg
                        }`}
                      >
                        {count.toLocaleString()} live
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar Box (4-Column Responsive Grid) */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Keyword Input (4 cols) */}
              <div className="sm:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Title (RDH, CMA, RDA), software (Dentrix), or clinic..."
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

              {/* 52-State Selector (3 cols) */}
              <div className="sm:col-span-3 relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedLocation('All');
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                >
                  <option value="All">All 52 US States & Territories</option>
                  {US_STATES_52.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.code}) — {stateCounts[st.code] || 0} jobs
                    </option>
                  ))}
                </select>
              </div>

              {/* Metro / City Selector (3 cols) */}
              <div className="sm:col-span-3 relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                >
                  <option value="All">
                    {selectedState === 'All'
                      ? `All Cities (${availableLocations.length - 1} Metros)`
                      : `All ${selectedState} Cities`}
                  </option>
                  {availableLocations
                    .filter((l) => l !== 'All')
                    .map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                </select>
              </div>

              {/* Minimum Hourly Rate (2 cols) */}
              <div className="sm:col-span-2">
                <select
                  value={minPay}
                  onChange={(e) => {
                    setMinPay(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                >
                  <option value={0}>Any Pay Rate</option>
                  <option value={22}>$22+ / hr</option>
                  <option value={26}>$26+ / hr</option>
                  <option value={32}>$32+ / hr</option>
                  <option value={45}>$45+ / hr (RDH)</option>
                  <option value={85}>$85+ / hr (DDS)</option>
                </select>
              </div>
            </div>

            {/* Popular Role Quick Chips */}
            <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
                Role Filter:
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

      {/* Main Job Board Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDEBAR: Advanced Multi-Facet Filters (3 cols) */}
          <aside className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                  <span>Advanced Filters</span>
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
                    <span>Saved Openings</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px]">
                    {savedIds.length}
                  </span>
                </button>
              </div>

              {/* 1. Practice Specialty Filter */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Practice Specialty (5 Core)
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
                        <span className="truncate">{cat === 'All' ? 'All 5 Specialties' : cat}</span>
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

              {/* 2. Clinical Software / EHR Stack Filter */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Laptop className="w-3.5 h-3.5 text-slate-400" />
                  <span>EHR & Practice Software</span>
                </label>
                <select
                  value={selectedSoftware}
                  onChange={(e) => {
                    setSelectedSoftware(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-teal-600 focus:outline-none"
                >
                  {SOFTWARE_OPTIONS.map((sw) => (
                    <option key={sw.value} value={sw.value}>
                      {sw.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Benefits & Perks Filter */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-slate-400" />
                  <span>Benefits & Perks</span>
                </label>
                <select
                  value={selectedBenefit}
                  onChange={(e) => {
                    setSelectedBenefit(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-teal-600 focus:outline-none"
                >
                  {BENEFIT_OPTIONS.map((bf) => (
                    <option key={bf.value} value={bf.value}>
                      {bf.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Schedule / Employment Type */}
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

              {/* 5. Date Posted Filter */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date Posted</span>
                </label>
                <select
                  value={postedWithinDays}
                  onChange={(e) => {
                    setPostedWithinDays(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-teal-600 focus:outline-none"
                >
                  <option value={0}>Any Time</option>
                  <option value={1}>Past 24 Hours</option>
                  <option value={3}>Past 3 Days</option>
                  <option value={7}>Past 7 Days</option>
                  <option value={14}>Past 14 Days</option>
                </select>
              </div>
            </div>

            {/* 100% Free Employer Hiring CTA Card */}
            <div className="bg-white rounded-xl border border-teal-200 p-5 space-y-3 shadow-2xs">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Free for Practices (B2B)</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                Hiring RDH, RDA, CMA, or Clinic Staff?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verify your practice with your 10-digit NPI number and post unlimited openings across all 52 states at zero cost.
              </p>
              <Link
                href="/post-a-job"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post a Practice Job (100% Free)</span>
              </Link>
            </div>

            {/* Free Instant Job Alerts Box */}
            <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                <Bell className="w-4 h-4" />
                <span>Free Instant Job Alerts (B2C)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive instant Email, SMS, or WhatsApp alerts when an NPI-verified practice in your state posts a new opening.
              </p>
              <Link
                href="/alerts"
                className="w-full inline-flex items-center justify-center py-2 px-3 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-colors"
              >
                Activate Free Alerts
              </Link>
            </div>
          </aside>

          {/* RIGHT/MAIN JOB LISTING FEED (9 cols) */}
          <main className="lg:col-span-9 space-y-4">
            {/* Feed Toolbar: Count + Active Filter Pills + Sort Dropdown */}
            <div className="bg-white rounded-xl border border-slate-200/90 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  {finalJobs.length.toLocaleString()} Verified {selectedCategory !== 'All' ? selectedCategory : 'Clinical'} Openings
                  {selectedState !== 'All' ? ` in ${selectedState}` : ''}
                  {selectedLocation !== 'All' ? ` (${selectedLocation})` : ''}
                </h2>
                {isRefreshing && <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />}
                <span className="text-xs text-slate-500 hidden sm:inline">
                  • Page {safePage} of {totalPages}
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
                  <option value="recommended">Priority Verified & Newest</option>
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
                    Try resetting your software/benefit filters or selecting All 52 US States.
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
                  <strong className="text-slate-900">{finalJobs.length.toLocaleString()}</strong> NPI-verified jobs
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

            {/* 52-State Quick Browse SEO Grid */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Browse Verified Clinic Jobs Across All 52 US States & Territories
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click any state below to filter Dental, Family Medicine, Vision, Physical Therapy, and Dermatology jobs in that jurisdiction.
                  </p>
                </div>
                {selectedState !== 'All' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedState('All');
                      setSelectedLocation('All');
                      setCurrentPage(1);
                    }}
                    className="text-xs font-bold text-teal-600 underline"
                  >
                    Clear State Filter ({selectedState})
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {US_STATES_52.map((st) => {
                  const active = selectedState === st.code;
                  return (
                    <button
                      key={st.code}
                      type="button"
                      onClick={() => {
                        setSelectedState(st.code);
                        setSelectedLocation('All');
                        setCurrentPage(1);
                        window.scrollTo({ top: 260, behavior: 'smooth' });
                      }}
                      className={`px-2.5 py-1.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        active
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:border-teal-400 hover:bg-white'
                      }`}
                    >
                      <span className="truncate">{st.name}</span>
                      <span className={`text-[10px] font-bold ml-1 ${active ? 'text-teal-100' : 'text-slate-400'}`}>
                        {stateCounts[st.code] || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
