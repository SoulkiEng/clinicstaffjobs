'use client';

import React, { useState } from 'react';
import { US_STATES_52 } from '@/data/jobs';
import { askGeminiCareerCoach } from '@/lib/gemini';
import { Sparkles, Loader2, CheckCircle2, Copy, Check } from 'lucide-react';

export default function GeminiCareerCoach() {
  const [role, setRole] = useState('Registered Dental Hygienist (RDH)');
  const [stateCode, setStateCode] = useState('TX');
  const [topic, setTopic] = useState<'license' | 'resume' | 'pay' | 'interview'>('license');
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedStateName =
    US_STATES_52.find((s) => s.code === stateCode)?.name || stateCode;

  const handleAskGemini = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = askGeminiCareerCoach({
        role,
        stateCode: `${selectedStateName} (${stateCode})`,
        topic,
      });
      setAdvice(`${res.title}\n\n${res.advice.map((item) => `• ${item}`).join('\n')}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white rounded-3xl border border-teal-800/80 p-6 sm:p-8 space-y-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Interactive Gemini AI Career & License Assistant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Ask Gemini AI About Your License, CV, or Hourly Pay
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Select your healthcare role, state, and topic below for instant step-by-step guidance.
          </p>
        </div>
      </div>

      <form onSubmit={handleAskGemini} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label
              htmlFor="coach-role"
              className="block text-xs font-bold uppercase tracking-wider text-teal-300 mb-1.5"
            >
              Your Job Role
            </label>
            <select
              id="coach-role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white focus:border-teal-400 focus:outline-none font-medium"
            >
              <option value="Registered Dental Hygienist (RDH)">Dental Hygienist (RDH)</option>
              <option value="Dental Assistant (RDA / EFDA)">Dental Assistant (RDA / EFDA)</option>
              <option value="Certified Medical Assistant (CMA)">Medical Assistant (CMA / RMA)</option>
              <option value="Physical Therapist Assistant (PTA)">Physical Therapy Assistant (PTA)</option>
              <option value="Licensed Optician / Eye Tech (COA)">Optician / Eye Tech (COA)</option>
              <option value="Dermatology & MedSpa Assistant">Dermatology & MedSpa Staff</option>
              <option value="Front Desk / Clinic Manager">Front Desk / Clinic Manager</option>
              <option value="Associate Dentist (DDS / DMD)">Dentist (DDS / DMD)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="coach-state"
              className="block text-xs font-bold uppercase tracking-wider text-teal-300 mb-1.5"
            >
              US State (All 52 States)
            </label>
            <select
              id="coach-state"
              name="stateCode"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white focus:border-teal-400 focus:outline-none font-medium"
            >
              {US_STATES_52.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-xs font-bold uppercase tracking-wider text-teal-300">
            What do you need help with?
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              { id: 'license', label: 'State License & Transfer' },
              { id: 'resume', label: 'CV & Resume Tips' },
              { id: 'pay', label: 'Getting Higher Hourly Pay' },
              { id: 'interview', label: 'Clinic Interview Prep' },
            ].map((item) => {
              const active = topic === item.id;
              return (
                <label
                  key={item.id}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                    active
                      ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-sm'
                      : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:border-teal-500/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="coachTopic"
                    value={item.id}
                    checked={active}
                    onChange={() => setTopic(item.id as any)}
                    className="accent-slate-950"
                  />
                  <span>{item.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Gemini AI Preparing Your Guide...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>✨ Generate Personalized Gemini AI Career Guide</span>
            </>
          )}
        </button>
      </form>

      {advice && (
        <div
          role="status"
          aria-live="polite"
          className="p-5 rounded-2xl bg-slate-900/95 border border-teal-500/40 space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-teal-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Gemini AI Guide for {role} in {selectedStateName} ({stateCode})
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(advice).catch(() => {});
                }
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Guide</span>
                </>
              )}
            </button>
          </div>
          <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
            {advice}
          </div>
        </div>
      )}
    </div>
  );
}
