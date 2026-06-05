'use client';
import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Image as ImageIcon, X, Database } from 'lucide-react';
import { db, auth, collection, getDocs, doc, setDoc, deleteDoc, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, createUserWithEmailAndPassword, onAuthStateChanged, User, writeBatch } from '../localDB';
import { categories as defaultCategories } from '../data/products';
import { blogPosts as defaultBlogPosts } from '../data/blogPosts';
import AdminUsersManager from '../components/AdminUsersManager';
import SiteSettingsManager from '../components/SiteSettingsManager';
import Link from 'next/link';
import { compressImage } from '../lib/imageUtils';

const AdminLoadingSkeleton = () => (
  <div className="w-full flex flex-col gap-6 animate-pulse">
    <div className="h-10 bg-gray-200 rounded-lg w-1/4"></div>
    <div className="flex gap-8">
      <div className="w-1/3 flex flex-col gap-3">
        <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
      </div>
      <div className="w-2/3 flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="h-24 bg-gray-200 rounded-xl w-1/2"></div>
          <div className="h-24 bg-gray-200 rounded-xl w-1/2"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-24 bg-gray-200 rounded-xl w-1/2"></div>
          <div className="h-24 bg-gray-200 rounded-xl w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
);

const AdminTableSkeleton = () => (
  <div className="w-full flex flex-col gap-4 animate-pulse pt-2">
    <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
    <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
    <div className="h-12 bg-gray-50 rounded-lg w-full"></div>
    <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
    <div className="h-12 bg-gray-50 rounded-lg w-full"></div>
  </div>
);

const AdminLayout = ({ children, activeTab, setActiveTab, user, onLogout }: any) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col justify-between">
        <div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-brand-400">Furano Admin</h2>
          </div>
          <nav className="mt-4">
            {['Dashboard', 'Site Settings', 'Categories & Products', 'Blog Posts', 'FAQs', 'Admin Users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-6 py-3 hover:bg-gray-800 transition-colors ${activeTab === tab ? 'bg-gray-800 border-l-4 border-brand-500' : ''}`}
              >
                {tab === 'Dashboard' && 'Dashboard'}
                {tab === 'Site Settings' && 'Hình ảnh chung'}
                {tab === 'Categories & Products' && 'Danh mục & Sản phẩm'}
                {tab === 'Blog Posts' && 'Bài viết Blog'}
                {tab === 'FAQs' && 'Hỏi Đáp (FAQs)'}
                {tab === 'Admin Users' && 'Thành viên Quản trị'}
              </button>
            ))}
            <Link href="/" className="block mt-12 px-6 text-sm text-gray-400 hover:text-white">
              ← Trở về trang web
            </Link>
          </nav>
        </div>
        
        {user && (
          <div className="p-6 border-t border-gray-800">
            <div className="text-xs text-gray-400 mb-2 truncate">{user.email}</div>
            <button
              onClick={onLogout}
              className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm transition-colors text-left"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
          {children}
        </div>
      </div>
    </div>
  );
};

const DashboardView = () => {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    if (!confirm('Khởi tạo lại cơ sở dữ liệu mẫu? (Chỉ thêm nếu thiếu)')) return;
    setIsSeeding(true);
    try {
      // Products (categories)
      const batch1 = writeBatch(db);
      for (const cat of defaultCategories) {
        batch1.set(doc(db, 'products', cat.id), cat, { merge: true });
      }
      await batch1.commit();

      // Blogs
      const batch2 = writeBatch(db);
      for (const post of defaultBlogPosts) {
        batch2.set(doc(db, 'blogPosts', post.id), post, { merge: true });
      }
      await batch2.commit();

      // FAQs
      const batch3 = writeBatch(db);
      const defaultFaqs = [
        { id: "1", question: "Sản phẩm FURANO có dùng được cho răng nhạy cảm không?", answer: "Hoàn toàn được. Công thức không chứa chất mài mòn mạnh (low RDA)." },
        { id: "2", question: "Bao nhiêu lâu thì nên thay đổi bàn chải kẽ?", answer: "Với người đang niềng răng, nha sĩ khuyên nên làm vệ sinh bàn chải sau mỗi lần sử dụng..." },
      ];
      for (const f of defaultFaqs) {
        batch3.set(doc(db, 'faqs', f.id), f, { merge: true });
      }
      await batch3.commit();
      
      alert('Đã khởi tạo xong cơ sở dữ liệu mẫu!');
    } catch(e) {
      // console.error(e);
      alert('Lỗi khởi tạo!');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="mb-6">Chào mừng đến với trang quản trị Furano. Vui lòng chọn danh mục bên trái.</p>
      
      <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl max-w-lg">
         <h3 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
            <Database className="w-5 h-5"/> Khởi tạo dữ liệu
         </h3>
         <p className="text-blue-800 text-sm mb-4">
           Nhấn nút dưới đây để mồi (seed) dữ liệu tĩnh ban đầu vào cơ sở dữ liệu Firebase. Giúp bạn dễ dàng chỉnh sửa mà không cần nhập lại từ đầu.
         </p>
         <button onClick={handleSeed} disabled={isSeeding} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
           {isSeeding ? 'Đang chạy...' : 'Khởi tạo Dữ liệu Mẫu'}
         </button>
      </div>
    </div>
  );
};

