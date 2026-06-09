'use client';

import { ReactNode } from 'react';
import { SiteSettingsProvider } from '@/src/contexts/SiteSettingsContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <SiteSettingsProvider>
        {children}
      </SiteSettingsProvider>
    </I18nextProvider>
  );
}
