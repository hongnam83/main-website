import { useState, useEffect } from 'react';
import { db, doc, getDoc, setDoc, collection, getDocs, deleteDoc } from '../localDB';
import { compressImage } from '../lib/imageUtils';
import { Pencil, Trash2, Plus, Image as ImageIcon, Check, X } from 'lucide-react';

export default function AdminTestimonialsManager() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'testimonials'));
      const items: any[] = [];
      if (querySnapshot.docs) {
        querySnapshot.docs.forEach((doc: any) => {
          items.push({ id: doc.id, ...doc.data() });
        });
      }
      // Sort by order or createdAt
      items.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      setTestimonials(items);
    } catch (error) {
      console.error("Error fetching testimonials", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsList: any[] = [];
      if (querySnapshot.docs) {
        querySnapshot.docs.forEach((doc: any) => {
          const data = doc.data();
          if (data && data.products && Array.isArray(data.products)) {
            data.products.forEach((p: any) => {
              productsList.push(p);
            });
          }
        });
      }
      setAllProducts(productsList);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchTestimonials(), fetchProducts()]);
      setLoading(false);
    };
    initData();
    
    const handleUpdate = () => {
      fetchTestimonials();
      fetchProducts();
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

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({ ...item });
  };

  const handleCreate = () => {
    const newId = `testimonial_${Date.now()}`;
    setEditingId(newId);
    setFormData({ id: newId, content: '', image: '', productName: '', productId: '', createdAt: Date.now() });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa Lời tâm sự này?')) {
      await deleteDoc(doc(db, 'testimonials', id));
      fetchTestimonials();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200)); // Delay for UI state
      await setDoc(doc(db, 'testimonials', formData.id), formData);
      setEditingId(null);
      fetchTestimonials();
    } catch (error) {
      console.error("Error saving testimonial", error);
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setFormData({ ...formData, image: compressed });
      } catch (err) {
        console.error("Error compressing image", err);
        alert('Có lỗi xảy ra khi nén ảnh.');
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px] flex flex-col">
      <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <div>
          <h2 className="text-xl text-gray-800 font-bold">Quản lý Lời tâm sự (Testimonials)</h2>
          <p className="text-sm text-gray-500 mt-1">Danh sách đánh giá của khách hàng xuất hiện ở trang chủ.</p>
        </div>
        {!editingId && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
        )}
      </div>

      <div className="p-4 md:p-6 flex-1 bg-gray-50 overflow-y-auto">
        {editingId ? (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5 max-w-3xl mx-auto">
            <h3 className="font-bold text-lg mb-4 pb-2 border-b">{!formData.productName && !formData.content ? 'Thêm mới' : 'Chỉnh sửa'} Lời tâm sự</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách hàng</label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  className="w-full border p-2.5 rounded focus:ring-2 focus:ring-brand-500 text-sm bg-gray-50" 
                  placeholder="VD: Anh Tuấn" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm được nhắc đến</label>
                <select
                  value={formData.productId || ''}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedProduct = allProducts.find(p => p.id === selectedId);
                    setFormData({
                      ...formData,
                      productId: selectedId,
                      productName: selectedProduct ? selectedProduct.name : '',
                      product: selectedProduct ? selectedProduct.name : ''
                    });
                  }}
                  className="w-full border p-2.5 rounded focus:ring-2 focus:ring-brand-500 text-sm bg-gray-50"
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {allProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung Lời tâm sự</label>
                <textarea 
                  value={formData.content || ''} 
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                  className="w-full border p-2.5 rounded focus:ring-2 focus:ring-brand-500 text-sm h-32 bg-gray-50" 
                  placeholder="Nội dung khách hàng chia sẻ..." 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh Khách hàng</label>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg border shadow-sm flex-shrink-0" />
                  ) : (
                    <div className="w-32 h-32 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-xs text-gray-400 flex-shrink-0">
                      <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                      Chưa có ảnh
                    </div>
                  )}
                  <div className="flex-1 space-y-3 w-full">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 border border-gray-100 rounded-lg p-1"
                    />
                    <input 
                      type="text" 
                      value={formData.image || ''} 
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                      className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 text-xs bg-gray-50" 
                      placeholder="Hoặc nhập URL ảnh trực tiếp..." 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <button
                onClick={() => setEditingId(null)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                <X className="w-4 h-4" />
                Hủy bỏ
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
              >
                {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                {saving ? 'Đang lưu...' : <><Check className="w-4 h-4" /> Lưu lại</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                Không có dữ liệu Lời tâm sự nào. Hãy thêm mới!
              </div>
            ) : (
              testimonials.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="aspect-[4/3] w-full bg-gray-100 relative group">
                    {item.image ? (
                      <img src={item.image} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button onClick={() => handleEdit(item)} className="p-2 bg-white rounded-full text-brand-600 hover:bg-brand-50">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <p className="font-bold text-gray-800 line-clamp-1">{item.name || 'Khách hàng'}</p>
                    <p className="text-xs text-brand-600 font-medium">{item.productName || item.product || 'Sản phẩm FURANO'}</p>
                    <p className="text-sm text-gray-500 italic line-clamp-3">&quot;{item.content}&quot;</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
