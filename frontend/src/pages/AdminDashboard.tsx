import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Users, LayoutDashboard, Download, LogOut, FileText,
    Search, Trash2, ChevronLeft, ChevronRight, X,
    TrendingUp, Mail, Phone, RefreshCw,
    BarChart2, Settings, CheckSquare, Square, AlertTriangle,
    Lock, Check, Eye, ArrowUpRight, Zap, Calendar, Layout, Globe,
    Activity, ShieldAlert, Info, AlertOctagon, Filter
} from 'lucide-react';
import AdminBlog from '../components/admin/AdminBlog';
import AdminTemplates from '../components/admin/AdminTemplates';
import AdminSettings from '../components/admin/AdminSettings';

interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    skills: string;
    source: string;
    s3_pdf_url: string | null;
    created_at: string;
    status: string;
    notes: string | null;
}

const STATUS_OPTIONS = [
    { value: 'new', label: 'New Lead', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    { value: 'reviewed', label: 'Reviewed', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
    { value: 'contacted', label: 'Contacted', color: 'bg-amber-50 text-amber-700 border-amber-100' },
    { value: 'interviewing', label: 'Interviewing', color: 'bg-purple-50 text-purple-700 border-purple-100' },
    { value: 'hired', label: 'Hired', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-100' },
];

const EMAIL_TEMPLATES = [
    { 
        id: 'direct', 
        label: 'Direct Message', 
        subject: 'Regarding your application at ATSense',
        body: (name: string) => `Hi ${name},\n\nI hope you're doing well. I'm reaching out regarding the resume you created/uploaded on ATSense...`
    },
    { 
        id: 'interview', 
        label: 'Interview Request', 
        subject: 'Interview Invitation: ATSense Recruitment',
        body: (name: string) => `Hi ${name},\n\nWe were impressed by your profile and would like to schedule a brief technical interview to discuss your experience further. Please let us know your availability for the coming week.`
    },
    { 
        id: 'rejection', 
        label: 'Rejection Notice', 
        subject: 'Status update regarding your application',
        body: (name: string) => `Hi ${name},\n\nThank you for sharing your resume with us. While your skills are impressive, we've decided to move forward with other candidates who more closely align with our current needs. We'll keep your profile in our talent pool for future opportunities.`
    },
];

interface PaginatedLeads {
    data: Lead[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
}

interface ChartPoint { date: string; count: number; }
interface SourceStat { source: string; count: number; }

interface Stats {
    total_leads: number;
    leads_today: number;
    leads_this_week: number;
    chart_data: ChartPoint[];
    sources: SourceStat[];
}

type View = 'overview' | 'leads' | 'analytics' | 'blog' | 'templates' | 'site_settings' | 'settings' | 'activity_log';

type LogLevel = 'all' | 'info' | 'warning' | 'error' | 'critical';

interface ActivityLogEntry {
    id: number;
    action: string;
    message: string;
    level: string;
    ip_address: string | null;
    user_agent: string | null;
    metadata: Record<string, any> | null;
    created_at: string;
}

interface PaginatedLogs {
    data: ActivityLogEntry[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

function MiniBarChart({ data }: { data: ChartPoint[] }) {
    const max = Math.max(...data.map(d => d.count), 1);
    return (
        <div className="flex items-end gap-1.5 h-24 mt-2">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                        {d.date}: <span className="font-bold">{d.count}</span>
                    </div>
                    <div
                        className="w-full rounded-t-sm transition-all duration-500 group-hover:opacity-90"
                        style={{
                            height: `${Math.max((d.count / max) * 100, 4)}%`,
                            backgroundColor: '#6366f1'
                        }}
                    />
                    <span className="text-[9px] text-gray-400 whitespace-nowrap">{d.date.split(' ')[1]}</span>
                </div>
            ))}
        </div>
    );
}

function AdminDashboard() {
    const [view, setView] = useState<View>('overview');
    const [leads, setLeads] = useState<PaginatedLeads | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [source, setSource] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [page, setPage] = useState(1);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [previewLeadId, setPreviewLeadId] = useState<number | null>(null);
    const [previewLeadName, setPreviewLeadName] = useState('');

    // Settings state
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [savingPw, setSavingPw] = useState(false);

    // CRM state
    const [updatingLead, setUpdatingLead] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(EMAIL_TEMPLATES[0]);
    const [sendingEmail, setSendingEmail] = useState(false);

    // Activity Log state
    const [logs, setLogs] = useState<PaginatedLogs | null>(null);
    const [logsLoading, setLogsLoading] = useState(false);
    const [logPage, setLogPage] = useState(1);
    const [logLevel, setLogLevel] = useState<LogLevel>('all');
    const [logSearch, setLogSearch] = useState('');
    const [logDateFrom, setLogDateFrom] = useState('');
    const [logDateTo, setLogDateTo] = useState('');
    const [purging, setPurging] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [expandedLog, setExpandedLog] = useState<number | null>(null);

    const navigate = useNavigate();

    const getToken = () => {
        const token = localStorage.getItem('admin_token');
        if (!token) { navigate('/admin/login'); return null; }
        return token;
    };

    const getApiBase = () =>
        (import.meta as any).env?.VITE_API_URL ||
        (import.meta as any).env?.VITE_API_BASE_URL ||
        'http://localhost:8000/api';

    const openPreview = (lead: Lead) => {
        setPreviewLeadId(lead.id);
        setPreviewLeadName(lead.name || 'resume');
    };

    const fetchLeads = useCallback(async (pg = 1, q = search, src = source, df = dateFrom, dt = dateTo) => {
        const token = getToken();
        if (!token) return;
        setRefreshing(true);
        try {
            const params = new URLSearchParams({ page: String(pg), per_page: '25' });
            if (q) params.set('search', q);
            if (src !== 'all') params.set('source', src);
            if (df) params.set('date_from', df);
            if (dt) params.set('date_to', dt);
            const res = await api.get(`/admin/leads?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeads(res.data);
            setSelectedIds(new Set());
        } catch (err: any) {
            if (err.response?.status === 401) handleLogout();
        } finally {
            setRefreshing(false);
        }
    }, [search, source, dateFrom, dateTo]);

    const fetchStats = useCallback(async () => {
        const token = getToken();
        if (!token) return;
        try {
            const res = await api.get('/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch (err: any) {
            if (err.response?.status === 401) handleLogout();
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) { navigate('/admin/login'); return; }
        Promise.all([fetchStats(), fetchLeads(1)]).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (view === 'leads') {
            const t = setTimeout(() => { setPage(1); fetchLeads(1, search, source, dateFrom, dateTo); }, 400);
            return () => clearTimeout(t);
        }
    }, [search, source, dateFrom, dateTo]);

    const handlePageChange = (p: number) => { setPage(p); fetchLeads(p); };

    const handleDelete = async (id: number) => {
        const token = getToken(); if (!token) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/leads/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setDeleteConfirm(null);
            if (selectedLead?.id === id) setSelectedLead(null);
            await Promise.all([fetchLeads(page), fetchStats()]);
        } finally { setDeleting(false); }
    };

    const handleBulkDelete = async () => {
        const token = getToken(); if (!token) return;
        setDeleting(true);
        try {
            await Promise.all([...selectedIds].map(id =>
                api.delete(`/admin/leads/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            ));
            setBulkDeleteConfirm(false);
            setSelectedIds(new Set());
            await Promise.all([fetchLeads(page), fetchStats()]);
        } finally { setDeleting(false); }
    };

    const toggleSelect = (id: number) => {
        const next = new Set(selectedIds);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelectedIds(next);
    };

    const toggleSelectAll = () => {
        if (!leads) return;
        if (selectedIds.size === leads.data.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(leads.data.map(l => l.id)));
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            if (token) {
                await api.post('/admin/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
            }
        } catch (e) {
            console.error('Logout error', e);
        } finally {
            localStorage.removeItem('admin_token');
            navigate('/admin/login');
        }
    };

    const downloadResume = async (url: string, name: string) => {
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${(name || 'resume').replace(/\s+/g, '_')}_resume.pdf`;
            a.click();
        } catch { window.open(url, '_blank'); }
    };

    const exportCsv = () => {
        if (!leads?.data.length) return;
        const headers = ['Date', 'Name', 'Email', 'Phone', 'Source', 'Skills', 'PDF URL'];
        const rows = [headers.join(',')];
        for (const l of leads.data) {
            let skills = '';
            try { skills = JSON.parse(l.skills || '[]').join('; '); } catch {}
            rows.push([
                new Date(l.created_at).toLocaleDateString(),
                `"${l.name || ''}"`, l.email || '', l.phone || '',
                l.source || '', `"${skills}"`, l.s3_pdf_url || ''
            ].join(','));
        }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }));
        a.download = `atsense_leads_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPw !== confirmPw) { setPwMsg({ type: 'error', text: 'New passwords do not match.' }); return; }
        if (newPw.length < 6) { setPwMsg({ type: 'error', text: 'Password must be at least 6 characters.' }); return; }
        setSavingPw(true); setPwMsg(null);
        try {
            const token = getToken(); if (!token) return;
            await api.post('/admin/change-password', { current_password: currentPw, new_password: newPw }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPwMsg({ type: 'success', text: 'Password changed successfully!' });
            setCurrentPw(''); setNewPw(''); setConfirmPw('');
        } catch (err: any) {
            setPwMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
        } finally { setSavingPw(false); }
    };

    const updateLeadDetails = async (id: number, data: { status?: string, notes?: string }) => {
        const token = getToken(); if (!token) return;
        setUpdatingLead(true);
        try {
            const res = await api.put(`/admin/leads/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local state
            if (selectedLead?.id === id) {
                setSelectedLead({ ...selectedLead, ...data });
            }
            if (leads) {
                setLeads({
                    ...leads,
                    data: leads.data.map(l => l.id === id ? { ...l, ...data } : l)
                });
            }
        } catch (err) {
            console.error('Failed to update lead:', err);
        } finally {
            setUpdatingLead(false);
        }
    };

    const handleSendEmail = async (lead: Lead) => {
        const token = getToken(); if (!token) return;
        setSendingEmail(true);
        const subject = selectedTemplate.subject;
        const body = selectedTemplate.body(lead.name || 'Candidate');
        try {
            await api.post(`/admin/leads/${lead.id}/email`, { subject, body }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.alert('Email sent successfully via Brevo/SMTP!');
        } catch (err: any) {
            console.error(err);
            window.alert(err.response?.data?.message || 'Failed to send email. Ensure SMTP is configured in .env.');
        } finally {
            setSendingEmail(false);
        }
    };

    const clearFilters = () => { setSearch(''); setSource('all'); setDateFrom(''); setDateTo(''); };

    const fetchLogs = useCallback(async (pg = 1, level = logLevel, search = logSearch, df = logDateFrom, dt = logDateTo) => {
        const token = getToken(); if (!token) return;
        setLogsLoading(true);
        try {
            const params = new URLSearchParams({ page: String(pg), per_page: '50' });
            if (level !== 'all') params.set('level', level);
            if (search) params.set('search', search);
            if (df) params.set('date_from', df);
            if (dt) params.set('date_to', dt);
            const res = await api.get(`/admin/activity-logs?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data);
        } catch (err: any) {
            if (err.response?.status === 401) handleLogout();
        } finally {
            setLogsLoading(false);
        }
    }, [logLevel, logSearch, logDateFrom, logDateTo]);

    const handlePurgeLogs = async () => {
        if (!window.confirm('Purge ALL activity logs? This cannot be undone.')) return;
        const token = getToken(); if (!token) return;
        setPurging(true);
        try {
            await api.delete('/admin/activity-logs', { headers: { Authorization: `Bearer ${token}` } });
            setLogs(null);
            await fetchLogs(1);
        } finally { setPurging(false); }
    };

    useEffect(() => {
        if (view === 'activity_log') {
            fetchLogs(1, logLevel, logSearch, logDateFrom, logDateTo);
        }
    }, [view]);

    useEffect(() => {
        if (view !== 'activity_log') return;
        const t = setTimeout(() => { setLogPage(1); fetchLogs(1, logLevel, logSearch, logDateFrom, logDateTo); }, 400);
        return () => clearTimeout(t);
    }, [logLevel, logSearch, logDateFrom, logDateTo]);

    useEffect(() => {
        if (autoRefresh && view === 'activity_log') {
            autoRefreshRef.current = setInterval(() => fetchLogs(logPage, logLevel, logSearch, logDateFrom, logDateTo), 10000);
        } else {
            if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
        }
        return () => { if (autoRefreshRef.current) clearInterval(autoRefreshRef.current); };
    }, [autoRefresh, view, logPage]);

    const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={15} /> },
        { id: 'leads', label: 'Leads', icon: <Users size={15} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={15} /> },
        { id: 'blog', label: 'Blog & Content', icon: <FileText size={15} /> },
        { id: 'templates', label: 'Templates', icon: <Layout size={15} /> },
        { id: 'site_settings', label: 'Site Settings', icon: <Globe size={15} /> },
        { id: 'activity_log', label: 'Activity Log', icon: <Activity size={15} /> },
        { id: 'settings', label: 'Admin Account', icon: <Settings size={15} /> },
    ];

    const avatarColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#14b8a6'];
    const getAvatarColor = (name: string) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-10 h-10 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                    <p className="text-gray-500 text-xs mt-4 font-medium tracking-wide">Initializing dashboard</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50/50">
            {/* Sidebar — light professional */}
            <div className="w-64 flex flex-col shrink-0 hidden md:flex bg-white border-r border-gray-200 shadow-sm z-20">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 gap-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600 shadow-sm shadow-indigo-200">
                        <FileText size={16} className="text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-slate-800 text-sm tracking-tight">ATSense</span>
                        <span className="block text-[10px] text-indigo-500 font-bold tracking-widest uppercase opacity-80">Admin Console</span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 py-6 space-y-1.5">
                    <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Main Menu</p>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                                view === item.id
                                    ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50'
                                    : 'text-slate-600 hover:text-indigo-600 hover:bg-gray-50'
                            }`}
                        >
                            <span className={`${view === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                            {item.id === 'leads' && stats && stats.total_leads > 0 && (
                                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    view === 'leads' ? 'bg-indigo-200/50 text-indigo-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {stats.total_leads}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-all duration-200 group">
                        <LogOut size={14} className="text-slate-400 group-hover:text-red-500" /> Sign Out
                    </button>
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-10">
                    <div>
                        <h1 className="text-sm font-bold text-slate-800 capitalize tracking-tight">{navItems.find(n => n.id === view)?.label}</h1>
                        <p className="text-[11px] text-gray-400 font-medium">Recruitment Intelligence Platform</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {(view === 'overview' || view === 'leads') && (
                            <button
                                onClick={() => { fetchLeads(page); fetchStats(); }}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all border border-transparent hover:border-indigo-100"
                                title="Refresh Data"
                            >
                                <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                            </button>
                        )}
                        {view === 'leads' && (
                            <button onClick={exportCsv}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 active:scale-95 transition-all">
                                <Download size={14} /> Export Dataset
                            </button>
                        )}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* ===== OVERVIEW ===== */}
                    {view === 'overview' && (
                        <>
                            {/* Stat Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {/* Total */}
                                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                            <Users size={18} />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aggregate</span>
                                    </div>
                                    <p className="text-3xl font-bold text-slate-800 tracking-tight">{stats?.total_leads ?? 0}</p>
                                    <p className="text-xs font-semibold text-slate-500 mt-1">Total Leads Captured</p>
                                </div>
                                {/* Today */}
                                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                            <Zap size={18} />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Velocity</span>
                                    </div>
                                    <p className="text-3xl font-bold text-slate-800 tracking-tight">{stats?.leads_today ?? 0}</p>
                                    <p className="text-xs font-semibold text-slate-500 mt-1">New Leads Today</p>
                                </div>
                                {/* Chart */}
                                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Traffic Trend</span>
                                        <TrendingUp size={14} className="text-indigo-500" />
                                    </div>
                                    {stats?.chart_data && <MiniBarChart data={stats.chart_data} />}
                                </div>
                            </div>

                            {/* Source + Recents row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {/* Source breakdown */}
                                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">Lead Origination</h3>
                                    <div className="space-y-4">
                                        {stats?.sources?.length ? stats.sources.map((s, i) => {
                                            const pct = Math.round((s.count / (stats.total_leads || 1)) * 100);
                                            const colors = ['#6366f1', '#10b981', '#f59e0b'];
                                            return (
                                                <div key={i}>
                                                    <div className="flex justify-between text-[11px] mb-2 font-bold">
                                                        <span className="capitalize text-slate-700">{s.source}</span>
                                                        <span className="text-gray-400">{s.count} units ({pct}%)</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-700"
                                                            style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }} />
                                                    </div>
                                                </div>
                                            );
                                        }) : <p className="text-xs text-gray-400 italic">Gathering metadata...</p>}
                                    </div>
                                </div>

                                {/* Recent leads */}
                                <div className="md:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Inquiries</h3>
                                        <button onClick={() => setView('leads')}
                                            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 transition-colors">
                                            View Full Registry <ArrowUpRight size={12} />
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        {leads?.data?.slice(0, 5).map((l, i) => (
                                            <div key={i} className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                                                onClick={() => { setView('leads'); setSelectedLead(l); }}>
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                                                    style={{ background: getAvatarColor(l.name) }}>
                                                    {(l.name || 'U')[0].toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{l.name || '—'}</p>
                                                    <p className="text-[11px] text-gray-400 font-medium truncate">{l.email || '—'}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className="text-[10px] font-bold text-gray-400 block uppercase">
                                                        {new Date(l.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-indigo-500/70 lowercase">
                                                        {l.source}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {!leads?.data?.length && (
                                            <div className="text-center py-6 border-2 border-dashed border-gray-50 rounded-xl">
                                                <p className="text-xs text-gray-400 font-medium tracking-wide">Pending incoming data stream</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ===== LEADS ===== */}
                    {view === 'leads' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Toolbar */}
                            <div className="px-6 py-5 border-b border-gray-100 flex flex-wrap items-center gap-4 bg-gray-50/30">
                                <div className="relative min-w-[280px] flex-1">
                                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" placeholder="Search by name, email, or digital footprint…" value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all placeholder:text-gray-300 shadow-sm" />
                                </div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <select value={source} onChange={e => setSource(e.target.value)}
                                        className="text-[11px] font-bold border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-600 shadow-sm appearance-none cursor-pointer">
                                        <option value="all">Global Sources</option>
                                        <option value="builder">Builder</option>
                                        <option value="export">Export</option>
                                        <option value="analysis">Analysis</option>
                                    </select>
                                    <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
                                        <Calendar size={13} className="text-gray-400" />
                                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                                            className="text-[11px] font-bold text-slate-600 bg-transparent focus:outline-none w-28 cursor-pointer" />
                                        <span className="text-gray-300 text-[10px] font-bold">TO</span>
                                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                                            className="text-[11px] font-bold text-slate-600 bg-transparent focus:outline-none w-28 cursor-pointer" />
                                    </div>
                                    {(search || source !== 'all' || dateFrom || dateTo) && (
                                        <button onClick={clearFilters}
                                            className="flex items-center gap-2 text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 transition-all">
                                            <X size={12} /> Reset
                                        </button>
                                    )}
                                </div>
                                <div className="ml-auto flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{leads?.total ?? 0} Active Entries</span>
                                </div>
                            </div>

                            {/* Bulk actions */}
                            {selectedIds.size > 0 && (
                                <div className="px-6 py-3 bg-indigo-50/50 border-b border-indigo-100 flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                                        <span className="text-xs font-bold text-indigo-700 tracking-tight">{selectedIds.size} Records Selected</span>
                                    </div>
                                    <div className="h-4 w-px bg-indigo-200" />
                                    {bulkDeleteConfirm ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-red-600 font-bold uppercase tracking-wider">Execute terminal deletion?</span>
                                            <button onClick={handleBulkDelete} disabled={deleting}
                                                className="px-4 py-1.5 text-[10px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all">
                                                {deleting ? 'WIPING...' : 'CONFIRM'}
                                            </button>
                                            <button onClick={() => setBulkDeleteConfirm(false)}
                                                className="px-4 py-1.5 text-[10px] font-bold text-slate-500 bg-white border border-gray-200 rounded-lg">
                                                CANCEL
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setBulkDeleteConfirm(true)}
                                            className="flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-all shadow-sm">
                                            <Trash2 size={12} /> Bulk Delete
                                        </button>
                                    )}
                                    <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
                                        Release Selection
                                    </button>
                                </div>
                            )}

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-6 py-4 w-10">
                                                <button onClick={toggleSelectAll} className="text-slate-400 hover:text-indigo-600 transition-colors">
                                                    {leads && selectedIds.size === leads.data.length && leads.data.length > 0
                                                        ? <CheckSquare size={16} className="text-indigo-600" />
                                                        : <Square size={16} />}
                                                </button>
                                            </th>
                                            {['Timestamp', 'Identity', 'Contact', 'Origin', 'Status', 'Deliverable', 'Actions'].map(h => (
                                                <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {!leads || leads.data.length === 0 ? (
                                            <tr><td colSpan={7} className="py-24 text-center">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-inner">
                                                    <FileText size={24} className="text-gray-200" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-400 tracking-tight">Zero matching records</p>
                                                <p className="text-[11px] text-gray-300 mt-1">Adjust filters or refine your search parameters</p>
                                            </td></tr>
                                        ) : leads.data.map(lead => (
                                            <tr key={lead.id}
                                                className={`hover:bg-indigo-50/30 transition-all duration-150 group cursor-pointer ${selectedIds.has(lead.id) ? 'bg-indigo-50/60' : ''}`}
                                                onClick={() => setSelectedLead(lead)}>
                                                <td className="px-6 py-5" onClick={e => { e.stopPropagation(); toggleSelect(lead.id); }}>
                                                    <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                                                        {selectedIds.has(lead.id)
                                                            ? <CheckSquare size={16} className="text-indigo-600" />
                                                            : <Square size={16} />}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-5 text-[11px] font-bold text-slate-500 whitespace-nowrap">
                                                    {new Date(lead.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                                    <span className="block text-[9px] text-gray-300 uppercase mt-0.5">
                                                        {new Date(lead.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm border border-white/20"
                                                            style={{ background: getAvatarColor(lead.name) }}>
                                                            {(lead.name || 'U')[0].toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{lead.name || 'ANONYMOUS'}</p>
                                                            <p className="text-[11px] text-gray-400 font-medium truncate leading-none mt-1">{lead.email || '—'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-[11px] font-bold text-slate-500 whitespace-nowrap">
                                                    {lead.phone || <span className="text-gray-200">UNSPECIFIED</span>}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                                        lead.source === 'builder' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                        lead.source === 'export' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                        'bg-gray-100 text-gray-600 border-gray-200'
                                                    }`}>
                                                        {lead.source || 'SYS'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                                                        STATUS_OPTIONS.find(s => s.value === (lead.status || 'new'))?.color || 'bg-gray-50 text-gray-400'
                                                    }`}>
                                                        {STATUS_OPTIONS.find(s => s.value === (lead.status || 'new'))?.label || 'Unknown'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                                                    <span className="flex items-center gap-2">
                                                        <button onClick={() => openPreview(lead)}
                                                            className="flex items-center justify-center w-8 h-8 text-indigo-600 bg-white border border-indigo-100 hover:bg-indigo-600 hover:text-white rounded-lg shadow-sm transition-all active:scale-90"
                                                            title="Inspect Payload">
                                                            <Eye size={14} />
                                                        </button>
                                                        <button onClick={() => downloadResume(lead.s3_pdf_url || '', lead.name)}
                                                            disabled={!lead.s3_pdf_url}
                                                            className={`flex items-center justify-center w-8 h-8 rounded-lg shadow-sm transition-all active:scale-90 border ${lead.s3_pdf_url ? 'text-emerald-600 bg-white border-emerald-100 hover:bg-emerald-600 hover:text-white' : 'text-gray-200 bg-gray-50 border-gray-100 cursor-not-allowed'}`}
                                                            title="Download Deliverable">
                                                            <Download size={14} />
                                                        </button>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                                                    {deleteConfirm === lead.id ? (
                                                        <span className="inline-flex gap-1 animate-pulse">
                                                            <button onClick={() => handleDelete(lead.id)} disabled={deleting}
                                                                className="px-3 py-1.5 text-[10px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm">
                                                                {deleting ? '...' : 'WIPE'}
                                                            </button>
                                                            <button onClick={() => setDeleteConfirm(null)}
                                                                className="px-3 py-1.5 text-[10px] font-bold text-slate-500 bg-white border border-gray-200 rounded-lg">
                                                                ABORT
                                                            </button>
                                                        </span>
                                                    ) : (
                                                        <button onClick={() => setDeleteConfirm(lead.id)}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                            <Trash2 size={15} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {leads && leads.last_page > 1 && (
                                <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/20">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        Registry Index: {leads.from} to {leads.to} / Total {leads.total}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button disabled={leads.current_page <= 1} onClick={() => handlePageChange(page - 1)}
                                            className="p-2 rounded-lg border border-gray-200 text-slate-500 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm">
                                            <ChevronLeft size={14} />
                                        </button>
                                        <div className="flex items-center gap-1.5 px-2">
                                            {Array.from({ length: Math.min(leads.last_page, 5) }, (_, i) => i + 1).map(p => (
                                                <button key={p} onClick={() => handlePageChange(p)}
                                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${p === leads.current_page
                                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 ring-2 ring-indigo-100'
                                                        : 'text-slate-500 hover:bg-gray-50 hover:text-indigo-600 border border-transparent'}`}>
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                        <button disabled={leads.current_page >= leads.last_page} onClick={() => handlePageChange(page + 1)}
                                            className="p-2 rounded-lg border border-gray-200 text-slate-500 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm">
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ===== ANALYTICS ===== */}
                    {view === 'analytics' && (
                        <div className="space-y-5">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 mb-1">Daily Activity — Last 7 Days</h3>
                                <p className="text-xs text-gray-400 mb-4">Hover over bars for details</p>
                                {stats?.chart_data && <MiniBarChart data={stats.chart_data} />}
                                <div className="grid grid-cols-7 gap-2 mt-5 pt-4 border-t border-gray-100">
                                    {stats?.chart_data?.map((d, i) => (
                                        <div key={i} className="text-center">
                                            <p className="text-lg font-bold text-gray-900">{d.count}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{d.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-5">Source Breakdown</h3>
                                    <div className="space-y-4">
                                        {stats?.sources?.length ? stats.sources.map((s, i) => {
                                            const total = stats.total_leads || 1;
                                            const pct = Math.round((s.count / total) * 100);
                                            const colors = ['#6366f1', '#8b5cf6', '#ec4899'];
                                            return (
                                                <div key={i}>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="capitalize font-semibold text-gray-700">{s.source}</span>
                                                        <span className="text-gray-500 font-medium">{s.count} · {pct}%</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-700"
                                                            style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                                                    </div>
                                                </div>
                                            );
                                        }) : <p className="text-sm text-gray-400">No source data available.</p>}
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-800 mb-5">Summary Metrics</h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Total Database Entries', value: stats?.total_leads ?? 0, color: '#4f46e5', bg: '#f5f7ff' },
                                            { label: 'Ingestion Velocity (Today)', value: stats?.leads_today ?? 0, color: '#0ea5e9', bg: '#f0f9ff' },
                                            { label: 'Trailing 7-Day Volume', value: stats?.leads_this_week ?? 0, color: '#10b981', bg: '#f0fdf4' },
                                        ].map((row, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 shadow-sm"
                                                style={{ background: row.bg }}>
                                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{row.label}</span>
                                                <span className="text-2xl font-bold" style={{ color: row.color }}>{row.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== SETTINGS ===== */}
                    {view === 'settings' && (
                        <div className="max-w-lg space-y-5">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-2.5 mb-6">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                                        <Lock size={15} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">Change Password</h3>
                                        <p className="text-xs text-gray-400">Update your admin credentials</p>
                                    </div>
                                </div>
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    {pwMsg && (
                                        <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${pwMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                            {pwMsg.type === 'success' ? <Check size={15} /> : <AlertTriangle size={15} />}
                                            {pwMsg.text}
                                        </div>
                                    )}
                                    {[
                                        { label: 'Current Password', value: currentPw, set: setCurrentPw, placeholder: '••••••••' },
                                        { label: 'New Password', value: newPw, set: setNewPw, placeholder: 'Min 6 characters' },
                                        { label: 'Confirm New Password', value: confirmPw, set: setConfirmPw, placeholder: 'Repeat new password' },
                                    ].map(f => (
                                        <div key={f.label}>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">{f.label}</label>
                                            <input type="password" value={f.value} onChange={e => f.set(e.target.value)} required
                                                placeholder={f.placeholder}
                                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition-all" />
                                        </div>
                                    ))}
                                    <button type="submit" disabled={savingPw}
                                        className="w-full py-2.5 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-sm bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-60 mt-2">
                                        {savingPw ? 'Processing...' : 'Authorize Password Reset'}
                                    </button>
                                </form>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">System Identity</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Administrative Email</span>
                                        <span className="font-bold text-slate-700 text-sm">{localStorage.getItem('admin_email') || 'admin@atsense.in'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Access Authorization</span>
                                        <span className="px-3 py-1 text-[9px] font-bold rounded-full text-indigo-700 bg-indigo-50 border border-indigo-100 uppercase tracking-wider">Full Admin Privileges</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'blog' && <AdminBlog />}
                    {view === 'templates' && <AdminTemplates />}
                    {view === 'site_settings' && <AdminSettings />}

                    {/* ===== ACTIVITY LOG ===== */}
                    {view === 'activity_log' && (
                        <div className="space-y-4">
                            {/* Toolbar */}
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex flex-wrap items-center gap-3">
                                {/* Search */}
                                <div className="relative flex-1 min-w-[220px]">
                                    <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search action, message, IP…"
                                        value={logSearch}
                                        onChange={e => setLogSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 focus:bg-white transition-all placeholder:text-gray-300"
                                    />
                                </div>

                                {/* Level Filter */}
                                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl p-1">
                                    {(['all', 'info', 'warning', 'error', 'critical'] as LogLevel[]).map(lvl => {
                                        const colors: Record<string, string> = {
                                            all: 'bg-indigo-600 text-white',
                                            info: 'bg-blue-600 text-white',
                                            warning: 'bg-amber-500 text-white',
                                            error: 'bg-red-600 text-white',
                                            critical: 'bg-rose-900 text-white',
                                        };
                                        return (
                                            <button
                                                key={lvl}
                                                onClick={() => setLogLevel(lvl)}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                                    logLevel === lvl ? colors[lvl] : 'text-gray-400 hover:text-gray-700'
                                                }`}
                                            >
                                                {lvl}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Date Range */}
                                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
                                    <Calendar size={13} className="text-gray-400" />
                                    <input type="date" value={logDateFrom} onChange={e => setLogDateFrom(e.target.value)}
                                        className="text-[11px] font-bold text-slate-600 bg-transparent focus:outline-none w-28 cursor-pointer" />
                                    <span className="text-gray-300 text-[10px] font-bold">TO</span>
                                    <input type="date" value={logDateTo} onChange={e => setLogDateTo(e.target.value)}
                                        className="text-[11px] font-bold text-slate-600 bg-transparent focus:outline-none w-28 cursor-pointer" />
                                </div>

                                {/* Auto-refresh toggle */}
                                <button
                                    onClick={() => setAutoRefresh(v => !v)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                                        autoRefresh
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                                    Live
                                </button>

                                <button
                                    onClick={() => fetchLogs(logPage, logLevel, logSearch, logDateFrom, logDateTo)}
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-transparent hover:border-indigo-100 transition-all"
                                    title="Refresh"
                                >
                                    <RefreshCw size={14} className={logsLoading ? 'animate-spin' : ''} />
                                </button>

                                <button
                                    onClick={handlePurgeLogs}
                                    disabled={purging || !logs?.total}
                                    className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-red-600 border border-red-200 bg-red-50 rounded-xl hover:bg-red-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Trash2 size={12} />
                                    {purging ? 'Purging…' : 'Purge All'}
                                </button>

                                <span className="ml-auto text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {logs?.total ?? 0} Events
                                </span>
                            </div>

                            {/* Log Table */}
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                {logsLoading && !logs ? (
                                    <div className="flex items-center justify-center py-20">
                                        <div className="text-center">
                                            <RefreshCw size={20} className="animate-spin text-indigo-400 mx-auto mb-3" />
                                            <p className="text-xs text-gray-400 font-medium">Loading event stream…</p>
                                        </div>
                                    </div>
                                ) : !logs?.data?.length ? (
                                    <div className="text-center py-20">
                                        <Activity size={32} className="text-gray-200 mx-auto mb-3" />
                                        <p className="text-sm font-bold text-gray-400">No events recorded yet</p>
                                        <p className="text-xs text-gray-300 mt-1">Activity will appear here as the platform is used</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {logs.data.map(log => {
                                            const levelConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
                                                info:     { bg: 'bg-blue-50 text-blue-700 border-blue-100',    text: 'text-blue-600',   icon: <Info size={12} /> },
                                                warning:  { bg: 'bg-amber-50 text-amber-700 border-amber-100',  text: 'text-amber-600',  icon: <AlertTriangle size={12} /> },
                                                error:    { bg: 'bg-red-50 text-red-700 border-red-100',         text: 'text-red-600',    icon: <ShieldAlert size={12} /> },
                                                critical: { bg: 'bg-rose-100 text-rose-800 border-rose-200',     text: 'text-rose-700',   icon: <AlertOctagon size={12} /> },
                                            };
                                            const cfg = levelConfig[log.level] ?? levelConfig.info;
                                            const isExpanded = expandedLog === log.id;

                                            return (
                                                <div
                                                    key={log.id}
                                                    className={`px-5 py-3.5 hover:bg-gray-50/70 transition-colors cursor-pointer ${
                                                        log.level === 'critical' ? 'border-l-2 border-rose-500' :
                                                        log.level === 'error'    ? 'border-l-2 border-red-400' :
                                                        log.level === 'warning'  ? 'border-l-2 border-amber-400' : ''
                                                    }`}
                                                    onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        {/* Level Badge */}
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 mt-0.5 ${cfg.bg}`}>
                                                            {cfg.icon} {log.level}
                                                        </span>

                                                        {/* Action + Message */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
                                                                    {log.action}
                                                                </span>
                                                                <span className="text-xs text-slate-700 font-medium truncate">{log.message}</span>
                                                            </div>

                                                            {isExpanded && (
                                                                <div className="mt-2.5 space-y-1.5">
                                                                    {log.ip_address && (
                                                                        <p className="text-[11px] text-gray-400 font-mono">
                                                                            <span className="font-bold text-gray-500">IP:</span> {log.ip_address}
                                                                        </p>
                                                                    )}
                                                                    {log.user_agent && (
                                                                        <p className="text-[11px] text-gray-400 font-mono truncate">
                                                                            <span className="font-bold text-gray-500">UA:</span> {log.user_agent}
                                                                        </p>
                                                                    )}
                                                                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                                                                        <pre className="text-[11px] bg-slate-50 border border-slate-100 rounded-lg p-2.5 overflow-x-auto text-slate-600 font-mono mt-1">
                                                                            {JSON.stringify(log.metadata, null, 2)}
                                                                        </pre>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Timestamp */}
                                                        <div className="text-right shrink-0">
                                                            <span className="text-[10px] font-bold text-gray-400 block">
                                                                {new Date(log.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                            </span>
                                                            <span className="text-[10px] text-gray-300 font-medium block">
                                                                {new Date(log.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {logs && logs.last_page > 1 && (
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        Showing {logs.from}–{logs.to} of {logs.total}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button disabled={logs.current_page <= 1}
                                            onClick={() => { setLogPage(p => p - 1); fetchLogs(logPage - 1, logLevel, logSearch, logDateFrom, logDateTo); }}
                                            className="p-2 rounded-lg border border-gray-200 text-slate-500 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                            <ChevronLeft size={14} />
                                        </button>
                                        {Array.from({ length: Math.min(logs.last_page, 7) }, (_, i) => i + 1).map(p => (
                                            <button key={p}
                                                onClick={() => { setLogPage(p); fetchLogs(p, logLevel, logSearch, logDateFrom, logDateTo); }}
                                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                                    p === logs.current_page
                                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                                                        : 'text-slate-500 hover:bg-gray-50 border border-transparent'
                                                }`}>{p}
                                            </button>
                                        ))}
                                        <button disabled={logs.current_page >= logs.last_page}
                                            onClick={() => { setLogPage(p => p + 1); fetchLogs(logPage + 1, logLevel, logSearch, logDateFrom, logDateTo); }}
                                            className="p-2 rounded-lg border border-gray-200 text-slate-500 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </main>
            </div>

            {/* Lead Detail Slide-over */}
            {selectedLead && (
                <div className="fixed inset-0 z-40 flex justify-end">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
                    <div className="relative w-80 bg-white shadow-2xl flex flex-col h-full border-l border-gray-100"
                        style={{ animation: 'slideIn 0.2s ease-out' }}>
                        <style>{`@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

                        {/* Header professional */}
                        <div className="px-6 py-6 bg-white border-b border-gray-100 relative">
                            <button onClick={() => setSelectedLead(null)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={18} />
                            </button>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md border-4 border-white"
                                    style={{ background: getAvatarColor(selectedLead.name) }}>
                                    {(selectedLead.name || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-slate-800 tracking-tight leading-tight uppercase">{selectedLead.name || 'Unknown User'}</p>
                                    <p className="text-[10px] font-bold text-indigo-500 mt-0.5 uppercase tracking-widest leading-none">
                                        Registration: {new Date(selectedLead.created_at).toLocaleDateString('en-GB')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-5">
                            {/* Contact */}
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-sm">
                                    <Mail size={14} className="text-indigo-400 shrink-0" />
                                    <span className="text-gray-700 break-all">{selectedLead.email || '—'}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-sm">
                                    <Phone size={14} className="text-indigo-400 shrink-0" />
                                    <span className="text-gray-700">{selectedLead.phone || '—'}</span>
                                </div>
                            </div>

                            {/* Source badge */}
                            <div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Source</p>
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                                    selectedLead.source === 'builder' ? 'bg-indigo-50 text-indigo-700' :
                                    selectedLead.source === 'export' ? 'bg-emerald-50 text-emerald-700' :
                                    'bg-gray-100 text-gray-600'
                                }`}>
                                    {selectedLead.source || 'unknown'}
                                </span>
                            </div>

                            {/* Skills */}
                            {(() => {
                                try {
                                    const skills: string[] = JSON.parse(selectedLead.skills || '[]');
                                    return skills.length > 0 ? (
                                        <div>
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Skills</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {skills.map((s, i) => (
                                                    <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null;
                                } catch { return null; }
                            })()}

                            {/* CRM Status */}
                            <div className="pt-2">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <CheckSquare size={12} className="text-indigo-500" /> Pipeline Status
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {STATUS_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => updateLeadDetails(selectedLead.id, { status: opt.value })}
                                            disabled={updatingLead}
                                            className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all truncate text-left ${
                                                selectedLead.status === opt.value
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-100 scale-[1.02]'
                                                    : 'bg-white text-slate-500 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Internal Notes */}
                            <div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <AlertTriangle size={12} className="text-amber-500" /> Private Reviewer Notes
                                </p>
                                <textarea
                                    value={selectedLead.notes || ''}
                                    onChange={(e) => setSelectedLead({ ...selectedLead, notes: e.target.value })}
                                    onBlur={(e) => updateLeadDetails(selectedLead.id, { notes: e.target.value })}
                                    placeholder="Add internal feedback, interview scores or background check results..."
                                    className="w-full h-32 px-4 py-3 text-sm border border-gray-100 rounded-2xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all placeholder:text-gray-300 resize-none font-medium text-slate-700"
                                />
                                <div className="flex justify-end mt-1">
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic flex items-center gap-1">
                                        {updatingLead ? <RefreshCw size={10} className="animate-spin" /> : <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />} 
                                        {updatingLead ? 'Syncing...' : 'Auto-saved to cloud'}
                                    </p>
                                </div>
                            </div>

                            {/* Outreach */}
                            <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">Candidate Outreach</p>
                                        <h4 className="font-bold text-base leading-none">Draft Communications</h4>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-indigo-100/70 uppercase tracking-widest mb-1.5 block">Select Template</label>
                                        <select 
                                            value={selectedTemplate.id}
                                            onChange={(e) => setSelectedTemplate(EMAIL_TEMPLATES.find(t => t.id === e.target.value) || EMAIL_TEMPLATES[0])}
                                            className="w-full bg-indigo-700/50 border border-indigo-400/30 text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-white/20 transition-all appearance-none cursor-pointer"
                                        >
                                            {EMAIL_TEMPLATES.map(t => <option key={t.id} value={t.id} className="bg-slate-800 text-white">{t.label}</option>)}
                                        </select>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleSendEmail(selectedLead)}
                                        disabled={sendingEmail}
                                        className="w-full py-3 bg-white text-indigo-600 hover:bg-blue-50 transition-all rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {sendingEmail ? 'Sending...' : `Send ${selectedTemplate.label}`} <Zap size={14} className="fill-current" />
                                    </button>
                                </div>
                            </div>

                            {/* Resume actions */}
                            <div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Download size={12} className="text-indigo-500" /> Deliverable Artifacts
                                </p>
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => openPreview(selectedLead)}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-slate-700 border border-gray-100 rounded-2xl text-sm font-bold transition-all active:scale-[0.98]">
                                        <Eye size={14} className="text-gray-400" /> Preview Snapshot
                                    </button>
                                    {selectedLead.s3_pdf_url && (
                                        <button onClick={() => downloadResume(selectedLead.s3_pdf_url!, selectedLead.name)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-[0.98]"
                                            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                                            <Download size={14} /> Download PDF Document
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer delete */}
                        <div className="p-4 border-t border-gray-100">
                            {deleteConfirm === selectedLead.id ? (
                                <div className="flex gap-2">
                                    <button onClick={() => handleDelete(selectedLead.id)} disabled={deleting}
                                        className="flex-1 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50">
                                        {deleting ? '…' : 'Confirm Delete'}
                                    </button>
                                    <button onClick={() => setDeleteConfirm(null)}
                                        className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200">
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setDeleteConfirm(selectedLead.id)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors">
                                    <Trash2 size={14} /> Delete Lead
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* PDF Preview Modal */}
            {previewLeadId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: '90vw', height: '90vh', maxWidth: '960px' }}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <FileText size={14} className="text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900 text-sm">Resume Preview</h2>
                                    <p className="text-xs text-gray-400">{previewLeadName}</p>
                                </div>
                            </div>
                            <button onClick={() => setPreviewLeadId(null)}
                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden bg-gray-100 p-3">
                            <iframe
                                src={`${getApiBase()}/admin/leads/${previewLeadId}/pdf?token=${encodeURIComponent(localStorage.getItem('admin_token') || '')}`}
                                className="w-full h-full rounded-xl border border-gray-200 bg-white shadow-sm"
                                title="Resume PDF Preview"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
