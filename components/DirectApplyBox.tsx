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
  ShieldCheck,
  Loader2,
  Bookmark,
  FileText,
  UserPlus,
  Upload,
  Check
} from 'lucide-react';

interface DirectApplyBoxProps {
  job: Job;
}

export default function DirectApplyBox({ job }: DirectApplyBoxProps) {
  const { user, updateProfile } = useAuth();
  const [missingPhone, setMissingPhone] = useState('');
  const [missingLicense, setMissingLicense] = useState('');
  const [missingResume, setMissingResume] = useState('');
  const [note, setNote] = useState('');
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem('saved_clinic_jobs') || '[]');
      setIsSaved(savedIds.includes(job.id));
    } catch {
      // ignore
    }
  }, [job.id]);

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
      candidateName: user?.name || 'Candidate',
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
    if (!user) return;

    setIsSubmitting(true);
    const finalPhone = user.phone || missingPhone.trim();
    const finalLicense = user.licenseNumber || missingLicense.trim() || 'Active State License';
    const finalResume =
      user.resumeFileName || missingResume || `${user.name.replace(/\s+/g, '_')}_Resume.pdf`;

    // Save any newly provided missing fields to the user's profile so they never have to enter them again
    if (
      (!user.phone && missingPhone.trim()) ||
      (!user.licenseNumber && missingLicense.trim()) ||
      (!user.resumeFileName && missingResume)
    ) {
      await updateProfile({
        phone: finalPhone || user.phone,
        licenseNumber: finalLicense !== 'Active State License' ? finalLicense : user.licenseNumber,
        resumeFileName: finalResume,
        resumeUpdatedAt: 'Updated Today',
      });
    }

    const appRecord = {
      id: `app-${Date.now()}`,
      job_id: job.id,
      job_title: job.title,
      clinic_name: job.clinicName,
      location: job.location,
      candidate_name: user.name,
      candidate_email: user.email,
      candidate_phone: finalPhone || '(Saved in Profile)',
      license_number: finalLicense,
      experience_years: user.yearsExperience || '3+ Years',
      desired_pay: `$${job.minHourly} - $${job.maxHourly}/hr`,
      pay: `$${job.minHourly} - $${job.maxHourly}/hr`,
      resume_file: finalResume,
      cover_note: note.trim(),
      is_vip: true,
      status: 'Application Sent',
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
      const existing = JSON.parse(localStorage.getItem('my_applied_jobs') || '[]');
      localStorage.setItem('my_applied_jobs', JSON.stringify([appRecord, ...existing]));
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
          Application Submitted to {job.clinicName}!
        </h3>
        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          Thank you, <strong className="text-slate-900">{user?.name}</strong>. Your saved profile and CV have been sent for{' '}
          <strong className="text-slate-900">{job.title}</strong> (${job.minHourly}–${job.maxHourly}/hr) and added to your Applied Jobs portal.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard/candidate"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
          >
            <span>Track in My Applied Jobs →</span>
          </Link>
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
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Job Application
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
            Apply for {job.title} at {job.clinicName}
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

      {/* If User is NOT Logged In -> Require Account Creation First */}
      {!user ? (
        <div className="p-6 sm:p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
            <UserPlus className="w-7 h-7" />
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            <h4 className="text-xl font-extrabold text-slate-900">
              Create Your Free Account to Apply for This Job
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To match you with <strong>{job.clinicName}</strong> and let you track your application status, please create a free Job Seeker account once. Your profile and CV are saved so you never have to re-type your details again.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              href={`/signup?role=candidate&redirect=${encodeURIComponent(`/jobs/${job.id}`)}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-xs transition-all"
            >
              Create Free Job Seeker Account & Apply →
            </Link>
            <Link
              href={`/login?role=candidate&redirect=${encodeURIComponent(`/jobs/${job.id}`)}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
            >
              Already Have an Account? Sign In
            </Link>
          </div>
        </div>
      ) : (
        /* Logged-In User -> Uses Saved Profile Automatically, Only Asks for Any Missing Info */
        <form onSubmit={handleApply} className="p-6 sm:p-8 space-y-5">
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-sm text-slate-900">{user.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    ✓ Saved Profile Ready
                  </span>
                </div>
                <p className="text-slate-600">
                  {user.email} • {user.specialty || 'Healthcare Professional'} • {user.location || 'USA'}
                </p>
                <p className="font-bold text-teal-800">
                  Attached CV: {user.resumeFileName || `${user.name.replace(/\s+/g, '_')}_Resume.pdf`}
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/candidate"
              className="text-xs font-bold text-teal-700 hover:text-teal-900 underline shrink-0"
            >
              Update Profile / CV
            </Link>
          </div>

          {/* Smart Missing Fields Section: ONLY shown if something is missing from the user's profile! */}
          {(!user.phone || !user.licenseNumber || !user.resumeFileName) && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-teal-600" />
                <span>Complete Missing Info Once (Automatically saved to your profile for future jobs):</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                {!user.phone && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="(214) 555-0192"
                      value={missingPhone}
                      onChange={(e) => setMissingPhone(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                )}

                {!user.licenseNumber && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      License / Certificate # (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Active State License"
                      value={missingLicense}
                      onChange={(e) => setMissingLicense(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                )}

                {!user.resumeFileName && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Upload Your CV / Resume (Saved to your account)
                    </label>
                    <label className="w-full px-4 py-2.5 rounded-xl border border-dashed border-teal-400 bg-white hover:bg-teal-50 text-xs font-bold text-teal-800 flex items-center justify-center gap-2 cursor-pointer">
                      <Upload className="w-4 h-4 text-teal-600" />
                      <span>{missingResume ? `Attached: ${missingResume}` : 'Choose CV File (PDF / DOCX)'}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setMissingResume(f.name);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

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
              placeholder="Click 'Write Message with Gemini AI' above or submit directly..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Application with My Saved Profile →</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