// Generic Edit Modal component
const ItemModal = ({ item, fields, onSave, onClose, isProduct = false }: any) => {
  const [formData, setFormData] = useState<any>(
    item || fields.reduce((acc: any, field: any) => ({ ...acc, [field.name]: field.defaultValue || '' }), {})
  );
  const [isTranslating, setIsTranslating] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name: string, value: string) => {
    // split by new lines
    const arr = value.split('\n').filter(Boolean);
    handleChange(name, arr);
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    try {
      const translateField = async (text: string) => {
        if (!text) return '';
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });
        const data = await res.json();
        return data.translatedText || text;
      };

      const fieldsToTranslate = [
        { vn: 'title', en: 'title_en' },
        { vn: 'excerpt', en: 'excerpt_en' },
        { vn: 'content', en: 'content_en' }
      ];

      const updates: any = {};
      for (const f of fieldsToTranslate) {
        if (formData[f.vn]) {
           updates[f.en] = await translateField(formData[f.vn]);
        }
      }
      setFormData((prev: any) => ({ ...prev, ...updates }));
      alert('Dịch tự động thành công!');
    } catch(err) {
      console.error(err);
      alert('Có lỗi khi dịch.');
    } finally {
      setIsTranslating(false);
    }
  };

  const hasTranslatableFields = fields.some((f: any) => f.name === 'title_en');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-3xl my-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold">{item ? 'Chỉnh sửa' : 'Thêm mới'}</h3>
            {hasTranslatableFields && (
              <button 
                onClick={handleAutoTranslate} 
                disabled={isTranslating} 
                className="px-3 py-1 bg-brand-50 text-brand-700 text-sm font-semibold rounded-lg hover:bg-brand-100 disabled:opacity-50"
              >
                {isTranslating ? 'Đang dịch...' : '⚡ Dịch tự động sang tiếng Anh'}
              </button>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {fields.map((field: any) => {
            const val = formData[field.name];
            return (
              <div key={field.name}>
                <label className="block text-sm font-bold text-gray-700 mb-1">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={val || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg h-32 focus:ring-2 focus:ring-brand-500"
                  />
                ) : field.type === 'image' ? (
                  <div className="flex gap-4 items-start">
                    {val && <img src={val} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />}
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Image URL hoặc chọn tệp bên dưới"
                        value={val || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500"
                      />
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const compressedDataUrl = await compressImage(file, 800);
                              handleChange(field.name, compressedDataUrl);
                            } catch (err) {
                              console.error('Lỗi khi nén ảnh', err);
                            }
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                      />
                    </div>
                  </div>
                ) : field.type === 'array' ? (
                  <textarea
                    value={(val || []).join('\n')}
                    placeholder="Mỗi dòng 1 mục..."
                    onChange={(e) => handleArrayChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg h-32 focus:ring-2 focus:ring-brand-500"
                  />
                ) : field.type === 'variants' ? (
                  <div className="space-y-2 border p-4 rounded-lg bg-gray-50">
                     <p className="text-xs text-gray-500 mb-2">Chỉnh sửa JSON cho variants (màu sắc, ảnh phân loại)</p>
                     <textarea
                      value={typeof val === 'string' ? val : JSON.stringify(val || [], null, 2)}
                      onChange={(e) => {
                        try {
                           handleChange(field.name, JSON.parse(e.target.value));
                        } catch(err) {
                           handleChange(field.name, e.target.value); // Keep as string if invalid, will fail later or we can handle it
                        }
                      }}
                      className="w-full px-3 py-2 border rounded-lg h-40 font-mono text-sm"
                     />
                  </div>
                ) : field.type === 'reviews_editor' ? (
                  <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                     <p className="text-sm font-medium text-gray-900">Đánh giá khách hàng</p>
                     {(val || []).map((review: any, idx: number) => (
                        <div key={idx} className="p-4 border bg-white rounded-lg space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => {
                              const newVals = [...(val || [])];
                              newVals.splice(idx, 1);
                              handleChange(field.name, newVals);
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-medium"
                          >Xóa</button>
                          
                          <input type="text" placeholder="Tên khách hàng" value={review.name || ''} 
                            onChange={(e) => {
                              const newVals = [...(val || [])];
                              newVals[idx] = { ...newVals[idx], name: e.target.value };
                              handleChange(field.name, newVals);
                            }} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500" />
                            
                          <div className="flex gap-4">
                            <input type="text" placeholder="Thời gian (vd: Hôm nay)" value={review.date || ''} 
                              onChange={(e) => {
                                const newVals = [...(val || [])];
                                newVals[idx] = { ...newVals[idx], date: e.target.value };
                                handleChange(field.name, newVals);
                              }} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500" />

                            <input type="number" min="1" max="5" placeholder="Số sao (1-5)" value={review.rating || 5} 
                              onChange={(e) => {
                                const newVals = [...(val || [])];
                                newVals[idx] = { ...newVals[idx], rating: e.target.value };
                                handleChange(field.name, newVals);
                              }} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500" />
                          </div>

                          <textarea placeholder="Nội dung đánh giá" value={review.comment || ''} 
                            onChange={(e) => {
                              const newVals = [...(val || [])];
                              newVals[idx] = { ...newVals[idx], comment: e.target.value };
                              handleChange(field.name, newVals);
                            }} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 h-24" />
                            
                          <div className="flex flex-col gap-2">
                             <input type="text" placeholder="URL Hình ảnh (tuỳ chọn)" value={review.image || ''}
                                onChange={(e) => {
                                  const newVals = [...(val || [])];
                                  newVals[idx] = { ...newVals[idx], image: e.target.value };
                                  handleChange(field.name, newVals);
                                }} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500" />
                             
                             <div className="flex gap-4 items-center">
                               {review.image && <img src={review.image} alt="Review" className="w-16 h-16 object-cover rounded-lg border" />}
                               <input type="file" accept="image/*" onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                    try {
                                        const compressedDataUrl = await compressImage(file, 400, 0.8);
                                        const newVals = [...(val || [])];
                                        newVals[idx] = { ...newVals[idx], image: compressedDataUrl };
                                        handleChange(field.name, newVals);
                                    } catch (err) {
                                        console.error('Lỗi khi nén ảnh', err);
                                    }
                                 }
                               }} className="text-sm" />
                             </div>
                          </div>
                        </div>
                     ))}
                     <button
                        type="button"
                        onClick={() => {
                          const newVals = [...(val || []), { name: '', rating: 5, date: '', comment: '', image: '' }];
                          handleChange(field.name, newVals);
                        }}
                        className="w-full py-2 border-2 border-dashed border-brand-300 rounded-lg text-brand-600 hover:bg-brand-50 font-medium"
                     >+ Thêm Đánh Giá</button>
                  </div>
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={val || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500"
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
          <button onClick={onClose} className="px-5 py-2.5 border rounded-xl hover:bg-gray-50 font-medium">Hủy bỏ</button>
          <button onClick={handleSave} className="px-5 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-medium">Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
};

const GenericCollectionManager = ({ title, collectionName, fields }: any) => {
  const [items, setItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  async function fetchItems() {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Fallback for UI if DB empty
      if (data.length === 0) {
          if (collectionName === 'blogPosts') data = defaultBlogPosts;
          // You could add other collection fallbacks here if needed
      }
      
      setItems(data);
    } catch(e) {
      if (collectionName === 'blogPosts') setItems(defaultBlogPosts);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingItem) {
        await setDoc(doc(db, collectionName, editingItem.id), data, { merge: true });
      } else {
        const newId = data.id || Date.now().toString();
        await setDoc(doc(db, collectionName, newId), { ...data, id: newId });
      }
      setEditingItem(null);
      setIsCreating(false);
      fetchItems();
    } catch(e) {
      // console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      fetchItems();
    } catch(e) {
      // console.error(e);
    }
  };

  const [isTranslatingAll, setIsTranslatingAll] = useState(false);

  const handleTranslateAll = async () => {
    if (!confirm('Dịch tự động tất cả bài viết chưa có tiếng Anh? Việc này có thể mất vài phút.')) return;
    setIsTranslatingAll(true);
    try {
      const translateField = async (text: string) => {
        if (!text) return '';
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });
        const data = await res.json();
        return data.translatedText || text;
      };

      const itemsToUpdate = items.filter(item => !item.title_en);
      for (const item of itemsToUpdate) {
         const updates: any = {};
         if (item.title && !item.title_en) updates.title_en = await translateField(item.title);
         if (item.excerpt && !item.excerpt_en) updates.excerpt_en = await translateField(item.excerpt);
         if (item.content && !item.content_en) updates.content_en = await translateField(item.content);
         
         if (Object.keys(updates).length > 0) {
            await setDoc(doc(db, collectionName, item.id), updates, { merge: true });
         }
      }
      alert('Đã hoàn thành dịch tự động các bài viết!');
      fetchItems();
    } catch(e) {
      console.error(e);
      alert('Có lỗi xảy ra trong quá trình dịch.');
    } finally {
      setIsTranslatingAll(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-3">
          {collectionName === 'blogPosts' && (
             <button onClick={handleTranslateAll} disabled={isTranslatingAll} className="px-4 py-2 flex items-center gap-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 disabled:opacity-50">
               {isTranslatingAll ? 'Đang dịch...' : '⚡ Dịch tất cả bài viết'}
             </button>
          )}
          <button onClick={() => setIsCreating(true)} className="px-4 py-2 flex items-center gap-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
            <Plus className="w-4 h-4" /> Thêm Mới
          </button>
        </div>
      </div>

      {loading ? (
        <AdminTableSkeleton />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 rounded-tl-lg">Hình ảnh</th>
                <th className="py-3 px-4">Tiêu đề / Tên</th>
                <th className="py-3 px-4 w-32 text-right rounded-tr-lg">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {item.image || item.heroImage ? (
                      <img src={item.image || item.heroImage} className="w-16 h-12 object-cover rounded" alt="Thumb" />
                    ) : (
                      <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium max-w-xs line-clamp-2">{item.title || item.name || item.question}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => setEditingItem(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-1"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(isCreating || editingItem) && (
        <ItemModal
          item={editingItem}
          fields={fields}
          onSave={handleSave}
          onClose={() => { setEditingItem(null); setIsCreating(false); }}
        />
      )}
    </div>
  );
};

// SPECIAL MANAGER FOR CATEGORIES & PRODUCTS
const CategoriesProductsManager = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      if (data.length === 0) {
          data = defaultCategories;
      }
      
      setCategories(data);
    } catch(e) {
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (catData: any) => {
    try {
      if (editingCategory?.id) {
         await setDoc(doc(db, 'products', editingCategory.id), catData, { merge: true });
      } else {
         const newId = catData.id || Date.now().toString();
         await setDoc(doc(db, 'products', newId), {...catData, id: newId, products: catData.products || []});
      }
      setEditingCategory(null);
      fetchCategories();
    } catch(e) {
       // console.error(e);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if(!confirm("Xóa danh mục này sẽ xóa toàn bộ sản phẩm bên trong. Tiếp tục?")) return;
    await deleteDoc(doc(db, 'products', id));
    if(selectedCategoryId === id) {
      setSelectedCategoryId(null);
    }
    fetchCategories();
  }

  const handleSaveProduct = async (prodData: any) => {
    if (!selectedCategoryId) return;
    const currentCat = categories.find(c => c.id === selectedCategoryId);
    if (!currentCat) return;
    const cat = { ...currentCat };
    if (!cat.products) cat.products = [];

    const pIndex = cat.products.findIndex((p: any) => p.id === (editingProduct?.id || prodData.id));
    
    if (pIndex > -1) {
      const prodId = prodData.id || editingProduct.id;
      cat.products[pIndex] = { ...prodData, id: prodId }; // Update
    } else {
      cat.products.push({ ...prodData, id: prodData.id || Date.now().toString() }); // Add
    }

    try {
      await setDoc(doc(db, 'products', cat.id), cat, { merge: true });
      setEditingProduct(null);
      fetchCategories();
    } catch(e) {
      // console.error(e);
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
     if (!selectedCategoryId) return;
     const currentCat = categories.find(c => c.id === selectedCategoryId);
     if (!currentCat) return;
     if(!confirm("Xóa sản phẩm này?")) return;
     
     const cat = { ...currentCat };
     cat.products = (cat.products || []).filter((p: any) => p.id !== prodId);

     try {
       await setDoc(doc(db, 'products', cat.id), cat, { merge: true });
       fetchCategories();
     } catch(e) {
       // console.error(e);
     }
  }

  const catFields = [
    { name: 'id', label: 'ID Danh mục (slug)', type: 'text' },
    { name: 'title', label: 'Tên danh mục', type: 'text' },
    { name: 'description', label: 'Mô tả ngắn', type: 'textarea' },
    { name: 'heroImage', label: 'Ảnh bìa (Hero Image URL)', type: 'image' }
  ];

  const prodFields = [
    { name: 'id', label: 'ID Sản phẩm (slug)', type: 'text' },
    { name: 'name', label: 'Tên Sản phẩm', type: 'text' },
    { name: 'tag', label: 'Thẻ nổi bật (VD: Bán chạy)', type: 'text' },
    { name: 'image', label: 'Ảnh Chính (URL)', type: 'image' },
    { name: 'features', label: 'Đặc điểm nổi bật (Mỗi dòng 1 cái)', type: 'array' },
    { name: 'mainUses', label: 'Công dụng chính (Mỗi dòng 1 cái)', type: 'array' },
    { name: 'ingredients', label: 'Thành phần (Mỗi dòng 1 cái)', type: 'array' },
    { name: 'materials', label: 'Chất liệu (Mỗi dòng 1 cái)', type: 'array' },
    { name: 'specs', label: 'Thông số kỹ thuật', type: 'text' },
    { name: 'reviews', label: 'Đánh giá khách hàng', type: 'reviews_editor' }
  ];

  if (loading) return <AdminLoadingSkeleton />;

  return (
    <div className="flex gap-8">
      {/* Categories Column */}
      <div className="w-1/3 border-r pr-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Danh mục</h3>
          <button onClick={() => setEditingCategory({})} className="p-1.5 bg-gray-100 rounded hover:bg-gray-200"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="space-y-2">
           {categories.map((cat, idx) => (
             <div 
               key={cat.id} 
               className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 flex justify-between items-center ${selectedCategoryId === cat.id ? 'border-brand-500 bg-brand-50' : ''}`}
               onClick={() => setSelectedCategoryId(cat.id)}
             >
               <span className="font-medium text-sm">{cat.title} ({cat.products?.length || 0})</span>
               <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                 <button onClick={() => setEditingCategory(cat)} className="p-1 text-gray-500 hover:text-blue-600"><Pencil className="w-3.5 h-3.5"/></button>
                 <button onClick={() => handleDeleteCategory(cat.id)} className="p-1 text-gray-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5"/></button>
               </div>
             </div>
           ))}
        </div>
      </div>

      {/* Products Column */}
      <div className="w-2/3 pl-2">
         {selectedCategoryId ? (() => {
            const selectedCat = categories.find(c => c.id === selectedCategoryId);
            if (!selectedCat) return null;
            return (
            <div>
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold">Sản phẩm: {selectedCat.title}</h3>
                 <button onClick={() => setEditingProduct({})} className="px-3 py-1.5 text-sm bg-brand-600 text-white rounded-lg flex items-center gap-2"><Plus className="w-4 h-4" /> Thêm SP</button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {selectedCat.products?.map((p: any) => (
                    <div key={p.id} onClick={() => setEditingProduct(p)} className="border rounded-xl p-3 flex gap-4 bg-white relative group cursor-pointer hover:border-brand-500 hover:shadow-md transition-all">
                       <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-lg border bg-gray-50" />
                       <div className="flex-1">
                          <h4 className="font-bold text-sm mb-1 line-clamp-2">{p.name}</h4>
                          <p className="text-xs text-gray-500 line-clamp-1">{p.id}</p>
                       </div>
                       <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white shadow-sm rounded-md border p-0.5" onClick={(e) => e.stopPropagation()}>
                         <button onClick={() => setEditingProduct(p)} className="p-1 hover:bg-gray-100 rounded text-blue-600"><Pencil className="w-3.5 h-3.5"/></button>
                         <button onClick={() => handleDeleteProduct(p.id)} className="p-1 hover:bg-gray-100 rounded text-red-600"><Trash2 className="w-3.5 h-3.5"/></button>
                       </div>
                    </div>
                  ))}
                  {(!selectedCat.products || selectedCat.products.length === 0) && (
                     <p className="col-span-2 text-gray-500 italic">Chưa có sản phẩm nào. Hãy thêm mới!</p>
                  )}
               </div>
            </div>
            );
         })() : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
               <p>Chọn một danh mục để xem sản phẩm</p>
            </div>
         )}
      </div>

      {editingCategory && (
        <ItemModal
          item={editingCategory.id ? editingCategory : null}
          fields={catFields}
          onSave={handleSaveCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}

      {editingProduct && (
        <ItemModal
          item={editingProduct.id ? editingProduct : null}
          fields={prodFields}
          onSave={handleSaveProduct}
          onClose={() => setEditingProduct(null)}
          isProduct={true}
        />
      )}
    </div>
  );
};

const LoginScreen = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const handleAuth = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!isReset) {
        localStorage.setItem('adminLoginTime', Date.now().toString());
      }
      if (isReset) {
        await sendPasswordResetEmail(auth, email);
        alert('Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư của bạn.');
        setIsReset(false);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onLogin(userCredential.user);
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isReset ? 'Khôi phục mật khẩu' : 'Đăng nhập Quản trị'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Địa chỉ email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm"
                placeholder="Địa chỉ Email"
              />
            </div>
            {!isReset && (
              <div>
                <label htmlFor="password" className="sr-only">Mật khẩu</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm"
                  placeholder="Mật khẩu"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm space-x-4">
              <button type="button" onClick={() => setIsReset(!isReset)} className="font-medium text-brand-600 hover:text-brand-500">
                {isReset ? 'Quay lại đăng nhập' : 'Quên mật khẩu?'}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : (isReset ? 'Gửi email khôi phục' : 'Đăng nhập')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TabPanel = ({ active, children }: any) => {
  if (!active) return null;

  return (
    <div className="block">
      {children}
    </div>
  );
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      if (currentUser) {
        const loginTime = localStorage.getItem('adminLoginTime');
        if (loginTime) {
          const hoursPassed = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60);
          if (hoursPassed >= 24) {
            signOut(auth);
            localStorage.removeItem('adminLoginTime');
            return;
          }
        } else {
           // Set it if missing
           localStorage.setItem('adminLoginTime', Date.now().toString());
        }
      }
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Đang kiểm tra đăng nhập...</div>;
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout}>
      <TabPanel active={activeTab === 'Dashboard'}>
        <DashboardView />
      </TabPanel>
      
      <TabPanel active={activeTab === 'Categories & Products'}>
        <CategoriesProductsManager />
      </TabPanel>
      
      <TabPanel active={activeTab === 'Blog Posts'}>
        <GenericCollectionManager title="Bài viết Blog" collectionName="blogPosts" fields={[
          { name: 'title', label: 'Tiêu đề', type: 'text' },
          { name: 'title_en', label: 'Tiêu đề (EN)', type: 'text' },
          { name: 'category', label: 'Chuyên mục', type: 'text' },
          { name: 'date', label: 'Ngày tháng (VD: 24 Thg 05, 2024)', type: 'text' },
          { name: 'image', label: 'Ảnh đại diện', type: 'image' },
          { name: 'excerpt', label: 'Mô tả ngắn', type: 'textarea' },
          { name: 'excerpt_en', label: 'Mô tả ngắn (EN)', type: 'textarea' },
          { name: 'content', label: 'Nội dung (Hỗ trợ Markdown)', type: 'textarea' },
          { name: 'content_en', label: 'Nội dung (EN)', type: 'textarea' }
        ]} />
      </TabPanel>
      
      <TabPanel active={activeTab === 'FAQs'}>
        <GenericCollectionManager title="Câu Hỏi Thường Gặp" collectionName="faqs" fields={[
          { name: 'question', label: 'Câu hỏi', type: 'text' },
          { name: 'answer', label: 'Câu trả lời', type: 'textarea' }
        ]} />
      </TabPanel>

      <TabPanel active={activeTab === 'Admin Users'}>
        <AdminUsersManager />
      </TabPanel>
      
      <TabPanel active={activeTab === 'Site Settings'}>
        <SiteSettingsManager />
      </TabPanel>
    </AdminLayout>
  );
}
