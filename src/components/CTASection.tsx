'use client';
import { motion } from 'motion/react';
import { Mail, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CTASection() {
  const { t } = useTranslation();
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Background graphics */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600 rounded-full blur-[100px] opacity-40"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-400 rounded-full blur-[100px] opacity-20"></div>

          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t("Sẵn sàng tỏa sáng")} <br className="hidden md:block"/> {t("với nụ cười mới?")}
            </h2>
            <p className="text-brand-100 text-lg mb-0 font-light">
              {t("Đăng ký nhận cẩm nang chăm sóc răng niềng chuẩn nha khoa và voucher giảm giá 15% cho đơn hàng đầu tiên.")}
            </p>
          </div>

          <div className="relative z-10 w-full max-w-md">
            <form className="bg-white p-2 rounded-full shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow flex items-center pl-4">
                <Mail className="w-5 h-5 text-gray-400 absolute" />
                <input 
                  type="email" 
                  placeholder={t("Nhập email của bạn...")} 
                  className="w-full py-3 pl-8 pr-4 text-gray-900 bg-transparent border-none focus:ring-0 outline-none"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-brand-800 hover:bg-brand-900 text-white font-medium rounded-full transition-colors whitespace-nowrap"
              >
                {t("Nhận Quà Ngay")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </form>
            <p className="text-brand-200 text-xs mt-4 text-center md:text-left">
              {t("*Tất cả thông tin được bảo mật và không spam.")}
            </p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
