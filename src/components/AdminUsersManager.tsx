'use client';
import { useState, useEffect } from 'react';
import { db, collection, getDocs, doc, setDoc, deleteDoc, signInWithEmailAndPassword, signOut } from '../localDB';
import { Trash2, Plus, X } from 'lucide-react';

export default function AdminUsersManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'admins'));
      setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch(e) {
      // console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    setError('');
    
    try {
      const id = Date.now().toString();
      await setDoc(doc(db, 'admins', id), { email: newEmail });
      
      setNewEmail('');
      setNewPassword('');
      setIsCreating(false);
      fetchUsers();
      alert("Tạo tài khoản quản trị thành công!");
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo tài khoản');
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Xóa quyền quản trị của tài khoản này? (Tài khoản vẫn tồn tại nhưng không thể đăng nhập quản trị)")) return;
    try {
      await deleteDoc(doc(db, 'admins', id));
      fetchUsers();
    } catch (e) {
      // console.error(e);
      alert("Không có quyền phục hồi/xóa");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
        <h2 className="text-xl text-gray-800 font-bold">Thành viên Quản trị</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
        >
          <Plus className="w-4 h-4" /> Thêm Quản trị viên
        </button>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="w-full flex flex-col gap-4 animate-pulse pt-2">
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
            <div className="h-12 bg-gray-50 rounded-lg w-full"></div>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="pb-3">Email</th>
                <th className="pb-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b last:border-b-0">
                  <td className="py-4">{u.email || u.id}</td>
                  <td className="py-4">
                    <button onClick={() => handleDelete(u.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold">Tạo Quản trị viên</h3>
              <button onClick={() => setIsCreating(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {error && <div className="mb-4 text-red-500 bg-red-50 p-3 rounded-lg text-sm">{error}</div>}
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                  <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border p-2 rounded" minLength={6} />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 hover:bg-gray-100 rounded-lg">Hủy</button>
                  <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Tạo mới</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
