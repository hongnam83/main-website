'use client';

import { ReactNode } from 'react';
import { SiteSettingsProvider } from '@/src/contexts/SiteSettingsContext';
import '../src/i18n';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SiteSettingsProvider>
      {children}
    </SiteSettingsProvider>
  );
}
