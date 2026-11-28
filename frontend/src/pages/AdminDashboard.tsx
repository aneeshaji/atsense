import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Users, LayoutDashboard, Download, LogOut, FileText,
    Search, Trash2, ChevronLeft, ChevronRight, X,
    TrendingUp, Mail, Phone, RefreshCw,
    BarChart2, Settings, CheckSquare, Square, AlertTriangle,
    Lock, Check, Eye, ArrowUpRight, Zap, Calendar, Layout, Globe,
    Activity, ShieldAlert, Info, AlertOctagon, Menu, Copy,
    MessageCircle, Send, UserPlus, SlidersHorizontal, Pencil
} from 'lucide-react';
import AdminBlog from '../components/admin/AdminBlog';
import AdminTemplates from '../components/admin/AdminTemplates';
import AdminSettings from '../components/admin/AdminSettings';
import ResumePreviewModal from '../components/admin/ResumePreviewModal';
import type { AdminLead } from '../components/admin/ResumePreviewModal';
import { AddLeadModal, BulkEmailModal } from '../components/admin/LeadActionModals';

type Lead = AdminLead;

const STATUS_OPTIONS = [
    { value: 'new', label: 'New', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'reviewed', label: 'Reviewed', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { value: 'contacted', label: 'Contacted', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'interviewing', label: 'Interviewing', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { value: 'hired', label: 'Hired', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'rejected', label: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200' },
];

const EMAIL_TEMPLATES = [
    {
        id: 'direct',
        label: 'Direct Message',
        subject: 'Regarding your resume on ATSense',
        body: (name: string) =>
            `Hi ${name},\n\nI hope you're doing well. I'm reaching out regarding the resume you created/uploaded on ATSense.\n\nLet me know if you'd like help optimizing it for a specific role!`
    },
    {
        id: 'interview',
        label: 'Interview Request',
        subject: 'Interview Invitation: Opportunity via ATSense',
        body: (name: string) =>
            `Hi ${name},\n\nWe were impressed by your profile and would like to schedule a brief conversation to discuss your experience further. Please share your availability for this week.`
    },
    {
        id: 'followup',
        label: 'Deep Tailor Follow-up',
        subject: 'Quick tip to boost your ATS match score',
        body: (name: string) =>
            `Hi ${name},\n\nThanks for trying ATSense! If you're applying to a specific job, paste the job description into Deep Tailor inside the Builder to automatically match keywords and lift your ATS score.`
    },
    {
        id: 'rejection',
        label: 'Status Update',
        subject: 'Status update regarding your application',
        body: (name: string) =>
            `Hi ${name},\n\nThank you for sharing your resume with us. While your background is strong, we're moving forward with other candidates for this specific opening. We'll keep your profile on file for future roles.`
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
    total_enquiries?: number;
    new_enquiries?: number;
    chart_data: ChartPoint[];
    sources: SourceStat[];
}

type View = 'overview' | 'leads' | 'enquiries' | 'analytics' | 'blog' | 'templates' | 'site_settings' | 'settings' | 'activity_log';
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
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                        {d.date}: <span className="font-bold">{d.count}</span>
                    </div>
                    <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-400 transition-all duration-500 group-hover:from-indigo-500 group-hover:to-cyan-400"
                        style={{ height: `${Math.max((d.count / max) * 100, 8)}%` }}
                    />
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{d.date.split(' ')[1] || d.date}</span>
                </div>
            ))}
        </div>
    );
}

