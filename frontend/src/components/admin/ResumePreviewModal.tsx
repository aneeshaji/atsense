import { useState, useEffect } from 'react';
import {
    X, FileText, Download, ExternalLink, Mail, Phone, MapPin,
    Briefcase, GraduationCap, Award, Code, Eye, Sparkles
} from 'lucide-react';

export interface AdminLead {
    id: number;
    name: string;
    email: string;
    phone: string;
    skills: string;
    resume_data?: string | Record<string, any> | null;
    source: string;
    s3_pdf_url: string | null;
    created_at: string;
    status: string;
    notes: string | null;
    welcome_email_sent_at?: string | null;
    drip_day2_sent_at?: string | null;
    drip_day5_sent_at?: string | null;
    drip_day7_sent_at?: string | null;
    is_duplicate?: boolean;
}

interface Props {
    lead: AdminLead | null;
    apiBase: string;
    onClose: () => void;
    onDownload: (id: number, name: string) => void;
}

function parseResumeData(raw: AdminLead['resume_data']): Record<string, any> | null {
    if (!raw) return null;
    if (typeof raw === 'object') return raw;
    try {
        const parsed = JSON.parse(raw);
        return typeof parsed === 'object' && parsed !== null ? parsed : null;
    } catch {
        return null;
    }
}

