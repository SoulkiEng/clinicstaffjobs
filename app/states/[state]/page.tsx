import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_JOBS, US_STATES_52 } from '@/data/jobs';
import JobCard from '@/components/JobCard';
import {
  BadgeCheck,
  Building2,
  ArrowLeft,
  PlusCircle,
  Bell,
  DollarSign
} from 'lucide-react';

interface PageProps {
  params: Promise<{ state: string }>;
}

export function generateStaticParams() {
  return US_STATES_52.map((st) => ({ state: st.code.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps) {
  const { state } = await params;
  const code = state.toUpperCase();
  const stateObj = US_STATES_52.find((s) => s.code === code);
  if (!stateObj) {
    return { title: 'State Clinic Jobs | ClinicStaffJobs' };
  }
  const stateJobs = ALL_JOBS.filter((j) => j.state === code);
  return {
    title: `${stateObj.name} (${code}) Dental & Healthcare Clinic Jobs (${stateJobs.length} Open Jobs) | ClinicStaffJobs`,
    description: `Browse ${stateJobs.length} verified clinic jobs in ${stateObj.name} (${code}). Direct hiring for Dental Hygienists (RDH), Dental Assistants (RDA), Medical Assistants (CMA), PTAs, and Opticians with clear hourly pay.`,
  };
}

export default async function StateSEOLandingPage({ params }: PageProps) {
  const { state } = await params;
  const code = state.toUpperCase();
  const stateObj = US_STATES_52.find((s) => s.code === code);

  if (!stateObj) {
    notFound();
  }

  const stateJobs = ALL_JOBS.filter((j) => j.state === code);
  const cities = Array.from(new Set(stateJobs.map((j) => j.city))).sort();

  const avgMaxHourly =
    stateJobs.length > 0
      ? Math.round(stateJobs.reduce((acc, j) => acc + j.maxHourly, 0) / stateJobs.length)
      : 44;

  const specialtyBreakdown = [
    'Dental',
    'Family Medicine',
    'Vision',
    'Physical Therapy',
    'Dermatology & MedSpa',
  ].map((spec) => {
    const matches = stateJobs.filter((j) => j.clinicType === spec);
    const min = matches.length > 0 ? Math.min(...matches.map((m) => m.minHourly)) : 24;
    const max = matches.length > 0 ? Math.max(...matches.map((m) => m.maxHourly)) : 58;
    return {
      specialty: spec,
      count: matches.length,
      payRange: `$${min} – $${max}/hr`,
    };
  });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'All Clinic Jobs',
        item: 'https://clinicstaffjobs.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${stateObj.name} (${code}) Clinic Jobs`,
        item: `https://clinicstaffjobs.com/states/${code.toLowerCase()}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-slate-50 pb-20">
        {/* State Hero Header */}
        <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Jobs</span>
              </Link>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Private Clinics in {stateObj.name}</span>
              </span>
            </div>

            <div className="max-w-4xl space-y-3">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Dental & Healthcare Clinic Jobs in{' '}
                <span className="text-teal-400">
                  {stateObj.name} ({code})
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Explore <strong className="text-white">{stateJobs.length}</strong> open clinic jobs across{' '}
                <strong className="text-white">{cities.join(', ')}</strong>. Apply directly to Dental, Family Medicine, Vision, Physical Therapy, and Dermatology clinics in 1 click.
              </p>
            </div>

            {/* Key State Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Open {code} Jobs
                </div>
                <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {stateJobs.length} Open Jobs
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Avg Top Hourly Pay ({code})
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
                  ${avgMaxHourly}/hr
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Hiring {code} Cities
                </div>
                <div className="text-sm font-bold text-white mt-1 truncate">
                  {cities.join(' • ') || stateObj.name}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Cost to Use ({code})
                </div>
                <div className="text-xl sm:text-2xl font-black text-teal-300 mt-0.5">
                  $0 (100% Free)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
          {/* Specialty Hourly Wage Breakdown Table for This State */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {stateObj.name} ({code}) Clinic Jobs & Hourly Pay by Specialty
                </h2>
                <p className="text-xs text-slate-500">
                  Click any specialty below to filter {stateObj.name} jobs with full search filters.
                </p>
              </div>
              <Link
                href="/salary-calculator"
                className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Check {code} Hourly Pay Calculator →</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {specialtyBreakdown.map((item) => (
                <Link
                  key={item.specialty}
                  href={`/?state=${code}&specialty=${encodeURIComponent(item.specialty)}`}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50/70 hover:bg-white transition-all space-y-1"
                >
                  <div className="text-xs font-extrabold text-slate-900">{item.specialty}</div>
                  <div className="text-sm font-black text-teal-700">{item.payRange}</div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    {item.count} open {code} jobs →
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* All Verified Jobs in This State */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-9 space-y-3">
              <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  All {stateJobs.length} Open Clinic Jobs in {stateObj.name} ({code})
                </h2>
                <Link
                  href={`/?state=${code}`}
                  className="text-xs font-bold text-teal-700 hover:underline"
                >
                  Filter by Gender, Experience & Software →
                </Link>
              </div>

              {stateJobs.map((job, idx) => (
                <JobCard key={job.id} job={job} isPinnedFeatured={idx < 2} />
              ))}
            </div>

            {/* Right Sidebar: State CTA & Neighboring States */}
            <aside className="lg:col-span-3 space-y-5">
              <div className="bg-white rounded-2xl border border-teal-200 p-5 space-y-3 shadow-2xs">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                  <Building2 className="w-3 h-3 text-emerald-600" />
                  <span>{stateObj.name} Clinics</span>
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Hiring in {stateObj.name}?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Save your clinic profile once and post unlimited free jobs in {cities.slice(0, 3).join(', ')}.
                </p>
                <Link
                  href={`/post-a-job?state=${code}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post Free {code} Job</span>
                </Link>
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold">
                  <Bell className="w-4 h-4" />
                  <span>Free {stateObj.name} Job Alerts</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Get a free email whenever a clinic in {stateObj.name} posts a new job matching your role.
                </p>
                <Link
                  href="/alerts"
                  className="w-full inline-flex items-center justify-center py-2 px-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-colors"
                >
                  Turn On {code} Job Alerts
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Browse Other US States (52)
                </h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {US_STATES_52.map((st) => (
                    <Link
                      key={st.code}
                      href={`/states/${st.code.toLowerCase()}`}
                      className={`px-2 py-1 rounded text-center text-xs font-bold border transition-colors ${
                        st.code === code
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-400'
                      }`}
                    >
                      {st.code}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
