import { Job } from '@/data/jobs';

export function generateJobPostingSchema(job: Job, baseUrl: string = 'https://clinicstaffjobs.com') {
  return {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: job.clinicName,
      value: job.id
    },
    datePosted: job.postedDate,
    validThrough: new Date(new Date(job.postedDate).getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: job.workType === 'Full-time' ? 'FULL_TIME' : job.workType === 'Part-time' ? 'PART_TIME' : 'TEMPORARY',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.clinicName,
      sameAs: job.applyUrl || baseUrl
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${job.clinicName} Outpatient Suite`,
        addressLocality: job.city,
        addressRegion: job.state,
        postalCode: job.zipCode,
        addressCountry: 'US'
      }
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.minHourly,
        maxValue: job.maxHourly,
        unitText: 'HOUR'
      }
    },
    responsibilities: job.responsibilities.join('; '),
    qualifications: job.qualifications.join('; '),
    directApply: true,
    url: `${baseUrl}/jobs/${job.id}`
  };
}
