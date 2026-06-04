'use client';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import Link from 'next/link';

export default function Hero() {
  const { t } = useTranslation();
  const settings = useSiteSettings();

  return (
    <section className="relative pt-28 pb-10 lg:pt-24 lg:pb-4 lg:h-screen lg:min-h-[650px] flex items-center overflow-hidden bg-brand-50" id="home">
      {/* Abstract Background Element */}
      <div className="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-brand-200/50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-brand-300/40 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-6 items-center w-full">
          
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-800 font-medium text-sm mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span className="tracking-wide">{t('Chuyên gia chăm sóc răng niềng', 'Chuyên gia chăm sóc răng niềng')}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gray-900 mb-4 leading-[1.1]">
              {t('Nụ Cười Hoàn Mỹ')} <br />
              <span className="text-gradient font-serif italic text-5xl md:text-6xl xl:text-7xl pr-2">{t('Dành Riêng Cho')}</span><br />
              {t('Team Niềng Răng')}
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed max-w-lg">
              {t('Giải pháp chăm sóc toàn diện từ FURANO. Đánh bay mảng bám, ngăn ngừa viêm lợi và giữ nụ cười tự tin trong suốt thai kỳ chỉnh nha của bạn.')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-brand-800 hover:bg-brand-900 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {t('Xem Danh Mục Sản Phẩm', 'Xem Danh Mục Sản Phẩm')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a
                href="#routine"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-brand-800 bg-white border border-brand-200 hover:bg-brand-50 rounded-full transition-colors"
              >
                {t('Xem Chu Trình Chuẩn', 'Xem Chu Trình Chuẩn')}
              </a>
            </div>

            {/* Social Proof Mini */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200/60">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover object-center"
                    src={`https://images.unsplash.com/photo-${[
                      '1534528741775-53994a69daeb',
                      '1506794778202-cad84cf45f1d',
                      '1531746020798-e6953c6e8e04',
                      '1524250502761-1ac6f2e30d43'
                    ][i-1]}?auto=format&fit=crop&q=80&w=100&h=100`}
                    alt="Customer"
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-sm text-gray-600 font-medium whitespace-nowrap">
                  {t('Hơn')} <span className="text-gray-900 font-bold">10,000+</span> {t('khách hàng tin dùng')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-[600px] mx-auto lg:h-[calc(100vh-140px)] lg:max-h-[700px]"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-full bg-white border border-gray-100">
              <img
                src={settings.homeHeroImage || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800"}
                alt="Cô gái niềng răng tự tin mỉm cười"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
              
              {/* Floating Badge */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{t('Được nha sĩ khuyên dùng')}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{t('An toàn tuyệt đối cho men răng & mắc cài')}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
