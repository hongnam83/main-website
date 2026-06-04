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

export default function SEO({ title, description, schema }: SEOProps) {
  if (typeof document !== 'undefined' && title) {
    document.title = title.includes('FURANO') ? title : `${title} | FURANO - Chăm sóc hàm răng chuyên biệt`;
  }

  return schema ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  ) : null;
}
