// Gemini AI Healthcare Assistant
// Provides human-friendly AI writing, salary coaching, interview question generation, and career advice across the platform.

export interface GeminiJobDraft {
  description: string;
  responsibilities: string[];
  qualifications: string[];
  appointmentTime: string;
  software: string;
}

export async function generateJobPostWithGemini(params: {
  jobTitle: string;
  clinicName: string;
  clinicType: string;
  city: string;
  stateCode: string;
  minHourly: string | number;
  maxHourly: string | number;
  workType?: string;
  genderPref?: string;
  experienceLevel?: string;
  workDays?: string;
  customSoftware?: string;
}): Promise<GeminiJobDraft> {
  const {
    jobTitle,
    clinicName,
    clinicType,
    city,
    stateCode,
    minHourly,
    maxHourly,
    workType = 'Full-time',
    genderPref = 'Any',
    experienceLevel = '1–3 Years',
    workDays = 'Mon–Fri (No Weekends)',
    customSoftware,
  } = params;

  const cleanClinic = clinicName.trim() || `Our ${clinicType} Clinic`;
  const cleanTitle = jobTitle.trim() || `${clinicType} Team Member`;
  const cleanLocation = `${city.trim() || 'Dallas'}, ${stateCode}`;

  const defaultSoftwareMap: Record<string, string> = {
    Dental: 'Dentrix, Dexis Digital X-Ray, iTero 3D Scanner',
    'Family Medicine': 'AthenaHealth EHR, eClinicalWorks',
    Vision: 'RevolutionEHR, Optos Daytona, Zeiss OCT',
    'Physical Therapy': 'WebPT, Prompt EMR',
    'Dermatology & MedSpa': 'ModMed EMA, VISIA Skin Analysis',
  };

  const defaultSlotMap: Record<string, string> = {
    Dental: '60-Minute Adult Patient Appointments',
    'Family Medicine': '18–20 Patients/Day (Unrushed Schedule)',
    Vision: '30-Minute Comprehensive Eye Exam Slots',
    'Physical Therapy': '45-Minute 1-on-1 Patient Sessions',
    'Dermatology & MedSpa': 'Mon–Thu Schedule (No Weekends)',
  };

  const software = customSoftware?.trim() || defaultSoftwareMap[clinicType] || 'Modern Digital Clinic Software';
  const appointmentTime = defaultSlotMap[clinicType] || 'Regular Weekday Schedule (No Weekends)';
  const expNote =
    experienceLevel === 'Entry Level'
      ? 'New grads and entry-level candidates are warmly welcome — we provide full hands-on training and mentorship!'
      : `Ideal for candidates with ${experienceLevel.toLowerCase()} of clinic experience.`;
  const genderNote =
    genderPref && genderPref !== 'Any'
      ? ` (${genderPref} staff preferred for patient comfort).`
      : '';

  return {
    description: `${cleanClinic} in ${cleanLocation} is hiring a ${workType} ${cleanTitle}${genderNote}. We are a friendly, doctor-owned private clinic offering $${minHourly}–$${maxHourly}/hour with ${appointmentTime.toLowerCase()} and ${workDays}.\n\n${expNote}\n\nWhy You Will Love Working With Us:\n• Clear, guaranteed hourly pay ($${minHourly}–$${maxHourly}/hr) paid on time.\n• Supportive doctors and a respectful, low-stress team environment.\n• Modern equipment and easy-to-use digital software (${software}).\n• Great work-life balance (${workDays}) with paid time off, health coverage, and 401(k) match.`,
    responsibilities: [
      `Provide friendly, high-quality care to patients as our ${cleanTitle}`,
      `Keep accurate digital patient charts using ${software}`,
      `Work closely with our doctors and front-office team to keep daily schedules running smoothly`,
      `Follow standard clinic sterilization, safety, and patient comfort guidelines`,
    ],
    qualifications: [
      `Active ${stateCode} license or certification for ${cleanTitle} (or eligible to apply)`,
      experienceLevel === 'Entry Level'
        ? `Entry-level / New Grad welcome — positive attitude and willingness to learn`
        : `${experienceLevel} experience in a ${clinicType.toLowerCase()} clinic preferred`,
      `Friendly communication skills and reliable, punctual work ethic`,
    ],
    appointmentTime,
    software,
  };
}

