import { useState } from 'react';
import { X, UserPlus, Send, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface AddLeadModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export function AddLeadModal({ open, onClose, onCreated }: AddLeadModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [source, setSource] = useState('manual');
    const [status, setStatus] = useState('new');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setSaving(true);
        setError('');
        try {
            const token = localStorage.getItem('admin_token');
            await api.post('/admin/leads', {
                name: name.trim(),
                email: email.trim() || null,
                phone: phone.trim() || null,
                source,
                status,
                notes: notes.trim() || null,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setName(''); setEmail(''); setPhone(''); setNotes('');
            onCreated();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add lead.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 backdrop-blur-sm sm:p-4"
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <UserPlus size={16} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">Add New Lead</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
                    {error && <p className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-2 rounded-xl">{error}</p>}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Full Name *</label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)}
                            placeholder="e.g. Priya Sharma"
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="priya@example.com"
                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Phone</label>
                            <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Source</label>
                            <select value={source} onChange={e => setSource(e.target.value)}
                                className="w-full px-3 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50">
                                <option value="manual">Manual Entry</option>
                                <option value="import">Resume Import</option>
                                <option value="builder">Builder</option>
                                <option value="grader">Free Grader</option>
                                <option value="referral">Referral</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Status</label>
                            <select value={status} onChange={e => setStatus(e.target.value)}
                                className="w-full px-3 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50">
                                <option value="new">New</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="contacted">Contacted</option>
                                <option value="interviewing">Interviewing</option>
                                <option value="hired">Hired</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Notes</label>
                        <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
                            placeholder="Optional context or role interest…"
                            className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white resize-none" />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-60">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                            {saving ? 'Saving…' : 'Save Lead'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface BulkEmailModalProps {
    open: boolean;
    selectedIds: number[];
    onClose: () => void;
    onSent: () => void;
}

export function BulkEmailModal({ open, selectedIds, onClose, onSent }: BulkEmailModalProps) {
    const [subject, setSubject] = useState('Boost your ATS resume score on ATSense');
    const [body, setBody] = useState(
        `Hi {name},\n\nThanks for trying ATSense! Paste any job description into Deep Tailor inside our Builder to automatically match keywords and lift your ATS score.\n\nBest,\nThe ATSense Team`
    );
    const [sending, setSending] = useState(false);

    if (!open) return null;

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !body.trim()) return;
        setSending(true);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await api.post('/admin/leads/bulk-email', {
                ids: selectedIds,
                subject: subject.trim(),
                body: body.trim(),
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.alert(res.data?.message || 'Bulk emails sent!');
            onSent();
            onClose();
        } catch (err: any) {
            window.alert(err.response?.data?.message || 'Failed to send bulk email.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 backdrop-blur-sm sm:p-4"
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Send size={15} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm">Bulk Email Selected Leads</h3>
                            <p className="text-[11px] text-slate-400">{selectedIds.length} lead(s) selected · Use {'{name}'} for personalization</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSend} className="p-5 space-y-3.5">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Subject</label>
                        <input type="text" required value={subject} onChange={e => setSubject(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Message</label>
                        <textarea rows={5} required value={body} onChange={e => setBody(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white resize-none" />
                    </div>
                    <div className="flex gap-2 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                            Cancel
                        </button>
                        <button type="submit" disabled={sending}
                            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-60">
                            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            {sending ? 'Sending…' : `Send to ${selectedIds.length}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
