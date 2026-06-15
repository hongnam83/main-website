import React, { useState, useEffect } from 'react';
import { collection, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getDocs, getDoc } from '../localDB';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Check, X, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../lib/imageUtils';

export default function AdminBlogManager() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'blogPosts'));
      let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPosts(data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (post: any) => {
    setEditingPost({
      ...post,
      blocks: post.blocks || [],
      showTOC: post.showTOC ?? true,
      slug: post.slug || post.id,
    });
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setEditingPost({
      id: '',
      title: '',
      slug: '',
      seoTitle: '',
      seoDescription: '',
      category: '',
      image: '',
      showTOC: true,
      blocks: []
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingPost(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!editingPost.title) return alert("Vui lòng nhập tiêu đề");
    if (!editingPost.slug) return alert("Vui lòng nhập đường dẫn (slug)");

    const postId = editingPost.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const updateData = { ...editingPost, id: postId };

    try {
      if (isCreating) {
         const existing = await getDoc(doc(db, 'blogPosts', postId));
         if (existing.exists()) {
            alert("Đường dẫn này đã tồn tại, vui lòng chọn đường dẫn khác.");
            return;
         }
      }
      
      await setDoc(doc(db, 'blogPosts', postId), updateData, { merge: true });
      if (!isCreating && postId !== editingPost.id) {
          // If slug changed, delete old one
          await deleteDoc(doc(db, 'blogPosts', editingPost.id));
      }

      setEditingPost(null);
      setIsCreating(false);
      fetchPosts();
    } catch (e) {
      console.error("Error saving post", e);
      alert("Đã xảy ra lỗi khi lưu");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      try {
        await deleteDoc(doc(db, 'blogPosts', id));
        fetchPosts();
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) return <div>Đang tải danh sách bài viết...</div>;

  if (editingPost) {
    return (
      <BlogEditor 
        post={editingPost} 
        onChange={setEditingPost} 
        onSave={handleSave} 
        onCancel={handleCancel} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold font-sans">Quản lý Góc kiến thức</h2>
        <button onClick={handleCreateNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus size={18} /> Viết bài mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">Bài viết</th>
                <th className="p-4 font-semibold text-gray-600">Danh mục</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{post.slug}</div>
                  </td>
                  <td className="p-4 text-gray-600">{post.category}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(post)} className="text-blue-600 hover:text-blue-800 p-2">Sửa</button>
                    <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700 p-2 ml-2">Xóa</button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">Chưa có bài viết nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const BLOCK_TYPES = [
  { id: 'h2', label: 'Tiêu đề mục lớn' },
  { id: 'h3', label: 'Tiêu đề mục nhỏ' },
  { id: 'p', label: 'Đoạn văn bản' },
  { id: 'ul', label: 'Danh sách gạch đầu dòng' },
  { id: 'ol', label: 'Danh sách đánh số' },
  { id: 'table', label: 'Bảng' },
  { id: 'note', label: 'Khung lưu ý' },
  { id: 'warning', label: 'Khung cảnh báo' },
  { id: 'advice', label: 'Khung lời khuyên' },
  { id: 'image', label: 'Ảnh đơn' },
  { id: 'figure', label: 'Ảnh kèm chú thích' },
  { id: 'image-text', label: 'Ảnh bên cạnh chữ' },
  { id: 'images-2', label: 'Hai ảnh song song' },
  { id: 'gallery', label: 'Bộ sưu tập nhiều ảnh' },
];

function BlogEditor({ post, onChange, onSave, onCancel }: any) {
  
  const setField = (field: string, value: any) => {
    onChange({ ...post, [field]: value });
  };

  const addBlock = (type: string) => {
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      data: getDefaultDataForBlock(type)
    };
    setField('blocks', [...(post.blocks || []), newBlock]);
  };

  const updateBlock = (index: number, data: any) => {
    const newBlocks = [...post.blocks];
    newBlocks[index].data = data;
    setField('blocks', newBlocks);
  };

  const removeBlock = (index: number) => {
    if (confirm('Xóa khối này?')) {
      const newBlocks = [...post.blocks];
      newBlocks.splice(index, 1);
      setField('blocks', newBlocks);
    }
  };

  const moveBlock = (index: number, dir: number) => {
    const newBlocks = [...post.blocks];
    if (index + dir < 0 || index + dir >= newBlocks.length) return;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + dir];
    newBlocks[index + dir] = temp;
    setField('blocks', newBlocks);
  };

  const handleImageUpload = async (file: File) => {
    const compressed = await compressImage(file, 1200);
    return compressed;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-5xl mx-auto pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4 flex justify-between items-center rounded-t-xl shadow-sm">
        <h2 className="text-xl font-bold">Chỉnh sửa bài viết</h2>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Hủy</button>
          <button onClick={onSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu bài viết</button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Settings grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="space-y-4 md:col-span-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài viết <span className="text-red-500">*</span></label>
              <input type="text" value={post.title || ''} onChange={e => {
                const title = e.target.value;
                onChange((prev: any) => {
                  if(!prev.slug || prev.slug === '') {
                    return {...prev, title, slug: title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, '-')};
                  }
                  return {...prev, title};
                });
              }} className="w-full border border-gray-300 rounded-lg p-3 text-lg font-bold" placeholder="Nhập tiêu đề..." />
            </div>
          </div>
          
          <div className="space-y-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn bài viết (slug) <span className="text-red-500">*</span></label>
              <input type="text" value={post.slug || ''} onChange={e => setField('slug', e.target.value)} className="w-full border border-gray-300 rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề SEO</label>
              <input type="text" value={post.seoTitle || ''} onChange={e => setField('seoTitle', e.target.value)} className="w-full border border-gray-300 rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả SEO</label>
              <textarea value={post.seoDescription || ''} onChange={e => setField('seoDescription', e.target.value)} className="w-full border border-gray-300 rounded-lg p-2" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <input type="text" value={post.category || ''} onChange={e => setField('category', e.target.value)} className="w-full border border-gray-300 rounded-lg p-2" />
            </div>
          </div>

          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
                <div className="flex flex-col gap-2">
                  {post.image && <img src={post.image} className="h-32 object-cover rounded-lg border" alt="preview" />}
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if(file) {
                      const dataUrl = await handleImageUpload(file);
                      setField('image', dataUrl);
                    }
                  }} className="text-sm" />
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="showTOC" checked={post.showTOC !== false} onChange={e => setField('showTOC', e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
              <label htmlFor="showTOC" className="text-sm font-medium text-gray-700">Hiển thị mục lục bài viết tự động</label>
            </div>
          </div>
        </div>

        {/* Blocks Editor */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold border-b pb-2">Nội dung bài viết</h3>
          
          <div className="space-y-4">
            {post.blocks?.map((block: any, index: number) => (
              <div key={block.id} className="relative group bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:border-blue-300 transition-colors">
                 <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveBlock(index, -1)} disabled={index===0} className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30"><ChevronUp size={16} /></button>
                    <div className="p-1 cursor-move text-gray-400 hover:text-gray-600 flex justify-center"><GripVertical size={16} /></div>
                    <button onClick={() => moveBlock(index, 1)} disabled={index===post.blocks.length-1} className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30"><ChevronDown size={16} /></button>
                 </div>
                 
                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => removeBlock(index)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
                 </div>

                 <div className="ml-8 mr-6">
                    <div className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">{BLOCK_TYPES.find(b => b.id === block.type)?.label || block.type}</div>
                    <BlockEditor block={block} onChange={(data: any) => updateBlock(index, data)} onUpload={handleImageUpload} />
                 </div>
              </div>
            ))}
          </div>

          <div className="border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 flex flex-col items-center gap-4">
             <div className="text-gray-500 font-medium">Thêm khối nội dung mới</div>
             <div className="flex flex-wrap gap-2 justify-center">
               {BLOCK_TYPES.map(type => (
                 <button key={type.id} onClick={() => addBlock(type.id)} className="px-3 py-1.5 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm">
                   + {type.label}
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDefaultDataForBlock(type: string) {
  switch(type) {
    case 'h2':
    case 'h3':
    case 'p':
      return { text: '' };
    case 'ul':
    case 'ol':
      return { items: [''] };
    case 'table':
      return { headers: ['Cột 1', 'Cột 2'], rows: [['', '']] };
    case 'note':
    case 'warning':
    case 'advice':
      return { title: '', content: '' };
    case 'image':
      return { url: '', alt: '' };
    case 'figure':
      return { url: '', alt: '', caption: '' };
    case 'image-text':
      return { url: '', alt: '', text: '', layout: 'img-left' }; // img-left, img-right
    case 'images-2':
      return { url1: '', alt1: '', url2: '', alt2: '' };
    case 'gallery':
      return { images: [] }; // {url, alt} array
    default:
      return {};
  }
}

function BlockEditor({ block, onChange, onUpload }: any) {
  const handleChange = (field: string, val: any) => {
    onChange({...block.data, [field]: val});
  };

  const handleImageSelect = async (e: any, field: string) => {
     const file = e.target.files?.[0];
     if(file) {
        const url = await onUpload(file);
        handleChange(field, url);
     }
  };

  switch(block.type) {
    case 'h2':
      return <input type="text" value={block.data.text} onChange={e => handleChange('text', e.target.value)} className="w-full text-2xl font-bold border-b border-gray-200 focus:border-blue-500 outline-none pb-1" placeholder="Nhập tiêu đề mục lớn..." />;
    case 'h3':
      return <input type="text" value={block.data.text} onChange={e => handleChange('text', e.target.value)} className="w-full text-xl font-semibold border-b border-gray-200 focus:border-blue-500 outline-none pb-1" placeholder="Nhập tiêu đề mục nhỏ..." />;
    case 'p':
      return <textarea value={block.data.text} onChange={e => handleChange('text', e.target.value)} className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:border-blue-500 outline-none resize-y" placeholder="Nhập nội dung đoạn văn..." />;
    
    case 'ul':
    case 'ol':
      return (
        <div className="space-y-2">
          {block.data.items?.map((item: string, i: number) => (
            <div key={i} className="flex gap-2 items-start">
               <span className="mt-2 text-gray-400">{block.type === 'ul' ? '•' : `${i+1}.`}</span>
               <input type="text" value={item} onChange={e => {
                  const newItems = [...block.data.items];
                  newItems[i] = e.target.value;
                  handleChange('items', newItems);
               }} className="flex-1 p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500" />
               <button onClick={() => {
                  const newItems = [...block.data.items];
                  newItems.splice(i, 1);
                  handleChange('items', newItems);
               }} className="p-2 text-red-400 hover:text-red-600 mt-0.5"><Trash2 size={16}/></button>
            </div>
          ))}
          <button onClick={() => handleChange('items', [...(block.data.items || []), ''])} className="text-sm text-blue-600 hover:underline">+ Thêm dòng</button>
        </div>
      );

    case 'note':
    case 'warning':
    case 'advice':
      return (
         <div className={`p-4 rounded-lg border-l-4 ${block.type === 'note' ? 'bg-blue-50 border-blue-500' : block.type === 'warning' ? 'bg-amber-50 border-amber-500' : 'bg-green-50 border-green-500'}`}>
            <input type="text" value={block.data.title} onChange={e => handleChange('title', e.target.value)} className="w-full bg-transparent font-bold text-gray-800 outline-none mb-2 placeholder-gray-400" placeholder="Tiêu đề khung (tùy chọn)" />
            <textarea value={block.data.content} onChange={e => handleChange('content', e.target.value)} className="w-full h-24 bg-transparent outline-none resize-y placeholder-gray-400" placeholder="Nội dung chi tiết..." />
         </div>
      );

    case 'image':
      return (
        <div className="space-y-3">
          <div className="flex gap-4 items-center">
             <input type="file" accept="image/*" onChange={e => handleImageSelect(e, 'url')} className="text-sm" />
             <span className="text-xs text-gray-500">Hoặc URL:</span>
             <input type="text" value={block.data.url} onChange={e => handleChange('url', e.target.value)} placeholder="https://..." className="flex-1 border p-2 rounded text-sm"/>
          </div>
          {block.data.url && <img src={block.data.url} alt="preview" className="max-h-64 object-contain bg-gray-100 rounded" />}
          <input type="text" value={block.data.alt || ''} onChange={e => handleChange('alt', e.target.value)} placeholder="Mô tả ảnh cho SEO (Alt text)" className="w-full border p-2 rounded text-sm" />
        </div>
      );

    case 'figure':
      return (
        <div className="space-y-3">
          <div className="flex gap-4 items-center">
             <input type="file" accept="image/*" onChange={e => handleImageSelect(e, 'url')} className="text-sm" />
             <input type="text" value={block.data.url} onChange={e => handleChange('url', e.target.value)} placeholder="URL ảnh" className="flex-1 border p-2 rounded text-sm"/>
          </div>
          {block.data.url && <img src={block.data.url} alt="preview" className="max-h-64 object-contain bg-gray-100 rounded mx-auto" />}
          <input type="text" value={block.data.caption || ''} onChange={e => handleChange('caption', e.target.value)} placeholder="Chú thích hiển thị dưới ảnh" className="w-full border p-2 rounded" />
          <input type="text" value={block.data.alt || ''} onChange={e => handleChange('alt', e.target.value)} placeholder="Mô tả SEO" className="w-full border p-2 rounded text-sm" />
        </div>
      );

    case 'image-text':
      return (
        <div className="space-y-3 border p-4 rounded bg-gray-50">
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-1"><input type="radio" checked={block.data.layout === 'img-left'} onChange={() => handleChange('layout', 'img-left')} /> Ảnh bên trái</label>
            <label className="flex items-center gap-1"><input type="radio" checked={block.data.layout === 'img-right'} onChange={() => handleChange('layout', 'img-right')} /> Ảnh bên phải</label>
          </div>
          <div className={`flex gap-4 ${block.data.layout === 'img-right' ? 'flex-row-reverse' : ''}`}>
             <div className="flex-1 space-y-2 border-r pr-4">
                <input type="file" accept="image/*" onChange={e => handleImageSelect(e, 'url')} className="text-sm w-full mb-2" />
                {block.data.url && <img src={block.data.url} className="w-full aspect-square object-cover rounded" alt="" />}
                <input type="text" value={block.data.alt || ''} onChange={e => handleChange('alt', e.target.value)} placeholder="Mô tả SEO ảnh" className="w-full border p-2 rounded text-sm" />
             </div>
             <div className="flex-[2]">
                <textarea value={block.data.text || ''} onChange={e => handleChange('text', e.target.value)} className="w-full h-full min-h-[150px] p-2 border rounded resize-y" placeholder="Nội dung bên cạnh ảnh..." />
             </div>
          </div>
        </div>
      );
      
    case 'images-2':
      return (
        <div className="grid grid-cols-2 gap-4">
           {['1', '2'].map(num => (
              <div key={num} className="space-y-2 border p-3 rounded bg-gray-50">
                <div className="text-sm font-semibold text-gray-500">Ảnh {num}</div>
                <input type="file" accept="image/*" onChange={e => handleImageSelect(e, `url${num}`)} className="text-xs file:mr-2 w-full" />
                {block.data[`url${num}`] && <img src={block.data[`url${num}`]} className="w-full h-32 object-cover rounded" alt="" />}
                <input type="text" value={block.data[`alt${num}`] || ''} onChange={e => handleChange(`alt${num}`, e.target.value)} placeholder="Mô tả SEO" className="w-full border p-1 rounded text-sm" />
              </div>
           ))}
        </div>
      );

    case 'gallery':
      const images = block.data.images || [];
      return (
        <div className="space-y-4">
           <div className="grid grid-cols-3 gap-4">
              {images.map((img: any, i: number) => (
                <div key={i} className="relative group border p-2 rounded cursor-default bg-gray-50">
                   <img src={img.url} className="w-full h-24 object-cover rounded mb-2" alt=""/>
                   <input type="text" value={img.alt} onChange={e => {
                     const newImgs = [...images]; newImgs[i].alt = e.target.value; handleChange('images', newImgs);
                   }} className="w-full text-xs p-1 border rounded" placeholder="Alt text"/>
                   <button onClick={() => {
                      const newImgs = [...images]; newImgs.splice(i, 1); handleChange('images', newImgs);
                   }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"><X size={12}/></button>
                </div>
              ))}
              <div className="border border-dashed border-gray-300 rounded flex flex-col items-center justify-center p-4 min-h-[140px] hover:bg-gray-50 cursor-pointer relative">
                 <input type="file" accept="image/*" multiple onChange={async e => {
                    const files = Array.from(e.target.files || []);
                    const newImages = [...images];
                    for(let f of files) {
                       const url = await onUpload(f);
                       newImages.push({url, alt: ''});
                    }
                    handleChange('images', newImages);
                 }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                 <ImageIcon className="text-gray-400 mb-2" />
                 <span className="text-sm text-gray-500">Thêm ảnh</span>
              </div>
           </div>
        </div>
      );

    case 'table':
      return <TableEditor block={block} onChange={onChange} />;

    default:
      return <div className="text-gray-500">Loại khối không được hỗ trợ</div>;
  }
}

function TableEditor({ block, onChange }: any) {
  const data = block.data || { headers: [], rows: [] };
  const headers = data.headers || [];
  const rows = data.rows || [];

  const updateHeader = (i: number, val: string) => {
    const newHeaders = [...headers];
    newHeaders[i] = val;
    onChange({ ...data, headers: newHeaders });
  };

  const updateCell = (ri: number, ci: number, val: string) => {
    const newRows = [...rows];
    newRows[ri] = [...newRows[ri]];
    newRows[ri][ci] = val;
    onChange({ ...data, rows: newRows });
  };

  const addRow = () => {
    onChange({ ...data, rows: [...rows, headers.map(() => '')] });
  };

  const addCol = () => {
    onChange({ 
      ...data, 
      headers: [...headers, 'Cột mới'], 
      rows: rows.map((r: any) => [...r, '']) 
    });
  };

  const removeRow = (ri: number) => {
    const newRows = [...rows];
    newRows.splice(ri, 1);
    onChange({ ...data, rows: newRows });
  };

  const removeCol = (ci: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(ci, 1);
    const newRows = rows.map((r: any) => { const nr = [...r]; nr.splice(ci, 1); return nr; });
    onChange({ ...data, headers: newHeaders, rows: newRows });
  };

  return (
    <div className="overflow-x-auto border rounded-lg bg-gray-50 p-4">
      <div className="flex gap-2 mb-4">
         <button onClick={addCol} className="px-3 py-1 bg-white border rounded text-sm shadow-sm hover:text-blue-600">+ Thêm cột</button>
         <button onClick={addRow} className="px-3 py-1 bg-white border rounded text-sm shadow-sm hover:text-blue-600">+ Thêm dòng</button>
      </div>
      <table className="w-full text-left min-w-max border-collapse bg-white">
        <thead>
          <tr>
            {headers.map((h: string, i: number) => (
              <th key={i} className="border p-2 bg-gray-100 relative group">
                <input type="text" value={h} onChange={e => updateHeader(i, e.target.value)} className="w-full bg-transparent font-medium border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none" />
                {headers.length > 1 && <button onClick={() => removeCol(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"><X size={12}/></button>}
              </th>
            ))}
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any[], ri: number) => (
            <tr key={ri} className="group">
              {row.map((cell: string, ci: number) => (
                <td key={ci} className="border p-2">
                   <textarea value={cell} onChange={e => updateCell(ri, ci, e.target.value)} className="w-full h-10 min-w-[120px] bg-transparent outline-none resize-y" />
                </td>
              ))}
              <td className="p-2 border-none">
                 <button onClick={() => removeRow(ri)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
