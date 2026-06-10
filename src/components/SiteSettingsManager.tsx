'use client';
import { useState, useEffect } from 'react';
import { db, doc, getDoc, setDoc } from '../localDB';
import { compressImage } from '../lib/imageUtils';
import { supabase } from '../lib/supabase';
import { Map, Image as ImageIcon, Home, Settings as SettingsIcon, LayoutTemplate, Layers } from 'lucide-react';

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists()) {
          setSettings(snap.data());
        }
      } catch (err) {
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1200)); // Delay for UI state
      await setDoc(doc(db, 'settings', 'general'), settings, { merge: true });
      alert("Đã lưu cài đặt chung!");
    } catch (e) {
      // console.error(e);
      alert("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setSaving(true);
        
        // Tạo unique name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { data, error } = await supabase.storage.from('public_assets').upload(filePath, file);
        
        if (error) {
           console.error("Storage upload error:", error);
           // Fallback to base64 if storage bucket is not available yet
           const compressedDataUrl = await compressImage(file, 800, 0.8);
           handleChange(key, compressedDataUrl);
        } else {
           const { data: publicUrlData } = supabase.storage.from('public_assets').getPublicUrl(filePath);
           handleChange(key, publicUrlData.publicUrl);
        }
      } catch (err) {
        console.error('Lỗi khi xử lý ảnh', err);
      } finally {
        setSaving(false);
      }
    }
  };

  const renderImageField = (label: string, key: string, description?: string) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all hover:border-brand-200">
      <div className="mb-3">
        <label className="block text-base font-bold text-gray-800">{label}</label>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {settings[key] ? (
          <img src={settings[key]} alt="Settings Preview" className="w-56 h-32 object-cover rounded-lg border shadow-sm bg-gray-50 flex-shrink-0" />
        ) : (
          <div className="w-56 h-32 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-sm text-gray-400 flex-shrink-0">
            <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
            Chưa có ảnh
          </div>
        )}
        <div className="flex-1 space-y-3 w-full">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Đường dẫn ảnh (URL)</label>
            <input 
              type="text" 
              value={settings[key] || ''} 
              onChange={(e) => handleChange(key, e.target.value)} 
              className="w-full border p-2.5 rounded focus:ring-2 focus:ring-brand-500 text-sm bg-gray-50" 
              placeholder="Nhập URL hoặc chọn tệp bên dưới..." 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tải ảnh lên từ máy tính</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleFileUpload(e, key)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 border border-gray-100 rounded-lg p-1"
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px] animate-pulse">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
         <div className="h-6 bg-gray-200 rounded w-1/3"></div>
         <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="h-64 bg-gray-100 rounded-lg"></div>
         <div className="h-64 bg-gray-100 rounded-lg"></div>
         <div className="h-64 bg-gray-100 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px] flex flex-col md:flex-row">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 p-4 bg-gray-50/50 flex flex-col gap-2">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Khu vực cấu hình</h2>
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-brand-100 text-brand-800' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <SettingsIcon className="w-4 h-4" />
          Thông tin chung & Liên hệ
        </button>
        <button
          onClick={() => setActiveTab('homepage')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'homepage' ? 'bg-brand-100 text-brand-800' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <Home className="w-4 h-4" />
          Trang chủ
        </button>
        <button
          onClick={() => setActiveTab('subpages')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'subpages' ? 'bg-brand-100 text-brand-800' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <LayoutTemplate className="w-4 h-4" />
          Trang con (Blog, SP...)
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl text-gray-800 font-bold">
            {activeTab === 'general' && 'Cài đặt Chung & Thông tin liên hệ'}
            {activeTab === 'homepage' && 'Tùy chỉnh Hình ảnh Trang chủ'}
            {activeTab === 'subpages' && 'Hình đại diện (Banner) Trang con'}
          </h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
        
        <div className="p-4 md:p-6 space-y-6 flex-1 bg-gray-50 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="mb-4 pb-2 border-b">
                  <h3 className="font-bold text-lg text-gray-800">Thông tin Doanh nghiệp</h3>
                  <p className="text-sm text-gray-500">Thông tin này sẽ hiển thị ở Footer và trang Liên hệ.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn (Footer)</label>
                    <textarea value={settings.footerDescription || ''} onChange={(e) => handleChange('footerDescription', e.target.value)} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-brand-500 text-sm h-16 bg-gray-50" placeholder="Thương hiệu dược mỹ phẩm..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Map className="w-4 h-4 text-gray-400"/> Địa chỉ</label>
                    <input type="text" value={settings.address || ''} onChange={(e) => handleChange('address', e.target.value)} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-brand-500 text-sm bg-gray-50" placeholder="VD: Chung cư Hoàng Dương..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input type="text" value={settings.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-brand-500 text-sm bg-gray-50" placeholder="VD: 1900 6868" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={settings.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-brand-500 text-sm bg-gray-50" placeholder="VD: cskh@sabaicare.vn" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="mb-4 pb-2 border-b">
                  <h3 className="font-bold text-lg text-gray-800">Mạng xã hội</h3>
                  <p className="text-sm text-gray-500">Các liên kết mạng xã hội hiển thị ở Footer.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Link</label>
                    <input type="text" value={settings.facebookLink || ''} onChange={(e) => handleChange('facebookLink', e.target.value)} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-brand-500 text-sm bg-gray-50" placeholder="https://facebook.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Link</label>
                    <input type="text" value={settings.instagramLink || ''} onChange={(e) => handleChange('instagramLink', e.target.value)} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-brand-500 text-sm bg-gray-50" placeholder="https://instagram.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TikTok Link</label>
                    <input type="text" value={settings.tiktokLink || ''} onChange={(e) => handleChange('tiktokLink', e.target.value)} className="w-full border p-2.5 rounded focus:ring-2 focus:ring-brand-500 text-sm bg-gray-50" placeholder="https://tiktok.com/..." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'homepage' && (
            <div className="space-y-6">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 text-sm shadow-sm flex items-start gap-3">
                <Layers className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-70" />
                <div>
                  <strong className="block mb-1">Mẹo tối ưu:</strong>
                  Ở phần này, bạn có thể thay đổi các hình ảnh lớn xuất hiện trên Trang chủ. Bạn nên chọn hình chất lượng cao nhưng đã được tối ưu dung lượng (JPG/WebP) để trang tải nhanh hơn.
                </div>
              </div>
              
              <div className="border-l-4 border-brand-500 pl-4 py-1 mb-4">
                 <h3 className="font-bold text-xl text-gray-800">Ảnh Cửa sổ đầu trang (Hero Banner)</h3>
                 <p className="text-gray-500 text-sm mt-1">Hình ảnh xuất hiện đầu tiên khi khách vào trang web.</p>
              </div>
              {renderImageField('Ảnh Nền Hero (Banner chính)', 'homeHeroImage', 'Kích thước khuyên dùng: 1920x1080px. Chọn ảnh sáng, có khoảng trống cho chữ.')}
              
              <div className="border-l-4 border-brand-500 pl-4 py-1 mb-4 mt-8">
                 <h3 className="font-bold text-xl text-gray-800">Ảnh Chu trình chăm sóc 3 bước</h3>
                 <p className="text-gray-500 text-sm mt-1">Các ảnh miêu tả phương pháp hoặc các bước sử dụng sản phẩm.</p>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {renderImageField('Ảnh Bước 1 (Gắn bó)', 'routineStep1Image', 'Ảnh minh họa cho bước 1. Khuyên dùng: 600x800px.')}
                {renderImageField('Ảnh Bước 2 (Chăm sóc)', 'routineStep2Image', 'Ảnh minh họa cho bước 2. Khuyên dùng: 600x800px.')}
                {renderImageField('Ảnh Bước 3 (Tỏa sáng)', 'routineStep3Image', 'Ảnh minh họa cho bước 3. Khuyên dùng: 600x800px.')}
              </div>
            </div>
          )}

          {activeTab === 'subpages' && (
            <div className="space-y-6">
              <div className="mb-4 border-b pb-2">
                 <h3 className="font-bold text-xl text-gray-800">Banner các trang phụ</h3>
                 <p className="text-gray-500 mt-1">Quản lý hình ảnh nổi bật (cover) nằm ở phần đầu của các trang con (Danh sách Blog, Danh sách Sản phẩm, Về chúng tôi...).</p>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {renderImageField('Banner Trang Sản Phẩm', 'productsCoverImage', 'Ảnh hiển thị đầu trang "Sản Phẩm". Kích thước khuyên dùng: 1920x600px.')}
                {renderImageField('Banner Trang Blog/Tin tức', 'blogCoverImage', 'Ảnh hiển thị đầu trang "Cẩm nang Niềng răng". Kích thước khuyên dùng: 1920x600px.')}
                {renderImageField('Banner Trang "Về FURANO"', 'aboutCoverImage', 'Ảnh hiển thị đầu trang Thông tin thương hiệu. Kích thước khuyên dùng: 1920x600px.')}
                {renderImageField('Banner Trang "Hệ thống cửa hàng"', 'storesCoverImage', 'Kích thước khuyên dùng: 1920x600px.')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

