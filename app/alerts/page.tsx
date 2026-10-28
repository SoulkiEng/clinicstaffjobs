'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, MessageSquare, Mail, Smartphone } from 'lucide-react';

export default function AlertsPage() {
  const [role, setRole] = useState('Registered Dental Hygienist');
  const [city, setCity] = useState('Dallas, TX');
  const [minPay, setMinPay] = useState('45');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<'email' | 'sms' | 'whatsapp'>('whatsapp');
  const [isVip, setIsVip] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Openings</span>
        </Link>

        {isSubscribed ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">You're Subscribed!</h2>
            <p className="text-sm text-slate-600">
              You will receive instant alerts for <strong className="text-slate-900">{role}</strong> positions paying over{' '}
              <strong className="text-teal-700">${minPay}/hr</strong> in <strong className="text-slate-900">{city}</strong>.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 text-left">
              <div><strong>Selected Alert Channel:</strong> {channel.toUpperCase()}</div>
              <div><strong>Early Bird Status:</strong> {isVip ? 'VIP 24-Hour Early Access' : 'Standard Delivery'}</div>
            </div>
            <Link
              href="/"
              className="inline-block w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors"
            >
              Back to Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                <span>Instant Clinic Job Drops</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Get High-Paying Openings Before Anyone Else
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Top private clinics fill positions in 48 hours. Receive an instant ping on WhatsApp or SMS the minute an opening matching your pay goal drops.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Your Specialty Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="Registered Dental Hygienist">Registered Dental Hygienist (RDH)</option>
                  <option value="Lead Dental Assistant">Lead Dental Assistant (RDA / EFDA)</option>
                  <option value="Certified Medical Assistant">Certified Medical Assistant (CMA)</option>
                  <option value="Physical Therapy Aide">Physical Therapy Aide / Tech</option>
                  <option value="Optometric Assistant">Optometric & Vision Technician</option>
                  <option value="Clinic Front Desk">Clinic Front Desk & Biller</option>
                </select>
              </div>

              {/* Metro & Min Pay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Metro Area
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Dallas, TX"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Min Desired Pay ($/hr)
                  </label>
                  <input
                    type="number"
                    required
                    value={minPay}
                    onChange={(e) => setMinPay(e.target.value)}
                    placeholder="45"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Channel Preference */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Notification Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      channel === 'whatsapp'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      channel === 'sms'
                        ? 'bg-teal-50 text-teal-800 border-teal-400'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                    <span>SMS Text</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      channel === 'email'
                        ? 'bg-cyan-50 text-cyan-800 border-cyan-400'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Email</span>
                  </button>
                </div>
              </div>

              {/* Contact input */}
              {channel === 'email' ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your US Mobile Number ({channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              )}

              {/* VIP Early Bird Toggle ($4.99/mo) */}
              <div
                onClick={() => setIsVip(!isVip)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isVip ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isVip}
                  onChange={() => {}}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>VIP 24-Hour Early Access ($4.99/mo)</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Get alerted 24 hours BEFORE jobs are published publicly to beat 90% of applicants.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all"
              >
                {isVip ? 'Activate VIP Alerts ($4.99/mo)' : 'Activate Free Alerts'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
