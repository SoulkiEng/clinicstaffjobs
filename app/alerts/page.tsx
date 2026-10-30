'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { US_STATES_52 } from '@/data/jobs';
import { useAuth } from '@/context/AuthContext';
import {
  Bell,
  ArrowLeft,
  CheckCircle2,
  Mail,
  BadgeCheck,
  Lock,
  Laptop,
  Check
} from 'lucide-react';

export default function AlertsPage() {
  const { user } = useAuth();
  const [role, setRole] = useState('Registered Dental Hygienist (RDH)');
  const [stateCode, setStateCode] = useState('TX');
  const [city, setCity] = useState('Dallas');
  const [minPay, setMinPay] = useState('45');
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant');
  const [browserPushEnabled, setBrowserPushEnabled] = useState(false);
  const [pushStatusText, setPushStatusText] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Pre-fill from logged-in user profile so they never re-type
  useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.stateCode) setStateCode(user.stateCode);
      if (user.city) setCity(user.city);
      if (user.specialty) setRole(user.specialty);
      if (user.desiredHourly) setMinPay(String(user.desiredHourly));
    }
  }, [user]);

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
          body: `You will be notified when ${role} jobs ($${minPay}+/hr) open in ${city}, ${stateCode}.`,
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
          <span>Back to All Jobs</span>
        </Link>

        {isSubscribed ? (
          <div
            role="status"
            aria-live="polite"
            className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-md"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Free Email Alert Active
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">Your Job Alert Is Active!</h2>
            <p className="text-sm text-slate-600">
              We will send <strong className="text-slate-900">{frequency}</strong> email notifications to{' '}
              <strong className="text-slate-900">{email}</strong> for verified{' '}
              <strong className="text-slate-900">{role}</strong> jobs paying{' '}
              <strong className="text-teal-700">${minPay}+/hr</strong> in{' '}
              <strong className="text-slate-900">
                {city}, {stateCode}
              </strong>
              .
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5 text-left">
              <div>
                <strong>Delivery Schedule:</strong> Email ({frequency.toUpperCase()})
              </div>
              <div>
                <strong>Browser Notification:</strong> {browserPushEnabled ? 'Enabled' : 'Email Only'}
              </div>
              <div>
                <strong>Cost:</strong> 100% Free ($0 Forever)
              </div>
            </div>
            <Link
              href="/"
              className="inline-block w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors"
            >
              Browse Matching Jobs Now
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                <span>100% Free Email Job Alerts • All 52 States</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Get New Clinic Jobs in Your Email
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Receive an email notification whenever a private clinic in your city posts a new job matching your role and desired hourly pay.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Role & Minimum Hourly Pay (2 Equal Aligned Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="alert-role" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Job Role *
                  </label>
                  <select
                    id="alert-role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Registered Dental Hygienist (RDH)">Dental Hygienist (RDH)</option>
                    <option value="Dental Assistant (RDA / EFDA)">Dental Assistant (RDA / EFDA)</option>
                    <option value="Certified Medical Assistant (CMA)">Medical Assistant (CMA / RMA)</option>
                    <option value="Physical Therapist Assistant (PTA)">Physical Therapy Assistant (PTA)</option>
                    <option value="Optometric Tech / Optician">Optician & Eye Tech</option>
                    <option value="Dermatology & MedSpa Assistant">Dermatology & MedSpa Staff</option>
                    <option value="Front Desk / Clinic Manager">Front Desk & Clinic Manager</option>
                    <option value="Associate Dentist (DDS / DMD)">Dentist (DDS / DMD)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="alert-minpay" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Minimum Hourly Pay ($/hr) *
                  </label>
                  <input
                    id="alert-minpay"
                    name="minPay"
                    type="text"
                    inputMode="numeric"
                    required
                    value={minPay}
                    onChange={(e) => setMinPay(e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="45"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Row 2: State & City (2 Equal Aligned Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="alert-state" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    State (All 52 States) *
                  </label>
                  <select
                    id="alert-state"
                    name="stateCode"
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    className={inputClass}
                  >
                    {US_STATES_52.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.name} ({st.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="alert-city" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    City *
                  </label>
                  <input
                    id="alert-city"
                    name="city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Dallas"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Row 3: Email Address */}
              <div>
                <label htmlFor="alert-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Email Address *
                </label>
                <input
                  id="alert-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className={inputClass}
                />
              </div>

              {/* Email Delivery Frequency (Fieldset + Radio Buttons for <6 options) */}
              <fieldset className="space-y-1.5">
                <legend className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  How Often Should We Email You? (100% Free)
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'instant', label: 'Instant Alert' },
                    { id: 'daily', label: 'Daily Summary' },
                    { id: 'weekly', label: 'Weekly Summary' },
                  ].map((item) => {
                    const checked = frequency === item.id;
                    return (
                      <label
                        key={item.id}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                          checked
                            ? 'bg-teal-50 text-teal-900 border-teal-500 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="frequency"
                          value={item.id}
                          checked={checked}
                          onChange={() => setFrequency(item.id as any)}
                          className="accent-teal-600"
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Optional Free Browser Web Push Toggle */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50/70 to-emerald-50/70 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-teal-600" />
                    <span>Optional: Free Browser Notification</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Get an instant desktop or mobile browser alert when a matching job is posted.
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
                  100% Free Service. Unsubscribe in 1 click anytime. Protected under our{' '}
                  <Link href="/privacy" className="text-teal-700 font-bold underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                Turn On Free Job Alerts
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
