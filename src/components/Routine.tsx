'use client';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

export default function Routine() {
  const { t } = useTranslation();
  const settings = useSiteSettings();

  const steps = [
    {
      num: "01",
      title: t("Chải Sạch Mảng Bám"),
      desc: t("Sử dụng bàn chải rãnh V/chữ U cùng Kem Đánh Răng FURANO 7 Benefits đánh bay thức ăn thừa quang mắc cài."),
      img: settings?.routineStep1Image || "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=500"
    },
    {
      num: "02",
      title: t("Làm Sạch Kẽ Răng"),
      desc: t("Dùng bàn chải kẽ chuyên dụng len lỏi qua dây cung, lấy đi mảng bám mỏng nhất mà bàn chải thường không chạm tới."),
      img: settings?.routineStep2Image || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=500"
    },
    {
      num: "03",
      title: t("Bảo Vệ Xuyên Suốt"),
      desc: t("Kết thúc bằng Nước súc miệng Cherry Fresh. Tiêu diệt vi khuẩn, mang lại hơi thở thơm mát và củng cố men răng cả ngày dài."),
      img: settings?.routineStep3Image || "https://images.unsplash.com/photo-1559598467-f8b76c8105d0?auto=format&fit=crop&q=80&w=500"
    }
  ];

  return (
    <section className="py-24 bg-white" id="routine">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-brand-800 font-semibold tracking-wider uppercase text-sm mb-3">{t("Tối ưu hoá quy trình")}</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t("Chu trình chuẩn y khoa")} <br /> <span className="font-serif italic text-brand-800">{t("3 phút vàng")}</span>
          </h3>
          <p className="text-gray-600 text-lg">
            {t("Chỉ với 3 bước đơn giản mỗi sáng và tối, bạn hoàn toàn làm chủ sức khoẻ răng miệng dù đang mang hàng tá khí cụ.")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-[40%] left-0 w-full h-0.5 bg-brand-100 -z-10 translate-y-[-50%]"></div>
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="text-center group"
            >
              <div className="relative w-56 h-56 mx-auto mb-8 rounded-full bg-gradient-to-tr from-brand-100 to-brand-50 p-2 shadow-sm group-hover:shadow-2xl group-hover:shadow-brand-500/20 group-hover:-translate-y-3 transition-all duration-500">
                <img 
                  src={step.img} 
                  alt={step.title} 
                  className="w-full h-full object-cover rounded-full border-4 border-white"
                />
                <div className="absolute top-2 right-2 w-14 h-14 bg-gradient-to-br from-brand-700 to-brand-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg border-4 border-white group-hover:scale-110 transition-transform">
                  {step.num}
                </div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-700 transition-colors">{step.title}</h4>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
