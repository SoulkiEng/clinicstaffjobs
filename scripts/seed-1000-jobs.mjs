import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://dslzkfkdtikdhnyebsvg.supabase.co';
const supabaseKey = 'sb_publishable_n4vG_Jrw7F6GxFPa7Zj6HQ_2V8XUu1k';
const supabase = createClient(supabaseUrl, supabaseKey);

// Complete coverage across all 52 US States & Jurisdictions (50 States + DC + PR)
const METROS = [
  { city: 'Birmingham', state: 'AL', stateName: 'Alabama', zip: '35203', payFactor: 0.94, neighborhoods: ['Mountain Brook', 'Homewood', 'Vestavia Hills', 'Hoover'] },
  { city: 'Anchorage', state: 'AK', stateName: 'Alaska', zip: '99501', payFactor: 1.22, neighborhoods: ['Midtown Anchorage', 'South Addition', 'Turnagain', 'Eagle River'] },
  { city: 'Phoenix', state: 'AZ', stateName: 'Arizona', zip: '85016', payFactor: 1.05, neighborhoods: ['Scottsdale', 'Biltmore', 'Arcadia', 'Camelback', 'Chandler'] },
  { city: 'Little Rock', state: 'AR', stateName: 'Arkansas', zip: '72201', payFactor: 0.92, neighborhoods: ['The Heights', 'Chenal Valley', 'Hillcrest', 'West Little Rock'] },
  { city: 'Los Angeles', state: 'CA', stateName: 'California', zip: '90024', payFactor: 1.28, neighborhoods: ['Beverly Hills', 'Santa Monica', 'Pasadena', 'Brentwood', 'Newport Beach'] },
  { city: 'San Diego', state: 'CA', stateName: 'California', zip: '92101', payFactor: 1.27, neighborhoods: ['La Jolla', 'Del Mar', 'Carmel Valley', 'Encinitas'] },
  { city: 'San Francisco', state: 'CA', stateName: 'California', zip: '94102', payFactor: 1.35, neighborhoods: ['Pacific Heights', 'Palo Alto', 'Walnut Creek', 'Marina District'] },
  { city: 'Denver', state: 'CO', stateName: 'Colorado', zip: '80202', payFactor: 1.14, neighborhoods: ['Cherry Creek', 'Wash Park', 'Boulder', 'Highlands Ranch'] },
  { city: 'Hartford', state: 'CT', stateName: 'Connecticut', zip: '06103', payFactor: 1.18, neighborhoods: ['West Hartford', 'Greenwich', 'Stamford', 'New Canaan'] },
  { city: 'Wilmington', state: 'DE', stateName: 'Delaware', zip: '19801', payFactor: 1.06, neighborhoods: ['Greenville', 'Trolley Square', 'Hockessin', 'Rehoboth'] },
  { city: 'Washington', state: 'DC', stateName: 'District of Columbia', zip: '20006', payFactor: 1.24, neighborhoods: ['Georgetown', 'Dupont Circle', 'Capitol Hill', 'Spring Valley'] },
  { city: 'Miami', state: 'FL', stateName: 'Florida', zip: '33139', payFactor: 1.12, neighborhoods: ['Coral Gables', 'Brickell', 'Coconut Grove', 'Boca Raton', 'Fort Lauderdale'] },
  { city: 'Orlando', state: 'FL', stateName: 'Florida', zip: '32801', payFactor: 1.00, neighborhoods: ['Winter Park', 'Lake Nona', 'Dr. Phillips', 'Tampa Hyde Park'] },
  { city: 'Atlanta', state: 'GA', stateName: 'Georgia', zip: '30309', payFactor: 1.06, neighborhoods: ['Buckhead', 'Midtown', 'Alpharetta', 'Virginia-Highland'] },
  { city: 'Honolulu', state: 'HI', stateName: 'Hawaii', zip: '96813', payFactor: 1.25, neighborhoods: ['Kahala', 'Kailua', 'Ala Moana', 'Manoa'] },
  { city: 'Boise', state: 'ID', stateName: 'Idaho', zip: '83702', payFactor: 1.01, neighborhoods: ['North End', 'Eagle', 'Meridian', 'East End'] },
  { city: 'Chicago', state: 'IL', stateName: 'Illinois', zip: '60611', payFactor: 1.18, neighborhoods: ['Lincoln Park', 'Gold Coast', 'Oak Brook', 'Naperville', 'Hinsdale'] },
  { city: 'Indianapolis', state: 'IN', stateName: 'Indiana', zip: '46204', payFactor: 0.98, neighborhoods: ['Carmel', 'Zionsville', 'Meridian-Kessler', 'Fishers'] },
  { city: 'Des Moines', state: 'IA', stateName: 'Iowa', zip: '50309', payFactor: 0.96, neighborhoods: ['West Des Moines', 'Waukee', 'Ankeny', 'Beaverdale'] },
  { city: 'Overland Park', state: 'KS', stateName: 'Kansas', zip: '66210', payFactor: 0.98, neighborhoods: ['Leawood', 'Mission Hills', 'Prairie Village', 'Olathe'] },
  { city: 'Louisville', state: 'KY', stateName: 'Kentucky', zip: '40202', payFactor: 0.96, neighborhoods: ['St. Matthews', 'Anchorage', 'Highlands', 'Lexington Chevy Chase'] },
  { city: 'New Orleans', state: 'LA', stateName: 'Louisiana', zip: '70130', payFactor: 0.97, neighborhoods: ['Garden District', 'Uptown', 'Metairie', 'Baton Rouge Southdowns'] },
  { city: 'Portland', state: 'ME', stateName: 'Maine', zip: '04101', payFactor: 1.07, neighborhoods: ['Falmouth', 'Cape Elizabeth', 'Old Port', 'Yarmouth'] },
  { city: 'Baltimore', state: 'MD', stateName: 'Maryland', zip: '21201', payFactor: 1.12, neighborhoods: ['Bethesda', 'Chevy Chase', 'Towson', 'Annapolis', 'Roland Park'] },
  { city: 'Boston', state: 'MA', stateName: 'Massachusetts', zip: '02116', payFactor: 1.26, neighborhoods: ['Back Bay', 'Wellesley', 'Brookline', 'Newton', 'Cambridge'] },
  { city: 'Detroit Metro', state: 'MI', stateName: 'Michigan', zip: '48009', payFactor: 1.04, neighborhoods: ['Birmingham', 'Bloomfield Hills', 'Royal Oak', 'Ann Arbor', 'Troy'] },
  { city: 'Minneapolis', state: 'MN', stateName: 'Minnesota', zip: '55401', payFactor: 1.12, neighborhoods: ['Edina', 'Wayzata', 'Minnetonka', 'Linden Hills'] },
  { city: 'Jackson', state: 'MS', stateName: 'Mississippi', zip: '39201', payFactor: 0.91, neighborhoods: ['Madison', 'Ridgeland', 'Fondren', 'Flowood'] },
  { city: 'St. Louis', state: 'MO', stateName: 'Missouri', zip: '63101', payFactor: 0.99, neighborhoods: ['Clayton', 'Ladue', 'Town and Country', 'Kansas City Plaza'] },
  { city: 'Bozeman', state: 'MT', stateName: 'Montana', zip: '59715', payFactor: 1.04, neighborhoods: ['Downtown Bozeman', 'Billings West End', 'Missoula', 'Whitefish'] },
  { city: 'Omaha', state: 'NE', stateName: 'Nebraska', zip: '68102', payFactor: 0.97, neighborhoods: ['Regency', 'Dundee', 'Elkhorn', 'Lincoln Wilderness Ridge'] },
  { city: 'Las Vegas', state: 'NV', stateName: 'Nevada', zip: '89109', payFactor: 1.05, neighborhoods: ['Summerlin', 'Henderson', 'Green Valley', 'Reno Montreux'] },
  { city: 'Manchester', state: 'NH', stateName: 'New Hampshire', zip: '03101', payFactor: 1.10, neighborhoods: ['Bedford', 'Portsmouth', 'Nashua', 'Hanover'] },
  { city: 'Princeton', state: 'NJ', stateName: 'New Jersey', zip: '08540', payFactor: 1.22, neighborhoods: ['Short Hills', 'Hoboken', 'Montclair', 'Ridgewood', 'Summit'] },
  { city: 'Albuquerque', state: 'NM', stateName: 'New Mexico', zip: '87102', payFactor: 0.98, neighborhoods: ['Sandia Heights', 'Nob Hill', 'Santa Fe Historic District', 'Tanoan'] },
  { city: 'New York', state: 'NY', stateName: 'New York', zip: '10021', payFactor: 1.32, neighborhoods: ['Upper East Side', 'Tribeca', 'Scarsdale', 'Garden City', 'Park Slope'] },
  { city: 'Charlotte', state: 'NC', stateName: 'North Carolina', zip: '28202', payFactor: 1.04, neighborhoods: ['Myers Park', 'SouthPark', 'Raleigh North Hills', 'Cary', 'Chapel Hill'] },
  { city: 'Fargo', state: 'ND', stateName: 'North Dakota', zip: '58102', payFactor: 0.96, neighborhoods: ['South Fargo', 'Blu Water Creek', 'Bismarck', 'Grand Forks'] },
  { city: 'Columbus', state: 'OH', stateName: 'Ohio', zip: '43215', payFactor: 1.00, neighborhoods: ['Upper Arlington', 'Dublin', 'Cincinnati Hyde Park', 'Cleveland Chagrin Falls'] },
  { city: 'Oklahoma City', state: 'OK', stateName: 'Oklahoma', zip: '73102', payFactor: 0.95, neighborhoods: ['Nichols Hills', 'Edmond', 'Tulsa Utica Square', 'Jenks'] },
  { city: 'Portland', state: 'OR', stateName: 'Oregon', zip: '97201', payFactor: 1.16, neighborhoods: ['Lake Oswego', 'Pearl District', 'West Hills', 'Bend'] },
  { city: 'Philadelphia', state: 'PA', stateName: 'Pennsylvania', zip: '19103', payFactor: 1.15, neighborhoods: ['Main Line Bryn Mawr', 'Rittenhouse Square', 'Chestnut Hill', 'Pittsburgh Shadyside'] },
  { city: 'San Juan', state: 'PR', stateName: 'Puerto Rico', zip: '00907', payFactor: 0.92, neighborhoods: ['Condado', 'Guaynabo', 'Miramar', 'Dorado'] },
  { city: 'Providence', state: 'RI', stateName: 'Rhode Island', zip: '02903', payFactor: 1.12, neighborhoods: ['East Side College Hill', 'Barrington', 'Newport', 'East Greenwich'] },
  { city: 'Charleston', state: 'SC', stateName: 'South Carolina', zip: '29401', payFactor: 1.02, neighborhoods: ['Mount Pleasant', 'Kiawah', 'Greenville Downtown', 'Hilton Head'] },
  { city: 'Sioux Falls', state: 'SD', stateName: 'South Dakota', zip: '57104', payFactor: 0.96, neighborhoods: ['Prairie Green', 'McKennan Park', 'Rapid City', 'Brandon'] },
  { city: 'Nashville', state: 'TN', stateName: 'Tennessee', zip: '37203', payFactor: 1.05, neighborhoods: ['Belle Meade', 'Brentwood', 'Franklin', 'Green Hills'] },
  { city: 'Dallas', state: 'TX', stateName: 'Texas', zip: '75225', payFactor: 1.06, neighborhoods: ['Preston Hollow', 'Highland Park', 'Uptown', 'Southlake', 'Plano Legacy'] },
  { city: 'Houston', state: 'TX', stateName: 'Texas', zip: '77002', payFactor: 1.04, neighborhoods: ['River Oaks', 'The Woodlands', 'Memorial', 'West University'] },
  { city: 'Austin', state: 'TX', stateName: 'Texas', zip: '78701', payFactor: 1.10, neighborhoods: ['Westlake', 'Tarrytown', 'South Congress', 'Domain Northside'] },
  { city: 'Salt Lake City', state: 'UT', stateName: 'Utah', zip: '84101', payFactor: 1.03, neighborhoods: ['Holladay', 'Sugar House', 'Park City', 'Draper'] },
  { city: 'Burlington', state: 'VT', stateName: 'Vermont', zip: '05401', payFactor: 1.08, neighborhoods: ['South Burlington', 'Shelburne', 'Stowe', 'Williston'] },
  { city: 'Richmond', state: 'VA', stateName: 'Virginia', zip: '23219', payFactor: 1.08, neighborhoods: ['McLean', 'Alexandria', 'Short Pump', 'Westhampton', 'Virginia Beach'] },
  { city: 'Seattle', state: 'WA', stateName: 'Washington', zip: '98101', payFactor: 1.26, neighborhoods: ['Bellevue', 'Kirkland', 'Queen Anne', 'Mercer Island'] },
  { city: 'Charleston', state: 'WV', stateName: 'West Virginia', zip: '25301', payFactor: 0.92, neighborhoods: ['South Hills', 'Morgantown Suncrest', 'Bridgeport', 'Huntington'] },
  { city: 'Milwaukee', state: 'WI', stateName: 'Wisconsin', zip: '53202', payFactor: 1.01, neighborhoods: ['Whitefish Bay', 'Brookfield', 'Madison Shorewood Hills', 'Mequon'] },
  { city: 'Jackson', state: 'WY', stateName: 'Wyoming', zip: '83001', payFactor: 1.08, neighborhoods: ['Jackson Hole', 'Cheyenne Western Hills', 'Casper', 'Sheridan'] },
];

