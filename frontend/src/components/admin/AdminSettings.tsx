import { useState, useEffect } from 'react';
import { Save, Globe } from 'lucide-react';
import api from '../../services/api';

export default function AdminSettings() {
    const [settings, setSettings] = useState<{setting_key: string, setting_value: string, description: string}[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const res = await api.get('/admin/settings', { headers: { Authorization: `Bearer ${token}` } });
            
            // Provide deafults if DB is empty
            const dbSettings = res.data;
            if (dbSettings.length === 0) {
                setSettings([
                    { setting_key: 'site_title', setting_value: 'ATSense | Resume Intelligence', description: 'Global Title Tag' },
                    { setting_key: 'maintenance_mode', setting_value: 'false', description: 'Enable Maintenance Mode (true/false)' },
                    { setting_key: 'default_seo_description', setting_value: 'Build high converting resumes.', description: 'Default Meta Description' }
                ]);
            } else {
                setSettings(dbSettings);
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            await api.post('/admin/settings', { settings }, { headers: { Authorization: `Bearer ${token}` } });
            alert("Settings saved!");
        } catch (err) { console.error(err); alert("Failed to save settings"); } finally { setSaving(false); }
    };

    const updateSetting = (index: number, val: string) => {
        const newArr = [...settings];
        newArr[index].setting_value = val;
        setSettings(newArr);
    };

    if (loading) return <div className="p-8 text-center text-sm text-gray-500 font-bold animate-pulse">Loading Platform Matrix...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Globe size={20} className="text-indigo-600" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Global Configurations</h2>
                    <p className="text-xs text-gray-400 font-medium">Core platform settings and SEO variables</p>
                </div>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6">
                {settings.map((set, i) => (
                    <div key={i} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-1">{set.setting_key.replace(/_/g, ' ')}</label>
                        <p className="text-[10px] text-gray-400 font-medium mb-3">{set.description}</p>
                        {set.setting_key === 'maintenance_mode' ? (
                            <select 
                                className="w-full px-4 py-2.5 text-sm font-semibold border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all shadow-sm cursor-pointer"
                                value={set.setting_value} 
                                onChange={e => updateSetting(i, e.target.value)} 
                            >
                                <option value="false">Off (Live Status)</option>
                                <option value="true">On (Maintenance Mode Active)</option>
                            </select>
                        ) : (
                            <input 
                                className="w-full px-4 py-2.5 text-sm font-semibold border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all shadow-sm"
                                type="text" 
                                value={set.setting_value} 
                                onChange={e => updateSetting(i, e.target.value)} 
                            />
                        )}
                    </div>
                ))}

                <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                    <Save size={16} /> {saving ? 'Syncing...' : 'Synchronize Configurations'}
                </button>
            </form>
        </div>
    );
}
