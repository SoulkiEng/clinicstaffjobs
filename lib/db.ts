import { supabase } from './supabase';
import { SEED_JOBS, Job } from '@/data/jobs';

export async function getJobs(): Promise<Job[]> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return SEED_JOBS;
    }

    // Map snake_case DB columns to camelCase Job interface
    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      clinicName: d.clinic_name,
      clinicType: d.clinic_type,
      location: d.location,
      city: d.city,
      state: d.state,
      zipCode: d.zip_code,
      workType: d.work_type,
      minHourly: Number(d.min_hourly),
      maxHourly: Number(d.max_hourly),
      payPeriod: d.pay_period || 'hour',
      payComparison: d.pay_comparison,
      isFeatured: Boolean(d.is_featured),
      isUrgent: Boolean(d.is_urgent),
      verifiedActive: Boolean(d.verified_active),
      appointmentTime: d.appointment_time,
      softwareUsed: d.software_used || [],
      benefits: d.benefits || [],
      description: d.description,
      responsibilities: d.responsibilities || [],
      qualifications: d.qualifications || [],
      applyEmail: d.apply_email,
      applyUrl: d.apply_url,
      postedDate: d.created_at || new Date().toISOString()
    }));
  } catch (err) {
    console.error('Error fetching jobs from Supabase, using seed:', err);
    return SEED_JOBS;
  }
}

export async function insertJob(job: Partial<Job>) {
  const dbJob = {
    id: job.id || `job-${Date.now()}`,
    title: job.title,
    clinic_name: job.clinicName,
    clinic_type: job.clinicType,
    location: job.location,
    city: job.city || job.location?.split(',')[0]?.trim() || 'US',
    state: job.state || job.location?.split(',')[1]?.trim() || 'US',
    zip_code: job.zipCode || '00000',
    work_type: job.workType || 'Full-time',
    min_hourly: job.minHourly,
    max_hourly: job.maxHourly,
    pay_period: job.payPeriod || 'hour',
    pay_comparison: job.payComparison || '+15% Above City Avg',
    is_featured: Boolean(job.isFeatured),
    is_urgent: Boolean(job.isUrgent),
    verified_active: true,
    appointment_time: job.appointmentTime,
    software_used: job.softwareUsed || [],
    benefits: job.benefits || [],
    description: job.description,
    responsibilities: job.responsibilities || [],
    qualifications: job.qualifications || [],
    apply_email: job.applyEmail,
    apply_url: job.applyUrl
  };

  return await supabase.from('jobs').insert([dbJob]);
}

export async function submitApplication(appData: {
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateLicense?: string;
  experience?: string;
  desiredPay?: string;
  isVip?: boolean;
}) {
  return await supabase.from('applications').insert([
    {
      id: `app-${Date.now()}`,
      job_id: appData.jobId,
      candidate_name: appData.candidateName,
      candidate_email: appData.candidateEmail,
      candidate_phone: appData.candidatePhone,
      candidate_license: appData.candidateLicense,
      experience: appData.experience,
      desired_pay: appData.desiredPay,
      is_vip: Boolean(appData.isVip),
      status: 'Under Review'
    }
  ]);
}
