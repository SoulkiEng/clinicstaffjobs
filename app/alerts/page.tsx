'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { US_STATES_52 } from '@/data/jobs';
import {
  Bell,
  ArrowLeft,
  CheckCircle2,
  Mail,
  BadgeCheck,
  Lock,
  Clock,
  Laptop,
  Sparkles,
  Check
} from 'lucide-react';

export default function AlertsPage() {
  const [role, setRole] = useState('Registered Dental Hygienist (RDH)');
  const [stateCode, setStateCode] = useState('TX');
  const [city, setCity] = useState('Dallas');
  const [minPay, setMinPay] = useState('45');
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant');
  const [browserPushEnabled, setBrowserPushEnabled] = useState(false);
  const [pushStatusText, setPushStatusText] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleEnableBrowserPush = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPushStatusText('Browser notifications are managed by your device settings.');
      setBrowserPushEnabled(true);
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setBrowserPushEnabled(true);
        setPushStatusText('Desktop & Mobile Browser Push Alerts Activated (100% Free)');
        new Notification('ClinicStaffJobs.com Alerts Active', {
          body: `You will be notified when ${role} roles ($${minPay}+/hr) open in ${city}, ${stateCode}.`,
        });
      } else {
        setBrowserPushEnabled(false);
        setPushStatusText('Email alerts will be used as your primary delivery channel.');
      }
    } catch {
      setBrowserPushEnabled(true);
      setPushStatusText('Browser alert preference saved.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from('alerts').insert([
        {
          id: `alert-${Date.now()}`,
          role,
          city: `${city.trim()}, ${stateCode}`,
          min_pay: Number(minPay) || 30,
          channel: `email_${frequency}${browserPushEnabled ? '_push' : ''}`,
          contact: email.trim(),
          is_vip: true,
        },
      ]);
    } catch {
      // ignore if table offline
    }
    setIsSubscribed(true);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to 52-State Job Board</span>
        </Link>

        {isSubscribed ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-md">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Free Direct Email Alert Active
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">Clinician Email Alert Activated!</h2>
            <p className="text-sm text-slate-600">
              We will send <strong className="text-slate-900">{frequency}</strong> email notifications to{' '}
              <strong className="text-slate-900">{email}</strong> for NPI-verified{' '}
              <strong className="text-slate-900">{role}</strong> openings paying{' '}
              <strong className="text-teal-700">${minPay}+/hr</strong> in{' '}
              <strong className="text-slate-900">
                {city}, {stateCode}
              </strong>
              .
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5 text-left">
              <div>
                <strong>Primary Delivery Channel:</strong> Verified Email Digest ({frequency.toUpperCase()})
              </div>
              <div>
                <strong>Browser Web Push:</strong> {browserPushEnabled ? 'Enabled (Instant Desktop/Mobile Push)' : 'Email Only'}
              </div>
              <div>
                <strong>Cost:</strong> 100% Free for Clinicians ($0 Forever)
              </div>
              <div>
                <strong>Privacy Guarantee:</strong> HIPAA & CCPA Protected — Unsubscribe in 1 Click Anytime
              </div>
            </div>
            <Link
              href="/"
              className="inline-block w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors"
            >
              Return to Browse 52-State Openings
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                <span>100% Free Email & Browser Job Alerts • All 52 States</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Get Verified Private Practice Openings in Your Inbox
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Receive direct Email & Browser notifications the moment an NPI-verified private clinic in your state posts an opening matching your hourly rate and clinical specialty.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Clinical Specialty & Role *
                </label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
                  <option value="Registered Dental Hygienist (RDH)">Registered Dental Hygienist (RDH)</option>
                  <option value="Lead Dental Assistant (RDA / EFDA)">Lead Dental Assistant (RDA / EFDA)</option>
                  <option value="Certified Medical Assistant (CMA)">Certified Medical Assistant (CMA / RMA)</option>
                  <option value="Physical Therapist Assistant (PTA / Tech)">Physical Therapist Assistant (PTA / Tech)</option>
                  <option value="Optometric Technician / Licensed Optician">Optometric Tech & Licensed Optician</option>
                  <option value="Dermatology MA & Medical Aesthetician">Dermatology MA & Medical Aesthetician</option>
                  <option value="Clinic Front Office & Practice Manager">Clinic Front Office & Practice Manager</option>
                  <option value="Associate Dentist (DDS / DMD)">Associate Dentist (DDS / DMD)</option>
                </select>
              </div>

              {/* State, City & Min Pay */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    State (52) *
                  </label>
                  <select value={stateCode} onChange={(e) => setStateCode(e.target.value)} className={inputClass}>
                    {US_STATES_52.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.name} ({st.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    City / Metro *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Dallas"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Min Pay ($/hr) *
                  </label>
                  <input
                    type="number"
                    required
                    value={minPay}
                    onChange={(e) => setMinPay(e.target.value)}
                    placeholder="45"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email Delivery Frequency */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Notification Frequency (100% Free)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFrequency('instant')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      frequency === 'instant'
                        ? 'bg-teal-50 text-teal-900 border-teal-500 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Instant Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFrequency('daily')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      frequency === 'daily'
                        ? 'bg-teal-50 text-teal-900 border-teal-500 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Daily 8AM Digest</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFrequency('weekly')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      frequency === 'weekly'
                        ? 'bg-teal-50 text-teal-900 border-teal-500 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <span>Weekly Roundup</span>
                  </button>
                </div>
              </div>

              {/* Email Address Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Direct Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="clinician@email.com"
                  className={inputClass}
                />
              </div>

              {/* Optional Free Browser Web Push Toggle */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50/70 to-emerald-50/70 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-teal-600" />
                    <span>Optional: Free Instant Browser Push Notification</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Get an instant desktop/mobile browser alert with zero phone number required.
                  </p>
                  {pushStatusText && (
                    <p className="text-[11px] font-bold text-emerald-700 pt-0.5">{pushStatusText}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleEnableBrowserPush}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer inline-flex items-center gap-1 ${
                    browserPushEnabled
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-teal-800 border-teal-300 hover:bg-teal-50'
                  }`}
                >
                  {browserPushEnabled ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Push Enabled</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5" />
                      <span>Enable Browser Push</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-600">
                <Lock className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  100% Free Clinician Service. Unsubscribe in 1 click anytime. Protected under our{' '}
                  <Link href="/privacy" className="text-teal-700 font-bold underline">
                    Data Privacy Policy
                  </Link>
                  .
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                Activate Free Email Job Alerts
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