function AdminDashboard() {
    const [view, setView] = useState<View>('overview');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [leads, setLeads] = useState<PaginatedLeads | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Lead filters
    const [search, setSearch] = useState('');
    const [source, setSource] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [hasResumeOnly, setHasResumeOnly] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [page, setPage] = useState(1);

    // Selection & Modals
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [editingLeadInfo, setEditingLeadInfo] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editSource, setEditSource] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [bulkStatus, setBulkStatus] = useState('reviewed');
    const [bulkUpdating, setBulkUpdating] = useState(false);
    const [showAddLead, setShowAddLead] = useState(false);
    const [showBulkEmail, setShowBulkEmail] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [previewLead, setPreviewLead] = useState<Lead | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Settings state
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [savingPw, setSavingPw] = useState(false);

    // CRM & Email Composer state
    const [updatingLead, setUpdatingLead] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState(EMAIL_TEMPLATES[0].id);
    const [emailSubject, setEmailSubject] = useState(EMAIL_TEMPLATES[0].subject);
    const [emailBody, setEmailBody] = useState('');
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

    // Contact Enquiries & Newsletter state
    const [enquiries, setEnquiries] = useState<PaginatedLeads | null>(null);
    const [enquiriesLoading, setEnquiriesLoading] = useState(false);
    const [enquiryPage, setEnquiryPage] = useState(1);
    const [enquiryType, setEnquiryType] = useState<'all' | 'contact_inquiry' | 'newsletter_subscriber'>('all');
    const [enquirySearch, setEnquirySearch] = useState('');
    const [enquiryStatus, setEnquiryStatus] = useState('all');

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

    // Sync composer when selectedLead or template changes
    useEffect(() => {
        if (!selectedLead) return;
        const tpl = EMAIL_TEMPLATES.find(t => t.id === selectedTemplateId) || EMAIL_TEMPLATES[0];
        setEmailSubject(tpl.subject);
        setEmailBody(tpl.body(selectedLead.name || 'Candidate'));
    }, [selectedLead?.id, selectedTemplateId]);

    const copyText = (text: string, label: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(label);
        setTimeout(() => setCopiedField(null), 1500);
    };

    const fetchLeads = useCallback(async (
        pg = 1,
        q = search,
        src = source,
        st = statusFilter,
        df = dateFrom,
        dt = dateTo,
        srt = sortBy,
        hr = hasResumeOnly
    ) => {
        const token = getToken();
        if (!token) return;
        setRefreshing(true);
        try {
            const params = new URLSearchParams({ page: String(pg), per_page: '25', sort: srt });
            if (q) params.set('search', q);
            if (src !== 'all') params.set('source', src);
            if (st !== 'all') params.set('status', st);
            if (df) params.set('date_from', df);
            if (dt) params.set('date_to', dt);
            if (hr) params.set('has_resume', '1');
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
    }, [search, source, statusFilter, dateFrom, dateTo, sortBy, hasResumeOnly]);

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
            const t = setTimeout(() => {
                setPage(1);
                fetchLeads(1, search, source, statusFilter, dateFrom, dateTo, sortBy, hasResumeOnly);
            }, 350);
            return () => clearTimeout(t);
        }
    }, [search, source, statusFilter, dateFrom, dateTo, sortBy, hasResumeOnly]);

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

    const handleBulkStatusUpdate = async () => {
        const token = getToken(); if (!token || selectedIds.size === 0) return;
        setBulkUpdating(true);
        try {
            await api.post('/admin/leads/bulk-status', {
                ids: [...selectedIds],
                status: bulkStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedIds(new Set());
            await fetchLeads(page);
        } catch (err) {
            console.error('Bulk status update failed', err);
        } finally {
            setBulkUpdating(false);
        }
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

    const downloadResume = async (leadId: number, name: string) => {
        const token = getToken();
        if (!token) return;
        try {
            const res = await fetch(
                `${getApiBase()}/admin/leads/${leadId}/pdf?download=1&token=${encodeURIComponent(token)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const blob = await res.blob();
            const header = await blob.slice(0, 5).text();
            if (!header.includes('%PDF')) throw new Error('Response was not a valid PDF');

            const objectUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = `${(name || 'resume').replace(/\s+/g, '_')}_resume.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
        } catch (err) {
            console.error('Resume download failed', err);
            window.alert('Unable to download this resume PDF. Use Preview to inspect the resume.');
        }
    };

    const exportCsv = (onlySelected = false) => {
        const sourceList = onlySelected && selectedIds.size > 0
            ? (leads?.data.filter(l => selectedIds.has(l.id)) || [])
            : (leads?.data || []);
        if (!sourceList.length) return;
        const headers = ['Date', 'Name', 'Email', 'Phone', 'Source', 'Status', 'Skills', 'PDF URL'];
        const rows = [headers.join(',')];
        for (const l of sourceList) {
            let skills = '';
            try { skills = JSON.parse(l.skills || '[]').join('; '); } catch {}
            rows.push([
                new Date(l.created_at).toLocaleDateString(),
                `"${(l.name || '').replace(/"/g, '""')}"`,
                l.email || '',
                l.phone || '',
                l.source || '',
                l.status || 'new',
                `"${skills.replace(/"/g, '""')}"`,
                l.s3_pdf_url || ''
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

    const updateLeadDetails = async (id: number, data: { status?: string; notes?: string; name?: string; email?: string; phone?: string; source?: string }) => {
        const token = getToken(); if (!token) return;
        setUpdatingLead(true);
        try {
            await api.put(`/admin/leads/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
        if (!emailSubject.trim() || !emailBody.trim()) {
            window.alert('Please enter both a subject and message body.');
            return;
        }
        setSendingEmail(true);
        try {
            await api.post(`/admin/leads/${lead.id}/email`, {
                subject: emailSubject.trim(),
                body: emailBody.trim()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.alert('Email sent successfully!');
            if (['new', 'reviewed'].includes(lead.status || 'new')) {
                const updated = { ...lead, status: 'contacted' };
                setSelectedLead(updated);
                if (leads) {
                    setLeads({ ...leads, data: leads.data.map(l => l.id === lead.id ? updated : l) });
                }
            }
        } catch (err: any) {
            console.error(err);
            window.alert(err.response?.data?.message || 'Failed to send email. Ensure SMTP is configured in .env.');
        } finally {
            setSendingEmail(false);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setSource('all');
        setStatusFilter('all');
        setSortBy('newest');
        setHasResumeOnly(false);
        setDateFrom('');
        setDateTo('');
    };

    const fetchLogs = useCallback(async (pg = 1, level = logLevel, q = logSearch, df = logDateFrom, dt = logDateTo) => {
        const token = getToken(); if (!token) return;
        setLogsLoading(true);
        try {
            const params = new URLSearchParams({ page: String(pg), per_page: '50' });
            if (level !== 'all') params.set('level', level);
            if (q) params.set('search', q);
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

    const fetchEnquiries = useCallback(async (
        pg = enquiryPage,
        tp = enquiryType,
        q = enquirySearch,
        st = enquiryStatus
    ) => {
        const token = getToken();
        if (!token) return;
        setEnquiriesLoading(true);
        try {
            const params = new URLSearchParams({ page: String(pg), per_page: '25', sort: 'newest' });
            if (tp !== 'all') params.set('type', tp);
            if (q) params.set('search', q);
            if (st !== 'all') params.set('status', st);
            const res = await api.get(`/admin/enquiries?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEnquiries(res.data);
        } catch (err: any) {
            if (err.response?.status === 401) handleLogout();
        } finally {
            setEnquiriesLoading(false);
        }
    }, [enquiryPage, enquiryType, enquirySearch, enquiryStatus]);

    useEffect(() => {
        if (view === 'enquiries') {
            const t = setTimeout(() => {
                fetchEnquiries(1, enquiryType, enquirySearch, enquiryStatus);
            }, 250);
            return () => clearTimeout(t);
        }
    }, [view, enquiryType, enquirySearch, enquiryStatus]);

    const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
        { id: 'leads', label: 'Leads', icon: <Users size={16} /> },
        { id: 'enquiries', label: 'Enquiries', icon: <Mail size={16} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={16} /> },
        { id: 'blog', label: 'Blog & Content', icon: <FileText size={16} /> },
        { id: 'templates', label: 'Templates', icon: <Layout size={16} /> },
        { id: 'site_settings', label: 'Site Settings', icon: <Globe size={16} /> },
        { id: 'activity_log', label: 'Activity Log', icon: <Activity size={16} /> },
        { id: 'settings', label: 'Account', icon: <Settings size={16} /> },
    ];

    const avatarColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#14b8a6'];
    const getAvatarColor = (name: string) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];
    const getStatusCfg = (status?: string) => STATUS_OPTIONS.find(s => s.value === (status || 'new')) || STATUS_OPTIONS[0];
    const cleanPhone = (phone?: string) => (phone || '').replace(/[^\d+]/g, '');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
                <div className="text-center">
                    <div className="w-11 h-11 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                    <p className="text-slate-400 text-xs mt-4 font-semibold tracking-widest uppercase">Loading Admin Console…</p>
                </div>
            </div>
        );
    }

    const navGroups: { title: string; ids: View[] }[] = [
        { title: 'Operations', ids: ['overview', 'leads', 'enquiries', 'analytics'] },
        { title: 'Content & Studio', ids: ['blog', 'templates', 'site_settings'] },
        { title: 'System', ids: ['activity_log', 'settings'] },
    ];

    const renderSidebarNav = (onSelect?: () => void) => (
        <div className="flex flex-col h-full bg-[#0B0F19] text-slate-300">
            <div className="h-16 flex items-center px-5 gap-3 border-b border-white/[0.07] shrink-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 shadow-lg shadow-indigo-500/25">
                    <FileText size={16} className="text-white" />
                </div>
                <div>
                    <span className="font-black text-white text-sm tracking-tight block leading-none">ATSense</span>
                    <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase mt-1 block">Admin Console</span>
                </div>
            </div>

            <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto">
                {navGroups.map(group => (
                    <div key={group.title} className="space-y-1">
                        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{group.title}</p>
                        {group.ids.map(id => {
                            const item = navItems.find(n => n.id === id);
                            if (!item) return null;
                            const active = view === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => { setView(item.id); onSelect?.(); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                                        active
                                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-950/60'
                                            : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                                    }`}
                                >
                                    <span className={active ? 'text-white' : 'text-slate-500'}>
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                    {item.id === 'leads' && stats && stats.total_leads > 0 && (
                                        <span className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                            active ? 'bg-white/20 text-white' : 'bg-white/[0.08] text-slate-300'
                                        }`}>
                                            {stats.total_leads}
                                        </span>
                                    )}
                                    {item.id === 'enquiries' && stats && (stats.new_enquiries ?? 0) > 0 && (
                                        <span className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                            active ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                        }`}>
                                            {stats.new_enquiries}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="p-3 border-t border-white/[0.07] shrink-0">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl text-[13px] font-semibold transition-all"
                >
                    <LogOut size={15} /> Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-[#F4F6FB] text-slate-900 overflow-x-hidden">
            {/* Desktop Sidebar */}
            <aside className="w-64 flex-col shrink-0 hidden md:flex bg-[#0B0F19] border-r border-slate-900/10 z-20">
                {renderSidebarNav()}
            </aside>

            {/* Mobile Sidebar Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <aside className="relative w-72 max-w-[85vw] bg-[#0B0F19] h-full flex flex-col shadow-2xl z-10">
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute top-4 right-3 p-2 text-slate-400 hover:text-white rounded-lg z-20"
                        >
                            <X size={18} />
                        </button>
                        {renderSidebarNav(() => setMobileMenuOpen(false))}
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Bar */}
                <header className="sticky top-0 h-16 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-20 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-1 rounded-xl text-slate-600 hover:bg-slate-100"
                            aria-label="Open menu"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-base font-black text-slate-900 tracking-tight truncate">
                                    {navItems.find(n => n.id === view)?.label}
                                </h1>
                                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold text-emerald-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Live
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                                ATSense Lead &amp; Content Operations
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {(view === 'overview' || view === 'leads') && (
                            <button
                                onClick={() => { fetchLeads(page); fetchStats(); }}
                                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200 bg-white shadow-xs"
                                title="Refresh Data"
                            >
                                <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                            </button>
                        )}
                        {view === 'leads' && (
                            <>
                                <button
                                    onClick={() => setShowAddLead(true)}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all"
                                >
                                    <UserPlus size={14} className="text-indigo-600" />
                                    <span className="hidden sm:inline">Add Lead</span>
                                </button>
                                <button
                                    onClick={() => exportCsv(false)}
                                    className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
                                >
                                    <Download size={14} />
                                    <span className="hidden sm:inline">Export CSV</span>
                                </button>
                            </>
                        )}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 space-y-6">

                    {/* ===== OVERVIEW ===== */}
                    {view === 'overview' && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                                            <Users size={18} />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">All Time</span>
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{stats?.total_leads ?? 0}</p>
                                    <p className="text-xs font-semibold text-slate-500 mt-1">Total Leads Captured</p>
                                </div>

                                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                                            <Zap size={18} />
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">Today</span>
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{stats?.leads_today ?? 0}</p>
                                    <p className="text-xs font-semibold text-slate-500 mt-1">New Leads Today</p>
                                </div>

                                <div
                                    onClick={() => setView('enquiries')}
                                    className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                                            <Mail size={18} />
                                        </div>
                                        {(stats?.new_enquiries ?? 0) > 0 ? (
                                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">
                                                {stats?.new_enquiries} New
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">Inbox</span>
                                        )}
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{stats?.total_enquiries ?? 0}</p>
                                    <p className="text-xs font-semibold text-slate-500 mt-1">Contact &amp; Newsletter</p>
                                </div>

                                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">7-Day Trend</span>
                                        <TrendingUp size={15} className="text-indigo-500" />
                                    </div>
                                    {stats?.chart_data && <MiniBarChart data={stats.chart_data} />}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Lead Sources</h3>
                                    <div className="space-y-4">
                                        {stats?.sources?.length ? stats.sources.map((s, i) => {
                                            const pct = Math.round((s.count / (stats.total_leads || 1)) * 100);
                                            const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];
                                            return (
                                                <div key={i}>
                                                    <div className="flex justify-between text-xs mb-1.5 font-bold">
                                                        <span className="capitalize text-slate-700">{s.source || 'Direct'}</span>
                                                        <span className="text-slate-500">{s.count} ({pct}%)</span>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-700"
                                                            style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }} />
                                                    </div>
                                                </div>
                                            );
                                        }) : <p className="text-xs text-slate-400">No source data yet.</p>}
                                    </div>
                                </div>

                                <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Leads</h3>
                                        <button onClick={() => setView('leads')}
                                            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1">
                                            Manage All Leads <ArrowUpRight size={13} />
                                        </button>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {leads?.data?.slice(0, 6).map((l) => (
                                            <div key={l.id}
                                                className="flex items-center gap-3 py-3 hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
                                                onClick={() => { setView('leads'); setSelectedLead(l); }}>
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                                    style={{ background: getAvatarColor(l.name) }}>
                                                    {(l.name || 'U')[0].toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 truncate">{l.name || 'Unnamed Lead'}</p>
                                                    <p className="text-xs text-slate-500 truncate">{l.email || l.phone || '—'}</p>
                                                </div>
                                                <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusCfg(l.status).color}`}>
                                                    {getStatusCfg(l.status).label}
                                                </span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setPreviewLead(l); }}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg shrink-0"
                                                    title="Preview Resume"
                                                >
                                                    <Eye size={15} />
                                                </button>
                                            </div>
                                        ))}
                                        {!leads?.data?.length && (
                                            <p className="text-center py-8 text-xs text-slate-400">No leads captured yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ===== LEADS ===== */}
                    {view === 'leads' && (
                        <div className="space-y-4">
                            {/* Status Quick-Filter Pills */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-all ${
                                        statusFilter === 'all'
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    All Statuses
                                </button>
                                {STATUS_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setStatusFilter(opt.value)}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-all ${
                                            statusFilter === opt.value
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                                {/* Toolbar */}
                                <div className="p-3.5 sm:px-6 sm:py-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1 min-w-0">
                                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search name, email, or phone…"
                                                value={search}
                                                onChange={e => setSearch(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowMobileFilters(v => !v)}
                                            className={`md:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border shrink-0 ${
                                                showMobileFilters || source !== 'all' || sortBy !== 'newest' || hasResumeOnly || dateFrom || dateTo
                                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                    : 'bg-white text-slate-600 border-slate-200'
                                            }`}
                                        >
                                            <SlidersHorizontal size={13} /> Filters
                                        </button>

                                        <span className="hidden md:inline text-xs font-bold text-slate-400 shrink-0">
                                            {leads?.total ?? 0} leads
                                        </span>
                                    </div>

                                    <div className={`${showMobileFilters ? 'flex' : 'hidden md:flex'} flex-wrap items-center gap-2.5`}>
                                        <select
                                            value={source}
                                            onChange={e => setSource(e.target.value)}
                                            className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                        >
                                            <option value="all">All Sources</option>
                                            <option value="import">Resume Import</option>
                                            <option value="builder">Builder</option>
                                            <option value="export">PDF Export</option>
                                            <option value="analysis">ATS Analysis</option>
                                            <option value="breakdown_gate">Breakdown Gate</option>
                                            <option value="exit_intent">Exit Intent</option>
                                            <option value="grader">Free Grader</option>
                                            <option value="contact_inquiry">Contact Enquiry</option>
                                            <option value="newsletter_subscriber">Newsletter</option>
                                            <option value="manual">Manual Entry</option>
                                        </select>

                                        <select
                                            value={sortBy}
                                            onChange={e => setSortBy(e.target.value)}
                                            className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="oldest">Oldest First</option>
                                            <option value="name_asc">Name (A–Z)</option>
                                        </select>

                                        <button
                                            type="button"
                                            onClick={() => setHasResumeOnly(v => !v)}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                                                hasResumeOnly
                                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200'
                                            }`}
                                        >
                                            Has Resume
                                        </button>

                                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 w-full sm:w-auto">
                                            <Calendar size={13} className="text-slate-400 shrink-0" />
                                            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                                                className="text-xs font-medium text-slate-600 bg-transparent focus:outline-none flex-1 sm:w-28 min-w-0" />
                                            <span className="text-slate-300 text-xs">–</span>
                                            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                                                className="text-xs font-medium text-slate-600 bg-transparent focus:outline-none flex-1 sm:w-28 min-w-0" />
                                        </div>

                                        {(search || source !== 'all' || statusFilter !== 'all' || sortBy !== 'newest' || hasResumeOnly || dateFrom || dateTo) && (
                                            <button onClick={clearFilters}
                                                className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 hover:bg-rose-100">
                                                <X size={13} /> Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Bulk Actions Bar */}
                                {selectedIds.size > 0 && (
                                    <div className="px-4 sm:px-6 py-3 bg-indigo-50 border-b border-indigo-100 flex flex-wrap items-center gap-2.5">
                                        <span className="text-xs font-black text-indigo-800">{selectedIds.size} selected</span>
                                        <div className="flex items-center gap-1.5">
                                            <select
                                                value={bulkStatus}
                                                onChange={e => setBulkStatus(e.target.value)}
                                                className="text-xs font-bold border border-indigo-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
                                            >
                                                {STATUS_OPTIONS.map(o => (
                                                    <option key={o.value} value={o.value}>Set: {o.label}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={handleBulkStatusUpdate}
                                                disabled={bulkUpdating}
                                                className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
                                            >
                                                {bulkUpdating ? 'Updating…' : 'Apply'}
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => setShowBulkEmail(true)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                                        >
                                            <Mail size={12} /> Email Selected
                                        </button>

                                        <button
                                            onClick={() => exportCsv(true)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-100/50"
                                        >
                                            <Download size={12} /> Export
                                        </button>

                                        {bulkDeleteConfirm ? (
                                            <div className="flex items-center gap-2 ml-auto">
                                                <span className="text-xs text-rose-700 font-bold">Delete {selectedIds.size} leads?</span>
                                                <button onClick={handleBulkDelete} disabled={deleting}
                                                    className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 rounded-lg">
                                                    {deleting ? 'Deleting…' : 'Confirm'}
                                                </button>
                                                <button onClick={() => setBulkDeleteConfirm(false)}
                                                    className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg">
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setBulkDeleteConfirm(true)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 ml-auto">
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="bg-slate-50/70 border-b border-slate-100">
                                                <th className="px-5 py-3.5 w-10">
                                                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-indigo-600">
                                                        {leads && selectedIds.size === leads.data.length && leads.data.length > 0
                                                            ? <CheckSquare size={16} className="text-indigo-600" />
                                                            : <Square size={16} />}
                                                    </button>
                                                </th>
                                                {['Date', 'Candidate', 'Phone', 'Source', 'Status', 'Resume', 'Actions'].map(h => (
                                                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {!leads || leads.data.length === 0 ? (
                                                <tr><td colSpan={8} className="py-16 text-center">
                                                    <FileText size={28} className="text-slate-300 mx-auto mb-3" />
                                                    <p className="text-sm font-bold text-slate-500">No matching leads found</p>
                                                    <p className="text-xs text-slate-400 mt-1">Try clearing or adjusting your filters</p>
                                                </td></tr>
                                            ) : leads.data.map(lead => (
                                                <tr key={lead.id}
                                                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${selectedIds.has(lead.id) ? 'bg-indigo-50/40' : ''}`}
                                                    onClick={() => setSelectedLead(lead)}>
                                                    <td className="px-5 py-4" onClick={e => { e.stopPropagation(); toggleSelect(lead.id); }}>
                                                        <button className="text-slate-300 hover:text-indigo-600">
                                                            {selectedIds.has(lead.id)
                                                                ? <CheckSquare size={16} className="text-indigo-600" />
                                                                : <Square size={16} />}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
                                                        {new Date(lead.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                        <span className="block text-[11px] text-slate-400 font-normal">
                                                            {new Date(lead.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                                                style={{ background: getAvatarColor(lead.name) }}>
                                                                {(lead.name || 'U')[0].toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-bold text-slate-900 truncate">{lead.name || 'Unnamed'}</p>
                                                                <p className="text-xs text-slate-500 truncate">{lead.email || '—'}</p>
                                                                {lead.is_duplicate && (
                                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-600 mt-0.5">
                                                                        ⚠ Duplicate
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                                                        {lead.phone || <span className="text-slate-300">—</span>}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">
                                                            {lead.source || 'direct'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                                                        <select
                                                            value={lead.status || 'new'}
                                                            onChange={e => updateLeadDetails(lead.id, { status: e.target.value })}
                                                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer focus:outline-none ${getStatusCfg(lead.status).color}`}
                                                        >
                                                            {STATUS_OPTIONS.map(opt => (
                                                                <option key={opt.value} value={opt.value} className="bg-white text-slate-800">{opt.label}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                                                        <div className="flex items-center gap-1.5">
                                                            <button onClick={() => setPreviewLead(lead)}
                                                                className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors"
                                                                title="Preview Resume">
                                                                <Eye size={14} />
                                                            </button>
                                                            <button onClick={() => downloadResume(lead.id, lead.name)}
                                                                className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors"
                                                                title="Download PDF">
                                                                <Download size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                                                        <div className="flex items-center gap-1">
                                                            {lead.phone && (
                                                                <a href={`https://wa.me/${cleanPhone(lead.phone)}`} target="_blank" rel="noreferrer"
                                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="WhatsApp">
                                                                    <MessageCircle size={14} />
                                                                </a>
                                                            )}
                                                            {deleteConfirm === lead.id ? (
                                                                <span className="inline-flex gap-1">
                                                                    <button onClick={() => handleDelete(lead.id)} disabled={deleting}
                                                                        className="px-2.5 py-1 text-[11px] font-bold text-white bg-rose-600 rounded-lg">
                                                                        {deleting ? '…' : 'Delete'}
                                                                    </button>
                                                                    <button onClick={() => setDeleteConfirm(null)}
                                                                        className="px-2 py-1 text-[11px] font-bold text-slate-500 bg-slate-100 rounded-lg">
                                                                        Cancel
                                                                    </button>
                                                                </span>
                                                            ) : (
                                                                <button onClick={() => setDeleteConfirm(lead.id)}
                                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Delete Lead">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card List */}
                                <div className="md:hidden divide-y divide-slate-100">
                                    {!leads || leads.data.length === 0 ? (
                                        <div className="py-16 text-center px-4">
                                            <FileText size={28} className="text-slate-300 mx-auto mb-3" />
                                            <p className="text-sm font-bold text-slate-500">No matching leads found</p>
                                        </div>
                                    ) : leads.data.map(lead => (
                                        <div key={lead.id} className="p-4 space-y-3" onClick={() => setSelectedLead(lead)}>
                                            <div className="flex items-start gap-3">
                                                <button
                                                    onClick={e => { e.stopPropagation(); toggleSelect(lead.id); }}
                                                    className="mt-1 text-slate-300"
                                                >
                                                    {selectedIds.has(lead.id)
                                                        ? <CheckSquare size={18} className="text-indigo-600" />
                                                        : <Square size={18} />}
                                                </button>
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                                                    style={{ background: getAvatarColor(lead.name) }}>
                                                    {(lead.name || 'U')[0].toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-sm font-bold text-slate-900 truncate">{lead.name || 'Unnamed'}</p>
                                                        <span className="text-[11px] text-slate-400 shrink-0">
                                                            {new Date(lead.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 truncate">{lead.email || 'No email'}</p>
                                                    {lead.is_duplicate && (
                                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-600 mt-0.5">
                                                            ⚠ Duplicate
                                                        </span>
                                                    )}
                                                    {lead.phone && <p className="text-xs text-slate-400 mt-0.5">{lead.phone}</p>}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 pt-1" onClick={e => e.stopPropagation()}>
                                                <select
                                                    value={lead.status || 'new'}
                                                    onChange={e => updateLeadDetails(lead.id, { status: e.target.value })}
                                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border ${getStatusCfg(lead.status).color}`}
                                                >
                                                    {STATUS_OPTIONS.map(opt => (
                                                        <option key={opt.value} value={opt.value} className="bg-white text-slate-800">{opt.label}</option>
                                                    ))}
                                                </select>
                                                <span className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-600 capitalize">
                                                    {lead.source || 'direct'}
                                                </span>

                                                <div className="flex items-center gap-1.5 ml-auto">
                                                    <button onClick={() => setPreviewLead(lead)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                                                        <Eye size={13} /> Preview
                                                    </button>
                                                    <button onClick={() => downloadResume(lead.id, lead.name)}
                                                        className="p-2 rounded-lg bg-emerald-50 text-emerald-700" title="Download PDF">
                                                        <Download size={14} />
                                                    </button>
                                                    {lead.phone && (
                                                        <a href={`https://wa.me/${cleanPhone(lead.phone)}`} target="_blank" rel="noreferrer"
                                                            className="p-2 rounded-lg bg-green-50 text-green-700" title="WhatsApp">
                                                            <MessageCircle size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {leads && leads.last_page > 1 && (
                                    <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/40">
                                        <span className="text-xs text-slate-500 font-medium">
                                            Showing {leads.from}–{leads.to} of {leads.total}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <button disabled={leads.current_page <= 1} onClick={() => handlePageChange(page - 1)}
                                                className="p-2 rounded-lg border border-slate-200 text-slate-600 bg-white disabled:opacity-30">
                                                <ChevronLeft size={14} />
                                            </button>
                                            {Array.from({ length: Math.min(leads.last_page, 5) }, (_, i) => i + 1).map(p => (
                                                <button key={p} onClick={() => handlePageChange(p)}
                                                    className={`w-8 h-8 rounded-lg text-xs font-bold ${p === leads.current_page
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'text-slate-600 hover:bg-slate-100'}`}>
                                                    {p}
                                                </button>
                                            ))}
                                            <button disabled={leads.current_page >= leads.last_page} onClick={() => handlePageChange(page + 1)}
                                                className="p-2 rounded-lg border border-slate-200 text-slate-600 bg-white disabled:opacity-30">
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ===== ENQUIRIES ===== */}
                    {view === 'enquiries' && (
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                                <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                                                <Mail size={18} className="text-indigo-600" />
                                                Contact Enquiries &amp; Newsletter
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Messages submitted via Contact form and Newsletter subscriptions ({enquiries?.total ?? 0} total)
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => fetchEnquiries(enquiryPage)}
                                            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                        >
                                            <RefreshCw size={13} className={enquiriesLoading ? 'animate-spin' : ''} />
                                            Refresh
                                        </button>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <div className="flex flex-wrap gap-1.5">
                                            {[
                                                { id: 'all', label: 'All' },
                                                { id: 'contact_inquiry', label: 'Contact Messages' },
                                                { id: 'newsletter_subscriber', label: 'Newsletter' },
                                            ].map(tab => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => { setEnquiryPage(1); setEnquiryType(tab.id as any); }}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                                        enquiryType === tab.id
                                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-200'
                                                    }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="relative flex-1 min-w-[200px]">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={enquirySearch}
                                                onChange={e => { setEnquiryPage(1); setEnquirySearch(e.target.value); }}
                                                placeholder="Search name, email, or message..."
                                                className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white"
                                            />
                                        </div>

                                        <select
                                            value={enquiryStatus}
                                            onChange={e => { setEnquiryPage(1); setEnquiryStatus(e.target.value); }}
                                            className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 cursor-pointer focus:outline-none"
                                        >
                                            <option value="all">All Statuses</option>
                                            {STATUS_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {enquiriesLoading ? (
                                    <div className="py-16 text-center text-xs text-slate-400 font-semibold">Loading enquiries…</div>
                                ) : !enquiries || enquiries.data.length === 0 ? (
                                    <div className="py-16 text-center">
                                        <Mail size={32} className="mx-auto text-slate-300 mb-2" />
                                        <p className="text-sm font-bold text-slate-600">No enquiries found</p>
                                        <p className="text-xs text-slate-400 mt-1">Contact form submissions and newsletter signups will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {enquiries.data.map(item => (
                                            <div
                                                key={item.id}
                                                onClick={() => setSelectedLead(item)}
                                                className="p-4 sm:px-6 hover:bg-slate-50/80 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                                            >
                                                <div className="flex items-start gap-3 min-w-0 flex-1">
                                                    <div
                                                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                                                        style={{ background: getAvatarColor(item.name || item.email) }}
                                                    >
                                                        {(item.name || item.email || 'U')[0].toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <p className="text-sm font-bold text-slate-900">{item.name || 'Visitor'}</p>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                                item.source === 'newsletter_subscriber'
                                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                            }`}>
                                                                {item.source === 'newsletter_subscriber' ? 'Newsletter' : 'Contact'}
                                                            </span>
                                                            <span className="text-[11px] text-slate-400">
                                                                {new Date(item.created_at).toLocaleString('en-GB', {
                                                                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs font-medium text-indigo-600 truncate mt-0.5">
                                                            {item.email}
                                                            {item.phone ? <span className="text-slate-400 ml-2">• {item.phone}</span> : null}
                                                        </p>
                                                        {item.notes && (
                                                            <p className="text-xs text-slate-600 mt-2 bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-2 whitespace-pre-wrap break-words">
                                                                {item.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                                                    <select
                                                        value={item.status || 'new'}
                                                        onChange={async e => {
                                                            await updateLeadDetails(item.id, { status: e.target.value });
                                                            fetchEnquiries(enquiryPage);
                                                            fetchStats();
                                                        }}
                                                        className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold border cursor-pointer focus:outline-none ${getStatusCfg(item.status).color}`}
                                                    >
                                                        {STATUS_OPTIONS.map(opt => (
                                                            <option key={opt.value} value={opt.value} className="bg-white text-slate-800">{opt.label}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => setSelectedLead(item)}
                                                        title="Reply via Email"
                                                        className="p-2 rounded-xl border border-slate-200 text-indigo-600 hover:bg-indigo-50"
                                                    >
                                                        <Mail size={14} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            await deleteLead(item.id);
                                                            fetchEnquiries(enquiryPage);
                                                            fetchStats();
                                                        }}
                                                        title="Delete"
                                                        className="p-2 rounded-xl border border-slate-200 text-rose-500 hover:bg-rose-50"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {enquiries && enquiries.last_page > 1 && (
                                    <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                        <span>Page {enquiries.current_page} of {enquiries.last_page}</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={enquiries.current_page <= 1}
                                                onClick={() => { const p = enquiries.current_page - 1; setEnquiryPage(p); fetchEnquiries(p); }}
                                                className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold disabled:opacity-40"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                disabled={enquiries.current_page >= enquiries.last_page}
                                                onClick={() => { const p = enquiries.current_page + 1; setEnquiryPage(p); fetchEnquiries(p); }}
                                                className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold disabled:opacity-40"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ===== ANALYTICS ===== */}
                    {view === 'analytics' && (
                        <div className="space-y-5">
                            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
                                <h3 className="text-sm font-bold text-slate-900 mb-1">Daily Activity — Last 7 Days</h3>
                                <p className="text-xs text-slate-400 mb-4">Hover over bars for details</p>
                                {stats?.chart_data && <MiniBarChart data={stats.chart_data} />}
                                <div className="grid grid-cols-7 gap-2 mt-5 pt-4 border-t border-slate-100">
                                    {stats?.chart_data?.map((d, i) => (
                                        <div key={i} className="text-center">
                                            <p className="text-base sm:text-lg font-bold text-slate-900">{d.count}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{d.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
                                    <h3 className="text-sm font-bold text-slate-900 mb-5">Source Breakdown</h3>
                                    <div className="space-y-4">
                                        {stats?.sources?.length ? stats.sources.map((s, i) => {
                                            const total = stats.total_leads || 1;
                                            const pct = Math.round((s.count / total) * 100);
                                            const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'];
                                            return (
                                                <div key={i}>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="capitalize font-semibold text-slate-700">{s.source}</span>
                                                        <span className="text-slate-500 font-medium">{s.count} · {pct}%</span>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-700"
                                                            style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                                                    </div>
                                                </div>
                                            );
                                        }) : <p className="text-sm text-slate-400">No source data available.</p>}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-800 mb-5">Summary Metrics</h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Total Leads', value: stats?.total_leads ?? 0, color: '#4f46e5', bg: '#f5f7ff' },
                                            { label: 'Captured Today', value: stats?.leads_today ?? 0, color: '#0ea5e9', bg: '#f0f9ff' },
                                            { label: 'Last 7 Days', value: stats?.leads_this_week ?? 0, color: '#10b981', bg: '#f0fdf4' },
                                        ].map((row, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100"
                                                style={{ background: row.bg }}>
                                                <span className="text-xs font-bold text-slate-600">{row.label}</span>
                                                <span className="text-2xl font-black" style={{ color: row.color }}>{row.value}</span>
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
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
                                <div className="flex items-center gap-2.5 mb-6">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                                        <Lock size={16} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
                                        <p className="text-xs text-slate-400">Update your admin credentials</p>
                                    </div>
                                </div>
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    {pwMsg && (
                                        <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${pwMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
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
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
                                            <input type="password" value={f.value} onChange={e => f.set(e.target.value)} required
                                                placeholder={f.placeholder}
                                                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white" />
                                        </div>
                                    ))}
                                    <button type="submit" disabled={savingPw}
                                        className="w-full py-2.5 text-white text-xs font-bold uppercase tracking-wider rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60">
                                        {savingPw ? 'Updating…' : 'Update Password'}
                                    </button>
                                </form>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
                                <h3 className="text-sm font-bold text-slate-800 mb-4">Admin Account</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-xs font-semibold text-slate-500">Email</span>
                                        <span className="font-bold text-slate-800 text-sm">{localStorage.getItem('admin_email') || 'admin@atsense.online'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-xs font-semibold text-slate-500">Role</span>
                                        <span className="px-3 py-1 text-xs font-bold rounded-full text-indigo-700 bg-indigo-50">Administrator</span>
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
                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:px-5 flex flex-wrap items-center gap-3">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search action, message, IP…"
                                        value={logSearch}
                                        onChange={e => setLogSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white"
                                    />
                                </div>

                                <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 overflow-x-auto">
                                    {(['all', 'info', 'warning', 'error', 'critical'] as LogLevel[]).map(lvl => (
                                        <button
                                            key={lvl}
                                            onClick={() => setLogLevel(lvl)}
                                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all ${
                                                logLevel === lvl ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setAutoRefresh(v => !v)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border ${
                                        autoRefresh ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-500 border-slate-200'
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                    Live
                                </button>

                                <button
                                    onClick={() => fetchLogs(logPage, logLevel, logSearch, logDateFrom, logDateTo)}
                                    className="p-2 text-slate-500 hover:text-indigo-600 rounded-xl border border-slate-200"
                                >
                                    <RefreshCw size={14} className={logsLoading ? 'animate-spin' : ''} />
                                </button>

                                <button
                                    onClick={handlePurgeLogs}
                                    disabled={purging || !logs?.total}
                                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 border border-rose-200 bg-rose-50 rounded-xl disabled:opacity-40"
                                >
                                    <Trash2 size={12} /> {purging ? 'Purging…' : 'Purge'}
                                </button>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                                {logsLoading && !logs ? (
                                    <div className="py-16 text-center">
                                        <RefreshCw size={20} className="animate-spin text-indigo-500 mx-auto mb-2" />
                                        <p className="text-xs text-slate-400">Loading logs…</p>
                                    </div>
                                ) : !logs?.data?.length ? (
                                    <div className="text-center py-16">
                                        <Activity size={28} className="text-slate-300 mx-auto mb-2" />
                                        <p className="text-sm font-bold text-slate-400">No events recorded yet</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {logs.data.map(log => {
                                            const levelConfig: Record<string, { bg: string; icon: React.ReactNode }> = {
                                                info: { bg: 'bg-blue-50 text-blue-700 border-blue-100', icon: <Info size={12} /> },
                                                warning: { bg: 'bg-amber-50 text-amber-700 border-amber-100', icon: <AlertTriangle size={12} /> },
                                                error: { bg: 'bg-rose-50 text-rose-700 border-rose-100', icon: <ShieldAlert size={12} /> },
                                                critical: { bg: 'bg-rose-100 text-rose-800 border-rose-200', icon: <AlertOctagon size={12} /> },
                                            };
                                            const cfg = levelConfig[log.level] ?? levelConfig.info;
                                            const isExpanded = expandedLog === log.id;

                                            return (
                                                <div key={log.id} className="px-4 sm:px-5 py-3.5 hover:bg-slate-50 cursor-pointer"
                                                    onClick={() => setExpandedLog(isExpanded ? null : log.id)}>
                                                    <div className="flex items-start gap-3">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shrink-0 mt-0.5 ${cfg.bg}`}>
                                                            {cfg.icon} {log.level}
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                                                    {log.action}
                                                                </span>
                                                                <span className="text-xs text-slate-700 truncate">{log.message}</span>
                                                            </div>
                                                            {isExpanded && log.metadata && (
                                                                <pre className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-2.5 overflow-x-auto text-slate-600 font-mono mt-2">
                                                                    {JSON.stringify(log.metadata, null, 2)}
                                                                </pre>
                                                            )}
                                                        </div>
                                                        <span className="text-[11px] text-slate-400 shrink-0">
                                                            {new Date(log.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Lead Detail Slide-over Drawer */}
            {selectedLead && (
                <div className="fixed inset-0 z-40 flex justify-end">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
                    <div className="relative w-full sm:w-[420px] bg-white shadow-2xl flex flex-col h-full border-l border-slate-200 z-10">
                        {/* Drawer Header */}
                        <div className="px-5 py-5 bg-gradient-to-br from-[#0B0F19] via-[#131B2E] to-[#1E1B4B] text-white flex items-center gap-3.5 shrink-0">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0 ring-2 ring-white/15 shadow-lg"
                                style={{ background: getAvatarColor(selectedLead.name) }}>
                                {(selectedLead.name || 'U')[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-base text-white truncate">{selectedLead.name || 'Unnamed Lead'}</h3>
                                <p className="text-xs text-slate-300 mt-0.5">
                                    Added {new Date(selectedLead.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    {' · '}
                                    <span className="capitalize text-indigo-300 font-semibold">{selectedLead.source || 'direct'}</span>
                                </p>
                            </div>
                            <button onClick={() => setSelectedLead(null)}
                                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-5">
                            {/* Quick Contact Actions */}
                            <div className="grid grid-cols-3 gap-2">
                                {selectedLead.email && (
                                    <a href={`mailto:${selectedLead.email}`}
                                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100">
                                        <Mail size={13} /> Email
                                    </a>
                                )}
                                {selectedLead.phone && (
                                    <>
                                        <a href={`tel:${cleanPhone(selectedLead.phone)}`}
                                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200">
                                            <Phone size={13} /> Call
                                        </a>
                                        <a href={`https://wa.me/${cleanPhone(selectedLead.phone)}`} target="_blank" rel="noreferrer"
                                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100">
                                            <MessageCircle size={13} /> WhatsApp
                                        </a>
                                    </>
                                )}
                            </div>

                            {/* Contact Details + Edit Info */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Info</span>
                                    <button
                                        onClick={() => {
                                            if (!editingLeadInfo) {
                                                setEditName(selectedLead.name || '');
                                                setEditEmail(selectedLead.email || '');
                                                setEditPhone(selectedLead.phone || '');
                                                setEditSource(selectedLead.source || '');
                                            }
                                            setEditingLeadInfo(v => !v);
                                        }}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                                    >
                                        <Pencil size={12} /> {editingLeadInfo ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>

                                {editingLeadInfo ? (
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Name"
                                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white" />
                                        <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="Email"
                                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white" />
                                        <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="Phone"
                                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white" />
                                        <button
                                            disabled={updatingLead}
                                            onClick={async () => {
                                                await updateLeadDetails(selectedLead.id, {
                                                    name: editName,
                                                    email: editEmail,
                                                    phone: editPhone,
                                                    source: editSource,
                                                });
                                                setEditingLeadInfo(false);
                                            }}
                                            className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                                        >
                                            {updatingLead ? 'Saving…' : 'Save Changes'}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl text-xs">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <Mail size={14} className="text-indigo-500 shrink-0" />
                                                <span className="text-slate-700 font-medium truncate">{selectedLead.email || '—'}</span>
                                            </div>
                                            {selectedLead.email && (
                                                <button onClick={() => copyText(selectedLead.email, 'email')}
                                                    className="text-slate-400 hover:text-indigo-600 shrink-0" title="Copy Email">
                                                    {copiedField === 'email' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl text-xs">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <Phone size={14} className="text-indigo-500 shrink-0" />
                                                <span className="text-slate-700 font-medium">{selectedLead.phone || '—'}</span>
                                            </div>
                                            {selectedLead.phone && (
                                                <button onClick={() => copyText(selectedLead.phone, 'phone')}
                                                    className="text-slate-400 hover:text-indigo-600 shrink-0" title="Copy Phone">
                                                    {copiedField === 'phone' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Resume Preview & Download */}
                            <div className="grid grid-cols-2 gap-2.5">
                                <button onClick={() => setPreviewLead(selectedLead)}
                                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold">
                                    <Eye size={14} /> Preview Resume
                                </button>
                                <button onClick={() => downloadResume(selectedLead.id, selectedLead.name)}
                                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold">
                                    <Download size={14} /> Download PDF
                                </button>
                            </div>

                            {/* Pipeline Status */}
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Pipeline Status</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {STATUS_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => updateLeadDetails(selectedLead.id, { status: opt.value })}
                                            disabled={updatingLead}
                                            className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all truncate ${
                                                (selectedLead.status || 'new') === opt.value
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Automated Drip Status */}
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Drip Progress</p>
                                <div className="grid grid-cols-4 gap-1.5 text-center">
                                    {[
                                        { label: 'Welcome', sent: selectedLead.welcome_email_sent_at },
                                        { label: 'Day 2', sent: selectedLead.drip_day2_sent_at },
                                        { label: 'Day 5', sent: selectedLead.drip_day5_sent_at },
                                        { label: 'Day 7', sent: selectedLead.drip_day7_sent_at },
                                    ].map(step => (
                                        <div key={step.label} className={`p-2 rounded-xl border text-[11px] font-bold ${
                                            step.sent ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'
                                        }`}>
                                            {step.label}
                                            <span className="block text-[10px] font-medium mt-0.5">{step.sent ? 'Sent' : 'Pending'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Skills */}
                            {(() => {
                                try {
                                    const skills: string[] = JSON.parse(selectedLead.skills || '[]');
                                    return skills.length > 0 ? (
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Extracted Skills</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {skills.slice(0, 18).map((s, i) => (
                                                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null;
                                } catch { return null; }
                            })()}

                            {/* Private Notes */}
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Private Notes</p>
                                <textarea
                                    value={selectedLead.notes || ''}
                                    onChange={(e) => setSelectedLead({ ...selectedLead, notes: e.target.value })}
                                    onBlur={(e) => updateLeadDetails(selectedLead.id, { notes: e.target.value })}
                                    placeholder="Add follow-up notes, call summary, or feedback…"
                                    className="w-full h-24 px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white resize-none text-slate-700"
                                />
                                <p className="text-[11px] text-slate-400 text-right mt-1">
                                    {updatingLead ? 'Saving…' : 'Auto-saved on blur'}
                                </p>
                            </div>

                            {/* Editable Email Composer */}
                            <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                                        <Send size={13} /> Send Direct Email
                                    </span>
                                    <select
                                        value={selectedTemplateId}
                                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                                        className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none"
                                    >
                                        {EMAIL_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                    </select>
                                </div>

                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={e => setEmailSubject(e.target.value)}
                                    placeholder="Subject"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                                />
                                <textarea
                                    value={emailBody}
                                    onChange={e => setEmailBody(e.target.value)}
                                    rows={4}
                                    placeholder="Write your message…"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                                />
                                <button
                                    onClick={() => handleSendEmail(selectedLead)}
                                    disabled={sendingEmail || !selectedLead.email}
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Send size={13} /> {sendingEmail ? 'Sending…' : 'Send Email'}
                                </button>
                            </div>
                        </div>

                        {/* Footer Delete */}
                        <div className="p-4 border-t border-slate-100 shrink-0">
                            {deleteConfirm === selectedLead.id ? (
                                <div className="flex gap-2">
                                    <button onClick={() => handleDelete(selectedLead.id)} disabled={deleting}
                                        className="flex-1 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl">
                                        {deleting ? 'Deleting…' : 'Confirm Delete'}
                                    </button>
                                    <button onClick={() => setDeleteConfirm(null)}
                                        className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setDeleteConfirm(selectedLead.id)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl hover:bg-rose-50">
                                    <Trash2 size={14} /> Delete Lead
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Bottom Navigation Bar */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 grid grid-cols-4 h-16">
                {[
                    { id: 'overview' as View, label: 'Overview', icon: <LayoutDashboard size={18} /> },
                    { id: 'leads' as View, label: 'Leads', icon: <Users size={18} /> },
                    { id: 'enquiries' as View, label: 'Enquiries', icon: <Mail size={18} /> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setView(tab.id)}
                        className={`flex flex-col items-center justify-center gap-1 text-[11px] font-bold ${
                            view === tab.id ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="flex flex-col items-center justify-center gap-1 text-[11px] font-bold text-slate-400"
                >
                    <Menu size={18} />
                    <span>More</span>
                </button>
            </nav>

            {/* Modals */}
            <AddLeadModal
                open={showAddLead}
                onClose={() => setShowAddLead(false)}
                onCreated={() => { fetchLeads(1); fetchStats(); }}
            />

            <BulkEmailModal
                open={showBulkEmail}
                selectedIds={[...selectedIds]}
                onClose={() => setShowBulkEmail(false)}
                onSent={() => fetchLeads(page)}
            />

            {/* Mobile-Friendly Resume Preview Modal */}
            <ResumePreviewModal
                lead={previewLead}
                apiBase={getApiBase()}
                onClose={() => setPreviewLead(null)}
                onDownload={downloadResume}
            />
        </div>
    );
}

export default AdminDashboard;
