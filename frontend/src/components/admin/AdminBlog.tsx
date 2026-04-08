import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Globe, EyeOff, Save, X } from 'lucide-react';
import api from '../../services/api';

export default function AdminBlog() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);
    const [formData, setFormData] = useState({ title: '', slug: '', category: '', cover_image: '', content: '', excerpt: '', meta_title: '', meta_description: '', is_published: false });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const res = await api.get('/admin/posts', { headers: { Authorization: `Bearer ${token}` } });
            setPosts(res.data.data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleOpenModal = (post = null) => {
        if (post) {
            setEditingPost(post);
            setFormData(post);
        } else {
            setEditingPost(null);
            setFormData({ title: '', slug: '', category: '', cover_image: '', content: '', excerpt: '', meta_title: '', meta_description: '', is_published: false });
        }
        setIsModalOpen(true);
    };

    const handleSavePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            if (editingPost) {
                await api.put(`/admin/posts/${editingPost.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await api.post('/admin/posts', formData, { headers: { Authorization: `Bearer ${token}` } });
            }
            setIsModalOpen(false);
            fetchPosts();
        } catch (err) { console.error(err); alert("Failed to save post. Ensure slug is unique."); } finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            await api.delete(`/admin/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchPosts();
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="p-8 text-center text-sm text-gray-500 font-bold animate-pulse">Loading Content Engine...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Content Engine</h2>
                    <p className="text-xs text-gray-400 font-medium">Manage SEO blog posts and articles</p>
                </div>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95">
                    <Plus size={14} /> New Post
                </button>
            </div>
            
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Title</th>
                            <th className="px-4 py-3 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Status</th>
                            <th className="px-4 py-3 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Last Modified</th>
                            <th className="px-4 py-3 text-[10px] uppercase font-bold text-gray-400 tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-sm font-semibold text-gray-400">No content published yet.</td>
                            </tr>
                        ) : posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-4 font-bold text-sm text-gray-800">{post.title}</td>
                                <td className="px-4 py-4">
                                    {post.is_published ? 
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100"><Globe size={10} /> Published</span> : 
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100"><EyeOff size={10} /> Draft</span>
                                    }
                                </td>
                                <td className="px-4 py-4 text-xs font-semibold text-gray-500">{new Date(post.updated_at).toLocaleDateString()}</td>
                                <td className="px-4 py-4 text-right space-x-2">
                                    <button onClick={() => handleOpenModal(post)} className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-md transition-colors"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(post.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Post Editor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-900">{editingPost ? 'Edit Post' : 'Create New Post'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg"><X size={16} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="post-form" onSubmit={handleSavePost} className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">Post Title *</label>
                                        <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} 
                                            className="w-full px-4 py-2.5 text-sm font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="e.g. Top 10 Resume Tips" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">URL Slug *</label>
                                        <input required type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} 
                                            className="w-full px-4 py-2.5 text-sm font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="e.g. top-10-resume-tips" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">Category</label>
                                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} 
                                            className="w-full px-4 py-2.5 text-sm font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none">
                                            <option value="">Select a category</option>
                                            <option value="ATS Tips">ATS Tips</option>
                                            <option value="LinkedIn">LinkedIn</option>
                                            <option value="Job Search">Job Search</option>
                                            <option value="Templates">Templates</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">Cover Image (URL)</label>
                                        <input type="text" value={formData.cover_image} onChange={e => setFormData({ ...formData, cover_image: e.target.value })} 
                                            className="w-full px-4 py-2.5 text-sm font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="https://unsplash.com/..." />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">Main Content (Markdown/HTML) *</label>
                                    <textarea required rows={8} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} 
                                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none font-mono" placeholder="Write your post content here..." />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">Short Excerpt</label>
                                    <textarea rows={2} value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} 
                                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="Brief summary for blog cards..." />
                                </div>

                                <div className="grid grid-cols-2 gap-5 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                                    <div className="col-span-2"><h4 className="text-xs font-bold text-gray-900">SEO Meta Data</h4></div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Meta Title</label>
                                        <input type="text" value={formData.meta_title} onChange={e => setFormData({ ...formData, meta_title: e.target.value })} 
                                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Meta Description</label>
                                        <input type="text" value={formData.meta_description} onChange={e => setFormData({ ...formData, meta_description: e.target.value })} 
                                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({ ...formData, is_published: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded" />
                                <span className="text-sm font-bold text-gray-700">Publish immediately</span>
                            </label>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" form="post-form" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 border border-indigo-700 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50">
                                    <Save size={16} /> {saving ? 'Saving...' : 'Save Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
