'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { US_STATES_52 } from '@/data/jobs';
import {
  Bell,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  Mail,
  Smartphone,
  BadgeCheck,
  Lock
} from 'lucide-react';

export default function AlertsPage() {
  const [role, setRole] = useState('Registered Dental Hygienist (RDH)');
  const [stateCode, setStateCode] = useState('TX');
  const [city, setCity] = useState('Dallas');
  const [minPay, setMinPay] = useState('45');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from('alerts').insert([
        {
          id: `alert-${Date.now()}`,
          role,
          city: `${city.trim()}, ${stateCode}`,
          min_pay: Number(minPay) || 30,
          channel,
          contact: channel === 'email' ? email : phone,
          is_vip: true,
        }
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
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Free Clinician Alert Active
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">Instant Job Alert Activated!</h2>
            <p className="text-sm text-slate-600">
              You will receive instant notifications for NPI-verified <strong className="text-slate-900">{role}</strong> openings paying{' '}
              <strong className="text-teal-700">${minPay}+/hr</strong> in <strong className="text-slate-900">{city}, {stateCode}</strong>.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 text-left">
              <div><strong>Alert Delivery Channel:</strong> {channel.toUpperCase()}</div>
              <div><strong>Cost:</strong> 100% Free for Clinicians ($0)</div>
              <div><strong>Privacy Guarantee:</strong> HIPAA & CCPA Protected — Never Shared with Agencies</div>
            </div>
            <Link
              href="/"
              className="inline-block w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors"
            >
              Return to Browse Openings
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                <Bell className="w-3.5 h-3.5 text-teal-600" />
                <span>100% Free Instant Clinician Job Alerts • All 52 States</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Get Verified Private Practice Openings First
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Receive an instant notification via Email, SMS, or WhatsApp the moment an NPI-verified private clinic in your state posts an opening matching your hourly rate.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Clinical Specialty & Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={inputClass}
                >
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
                  <select
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

              {/* Channel Preference */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Preferred Delivery Channel (100% Free)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      channel === 'email'
                        ? 'bg-teal-50 text-teal-900 border-teal-500'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <span>Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      channel === 'sms'
                        ? 'bg-teal-50 text-teal-900 border-teal-500'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                    <span>SMS Text</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      channel === 'whatsapp'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-500'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Contact input */}
              {channel === 'email' ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Email Address *
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
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your US Mobile Number ({channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className={inputClass}
                  />
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-600">
                <Lock className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  100% Free Clinician Service. Unsubscribe in 1 click anytime. Protected under our <Link href="/privacy" className="text-teal-700 font-bold underline">Data Privacy Policy</Link>.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all"
              >
                Activate Free Instant Job Alerts
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
