import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://dslzkfkdtikdhnyebsvg.supabase.co';
const supabaseKey = 'sb_publishable_n4vG_Jrw7F6GxFPa7Zj6HQ_2V8XUu1k';
const supabase = createClient(supabaseUrl, supabaseKey);

const METROS = [
  { city: 'Dallas', state: 'TX', zip: '75225', payFactor: 1.05, neighborhoods: ['Preston Hollow', 'Uptown', 'Highland Park', 'Lakewood', 'Park Cities', 'Oak Lawn'] },
  { city: 'Fort Worth', state: 'TX', zip: '76107', payFactor: 1.0, neighborhoods: ['Clearfork', 'TCU Area', 'Westover Hills', 'Mira Vista', 'Southlake', 'Colleyville'] },
  { city: 'Houston', state: 'TX', zip: '77002', payFactor: 1.03, neighborhoods: ['River Oaks', 'The Heights', 'Memorial', 'West University', 'Sugar Land', 'The Woodlands'] },
  { city: 'Austin', state: 'TX', zip: '78701', payFactor: 1.1, neighborhoods: ['Westlake', 'South Congress', 'Tarrytown', 'Barton Creek', 'Domain Northside', 'Mueller'] },
  { city: 'San Antonio', state: 'TX', zip: '78209', payFactor: 0.96, neighborhoods: ['Alamo Heights', 'Stone Oak', 'The Dominion', 'Olmos Park', 'Shavano Park', 'Pearl District'] },
  { city: 'Miami', state: 'FL', zip: '33139', payFactor: 1.12, neighborhoods: ['Coral Gables', 'Brickell', 'Coconut Grove', 'Biscayne Bay', 'Pinecrest', 'Aventura'] },
  { city: 'Fort Lauderdale', state: 'FL', zip: '33301', payFactor: 1.06, neighborhoods: ['Las Olas', 'Victoria Park', 'Harbor Beach', 'Plantation', 'Weston', 'Boca Raton'] },
  { city: 'Tampa', state: 'FL', zip: '33602', payFactor: 0.99, neighborhoods: ['Hyde Park', 'South Tampa', 'Westchase', 'Channelside', 'Carrollwood', 'St. Pete'] },
  { city: 'Orlando', state: 'FL', zip: '32801', payFactor: 0.97, neighborhoods: ['Winter Park', 'Lake Nona', 'Dr. Phillips', 'Baldwin Park', 'Thornton Park', 'Windermere'] },
  { city: 'Jacksonville', state: 'FL', zip: '32202', payFactor: 0.95, neighborhoods: ['Ponte Vedra', 'San Marco', 'Riverside', 'Avondale', 'Mandarin', 'Julington Creek'] },
  { city: 'Atlanta', state: 'GA', zip: '30309', payFactor: 1.05, neighborhoods: ['Buckhead', 'Midtown', 'Virginia-Highland', 'Inman Park', 'Alpharetta', 'Sandy Springs'] },
  { city: 'Phoenix', state: 'AZ', zip: '85016', payFactor: 1.03, neighborhoods: ['Biltmore', 'Arcadia', 'Camelback', 'Desert Ridge', 'Ahwatukee', 'Chandler'] },
  { city: 'Scottsdale', state: 'AZ', zip: '85251', payFactor: 1.13, neighborhoods: ['Silverleaf', 'Kierland', 'Old Town', 'Gainey Ranch', 'McCormick Ranch', 'Paradise Valley'] },
  { city: 'Tucson', state: 'AZ', zip: '85701', payFactor: 0.96, neighborhoods: ['Catalina Foothills', 'Oro Valley', 'Sabino Canyon', 'Dove Mountain', 'Sam Hughes', 'Tanque Verde'] },
  { city: 'Denver', state: 'CO', zip: '80202', payFactor: 1.14, neighborhoods: ['Cherry Creek', 'LoDo', 'Wash Park', 'Highlands', 'Boulder', 'Littleton'] },
  { city: 'Colorado Springs', state: 'CO', zip: '80903', payFactor: 1.01, neighborhoods: ['Broadmoor', 'Briargate', 'Flying Horse', 'Old Colorado City', 'Monument', 'Cheyenne Canyon'] },
  { city: 'Charlotte', state: 'NC', zip: '28202', payFactor: 1.01, neighborhoods: ['Myers Park', 'SouthPark', 'Dilworth', 'Ballantyne', 'Elizabeth', 'Lake Norman'] },
  { city: 'Raleigh', state: 'NC', zip: '27601', payFactor: 1.04, neighborhoods: ['North Hills', 'Five Points', 'Cameron Village', 'Cary', 'Chapel Hill', 'Wake Forest'] },
  { city: 'Nashville', state: 'TN', zip: '37203', payFactor: 1.05, neighborhoods: ['Green Hills', 'Belle Meade', 'Brentwood', 'Franklin', 'The Gulch', 'Sylvan Park'] },
  { city: 'Memphis', state: 'TN', zip: '38103', payFactor: 0.94, neighborhoods: ['Germantown', 'Collierville', 'East Memphis', 'Cooper-Young', 'Harbor Town', 'Chickasaw Gardens'] },
  { city: 'Chicago', state: 'IL', zip: '60611', payFactor: 1.18, neighborhoods: ['Lincoln Park', 'Gold Coast', 'River North', 'Lakeview', 'Oak Brook', 'Naperville'] },
  { city: 'Indianapolis', state: 'IN', zip: '46204', payFactor: 0.97, neighborhoods: ['Carmel', 'Meridian-Kessler', 'Zionsville', 'Fishers', 'Broad Ripple', 'Geist'] },
  { city: 'Columbus', state: 'OH', zip: '43215', payFactor: 0.98, neighborhoods: ['Upper Arlington', 'Dublin', 'New Albany', 'Grandview Heights', 'Bexley', 'Worthington'] },
  { city: 'Cincinnati', state: 'OH', zip: '45202', payFactor: 0.96, neighborhoods: ['Hyde Park', 'Mt. Lookout', 'Indian Hill', 'Montgomery', 'Mariemont', 'Kenwood'] },
  { city: 'Philadelphia', state: 'PA', zip: '19103', payFactor: 1.15, neighborhoods: ['Rittenhouse Square', 'Main Line', 'Chestnut Hill', 'Bryn Mawr', 'Society Hill', 'King of Prussia'] },
  { city: 'Pittsburgh', state: 'PA', zip: '15222', payFactor: 0.98, neighborhoods: ['Shadyside', 'Squirrel Hill', 'Fox Chapel', 'Sewickley', 'Mt. Lebanon', 'Wexford'] },
  { city: 'Las Vegas', state: 'NV', zip: '89109', payFactor: 1.03, neighborhoods: ['Summerlin', 'Henderson', 'Green Valley', 'The Ridges', 'Southern Highlands', 'Spring Valley'] },
  { city: 'San Diego', state: 'CA', zip: '92101', payFactor: 1.28, neighborhoods: ['La Jolla', 'Del Mar', 'Carmel Valley', 'Coronado', 'Encinitas', 'Mission Hills'] },
  { city: 'Los Angeles', state: 'CA', zip: '90024', payFactor: 1.27, neighborhoods: ['Beverly Hills', 'Santa Monica', 'Brentwood', 'Pasadena', 'Manhattan Beach', 'Studio City'] },
  { city: 'Orange County', state: 'CA', zip: '92660', payFactor: 1.28, neighborhoods: ['Newport Beach', 'Irvine', 'Laguna Niguel', 'Huntington Beach', 'Corona del Mar', 'Mission Viejo'] },
  { city: 'San Francisco', state: 'CA', zip: '94102', payFactor: 1.35, neighborhoods: ['Pacific Heights', 'Marina District', 'Noe Valley', 'Mill Valley', 'Burlingame', 'Walnut Creek'] },
  { city: 'San Jose', state: 'CA', zip: '95113', payFactor: 1.32, neighborhoods: ['Palo Alto', 'Los Gatos', 'Saratoga', 'Cupertino', 'Menlo Park', 'Willow Glen'] },
  { city: 'Sacramento', state: 'CA', zip: '95814', payFactor: 1.15, neighborhoods: ['East Sacramento', 'Granite Bay', 'Roseville', 'El Dorado Hills', 'Folsom', 'Land Park'] },
  { city: 'Seattle', state: 'WA', zip: '98101', payFactor: 1.25, neighborhoods: ['Bellevue', 'Queen Anne', 'Madison Park', 'Kirkland', 'Mercer Island', 'Ballard'] },
  { city: 'Portland', state: 'OR', zip: '97201', payFactor: 1.16, neighborhoods: ['Pearl District', 'Lake Oswego', 'West Hills', 'Nob Hill', 'Beaverton', 'Irvington'] },
  { city: 'Salt Lake City', state: 'UT', zip: '84101', payFactor: 1.02, neighborhoods: ['Sugar House', 'Holladay', 'Draper', 'Park City', 'Cottonwood Heights', 'The Avenues'] },
  { city: 'New York Metro', state: 'NY', zip: '10021', payFactor: 1.31, neighborhoods: ['Upper East Side', 'Tribeca', 'Park Slope', 'Scarsdale', 'Greenwich', 'Garden City'] },
  { city: 'Boston', state: 'MA', zip: '02116', payFactor: 1.25, neighborhoods: ['Back Bay', 'Beacon Hill', 'Wellesley', 'Brookline', 'Newton', 'Cambridge'] },
  { city: 'Washington', state: 'DC', zip: '20006', payFactor: 1.22, neighborhoods: ['Georgetown', 'Bethesda', 'McLean', 'Chevy Chase', 'Dupont Circle', 'Alexandria'] },
  { city: 'Baltimore', state: 'MD', zip: '21201', payFactor: 1.06, neighborhoods: ['Roland Park', 'Towson', 'Harbor East', 'Columbia', 'Ellicott City', 'Federal Hill'] },
  { city: 'Minneapolis', state: 'MN', zip: '55401', payFactor: 1.11, neighborhoods: ['Edina', 'Wayzata', 'Linden Hills', 'North Loop', 'Minnetonka', 'Woodbury'] },
  { city: 'Kansas City', state: 'MO', zip: '64106', payFactor: 0.97, neighborhoods: ['Country Club Plaza', 'Leawood', 'Overland Park', 'Brookside', 'Prairie Village', 'Mission Hills'] },
  { city: 'St. Louis', state: 'MO', zip: '63101', payFactor: 0.96, neighborhoods: ['Clayton', 'Ladue', 'Central West End', 'Town and Country', 'Kirkwood', 'Webster Groves'] },
  { city: 'Milwaukee', state: 'WI', zip: '53202', payFactor: 0.98, neighborhoods: ['Whitefish Bay', 'Brookfield', 'Third Ward', 'Shorewood', 'Mequon', 'Wauwatosa'] },
  { city: 'Oklahoma City', state: 'OK', zip: '73102', payFactor: 0.94, neighborhoods: ['Nichols Hills', 'Edmond', 'Midtown', 'Crown Heights', 'Mesta Park', 'Quail Creek'] },
  { city: 'Richmond', state: 'VA', zip: '23219', payFactor: 1.02, neighborhoods: ['Short Pump', 'The Fan', 'Carytown', 'Westhampton', 'Midlothian', 'Windsor Farms'] },
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
      baseMax: 53,
      appointment: '60-Min Adult Prophy / 90-Min New Patient',
      software: ['Dentrix Ascend', 'Dexis Digital Sensors', 'iTero Element 5D'],
      suffixes: ['Dental Studio', 'Family & Cosmetic Dentistry', 'Smile Collective', 'Dental Arts', 'Esthetic Dentistry', 'Dental Partners'],
      description: 'Independent fee-for-service and PPO private dental practice seeking a licensed Registered Dental Hygienist (RDH). We prioritize unrushed 60-minute recare appointments, modern Cavitron & Piezo ultrasonic units, Assisted Hygiene support, and zero corporate production quotas.',
      benefits: ['100% Employer-Paid Medical & Dental', '401(k) with 4% Safe Harbor Match', '$1,500 Annual CE Allowance', 'Figs Scrubs Stipend', '3 Weeks Paid Vacation'],
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
      suffixes: ['Cosmetic & Implant Dentistry', 'Restorative Dental Studio', 'Dental Specialists', 'Advanced Dental Care', 'Modern Dentistry', 'Smile Design'],
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
      suffixes: ['Family Dental Group', 'Dental Associates', 'Premier Dentistry', 'Dental Care Studio', 'Village Dentistry', 'Parkway Dental'],
      description: 'Join our welcoming private practice front desk team. You will serve as the first smile patients see, presenting treatment plans clearly, verifying PPO insurance breakdowns, and keeping the doctor and hygiene schedules running smoothly.',
      benefits: ['Competitive Base Hourly + Monthly Collection Bonus', 'Health Insurance Stipend', 'Free Dental Care for Immediate Family', '401(k) Match'],
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
        'Orthodontic Assistant (RDA / OA) - Invisalign & Digital Brackets',
        'Clinical Orthodontic Technician - Private Ortho Studio',
        'Orthodontic Chairside Assistant - Fun Private Practice',
        'Lead Orthodontic Assistant - Digital Aligner Workflow'
      ],
      baseMin: 25,
      baseMax: 31,
      appointment: '30-Min Ortho Adjustment Flow',
      software: ['Dolphin Management', 'iTero Element 5D', 'OrthoFi'],
      suffixes: ['Orthodontics', 'Smile Orthodontics', 'Orthodontic Studio', 'Braces & Invisalign Center', 'Align Orthodontics', 'Ortho Specialists'],
      description: 'Energetic, board-certified private orthodontist seeking a skilled Orthodontic Assistant. Assist with archwire adjustments, Invisalign attachment bonding, digital 3D scanning, and celebrating bracket debond days with patients!',
      benefits: ['4-Day Workweek Option', 'Medical, Dental & Vision Benefits', 'Monthly Orthodontic Starts Bonus', 'Complimentary Ortho Care'],
      resp: [
        'Perform archwire changes, elastic ties, Invisalign attachment placement, and appliance adjustments',
        'Capture digital iTero 3D scans, panoramic/cephalometric radiographs, and clinical photos',
        'Educate children, teens, and adults on aligner wear and oral hygiene'
      ],
      qual: [
        'RDA or Orthodontic Assistant certification as required by state board',
        'Previous orthodontic chairside experience strongly preferred',
        'Upbeat team player who enjoys working with teens and families'
      ]
    },
    {
      titles: [
        'Pediatric Dental Assistant (RDA) - Kid-Friendly Private Clinic',
        'Registered Dental Assistant - Private Pediatric Practice',
        'Chairside Pediatric Dental Assistant - No Weekends',
        'Pediatric RDA (Nitrous Monitoring Certified)'
      ],
      baseMin: 24,
      baseMax: 30,
      appointment: 'Gentle Child-Centered Scheduling',
      software: ['Dentrix', 'XDR Digital Radiology', 'Curve Hero'],
      suffixes: ['Pediatric Dentistry', 'Kids Dental Studio', 'Children’s Dental Care', 'Little Smiles Dentistry', 'Sprout Pediatric Dental', 'Tiny Teeth Dentistry'],
      description: 'Board-certified pediatric dentist seeking a patient, upbeat Pediatric Dental Assistant. Our private practice is designed to make kids love visiting the dentist—featuring ceiling TVs, a prize wall, and a calm, supportive team.',
      benefits: ['Consistent Weekday Schedule (No Evenings/Weekends)', 'Full Medical & Vision Coverage', 'Generous PTO & 8 Paid Holidays', 'Scrubs Allowance'],
      resp: [
        'Perform coronal polishing, topical fluoride applications, and pediatric digital bitewings',
        'Assist the pediatric dentist during restorative procedures using positive behavior guidance ("Tell-Show-Do")',
        'Monitor nitrous oxide analgesia and educate parents on cavity prevention'
      ],
      qual: [
        'Active RDA license with Radiology and Nitrous Oxide Monitoring certifications',
        'Genuine passion for working with children of all ages',
        'Calm, reassuring chairside presence'
      ]
    },
    {
      titles: [
        'Associate General Dentist (DDS / DMD) - Private Fee-For-Service / PPO',
        'Associate Dentist (DDS / DMD) - Modern Digital Practice',
        'Managing Clinical Dentist (DDS / DMD) - Partnership Track',
        'Part-Time / Full-Time Associate Dentist - Private Family Office'
      ],
      baseMin: 95,
      baseMax: 135,
      appointment: 'Unrushed Comprehensive Care',
      software: ['Dentrix Ascend', 'CBCT 3D Imaging', 'CEREC Primescan'],
      suffixes: ['Dental Arts', 'Signature Dentistry', 'Comprehensive Dental Care', 'Family & Cosmetic Dental', 'Dental Collective', 'Smiles Studio'],
      description: 'Established, privately owned general & cosmetic practice seeking an Associate Dentist (DDS/DMD). Enjoy full clinical autonomy, 33%–35% of collections with a high daily guarantee, CBCT + Primescan digital workflow, and an experienced EFDA/RDH team.',
      benefits: ['$900–$1,100/Day Guarantee or 34% Collections', '100% Malpractice & Lab Fees Covered', '$3,000 Annual CE Stipend (Implants/Endo)', '401(k) + Health Benefits'],
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
        'Clinical Optometric Technician (COA / Paraoptometric)',
        'Optometric Tech & Contact Lens Specialist - Private Practice'
      ],
      baseMin: 22,
      baseMax: 28,
      appointment: '25-Min Thorough Pre-Testing Flow',
      software: ['RevolutionEHR', 'Optos Daytona Ultra-Widefield', 'Zeiss Cirrus OCT'],
      suffixes: ['Vision Associates', 'Eye Care Studio', 'Optometry & Eyewear', 'Family Eye Care', 'Vision Boutique', 'Ocular Health Clinic'],
      description: 'Independent private optometry practice seeking a personable Optometric Technician. Work directly with our Doctors of Optometry conducting digital pre-testing, Optos retinal imaging, OCT scans, and contact lens insertion/removal trainings.',
      benefits: ['$1,000 Annual Luxury Eyewear Stipend', 'Employer-Sponsored Health & Dental', '401(k) Retirement with 4% Match', 'Paid CPOA/COA Certification'],
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
        'Lead Dispensing Optician - Base Hourly + Uncapped Commission',
        'Optical Lab & Frame Styling Specialist - Boutique Optical'
      ],
      baseMin: 26,
      baseMax: 34,
      appointment: '1-on-1 Bespoke Frame Styling',
      software: ['Officemate / Eyefinity', 'Crystal PM', 'Visioffice Digital Measure'],
      suffixes: ['Optical Boutique', 'Eyewear Atelier', 'Vision & Optical Studio', 'Bespoke Eyecare', 'Optical Gallery', 'Premier Eye Associates'],
      description: 'Upscale independent optical boutique seeking an experienced Optician. Curate and style patients in independent European and Japanese eyewear collections, take precision digital progressive measurements, and deliver white-glove adjustments.',
      benefits: ['High Base Hourly + Monthly Frame/Lens Commission', 'Full Health, Dental & Paid Time Off', 'Complimentary Designer Eyewear Annually', 'No Late Mall Hours'],
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
        'Ophthalmology Medical Assistant & Scribe - Weekday Hours',
        'Senior Ophthalmic Diagnostic Technician - Private Specialists'
      ],
      baseMin: 24,
      baseMax: 31,
      appointment: 'Structured Specialty Clinic Flow',
      software: ['ModMed EMA Ophthalmology', 'Heidelberg Spectralis OCT', 'IOLMaster 700'],
      suffixes: ['Eye Consultants', 'Retina & Cataract Specialists', 'Ophthalmology Associates', 'Laser & Eye Institute', 'Cornea & Glaucoma Center', 'Eye Physicians'],
      description: 'Private physician-owned ophthalmology clinic seeking a dedicated Ophthalmic Assistant / Scribe. Assist board-certified ophthalmologists with cataract evaluations, glaucoma workups, OCT imaging, and real-time EHR scribing.',
      benefits: ['Monday–Friday 8:00am–4:30pm (No Weekends/Call)', 'Full Medical, Dental & 401(k) Profit Sharing', 'JCAHPO COA/COT Exam Sponsorship', '3 Weeks PTO'],
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
        'Exercise Science / Pre-PT Rehab Aide - 1-on-1 Clinic',
        'Physical Therapy Clinical Aide & Gym Coordinator'
      ],
      baseMin: 20,
      baseMax: 25,
      appointment: '45-Min 1-on-1 Patient Care',
      software: ['Prompt EMR', 'WebPT', 'VALD ForceDecks'],
      suffixes: ['Sports Physical Therapy', 'Orthopedic Rehab', 'Motion Physical Therapy', 'Performance & Rehab Studio', 'Spine & Sport PT', 'Kinetic Physical Therapy'],
      description: 'Independent, therapist-owned outpatient orthopedic & sports clinic seeking an energetic Physical Therapy Aide. Ideal for Kinesiology graduates or Pre-DPT candidates looking for hands-on mentorship in a 1-on-1 clinic environment.',
      benefits: ['Direct Mentorship & DPT Recommendation Letters', 'Medical & Dental Benefits (Full-Time)', 'Paid Time Off & Flexible Class Scheduling', 'Free Gym Access'],
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
        'Outpatient Orthopedic PTA - Sports & Spine Private Practice',
        'Physical Therapist Assistant (PTA) - 40-Min 1:1 Treatments'
      ],
      baseMin: 33,
      baseMax: 41,
      appointment: '45-Min Dedicated 1-on-1 Sessions',
      software: ['Prompt EMR', 'WebPT', 'MedBridge Home Exercise'],
      suffixes: ['Orthopedic Physical Therapy', 'Movement Specialists', 'Physical Therapy Partners', 'Sports & Spine Rehab', 'Active Recovery PT', 'Apex Physical Therapy'],
      description: 'Tired of high-volume corporate mills seeing 20+ patients a day? Our private outpatient orthopedic clinic schedules strictly 1-on-1 for 45 minutes per patient so you can deliver genuine manual therapy and functional rehab.',
      benefits: ['Strictly 1-on-1 Patient Care (10–11 Patients/Day Max)', 'Full Health, Dental & Short-Term Disability', '$1,500 Annual CEU + MedBridge Subscription', '401(k) with 4% Match'],
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
        'Patient Experience & Scheduling Coordinator - Private PT Clinic',
        'Front Office Lead - Outpatient Sports Physical Therapy'
      ],
      baseMin: 21,
      baseMax: 26,
      appointment: 'Warm Patient Check-In Flow',
      software: ['Prompt EMR', 'WebPT Billing', 'Availity'],
      suffixes: ['Physical Therapy & Wellness', 'Rehab Associates', 'Orthopedic Therapy Center', 'Physical Therapy Collective', 'Restore Physical Therapy', 'Total Motion PT'],
      description: 'Be the welcoming heartbeat of our private physical therapy clinic. Greet recovering patients by name, coordinate multi-week rehab schedules, verify physical therapy insurance benefits, and support our clinical team.',
      benefits: ['Consistent Monday–Friday Hours', 'Employer Health Insurance + PTO', 'Quarterly Clinic Bonus', 'Supportive, Low-Stress Culture'],
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
        'Aesthetic & Clinical Medical Assistant - Boutique Dermatology',
        'Lead Dermatology MA - Injectables, Laser & Mohs Support'
      ],
      baseMin: 25,
      baseMax: 32,
      appointment: 'Relaxed 20–30 Min Dermatology Visits',
      software: ['ModMed EMA Dermatology', 'Nextech', 'FotoFinder Dermoscopy'],
      suffixes: ['Dermatology & Laser Center', 'Skin & Aesthetic Institute', 'Dermatology Associates', 'Aesthetic Dermatology Studio', 'DermaCare Specialists', 'Clinical Skin Group'],
      description: 'Board-certified private dermatology & cosmetic laser practice seeking a polished Dermatology Medical Assistant. Room medical and aesthetic patients, scribe in ModMed EMA, prepare Botox/filler syringes, and assist in skin biopsies and excisions.',
      benefits: ['Generous Gratis Skincare + Complimentary Botox/Laser Perks', 'Full Health, Dental & Vision Insurance', '401(k) Retirement Match', 'Designer Figs Scrubs Provided'],
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
        'Medical Aesthetician - Luxury Dermatology & MedSpa Practice',
        'Certified Laser & Medical Skincare Specialist - Private MedSpa'
      ],
      baseMin: 28,
      baseMax: 38,
      appointment: '60-Min Customized Clinical Treatments',
      software: ['Zenoti MedSpa', 'Nextech', 'VISIA Skin Analysis'],
      suffixes: ['MedSpa & Laser Studio', 'Medical Aesthetics', 'Skin & Laser Lounge', 'Aesthetic Medicine Clinic', 'Radiance MedSpa', 'Sanctuary Aesthetics'],
      description: 'Physician-owned luxury medical spa seeking an experienced Licensed Medical Aesthetician. Deliver results-driven clinical treatments including Sciton BBL/Moxi, RF Microneedling, VI Peels, DiamondGlow, and medical-grade skincare consultations.',
      benefits: ['High Base Hourly + 10–15% Service & Retail Commission', 'Health Insurance, PTO & Paid Holidays', 'Manufacturer Device Certifications Paid', 'Employee Treatment Perks'],
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
        'Certified Mohs Histotechnician - Mon–Thu Surgical Schedule',
        'Dermatologic Surgery Nurse / Tech - Private Dermatology'
      ],
      baseMin: 31,
      baseMax: 42,
      appointment: 'Dedicated Outpatient Surgical Suite',
      software: ['ModMed EMA', 'CLIA Lab Log'],
      suffixes: ['Mohs & Skin Cancer Center', 'Dermatologic Surgery Associates', 'Skin Surgery Specialists', 'Mohs Micrographic Clinic', 'Center for Surgical Dermatology', 'Skin Cancer Institute'],
      description: 'Fellowship-trained Mohs Surgeon seeking a skilled Mohs Surgical Tech or Histotech for our state-of-the-art private outpatient surgical center. Enjoy a predictable 4-day workweek with zero hospital call or weekend shifts.',
      benefits: ['4-Day Workweek (Mon–Thu, 3-Day Weekends Every Week)', 'Top-Tier Hourly Pay + Annual Bonus', '100% Paid Medical/Dental Insurance', '401(k) + 3 Weeks PTO'],
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
        'Back Office Medical Assistant (CMA) - Mon–Fri Daytime Only',
        'Medical Assistant (CCMA / CMA) - Concierge & Family Medicine'
      ],
      baseMin: 22,
      baseMax: 28,
      appointment: '20–30 Min Unrushed Primary Care Visits',
      software: ['AthenaHealth EHR', 'eClinicalWorks', 'Elation Health'],
      suffixes: ['Family Medicine', 'Primary Care Associates', 'Internal Medicine & Wellness', 'Family Health Clinic', 'Premier Primary Care', 'Neighborhood Medical Group'],
      description: 'Independent physician-owned family medicine practice seeking a warm, reliable Certified Medical Assistant (CMA/RMA). Escape hospital bureaucracy—enjoy a close-knit team, 16–18 patients per provider per day, and strictly daytime weekday hours.',
      benefits: ['100% Employer-Paid Health Insurance', 'Strictly Mon–Fri 8:00am–4:30pm (No Weekends/Holidays)', '401(k) with 5% Employer Match', '3 Weeks Paid Time Off'],
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
        'Lead Phlebotomist (CPT) - Smooth Morning/Daytime Draw Station',
        'Clinical Lab & Phlebotomy Specialist - Private Practice'
      ],
      baseMin: 21,
      baseMax: 27,
      appointment: 'Calm Outpatient Draw Suite',
      software: ['AthenaHealth Lab', 'Quest Quanum', 'Labcorp Beacon'],
      suffixes: ['Internal Medicine', 'Diagnostic & Primary Care', 'Medical Associates', 'Integrative Health Clinic', 'Preventive Medicine Group', 'Family Physicians'],
      description: 'Private outpatient medical clinic seeking a gentle, experienced Phlebotomist (CPT). Manage our in-house blood draw suite for routine wellness panels, centrifuge and package Quest/Labcorp specimens, and run CLIA-waived point-of-care testing.',
      benefits: ['Desirable Daytime Schedule (7:30am–4:00pm Mon–Fri)', 'Full Medical, Dental & Vision Benefits', 'Paid Holidays & Generous PTO', 'No Hospital Floor Rounding'],
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
        'Medical Office Administrator - Physician-Owned Practice',
        'Healthcare Practice Manager (AthenaHealth / RCM)'
      ],
      baseMin: 31,
      baseMax: 40,
      appointment: 'Practice Leadership & Operations',
      software: ['AthenaHealth PM', 'QuickBooks Online', 'ADP Workforce'],
      suffixes: ['Medical Group', 'Primary Care Partners', 'Family Medicine Center', 'Physicians Clinic', 'Health & Wellness Associates', 'Outpatient Medical Clinic'],
      description: 'Experienced Practice Manager sought to lead our 4-provider independent family medicine clinic. Oversee front and back office staff, optimize AthenaHealth revenue cycle workflows, manage payer credentialing, and foster our positive clinic culture.',
      benefits: ['Competitive Base Pay + Quarterly Practice Profitability Bonus', 'Comprehensive Executive Health & Dental Plan', '4 Weeks PTO + Paid Federal Holidays', '401(k) Safe Harbor Match'],
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

