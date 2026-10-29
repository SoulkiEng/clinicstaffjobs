-- ===================================================
-- ClinicStaffJobs.com — Production Supabase Database Schema
-- Run this script in your Supabase SQL Editor
-- ===================================================

-- 1. Create JOBS Table
CREATE TABLE IF NOT EXISTS public.jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  clinic_name TEXT NOT NULL,
  clinic_type TEXT NOT NULL, -- Dental, Vision, Physical Therapy, Dermatology & MedSpa, Family Medicine
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  work_type TEXT DEFAULT 'Full-time',
  min_hourly NUMERIC NOT NULL,
  max_hourly NUMERIC NOT NULL,
  pay_period TEXT DEFAULT 'hour',
  pay_comparison TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_urgent BOOLEAN DEFAULT false,
  verified_active BOOLEAN DEFAULT true,
  appointment_time TEXT,
  software_used TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  qualifications TEXT[] DEFAULT '{}',
  apply_email TEXT NOT NULL,
  apply_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for Jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public) to view jobs
CREATE POLICY "Allow public read access to jobs"
  ON public.jobs FOR SELECT
  USING (true);

-- Allow authenticated users or API to insert jobs
CREATE POLICY "Allow insert access to jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update access to jobs"
  ON public.jobs FOR UPDATE
  USING (true);


-- 2. Create PROFILES / USERS Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- 'employer' or 'candidate'
  practice_name TEXT,
  practice_type TEXT,
  specialty TEXT,
  location TEXT,
  phone TEXT,
  license_number TEXT,
  desired_hourly NUMERIC,
  resume_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow insert/update access to profiles"
  ON public.profiles FOR ALL
  USING (true);


-- 3. Create APPLICATIONS Table
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  job_id TEXT REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  candidate_phone TEXT,
  candidate_license TEXT,
  experience TEXT,
  desired_pay TEXT,
  is_vip BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'Under Review', -- 'Under Review', 'Interview Requested', 'Hired'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write to applications"
  ON public.applications FOR ALL
  USING (true);


-- 4. Create SUBSCRIBERS Table (for VIP WhatsApp / SMS / Email Alerts)
CREATE TABLE IF NOT EXISTS public.subscribers (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  city TEXT NOT NULL,
  min_pay NUMERIC NOT NULL,
  channel TEXT NOT NULL, -- 'whatsapp', 'sms', 'email'
  contact TEXT NOT NULL,
  is_vip BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert to subscribers"
  ON public.subscribers FOR ALL
  USING (true);


-- 5. Seed Initial 8 Verified Clinic Jobs
INSERT INTO public.jobs (
  id, title, clinic_name, clinic_type, location, city, state, zip_code, work_type,
  min_hourly, max_hourly, pay_period, pay_comparison, is_featured, is_urgent, verified_active,
  appointment_time, software_used, benefits, description, responsibilities, qualifications, apply_email, apply_url
) VALUES
(
  'job-1',
  'Registered Dental Hygienist (RDH) - 60 Min Slots',
  'Preston Hollow Dental Studio',
  'Dental',
  'Dallas, TX', 'Dallas', 'TX', '75225', 'Full-time',
  46, 52, 'hour', '+16% Above Dallas Avg', true, true, true,
  '60-Min Adult Prophy Slots',
  ARRAY['Dentrix Ascend', 'Dexis Digital Sensors', 'iTero Scanner'],
  ARRAY['100% Employer-Paid Health Insurance', '401(k) with 4% Match', '$1,000 Annual CE Stipend'],
  'We are an established private cosmetic dental practice in North Dallas seeking a passionate Registered Dental Hygienist with 60-minute recare slots.',
  ARRAY['Conduct periodontal evaluations', 'Perform dental prophylaxis and SRP', 'Take digital radiographs with Dexis'],
  ARRAY['Active Texas Dental Hygiene License', 'Current CPR/BLS certification'],
  'hiring@prestonhollowdental.com',
  'https://prestonhollowdental.com'
),
(
  'job-2',
  'Certified Medical Assistant (CMA) - Outpatient Ortho',
  'Summit Orthopedic & Spine Clinic',
  'Physical Therapy',
  'Houston, TX', 'Houston', 'TX', '77030', 'Full-time',
  23, 27, 'hour', '+14% Above Houston Avg', true, false, true,
  'Structured 20-Min Clinic Flow',
  ARRAY['AthenaHealth EHR', 'Phreesia Intake'],
  ARRAY['Comprehensive Medical, Dental, Vision', 'Uniform Allowance', 'No Nights or Weekends'],
  'Summit Orthopedics is looking for an energetic Certified Medical Assistant to assist our orthopedic surgeons and physical medicine specialists.',
  ARRAY['Room patients and obtain vitals', 'Prepare sterile injection fields', 'Coordinate physical therapy referrals'],
  ARRAY['Certified Medical Assistant (AAMA or NHA CCMA)', 'BLS certification'],
  'careers@summitortho-tx.com',
  'https://summitortho-tx.com'
),
(
  'job-3',
  'Lead Dental Assistant (RDA) - Cosmetic & Implants',
  'Biscayne Bay Esthetic Dentistry',
  'Dental',
  'Miami, FL', 'Miami', 'FL', '33137', 'Full-time',
  27, 33, 'hour', '+18% Above Miami Avg', true, true, true,
  'Dedicated 1:1 Chairside',
  ARRAY['Eaglesoft', 'Carestream 3D CBCT', 'Trios 5'],
  ARRAY['Full Medical Coverage', '401(k) Match', 'Paid Parking in Design District'],
  'Modern private dental practice in the Miami Design District seeks an experienced Lead Dental Assistant.',
  ARRAY['Chairside assistance during cosmetic procedures', 'Manage back-office sterilization', 'Capture 3D CBCT scans'],
  ARRAY['Florida EFDA & Radiography certification', '3+ years chairside experience'],
  'office@biscaynebaydental.com',
  'https://biscaynebaydental.com'
)
ON CONFLICT (id) DO NOTHING;