export default function ResumePreviewModal({ lead, apiBase, onClose, onDownload }: Props) {
    const parsedResume = lead ? parseResumeData(lead.resume_data) : null;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const [tab, setTab] = useState<'formatted' | 'pdf'>(() =>
        isMobile || parsedResume ? 'formatted' : 'pdf'
    );

    useEffect(() => {
        if (!lead) return;
        const hasData = !!parseResumeData(lead.resume_data);
        setTab(isMobile || hasData ? 'formatted' : 'pdf');
    }, [lead?.id]);

    if (!lead) return null;

    const token = encodeURIComponent(localStorage.getItem('admin_token') || '');
    const pdfUrl = `${apiBase}/admin/leads/${lead.id}/pdf?token=${token}`;

    const pi = parsedResume?.personalInfo || {};
    const displayName = pi.fullName || lead.name || 'Candidate';
    const displayEmail = pi.email || lead.email || '';
    const displayPhone = pi.phone || lead.phone || '';
    const displayLocation = pi.location || '';
    const summary = parsedResume?.summary || '';
    const experience: any[] = Array.isArray(parsedResume?.experience) ? parsedResume.experience : [];
    const education: any[] = Array.isArray(parsedResume?.education) ? parsedResume.education : [];
    const projects: any[] = Array.isArray(parsedResume?.projects) ? parsedResume.projects : [];
    const certifications: any[] = Array.isArray(parsedResume?.certifications) ? parsedResume.certifications : [];

    let skills: string[] = [];
    if (Array.isArray(parsedResume?.skills)) {
        skills = parsedResume.skills.map((s: any) => typeof s === 'string' ? s : s?.name || '').filter(Boolean);
    } else if (lead.skills) {
        try {
            const parsedSkills = JSON.parse(lead.skills);
            if (Array.isArray(parsedSkills)) skills = parsedSkills;
        } catch {}
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-sm sm:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white w-full h-full sm:w-[92vw] sm:h-[90vh] sm:max-w-4xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-white shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                            <FileText size={16} className="text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-bold text-slate-900 text-sm truncate">{displayName}</h2>
                            <p className="text-[11px] text-slate-400 truncate">Resume Snapshot</p>
                        </div>
                    </div>

                    {/* View Switcher + Actions */}
                    <div className="flex items-center gap-2 ml-auto">
                        <div className="inline-flex rounded-xl bg-slate-100 p-1">
                            <button
                                type="button"
                                onClick={() => setTab('formatted')}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    tab === 'formatted'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <Sparkles size={12} />
                                <span>Readable</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setTab('pdf')}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    tab === 'pdf'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <Eye size={12} />
                                <span>PDF</span>
                            </button>
                        </div>

                        <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
                            title="Open PDF in New Tab"
                        >
                            <ExternalLink size={13} />
                            <span>Open</span>
                        </a>

                        <button
                            type="button"
                            onClick={() => onDownload(lead.id, lead.name)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
                        >
                            <Download size={13} />
                            <span className="hidden sm:inline">Download</span>
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto bg-slate-100 p-3 sm:p-6">
                    {tab === 'formatted' ? (
                        parsedResume || skills.length > 0 ? (
                            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 space-y-6">
                                {/* Contact Header */}
                                <div className="border-b border-slate-100 pb-5">
                                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                        {displayName}
                                    </h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-xs text-slate-600">
                                        {displayEmail && (
                                            <span className="inline-flex items-center gap-1.5 break-all">
                                                <Mail size={12} className="text-indigo-500 shrink-0" />
                                                {displayEmail}
                                            </span>
                                        )}
                                        {displayPhone && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Phone size={12} className="text-indigo-500 shrink-0" />
                                                {displayPhone}
                                            </span>
                                        )}
                                        {displayLocation && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <MapPin size={12} className="text-indigo-500 shrink-0" />
                                                {displayLocation}
                                            </span>
                                        )}
                                    </div>
                                    {(pi.linkedin || pi.github || pi.portfolio) && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {pi.linkedin && (
                                                <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noreferrer"
                                                    className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg hover:bg-indigo-100">
                                                    LinkedIn ↗
                                                </a>
                                            )}
                                            {pi.github && (
                                                <a href={pi.github.startsWith('http') ? pi.github : `https://${pi.github}`} target="_blank" rel="noreferrer"
                                                    className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg hover:bg-slate-200">
                                                    GitHub ↗
                                                </a>
                                            )}
                                            {pi.portfolio && (
                                                <a href={pi.portfolio.startsWith('http') ? pi.portfolio : `https://${pi.portfolio}`} target="_blank" rel="noreferrer"
                                                    className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg hover:bg-emerald-100">
                                                    Portfolio ↗
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Summary */}
                                {summary && (
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Professional Summary</h4>
                                        <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
                                    </div>
                                )}

                                {/* Skills */}
                                {skills.length > 0 && (
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                                            <Code size={12} className="text-indigo-500" /> Skills ({skills.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {skills.map((s, i) => (
                                                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Experience */}
                                {experience.length > 0 && (
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                            <Briefcase size={12} className="text-indigo-500" /> Experience
                                        </h4>
                                        <div className="space-y-4">
                                            {experience.map((exp, idx) => (
                                                <div key={idx} className="pl-3.5 border-l-2 border-indigo-100">
                                                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                                                        <p className="text-sm font-bold text-slate-900">{exp.role || exp.title || exp.position || 'Role'}</p>
                                                        {(exp.duration || exp.startDate || exp.dates) && (
                                                            <span className="text-[11px] font-semibold text-slate-400">
                                                                {exp.duration || exp.dates || `${exp.startDate || ''} – ${exp.endDate || 'Present'}`}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {exp.company && <p className="text-xs font-semibold text-indigo-600 mt-0.5">{exp.company}</p>}
                                                    {Array.isArray(exp.bullets || exp.highlights || exp.achievements) ? (
                                                        <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc pl-4">
                                                            {(exp.bullets || exp.highlights || exp.achievements).map((b: string, bi: number) => (
                                                                <li key={bi}>{b}</li>
                                                            ))}
                                                        </ul>
                                                    ) : exp.description ? (
                                                        <p className="mt-1.5 text-xs text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {education.length > 0 && (
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                                            <GraduationCap size={12} className="text-indigo-500" /> Education
                                        </h4>
                                        <div className="space-y-2.5">
                                            {education.map((edu, idx) => (
                                                <div key={idx} className="flex flex-wrap items-baseline justify-between gap-1 bg-slate-50 rounded-xl p-3">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-800">{edu.degree || edu.field || 'Degree'}</p>
                                                        <p className="text-xs text-slate-500">{edu.institution || edu.school || ''}</p>
                                                    </div>
                                                    {(edu.year || edu.graduationDate) && (
                                                        <span className="text-[11px] font-semibold text-slate-400">{edu.year || edu.graduationDate}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Projects & Certifications */}
                                {projects.length > 0 && (
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Projects</h4>
                                        <div className="space-y-2">
                                            {projects.map((p, idx) => (
                                                <div key={idx} className="bg-slate-50 rounded-xl p-3">
                                                    <p className="text-xs font-bold text-slate-800">{p.name || p.title || 'Project'}</p>
                                                    {p.description && <p className="text-xs text-slate-600 mt-1">{p.description}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {certifications.length > 0 && (
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                            <Award size={12} className="text-indigo-500" /> Certifications
                                        </h4>
                                        <ul className="space-y-1 text-xs text-slate-700">
                                            {certifications.map((c, idx) => (
                                                <li key={idx}>• {typeof c === 'string' ? c : c.name || c.title || JSON.stringify(c)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 text-center my-8">
                                <FileText size={32} className="text-slate-300 mx-auto mb-3" />
                                <p className="text-sm font-bold text-slate-800">No structured resume text stored</p>
                                <p className="text-xs text-slate-500 mt-1 mb-5">This lead was captured via email/exit-intent or before structured parsing. Open or download the PDF instead.</p>
                                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">
                                        <ExternalLink size={14} /> Open PDF
                                    </a>
                                    <button onClick={() => onDownload(lead.id, lead.name)}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold">
                                        <Download size={14} /> Download PDF
                                    </button>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="h-full flex flex-col gap-3">
                            {/* Mobile-friendly PDF action bar (mobile browsers don't render PDF iframes) */}
                            <div className="md:hidden bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex flex-col gap-3 shrink-0">
                                <p className="text-xs font-semibold text-indigo-900">
                                    Mobile browsers don&apos;t support embedded PDF viewers. Use the buttons below to view or switch to the <strong>Readable</strong> tab.
                                </p>
                                <div className="flex gap-2">
                                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">
                                        <ExternalLink size={14} /> Open PDF
                                    </a>
                                    <button onClick={() => onDownload(lead.id, lead.name)}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-xs font-bold">
                                        <Download size={14} /> Download
                                    </button>
                                </div>
                            </div>
                            <iframe
                                src={pdfUrl}
                                className="hidden md:block w-full flex-1 rounded-xl border border-slate-200 bg-white shadow-sm min-h-[500px]"
                                title="Resume PDF Preview"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
