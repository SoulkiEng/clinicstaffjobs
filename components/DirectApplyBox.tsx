'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job } from '@/data/jobs';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { generateCoverNoteWithGemini } from '@/lib/gemini';
import {
  Send,
  CheckCircle2,
  Sparkles,
  Mail,
  ShieldCheck,
  Loader2,
  Bookmark,
  FileText
} from 'lucide-react';

interface DirectApplyBoxProps {
  job: Job;
}

export default function DirectApplyBox({ job }: DirectApplyBoxProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [license, setLicense] = useState('');
  const [experience, setExperience] = useState('3+ Years Experience');
  const [note, setNote] = useState('');
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setLicense(user.licenseNumber || '');
      if (user.yearsExperience) {
        setExperience(`${user.yearsExperience}+ Years Experience`);
      }
    }
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem('saved_clinic_jobs') || '[]');
      setIsSaved(savedIds.includes(job.id));
    } catch {
      // ignore
    }
  }, [user, job.id]);

  const toggleSave = () => {
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem('saved_clinic_jobs') || '[]');
      let updated: string[];
      if (savedIds.includes(job.id)) {
        updated = savedIds.filter((id) => id !== job.id);
        setIsSaved(false);
      } else {
        updated = [job.id, ...savedIds];
        setIsSaved(true);
      }
      localStorage.setItem('saved_clinic_jobs', JSON.stringify(updated));
      window.dispatchEvent(new Event('savedJobsUpdated'));
    } catch {
      // ignore
    }
  };

  const handleGeminiCoverNote = async () => {
    setIsGeneratingNote(true);
    const generated = await generateCoverNoteWithGemini({
      candidateName: name || user?.name || 'Candidate',
      candidateRole: user?.specialty || job.title,
      jobTitle: job.title,
      clinicName: job.clinicName,
      location: job.location,
    });
    setNote(generated);
    setIsGeneratingNote(false);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    const appRecord = {
      id: `app-${Date.now()}`,
      job_id: job.id,
      job_title: job.title,
      clinic_name: job.clinicName,
      location: job.location,
      candidate_name: name.trim(),
      candidate_email: email.trim(),
      candidate_phone: phone.trim(),
      license_number: license.trim() || 'Active State License',
      experience_years: experience,
      desired_pay: `$${job.minHourly} - $${job.maxHourly}/hr`,
      cover_note: note.trim(),
      is_vip: true,
      status: 'Application Sent to Clinic',
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('applications').insert([
        {
          id: appRecord.id,
          job_id: appRecord.job_id,
          candidate_name: appRecord.candidate_name,
          candidate_email: appRecord.candidate_email,
          candidate_phone: appRecord.candidate_phone,
          license_number: appRecord.license_number,
          experience_years: appRecord.experience_years,
          desired_pay: appRecord.desired_pay,
          is_vip: true,
          status: appRecord.status,
        },
      ]);
    } catch {
      // fallback to localStorage
    }

    try {
      const existing = JSON.parse(localStorage.getItem('my_submitted_applications') || '[]');
      localStorage.setItem('my_submitted_applications', JSON.stringify([appRecord, ...existing]));
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    setIsApplied(true);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium';

  if (isApplied) {
    return (
      <div className="bg-white rounded-2xl border-2 border-emerald-500 p-6 sm:p-8 shadow-md space-y-4 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900">
          Application Sent to {job.clinicName}!
        </h3>
        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          Thank you, <strong className="text-slate-900">{name}</strong>. Your application for{' '}
          <strong className="text-slate-900">{job.title}</strong> (${job.minHourly}–${job.maxHourly}/hr) has been saved to your account and sent to <strong className="text-teal-700">{job.applyEmail}</strong>.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard/candidate"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
          >
            <span>View in My Applied Jobs →</span>
          </Link>
          <a
            href={`mailto:${job.applyEmail}?subject=Application: ${encodeURIComponent(job.title)} - ${encodeURIComponent(name)}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Clinic Directly</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="apply-section" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="bg-slate-900 text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-400">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Free Direct Application
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
            Apply to {job.clinicName}
          </h3>
        </div>

        <button
          type="button"
          onClick={toggleSave}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
            isSaved
              ? 'bg-teal-500/20 border-teal-400 text-teal-300'
              : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-teal-300 text-teal-300' : ''}`} />
          <span>{isSaved ? 'Saved Job' : 'Save Job'}</span>
        </button>
      </div>

      <form onSubmit={handleApply} className="p-6 sm:p-8 space-y-5">
        {user ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between flex-wrap gap-2 text-xs text-emerald-900 font-semibold">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Signed in as <strong>{user.name}</strong> — Your saved profile & CV ({user.resumeFileName || 'Resume.pdf'}) are attached!
              </span>
            </span>
            <Link href="/dashboard/candidate" className="text-teal-700 font-bold underline">
              Edit Profile / CV
            </Link>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-700">
            <span>Want to save your CV so you never have to type your info again?</span>
            <Link href="/signup" className="text-teal-600 font-bold underline">
              Create Free Account (20 Sec) →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jessica Taylor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="(214) 555-0192"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              License / Certificate (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Active State License"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Experience Level
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className={inputClass}
            >
              <option value="Entry Level / New Grad">Entry Level / New Grad</option>
              <option value="1–3 Years Experience">1–3 Years Experience</option>
              <option value="3+ Years Experience">3+ Years Experience</option>
              <option value="5+ Years Senior Experience">5+ Years Senior Experience</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Message to Hiring Clinic (Optional)
            </label>
            <button
              type="button"
              onClick={handleGeminiCoverNote}
              disabled={isGeneratingNote}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-teal-600 hover:text-teal-800 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingNote ? 'Gemini AI Writing...' : '✨ Write Message with Gemini AI'}</span>
            </button>
          </div>
          <textarea
            rows={3}
            placeholder="Click 'Write Message with Gemini AI' above or write a short note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Application...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Application to {job.clinicName}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
