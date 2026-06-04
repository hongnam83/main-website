'use client';
import Products from '../components/Products';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import SEO from '../components/SEO';

export default function ProductsPage() {
  const settings = useSiteSettings();
  const { t } = useTranslation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <main className="pt-24 min-h-screen">
      <SEO 
        title={t("Sản phẩm chăm sóc răng miệng chuyên biệt")}
        description={t("Khám phá các dòng sản phẩm chăm sóc răng miệng chuyên biệt từ Furano dành cho người chỉnh nha.")}
      />
      {settings?.productsCoverImage && (
        <div className="w-full h-48 md:h-64 lg:h-80 relative overflow-hidden mb-8">
           <img src={settings.productsCoverImage} alt={t("Sản phẩm")} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
             <h1 className="text-3xl md:text-5xl font-bold text-white tracking-widest uppercase">{t("Sản Phẩm")}</h1>
           </div>
        </div>
      )}
      <Products />
    </main>
  );
}
