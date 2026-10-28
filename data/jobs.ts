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
  appointmentTime?: string; // e.g. "60-Min Hygiene Slots" or "45-Min Patient Evaluations"
  softwareUsed: string[];
  benefits: string[];
  description: string;
  responsibilities: string[];
  qualifications: string[];
  applyEmail: string;
  applyUrl: string;
  postedDate: string; // ISO format
}

export const SEED_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Registered Dental Hygienist (RDH) - 60 Min Slots',
    clinicName: 'Preston Hollow Dental Studio',
    clinicType: 'Dental',
    location: 'Dallas, TX',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75225',
    workType: 'Full-time',
    minHourly: 46,
    maxHourly: 52,
    payPeriod: 'hour',
    payComparison: '+16% Above Dallas Avg',
    isFeatured: true,
    isUrgent: true,
    verifiedActive: true,
    appointmentTime: '60-Min Adult Prophy Slots',
    softwareUsed: ['Dentrix Ascend', 'Dexis Digital Sensors', 'iTero Scanner'],
    benefits: ['100% Employer-Paid Health Insurance', '401(k) with 4% Match', '$1,000 Annual CE Stipend', 'Custom Scrubs Provided', 'Paid Holidays & 3 Weeks PTO'],
    description: 'We are an established, private family and cosmetic dental practice in North Dallas seeking a passionate Registered Dental Hygienist. We strictly maintain 60-minute adult recare appointments and 90-minute new patient appointments so you never feel rushed. No quotas, no high-pressure sales—just top-tier patient care alongside an appreciative doctor and supportive team.',
    responsibilities: [
      'Conduct comprehensive periodontal evaluations and oral cancer screenings',
      'Perform thorough dental prophylaxis, scaling, and root planing',
      'Take digital radiographs using Dexis and intraoral scans with iTero',
      'Educate patients on home care routines with a compassionate, gentle touch'
    ],
    qualifications: [
      'Active Texas Dental Hygiene License (RDH)',
      'Current CPR / BLS certification',
      'Nitrous oxide certification preferred',
      'Experience with Dentrix is a plus (we will train on Ascend)'
    ],
    applyEmail: 'hiring@prestonhollowdental.com',
    applyUrl: 'https://prestonhollowdental.com/careers',
    postedDate: '2026-10-27T08:00:00Z'
  },
  {
    id: 'job-2',
    title: 'Certified Medical Assistant (CMA) - Outpatient Ortho',
    clinicName: 'Summit Orthopedic & Spine Clinic',
    clinicType: 'Physical Therapy',
    location: 'Houston, TX',
    city: 'Houston',
    state: 'TX',
    zipCode: '77030',
    workType: 'Full-time',
    minHourly: 23,
    maxHourly: 27,
    payPeriod: 'hour',
    payComparison: '+14% Above Houston Avg',
    isFeatured: true,
    isUrgent: false,
    verifiedActive: true,
    appointmentTime: 'Structured 20-Min Clinic Flow',
    softwareUsed: ['AthenaHealth EHR', 'Phreesia Intake'],
    benefits: ['Comprehensive Medical, Dental, Vision', 'Uniform Allowance', 'No Nights or Weekends', 'Quarterly Clinic Bonuses'],
    description: 'Summit Orthopedics is a premier private subspecialty group in the Texas Medical Center area. We are looking for an energetic Certified Medical Assistant to assist our orthopedic surgeons and physical medicine specialists with casting, rooming, suture removal, and joint injections.',
    responsibilities: [
      'Room patients, obtain vital signs, and update surgical histories in AthenaHealth',
      'Prepare injection trays, sterile fields, and assist physicians with procedures',
      'Apply and remove casts, splints, and braces',
      'Coordinate post-op physical therapy referrals and pre-authorizations'
    ],
    qualifications: [
      'Certified Medical Assistant (AAMA or NHA CCMA)',
      '1+ year experience in orthopedic, surgical, or sports medicine outpatient practice',
      'BLS certification'
    ],
    applyEmail: 'careers@summitortho-tx.com',
    applyUrl: 'https://summitortho-tx.com/jobs',
    postedDate: '2026-10-28T09:15:00Z'
  },
  {
    id: 'job-3',
    title: 'Lead Dental Assistant (RDA) - Cosmetic & Implants',
    clinicName: 'Biscayne Bay Esthetic Dentistry',
    clinicType: 'Dental',
    location: 'Miami, FL',
    city: 'Miami',
    state: 'FL',
    zipCode: '33137',
    workType: 'Full-time',
    minHourly: 27,
    maxHourly: 33,
    payPeriod: 'hour',
    payComparison: '+18% Above Miami Avg',
    isFeatured: true,
    isUrgent: true,
    verifiedActive: true,
    appointmentTime: 'Dedicated 1:1 Chairside',
    softwareUsed: ['Eaglesoft', 'Carestream 3D CBCT', 'Trios 5'],
    benefits: ['Full Medical Coverage', '401(k) Match', 'Paid Parking in Design District', 'Discounts on Cosmetic Treatments'],
    description: 'Modern, high-end private dental practice in the Miami Design District seeks an experienced Lead Dental Assistant (RDA). If you take pride in surgical assisting (implants, bone grafts) and digital workflow (CEREC / Trios), this is your dream private practice.',
    responsibilities: [
      'Chairside assistance during veneer, full-mouth reconstruction, and implant surgeries',
      'Manage back-office sterilization, inventory control, and OSHA/HIPAA compliance',
      'Capture clear 3D CBCT scans and intraoral digital impressions'
    ],
    qualifications: [
      'Florida Expanded Duties Dental Assistant (EFDA) & Radiography certification',
      '3+ years chairside experience in private practice',
      'Bilingual (English / Spanish) strongly preferred'
    ],
    applyEmail: 'office@biscaynebaydental.com',
    applyUrl: 'https://biscaynebaydental.com/join-our-team',
    postedDate: '2026-10-26T14:30:00Z'
  },
  {
    id: 'job-4',
    title: 'Optometric Technician & Vision Assistant',
    clinicName: 'ClearView Eye Center & Boutique',
    clinicType: 'Vision',
    location: 'Orlando, FL',
    city: 'Orlando',
    state: 'FL',
    zipCode: '32801',
    workType: 'Full-time',
    minHourly: 20,
    maxHourly: 24,
    payPeriod: 'hour',
    payComparison: '+12% Above Orlando Avg',
    isFeatured: false,
    isUrgent: false,
    verifiedActive: true,
    appointmentTime: '30-Min Comprehensive Exam Flow',
    softwareUsed: ['RevolutionEHR', 'Optos Daytona', 'Zeiss OCT'],
    benefits: ['Free Designer Eyewear yearly', 'Family Vision Benefits', 'Health & Dental Coverage', 'Paid Time Off'],
    description: 'ClearView is an upscale private optometry clinic and luxury eyewear boutique in downtown Orlando. We are adding an Optometric Technician to pre-test patients with cutting-edge diagnostic technology before they see our optometrists.',
    responsibilities: [
      'Operate automated visual acuity, tonometry, Optos retinal imaging, and visual field machines',
      'Instruct patients on contact lens insertion, removal, and hygiene',
      'Assist doctor with minor in-office dry eye procedures'
    ],
    qualifications: [
      'Prior optometric or ophthalmic tech experience preferred (will train enthusiastic candidates)',
      'Excellent warm interpersonal skills'
    ],
    applyEmail: 'jobs@clearvieweyesfl.com',
    applyUrl: 'https://clearvieweyesfl.com/contact',
    postedDate: '2026-10-28T07:45:00Z'
  },
  {
    id: 'job-5',
    title: 'Outpatient Physical Therapy Aide / Rehab Technician',
    clinicName: 'Pinnacle Physical Therapy & Sports Rehab',
    clinicType: 'Physical Therapy',
    location: 'Atlanta, GA',
    city: 'Atlanta',
    state: 'GA',
    zipCode: '30309',
    workType: 'Full-time',
    minHourly: 19,
    maxHourly: 22,
    payPeriod: 'hour',
    payComparison: '+10% Above Atlanta Avg',
    isFeatured: false,
    isUrgent: false,
    verifiedActive: true,
    appointmentTime: '45-Min 1-on-1 Patient Sessions',
    softwareUsed: ['WebPT', 'Clinicient'],
    benefits: ['Mentorship for DPT school applicants', 'Health insurance stipend', 'Generous PTO', 'Gym membership'],
    description: 'Private, therapist-owned outpatient orthopedic clinic in Midtown Atlanta. We are looking for a dedicated PT Aide who plans on attending PT/PTA or PA school. We pride ourselves on 1-on-1 patient care with zero double-booking.',
    responsibilities: [
      'Assist Physical Therapists with therapeutic exercises and modality setup (cold packs, e-stim, ultrasound)',
      'Maintain pristine cleanliness and sanitation of treatment tables and gym equipment',
      'Greet patients and assist front office with intake paperwork'
    ],
    qualifications: [
      'Bachelors degree in Kinesiology, Exercise Science, or related field preferred',
      'Enthusiasm for rehabilitation and musculoskeletal wellness',
      'CPR/AED certification'
    ],
    applyEmail: 'clinic@pinnaclerehabatl.com',
    applyUrl: 'https://pinnaclerehabatl.com/careers',
    postedDate: '2026-10-27T16:20:00Z'
  },
  {
    id: 'job-6',
    title: 'Dermatology & Aesthetic Medical Assistant',
    clinicName: 'Luxe Dermatology & Laser Institute',
    clinicType: 'Dermatology & MedSpa',
    location: 'Phoenix, AZ',
    city: 'Phoenix',
    state: 'AZ',
    zipCode: '85016',
    workType: 'Full-time',
    minHourly: 24,
    maxHourly: 29,
    payPeriod: 'hour',
    payComparison: '+15% Above Phoenix Avg',
    isFeatured: true,
    isUrgent: true,
    verifiedActive: true,
    appointmentTime: 'High-Touch Concierge Care',
    softwareUsed: ['Modernizing Medicine (EMA)', 'Klarna / Cherry Financing'],
    benefits: ['Generous discounts on Botox, Lasers & Medical Skincare', 'Full Health, Vision & Dental', '401(k) Match', 'Holiday Bonuses'],
    description: 'Premier boutique dermatology practice in the Biltmore area seeks a top-tier Medical Assistant. You will work side-by-side with Board-Certified Dermatologists assisting with skin cancer surgeries (Mohs), biopsies, and aesthetic procedures.',
    responsibilities: [
      'Room patients, take detailed histories, and scribe directly in ModMed EMA',
      'Assist with dermatologic excisions, Mohs surgical closures, and Botox/filler prep',
      'Educate patients on pre- and post-procedure wound care and clinical skincare protocols'
    ],
    qualifications: [
      'Certified Medical Assistant (CMA / RMA)',
      'At least 1 year prior dermatology or plastic surgery experience',
      'Strong knowledge of surgical sterility and clinical documentation'
    ],
    applyEmail: 'hr@luxedermatologyaz.com',
    applyUrl: 'https://luxedermatologyaz.com/careers',
    postedDate: '2026-10-28T11:00:00Z'
  },
  {
    id: 'job-7',
    title: 'Front Office Medical Receptionist & Biller',
    clinicName: 'Oak Ridge Family Medicine Practice',
    clinicType: 'Family Medicine',
    location: 'Austin, TX',
    city: 'Austin',
    state: 'TX',
    zipCode: '78759',
    workType: 'Full-time',
    minHourly: 21,
    maxHourly: 25,
    payPeriod: 'hour',
    payComparison: '+11% Above Austin Avg',
    isFeatured: false,
    isUrgent: false,
    verifiedActive: true,
    appointmentTime: 'Warm Community Environment',
    softwareUsed: ['eClinicalWorks', 'Availity Insurance Portal'],
    benefits: ['Health & Dental Insurance', 'PTO & Paid Sick Days', 'No Weekends', 'Year-End Performance Bonus'],
    description: 'Independent private family practice in Northwest Austin. We have cared for our local community for 18 years. Looking for a warm, organized front office coordinator who understands insurance verification, copays, and warm patient reception.',
    responsibilities: [
      'Check in patients, collect copays, and verify medical insurance eligibility via Availity',
      'Schedule appointments and handle inbound clinic phone inquiries with warmth',
      'Submit clean electronic claims and process patient balances'
    ],
    qualifications: [
      '2+ years front desk medical clinic experience',
      'Familiarity with eClinicalWorks or similar outpatient EHR',
      'Warm telephone demeanor and problem-solving mindset'
    ],
    applyEmail: 'manager@oakridgefamilymed.com',
    applyUrl: 'https://oakridgefamilymed.com/jobs',
    postedDate: '2026-10-25T13:10:00Z'
  },
  {
    id: 'job-8',
    title: 'Pediatric Dental Assistant - Gentle Touch',
    clinicName: 'Little Smiles Pediatric Dentistry',
    clinicType: 'Dental',
    location: 'Tampa, FL',
    city: 'Tampa',
    state: 'FL',
    zipCode: '33606',
    workType: 'Full-time',
    minHourly: 24,
    maxHourly: 28,
    payPeriod: 'hour',
    payComparison: '+13% Above Tampa Avg',
    isFeatured: false,
    isUrgent: true,
    verifiedActive: true,
    appointmentTime: '45-Min Fun Child Appointments',
    softwareUsed: ['Dentrix', 'NOMAD Pro Handheld X-Ray'],
    benefits: ['Health Insurance', 'Fun, positive team culture', '401k Match', 'Paid Holidays & PTO'],
    description: 'Join Tampa’s favorite private pediatric dental office! We believe in making every visit a fun adventure for kids. We are looking for a gentle, cheerful Dental Assistant who loves working with children and making them smile.',
    responsibilities: [
      'Seat young patients and build immediate rapport to alleviate dental anxiety',
      'Capture pediatric bite-wings using NOMAD handheld units',
      'Assist pediatric dentist with cleanings, sealants, fluoride treatments, and nitrous oxide'
    ],
    qualifications: [
      'Florida Expanded Duties Dental Assistant (EFDA) certification',
      'Radiology certification',
      'Love for children and patient, cheerful attitude'
    ],
    applyEmail: 'team@littlesmilestampa.com',
    applyUrl: 'https://littlesmilestampa.com/careers',
    postedDate: '2026-10-27T10:05:00Z'
  }
];

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
      { city: 'Austin, TX', avg: 47, high: 55, count: 38 }
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
      { city: 'Austin, TX', avg: 23, high: 27.5, count: 49 }
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
      { city: 'Austin, TX', avg: 25, high: 30, count: 44 }
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
      { city: 'Austin, TX', avg: 19.5, high: 23, count: 29 }
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
      { city: 'Austin, TX', avg: 21.5, high: 26, count: 58 }
    ]
  }
];
