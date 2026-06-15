'use client';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: any;
}

import { useEffect } from 'react';

export default function SEO({ title, description, schema }: SEOProps) {
  useEffect(() => {
    if (typeof document !== 'undefined' && title) {
      document.title = title.includes('FURANO') ? title : `${title} | FURANO - Chăm sóc hàm răng chuyên biệt`;
    }
  }, [title]);

  return schema ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  ) : null;
}
