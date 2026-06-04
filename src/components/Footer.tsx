'use client';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import FuranoLogo from './FuranoLogo';
import { useState, useEffect } from 'react';
import { db, doc, getDoc } from '../localDB';

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.61-5.66-.21-3.07 1.87-5.91 4.83-6.71 1.38-.37 2.83-.3 4.17.24v4.06c-1.04-.42-2.31-.38-3.23.27-1.14.77-1.51 2.39-.8 3.56.63 1.05 1.92 1.54 3.07 1.25 1.17-.28 1.95-1.28 2.05-2.48.06-3.79.03-7.59.04-11.38V.02z" />
  </svg>
);

export default function Footer() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists()) {
          setSettings(snap.data());
        }
      } catch (err) {}
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-brand-50 text-gray-600 pt-20 pb-10 border-t border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <FuranoLogo className="w-auto h-12" />
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              {t(settings.footerDescription || "Thương hiệu dược mỹ phẩm hàng đầu cung cấp giải pháp chăm sóc toàn diện chuẩn y khoa thiết kế riêng cho người niềng răng tại Việt Nam.")}
            </p>
            <div className="flex gap-4">
              <a href={settings.facebookLink || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white hover:bg-brand-600 hover:text-white flex items-center justify-center transition-colors text-gray-500 shadow-sm">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={settings.instagramLink || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white hover:bg-brand-600 hover:text-white flex items-center justify-center transition-colors text-gray-500 shadow-sm">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={settings.tiktokLink || "https://tiktok.com"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white hover:bg-brand-600 hover:text-white flex items-center justify-center transition-colors text-gray-500 shadow-sm">
                <TiktokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gray-900 font-bold mb-6 text-lg">{t("Liên Hệ")}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <span>{t(settings.address || "Chung cư Hoàng Dương, Số 50, Ngõ 83, đường Ngọc Hồi, Yên Sở, Hà Nội")}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <span>{settings.phone || "1900 6868 (8:00 - 22:00)"}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                <span>{settings.email || "cskh@sabaicare.vn"}</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-bold mb-6 text-lg">{t("Hỗ Trợ Khách Hàng")}</h4>
            <ul className="space-y-3 text-sm flex flex-col">
              <li><Link href="/shipping-policy" className="hover:text-brand-800 transition-colors">{t("Chính sách vận chuyển")}</Link></li>
              <li><Link href="/return-policy" className="hover:text-brand-800 transition-colors">{t("Chính sách đổi trả & hoàn tiền")}</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-brand-800 transition-colors">{t("Chính sách bảo mật thông tin")}</Link></li>
              <li><Link href="/shopping-guide" className="hover:text-brand-800 transition-colors">{t("Hướng dẫn mua hàng")}</Link></li>
              <li><Link href="/order-tracking" className="hover:text-brand-800 transition-colors">{t("Tra cứu đơn hàng")}</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-gray-900 font-bold mb-6 text-lg">{t("Sản Phẩm")}</h4>
            <ul className="space-y-3 text-sm flex flex-col">
              <li><Link href="/products" className="hover:text-brand-800 transition-colors">{t("Chăm Sóc Khi Niềng")}</Link></li>
              <li><Link href="/products" className="hover:text-brand-800 transition-colors">{t("Chăm Sóc Sau Niềng (Duy Trì)")}</Link></li>
              <li><Link href="/products" className="hover:text-brand-800 transition-colors">{t("Trắng Răng & Khử Mùi")}</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-brand-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {t("CÔNG TY TNHH FURANO VN. All rights reserved.")}</p>
          <div className="flex gap-2 items-center">
            <div className="px-2 py-1 bg-white rounded text-gray-600 font-bold text-[10px] shadow-sm">VISA</div>
            <div className="px-2 py-1 bg-white rounded text-gray-600 font-bold text-[10px] shadow-sm">Mastercard</div>
            <div className="px-2 py-1 bg-white rounded text-gray-600 font-bold text-[10px] shadow-sm">MoMo</div>
            <div className="px-2 py-1 bg-white rounded text-gray-600 font-bold text-[10px] shadow-sm">VNPay</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
