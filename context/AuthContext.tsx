'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type UserRole = 'employer' | 'candidate';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  password?: string;
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
  workDays?: string;
  availabilityStatus?: 'open' | 'private';
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
  login: (
    email: string,
    role: UserRole,
    password?: string
  ) => Promise<{ ok: boolean; error?: string; role?: UserRole }>;
  signup: (
    profile: Partial<UserProfile> & { email: string; role: UserRole; name: string; password?: string }
  ) => Promise<{ ok: boolean; error?: string; role?: UserRole }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  switchRole: (nextRole: UserRole) => Promise<void>;
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
    password?: string
  ): Promise<{ ok: boolean; error?: string; role?: UserRole }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { ok: false, error: 'Please enter a valid email address.' };
    }

    // 1. Check locally registered accounts first so custom fields (CV, bio, notifications, role) persist
    try {
      const accountsRaw = localStorage.getItem('clinicstaff_registered_accounts');
      const accounts: Record<string, UserProfile> = accountsRaw ? JSON.parse(accountsRaw) : {};
      if (accounts[cleanEmail]) {
        const found = accounts[cleanEmail];
        if (found.password && password && found.password !== password) {
          return {
            ok: false,
            error: 'Incorrect password for this account. Please try again or click Forgot Password.',
          };
        }
        setUser(found);
        localStorage.setItem('clinicstaff_user', JSON.stringify(found));
        return { ok: true, role: found.role };
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
        const resolvedRole: UserRole = (data.role as UserRole) || role;
        const dbProfile: UserProfile = {
          id: data.id,
          email: data.email,
          role: resolvedRole,
          name: data.name || (resolvedRole === 'employer' ? 'Clinic Hiring Manager' : 'Healthcare Professional'),
          practiceName: data.practice_name || undefined,
          practiceType: data.practice_type || 'Dental',
          npiNumber: resolvedRole === 'employer' ? data.license_number || '' : undefined,
          location: data.location || 'Dallas, TX',
          city: locParts[0] || 'Dallas',
          stateCode: locParts[1] || 'TX',
          phone: data.phone || '',
          specialty: data.specialty || 'Registered Dental Hygienist (RDH)',
          licenseNumber: resolvedRole === 'candidate' ? data.license_number || '' : undefined,
          desiredHourly: data.desired_hourly ? Number(data.desired_hourly) : 45,
          yearsExperience: '1–3 Years',
          availabilityStatus: 'open',
          emailAlertsEnabled: true,
          applicationUpdatesEnabled: true,
          directMessagesEnabled: true,
          notifyEmailJobs: true,
          notifyApplicationUpdates: true,
          notifyEmployerMessages: true,
        };
        setUser(dbProfile);
        localStorage.setItem('clinicstaff_user', JSON.stringify(dbProfile));
        return { ok: true, role: resolvedRole };
      }
    } catch {
      // Fallback to local profile if offline
    }

    // 3. Create a clean session profile from email (without fake license numbers or fake NPIs)
    const emailPrefix = cleanEmail
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const defaultProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      role,
      password,
      name: emailPrefix || (role === 'employer' ? 'Clinic Hiring Manager' : 'Job Seeker'),
      gender: 'Any',
      practiceName: role === 'employer' ? `${emailPrefix} Clinic` : undefined,
      practiceType: role === 'employer' ? 'Dental' : undefined,
      npiNumber: '',
      location: 'Dallas, TX',
      city: 'Dallas',
      stateCode: 'TX',
      zipCode: '75225',
      phone: '',
      specialty: role === 'candidate' ? 'Registered Dental Hygienist (RDH)' : undefined,
      desiredHourly: role === 'candidate' ? 45 : undefined,
      yearsExperience: '1–3 Years',
      licenseNumber: '',
      availabilityStatus: 'open',
      workDays: 'Mon–Fri (Flexible)',
      bio:
        role === 'candidate'
          ? 'Dedicated healthcare professional focused on patient comfort, accurate digital charting, and teamwork.'
          : undefined,
      skills:
        role === 'candidate'
          ? 'Patient Care, Digital Charting, Sterilization, Friendly Communication'
          : undefined,
      resumeFileName: role === 'candidate' ? `${emailPrefix.replace(/\s+/g, '_')}_CV.pdf` : undefined,
      resumeUpdatedAt: 'Saved in Profile',
      emailAlertsEnabled: true,
      applicationUpdatesEnabled: true,
      directMessagesEnabled: true,
      notifyEmailJobs: true,
      notifyApplicationUpdates: true,
      notifyEmployerMessages: true,
    };

    try {
      const accountsRaw = localStorage.getItem('clinicstaff_registered_accounts');
      const accounts: Record<string, UserProfile> = accountsRaw ? JSON.parse(accountsRaw) : {};
      accounts[cleanEmail] = defaultProfile;
      localStorage.setItem('clinicstaff_registered_accounts', JSON.stringify(accounts));
    } catch {
      // ignore
    }

    setUser(defaultProfile);
    localStorage.setItem('clinicstaff_user', JSON.stringify(defaultProfile));
    return { ok: true, role };
  };

  const signup = async (
    profile: Partial<UserProfile> & { email: string; role: UserRole; name: string; password?: string }
  ): Promise<{ ok: boolean; error?: string; role?: UserRole }> => {
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
      yearsExperience: profile.yearsExperience || '1–3 Years',
      desiredHourly: profile.desiredHourly || 45,
      availabilityStatus: 'open',
      workDays: profile.workDays || 'Mon–Fri (Flexible)',
      resumeFileName:
        profile.role === 'candidate'
          ? profile.resumeFileName || `${profile.name.trim().replace(/\s+/g, '_')}_Resume.pdf`
          : undefined,
      resumeUpdatedAt: 'Uploaded Today',
      emailAlertsEnabled: true,
      applicationUpdatesEnabled: true,
      directMessagesEnabled: true,
      notifyEmailJobs: true,
      notifyApplicationUpdates: true,
      notifyEmployerMessages: true,
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
    return { ok: true, role: newProfile.role };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clinicstaff_user');
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/dashboard') || path.startsWith('/post-a-job')) {
        window.location.href = '/login';
      }
    }
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

  const switchRole = async (nextRole: UserRole) => {
    if (!user) return;
    await updateProfile({
      role: nextRole,
      practiceName: nextRole === 'employer' ? user.practiceName || `${user.name} Clinic` : user.practiceName,
      practiceType: nextRole === 'employer' ? user.practiceType || 'Dental' : user.practiceType,
      specialty:
        nextRole === 'candidate'
          ? user.specialty || 'Registered Dental Hygienist (RDH)'
          : user.specialty,
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile, switchRole }}>
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
