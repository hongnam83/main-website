'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-50" suppressHydrationWarning>
      <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
      <p className="mb-6">Could not find requested resource</p>
      <Link href="/" className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
        Return Home
      </Link>
    </div>
  );
}
