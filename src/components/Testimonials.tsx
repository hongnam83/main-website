'use client';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories } from '../data/products';

const allProducts = categories.flatMap(c => c.products);

const defaultContents = [
  "Trước kia mình rất sợ ám vàng mắc cài, đánh răng thì hay chảy máu nướu. Từ khi chuyển sang dùng sản phẩm này của FURANO, nướu khỏe hẳn, đánh răng thơm lâu dã man. Một trải nghiệm hoàn toàn khác biệt so với các sản phẩm trước đây.",
  "Sản phẩm này của FURANO thực sự là 'chân ái'. Đi làm chỉ cần thao tác tóm gọn là đã sạch bong, trong veo không mùi hôi. Highly recommend cho các bạn xài niềng nhẹ nhõm hẳn đi vài phần.",
  "Cháu nhà tôi tuổi dậy thì lại lười vệ sinh mắc cài, nha sĩ cứ dọa sâu răng hoài. Mua sản phẩm này về, cháu thích nên tự giác luôn khỏi phải nhắc. Tốn kém xíu nhưng yên tâm.",
  "Dùng rất thích, lông bàn chải hay đầu vòi đều thiết kế cực kì êm ái cho người niềng. Không lo bị xước nướu hay tồn đọng thức ăn nữa.",
  "Mình khá nhạy cảm với mùi vị nhưng dòng sản phẩm này hương vị siêu dễ chịu. Cảm giác dùng xong khoang miệng thư giãn hẳn. Bạn nào đang niềng nên thử nhé."
];

const defaultImages = [
  "https://images.unsplash.com/photo-1598256989454-99bbedc56b71?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
];

const testimonials = allProducts.map((product, index) => ({
  content: defaultContents[index % defaultContents.length],
  image: defaultImages[index % defaultImages.length],
  productId: product?.id,
  productName: product?.name
}));

export default function Testimonials() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
                
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                
                <p className="text-brand-50 text-lg md:text-xl leading-relaxed italic relative z-10 flex-grow">
                  "{t(testimonials[currentIndex].content)}"
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <button 
                      onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Xem nhận xét trước"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <div className="flex items-center gap-2">
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
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Xem nhận xét tiếp theo"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  <Link
                    href={`/product/${testimonials[currentIndex].productId}`}
                    className="group inline-flex items-center gap-2 text-brand-300 hover:text-brand-100 transition-colors font-medium text-base md:text-lg flex-1 md:justify-end"
                  >
                    <span className="line-clamp-2 text-left md:text-right">
                      {t('Xem thêm về')} <span className="font-bold underline underline-offset-4">{testimonials[currentIndex].productName}</span>
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