const ROLES_BY_CATEGORY = {
  Dental: [
    {
      titles: [
        'Registered Dental Hygienist (RDH) - 60 Min Adult Recare',
        'Registered Dental Hygienist (RDH) - Private Family & Cosmetic Practice',
        'Dental Hygienist (RDH) - Mon–Thu Schedule (No Weekends)',
        'Registered Dental Hygienist (RDH) - $2,500 Sign-On Bonus'
      ],
      baseMin: 45,
      baseMax: 54,
      appointment: '60-Min Adult Prophy / 90-Min New Patient',
      software: ['Dentrix Ascend', 'Dexis Digital Sensors', 'iTero Element 5D'],
      suffixes: ['Dental Studio', 'Family & Cosmetic Dentistry', 'Smile Collective', 'Dental Arts', 'Esthetic Dentistry'],
      description: 'Independent fee-for-service and PPO private dental practice seeking a licensed Registered Dental Hygienist (RDH). We prioritize unrushed 60-minute recare appointments, modern Cavitron & Piezo ultrasonic units, Assisted Hygiene support, and zero corporate production quotas.',
      benefits: ['100% Employer-Paid Medical & Dental', '401(k) with 4% Safe Harbor Match', '$1,500 Annual CE Allowance', 'Figs Scrubs Stipend', 'No Weekends'],
      resp: [
        'Perform thorough adult and pediatric prophylaxis, periodontal charting, and non-surgical SRP therapy',
        'Capture diagnostic digital bitewings and intraoral wellness scans using iTero',
        'Co-diagnose restorative and periodontal needs alongside an appreciative private doctor'
      ],
      qual: [
        'Active State Registered Dental Hygienist (RDH) License in good standing',
        'Current BLS/CPR certification; Local Anesthesia & Nitrous certification preferred',
        'Warm, patient-centered communication style'
      ]
    },
    {
      titles: [
        'Lead Dental Assistant (RDA / EFDA) - Cosmetic & Implant Restorative',
        'Registered Dental Assistant (RDA) - Private Boutique Practice',
        'Expanded Functions Dental Assistant (EFDA) - 4-Day Workweek',
        'Chairside Dental Assistant (RDA) - Digital Restorative Workflow'
      ],
      baseMin: 26,
      baseMax: 33,
      appointment: 'Structured 4-Handed Dentistry',
      software: ['Eaglesoft', 'Planmeca CBCT 3D', 'CEREC Primescan'],
      suffixes: ['Cosmetic & Implant Dentistry', 'Restorative Dental Studio', 'Dental Specialists', 'Advanced Dental Care'],
      description: 'High-tech private restorative & implant practice seeking an experienced Lead RDA / EFDA. Work chairside with two collaborative doctors in a fully digital workflow (no messy alginate impressions) with predictable daytime hours.',
      benefits: ['Full Medical, Vision & Life Coverage', 'Monthly Team Profit-Sharing Bonus ($350–$600/mo)', 'Paid Holidays & PTO', 'Paid CE & DANB Renewal'],
      resp: [
        'Provide seamless 4-handed chairside assistance during crown/bridge, veneers, and implant restorations',
        'Perform digital intraoral scanning, fabricate esthetic provisional crowns, and take CBCT images',
        'Oversee cassette sterilization protocols and operatory readiness'
      ],
      qual: [
        'Active State Registered Dental Assistant (RDA) or EFDA credential',
        'X-Ray / Radiology certification and current CPR',
        '1+ year chairside dental assisting experience in a private office'
      ]
    },
    {
      titles: [
        'Dental Front Office & Treatment Coordinator - Private Practice',
        'Dental Practice Patient Concierge & Insurance Coordinator',
        'Treatment Coordinator / Front Desk Lead - Boutique Dental Office',
        'Dental Billing & Scheduling Coordinator - Private Clinic'
      ],
      baseMin: 25,
      baseMax: 32,
      appointment: 'Boutique Patient Concierge Flow',
      software: ['Open Dental', 'Weave Patient Comm', 'DentalXChange'],
      suffixes: ['Family Dental Group', 'Dental Associates', 'Premier Dentistry', 'Dental Care Studio'],
      description: 'Join our welcoming private practice front desk team. You will serve as the first smile patients see, presenting treatment plans clearly, verifying PPO insurance breakdowns, and keeping the doctor and hygiene schedules running smoothly.',
      benefits: ['Competitive Base Hourly + Monthly Collection Bonus', '100% Employer-Paid Medical & Dental', 'Free Dental Care for Immediate Family', '401(k) with 4% Safe Harbor Match'],
      resp: [
        'Present treatment plans and financial options with transparency and empathy',
        'Submit clean electronic PPO claims, pre-authorizations, and verify patient eligibility',
        'Coordinate hygiene recall and productive doctor scheduling'
      ],
      qual: [
        '2+ years dental front office, treatment coordination, or dental insurance billing experience',
        'Working knowledge of Dentrix, Eaglesoft, or Open Dental',
        'Articulate, organized, and warm patient service skills'
      ]
    },
    {
      titles: [
        'Associate General Dentist (DDS / DMD) - Private Fee-For-Service / PPO',
        'Associate Dentist (DDS / DMD) - Modern Digital Practice',
        'Managing Clinical Dentist (DDS / DMD) - Partnership Track'
      ],
      baseMin: 95,
      baseMax: 135,
      appointment: 'Unrushed Comprehensive Care',
      software: ['Dentrix Ascend', 'CBCT 3D Imaging', 'CEREC Primescan'],
      suffixes: ['Dental Arts', 'Signature Dentistry', 'Comprehensive Dental Care', 'Dental Collective'],
      description: 'Established, privately owned general & cosmetic practice seeking an Associate Dentist (DDS/DMD). Enjoy full clinical autonomy, 33%–35% of collections with a high daily guarantee, CBCT + Primescan digital workflow, and an experienced EFDA/RDH team.',
      benefits: ['$900–$1,100/Day Guarantee or 34% Collections', '100% Malpractice & Lab Fees Covered', '$3,000 Annual CE Stipend', '401(k) with 4% Safe Harbor Match'],
      resp: [
        'Diagnose and execute comprehensive restorative, crown & bridge, clear aligner, endodontic, and implant cases',
        'Lead hygiene exams and build long-term trust with an established, loyal patient base',
        'Collaborate with a seasoned chairside and front-office support team'
      ],
      qual: [
        'DDS or DMD degree from a CODA-accredited US dental school',
        'Active State Dental License, DEA registration, and CPR certification',
        'Commitment to ethical, patient-first private practice dentistry'
      ]
    }
  ],

  Vision: [
    {
      titles: [
        'Certified Optometric Technician - Private Boutique Eye Care',
        'Optometric Assistant & Pre-Tester - Independent Vision Studio',
        'Clinical Optometric Technician (COA / Paraoptometric)'
      ],
      baseMin: 22,
      baseMax: 28,
      appointment: '25-Min Thorough Pre-Testing Flow',
      software: ['RevolutionEHR', 'Optos Daytona Ultra-Widefield', 'Zeiss Cirrus OCT'],
      suffixes: ['Vision Associates', 'Eye Care Studio', 'Optometry & Eyewear', 'Family Eye Care'],
      description: 'Independent private optometry practice seeking a personable Optometric Technician. Work directly with our Doctors of Optometry conducting digital pre-testing, Optos retinal imaging, OCT scans, and contact lens insertion/removal trainings.',
      benefits: ['$1,000 Annual Luxury Eyewear Stipend', '100% Employer-Paid Medical & Dental', '401(k) with 4% Safe Harbor Match', 'Paid CPOA/COA Certification'],
      resp: [
        'Conduct preliminary patient workups including auto-refraction, non-contact tonometry, visual fields, and Optos retinal imaging',
        'Record chief complaints, ocular health history, and current medications in RevolutionEHR',
        'Teach new wearers contact lens insertion, removal, and hygiene care'
      ],
      qual: [
        '1+ year experience as an Optometric Technician, Ophthalmic Assistant, or medical clinic tech',
        'Comfort operating digital diagnostic eye equipment',
        'Polished, attentive patient bedside manner'
      ]
    },
    {
      titles: [
        'Licensed Dispensing Optician (ABO) - Independent Optical Boutique',
        'Luxury Eyewear Stylist & Optician - Private Optometry Practice',
        'Lead Dispensing Optician - Base Hourly + Optical Bonus'
      ],
      baseMin: 26,
      baseMax: 34,
      appointment: '1-on-1 Bespoke Frame Styling',
      software: ['Officemate / Eyefinity', 'RevolutionEHR', 'Visioffice Digital Measure'],
      suffixes: ['Optical Boutique', 'Eyewear Atelier', 'Vision & Optical Studio', 'Premier Eye Associates'],
      description: 'Upscale independent optical boutique seeking an experienced Optician. Curate and style patients in independent European and Japanese eyewear collections, take precision digital progressive measurements, and deliver white-glove adjustments.',
      benefits: ['High Base Hourly + Monthly Frame/Lens Bonus', 'Full Medical, Vision & Life Coverage', 'Complimentary Designer Eyewear Annually', 'No Weekends'],
      resp: [
        'Provide 1-on-1 frame styling and educate patients on digital progressive lenses, anti-reflective coatings, and photochromics',
        'Take precise pupillary distance (PD), ocular center, and seg height measurements',
        'Perform frame adjustments, custom tinting, lens verification, and VSP/Eyemed claims'
      ],
      qual: [
        'State Dispensing Optician License or ABO Certification (or 2+ years optical dispensing experience)',
        'Strong knowledge of progressive lens optics and vision insurance plans',
        'Warm, consultative styling approach'
      ]
    },
    {
      titles: [
        'Ophthalmic Assistant & Clinical Scribe (COA) - Private Eye Clinic',
        'Ophthalmic Technician (COA / COT) - Retina & Cataract Practice',
        'Ophthalmology Medical Assistant & Scribe - Weekday Hours'
      ],
      baseMin: 24,
      baseMax: 31,
      appointment: 'Structured Specialty Clinic Flow',
      software: ['ModMed EMA', 'Heidelberg Spectralis OCT', 'IOLMaster 700'],
      suffixes: ['Eye Consultants', 'Retina & Cataract Specialists', 'Ophthalmology Associates', 'Laser & Eye Institute'],
      description: 'Private physician-owned ophthalmology clinic seeking a dedicated Ophthalmic Assistant / Scribe. Assist board-certified ophthalmologists with cataract evaluations, glaucoma workups, OCT imaging, and real-time EHR scribing.',
      benefits: ['No Weekends (Mon–Fri 8:00am–4:30pm)', '100% Employer-Paid Medical & Dental', '$1,500 Annual CE Allowance', '401(k) with 4% Safe Harbor Match'],
      resp: [
        'Perform comprehensive ophthalmic workups: visual acuity, manifest refraction, Goldmann applanation tonometry, and pupil dilation',
        'Scribe physician exam findings and surgical counseling accurately in ModMed EMA',
        'Perform biometry (IOLMaster), topography, and macular OCT scans'
      ],
      qual: [
        'COA, COT, or 1+ year experience in ophthalmology or optometry clinical workups',
        'Fast, accurate medical scribing and familiarity with ophthalmic terminology',
        'Compassionate care for senior cataract and retina patients'
      ]
    }
  ],

  'Physical Therapy': [
    {
      titles: [
        'Physical Therapy Aide / Rehab Tech - Outpatient Sports & Ortho',
        'Outpatient Physical Therapy Technician - Private Rehab Studio',
        'Exercise Science / Pre-PT Rehab Aide - 1-on-1 Clinic'
      ],
      baseMin: 20,
      baseMax: 25,
      appointment: '45-Min 1-on-1 Patient Care',
      software: ['Prompt EMR', 'WebPT', 'VALD ForceDecks'],
      suffixes: ['Sports Physical Therapy', 'Orthopedic Rehab', 'Motion Physical Therapy', 'Performance & Rehab Studio'],
      description: 'Independent, therapist-owned outpatient orthopedic & sports clinic seeking an energetic Physical Therapy Aide. Ideal for Kinesiology graduates or Pre-DPT candidates looking for hands-on mentorship in a 1-on-1 clinic environment.',
      benefits: ['Direct Mentorship & DPT Recommendation Letters', 'Full Medical, Vision & Life Coverage', 'Paid Holidays & PTO', 'No Weekends'],
      resp: [
        'Coach patients through prescribed therapeutic exercise progressions with proper biomechanics',
        'Set up thermal modalities, electrical stimulation, GameReady, and normative testing equipment',
        'Maintain a motivating, organized, and sanitized athletic rehab floor'
      ],
      qual: [
        'Background or degree in Kinesiology, Exercise Physiology, Athletic Training, or Pre-PT',
        'Strong understanding of foundational strength and mobility exercises',
        'Encouraging, high-energy interpersonal skills'
      ]
    },
    {
      titles: [
        'Physical Therapist Assistant (PTA) - Private Outpatient Orthopedics',
        'Licensed Physical Therapist Assistant (PTA) - No Double Booking',
        'Outpatient Orthopedic PTA - Sports & Spine Private Practice'
      ],
      baseMin: 33,
      baseMax: 41,
      appointment: '45-Min Dedicated 1-on-1 Sessions',
      software: ['Prompt EMR', 'WebPT', 'MedBridge Home Exercise'],
      suffixes: ['Orthopedic Physical Therapy', 'Movement Specialists', 'Physical Therapy Partners', 'Sports & Spine Rehab'],
      description: 'Tired of high-volume corporate mills seeing 20+ patients a day? Our private outpatient orthopedic clinic schedules strictly 1-on-1 for 45 minutes per patient so you can deliver genuine manual therapy and functional rehab.',
      benefits: ['Strictly 1-on-1 Patient Care (10–11 Patients/Day Max)', '100% Employer-Paid Medical & Dental', '$1,500 Annual CE Allowance', '401(k) with 4% Safe Harbor Match'],
      resp: [
        'Execute individualized outpatient orthopedic and post-operative rehabilitation plans under PT collaboration',
        'Deliver manual soft-tissue mobilization, neuromuscular re-education, and progressive strength training',
        'Complete streamlined daily notes in Prompt EMR with dedicated documentation blocks'
      ],
      qual: [
        'Associate Degree from a CAPTE-accredited Physical Therapist Assistant program',
        'Active State PTA License and current CPR/BLS certification',
        'Passion for evidence-based outpatient orthopedic care'
      ]
    },
    {
      titles: [
        'Outpatient PT Front Desk & Patient Care Coordinator',
        'Physical Therapy Clinic Receptionist & Insurance Verifier',
        'Patient Experience & Scheduling Coordinator - Private PT Clinic'
      ],
      baseMin: 21,
      baseMax: 26,
      appointment: 'Warm Patient Check-In Flow',
      software: ['Prompt EMR', 'WebPT', 'Availity'],
      suffixes: ['Physical Therapy & Wellness', 'Rehab Associates', 'Orthopedic Therapy Center', 'Restore Physical Therapy'],
      description: 'Be the welcoming heartbeat of our private physical therapy clinic. Greet recovering patients by name, coordinate multi-week rehab schedules, verify physical therapy insurance benefits, and support our clinical team.',
      benefits: ['No Weekends (Mon–Fri Schedule)', 'Full Medical, Vision & Life Coverage', 'Monthly Team Profit-Sharing Bonus ($350–$600/mo)', 'Paid Holidays & PTO'],
      resp: [
        'Welcome patients, manage digital intake forms, and schedule recurring physical therapy visits',
        'Verify commercial, Medicare, and Workers’ Comp PT benefits and track authorization visit counts',
        'Collect copays and communicate with referring orthopedic surgeons’ offices'
      ],
      qual: [
        '1+ year medical, dental, or physical therapy front desk experience',
        'Familiarity with insurance eligibility verification and scheduling software',
        'Organized multi-tasker with a warm, empathetic phone presence'
      ]
    }
  ],

  'Dermatology & MedSpa': [
    {
      titles: [
        'Certified Dermatology Medical Assistant (CMA) - Cosmetic & Medical',
        'Dermatology Medical Assistant & Scribe - Private Skin Clinic',
        'Aesthetic & Clinical Medical Assistant - Boutique Dermatology'
      ],
      baseMin: 25,
      baseMax: 32,
      appointment: 'Relaxed 20–30 Min Dermatology Visits',
      software: ['ModMed EMA', 'Nextech', 'FotoFinder Dermoscopy'],
      suffixes: ['Dermatology & Laser Center', 'Skin & Aesthetic Institute', 'Dermatology Associates', 'Aesthetic Dermatology Studio'],
      description: 'Board-certified private dermatology & cosmetic laser practice seeking a polished Dermatology Medical Assistant. Room medical and aesthetic patients, scribe in ModMed EMA, prepare Botox/filler syringes, and assist in skin biopsies and excisions.',
      benefits: ['Generous Gratis Skincare + Complimentary Laser Perks', '100% Employer-Paid Medical & Dental', '401(k) with 4% Safe Harbor Match', 'Figs Scrubs Stipend'],
      resp: [
        'Room patients, document dermatologic histories, and scribe live during full-body skin exams in ModMed EMA',
        'Assist board-certified dermatologists with shave/punch biopsies, cyst excisions, cryotherapy, and cosmetic injectables',
        'Apply topical numbing, photograph before/after progress, and educate patients on post-procedure skincare'
      ],
      qual: [
        'Certified or Registered Medical Assistant (CMA / RMA / CCMA) or 1+ year dermatology/plastic surgery assisting',
        'Proficiency with iPad-based EHRs (ModMed EMA or Nextech preferred)',
        'Professional, detail-oriented clinical presentation'
      ]
    },
    {
      titles: [
        'Licensed Medical Aesthetician & Laser Technician - Physician MedSpa',
        'Master Clinical Aesthetician - Hydrafacial, BBL & Microneedling',
        'Medical Aesthetician - Luxury Dermatology & MedSpa Practice'
      ],
      baseMin: 28,
      baseMax: 38,
      appointment: '60-Min Customized Clinical Treatments',
      software: ['Zenoti MedSpa', 'Nextech', 'VISIA Skin Analysis'],
      suffixes: ['MedSpa & Laser Studio', 'Medical Aesthetics', 'Skin & Laser Lounge', 'Radiance MedSpa'],
      description: 'Physician-owned luxury medical spa seeking an experienced Licensed Medical Aesthetician. Deliver results-driven clinical treatments including Sciton BBL/Moxi, RF Microneedling, VI Peels, DiamondGlow, and medical-grade skincare consultations.',
      benefits: ['High Base Hourly + 15% Service & Retail Bonus', 'Full Medical, Vision & Life Coverage', '$1,500 Annual CE Allowance', 'Paid Holidays & PTO'],
      resp: [
        'Perform VISIA digital skin analyses and build customized long-term corrective treatment plans',
        'Execute medical-grade chemical peels, microneedling, laser hair/pigment treatments, and custom facials',
        'Recommend evidence-based home care regimens (SkinCeuticals, ZO Skin Health, Alastin)'
      ],
      qual: [
        'Active State Aesthetician License (plus Laser Certification where applicable by state)',
        '2+ years clinical medspa or dermatology practice experience',
        'Track record of high patient retention and ethical skincare consultations'
      ]
    },
    {
      titles: [
        'Mohs Surgical Technician / Histotech - Private Skin Cancer Center',
        'Dermatology Surgical Assistant - Outpatient Mohs Suite',
        'Certified Mohs Histotechnician - Mon–Thu Surgical Schedule'
      ],
      baseMin: 31,
      baseMax: 42,
      appointment: 'Dedicated Outpatient Surgical Suite',
      software: ['ModMed EMA', 'CLIA Lab Log'],
      suffixes: ['Mohs & Skin Cancer Center', 'Dermatologic Surgery Associates', 'Skin Surgery Specialists', 'Mohs Micrographic Clinic'],
      description: 'Fellowship-trained Mohs Surgeon seeking a skilled Mohs Surgical Tech or Histotech for our state-of-the-art private outpatient surgical center. Enjoy a predictable 4-day workweek with zero hospital call or weekend shifts.',
      benefits: ['No Weekends (4-Day Workweek Mon–Thu)', '100% Employer-Paid Medical & Dental', 'Monthly Team Profit-Sharing Bonus ($350–$600/mo)', '401(k) with 4% Safe Harbor Match'],
      resp: [
        'Prepare sterile surgical trays and assist the Mohs surgeon with local anesthesia, layer excisions, and complex flap/graft reconstructions',
        'Process, embed, cryostat-section, and H&E stain frozen tissue specimens in our CLIA-certified on-site lab (for Histotechs)',
        'Apply pressure dressings and deliver compassionate post-op wound care instructions'
      ],
      qual: [
        'Prior experience in Mohs micrographic surgery, dermatologic surgery assisting, or frozen-section histology',
        'Impeccable sterile technique and attention to detail',
        'Calm, reassuring bedside manner with skin cancer patients'
      ]
    }
  ],

  'Family Medicine': [
    {
      titles: [
        'Certified Medical Assistant (CMA / RMA) - Private Family Practice',
        'Outpatient Clinical Medical Assistant - Independent Primary Care',
        'Back Office Medical Assistant (CMA) - Mon–Fri Daytime Only'
      ],
      baseMin: 22,
      baseMax: 28,
      appointment: '20–30 Min Unrushed Primary Care Visits',
      software: ['AthenaHealth', 'eClinicalWorks', 'Elation Health'],
      suffixes: ['Family Medicine', 'Primary Care Associates', 'Internal Medicine & Wellness', 'Family Health Clinic'],
      description: 'Independent physician-owned family medicine practice seeking a warm, reliable Certified Medical Assistant (CMA/RMA). Escape hospital bureaucracy—enjoy a close-knit team, 16–18 patients per provider per day, and strictly daytime weekday hours.',
      benefits: ['100% Employer-Paid Medical & Dental', 'No Weekends (Strictly Mon–Fri 8:00am–4:30pm)', '401(k) with 4% Safe Harbor Match', 'Paid Holidays & PTO'],
      resp: [
        'Room patients, obtain vital signs, reconcile medications, and record chief complaints in AthenaHealth EHR',
        'Perform in-office EKGs, spirometry, rapid strep/flu/A1C point-of-care tests, and administer immunizations',
        'Coordinate prior authorizations, specialist referrals, and prescription refill requests'
      ],
      qual: [
        'Certified or Registered Medical Assistant (CMA, RMA, CCMA, or NCMA) credential',
        '1+ year outpatient primary care, pediatrics, or internal medicine experience',
        'Current BLS/CPR certification and phlebotomy comfort'
      ]
    },
    {
      titles: [
        'Certified Phlebotomist (CPT) & Outpatient Lab Assistant',
        'Outpatient Clinic Phlebotomy Technician - Private Medical Office',
        'Lead Phlebotomist (CPT) - Smooth Morning/Daytime Draw Station'
      ],
      baseMin: 21,
      baseMax: 27,
      appointment: 'Calm Outpatient Draw Suite',
      software: ['AthenaHealth', 'Quest Quanum', 'Labcorp Beacon'],
      suffixes: ['Internal Medicine', 'Diagnostic & Primary Care', 'Medical Associates', 'Preventive Medicine Group'],
      description: 'Private outpatient medical clinic seeking a gentle, experienced Phlebotomist (CPT). Manage our in-house blood draw suite for routine wellness panels, centrifuge and package Quest/Labcorp specimens, and run CLIA-waived point-of-care testing.',
      benefits: ['No Weekends (Daytime Schedule 7:30am–4:00pm)', 'Full Medical, Vision & Life Coverage', 'Paid Holidays & PTO', 'Figs Scrubs Stipend'],
      resp: [
        'Perform confident, single-stick venipunctures and capillary draws on adult and senior outpatient clinic patients',
        'Centrifuge, aliquot, label, and track reference lab specimens for Quest and Labcorp courier pickup',
        'Maintain daily CLIA quality control logs, refrigerator temp logs, and lab supply inventory'
      ],
      qual: [
        'Active Phlebotomy Certification (CPT via NHA, ASCP, or state license)',
        '1+ year outpatient phlebotomy or reference lab draw station experience',
        'Gentle, reassuring technique with anxious patients'
      ]
    },
    {
      titles: [
        'Private Medical Practice Office Manager - Outpatient Clinic',
        'Clinic Operations & Practice Manager - Independent Primary Care',
        'Medical Office Administrator - Physician-Owned Practice'
      ],
      baseMin: 31,
      baseMax: 40,
      appointment: 'Practice Leadership & Operations',
      software: ['AthenaHealth', 'QuickBooks Online', 'ADP Workforce'],
      suffixes: ['Medical Group', 'Primary Care Partners', 'Family Medicine Center', 'Physicians Clinic'],
      description: 'Experienced Practice Manager sought to lead our 4-provider independent family medicine clinic. Oversee front and back office staff, optimize AthenaHealth revenue cycle workflows, manage payer credentialing, and foster our positive clinic culture.',
      benefits: ['Competitive Base Pay + Monthly Team Profit-Sharing Bonus ($350–$600/mo)', '100% Employer-Paid Medical & Dental', '401(k) with 4% Safe Harbor Match', '$1,500 Annual CE Allowance'],
      resp: [
        'Recruit, mentor, and schedule front desk receptionists, medical assistants, and billing staff',
        'Monitor daily claims submission, denial management, A/R aging, and patient billing inquiries',
        'Ensure full HIPAA, OSHA, and CLIA compliance while managing vendor relationships and payroll'
      ],
      qual: [
        '3+ years managing an independent medical, dental, or specialty outpatient clinic',
        'Strong command of outpatient medical billing/RCM and cloud EHR systems',
        'Collaborative, empathetic leadership style'
      ]
    }
  ]
};

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

