'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SALARY_BENCHMARKS } from '@/data/jobs';
import { Calculator, ArrowRight, TrendingUp, CheckCircle, Flame, ShieldAlert } from 'lucide-react';

export default function SalaryCalculator() {
  const [selectedRole, setSelectedRole] = useState(SALARY_BENCHMARKS[0].role);
  const [selectedCity, setSelectedCity] = useState(SALARY_BENCHMARKS[0].cities[0].city);
  const [experience, setExperience] = useState<'entry' | 'mid' | 'senior'>('mid');
  const [currentWage, setCurrentWage] = useState<number | ''>('');

  const currentRoleData = SALARY_BENCHMARKS.find((r) => r.role === selectedRole) || SALARY_BENCHMARKS[0];
  const cityData = currentRoleData.cities.find((c) => c.city === selectedCity) || currentRoleData.cities[0];

  // Adjust for experience
  const expMultiplier = experience === 'entry' ? 0.92 : experience === 'senior' ? 1.12 : 1.0;
  const estimatedAvg = Math.round(cityData.avg * expMultiplier);
  const estimatedHigh = Math.round(cityData.high * expMultiplier);

  const wageDifference = currentWage ? Math.round(((Number(currentWage) - estimatedAvg) / estimatedAvg) * 100) : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8">
      <div className="flex items-center gap-2.5 text-teal-700 font-semibold text-sm mb-2">
        <Calculator className="w-5 h-5 text-teal-600" />
        <span>Free Private Practice Wage Benchmark</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Am I Getting Underpaid?
      </h2>
      <p className="text-sm text-slate-600 mt-1 max-w-2xl">
        Check current going rates for private dental, medical, and outpatient clinic staff in your metro area based on live verified postings.
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {/* Role select */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Your Healthcare Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            {SALARY_BENCHMARKS.map((item) => (
              <option key={item.role} value={item.role}>
                {item.role}
              </option>
            ))}
          </select>
        </div>

        {/* City select */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Metro Area
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            {currentRoleData.cities.map((c) => (
              <option key={c.city} value={c.city}>
                {c.city} ({c.count} openings)
              </option>
            ))}
          </select>
        </div>

        {/* Experience level */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Years of Experience
          </label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value as any)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="entry">Entry (0-2 years)</option>
            <option value="mid">Mid-Level (3-5 years)</option>
            <option value="senior">Experienced (6+ years)</option>
          </select>
        </div>
      </div>

      {/* Optional: Current Wage Input for Underpaid Test */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="text-xs font-medium text-slate-600">
          (Optional) Enter what you currently make per hour to see how you rank:
        </label>
        <div className="relative w-40">
          <span className="absolute left-3 top-2 text-sm text-slate-400 font-bold">$</span>
          <input
            type="number"
            placeholder="e.g. 40"
            value={currentWage}
            onChange={(e) => setCurrentWage(e.target.value ? Number(e.target.value) : '')}
            className="w-full pl-7 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Results Display Box */}
      <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200/90 p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Average */}
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              City Market Average
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">${estimatedAvg}</span>
              <span className="text-sm font-semibold text-slate-600">/hr</span>
            </div>
            <p className="text-xs text-slate-600">Standard for {selectedCity}</p>
          </div>

          {/* Top 10% */}
          <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Top Paying Private Clinics
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-teal-700">${estimatedHigh}</span>
              <span className="text-sm font-semibold text-slate-600">/hr</span>
            </div>
            <p className="text-xs text-slate-600">Upper 10th percentile rates</p>
          </div>

          {/* Verdict Box */}
          <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
            {currentWage ? (
              wageDifference !== null && wageDifference < 0 ? (
                <div className="space-y-1 text-rose-700">
                  <div className="flex items-center gap-1 font-bold text-sm">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Underpaid by {Math.abs(wageDifference)}%!</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    You are earning below the ${estimatedAvg}/hr market average for {selectedRole} in {selectedCity}.
                  </p>
                </div>
              ) : (
                <div className="space-y-1 text-emerald-800">
                  <div className="flex items-center gap-1 font-bold text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>Competitive Pay!</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Your wage is in line with or higher than the market rate in {selectedCity}.
                  </p>
                </div>
              )
            ) : (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500">Active Demand</span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Private practices in <span className="font-semibold text-slate-900">{selectedCity}</span> are offering up to <span className="font-bold text-teal-700">${estimatedHigh}/hr</span> with sign-on bonuses.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action button */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Data verified from {cityData.count} active private clinic hiring posts this week.
          </p>
          <Link
            href={`/?role=${encodeURIComponent(selectedRole)}&location=${encodeURIComponent(selectedCity)}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <span>Browse {selectedRole} Openings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
