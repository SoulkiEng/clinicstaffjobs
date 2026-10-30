import allJobsRaw from './all_jobs.json';

export interface Job {
  id: string;
  title: string;
  clinicName: string;
  clinicType: 'Dental' | 'Vision' | 'Physical Therapy' | 'Dermatology & MedSpa' | 'Family Medicine';
  location: string;
  city: string;
  state: string;
  zipCode: string;
  workType: 'Full-time' | 'Part-time' | 'PRN / Temp';
  minHourly: number;
  maxHourly: number;
  payPeriod: 'hour';
  payComparison: string; // e.g. "+18% Above City Avg"
  isFeatured: boolean;
  isUrgent: boolean;
  verifiedActive: boolean;
  appointmentTime?: string;
  softwareUsed: string[];
  benefits: string[];
  description: string;
  responsibilities: string[];
  qualifications: string[];
  applyEmail: string;
  applyUrl: string;
  postedDate: string; // ISO format
}

export const ALL_JOBS: Job[] = (allJobsRaw as any[]).map((raw) => ({
  id: raw.id,
  title: raw.title,
  clinicName: raw.clinic_name,
  clinicType: raw.clinic_type,
  location: raw.location,
  city: raw.city,
  state: raw.state,
  zipCode: raw.zip_code,
  workType: raw.work_type || 'Full-time',
  minHourly: Number(raw.min_hourly),
  maxHourly: Number(raw.max_hourly),
  payPeriod: raw.pay_period || 'hour',
  payComparison: raw.pay_comparison || '+18% Above City Avg',
  isFeatured: Boolean(raw.is_featured),
  isUrgent: Boolean(raw.is_urgent),
  verifiedActive: Boolean(raw.verified_active),
  appointmentTime: raw.appointment_time,
  softwareUsed: Array.isArray(raw.software_used) ? raw.software_used : [],
  benefits: Array.isArray(raw.benefits) ? raw.benefits : [],
  description: raw.description,
  responsibilities: Array.isArray(raw.responsibilities) ? raw.responsibilities : [],
  qualifications: Array.isArray(raw.qualifications) ? raw.qualifications : [],
  applyEmail: raw.apply_email,
  applyUrl: raw.apply_url || '',
  postedDate: raw.created_at || '2026-10-30T00:00:00Z',
}));

// Default SEED_JOBS for initial quick render
export const SEED_JOBS: Job[] = ALL_JOBS.slice(0, 100);


export const SALARY_BENCHMARKS = [
  {
    role: 'Registered Dental Hygienist (RDH)',
    cities: [
      { city: 'Dallas, TX', avg: 45, high: 54, count: 48 },
      { city: 'Houston, TX', avg: 44, high: 52, count: 56 },
      { city: 'Miami, FL', avg: 43, high: 50, count: 39 },
      { city: 'Orlando, FL', avg: 41, high: 48, count: 32 },
      { city: 'Atlanta, GA', avg: 44, high: 51, count: 44 },
      { city: 'Phoenix, AZ', avg: 46, high: 53, count: 41 },
      { city: 'Austin, TX', avg: 47, high: 55, count: 38 },
      { city: 'Chicago, IL', avg: 48, high: 58, count: 52 },
      { city: 'Los Angeles, CA', avg: 52, high: 64, count: 60 },
      { city: 'New York Metro, NY', avg: 54, high: 66, count: 65 }
    ]
  },
  {
    role: 'Certified Medical Assistant (CMA)',
    cities: [
      { city: 'Dallas, TX', avg: 22, high: 26, count: 72 },
      { city: 'Houston, TX', avg: 21.5, high: 25.5, count: 85 },
      { city: 'Miami, FL', avg: 21, high: 25, count: 64 },
      { city: 'Orlando, FL', avg: 20, high: 24, count: 51 },
      { city: 'Atlanta, GA', avg: 21, high: 25, count: 68 },
      { city: 'Phoenix, AZ', avg: 22.5, high: 27, count: 59 },
      { city: 'Austin, TX', avg: 23, high: 27.5, count: 49 },
      { city: 'Chicago, IL', avg: 24, high: 29, count: 62 },
      { city: 'Los Angeles, CA', avg: 26, high: 32, count: 70 },
      { city: 'New York Metro, NY', avg: 27, high: 34, count: 78 }
    ]
  },
  {
    role: 'Lead Dental Assistant (RDA / EFDA)',
    cities: [
      { city: 'Dallas, TX', avg: 24, high: 29, count: 60 },
      { city: 'Houston, TX', avg: 23, high: 28, count: 68 },
      { city: 'Miami, FL', avg: 24.5, high: 31, count: 53 },
      { city: 'Orlando, FL', avg: 22, high: 26, count: 40 },
      { city: 'Atlanta, GA', avg: 23, high: 27.5, count: 52 },
      { city: 'Phoenix, AZ', avg: 24, high: 28.5, count: 47 },
      { city: 'Austin, TX', avg: 25, high: 30, count: 44 },
      { city: 'Chicago, IL', avg: 26, high: 32, count: 55 },
      { city: 'Los Angeles, CA', avg: 28, high: 35, count: 64 },
      { city: 'New York Metro, NY', avg: 29, high: 36, count: 72 }
    ]
  },
  {
    role: 'Physical Therapy Aide / Tech',
    cities: [
      { city: 'Dallas, TX', avg: 18.5, high: 22, count: 35 },
      { city: 'Houston, TX', avg: 18, high: 21.5, count: 42 },
      { city: 'Miami, FL', avg: 18, high: 21, count: 30 },
      { city: 'Orlando, FL', avg: 17.5, high: 20.5, count: 28 },
      { city: 'Atlanta, GA', avg: 18.5, high: 22, count: 36 },
      { city: 'Phoenix, AZ', avg: 19, high: 22.5, count: 31 },
      { city: 'Austin, TX', avg: 19.5, high: 23, count: 29 },
      { city: 'Chicago, IL', avg: 20.5, high: 25, count: 40 },
      { city: 'Los Angeles, CA', avg: 22, high: 27, count: 45 },
      { city: 'New York Metro, NY', avg: 23, high: 28, count: 50 }
    ]
  },
  {
    role: 'Front Desk Clinic Coordinator',
    cities: [
      { city: 'Dallas, TX', avg: 20, high: 24, count: 80 },
      { city: 'Houston, TX', avg: 19.5, high: 23.5, count: 90 },
      { city: 'Miami, FL', avg: 20, high: 24, count: 75 },
      { city: 'Orlando, FL', avg: 18.5, high: 22, count: 60 },
      { city: 'Atlanta, GA', avg: 19.5, high: 23.5, count: 77 },
      { city: 'Phoenix, AZ', avg: 20.5, high: 25, count: 66 },
      { city: 'Austin, TX', avg: 21.5, high: 26, count: 58 },
      { city: 'Chicago, IL', avg: 22, high: 27, count: 70 },
      { city: 'Los Angeles, CA', avg: 24, high: 30, count: 82 },
      { city: 'New York Metro, NY', avg: 25, high: 32, count: 95 }
    ]
  }
];
