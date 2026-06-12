import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Image as ImageIcon, X, ArrowUp, ArrowDown } from 'lucide-react';
import { db, collection, getDocs, doc, setDoc, deleteDoc } from '../localDB';
import { compressImage } from '../lib/imageUtils';

export type BlockType = 'h2' | 'h3' | 'paragraph' | 'bullet_list' | 'numbered_list' | 'table' | 'note' | 'warning' | 'advice' | 'image' | 'image_text' | 'text_image' | 'two_images' | 'gallery';

export interface BlockData {
  id: string;
  type: BlockType;
  content?: string;
  items?: string[];
  tableData?: string[][];
  image?: { url: string; alt?: string; caption?: string };
  images?: { url: string; alt?: string; caption?: string }[];
}

const BLOCK_TYPES = [
  { value: 'h2', label: 'Tiêu đề H2' },
  { value: 'h3', label: 'Tiêu đề H3' },
  { value: 'paragraph', label: 'Đoạn văn bản' },
  { value: 'bullet_list', label: 'Danh sách gạch đầu dòng' },
  { value: 'numbered_list', label: 'Danh sách đánh số' },
  { value: 'table', label: 'Bảng' },
  { value: 'note', label: 'Box lưu ý' },
  { value: 'warning', label: 'Box cảnh báo' },
  { value: 'advice', label: 'Box lời khuyên' },
  { value: 'image', label: 'Ảnh đơn' },
  { value: 'image_text', label: 'Ảnh trái, chữ phải' },
  { value: 'text_image', label: 'Chữ trái, ảnh phải' },
  { value: 'two_images', label: 'Hai ảnh song song' },
  { value: 'gallery', label: 'Gallery nhiều ảnh' },
];

