import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'ClinicStaffJobs | US Dental & Healthcare Clinic Job Board',
  description: 'Find dental hygienist, dental assistant, medical assistant, physical therapy, optician, and dermatology clinic jobs across all 52 US states. 100% free for job seekers and clinics.',
  keywords: [
    'dental hygienist jobs',
    'medical assistant jobs',
    'dental assistant jobs',
    'physical therapy assistant jobs',
    'clinic jobs USA',
    'private practice healthcare jobs'
  ],
  openGraph: {
    title: 'ClinicStaffJobs | US Dental & Healthcare Clinic Job Board',
    description: 'Search verified dental and medical clinic jobs with clear hourly pay across all 52 US states.',
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
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
