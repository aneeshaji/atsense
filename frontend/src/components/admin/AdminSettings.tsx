import { useState, useEffect } from 'react';
import { Save, Globe, Info, BarChart3, Search, Code } from 'lucide-react';

import api from '../../services/api';

export default function AdminSettings() {
    const [settings, setSettings] = useState<{setting_key: string, setting_value: string, description: string}[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeGroup, setActiveGroup] = useState<'general' | 'seo' | 'analytics'>('general');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const res = await api.get('/admin/settings', { headers: { Authorization: `Bearer ${token}` } });
            setSettings(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            await api.post('/admin/settings', { settings }, { headers: { Authorization: `Bearer ${token}` } });
            alert("Matrix Synchronized! All configurations updated.");
        } catch (err) {
            console.error(err);
            alert("Sync Failed. Verification required.");
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key: string, val: string) => {
        setSettings(prev => prev.map(s => s.setting_key === key ? { ...s, setting_value: val } : s));
    };

    const findSetting = (key: string) => settings.find(s => s.setting_key === key);

    if (loading) return (
        <div className="p-12 text-center">
            <div className="w-10 h-10 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Polling System Matrix...</p>
        </div>
    );

    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Platform Configurations</h2>
                    <p className="text-xs text-gray-400 font-medium">Global parameters for SEO, Analytics, and System behavior</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button onClick={() => setActiveGroup('general')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeGroup === 'general' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>General</button>
                    <button onClick={() => setActiveGroup('seo')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeGroup === 'seo' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>SEO Hub</button>
                    <button onClick={() => setActiveGroup('analytics')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeGroup === 'analytics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Analytics</button>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                
                {/* General Settings */}
                {activeGroup === 'general' && (
                    <div className="space-y-5 animate-fade-in">
                        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex gap-4 items-start mb-6">
                            <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-indigo-700 leading-relaxed font-medium">These settings affect the core behavior and identity of the platform.</p>
                        </div>
                        
                        {['site_title', 'maintenance_mode'].map(key => {
                            const s = findSetting(key);
                            if (!s) return null;
                            return (
                                <div key={key} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{s.setting_key.replace(/_/g, ' ')}</label>
                                    {key === 'maintenance_mode' ? (
                                        <div className="flex gap-4">
                                            {['false', 'true'].map(val => (
                                                <button key={val} type="button" onClick={() => updateSetting(key, val)} 
                                                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${s.setting_value === val ? (val === 'true' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-indigo-50 border-indigo-200 text-indigo-600') : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                                                    {val === 'true' ? 'Locked (ON)' : 'Public (OFF)'}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <input className="w-full px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all" 
                                            value={s.setting_value} onChange={e => updateSetting(key, e.target.value)} />
                                    )}
                                    <p className="mt-3 text-[10px] text-gray-400 font-medium italic">{s.description}</p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* SEO Hub */}
                {activeGroup === 'seo' && (
                    <div className="space-y-5 animate-fade-in">
                        <header className="flex items-center gap-3 mb-6">
                            <Search size={20} className="text-indigo-600" />
                            <h3 className="font-bold text-gray-900">Optimization Matrix</h3>
                        </header>
                        
                        {['default_seo_description', 'google_search_console_tag', 'seo_indexing'].map(key => {
                            const s = findSetting(key);
                            if (!s) return null;
                            return (
                                <div key={key} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{s.setting_key.replace(/_/g, ' ')}</label>
                                    {key === 'seo_indexing' ? (
                                        <div className="flex gap-4">
                                            {['true', 'false'].map(val => (
                                                <button key={val} type="button" onClick={() => updateSetting(key, val)} 
                                                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${s.setting_value === val ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-100 text-gray-400'}`}>
                                                    {val === 'true' ? 'Allow Indexing' : 'No-Index'}
                                                </button>
                                            ))}
                                        </div>
                                    ) : key === 'default_seo_description' ? (
                                        <textarea rows={3} className="w-full px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all " 
                                            value={s.setting_value} onChange={e => updateSetting(key, e.target.value)} />
                                    ) : (
                                        <input className="w-full px-4 py-3 text-sm font-mono text-indigo-600 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all" 
                                            value={s.setting_value} onChange={e => updateSetting(key, e.target.value)} placeholder="<meta name='google-site-verification' content='...' />" />
                                    )}
                                    <p className="mt-3 text-[10px] text-gray-400 font-medium italic">{s.description}</p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Analytics Group */}
                {activeGroup === 'analytics' && (
                    <div className="space-y-5 animate-fade-in">
                         <header className="flex items-center gap-3 mb-6">
                            <BarChart3 size={20} className="text-indigo-600" />
                            <h3 className="font-bold text-gray-900">Traffic Integration</h3>
                        </header>
                        
                        {['google_analytics_id'].map(key => {
                            const s = findSetting(key);
                            if (!s) return null;
                            return (
                                <div key={key} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Measurement ID</label>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                            <Code size={18} className="text-indigo-500" />
                                        </div>
                                        <input className="flex-1 px-4 py-3 text-sm font-mono text-indigo-600 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all" 
                                            value={s.setting_value} onChange={e => updateSetting(key, e.target.value)} placeholder="G-XXXXXXXXXX" />
                                    </div>
                                    <p className="mt-3 text-[10px] text-gray-400 font-medium italic">{s.description}</p>
                                </div>
                            );
                        })}

                        <div className="p-8 bg-gray-900 rounded-3xl text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BarChart3 size={80} />
                            </div>
                            <h4 className="text-lg font-black mb-2">Advanced Analytics</h4>
                            <p className="text-xs text-gray-400 mb-6 leading-relaxed max-w-md">Once configured, traffic data will begin streaming to your Google Analytics dashboard. Site conversions for resume exports and builder usage will be tracked automatically.</p>
                            <a href="https://analytics.google.com" target="_blank" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                External Dashboard <Globe size={14} />
                            </a>
                        </div>
                    </div>
                )}

                <button type="submit" disabled={saving} className="w-full h-14 flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50">
                    <Save size={18} /> {saving ? 'Pushing Configuration...' : 'Commit Changes to Cloud'}
                </button>
            </form>
        </div>
    );
}