// Deterministic pseudo-random generator so shuffling is consistent and reproducible
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

async function generateAndSeedJobs() {
  console.log('🚀 Generating Realistic, Competitor-Grade US Clinic Job Feed...');

  const rawJobs = [];
  let counter = 1000;

  const workTypes = [
    { type: 'Full-time', weight: 0.68 },
    { type: 'Part-time', weight: 0.22 },
    { type: 'PRN / Temp', weight: 0.10 }
  ];

  for (let mIdx = 0; mIdx < METROS.length; mIdx++) {
    const metro = METROS[mIdx];
    const categories = Object.entries(ROLES_BY_CATEGORY);

    for (let cIdx = 0; cIdx < categories.length; cIdx++) {
      const [category, roles] = categories[cIdx];

      for (let rIdx = 0; rIdx < roles.length; rIdx++) {
        const roleTemplate = roles[rIdx];

        // Generate 2 distinct listings per role per metro with different neighborhoods, titles, and schedules
        for (let variant = 0; variant < 2; variant++) {
          counter++;
          const seed = counter * 137 + mIdx * 31 + cIdx * 17 + rIdx * 7 + variant;

          // Pick realistic neighborhood name (not just repeating city name)
          const neighborhoodList = metro.neighborhoods;
          const neighborhood = neighborhoodList[(counter + variant * 3 + rIdx) % neighborhoodList.length];
          const suffix = roleTemplate.suffixes[(counter + variant * 2 + mIdx) % roleTemplate.suffixes.length];

          // Mix naming patterns so they look 100% authentic
          const namePattern = (counter + variant) % 3;
          let clinicName = '';
          if (namePattern === 0) {
            clinicName = `${neighborhood} ${suffix}`;
          } else if (namePattern === 1) {
            const doctorLastNames = ['Mitchell', 'Chen', 'Patel', 'Anderson', 'Reynolds', 'Keller', 'Vance', 'del Rosario', 'Lindqvist', 'Montgomery', 'brennan', 'Callahan'];
            const docName = doctorLastNames[(counter + mIdx) % doctorLastNames.length];
            const cleanDoc = docName.charAt(0).toUpperCase() + docName.slice(1);
            clinicName = `${neighborhood} ${suffix} — Dr. ${cleanDoc} & Associates`;
          } else {
            clinicName = `${neighborhood} ${category === 'Dental' ? 'Dental' : category === 'Vision' ? 'Eye' : 'Clinical'} Group of ${metro.city}`;
          }

          // Pick varied realistic title
          const baseTitle = roleTemplate.titles[(counter + variant + mIdx) % roleTemplate.titles.length];

          // Pick work type naturally
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

          // Localized hourly pay with slight natural variance
          const variance = (counter % 3) - 1; // -1, 0, +1
          const minHourly = Math.max(18, Math.round(roleTemplate.baseMin * metro.payFactor) + variance);
          const maxHourly = Math.max(minHourly + 4, Math.round(roleTemplate.baseMax * metro.payFactor) + variance);

          const payDiffPct = 11 + ((counter * 7) % 12); // +11% to +22%
          const payComparison = `+${payDiffPct}% Above ${metro.city} Avg`;

          // Staggered realistic timestamps over the last 14 days
          // Some jobs posted 25 mins ago, 2 hours ago, 6 hours ago, 1 day ago, up to 14 days ago
          const nowMs = Date.now();
          const hoursAgo = Math.floor(seededRandom(seed) * 336); // 0 to 336 hours (14 days)
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
              is_featured: false, // Will selectively enable only on 12 flagship jobs below
              is_urgent: counter % 11 === 0,
              verified_active: true,
              appointment_time: roleTemplate.appointment,
              software_used: roleTemplate.software,
              benefits: roleTemplate.benefits,
              description: `${clinicName} is an established, privately owned ${category.toLowerCase()} practice located in the ${neighborhood} area of ${metro.city}, ${metro.state}.\n\n${roleTemplate.description}\n\nWhy clinicians stay with us long-term: respectful doctor leadership, modern equipment, transparent hourly compensation ($${minHourly}–$${maxHourly}/hr), and a healthy work-life balance without corporate burnout.`,
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

  // Shuffle deterministically so cities, specialties, and roles are naturally interleaved
  rawJobs.sort((a, b) => a.seedScore - b.seedScore);

  const allJobs = rawJobs.map((item, idx) => {
    const j = item.job;
    // Only mark 12 total jobs across the entire 1,656 dataset as Featured (less than 0.8%)
    // And spread them across different specialties & cities
    if (idx < 12) {
      j.is_featured = true;
      // Ensure featured jobs also have recent timestamps (within last 36 hours)
      const recentHours = (idx * 2) + 1;
      j.created_at = new Date(Date.now() - recentHours * 3600 * 1000).toISOString();
    } else {
      j.is_featured = false;
    }
    return j;
  });

  console.log(`✅ Generated ${allJobs.length} realistic, shuffled clinic jobs (only 12 Featured out of ${allJobs.length})!`);

  // 1. Save all jobs to JSON for static build & fast client fallback
  const jsonPath = path.resolve(__dirname, '..', 'data', 'all_jobs.json');
  fs.writeFileSync(jsonPath, JSON.stringify(allJobs, null, 2));
  console.log(`📁 Saved updated JSON database cache to: ${jsonPath}`);

  // 2. Sync to Supabase in batches of 100
  console.log('☁️ Syncing updated jobs to Supabase Cloud Database...');
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

  console.log('\n🎉 ALL 1,656 REALISTIC JOBS UPDATED IN JSON & SUPABASE!');
}

generateAndSeedJobs().catch((err) => {
  console.error('Fatal error during seeding:', err);
});
