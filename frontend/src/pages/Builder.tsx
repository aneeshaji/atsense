import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ATSScoreBreakdown from '../components/ATSScoreBreakdown';
import AdvancedScorecard from '../components/AdvancedScorecard';
import ShareableScoreCard from '../components/ShareableScoreCard';
import { COMPANY_PRESETS } from '../data/companyPresets';
import { useToast } from '../context/ToastContext';
import { useModal } from '../context/ModalContext';
import { useReactToPrint } from 'react-to-print';
import { trackEvent, ANALYTICS_EVENTS } from '../services/analytics';
import HarvardTemplate from '../templates/HarvardTemplate';
import ExecutiveTemplate from '../templates/ExecutiveTemplate';
import ModernTechTemplate from '../templates/ModernTechTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import {
    Download,
    Trash2,
    Plus,
    Sparkles,
    FileText,
    Briefcase,
    User,
    GraduationCap,
    Activity,
    ChevronDown,
    X,
    Eye,
    EyeOff,
    Code,
    Upload,
    Zap,
    Globe,
    BrainCircuit,
    Loader2,
    Share2,
    CheckCircle,
} from 'lucide-react';

interface Resume {
    title: string;
    atsScore: number;
    summary: string;
    experience: any[];
    skills: string[];
    education: any[];
    certifications: any[];
    projects: any[];
    languages: any[];
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        linkedin?: string;
        github?: string;
        portfolio?: string;
    };
}

const emptyResume: Resume = {
    title: 'My Resume',
    atsScore: 0,
    summary: '',
    experience: [],
    skills: [],
    education: [],
    certifications: [],
    projects: [],
    languages: [],
    personalInfo: {
        fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '',
    },
};

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all placeholder-gray-300';
const smallInputCls = 'w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all placeholder-gray-300';
const labelCls = 'block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5';

