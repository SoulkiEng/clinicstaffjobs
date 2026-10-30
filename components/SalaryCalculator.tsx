'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SALARY_BENCHMARKS } from '@/data/jobs';
import { generateSalaryNegotiationWithGemini } from '@/lib/gemini';
import {
  Calculator,
  ArrowRight,
  CheckCircle,
  Flame,
  ShieldAlert,
  Sparkles,
  Loader2,
  Copy,
  Check
} from 'lucide-react';

export default function SalaryCalculator() {
  const [selectedRole, setSelectedRole] = useState(SALARY_BENCHMARKS[0].role);
  const [selectedCity, setSelectedCity] = useState(SALARY_BENCHMARKS[0].cities[0].city);
  const [experience, setExperience] = useState<'entry' | 'mid' | 'senior'>('mid');
  const [currentWage, setCurrentWage] = useState<string>('');
  const [negotiationScript, setNegotiationScript] = useState<string>('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const currentRoleData = SALARY_BENCHMARKS.find((r) => r.role === selectedRole) || SALARY_BENCHMARKS[0];
  const cityData = currentRoleData.cities.find((c) => c.city === selectedCity) || currentRoleData.cities[0];

  // Adjust for experience
  const expMultiplier = experience === 'entry' ? 0.92 : experience === 'senior' ? 1.12 : 1.0;
  const estimatedAvg = Math.round(cityData.avg * expMultiplier);
  const estimatedHigh = Math.round(cityData.high * expMultiplier);

  const numericCurrentWage = Number(currentWage);
  const wageDifference =
    currentWage && !isNaN(numericCurrentWage) && numericCurrentWage > 0
      ? Math.round(((numericCurrentWage - estimatedAvg) / estimatedAvg) * 100)
      : null;

  // Clean search query & state code so homepage filter works seamlessly
  const cleanRoleKeyword = selectedRole.includes('Hygienist')
    ? 'Hygienist'
    : selectedRole.includes('Dental Assistant')
    ? 'Dental Assistant'
    : selectedRole.includes('Medical Assistant')
    ? 'Medical Assistant'
    : selectedRole.includes('Physical Therapy')
    ? 'Physical Therap'
    : selectedRole.includes('Optician')
    ? 'Opt'
    : selectedRole.includes('Dermatology')
    ? 'Dermatology'
    : selectedRole.includes('Coordinator')
    ? 'Coordinator'
    : selectedRole.split('(')[0].trim();

  const parsedStateCode = selectedCity.split(',')[1]?.trim() || '';

  const handleGenerateNegotiationScript = () => {
    setIsGeneratingScript(true);
    try {
      const script = generateSalaryNegotiationWithGemini({
        role: selectedRole,
        city: selectedCity,
        currentPay: numericCurrentWage > 0 ? numericCurrentWage : undefined,
        marketAvg: estimatedAvg,
        marketHigh: estimatedHigh,
      });
      setNegotiationScript(script);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8">
      <div className="flex items-center gap-2.5 text-teal-700 font-semibold text-sm mb-2">
        <Calculator className="w-5 h-5 text-teal-600" />
        <span>Free Clinic Hourly Pay Calculator</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Am I Getting Underpaid?
      </h2>
      <p className="text-sm text-slate-600 mt-1 max-w-2xl">
        Check current hourly pay rates for dental, medical, vision, physical therapy, and dermatology clinic staff in your city—and use Gemini AI to write a polite pay raise script.
      </p>

      {/* Aligned 2-Column Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 items-end">
        {/* Role select */}
        <div>
          <label
            htmlFor="calc-role"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Your Job Role
          </label>
          <select
            id="calc-role"
            name="selectedRole"
            value={selectedRole}
            onChange={(e) => {
              const nextRole = e.target.value;
              setSelectedRole(nextRole);
              const nextRoleObj = SALARY_BENCHMARKS.find((r) => r.role === nextRole);
              if (nextRoleObj && !nextRoleObj.cities.some((c) => c.city === selectedCity)) {
                setSelectedCity(nextRoleObj.cities[0].city);
              }
              setNegotiationScript('');
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
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
          <label
            htmlFor="calc-city"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            City / Metro Area
          </label>
          <select
            id="calc-city"
            name="selectedCity"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setNegotiationScript('');
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          >
            {currentRoleData.cities.map((c) => (
              <option key={c.city} value={c.city}>
                {c.city} ({c.count} open jobs)
              </option>
            ))}
          </select>
        </div>

        {/* Experience level */}
        <div>
          <label
            htmlFor="calc-exp"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Years of Experience
          </label>
          <select
            id="calc-exp"
            name="experience"
            value={experience}
            onChange={(e) => {
              setExperience(e.target.value as any);
              setNegotiationScript('');
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          >
            <option value="entry">Entry Level (0–2 years)</option>
            <option value="mid">Mid-Level (3–5 years)</option>
            <option value="senior">Senior / Lead (6+ years)</option>
          </select>
        </div>

        {/* Optional: Current Wage Input for Underpaid Test */}
        <div>
          <label
            htmlFor="calc-current-wage"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Your Current Hourly Pay (Optional)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-sm text-slate-400 font-bold">$</span>
            <input
              id="calc-current-wage"
              name="currentWage"
              type="text"
              inputMode="numeric"
              placeholder={`e.g. ${estimatedAvg - 3}`}
              value={currentWage}
              onChange={(e) => setCurrentWage(e.target.value.replace(/[^\d.]/g, ''))}
              className="w-full pl-8 pr-12 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-teal-500 focus:outline-none font-medium"
            />
            <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">/hr</span>
          </div>
        </div>
      </div>

      {/* Results Display Box */}
      <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200/90 p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Average */}
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              City Average Pay
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">${estimatedAvg}</span>
              <span className="text-sm font-semibold text-slate-600">/hr</span>
            </div>
            <p className="text-xs text-slate-600">Standard rate in {selectedCity}</p>
          </div>

          {/* Top 10% */}
          <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Top Paying Clinics
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-teal-700">${estimatedHigh}</span>
              <span className="text-sm font-semibold text-slate-600">/hr</span>
            </div>
            <p className="text-xs text-slate-600">Top 10% clinics in {selectedCity}</p>
          </div>

          {/* Verdict Box */}
          <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
            {wageDifference !== null ? (
              wageDifference < 0 ? (
                <div className="space-y-1 text-rose-700">
                  <div className="flex items-center gap-1 font-bold text-sm">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Underpaid by {Math.abs(wageDifference)}%!</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    You earn below the ${estimatedAvg}/hr average for {selectedRole} in {selectedCity}.
                  </p>
                </div>
              ) : (
                <div className="space-y-1 text-emerald-800">
                  <div className="flex items-center gap-1 font-bold text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>Strong Hourly Rate!</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Your pay matches or beats the ${estimatedAvg}/hr average in {selectedCity}.
                  </p>
                </div>
              )
            ) : (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500">Hiring Demand</span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Private clinics in <span className="font-semibold text-slate-900">{selectedCity}</span> are paying up to{' '}
                  <span className="font-bold text-teal-700">${estimatedHigh}/hr</span> right now.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons: Gemini AI Negotiation Script + Browse Matching Jobs */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleGenerateNegotiationScript}
            disabled={isGeneratingScript}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-bold text-xs transition-all cursor-pointer"
          >
            {isGeneratingScript ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                <span>Gemini AI Writing Script...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>✨ Write My Pay Raise Script with Gemini AI</span>
              </>
            )}
          </button>

          <Link
            href={`/?q=${encodeURIComponent(cleanRoleKeyword)}${
              parsedStateCode ? `&state=${encodeURIComponent(parsedStateCode)}` : ''
            }`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            <span>Browse {selectedRole.split('(')[0].trim()} Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Gemini AI Negotiation Script Output */}
        {negotiationScript && (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 p-4 rounded-xl bg-white border border-teal-200 space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-teal-800">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Gemini AI Pay Raise & Interview Negotiation Script (${estimatedHigh}/hr Target)</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(negotiationScript).catch(() => {});
                  }
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
              >
                {copiedScript ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
              {negotiationScript}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
