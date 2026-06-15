'use client';

import { ReactNode } from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import FloatingContact from '@/src/components/FloatingContact';
import BackToTop from '@/src/components/BackToTop';
import ScrollToTop from '@/src/components/ScrollToTop';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-50 selection:bg-brand-200 selection:text-brand-900 font-sans flex flex-col">
      <Header />
      <ScrollToTop />
      <div className="flex-grow">
        {children}
      </div>
      <FloatingContact />
      <BackToTop />
      <Footer />
    </div>
  );
}
