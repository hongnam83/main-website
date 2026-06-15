'use client';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const PageLayout = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen pt-32 pb-24 bg-gray-50 flex items-center justify-center">
      <div className="max-w-3xl w-full px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-800 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("Quay lại trang chủ")}
        </Link>
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
          <div className="prose prose-brand max-w-none text-gray-600">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ShippingPolicyPage = () => {
  const { t } = useTranslation();
  return (
    <PageLayout title={t("Chính sách vận chuyển")}>
      <p>{t("Cảm ơn quý khách đã tin tưởng và mua sắm tại FURANO. Chúng tôi cam kết mang đến dịch vụ tốt nhất cho bạn.")}</p>
      <h3>{t("1. Thời gian giao hàng")}</h3>
      <ul>
        <li>{t("Nội thành Hà Nội & TP.HCM: 1-2 ngày làm việc.")}</li>
        <li>{t("Các tỉnh thành khác: 3-5 ngày làm việc.")}</li>
      </ul>
      <h3>{t("2. Chi phí vận chuyển")}</h3>
      <p>{t("Miễn phí vận chuyển cho đơn hàng từ 500,000 VND. Với đơn hàng dưới 500,000 VND, phí vận chuyển đồng giá 30,000 VND.")}</p>
    </PageLayout>
  );
};

export const ReturnPolicyPage = () => {
  const { t } = useTranslation();
  return (
    <PageLayout title={t("Chính sách đổi trả & hoàn tiền")}>
      <p>{t("FURANO luôn đảm bảo quyền lợi tốt nhất cho khách hàng.")}</p>
      <h3>{t("1. Điều kiện đổi trả")}</h3>
      <ul>
        <li>{t("Sản phẩm bị lỗi do nhà sản xuất (hư hỏng bao bì, hết hạn sử dụng...).")}</li>
        <li>{t("Sản phẩm chưa qua sử dụng, còn nguyên tem mác.")}</li>
        <li>{t("Thời gian yêu cầu đổi trả: Trong vòng 7 ngày kể từ khi nhận hàng.")}</li>
      </ul>
      <h3>{t("2. Quy trình đổi trả")}</h3>
      <p>{t("Vui lòng liên hệ hotline 1900 6868 hoặc email cskh@sabaicare.vn để được hướng dẫn chi tiết.")}</p>
    </PageLayout>
  );
};

export const PrivacyPolicyPage = () => {
  const { t } = useTranslation();
  return (
    <PageLayout title={t("Chính sách bảo mật thông tin")}>
      <p>{t("Chúng tôi tôn trọng và cam kết bảo mật thông tin cá nhân của người dùng.")}</p>
      <h3>{t("Mục đích thu thập thông tin")}</h3>
      <p>{t("Chúng tôi chỉ thu thập thông tin (họ tên, SĐT, địa chỉ) nhằm mục đích xử lý đơn hàng và hỗ trợ khách hàng tốt nhất.")}</p>
      <h3>{t("Cam kết bảo mật")}</h3>
      <p>{t("FURANO cam kết không chia sẻ dữ liệu khách hàng cho bất kỳ bên thứ 3 nào sử dụng cho mục đích thương mại.")}</p>
    </PageLayout>
  );
};

export const ShoppingGuidePage = () => {
  const { t } = useTranslation();
  return (
    <PageLayout title={t("Hướng dẫn mua hàng")}>
      <p>{t("Mua hàng tại FURANO rất đơn giản với các bước sau:")}</p>
      <ol>
        <li>{t("Truy cập website và lựa chọn sản phẩm bạn cần mua.")}</li>
        <li>{t("Bấm 'Thêm vào giỏ hàng' hoặc liên hệ nhận tư vấn.")}</li>
        <li>{t("Điền thông tin nhận hàng và chọn phương thức thanh toán.")}</li>
        <li>{t("Xác nhận đơn hàng và chờ nhận hàng từ đơn vị vận chuyển.")}</li>
      </ol>
      <p>{t("Lưu ý: Bạn luôn có thể liên hệ tổng đài của chúng tôi để đặt hàng trực tiếp.")}</p>
    </PageLayout>
  );
};

export const OrderTrackingPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-32 pb-24 bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("Tra cứu đơn hàng")}</h1>
          <p className="text-gray-600 mb-6 text-sm">{t("Vui lòng nhập mã đơn hàng hoặc số điện thoại đã đặt hàng để kiểm tra trạng thái.")}</p>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder={t("Mã đơn hàng / Số điện thoại")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button className="w-full py-3 bg-brand-800 text-white font-bold rounded-xl hover:bg-brand-900 transition-colors">
              {t("Tra cứu")}
            </button>
          </div>
          <div className="mt-6">
            <Link href="/" className="text-sm text-brand-800 hover:underline">
              {t("Quay lại trang chủ")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
