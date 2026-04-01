import { useState, useEffect } from 'react';
import { ToggleRight, ToggleLeft, Activity, Palette, Plus, Save, X } from 'lucide-react';
import api from '../../services/api';

export default function AdminTemplates() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ name: '', slug: '', component_name: '', description: '', is_active: true, sort_order: 10 });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const res = await api.get('/admin/templates', { headers: { Authorization: `Bearer ${token}` } });
            setTemplates(res.data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const toggleActive = async (id: string, current: boolean) => {
        try {
            const token = localStorage.getItem('admin_token');
            setTemplates(prev => prev.map(t => t.id === id ? { ...t, is_active: !current } : t));
            await api.post(`/admin/templates/${id}/toggle`, {}, { headers: { Authorization: `Bearer ${token}` } });
        } catch (e) { console.error(e); fetchTemplates(); }
    };

    const handleSaveTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            await api.post('/admin/templates', formData, { headers: { Authorization: `Bearer ${token}` } });
            setIsModalOpen(false);
            setFormData({ name: '', slug: '', component_name: '', description: '', is_active: true, sort_order: 10 });
            fetchTemplates();
        } catch (err) { console.error(err); alert("Failed to add template. Ensure slug is unique."); } finally { setSaving(false); }
    };

    if (loading) return <div className="p-8 text-center text-sm text-gray-500 font-bold animate-pulse">Loading Design Catalog...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <Palette size={20} className="text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Design Templates</h2>
                        <p className="text-xs text-gray-400 font-medium">Control which resume layouts are accessible to users</p>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95">
                    <Plus size={14} /> New Template
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(tpl => (
                    <div key={tpl.id} className={`border rounded-2xl p-5 transition-all duration-300 ${tpl.is_active ? 'border-indigo-100 bg-white shadow-sm ring-1 ring-indigo-50' : 'border-gray-100 bg-gray-50 opacity-80'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-gray-900 text-sm">{tpl.name}</h3>
                            <button onClick={() => toggleActive(tpl.id, tpl.is_active)} className={`transition-colors duration-300 ${tpl.is_active ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-400'}`}>
                                {tpl.is_active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-4 h-10 leading-relaxed font-medium">{tpl.description || 'No description provided.'}</p>
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                            <Activity size={12} className={tpl.is_active ? 'text-emerald-500' : 'text-gray-400'} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${tpl.is_active ? 'text-emerald-700' : 'text-gray-500'}`}>{tpl.is_active ? 'Live on Site' : 'Deactivated'}</span>
                        </div>
                    </div>
                ))}
                {templates.length === 0 && (
                    <div className="col-span-full py-12 text-center text-sm font-semibold text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                        No templates found in database. Add a new template to get started.
                    </div>
                )}
            </div>

            {/* Template Generator Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-900">Add New Template</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg"><X size={16} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="template-form" onSubmit={handleSaveTemplate} className="space-y-5">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">Template Name *</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                        className="w-full px-4 py-2.5 text-sm font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="e.g. Modern Executive" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">URL Slug *</label>
                                        <input required type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} 
                                            className="w-full px-4 py-2.5 text-sm font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="e.g. modern-executive" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">React Component Name *</label>
                                        <input required type="text" value={formData.component_name} onChange={e => setFormData({ ...formData, component_name: e.target.value })} 
                                            className="w-full px-4 py-2.5 text-sm font-semibold border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="e.g. ExecutiveTemplate" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">Short Description</label>
                                    <textarea rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} 
                                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="Description visible to users in the gallery..." />
                                </div>
                            </form>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded" />
                                <span className="text-sm font-bold text-gray-700">Activate instantly</span>
                            </label>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" form="template-form" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 border border-indigo-700 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50">
                                    <Save size={16} /> {saving ? 'Saving...' : 'Create Template'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
