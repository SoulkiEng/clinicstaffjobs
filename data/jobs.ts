import allJobsRaw from './all_jobs.json';

export interface USStateInfo {
  code: string;
  name: string;
}

export const US_STATES_52: USStateInfo[] = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

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
  payComparison: string;
  isFeatured: boolean;
  isUrgent: boolean;
  verifiedActive: boolean;
  npiNumber?: string;
  appointmentTime?: string;
  softwareUsed: string[];
  benefits: string[];
  description: string;
  responsibilities: string[];
  qualifications: string[];
  applyEmail: string;
  applyUrl: string;
  postedDate: string;
}

export const ALL_JOBS: Job[] = (allJobsRaw as any[]).map((raw, idx) => ({
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
  npiNumber: raw.npi_number || `1${String(402819300 + idx * 73).slice(0, 9)}`,
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

export const SEED_JOBS: Job[] = ALL_JOBS.slice(0, 100);

export const SALARY_BENCHMARKS = [
  {
    role: 'Registered Dental Hygienist (RDH)',
    cities: [
      { city: 'Dallas, TX', avg: 46, high: 55, count: 64 },
      { city: 'Houston, TX', avg: 45, high: 53, count: 72 },
      { city: 'Miami, FL', avg: 44, high: 52, count: 51 },
      { city: 'Orlando, FL', avg: 42, high: 49, count: 44 },
      { city: 'Atlanta, GA', avg: 45, high: 52, count: 58 },
      { city: 'Phoenix, AZ', avg: 47, high: 55, count: 53 },
      { city: 'Austin, TX', avg: 48, high: 56, count: 49 },
      { city: 'Chicago, IL', avg: 49, high: 59, count: 68 },
      { city: 'Los Angeles, CA', avg: 54, high: 65, count: 82 },
      { city: 'New York, NY', avg: 56, high: 68, count: 88 }
    ]
  },
  {
    role: 'Certified Medical Assistant (CMA)',
    cities: [
      { city: 'Dallas, TX', avg: 22.5, high: 27, count: 84 },
      { city: 'Houston, TX', avg: 22, high: 26, count: 92 },
      { city: 'Miami, FL', avg: 21.5, high: 26, count: 74 },
      { city: 'Orlando, FL', avg: 20.5, high: 24.5, count: 61 },
      { city: 'Atlanta, GA', avg: 22, high: 26.5, count: 78 },
      { city: 'Phoenix, AZ', avg: 23, high: 27.5, count: 69 },
      { city: 'Austin, TX', avg: 23.5, high: 28, count: 59 },
      { city: 'Chicago, IL', avg: 24.5, high: 29.5, count: 76 },
      { city: 'Los Angeles, CA', avg: 27, high: 33, count: 89 },
      { city: 'New York, NY', avg: 28, high: 35, count: 95 }
    ]
  },
  {
    role: 'Lead Dental Assistant (RDA / EFDA)',
    cities: [
      { city: 'Dallas, TX', avg: 25, high: 31, count: 70 },
      { city: 'Houston, TX', avg: 24, high: 29.5, count: 78 },
      { city: 'Miami, FL', avg: 25, high: 32, count: 63 },
      { city: 'Orlando, FL', avg: 23, high: 27.5, count: 48 },
      { city: 'Atlanta, GA', avg: 24, high: 29, count: 62 },
      { city: 'Phoenix, AZ', avg: 25, high: 30, count: 57 },
      { city: 'Austin, TX', avg: 26, high: 31.5, count: 54 },
      { city: 'Chicago, IL', avg: 27, high: 33, count: 65 },
      { city: 'Los Angeles, CA', avg: 29, high: 36, count: 79 },
      { city: 'New York, NY', avg: 30, high: 38, count: 84 }
    ]
  },
  {
    role: 'Physical Therapist Assistant (PTA / Tech)',
    cities: [
      { city: 'Dallas, TX', avg: 33, high: 40, count: 45 },
      { city: 'Houston, TX', avg: 32, high: 39, count: 52 },
      { city: 'Miami, FL', avg: 33, high: 41, count: 40 },
      { city: 'Orlando, FL', avg: 31, high: 38, count: 38 },
      { city: 'Atlanta, GA', avg: 32, high: 39, count: 46 },
      { city: 'Phoenix, AZ', avg: 34, high: 41, count: 41 },
      { city: 'Austin, TX', avg: 34, high: 42, count: 39 },
      { city: 'Chicago, IL', avg: 35, high: 43, count: 50 },
      { city: 'Los Angeles, CA', avg: 38, high: 46, count: 58 },
      { city: 'New York, NY', avg: 39, high: 48, count: 62 }
    ]
  },
  {
    role: 'Clinic Front Office & Treatment Coordinator',
    cities: [
      { city: 'Dallas, TX', avg: 24, high: 30, count: 90 },
      { city: 'Houston, TX', avg: 23.5, high: 29, count: 98 },
      { city: 'Miami, FL', avg: 24, high: 30, count: 85 },
      { city: 'Orlando, FL', avg: 22, high: 27, count: 70 },
      { city: 'Atlanta, GA', avg: 23.5, high: 29, count: 87 },
      { city: 'Phoenix, AZ', avg: 24.5, high: 30.5, count: 76 },
      { city: 'Austin, TX', avg: 25, high: 31, count: 68 },
      { city: 'Chicago, IL', avg: 26, high: 32, count: 80 },
      { city: 'Los Angeles, CA', avg: 28, high: 35, count: 92 },
      { city: 'New York, NY', avg: 29, high: 36, count: 104 }
    ]
  },
  {
    role: 'Licensed Optician & Optometric Tech (COA)',
    cities: [
      { city: 'Dallas, TX', avg: 26, high: 33, count: 42 },
      { city: 'Houston, TX', avg: 25.5, high: 32, count: 48 },
      { city: 'Miami, FL', avg: 26, high: 33, count: 39 },
      { city: 'Orlando, FL', avg: 24, high: 30, count: 34 },
      { city: 'Atlanta, GA', avg: 25.5, high: 32, count: 41 },
      { city: 'Phoenix, AZ', avg: 26.5, high: 33.5, count: 38 },
      { city: 'Austin, TX', avg: 27, high: 34, count: 35 },
      { city: 'Chicago, IL', avg: 28, high: 35, count: 46 },
      { city: 'Los Angeles, CA', avg: 30, high: 38, count: 55 },
      { city: 'New York, NY', avg: 32, high: 40, count: 61 }
    ]
  },
  {
    role: 'Dermatology & MedSpa Clinical Assistant',
    cities: [
      { city: 'Dallas, TX', avg: 27, high: 35, count: 47 },
      { city: 'Houston, TX', avg: 26, high: 34, count: 51 },
      { city: 'Miami, FL', avg: 28, high: 37, count: 62 },
      { city: 'Orlando, FL', avg: 25, high: 32, count: 38 },
      { city: 'Atlanta, GA', avg: 26.5, high: 34.5, count: 49 },
      { city: 'Phoenix, AZ', avg: 27.5, high: 36, count: 45 },
      { city: 'Austin, TX', avg: 28, high: 36, count: 43 },
      { city: 'Chicago, IL', avg: 28.5, high: 36.5, count: 50 },
      { city: 'Los Angeles, CA', avg: 32, high: 42, count: 74 },
      { city: 'New York, NY', avg: 34, high: 44, count: 79 }
    ]
  }
];
