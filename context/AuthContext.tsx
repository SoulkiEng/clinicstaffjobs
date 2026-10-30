'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type UserRole = 'employer' | 'candidate';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  // Employer fields
  practiceName?: string;
  practiceType?: string;
  location?: string;
  phone?: string;
  website?: string;
  // Candidate fields
  specialty?: string;
  licenseNumber?: string;
  desiredHourly?: number;
  yearsExperience?: string;
  resumeFileName?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, role: UserRole, password?: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (profile: Partial<UserProfile> & { email: string; role: UserRole; name: string; password?: string }) => Promise<{ ok: boolean; error?: string }>;
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

  const login = async (email: string, role: UserRole, _password?: string): Promise<{ ok: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { ok: false, error: 'Please enter a valid email address.' };
    }

    // 1. Check Supabase profiles table for existing account
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (data) {
        const dbProfile: UserProfile = {
          id: data.id,
          email: data.email,
          role: (data.role as UserRole) || role,
          name: data.name || (role === 'employer' ? 'Practice Hiring Manager' : 'Clinical Professional'),
          practiceName: data.practice_name || undefined,
          practiceType: data.practice_type || undefined,
          location: data.location || 'Dallas, TX',
          phone: data.phone || '(214) 555-0192',
          specialty: data.specialty || undefined,
          licenseNumber: data.license_number || undefined,
          desiredHourly: data.desired_hourly ? Number(data.desired_hourly) : undefined,
        };
        setUser(dbProfile);
        localStorage.setItem('clinicstaff_user', JSON.stringify(dbProfile));
        return { ok: true };
      }
    } catch {
      // Fallback to local profile if offline
    }

    // 2. Check locally registered accounts in localStorage
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

    // 3. Create a realistic session profile derived from their email if signing in directly
    const emailPrefix = cleanEmail.split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const defaultProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      role,
      name:
        cleanEmail.includes('demo') || cleanEmail.includes('sarah')
          ? role === 'employer'
            ? 'Dr. Sarah Mitchell, DDS'
            : 'Jessica Taylor, RDH'
          : role === 'employer'
          ? `${emailPrefix}`
          : `${emailPrefix}`,
      practiceName: role === 'employer' ? 'Preston Hollow Dental Studio' : undefined,
      practiceType: role === 'employer' ? 'Dental' : undefined,
      location: 'Dallas, TX',
      phone: '(214) 555-0192',
      specialty: role === 'candidate' ? 'Registered Dental Hygienist (RDH)' : undefined,
      desiredHourly: role === 'candidate' ? 48 : undefined,
      licenseNumber: role === 'candidate' ? 'TX-DH-94821' : undefined
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

    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      ...profile,
      email: cleanEmail,
      location: profile.location || 'Dallas, TX'
    };

    // Save to Supabase profiles table
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
            license_number: newProfile.licenseNumber || null,
            desired_hourly: newProfile.desiredHourly || null,
          }
        ],
        { onConflict: 'id' }
      );
    } catch (e) {
      console.warn('Supabase profile sync note:', e);
    }

    // Save to local registered dictionary as well
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
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('clinicstaff_user', JSON.stringify(updated));

    try {
      const accountsRaw = localStorage.getItem('clinicstaff_registered_accounts');
      const accounts: Record<string, UserProfile> = accountsRaw ? JSON.parse(accountsRaw) : {};
      accounts[updated.email] = updated;
      localStorage.setItem('clinicstaff_registered_accounts', JSON.stringify(accounts));

      await supabase
        .from('profiles')
        .upsert(
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
              license_number: updated.licenseNumber || null,
              desired_hourly: updated.desiredHourly || null,
            }
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
