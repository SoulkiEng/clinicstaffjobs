'use client';

import React, { useState } from 'react';
import { Job } from '@/data/jobs';
import { getGeminiJobInsights } from '@/lib/gemini';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function GeminiJobInsightsCard({ job }: { job: Job }) {
  const [insights, setInsights] = useState<{
    salaryVerdict: string;
    interviewTips: string[];
    matchSummary: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoadInsights = () => {
    setLoading(true);
    try {
      const res = getGeminiJobInsights({
        title: job.title,
        clinicType: job.clinicType,
        city: job.city,
        state: job.state,
        minHourly: job.minHourly,
        maxHourly: job.maxHourly,
      });
      setInsights(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 text-white rounded-2xl border border-indigo-500/30 p-6 sm:p-7 space-y-4 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-teal-300">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Gemini AI Career Coach</span>
          </div>
          <h3 className="text-lg font-extrabold text-white">
            ✨ Gemini AI Pay Analysis & Interview Tips for This Job
          </h3>
          <p className="text-xs text-slate-300">
            See how ${job.minHourly}–${job.maxHourly}/hr compares in {job.location} and get tailored interview tips for {job.clinicName}.
          </p>
        </div>

        {!insights && (
          <button
            type="button"
            disabled={loading}
            onClick={handleLoadInsights}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loading ? 'Analyzing with Gemini AI...' : '✨ Get Gemini AI Job Insights'}</span>
          </button>
        )}
      </div>

      {insights && (
        <div className="pt-3 border-t border-white/10 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
            <p className="font-extrabold text-teal-300">Hourly Pay & Market Verdict:</p>
            <p className="text-slate-100 leading-relaxed">{insights.salaryVerdict}</p>
            <p className="text-slate-300 leading-relaxed pt-1">{insights.matchSummary}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <p className="font-extrabold text-emerald-300">Top Interview Tips for {job.clinicName}:</p>
            <ul className="space-y-1.5">
              {insights.interviewTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
