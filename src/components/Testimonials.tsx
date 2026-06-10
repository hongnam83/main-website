'use client';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ArrowRight, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, collection, getDocs } from '../localDB';
import { testimonials as defaultTestimonials } from '../data/testimonials';

export default function Testimonials() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'testimonials'));
        const items: any[] = [];
        if (querySnapshot.docs) {
          querySnapshot.docs.forEach((doc: any) => {
            items.push({ id: doc.id, ...doc.data() });
          });
        }
        
        // Sort by order/createdAt
        items.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        
        if (items.length > 0) {
          setTestimonials(items);
        } else {
           setTestimonials(defaultTestimonials);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setTestimonials(defaultTestimonials);
      }
      setLoading(false);
    };

    fetchTestimonials();

    const handleUpdate = () => {
      fetchTestimonials();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('localDB_updated', handleUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('localDB_updated', handleUpdate);
      }
    };
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials]);

  if (loading || testimonials.length === 0) {
    return null; // or a loading skeleton
  }

  return (
    <>
    <section className="py-12 md:py-16 lg:py-20 bg-brand-900 text-white overflow-hidden relative" id="testimonials">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Tiêu đề nằm trên cùng */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-brand-300 font-semibold tracking-wider uppercase text-sm mb-3">{t("Hơn cả sự hài lòng")}</h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            {t("Lời tâm tình từ")} <br className="hidden md:block" /> <span className="font-serif italic font-normal text-brand-100">{t("Đồng Niềng")}</span>
          </h3>
        </div>

        {/* Bố cục 5/5 -> 1/2 và 1/2 */}
        <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full max-w-6xl mx-auto">
          
          <div className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-[380px] rounded-[2rem] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                src={testimonials[currentIndex].image}
                alt="Khách hàng"
                className="w-full h-full object-cover absolute inset-0"
              />
            </AnimatePresence>
          </div>

          <div className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-[380px] flex">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 md:p-8 rounded-[2rem] relative flex flex-col justify-center w-full"
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5" strokeWidth={1} />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  {(testimonials[currentIndex].name || testimonials[currentIndex].customerName) && (
                     <div className="text-white/80 font-medium italic border-b border-white/20 pb-0.5">
                       {testimonials[currentIndex].name || testimonials[currentIndex].customerName}
                     </div>
                  )}
                </div>
                
                <p className="text-brand-50 text-lg md:text-xl leading-relaxed italic relative z-10 flex-grow">
                  &quot;{t(testimonials[currentIndex].content)}&quot;
                </p>

                <div className="mt-6 flex flex-col xl:flex-row items-center xl:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center w-full xl:w-auto">
                    <button 
                      onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
                      aria-label="Xem nhận xét trước"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {testimonials.map((_, i) => (
                        <button 
                          key={i} 
                          onClick={() => setCurrentIndex(i)}
                          className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-brand-400' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                          aria-label={`Nhận xét ${i + 1}`}
                        />
                      ))}
                    </div>
                    <button 
                      onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
                      aria-label="Xem nhận xét tiếp theo"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  <Link
                    href={testimonials[currentIndex].productId ? `/product/${testimonials[currentIndex].productId}` : `/products`}
                    className="group flex flex-row items-center gap-2 text-brand-300 hover:text-brand-100 transition-colors font-medium text-base md:text-lg w-full xl:w-auto justify-center xl:justify-end text-center xl:text-right"
                  >
                    <span>
                      {t('Xem thêm về')} <span className="font-bold underline underline-offset-4">{testimonials[currentIndex].productName || testimonials[currentIndex].product || 'Sản phẩm FURANO'}</span>
                    </span>
                    <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
    <div className="py-12 bg-white flex justify-center w-full relative z-10">
      <Link
        href="/products"
        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-amber-400 hover:bg-amber-300 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200 uppercase tracking-wide gap-2"
      >
        {t('Khám phá thêm')}
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
    </>
  );
}