export default function Builder() {
    const { showToast } = useToast();
    const { showConfirm } = useModal();

    const [resume, setResume] = useState<Resume | null>(null);
    const [showPreview, setShowPreview] = useState(true);
    const [importing, setImporting] = useState(false);
    const [optimizing, setOptimizing] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const [atsBreakdown, setAtsBreakdown] = useState<any>(null);
    const [showAdvancedScore, setShowAdvancedScore] = useState(false);
    const [showTailorModal, setShowTailorModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [atsScore, setAtsScore] = useState<number>(0);
    const [jobDescription, setJobDescription] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [openSections, setOpenSections] = useState<Set<string>>(new Set(['personal']));
    const [templateId, setTemplateId] = useState('harvard');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const componentRef = useRef<any>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const isResumePopulated = resume && (resume.personalInfo?.fullName !== '' || (resume.experience && resume.experience.length > 0));

    const handleDownload = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Resume-${resume?.personalInfo?.fullName || 'Untitled'}`,
        onAfterPrint: () => setShowSuccessModal(true),
    });

    useEffect(() => {
        const saved = localStorage.getItem('atsense_current_resume');
        const savedJD = localStorage.getItem('atsense_current_jd');
        const savedTitle = localStorage.getItem('atsense_current_title');
        if (saved) {
            const parsed = JSON.parse(saved);
            setResume(parsed);
            setAtsScore(Number(parsed.atsScore || 0));
        } else {
            setResume(emptyResume);
        }
        if (savedJD) setJobDescription(savedJD);
        if (savedTitle) setJobTitle(savedTitle);
        const templateParam = searchParams.get('template');
        if (templateParam) setTemplateId(templateParam);

        const targetParam = searchParams.get('target');
        if (targetParam && COMPANY_PRESETS[targetParam.toLowerCase()]) {
            const preset = COMPANY_PRESETS[targetParam.toLowerCase()];
            setJobTitle(prev => prev || `${preset.name} Role`);
            setJobDescription(prev => prev || `Target Company: ${preset.name} (${preset.atsPlatform})\nRequired ATS Formula: ${preset.atsFormula}\nTarget Keywords: ${preset.mustHaveKeywords.join(', ')}\n\n`);
            setShowTailorModal(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (resume) {
            localStorage.setItem('atsense_current_resume', JSON.stringify({ ...resume, atsScore }));
            localStorage.setItem('atsense_current_jd', jobDescription);
            localStorage.setItem('atsense_current_title', jobTitle);
        }
    }, [resume, jobDescription, jobTitle, atsScore]);

    const toggleSection = (id: string) => {
        setOpenSections(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const fetchBreakdown = async (currentResume?: Resume, autoShowModal = false) => {
        const targetResume = currentResume || resume;
        if (!targetResume || !isResumePopulated) return;
        if (!jobDescription && !autoShowModal) {
            showToast('Add a Job Description first for analysis.', 'info');
            setShowTailorModal(true);
            return;
        }
        setAnalyzing(true);
        try {
            const response = await api.post('/analyze-ats', {
                resume_text: JSON.stringify(targetResume),
                job_description: jobDescription
            });
            const freshData = response.data;
            const numericScore = Number(freshData.overallScore || freshData.total_score || freshData.score || 0);
            const updatedResume = { ...targetResume, atsScore: numericScore };
            setResume(updatedResume);
            setAtsScore(numericScore);
            localStorage.setItem('atsense_current_resume', JSON.stringify(updatedResume));
            setAtsBreakdown(freshData);
            showToast('ATS analysis complete!', 'success');
            if (autoShowModal) setShowAdvancedScore(true);
        } catch {
            showToast('Analysis failed.', 'error');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            showToast('Please upload a PDF or DOCX file.', 'error');
            return;
        }

        await doImport(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const doImport = useCallback(async (file: File) => {
        const formData = new FormData();
        formData.append('resume', file);
        setImporting(true);
        try {
            const res = await api.post('/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 120000,
            });
            
            const freshResume = res.data.resume || res.data;
            const importedResume = { ...freshResume, atsScore: 0 };
            
            localStorage.setItem('atsense_current_resume', JSON.stringify(importedResume));
            setResume(importedResume);
            setAtsScore(0);
            
            trackEvent(ANALYTICS_EVENTS.CONVERSION.RESUME_UPLOAD, 'Conversion', file.name);
            
            setOpenSections(new Set(['personal', 'summary', 'experience']));
            showToast('Resume imported successfully!', 'success');
        } catch {
            showToast('Failed to import resume.', 'error');
        } finally {
            setImporting(false);
        }
    }, [jobDescription, fetchBreakdown]);

    const performOptimization = async () => {
        if (!jobDescription || !jobTitle) {
            showToast('Please fill in both Job Title and Description.', 'info');
            return;
        }
        setOptimizing(true);
        try {
            const response = await api.post('/optimize-resume', {
                resume: JSON.stringify(resume),
                job_description: jobDescription,
                job_title: jobTitle
            });
            const optimized = response.data.optimized_resume;
            const numericScore = Number(optimized.overallScore || response.data.overallScore || response.data.total_score || 0);
            setResume(optimized);
            setAtsScore(numericScore);
            setShowTailorModal(false);
            showToast('AI Tailoring Complete!', 'success');
            setTimeout(() => fetchBreakdown(optimized, true), 800);
        } catch {
            showToast('AI tailoring failed.', 'error');
        } finally {
            setOptimizing(false);
        }
    };

    const handleExtract = async () => {
        if (!jobDescription) return;
        setExtracting(true);
        try {
            const res = await api.post('/ai/jobs/extract', { url_or_text: jobDescription });
            const data = res.data;
            if (data.jobTitle) setJobTitle(data.jobTitle);
            const cleanedDesc = `Job Title: ${data.jobTitle}\nCompany: ${data.companyName}\n\n${data.jobDescription}`;
            setJobDescription(cleanedDesc);
            showToast('Successfully extracted and cleaned job details!', 'success');
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.suggestion || err.response?.data?.message || 'Extraction failed. Please paste the job description text manually.';
            showToast(msg, 'error');
        } finally {
            setExtracting(false);
        }
    };

    const clearResume = () => {
        showConfirm({
            title: 'Reset Workspace',
            message: 'All current progress will be permanently cleared. Are you sure?',
            confirmText: 'Reset All',
            onConfirm: () => {
                localStorage.removeItem('atsense_current_resume');
                localStorage.removeItem('atsense_current_jd');
                localStorage.removeItem('atsense_current_title');
                setResume(emptyResume);
                setAtsScore(0);
                setJobDescription('');
                setJobTitle('');
                setAtsBreakdown(null);
                showToast('Workspace reset.', 'info');
            }
        });
    };

    const updateExperience = (index: number, field: string, value: any) => {
        setResume(prev => {
            if (!prev) return prev;
            const newExp = [...prev.experience];
            newExp[index] = { ...newExp[index], [field]: value };
            return { ...prev, experience: newExp };
        });
    };

    const addExperience = () => {
        setResume(prev => prev ? { ...prev, experience: [...prev.experience, { title: '', company: '', startDate: '', endDate: '', description: '' }] } : prev);
    };

    const removeExperience = (index: number) => {
        setResume(prev => {
            if (!prev) return prev;
            const newExp = [...prev.experience];
            newExp.splice(index, 1);
            return { ...prev, experience: newExp };
        });
    };

    const scoreColor = atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : '#ef4444';
    const scoreStatusLabel = atsScore >= 80 ? 'OPTIMIZED' : atsScore >= 60 ? 'GOOD' : atsScore > 0 ? 'NEEDS WORK' : isResumePopulated ? 'NEEDS TAILOR' : 'NEED ANALYSIS';
    const scoreStatusColor = atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : atsScore > 0 ? '#ef4444' : '#9ca3af';

    const accordionSections = [
        { id: 'personal', label: 'Basic Information', icon: User, number: '01' },
        { id: 'summary', label: 'Professional Summary', icon: FileText, number: '02' },
        { id: 'experience', label: 'Work Experience', icon: Briefcase, number: '03' },
        { id: 'education', label: 'Academic History', icon: GraduationCap, number: '04' },
        { id: 'skills', label: 'Skills & Competencies', icon: Code, number: '05' },
        { id: 'languages', label: 'Languages', icon: Globe, number: '06' },
    ];

    if (!resume) return null;

    return (
        <>
        <div className="min-h-screen bg-[#f4f5f7] flex flex-col">

            {/* ── PREMIUM HEADER BAR ── */}
            <header className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-[0_1px_12px_rgba(0,0,0,0.06)]">
                <div className="max-w-full mx-auto px-6 py-4 flex flex-col gap-4">
                    
                    {/* ── ROW 1: App Header ── */}
                    <div className="flex items-center justify-between pl-1">
                        {/* Brand (Left) */}
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-md">
                                <FileText size={18} className="text-white" strokeWidth={2.5} />
                            </div>
                            <div className="flex items-center gap-2 ml-0.5">
                                <h1 className="text-xl font-black text-gray-900 leading-none tracking-tight">Career Studio</h1>
                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold rounded tracking-widest uppercase shadow-sm">AI</span>
                            </div>
                        </div>

                        {/* Global Actions (Right) */}
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={clearResume}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-400 text-xs font-semibold hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                            >
                                <Trash2 size={13} strokeWidth={2} />
                                Reset
                            </button>

                            <button
                                disabled={!isResumePopulated}
                                onClick={() => setShowPreview(p => !p)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border shadow-sm ${
                                    !isResumePopulated
                                        ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-100 text-gray-400'
                                        : showPreview
                                            ? 'bg-gray-900 border-gray-900 text-white'
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                            >
                                {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
                                <span className="hidden sm:inline">{showPreview ? 'Hide Layout' : 'Preview Layout'}</span>
                            </button>
                        </div>
                    </div>

                    {/* ── ROW 2: The Cockpit Action Workflow ── */}
                    <div className="flex items-center w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-3 py-2.5 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-x-auto scrollbar-hide mt-1">
                        
                        {/* Pipeline Container */}
                        <div className="flex items-center w-full min-w-[700px] justify-between">
                            
                            {/* Step 1: IMPORT ROOT ACTION */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={importing}
                                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-[13px] font-black hover:bg-indigo-700 transition-all duration-200 shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_4px_16px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 shrink-0 disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {importing ? (
                                    <>
                                        <Loader2 size={15} className="animate-spin" />
                                        <span>Scanning CV...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={15} strokeWidth={3} />
                                        <span>Import Target CV</span>
                                    </>
                                )}
                            </button>

                            {/* Connector */}
                            <div className="flex-1 mx-2 sm:mx-4 h-[1.5px] bg-[repeating-linear-gradient(90deg,#cbd5e1_0px,#cbd5e1_4px,transparent_4px,transparent_8px)] opacity-60 min-w-[20px]" />

                            {/* Step 2: ATS Analyzer */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    type="button"
                                    disabled={!isResumePopulated}
                                    onClick={() => isResumePopulated && fetchBreakdown(undefined, true)}
                                    className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border font-bold transition-all duration-200 select-none shrink-0 ${
                                        !isResumePopulated
                                            ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400'
                                            : atsScore > 0
                                                ? 'bg-white border-emerald-300 text-slate-800 shadow-sm hover:shadow-md hover:border-emerald-400 hover:-translate-y-0.5'
                                                : 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400 text-white shadow-[0_3px_14px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.55)] hover:-translate-y-0.5 hover:scale-[1.02]'
                                    }`}
                                >
                                    {/* Gauge ring */}
                                    <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
                                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" r="14" fill="none" stroke={!isResumePopulated ? '#cbd5e1' : atsScore > 0 ? '#d1fae5' : 'rgba(255,255,255,0.3)'} strokeWidth="4" />
                                            <circle cx="18" cy="18" r="14" fill="none" stroke={!isResumePopulated ? '#94a3b8' : atsScore > 0 ? scoreColor : 'rgba(255,255,255,0.9)'} strokeWidth="4" strokeDasharray={`${(atsScore / 100) * 87.96} 87.96`} strokeLinecap="round" className="transition-all duration-1000" />
                                        </svg>
                                        {analyzing ? (
                                            <Activity size={10} className={`animate-spin ${!isResumePopulated || atsScore > 0 ? 'text-slate-500' : 'text-white'}`} />
                                        ) : (
                                            <span className={`text-[8px] font-black tabular-nums ${!isResumePopulated ? 'text-slate-500' : atsScore > 0 ? 'text-slate-800' : 'text-white'}`}>{atsScore > 0 ? `${atsScore}%` : '?'}</span>
                                        )}
                                    </div>
                                    {/* Label */}
                                    <div className="text-left leading-none">
                                        <p className={`text-[11px] font-extrabold leading-none mb-0.5 ${!isResumePopulated ? 'text-slate-500' : atsScore > 0 ? 'text-slate-800' : 'text-white'}`}>
                                            {analyzing ? 'Analyzing…' : atsScore > 0 ? 'ATS Score' : 'ATS Check'}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            {atsScore > 0 && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: scoreStatusColor }} />}
                                            <p className={`text-[8px] font-semibold uppercase tracking-wide ${!isResumePopulated || atsScore > 0 ? 'text-slate-500' : 'text-white/80'}`}>
                                                {analyzing ? 'Please wait' : atsScore > 0 ? scoreStatusLabel : 'Run Now'}
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                {atsScore > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setShowShareModal(true)}
                                        title="Share Verified Scorecard"
                                        className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-[0_2px_8px_rgba(139,92,246,0.4)] hover:shadow-[0_4px_14px_rgba(139,92,246,0.55)] hover:-translate-y-0.5 transition-all shrink-0"
                                    >
                                        <Share2 size={13} />
                                    </button>
                                )}
                            </div>

                            {/* Connector */}
                            <div className="flex-1 mx-2 sm:mx-4 h-[1.5px] bg-[repeating-linear-gradient(90deg,#cbd5e1_0px,#cbd5e1_4px,transparent_4px,transparent_8px)] opacity-60 min-w-[20px]" />

                            {/* Step 3: DEEP TAILOR */}
                            <div className="relative group shrink-0">
                                <button
                                    disabled={!isResumePopulated}
                                    onClick={() => setShowTailorModal(true)}
                                    className={`relative flex items-center gap-3 px-6 sm:px-7 py-2.5 sm:py-3 rounded-2xl text-[14px] font-black tracking-wide transition-all duration-300 overflow-hidden shrink-0 ${
                                        !isResumePopulated
                                            ? 'opacity-40 cursor-not-allowed bg-slate-200 border border-slate-300 text-slate-500'
                                            : 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-[0_4px_20px_rgba(139,92,246,0.45)] border border-violet-400/50 hover:shadow-[0_8px_32px_rgba(139,92,246,0.65)] hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.99]'
                                    }`}
                                >
                                    {isResumePopulated && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                                    )}
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${isResumePopulated ? 'bg-white/20' : 'bg-slate-300/60'}`}>
                                        <Sparkles size={18} className={isResumePopulated ? 'text-white animate-pulse' : 'text-slate-500'} />
                                    </div>
                                    <div className="text-left">
                                        <div className="flex items-center gap-1.5 leading-none">
                                            <span className={`text-[14px] font-black ${isResumePopulated ? 'text-white' : 'text-slate-500'}`}>Deep Tailor</span>
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide ${isResumePopulated ? 'bg-white/25 text-white' : 'bg-slate-300 text-slate-600'}`}>AI</span>
                                        </div>
                                        <span className={`block text-[10px] font-semibold mt-1 leading-none ${isResumePopulated ? 'text-purple-100/90' : 'text-slate-400'}`}>
                                            Auto-Match to Any Job
                                        </span>
                                    </div>
                                </button>
                            </div>

                            {/* Connector */}
                            <div className="flex-1 mx-2 sm:mx-4 h-[1.5px] bg-[repeating-linear-gradient(90deg,#cbd5e1_0px,#cbd5e1_4px,transparent_4px,transparent_8px)] opacity-60 min-w-[20px]" />

                            {/* Step 4: Interview Prep */}
                            <button
                                disabled={!isResumePopulated}
                                onClick={() => navigate('/interview-prep')}
                                className={`flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-200 border border-transparent shrink-0 ${
                                    !isResumePopulated
                                        ? 'opacity-40 cursor-not-allowed text-slate-400'
                                        : 'text-slate-700 bg-white shadow-sm hover:text-amber-700 hover:border-amber-200 hover:shadow-md'
                                }`}
                            >
                                <BrainCircuit size={14} className={isResumePopulated ? "text-amber-500" : ""} />
                                Interview Prep
                            </button>
                            
                            {/* Connector */}
                            <div className="flex-1 mx-2 sm:mx-4 h-[1.5px] bg-[repeating-linear-gradient(90deg,#cbd5e1_0px,#cbd5e1_4px,transparent_4px,transparent_8px)] opacity-60 min-w-[20px]" />

                            {/* Step 5: Download Action */}
                            <button
                                disabled={!resume.personalInfo?.fullName}
                                onClick={handleDownload}
                                className={`flex items-center gap-1.5 sm:gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-200 shrink-0 mr-1 ${
                                    !resume.personalInfo?.fullName
                                        ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-400 border border-slate-200'
                                        : 'bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 shadow-[0_4px_12px_rgba(15,23,42,0.2)] hover:-translate-y-0.5'
                                }`}
                            >
                                <Download size={14} />
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            {/* Subtle bottom accent line */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-indigo-200/60 to-transparent" />
        </header>

            {/* ── MAIN LAYOUT ── */}
            <div className={`flex-1 max-w-full mx-auto w-full p-5 lg:p-8 gap-5 ${showPreview ? 'grid grid-cols-1 xl:grid-cols-2 items-start' : 'flex flex-col'}`}>

                {/* ── LEFT: Accordion Editor ── */}
                <div className="space-y-3 min-w-0">

                    {/* ATS Breakdown Card */}
                    {atsBreakdown && (
                        <div className="animate-in slide-in-from-top-4 duration-500">
                            <ATSScoreBreakdown breakdown={atsBreakdown} onShare={() => setShowShareModal(true)} />
                        </div>
                    )}

                    {/* Accordion Sections */}
                    {accordionSections.map(({ id, label, icon: Icon, number }) => {
                        const isOpen = openSections.has(id);
                        return (
                            <div key={id} className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                                !isResumePopulated 
                                    ? 'border-gray-100/50 opacity-60 mix-blend-luminosity' 
                                    : 'border-gray-200/80 shadow-sm'
                            }`}>
                                {/* Accordion Header */}
                                <button
                                    disabled={!isResumePopulated}
                                    onClick={() => toggleSection(id)}
                                    className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${
                                        !isResumePopulated ? 'cursor-not-allowed' : 'hover:bg-gray-50/80'
                                    }`}
                                >
                                    <span className="text-[10px] font-black text-gray-300 tracking-widest w-5 shrink-0 tabular-nums">
                                        {number}
                                    </span>
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                        isOpen && isResumePopulated ? 'bg-indigo-600 shadow-md shadow-indigo-200' : 'bg-gray-100'
                                    }`}>
                                        <Icon size={15} className={isOpen && isResumePopulated ? 'text-white' : 'text-gray-400'} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] leading-none">Section {number}</p>
                                        <h2 className={`text-sm font-bold mt-0.5 ${!isResumePopulated ? 'text-gray-400' : 'text-gray-900'}`}>{label}</h2>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className={`text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Accordion Body */}
                                {isOpen && (
                                    <div className="border-t border-gray-100">

                                        {/* ── Personal Info ── */}
                                        {id === 'personal' && (
                                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className={labelCls}>Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={resume.personalInfo?.fullName || ''}
                                                        onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, fullName: e.target.value } })}
                                                        className={inputCls}
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Email</label>
                                                    <input
                                                        type="email"
                                                        value={resume.personalInfo?.email || ''}
                                                        onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, email: e.target.value } })}
                                                        className={inputCls}
                                                        placeholder="you@example.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Phone</label>
                                                    <input
                                                        type="text"
                                                        value={resume.personalInfo?.phone || ''}
                                                        onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, phone: e.target.value } })}
                                                        className={inputCls}
                                                        placeholder="+1 234 567 890"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className={labelCls}>Location</label>
                                                    <input
                                                        type="text"
                                                        value={resume.personalInfo?.location || ''}
                                                        onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, location: e.target.value } })}
                                                        className={inputCls}
                                                        placeholder="New York, NY"
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>LinkedIn</label>
                                                    <input
                                                        type="text"
                                                        value={resume.personalInfo?.linkedin || ''}
                                                        onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, linkedin: e.target.value } })}
                                                        className={inputCls}
                                                        placeholder="linkedin.com/in/johndoe"
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>GitHub</label>
                                                    <input
                                                        type="text"
                                                        value={resume.personalInfo?.github || ''}
                                                        onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, github: e.target.value } })}
                                                        className={inputCls}
                                                        placeholder="github.com/johndoe"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* ── Professional Summary ── */}
                                        {id === 'summary' && (
                                            <div className="p-5">
                                                <label className={labelCls}>Summary</label>
                                                <textarea
                                                    rows={7}
                                                    value={resume.summary || ''}
                                                    onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                                                    className={inputCls + ' resize-none leading-relaxed'}
                                                    placeholder="Write a concise professional summary highlighting your key achievements and expertise..."
                                                />
                                                <p className="text-[11px] text-gray-400 mt-2">{resume.summary?.length || 0} characters — aim for 150–250</p>
                                            </div>
                                        )}

                                        {/* ── Work Experience ── */}
                                        {id === 'experience' && (
                                            <div className="p-5 space-y-4">
                                                {resume.experience.length === 0 && (
                                                    <div className="text-center py-8">
                                                        <Briefcase size={28} className="text-gray-200 mx-auto mb-2" />
                                                        <p className="text-sm font-semibold text-gray-400">No experience entries yet</p>
                                                        <p className="text-xs text-gray-300 mt-1">Click below to add your work history</p>
                                                    </div>
                                                )}
                                                {resume.experience.map((exp, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                                                        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                                                            <span className="text-xs font-bold text-gray-500">
                                                                {exp.title || `Position ${index + 1}`}{exp.company ? ` @ ${exp.company}` : ''}
                                                            </span>
                                                            <button onClick={() => removeExperience(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div>
                                                                <label className={labelCls}>Job Title</label>
                                                                <input type="text" value={exp.title || ''} onChange={(e) => updateExperience(index, 'title', e.target.value)} className={smallInputCls} placeholder="Software Engineer" />
                                                            </div>
                                                            <div>
                                                                <label className={labelCls}>Company</label>
                                                                <input type="text" value={exp.company || ''} onChange={(e) => updateExperience(index, 'company', e.target.value)} className={smallInputCls} placeholder="Acme Corp" />
                                                            </div>
                                                            <div>
                                                                <label className={labelCls}>Start Date</label>
                                                                <input type="text" value={exp.startDate || ''} onChange={(e) => updateExperience(index, 'startDate', e.target.value)} placeholder="Jan 2022" className={smallInputCls} />
                                                            </div>
                                                            <div>
                                                                <label className={labelCls}>End Date</label>
                                                                <input type="text" value={exp.endDate || ''} onChange={(e) => updateExperience(index, 'endDate', e.target.value)} placeholder="Present" className={smallInputCls} />
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <label className={labelCls}>Description</label>
                                                                <textarea rows={4} value={exp.description || ''} onChange={(e) => updateExperience(index, 'description', e.target.value)} className={smallInputCls + ' resize-none leading-relaxed'} placeholder="Describe your key responsibilities and achievements..." />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={addExperience}
                                                    className="w-full py-3 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-600 text-sm font-semibold hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={15} /> Add Work Experience
                                                </button>
                                            </div>
                                        )}

                                        {/* ── Education ── */}
                                        {id === 'education' && (
                                            <div className="p-5 space-y-4">
                                                {resume.education.length === 0 && (
                                                    <div className="text-center py-8">
                                                        <GraduationCap size={28} className="text-gray-200 mx-auto mb-2" />
                                                        <p className="text-sm font-semibold text-gray-400">No education entries yet</p>
                                                    </div>
                                                )}
                                                {resume.education.map((edu, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                                                        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                                                            <span className="text-xs font-bold text-gray-500">{edu.institution || `Institution ${index + 1}`}</span>
                                                            <button
                                                                onClick={() => { const n = [...resume.education]; n.splice(index, 1); setResume({ ...resume, education: n }); }}
                                                                className="text-gray-300 hover:text-red-500 transition-colors"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                                                            <div className="md:col-span-3">
                                                                <label className={labelCls}>Institution</label>
                                                                <input type="text" value={edu.institution || ''} onChange={(e) => { const n = [...resume.education]; n[index].institution = e.target.value; setResume({ ...resume, education: n }); }} className={smallInputCls} placeholder="University of..." />
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <label className={labelCls}>Degree</label>
                                                                <input type="text" value={edu.degree || ''} onChange={(e) => { const n = [...resume.education]; n[index].degree = e.target.value; setResume({ ...resume, education: n }); }} className={smallInputCls} placeholder="B.Sc Computer Science" />
                                                            </div>
                                                            <div>
                                                                <label className={labelCls}>Year</label>
                                                                <input type="text" value={edu.endDate || ''} onChange={(e) => { const n = [...resume.education]; n[index].endDate = e.target.value; setResume({ ...resume, education: n }); }} className={smallInputCls} placeholder="2024" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setResume({ ...resume, education: [...resume.education, { institution: '', degree: '', endDate: '' }] })}
                                                    className="w-full py-3 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-600 text-sm font-semibold hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={15} /> Add Education
                                                </button>
                                            </div>
                                        )}

                                        {/* ── Skills ── */}
                                        {id === 'skills' && (
                                            <div className="p-5">
                                                <label className={labelCls}>Skills <span className="normal-case font-normal text-gray-300">— one per line</span></label>
                                                <textarea
                                                    rows={9}
                                                    value={resume.skills?.join('\n') || ''}
                                                    onChange={(e) => setResume({ ...resume, skills: e.target.value.split('\n') })}
                                                    className={inputCls + ' resize-none font-mono text-xs leading-loose'}
                                                    placeholder={"React\nNode.js\nTypeScript\nPython\n..."}
                                                />
                                                {resume.skills?.filter(s => s.trim()).length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                                        {resume.skills.filter(s => s.trim()).map((s, i) => (
                                                            <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[11px] font-semibold rounded-lg border border-indigo-100">
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* ── Languages ── */}
                                        {id === 'languages' && (
                                            <div className="p-5 space-y-3">
                                                {(resume.languages || []).length === 0 && (
                                                    <div className="text-center py-8">
                                                        <Globe size={28} className="text-gray-200 mx-auto mb-2" />
                                                        <p className="text-sm font-semibold text-gray-400">No languages added yet</p>
                                                    </div>
                                                )}
                                                {(resume.languages || []).map((lang: any, index: number) => (
                                                    <div key={index} className="flex items-center gap-3">
                                                        <input
                                                            type="text"
                                                            value={typeof lang === 'string' ? lang : lang.language || ''}
                                                            onChange={(e) => {
                                                                const n = [...(resume.languages || [])];
                                                                n[index] = typeof lang === 'string' ? e.target.value : { ...lang, language: e.target.value };
                                                                setResume({ ...resume, languages: n });
                                                            }}
                                                            className={smallInputCls}
                                                            placeholder="e.g. English"
                                                        />
                                                        {typeof lang !== 'string' && (
                                                            <input
                                                                type="text"
                                                                value={lang.proficiency || ''}
                                                                onChange={(e) => {
                                                                    const n = [...(resume.languages || [])];
                                                                    n[index] = { ...lang, proficiency: e.target.value };
                                                                    setResume({ ...resume, languages: n });
                                                                }}
                                                                className={smallInputCls}
                                                                placeholder="Proficiency (e.g. Fluent)"
                                                            />
                                                        )}
                                                        <button
                                                            onClick={() => { const n = [...(resume.languages || [])]; n.splice(index, 1); setResume({ ...resume, languages: n }); }}
                                                            className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setResume({ ...resume, languages: [...(resume.languages || []), { language: '', proficiency: '' }] })}
                                                    className="w-full py-3 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-600 text-sm font-semibold hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={15} /> Add Language
                                                </button>
                                            </div>
                                        )}

                                    </div>
                                )}
                            </div>
                        );
                    })}


                </div>

                {/* ── RIGHT: Live Preview Panel — shows during import and after population ── */}
                {showPreview && (isResumePopulated || importing) && (
                    <div className="hidden xl:flex flex-col sticky top-24 h-[calc(100vh-7rem)]">
                        <div className="bg-gray-950 rounded-2xl h-full shadow-2xl flex flex-col overflow-hidden">
                            {/* Preview Header */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${importing ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                                        {importing ? 'Parsing Resume...' : 'Live Preview'}
                                    </span>
                                    <span className="text-[10px] text-white/20 ml-1">
                                        {importing ? '• Processing' : '• Real-time update'}
                                    </span>
                                </div>
                                <div className="flex bg-white/10 rounded-lg p-0.5 gap-0.5">
                                    <button
                                        onClick={() => setTemplateId('harvard')}
                                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${templateId === 'harvard' ? 'bg-white text-gray-950 shadow-sm' : 'text-white/50 hover:text-white'}`}
                                    >
                                        Elite
                                    </button>
                                    <button
                                        onClick={() => setTemplateId('executive')}
                                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${templateId === 'executive' ? 'bg-white text-gray-950 shadow-sm' : 'text-white/50 hover:text-white'}`}
                                    >
                                        Clean
                                    </button>
                                    <button
                                        onClick={() => setTemplateId('modern')}
                                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${templateId === 'modern' ? 'bg-white text-gray-950 shadow-sm' : 'text-white/50 hover:text-white'}`}
                                    >
                                        Modern
                                    </button>
                                    <button
                                        onClick={() => setTemplateId('classic')}
                                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${templateId === 'classic' ? 'bg-white text-gray-950 shadow-sm' : 'text-white/50 hover:text-white'}`}
                                    >
                                        Finance
                                    </button>
                                </div>
                            </div>
                            {/* Preview Content */}
                            {importing ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-900 mx-4 my-4 rounded-xl border border-white/5">
                                    <div className="relative w-14 h-14 mb-4 flex items-center justify-center">
                                        <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping" />
                                        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                            <Sparkles className="text-white animate-pulse" size={22} />
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-bold text-white mb-1">Parsing Resume with AI...</h4>
                                    <p className="text-xs text-white/40 text-center max-w-xs mb-6">Structuring your experience, skills, and details into the live preview template</p>
                                    <div className="w-full max-w-xs space-y-2.5">
                                        <div className="h-4 bg-white/10 rounded-md animate-pulse w-3/4 mx-auto" />
                                        <div className="h-3 bg-white/5 rounded-md animate-pulse w-1/2 mx-auto" />
                                        <div className="h-16 bg-white/5 rounded-lg animate-pulse mt-4" />
                                        <div className="h-20 bg-white/5 rounded-lg animate-pulse" />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto bg-gray-200 mx-4 my-4 rounded-xl">
                                    <div className="scale-[0.72] origin-top-left w-[138.9%]">
                                        {templateId === 'harvard' && <HarvardTemplate ref={componentRef} resume={resume} />}
                                        {templateId === 'executive' && <ExecutiveTemplate ref={componentRef} resume={resume} />}
                                        {templateId === 'modern' && <ModernTechTemplate ref={componentRef} resume={resume} />}
                                        {templateId === 'classic' && <ClassicTemplate ref={componentRef} resume={resume} />}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* Hidden file input */}
            <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".pdf,.docx" />

            {/* ── Deep Tailor Modal ── */}
            {showTailorModal && (
                <div
                    className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
                    onClick={() => setShowTailorModal(false)}
                >
                    <div
                        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-200">
                                    <Sparkles size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Deep Tailor</h3>
                                    <p className="text-xs text-gray-400">AI-powered resume optimization for your target role</p>
                                </div>
                            </div>
                            <button onClick={() => setShowTailorModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        {/* Modal Body */}
                        <div className="p-8 space-y-5">
                            <div>
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                                    Target Company Presets (1-Click Fill)
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {[
                                        { name: 'Google', slug: 'google' },
                                        { name: 'Amazon', slug: 'amazon' },
                                        { name: 'Meta', slug: 'meta' },
                                        { name: 'Microsoft', slug: 'microsoft' },
                                        { name: 'Deloitte', slug: 'deloitte' },
                                        { name: 'Goldman Sachs', slug: 'goldman-sachs' },
                                    ].map((comp) => (
                                        <button
                                            key={comp.slug}
                                            type="button"
                                            onClick={() => {
                                                const p = COMPANY_PRESETS[comp.slug];
                                                if (p) {
                                                    setJobTitle(`${p.name} Role`);
                                                    setJobDescription(`Target Company: ${p.name} (${p.atsPlatform})\nRequired ATS Formula: ${p.atsFormula}\nTarget Keywords: ${p.mustHaveKeywords.join(', ')}\n\n`);
                                                }
                                            }}
                                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-violet-100 text-gray-700 hover:text-violet-700 text-xs font-semibold border border-gray-200 hover:border-violet-300 transition-colors"
                                        >
                                            ⚡ {comp.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className={labelCls + ' text-gray-500'}>Job Title</label>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    className={inputCls}
                                    placeholder="e.g. Senior Software Engineer"
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className={labelCls + ' text-gray-500 mb-0'}>Job Description or URL</label>
                                    <button 
                                        onClick={handleExtract}
                                        disabled={extracting || !jobDescription || optimizing}
                                        className="flex items-center gap-1.5 px-3 py-1 bg-violet-50 hover:bg-violet-100 text-violet-700 text-[11px] font-bold rounded-lg transition-all border border-violet-200 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {extracting ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                        {extracting ? 'Extracting...' : 'Magic Clean / Extract'}
                                    </button>
                                </div>
                                <textarea
                                    rows={8}
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className={inputCls + ' resize-none leading-relaxed'}
                                    placeholder="Paste the full job description here. The AI will tailor your resume to match the requirements..."
                                />
                            </div>
                            <button
                                onClick={performOptimization}
                                disabled={optimizing}
                                className="w-full py-4 bg-violet-600 text-white rounded-2xl font-bold text-sm hover:bg-violet-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-violet-200/50 disabled:opacity-70 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {optimizing ? <Activity size={18} className="animate-spin" /> : <Zap size={18} />}
                                {optimizing ? 'Optimizing your resume...' : 'Start Deep Tailoring'}
                            </button>
                            <p className="text-center text-xs text-gray-400">
                                AI will rewrite your summary, experience bullet points, and skills to match the JD
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Advanced Score Modal */}
            {showAdvancedScore && <AdvancedScorecard data={atsBreakdown} onClose={() => setShowAdvancedScore(false)} />}

            {/* Viral Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[400] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-500 relative">
                        {/* Confetti Background Effect */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
                        
                        <div className="p-10 text-center relative z-10">
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-green-50/50">
                                <CheckCircle size={48} className="text-green-500" />
                            </div>
                            
                            <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Success! 🚀</h2>
                            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                                Your elite resume has been exported. You are now armed with an ATS-bypassing document.
                            </p>
                            
                            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8 text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[50px] opacity-20 -mr-10 -mt-10"></div>
                                <h4 className="font-black text-indigo-900 mb-2 relative z-10 flex items-center gap-2 mt-1">
                                    <Zap size={16} className="text-indigo-600" fill="currentColor"/> Pay It Forward
                                </h4>
                                <p className="text-sm text-indigo-700/80 leading-relaxed relative z-10 font-medium">
                                    Did ATSense help you fix your resume? Share it with a friend who's struggling with the job hunt!
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <a 
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=https://atsense.online&title=I just used ATSense to bypass hiring filters`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="w-full py-4 bg-[#0a66c2] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#084e96] transition-colors shadow-lg shadow-[#0a66c2]/30"
                                >
                                    <Share2 size={18} />
                                    Share on LinkedIn
                                </a>
                                <button 
                                    onClick={() => setShowSuccessModal(false)}
                                    className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                                >
                                    Back to Workspace
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <ShareableScoreCard
            isOpen={showShareModal}
            score={atsScore || 78}
            userName={resume?.personalInfo?.fullName || 'Candidate'}
            targetRole={jobTitle || resume?.title || 'Professional'}
            onClose={() => setShowShareModal(false)}
        />
        </>
    );
}
