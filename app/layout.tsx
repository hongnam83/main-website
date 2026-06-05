import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'FURANO - Chuyên gia chăm sóc răng niềng',
  description: 'FURANO - Chuyên gia chăm sóc răng niềng',
  icons: {
    icon: '/favicon.svg',
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