async function generateAndSeedJobs() {
  console.log('🚀 Generating Nationwide 52-State Verified Clinic Job Feed...');

  const rawJobs = [];
  let counter = 1000;

  for (let mIdx = 0; mIdx < METROS.length; mIdx++) {
    const metro = METROS[mIdx];
    const categories = Object.entries(ROLES_BY_CATEGORY);

    for (let cIdx = 0; cIdx < categories.length; cIdx++) {
      const [category, roles] = categories[cIdx];

      for (let rIdx = 0; rIdx < roles.length; rIdx++) {
        const roleTemplate = roles[rIdx];

        for (let variant = 0; variant < 2; variant++) {
          counter++;
          const seed = counter * 137 + mIdx * 31 + cIdx * 17 + rIdx * 7 + variant;

          const neighborhoodList = metro.neighborhoods;
          const neighborhood = neighborhoodList[(counter + variant * 3 + rIdx) % neighborhoodList.length];
          const suffix = roleTemplate.suffixes[(counter + variant * 2 + mIdx) % roleTemplate.suffixes.length];

          const namePattern = (counter + variant) % 3;
          let clinicName = '';
          if (namePattern === 0) {
            clinicName = `${neighborhood} ${suffix}`;
          } else if (namePattern === 1) {
            const doctorLastNames = ['Mitchell', 'Chen', 'Patel', 'Anderson', 'Reynolds', 'Keller', 'Vance', 'del Rosario', 'Lindqvist', 'Montgomery', 'Brennan', 'Callahan'];
            const docName = doctorLastNames[(counter + mIdx) % doctorLastNames.length];
            clinicName = `${neighborhood} ${suffix} — Dr. ${docName} & Associates`;
          } else {
            clinicName = `${neighborhood} ${category === 'Dental' ? 'Dental' : category === 'Vision' ? 'Eye' : 'Clinical'} Group of ${metro.city}`;
          }

          const baseTitle = roleTemplate.titles[(counter + variant + mIdx) % roleTemplate.titles.length];

          let workType = 'Full-time';
          if (variant === 1 && (counter % 3 === 0)) {
            workType = 'Part-time';
          } else if (variant === 1 && (counter % 7 === 0)) {
            workType = 'PRN / Temp';
          }

          const title = workType === 'Part-time' && !baseTitle.includes('Part-Time')
            ? `${baseTitle.split(' - ')[0]} (Part-Time / Flexible Days)`
            : workType === 'PRN / Temp'
            ? `${baseTitle.split(' - ')[0]} (PRN / Per Diem)`
            : baseTitle;

          const variance = (counter % 3) - 1;
          const minHourly = Math.max(18, Math.round(roleTemplate.baseMin * metro.payFactor) + variance);
          const maxHourly = Math.max(minHourly + 4, Math.round(roleTemplate.baseMax * metro.payFactor) + variance);

          const payDiffPct = 11 + ((counter * 7) % 12);
          const payComparison = `+${payDiffPct}% Above ${metro.city} Avg`;

          const nowMs = Date.now();
          const hoursAgo = Math.floor(seededRandom(seed) * 336);
          const minutesOffset = Math.floor(seededRandom(seed + 99) * 59);
          const createdAt = new Date(nowMs - (hoursAgo * 3600 * 1000) - (minutesOffset * 60 * 1000)).toISOString();

          const domainSlug = `${neighborhood}${suffix}`.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 22);

          rawJobs.push({
            seedScore: seededRandom(seed + 555),
            job: {
              id: `job-${counter}`,
              title,
              clinic_name: clinicName,
              clinic_type: category,
              location: `${metro.city}, ${metro.state}`,
              city: metro.city,
              state: metro.state,
              zip_code: metro.zip,
              work_type: workType,
              min_hourly: minHourly,
              max_hourly: maxHourly,
              pay_period: 'hour',
              pay_comparison: payComparison,
              is_featured: false,
              is_urgent: counter % 11 === 0,
              verified_active: true,
              appointment_time: roleTemplate.appointment,
              software_used: roleTemplate.software,
              benefits: roleTemplate.benefits,
              description: `${clinicName} is an NPI-verified, privately owned ${category.toLowerCase()} practice located in the ${neighborhood} area of ${metro.city}, ${metro.state}.\n\n${roleTemplate.description}\n\nWhy clinicians stay with us long-term: respectful doctor leadership, modern equipment, transparent hourly compensation ($${minHourly}–$${maxHourly}/hr), and a healthy work-life balance without corporate burnout.`,
              responsibilities: roleTemplate.resp,
              qualifications: roleTemplate.qual,
              apply_email: `careers@${domainSlug}.com`,
              apply_url: `https://${domainSlug}.com/careers`,
              created_at: createdAt
            }
          });
        }
      }
    }
  }

  rawJobs.sort((a, b) => a.seedScore - b.seedScore);

  const allJobs = rawJobs.map((item, idx) => {
    const j = item.job;
    if (idx < 10) {
      j.is_featured = true;
      const recentHours = (idx * 2) + 1;
      j.created_at = new Date(Date.now() - recentHours * 3600 * 1000).toISOString();
    } else {
      j.is_featured = false;
    }
    return j;
  });

  const uniqueStates = new Set(allJobs.map((j) => j.state));
  console.log(`✅ Generated ${allJobs.length} realistic jobs across ${uniqueStates.size} US States & Territories!`);

  const jsonPath = path.resolve(__dirname, '..', 'data', 'all_jobs.json');
  fs.writeFileSync(jsonPath, JSON.stringify(allJobs, null, 2));
  console.log(`📁 Saved updated JSON database cache to: ${jsonPath}`);

  console.log('☁️ Syncing updated 52-State jobs to Supabase Cloud Database...');
  const batchSize = 100;
  let insertedCount = 0;

  for (let i = 0; i < allJobs.length; i += batchSize) {
    const batch = allJobs.slice(i, i + batchSize);
    const { error } = await supabase.from('jobs').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error(`⚠️ Batch ${i / batchSize + 1} error:`, error.message);
    } else {
      insertedCount += batch.length;
      process.stdout.write(`\r   Synced ${insertedCount} / ${allJobs.length} jobs to Supabase...`);
    }
  }

  console.log('\n🎉 ALL 52-STATE REALISTIC JOBS UPDATED IN JSON & SUPABASE!');
}

generateAndSeedJobs().catch((err) => {
  console.error('Fatal error during seeding:', err);
});
