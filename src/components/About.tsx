'use client';
import { motion } from 'motion/react';
import { Target, Leaf, HeartPulse } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Target,
      title: t("Chuyên Biệt Hóa"),
      description: t("Formula được nghiên cứu dành riêng cho môi trường răng miệng phức tạp khi đeo mắc cài hay khay niềng Invisalign.")
    },
    {
      icon: Leaf,
      title: t("Thành Phần Tự Nhiên"),
      description: t("Kết hợp tinh chất Trà Xanh, Lô Hội, và Rau Má giúp làm dịu niêm mạc, giảm nhiệt miệng an toàn, lành tính.")
    },
    {
      icon: HeartPulse,
      title: t("Hiệu Quả Lâm Sàng"),
      description: t("Bảo vệ men răng, ngăn chặn vệt trắng (white spots) và viêm nướu - những nỗi ám ảnh lớn nhất của team niềng.")
    }
  ];

  return (
    <section className="py-24 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-brand-800 font-semibold tracking-wider uppercase text-sm mb-3">{t("Về FURANO")}</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {t("Thấu hiểu hành trình")} <br className="hidden sm:block" />
              <span className="font-serif italic text-brand-800">{t("kiến tạo nụ cười")}</span> {t("của bạn.")}
            </h3>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>
                {t("Niềng răng là một khoản đầu tư lớn cho tương lai, nhưng hành trình chạm đến nụ cười hoàn mỹ không hề dễ dàng. Thức ăn giắt vào mắc cài, nỗi lo sâu răng, viêm nướu, hay mùi hơi thở khó chịu là rào cản khiến bạn e ngại.")}
              </p>
              <p dangerouslySetInnerHTML={{__html: t("FURANO ra đời với sứ mệnh mang đến <strong>sự bảo vệ toàn diện và tinh tế nhất</strong>. Chúng tôi không chỉ bán kem đánh răng, chúng tôi cung cấp giải pháp, sự tự tin và sự an tâm tuyệt đối trong suốt quá trình chỉnh nha của bạn.")}} />
            </div>

            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              <div className="border-l-2 border-brand-200 pl-4">
                <p className="text-3xl font-bold text-gray-900 mb-1">98%</p>
                <p className="text-sm text-gray-500">{t("Khách hàng giảm hẳn tình trạng sưng nướu")}</p>
              </div>
              <div className="border-l-2 border-brand-200 pl-4">
                <p className="text-3xl font-bold text-gray-900 mb-1">7x</p>
                <p className="text-sm text-gray-500">{t("Làm sạch sâu hơn so với sản phẩm thông thường")}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-6"
          >
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4 p-6 bg-brand-50 rounded-2xl hover:bg-brand-100 transition-colors">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 text-brand-800">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
