'use client';
import { useState, useEffect } from 'react';
import { db, doc, getDoc, setDoc } from '../localDB';
import { compressImage } from '../lib/imageUtils';

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        // Medium size to prevent payload issues
        const compressedDataUrl = await compressImage(file, 800, 0.8);
        handleChange(key, compressedDataUrl);
      } catch (err) {
        console.error('Lỗi khi nén ảnh', err);
      }
    }
  };

  const renderImageField = (label: string, key: string) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-4 items-start">
        {settings[key] ? (
          <img src={settings[key]} className="w-48 h-24 object-cover rounded-lg border bg-gray-50 flex-shrink-0" />
        ) : (
          <div className="w-48 h-24 bg-gray-50 border rounded-lg flex items-center justify-center text-sm text-gray-400 flex-shrink-0">Chưa có ảnh</div>
        )}
        <div className="flex-1 space-y-2">
          <input 
            type="text" 
            value={settings[key] || ''} 
            onChange={(e) => handleChange(key, e.target.value)} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 text-sm" 
            placeholder="Image URL hoặc chọn tệp bên dưới" 
          />
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => handleFileUpload(e, key)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
          />
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
        <h2 className="text-xl text-gray-800 font-bold">Cài đặt chung & Hình ảnh</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
        >
          {saving ? 'Đang lưu...' : 'Lưu lại'}
        </button>
      </div>
      
      <div className="p-6 space-y-6 max-w-4xl bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800 px-1 border-b pb-2">Thông tin liên hệ & Footer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <input type="text" value={settings.address || ''} onChange={(e) => handleChange('address', e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 text-sm" placeholder="VD: Chung cư Hoàng Dương..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input type="text" value={settings.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 text-sm" placeholder="VD: 1900 6868" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={settings.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 text-sm" placeholder="VD: cskh@sabaicare.vn" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn (Footer)</label>
              <textarea value={settings.footerDescription || ''} onChange={(e) => handleChange('footerDescription', e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 text-sm h-10" placeholder="Thương hiệu dược mỹ phẩm..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Link</label>
              <input type="text" value={settings.facebookLink || ''} onChange={(e) => handleChange('facebookLink', e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 text-sm" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Link</label>
              <input type="text" value={settings.instagramLink || ''} onChange={(e) => handleChange('instagramLink', e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 text-sm" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TikTok Link</label>
              <input type="text" value={settings.tiktokLink || ''} onChange={(e) => handleChange('tiktokLink', e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 text-sm" placeholder="https://tiktok.com/..." />
            </div>
          </div>

          <hr className="my-6 border-gray-200" />
          <h3 className="font-bold text-lg text-gray-800 px-1 border-b pb-2">Hình ảnh Trang Web (Hero Images)</h3>
          
          {renderImageField('Ảnh Hero Trang Chủ', 'homeHeroImage')}
          {renderImageField('Ảnh Bìa (Cover) Trang Sản Phẩm', 'productsCoverImage')}
          {renderImageField('Ảnh Bìa (Cover) Trang Danh Sách Blog', 'blogCoverImage')}
          {renderImageField('Ảnh Bìa (Cover) Trang Về Chúng Tôi', 'aboutCoverImage')}
          {renderImageField('Ảnh Bìa (Cover) Hệ thống cửa hàng', 'storesCoverImage')}
          
          <hr className="my-6 border-gray-200" />
          <h3 className="font-bold text-lg text-gray-800 px-1">Ảnh Chu trình chăm sóc</h3>
          
          {renderImageField('Ảnh Chu trình Bước 1', 'routineStep1Image')}
          {renderImageField('Ảnh Chu trình Bước 2', 'routineStep2Image')}
          {renderImageField('Ảnh Chu trình Bước 3', 'routineStep3Image')}
      </div>
    </div>
  );
}