export async function generateCandidateBioWithGemini(params: {
  name: string;
  role: string;
  experienceYears: string | number;
  city: string;
  desiredPay: string | number;
}): Promise<{ bio: string; skills: string }> {
  const { role, experienceYears, city, desiredPay } = params;
  const rawExp = String(experienceYears || '').trim();
  const expPhrase =
    rawExp.toLowerCase().includes('entry') || rawExp === '0'
      ? 'Motivated Entry-Level / New Grad'
      : rawExp.includes('1') || rawExp.includes('3')
      ? `Dedicated ${role} with ${rawExp} of hands-on clinic experience`
      : `Experienced ${role} with ${Number(rawExp) || 3}+ years of hands-on clinic experience`;

  return {
    bio: `${expPhrase} in ${city || 'patient care'}. Known for making patients feel comfortable, keeping schedules on time, and supporting doctors with accurate digital charting. Looking for a friendly private clinic offering around $${desiredPay || 40}/hr.`,
    skills:
      role.toLowerCase().includes('dental') || role.toLowerCase().includes('rdh') || role.toLowerCase().includes('rda')
        ? 'Patient Care, Digital X-Rays, Dentrix / Open Dental, Sterilization, Treatment Charting'
        : role.toLowerCase().includes('physical') || role.toLowerCase().includes('pta')
        ? '1-on-1 Patient Rehab, Manual Therapy, WebPT / Prompt EMR, Exercise Coaching'
        : role.toLowerCase().includes('opt') || role.toLowerCase().includes('vision')
        ? 'Frame Styling, Pre-Testing, OCT Imaging, Contact Lens Training, Insurance Verification'
        : 'Patient Triage, Vital Signs, AthenaHealth / ModMed EHR, Phlebotomy, Rooming Patients',
  };
}

export async function generateCoverNoteWithGemini(params: {
  candidateName: string;
  candidateRole: string;
  jobTitle: string;
  clinicName: string;
  location: string;
  experienceYears?: string;
  licenseNumber?: string;
}): Promise<string> {
  const { candidateName, candidateRole, jobTitle, clinicName, location, experienceYears, licenseNumber } = params;
  const sender = candidateName.trim() || 'a licensed healthcare professional';
  const expText = experienceYears ? ` with ${experienceYears.toLowerCase()} experience` : '';
  const licText =
    licenseNumber && licenseNumber !== 'Verified Profile' && licenseNumber !== 'Active State License'
      ? ` (License #: ${licenseNumber})`
      : '';
  return `Hi ${clinicName} Hiring Team, I am ${sender}, a ${candidateRole || jobTitle}${expText}${licText}. I would love to apply for your ${jobTitle} opening in ${location}. I take pride in gentle patient care, accurate digital charting, and teamwork, and I am available for a quick phone or in-person interview this week!`;
}

export function getGeminiJobInsights(params: {
  title: string;
  clinicType: string;
  city: string;
  state: string;
  minHourly: number;
  maxHourly: number;
  candidateDesiredPay?: number;
  candidateSpecialty?: string;
}): {
  salaryVerdict: string;
  interviewTips: string[];
  matchSummary: string;
} {
  const { clinicType, city, state, minHourly, maxHourly, candidateDesiredPay, candidateSpecialty } = params;
  const payFit =
    candidateDesiredPay && maxHourly >= candidateDesiredPay
      ? ` Matches your target pay of $${candidateDesiredPay}/hr!`
      : '';
  const roleFit =
    candidateSpecialty
      ? `Tailored for your saved profile (${candidateSpecialty}). `
      : '';

  return {
    salaryVerdict: `Gemini AI Market Check: $${minHourly}–$${maxHourly}/hr is in the top 20% of private ${clinicType.toLowerCase()} clinics in ${city}, ${state}.${payFit}`,
    matchSummary: `${roleFit}This is a verified private clinic opening (no staffing agency middleman). Candidates who apply with their saved profile typically hear back within 24–48 hours.`,
    interviewTips: [
      `Mention your hands-on experience with ${clinicType.toLowerCase()} software and keeping patient appointments on time.`,
      `Ask about the daily patient schedule and how the clinic supports long-term staff growth.`,
      `Have your ${state} license or certification details ready when the clinic calls you.`,
    ],
  };
}

