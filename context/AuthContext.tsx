'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
  login: (email: string, role: UserRole) => void;
  signup: (profile: Partial<UserProfile> & { email: string; role: UserRole; name: string }) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
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

  const login = (email: string, role: UserRole) => {
    const defaultProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      role,
      name: role === 'employer' ? 'Dr. Sarah Mitchell, DDS' : 'Jessica Taylor, RDH',
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
  };

  const signup = (profile: Partial<UserProfile> & { email: string; role: UserRole; name: string }) => {
    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      ...profile,
      location: profile.location || 'Dallas, TX'
    };

    setUser(newProfile);
    localStorage.setItem('clinicstaff_user', JSON.stringify(newProfile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clinicstaff_user');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('clinicstaff_user', JSON.stringify(updated));
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
