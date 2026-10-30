'use client';

import React, { useState, useEffect } from 'react';
import { Job } from '@/data/jobs';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import {
  Send,
  CheckCircle2,
  Sparkles,
  Mail,
  ExternalLink,
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
  const [experience, setExperience] = useState('3+ Years Clinical Experience');
  const [note, setNote] = useState('');
  const [isVipPriority, setIsVipPriority] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setLicense(user.licenseNumber || '');
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
    } catch {
      // ignore
    }
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
      candidate_name: name.trim(),
      candidate_email: email.trim(),
      candidate_phone: phone.trim(),
      license_number: license.trim() || 'Active State License',
      experience_years: experience,
      desired_pay: `$${job.minHourly} - $${job.maxHourly}/hr`,
      cover_note: note.trim(),
      is_vip: isVipPriority,
      status: isVipPriority ? 'VIP Priority Review' : 'Submitted to Doctor',
      created_at: new Date().toISOString()
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
          is_vip: appRecord.is_vip,
          status: appRecord.status,
        }
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
      <div className="bg-white rounded-2xl border-2 border-emerald-500/80 p-6 sm:p-8 shadow-md space-y-4 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Application Sent Directly to {job.clinicName}</span>
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900">
          Your Credentials Have Been Delivered!
        </h3>
        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          Thank you, <strong className="text-slate-900">{name}</strong>. Your application for{' '}
          <strong className="text-slate-900">{job.title}</strong> (${job.minHourly}–${job.maxHourly}/hr) has been routed to the hiring manager at{' '}
          <strong className="text-teal-700">{job.applyEmail}</strong>.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${job.applyEmail}?subject=Follow-up: ${encodeURIComponent(job.title)} Application - ${encodeURIComponent(name)}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Practice Directly ({job.applyEmail})</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="apply-section" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-teal-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Direct Practice Application • No Recruiter Middlemen
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
            Apply Directly to {job.clinicName}
          </h3>
        </div>

        <button
          type="button"
          onClick={toggleSave}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors self-start sm:self-auto ${
            isSaved
              ? 'bg-teal-500/20 border-teal-400 text-teal-300'
              : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-teal-300 text-teal-300' : ''}`} />
          <span>{isSaved ? 'Saved to Bookmarks' : 'Save Opening'}</span>
        </button>
      </div>

      {/* Application Form */}
      <form onSubmit={handleApply} className="p-6 sm:p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Your Full Name & Credentials *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jessica Taylor, RDH"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Mobile Phone *
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              State License / Cert #
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Clinical Experience
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className={inputClass}
            >
              <option value="New Graduate (Licensed)">New Graduate (Licensed)</option>
              <option value="1–2 Years Clinical Experience">1–2 Years Clinical Experience</option>
              <option value="3+ Years Clinical Experience">3+ Years Clinical Experience</option>
              <option value="5+ Years Senior Experience">5+ Years Senior Experience</option>
              <option value="10+ Years Lead Clinician">10+ Years Lead Clinician</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Brief Introduction / Availability Note (Optional)
          </label>
          <textarea
            rows={3}
            placeholder={`Hi ${job.clinicName} team, I am experienced with ${job.softwareUsed[0] || 'your clinical software'} and available for an interview...`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Optional Priority Flag */}
        <div
          onClick={() => setIsVipPriority(!isVipPriority)}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
            isVipPriority
              ? 'bg-amber-50/70 border-amber-300'
              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={isVipPriority}
              onChange={() => {}}
              className="h-4 w-4 rounded border-slate-300 text-teal-600"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Attach Verified License Priority Tag
              </span>
              <p className="text-[11px] text-slate-600">
                Highlights your active clinical license at the top of the practice manager’s inbox.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 shrink-0">
            Free for Clinicians
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Application to Practice...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Direct Application to {job.clinicName}</span>
              </>
            )}
          </button>

          <a
            href={`mailto:${job.applyEmail}?subject=Application for ${encodeURIComponent(job.title)}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Or Email {job.applyEmail}</span>
          </a>
        </div>
      </form>
    </div>
  );
}
