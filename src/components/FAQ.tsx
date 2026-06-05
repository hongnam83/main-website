'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { db, collection, getDocs } from '../localDB';

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'faqs'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (data.length > 0) {
          setFaqs(data);
        }
      } catch (err) {
        // console.warn('Firebase fetch failed:', err);
      }
    };
    fetchFaqs();

    const handleUpdate = () => {
      fetchFaqs();
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

  const displayFaqs = faqs.length > 0 ? faqs : [
    {
      question: t("Sản phẩm FURANO có dùng được cho răng nhạy cảm không?"),
      answer: t("Hoàn toàn được. Công thức của chúng tôi không chứa chất mài mòn mạnh (low RDA), an toàn tuyệt đối cho men răng đang trong giai đoạn yếu ớt khi chịu quá trình kéo chỉnh của mắc cài.")
    },
    {
      question: t("Bao nhiêu lâu thì nên thay đổi bàn chải kẽ?"),
      answer: t("Với người đang niềng răng, nha sĩ khuyên nên làm vệ sinh bàn chải sau mỗi lần sử dụng và thay thế bàn chải/đầu bàn chải kẽ 2-3 tuần một lần để đảm bảo vệ sinh và hiệu quả làm sạch tốt nhất.")
    },
    {
      question: t("Viên sủi Invisalign có làm ố màu khay không?"),
      answer: t("Không. Viên sủi FURANO làm sạch bằng bọt khí O2 siêu nhỏ và các enzym diệt khuẩn, hoàn toàn không sử dụng chất nhuộm màu độc hại gây ảnh hưởng đến cấu trúc nhựa và độ trong suốt của khay niềng.")
    },
    {
      question: t("FURANO có hỗ trợ tư vấn chăm sóc cá nhân không?"),
      answer: t("Có. Đội ngũ chuyên viên của FURANO luôn sẵn sàng hỗ trợ bạn theo dõi tình trạng răng miệng và thiết kế chu trình chăm sóc riêng biệt. Hãy liên hệ với chúng tôi để được tư vấn miễn phí.")
    }
  ];

  return (
    <section className="py-24 bg-gray-50" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("Câu hỏi thường gặp")}</h2>
          <p className="text-gray-600">{t("Những thắc mắc phổ biến nhất của các Đồng Niềng.")}</p>
        </div>

        <div className="space-y-4">
          {displayFaqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-brand-800' : ''}`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