export default function AdminBlogManager() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<any>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'blogPosts'));
      const data = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
      setPosts(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveList = async (post: any) => {
    try {
      const newId = post.id || post.slug || Date.now().toString();
      await setDoc(doc(db, 'blogPosts', newId), { ...post, id: newId });
      fetchPosts();
      setEditingPost(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc xoá bài viết này?')) return;
    try {
      await deleteDoc(doc(db, 'blogPosts', id));
      fetchPosts();
    } catch (err) {}
  };

  if (editingPost) {
    return <PostEditor post={editingPost} onSave={handleSaveList} onCancel={() => setEditingPost(null)} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bài viết Blog</h2>
        <button onClick={() => setEditingPost({ blocks: [], status: 'draft' })} className="px-4 py-2 flex items-center gap-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
          <Plus className="w-4 h-4" /> Viết Bài Mới
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-100 rounded-lg"></div>
          <div className="h-12 bg-gray-50 rounded-lg"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white rounded-xl shadow-sm overflow-hidden border">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4">Ảnh</th>
                <th className="py-3 px-4">Tiêu đề</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Ngày cập nhật</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {post.image ? <img src={post.image} className="w-16 h-12 object-cover rounded" alt="" /> : <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center"><ImageIcon className="w-5 h-5 text-gray-400"/></div>}
                  </td>
                  <td className="py-3 px-4 font-medium max-w-[300px] truncate">{post.title}</td>
                  <td className="py-3 px-4">
                    {post.status === 'published' ? <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Đã xuất bản</span> : <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-medium">Bản nháp</span>}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{post.date}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => setEditingPost(post)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-1"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(post.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">Chưa có bài viết nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PostEditor({ post, onSave, onCancel }: { post: any, onSave: (p: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<any>({
    title: '', slug: '', metaTitle: '', metaDescription: '', image: '', category: '', status: 'draft', date: new Date().toISOString().split('T')[0], ...post, blocks: post.blocks || []
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (k: string, v: any) => setFormData((p: any) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  const handleAddBlock = (type: BlockType) => {
    const newBlock: BlockData = { id: Date.now().toString() + Math.random().toString(36).substr(2, 5), type };
    if (type === 'bullet_list' || type === 'numbered_list') newBlock.items = [''];
    if (type === 'table') newBlock.tableData = [['Cột 1', 'Cột 2'], ['Dữ liệu', 'Dữ liệu']];
    if (type === 'image' || type === 'image_text' || type === 'text_image') newBlock.image = { url: '' };
    if (type === 'two_images' || type === 'gallery') newBlock.images = [{ url: '' }, { url: '' }];
    handleChange('blocks', [...formData.blocks, newBlock]);
  };

  const updateBlock = (index: number, updates: Partial<BlockData>) => {
    const newBlocks = [...formData.blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    handleChange('blocks', newBlocks);
  };

  const removeBlock = (index: number) => {
    const newBlocks = [...formData.blocks];
    newBlocks.splice(index, 1);
    handleChange('blocks', newBlocks);
  };

  const moveBlock = (index: number, dir: 'up'|'down') => {
    const newIdx = dir === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= formData.blocks.length) return;
    const newBlocks = [...formData.blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[newIdx];
    newBlocks[newIdx] = temp;
    handleChange('blocks', newBlocks);
  };

  const handleImageUpload = async (e: any, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await compressImage(file, 1200, 0.8);
        callback(url);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border flex flex-col h-full min-h-[800px] w-full">
      <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10 rounded-t-xl">
        <h2 className="text-2xl font-bold">{post.id ? 'Sửa Bài Viết' : 'Bài Viết Mới'}</h2>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg font-medium hover:bg-gray-50">Huỷ bỏ</button>
          <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 inline-flex items-center gap-2">
            {isSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
            Lưu bài viết
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex gap-6">
        <div className="flex-1 space-y-6 max-w-4xl">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold text-lg mb-4">Thông tin cơ bản</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Tiêu đề <span className="text-red-500">*</span></label>
              <input type="text" value={formData.title} onChange={e => {
                handleChange('title', e.target.value);
                if (!formData.slug && e.target.value) handleChange('slug', e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
              }} className="w-full px-3 py-2 border rounded-lg focus:ring-brand-500 font-medium text-lg" placeholder="Nhập tiêu đề..." />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL) <span className="text-red-500">*</span></label>
                <input type="text" value={formData.slug} onChange={e => handleChange('slug', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Danh mục</label>
                <input type="text" value={formData.category} onChange={e => handleChange('category', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-brand-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Trích dẫn</label>
              <textarea value={formData.excerpt || ''} onChange={e => handleChange('excerpt', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-brand-500 h-20" />
            </div>
            
            <div>
               <label className="block text-sm font-medium mb-1">Ảnh đại diện</label>
               <div className="flex gap-4">
                  {formData.image && <img src={formData.image} alt="cover" className="w-32 h-20 object-cover rounded-lg border" />}
                  <div className="flex-1 flex flex-col gap-2">
                     <input type="text" placeholder="URL ảnh..." value={formData.image} onChange={e => handleChange('image', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                     <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => handleChange('image', url))} className="text-sm" />
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center justify-between">
              Nội dung bài viết
            </h3>
            
            <div className="space-y-4">
              {formData.blocks.map((block: BlockData, idx: number) => (
                <div key={block.id} className="border border-gray-200 rounded-lg bg-gray-50 group">
                  <div className="flex items-center justify-between p-3 border-b bg-white rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase tracking-wider">
                        {BLOCK_TYPES.find(t => t.value === block.type)?.label || block.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveBlock(idx, 'up')} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ArrowUp className="w-4 h-4"/></button>
                      <button onClick={() => moveBlock(idx, 'down')} disabled={idx === formData.blocks.length - 1} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ArrowDown className="w-4 h-4"/></button>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <button onClick={() => removeBlock(idx)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* H2, H3 */}
                    {(block.type === 'h2' || block.type === 'h3') && (
                      <input type="text" value={block.content || ''} onChange={e => updateBlock(idx, { content: e.target.value })} className={`w-full bg-transparent border-0 border-b border-gray-300 focus:ring-0 focus:border-brand-500 px-0 py-2 ${block.type === 'h2' ? 'text-2xl font-bold' : 'text-xl font-semibold'}`} placeholder="Nhập tiêu đề..." />
                    )}
                    
                    {/* Paragraph, Note, Warning, Advice */}
                    {['paragraph', 'note', 'warning', 'advice'].includes(block.type) && (
                      <textarea value={block.content || ''} onChange={e => updateBlock(idx, { content: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-brand-500" placeholder="Nhập nội dung văn bản..." />
                    )}

                    {/* Lists */}
                    {(block.type === 'bullet_list' || block.type === 'numbered_list') && (
                      <div className="space-y-2">
                        {block.items?.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex gap-2 items-start">
                            <span className="mt-2 text-gray-400">{block.type === 'numbered_list' ? `${itemIdx + 1}.` : '•'}</span>
                            <textarea value={item} onChange={e => {
                              const newItems = [...(block.items || [])];
                              newItems[itemIdx] = e.target.value;
                              updateBlock(idx, { items: newItems });
                            }} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white" rows={2}/>
                            <button onClick={() => {
                              const newItems = [...(block.items || [])];
                              newItems.splice(itemIdx, 1);
                              updateBlock(idx, { items: newItems });
                            }} className="p-2 text-red-500 hover:bg-red-50 rounded"><X className="w-4 h-4"/></button>
                          </div>
                        ))}
                        <button onClick={() => updateBlock(idx, { items: [...(block.items || []), ''] })} className="text-sm font-medium text-brand-600 hover:text-brand-800">+ Thêm dòng</button>
                      </div>
                    )}

                    {/* Single Image */}
                    {block.type === 'image' && (
                      <div className="space-y-3 p-4 bg-white border rounded-lg">
                        {block.image?.url && <img src={block.image.url} alt="" className="w-full h-48 object-contain bg-gray-100 rounded" />}
                        <div className="flex gap-3">
                          <input type="text" placeholder="URL Ảnh" value={block.image?.url || ''} onChange={e => updateBlock(idx, { image: { ...block.image, url: e.target.value } as any })} className="flex-1 px-3 py-2 border rounded" />
                          <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => updateBlock(idx, { image: { ...block.image, url } as any }))} className="w-48 text-sm pt-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Alt text SEO" value={block.image?.alt || ''} onChange={e => updateBlock(idx, { image: { ...block.image, alt: e.target.value } as any })} className="px-3 py-2 border rounded" />
                          <input type="text" placeholder="Caption (ghi chú ảnh)" value={block.image?.caption || ''} onChange={e => updateBlock(idx, { image: { ...block.image, caption: e.target.value } as any })} className="px-3 py-2 border rounded" />
                        </div>
                      </div>
                    )}

                    {/* Image + Text */}
                    {(block.type === 'image_text' || block.type === 'text_image') && (
                      <div className="space-y-3 bg-white p-4 border rounded-lg">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className={`w-full md:w-1/3 space-y-2 border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-4 ${block.type === 'text_image' ? 'md:order-2 md:border-l md:border-r-0 md:pl-4 md:pr-0' : ''}`}>
                            <label className="text-xs font-bold text-gray-500 uppercase">Hình ảnh</label>
                            {block.image?.url && <img src={block.image.url} alt="" className="w-full h-32 object-cover rounded" />}
                            <input type="text" placeholder="URL Ảnh" value={block.image?.url || ''} onChange={e => updateBlock(idx, { image: { ...block.image, url: e.target.value } as any })} className="w-full px-2 py-1 text-sm border rounded" />
                            <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => updateBlock(idx, { image: { ...block.image, url } as any }))} className="w-full text-xs" />
                            <input type="text" placeholder="Alt text" value={block.image?.alt || ''} onChange={e => updateBlock(idx, { image: { ...block.image, alt: e.target.value } as any })} className="w-full px-2 py-1 text-sm border rounded" />  
                          </div>
                          <div className={`w-full md:w-2/3 space-y-2 ${block.type === 'text_image' ? 'md:order-1' : ''}`}>
                             <label className="text-xs font-bold text-gray-500 uppercase">Nội dung văn bản</label>
                             <textarea value={block.content || ''} onChange={e => updateBlock(idx, { content: e.target.value })} className="w-full h-32 px-3 py-2 border rounded focus:ring-2 focus:ring-brand-500" placeholder="Nhập văn bản hiển thị song song với ảnh..." />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gallery / 2 Images */}
                    {(block.type === 'two_images' || block.type === 'gallery') && (
                      <div className="space-y-4 p-4 bg-white border rounded-lg">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          {block.images?.map((img, imgIdx) => (
                            <div key={imgIdx} className="space-y-2 border p-3 rounded relative group">
                              <button onClick={() => {
                                  const newImgs = [...(block.images || [])];
                                  newImgs.splice(imgIdx, 1);
                                  updateBlock(idx, { images: newImgs });
                                }} className="absolute top-2 right-2 p-1 bg-white rounded shadow text-red-500 opacity-0 group-hover:opacity-100 z-10"><X className="w-4 h-4"/></button>
                              
                              {img.url && <img src={img.url} alt="" className="w-full h-32 object-cover rounded" />}
                              <input type="text" placeholder="URL Ảnh" value={img.url || ''} onChange={e => {
                                const newImgs = [...(block.images || [])];
                                newImgs[imgIdx] = { ...img, url: e.target.value };
                                updateBlock(idx, { images: newImgs });
                              }} className="w-full px-2 py-1 text-sm border rounded" />
                              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => {
                                const newImgs = [...(block.images || [])];
                                newImgs[imgIdx] = { ...img, url };
                                updateBlock(idx, { images: newImgs });
                              })} className="w-full text-xs" />
                              <input type="text" placeholder="Alt text" value={img.alt || ''} onChange={e => {
                                const newImgs = [...(block.images || [])];
                                newImgs[imgIdx] = { ...img, alt: e.target.value };
                                updateBlock(idx, { images: newImgs });
                              }} className="w-full px-2 py-1 text-sm border rounded" />
                              <input type="text" placeholder="Caption" value={img.caption || ''} onChange={e => {
                                const newImgs = [...(block.images || [])];
                                newImgs[imgIdx] = { ...img, caption: e.target.value };
                                updateBlock(idx, { images: newImgs });
                              }} className="w-full px-2 py-1 text-sm border rounded" />
                            </div>
                          ))}
                        </div>
                        {block.type === 'gallery' && (
                          <button onClick={() => updateBlock(idx, { images: [...(block.images || []), { url: '' }] })} className="text-sm font-medium text-brand-600">+ Thêm ảnh vào gallery</button>
                        )}
                      </div>
                    )}

                    {/* Table */}
                    {block.type === 'table' && (
                      <div className="overflow-x-auto bg-white p-4 border rounded-lg">
                        <table className="w-full border-collapse">
                          <tbody>
                            {block.tableData?.map((row, rowIdx) => (
                              <tr key={rowIdx}>
                                {row.map((cell, colIdx) => (
                                  <td key={colIdx} className="p-1">
                                    <input type="text" value={cell} onChange={e => {
                                      const newData = [...(block.tableData || [])];
                                      newData[rowIdx] = [...newData[rowIdx]];
                                      newData[rowIdx][colIdx] = e.target.value;
                                      updateBlock(idx, { tableData: newData });
                                    }} className={`w-full px-2 py-2 border rounded ${rowIdx === 0 ? 'bg-gray-100 font-bold' : ''}`} />
                                  </td>
                                ))}
                                <td className="w-8">
                                  <button onClick={() => {
                                    const newData = [...(block.tableData || [])];
                                    newData.splice(rowIdx, 1);
                                    updateBlock(idx, { tableData: newData });
                                  }} className="p-1 text-red-500 hover:bg-red-50 rounded"><X className="w-4 h-4"/></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="mt-3 flex gap-4">
                          <button onClick={() => {
                            const newData = [...(block.tableData || [])];
                            const numCols = newData[0]?.length || 2;
                            newData.push(Array(numCols).fill(''));
                            updateBlock(idx, { tableData: newData });
                          }} className="text-sm font-medium text-brand-600">+ Thêm Hàng</button>
                          
                          <button onClick={() => {
                             const newData = [...(block.tableData || [])];
                             newData.forEach(r => r.push(''));
                             updateBlock(idx, { tableData: newData });
                          }} className="text-sm font-medium text-brand-600">+ Thêm Cột</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Block Menu */}
              <div className="pt-4 mt-6 border-t border-dashed border-gray-300">
                <label className="text-sm font-bold text-gray-700 mb-3 block">Thêm Block mới:</label>
                <div className="flex flex-wrap gap-2">
                  {BLOCK_TYPES.map(type => (
                    <button key={type.value} onClick={() => handleAddBlock(type.value as BlockType)} className="px-3 py-1.5 bg-gray-100 hover:bg-brand-50 hover:text-brand-700 text-sm font-medium text-gray-700 rounded-lg border transition-colors shadow-sm active:scale-95">
                      + {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="w-72 flex-shrink-0 space-y-6">
          <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold text-lg mb-2">Trạng thái & SEO</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">Trạng thái</label>
              <select value={formData.status} onChange={e => handleChange('status', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-brand-500">
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Ngày đăng</label>
              <input type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div className="pt-4 border-t">
              <label className="block text-sm font-medium mb-1">Meta Title</label>
              <input type="text" value={formData.metaTitle || ''} onChange={e => handleChange('metaTitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-brand-500 text-sm" placeholder="Mặc định lấy tiêu đề bài" />
              <p className="text-xs text-gray-500 mt-1">SEO Title lý tưởng ~60 ký tự</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <textarea value={formData.metaDescription || ''} onChange={e => handleChange('metaDescription', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-brand-500 h-24 text-sm" placeholder="Mô tả SEO..." />
              <p className="text-xs text-gray-500 mt-1">SEO Description ~150-160 ký tự</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
