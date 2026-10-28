import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ClinicStaffJobs | US Private Healthcare & Dental Direct Hiring Network',
  description: 'The #1 direct hiring marketplace for US independent dental, medical, optometry, and physical therapy practices. Mandatory wage transparency and zero spam recruiters.',
  keywords: [
    'dental hygienist jobs',
    'medical assistant jobs',
    'dental assistant jobs',
    'physical therapy aide',
    'clinic jobs USA',
    'private practice healthcare hiring'
  ],
  openGraph: {
    title: 'ClinicStaffJobs | Private Clinic Direct Hiring Network',
    description: 'Find high-paying dental, medical assistant, and clinic staff jobs with 100% mandatory wage transparency.',
    url: 'https://clinicstaffjobs.com',
    siteName: 'ClinicStaffJobs',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