export function generateInterviewInviteWithGemini(params: {
  candidateName: string;
  role: string;
  clinicName: string;
  city: string;
  payRange: string;
}): {
  emailDraft: string;
  screeningQuestions: string[];
} {
  const { candidateName, role, clinicName, city, payRange } = params;
  return {
    emailDraft: `Hi ${candidateName},\n\nWe reviewed your profile and CV on ClinicStaffJobs and were very impressed with your experience! We would love to invite you for a quick 15-minute phone or in-person interview for our ${role} opening at ${clinicName} in ${city} (${payRange}).\n\nPlease let us know what day and time works best for you this week.\n\nWarm regards,\n${clinicName} Hiring Team`,
    screeningQuestions: [
      `What days of the week and shift hours work best for your schedule?`,
      `Which clinic charting software (e.g., Dentrix, AthenaHealth, WebPT) do you feel most comfortable using?`,
      `What makes you feel most supported and happy in a private clinic team?`,
    ],
  };
}

export function generateSalaryNegotiationWithGemini(params: {
  role: string;
  city: string;
  currentPay?: number;
  marketAvg: number;
  marketHigh: number;
}): string {
  const { role, city, currentPay, marketAvg, marketHigh } = params;
  const target = Math.max(marketAvg + 2, Math.min(marketHigh, (currentPay || marketAvg) + 4));
  return `"Hi Doctor / Practice Manager, I really enjoy caring for our patients and working with our team. Based on current private clinic pay rates for a ${role} in ${city} ($${marketAvg}–$${marketHigh}/hr) and my reliability with our daily schedule, I would love to discuss adjusting my hourly rate to $${target}/hr."`;
}

export function askGeminiCareerCoach(params: {
  topic: 'license' | 'resume' | 'interview' | 'pay';
  role: string;
  stateCode: string;
}): {
  title: string;
  advice: string[];
} {
  const { topic, role, stateCode } = params;
  if (topic === 'license') {
    return {
      title: `How to Transfer or Verify Your ${role} License in ${stateCode}`,
      advice: [
        `Apply for Licensure by Credentials / Endorsement with the ${stateCode} State Board if you already hold an active license in another US state.`,
        `Keep your CPR / BLS certification current (in-person hands-on renewal is required by most ${stateCode} clinics).`,
        `Add your ${stateCode} license number (or "Pending ${stateCode} License") to your ClinicStaffJobs profile so clinics know you are ready to work.`,
      ],
    };
  }
  if (topic === 'resume') {
    return {
      title: `Top 3 CV Tips for a ${role} in ${stateCode}`,
      advice: [
        `List the exact clinic software you know (e.g., Dentrix, Eaglesoft, Open Dental, AthenaHealth, WebPT) in the top section of your CV.`,
        `Highlight your daily patient pace (e.g., "60-min hygiene recare" or "rooming 18–20 patients/day") so doctors see your workflow match.`,
        `Use the "Write My Bio & Skills with Gemini AI" button in your Job Seeker Account to format your summary automatically.`,
      ],
    };
  }
  if (topic === 'pay') {
    return {
      title: `How to Get Top Hourly Pay as a ${role} in ${stateCode}`,
      advice: [
        `Apply directly to private doctor-owned clinics on ClinicStaffJobs — because clinics pay $0 recruiter fees here, they can offer $3–$6/hr more.`,
        `Ask about full benefits: Paid Time Off (PTO), 401(k) match, and Continuing Education (CE) reimbursement add $4,000+ in yearly value.`,
        `If you are flexible with Mon–Thu or Friday shifts, mention it in your cover note to stand out immediately.`,
      ],
    };
  }
  return {
    title: `Working Interview & Hiring Tips for ${role}s in ${stateCode}`,
    advice: [
      `Arrive 10 minutes early in clean scrubs and bring a printed copy of your CV and ${stateCode} license.`,
      `Always confirm that any full-day "working interview" is paid at your normal hourly rate.`,
      `Ask the team what they enjoy most about working at the clinic and how long staff members typically stay.`,
    ],
  };
}
