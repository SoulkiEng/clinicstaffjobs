'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type UserRole = 'employer' | 'candidate';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  gender?: 'Female' | 'Male' | 'Any';
  // Employer fields
  practiceName?: string;
  practiceType?: string;
  npiNumber?: string;
  location?: string;
  city?: string;
  stateCode?: string;
  zipCode?: string;
  phone?: string;
  website?: string;
  // Candidate fields
  specialty?: string;
  licenseNumber?: string;
  desiredHourly?: number;
  yearsExperience?: string;
  skills?: string | string[];
  bio?: string;
  resumeFileName?: string;
  resumeUpdatedAt?: string;
  // Notification preferences
  emailAlertsEnabled?: boolean;
  applicationUpdatesEnabled?: boolean;
  directMessagesEnabled?: boolean;
  notifyEmailJobs?: boolean;
  notifyApplicationUpdates?: boolean;
  notifyEmployerMessages?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, role: UserRole, password?: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (
    profile: Partial<UserProfile> & { email: string; role: UserRole; name: string; password?: string }
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('clinicstaff_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load user session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    role: UserRole,
    _password?: string
  ): Promise<{ ok: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { ok: false, error: 'Please enter a valid email address.' };
    }

    // 1. Check locally registered accounts first so custom fields (CV, bio, notifications) persist
    try {
      const accountsRaw = localStorage.getItem('clinicstaff_registered_accounts');
      const accounts: Record<string, UserProfile> = accountsRaw ? JSON.parse(accountsRaw) : {};
      if (accounts[cleanEmail]) {
        const found = accounts[cleanEmail];
        setUser(found);
        localStorage.setItem('clinicstaff_user', JSON.stringify(found));
        return { ok: true };
      }
    } catch {
      // ignore
    }

    // 2. Check Supabase profiles table
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (data) {
        const locParts = (data.location || 'Dallas, TX').split(',').map((s: string) => s.trim());
        const dbProfile: UserProfile = {
          id: data.id,
          email: data.email,
          role: (data.role as UserRole) || role,
          name: data.name || (role === 'employer' ? 'Clinic Hiring Manager' : 'Healthcare Professional'),
          practiceName: data.practice_name || undefined,
          practiceType: data.practice_type || 'Dental',
          npiNumber: data.license_number || '1487920319',
          location: data.location || 'Dallas, TX',
          city: locParts[0] || 'Dallas',
          stateCode: locParts[1] || 'TX',
          phone: data.phone || '(214) 555-0192',
          specialty: data.specialty || 'Registered Dental Hygienist (RDH)',
          licenseNumber: data.license_number || undefined,
          desiredHourly: data.desired_hourly ? Number(data.desired_hourly) : 45,
          yearsExperience: '4',
          emailAlertsEnabled: true,
          applicationUpdatesEnabled: true,
          directMessagesEnabled: true,
        };
        setUser(dbProfile);
        localStorage.setItem('clinicstaff_user', JSON.stringify(dbProfile));
        return { ok: true };
      }
    } catch {
      // Fallback to local profile if offline
    }

    // 3. Create a clean session profile from email
    const emailPrefix = cleanEmail
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const defaultProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      role,
      name: emailPrefix || (role === 'employer' ? 'Dr. Sarah Mitchell' : 'Jessica Taylor'),
      gender: 'Female',
      practiceName: role === 'employer' ? `${emailPrefix} Clinic` : undefined,
      practiceType: role === 'employer' ? 'Dental' : undefined,
      npiNumber: role === 'employer' ? '1487920319' : undefined,
      location: 'Dallas, TX',
      city: 'Dallas',
      stateCode: 'TX',
      zipCode: '75225',
      phone: '(214) 555-0192',
      specialty: role === 'candidate' ? 'Registered Dental Hygienist (RDH)' : undefined,
      desiredHourly: role === 'candidate' ? 48 : undefined,
      yearsExperience: '4',
      licenseNumber: role === 'candidate' ? 'TX-RDH-94821' : undefined,
      bio:
        role === 'candidate'
          ? 'Dedicated healthcare professional focused on patient comfort, accurate digital charting, and teamwork.'
          : undefined,
      skills:
        role === 'candidate'
          ? 'Patient Care, Digital Charting, Sterilization, Friendly Communication'
          : undefined,
      resumeFileName: role === 'candidate' ? `${emailPrefix.replace(/\s+/g, '_')}_CV.pdf` : undefined,
      resumeUpdatedAt: 'Updated Today',
      emailAlertsEnabled: true,
      applicationUpdatesEnabled: true,
      directMessagesEnabled: true,
    };

    setUser(defaultProfile);
    localStorage.setItem('clinicstaff_user', JSON.stringify(defaultProfile));
    return { ok: true };
  };

  const signup = async (
    profile: Partial<UserProfile> & { email: string; role: UserRole; name: string; password?: string }
  ): Promise<{ ok: boolean; error?: string }> => {
    const cleanEmail = profile.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { ok: false, error: 'Please enter a valid email address.' };
    }

    const locParts = (profile.location || 'Dallas, TX').split(',').map((s) => s.trim());

    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      gender: profile.gender || 'Any',
      city: profile.city || locParts[0] || 'Dallas',
      stateCode: profile.stateCode || locParts[1] || 'TX',
      zipCode: profile.zipCode || '75225',
      yearsExperience: profile.yearsExperience || '3',
      desiredHourly: profile.desiredHourly || 42,
      resumeFileName:
        profile.role === 'candidate'
          ? `${profile.name.trim().replace(/\s+/g, '_')}_Resume.pdf`
          : undefined,
      resumeUpdatedAt: 'Uploaded Today',
      emailAlertsEnabled: true,
      applicationUpdatesEnabled: true,
      directMessagesEnabled: true,
      ...profile,
      email: cleanEmail,
      location: profile.location || `${profile.city || 'Dallas'}, ${profile.stateCode || 'TX'}`,
    };

    try {
      await supabase.from('profiles').upsert(
        [
          {
            id: newProfile.id,
            email: newProfile.email,
            role: newProfile.role,
            name: newProfile.name,
            practice_name: newProfile.practiceName || null,
            practice_type: newProfile.practiceType || null,
            location: newProfile.location || 'Dallas, TX',
            phone: newProfile.phone || null,
            specialty: newProfile.specialty || null,
            license_number: newProfile.licenseNumber || newProfile.npiNumber || null,
            desired_hourly: newProfile.desiredHourly || null,
          },
        ],
        { onConflict: 'id' }
      );
    } catch (e) {
      console.warn('Supabase profile sync note:', e);
    }

    try {
      const accountsRaw = localStorage.getItem('clinicstaff_registered_accounts');
      const accounts: Record<string, UserProfile> = accountsRaw ? JSON.parse(accountsRaw) : {};
      accounts[cleanEmail] = newProfile;
      localStorage.setItem('clinicstaff_registered_accounts', JSON.stringify(accounts));
    } catch {
      // ignore
    }

    setUser(newProfile);
    localStorage.setItem('clinicstaff_user', JSON.stringify(newProfile));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clinicstaff_user');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      ...updates,
      location:
        updates.city || updates.stateCode
          ? `${updates.city || user.city || 'Dallas'}, ${updates.stateCode || user.stateCode || 'TX'}`
          : updates.location || user.location,
    };
    setUser(updated);
    localStorage.setItem('clinicstaff_user', JSON.stringify(updated));

    try {
      const accountsRaw = localStorage.getItem('clinicstaff_registered_accounts');
      const accounts: Record<string, UserProfile> = accountsRaw ? JSON.parse(accountsRaw) : {};
      accounts[updated.email] = updated;
      localStorage.setItem('clinicstaff_registered_accounts', JSON.stringify(accounts));

      await supabase.from('profiles').upsert(
        [
          {
            id: updated.id,
            email: updated.email,
            role: updated.role,
            name: updated.name,
            practice_name: updated.practiceName || null,
            practice_type: updated.practiceType || null,
            location: updated.location || null,
            phone: updated.phone || null,
            specialty: updated.specialty || null,
            license_number: updated.licenseNumber || updated.npiNumber || null,
            desired_hourly: updated.desiredHourly || null,
          },
        ],
        { onConflict: 'id' }
      );
    } catch {
      // ignore offline error
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
