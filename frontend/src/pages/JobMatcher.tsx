import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
    Sparkles, FileText, ChevronRight, Briefcase, Activity, 
    CheckCircle2, XCircle, Loader2, Search, ArrowRight, Zap, Target, Layers 
} from 'lucide-react';
import SEO from '../components/SEO';
import type { Resume, JobMatchResult } from '../types';

function JobMatcher() {
    const [resume, setResume] = useState<Resume | null>(null);
    const [hasResume, setHasResume] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [jobDescription, setJobDescription] = useState('');
    const [result, setResult] = useState<JobMatchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const savedData = localStorage.getItem('atsense_current_resume');
        if (savedData && savedData !== 'null' && savedData !== 'undefined') {
            try {
                const parsed = JSON.parse(savedData);
                const hasValidContent = parsed && typeof parsed === 'object' && parsed.personalInfo?.fullName?.trim().length > 0;
                
                if (hasValidContent) {
                    setResume(parsed);
                    setHasResume(true);
                }
            } catch (e) {
                console.error("Failed to parse saved resume", e);
            }
        }
        setInitialLoading(false);
    }, []);

    const handleAnalyze = async () => {
        if (!resume || !jobDescription) {
            showToast('Please load a resume in the Builder and enter a Job Description.', 'warning');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/ai/match', {
                resume: resume,
                jobDescription
            });
            setResult(res.data);
            showToast('Match audit completed!', 'success');
        } catch (err: any) {
            console.error(err);
            showToast(err.response?.data?.message || 'Analysis failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleExtract = async () => {
        if (!jobDescription) return;
        setExtracting(true);
        try {
            const res = await api.post('/ai/jobs/extract', { url_or_text: jobDescription });
            const data = res.data;
            const cleanedDesc = `Job Title: ${data.jobTitle}\nCompany: ${data.companyName}\n\n${data.jobDescription}`;
            setJobDescription(cleanedDesc);
            showToast('Extracted and cleaned job specifications!', 'success');
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.suggestion || err.response?.data?.message || 'Extraction failed. Please paste the job description text manually.';
            showToast(msg, 'error');
        } finally {
            setExtracting(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
                <Activity className="animate-spin text-cyan-400 mb-4" size={32} />
                <h2 className="text-lg font-bold text-slate-300">Synchronizing AI Telemetry...</h2>
            </div>
        );
    }

    if (!hasResume) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 tech-grid-dark opacity-30"></div>
                <div className="max-w-md text-center relative z-10 p-8 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800 shadow-2xl">
                    <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-400">
                        <FileText size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">Resume Required First</h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        The Smart Matcher compares a specific job description against your active resume. Build or upload your resume in the Cockpit to continue.
                    </p>
                    <Link
                        to="/builder"
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <span>Open Resume Cockpit</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans relative overflow-hidden">
            <SEO 
                title="Smart ATS Job Matcher — Cross-Reference Resume to JD" 
                description="Compare your resume against any job description. Instant keyword gap analysis, semantic match score, and tailored recommendations." 
            />

            {/* Ambient Background Aura */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 left-1/3 w-[800px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]"></div>
                <div className="absolute top-[35%] -right-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-10 -left-40 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute inset-0 tech-grid-dark opacity-30"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 font-semibold text-xs uppercase tracking-wider mb-4 backdrop-blur-md">
                        <Target size={13} className="text-cyan-400" />
                        <span>Semantic ATS Match Engine</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
                        Targeted Job Fit &{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300">
                            Keyword Gap Audit
                        </span>
                    </h1>

                    <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Cross-reference your active resume directly against recruiter job specs. Identify missing hard skills before submitting.
                    </p>
                </div>

                {/* Main Split Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Left Panel: Input & Active Resume Info */}
                    <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col">
                        
                        {/* Active Source Chip */}
                        <div className="mb-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-cyan-400">
                                    <Briefcase size={18} />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Active Workspace Resume</span>
                                    <span className="block text-sm font-bold text-white">
                                        {resume?.personalInfo?.fullName ? `${resume.personalInfo.fullName}'s Document` : 'Active Resume Loaded'}
                                    </span>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-extrabold uppercase tracking-wider">
                                Connected
                            </span>
                        </div>

                        {/* Textarea Header */}
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                                Job Description or Link
                            </label>
                            <button
                                onClick={handleExtract}
                                disabled={extracting || !jobDescription || loading}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/30 text-indigo-300 text-xs font-bold transition-all disabled:opacity-40"
                            >
                                {extracting ? <Loader2 size={13} className="animate-spin text-cyan-400" /> : <Sparkles size={13} className="text-cyan-400" />}
                                <span>{extracting ? 'Extracting Clean Text...' : 'Clean / Extract from URL'}</span>
                            </button>
                        </div>

                        <textarea
                            className="w-full p-4 bg-slate-900/90 border border-slate-800 rounded-2xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-200 text-sm leading-relaxed placeholder:text-slate-600 resize-none min-h-[380px] font-mono"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste full job description text or posting URL (e.g. LinkedIn, Greenhouse, Lever, Workday)..."
                        />

                        {/* Action CTA */}
                        <div className="mt-6">
                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !jobDescription}
                                className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl ${
                                    loading || !jobDescription
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white hover:shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99]'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin text-cyan-400" />
                                        <span>Computing Heuristic Match...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap size={18} />
                                        <span>Analyze Match & Extract Gaps</span>
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Panel: Telemetry & Gaps */}
                    <div className="space-y-6">
                        {!result ? (
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-slate-950/60 border-2 border-dashed border-slate-800/80 rounded-3xl">
                                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-4">
                                    <Search size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-300 mb-1">Awaiting Job Specifications</h3>
                                <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
                                    Paste a job description on the left and run analysis to unlock compatibility scores, keyword flags, and tailored fixes.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in">
                                
                                {/* Score Banner */}
                                <div className="p-8 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800 shadow-2xl relative overflow-hidden">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div>
                                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                                                Semantic ATS Score
                                            </span>
                                            <div className="flex items-baseline gap-3">
                                                <span className={`text-6xl font-black tracking-tight ${
                                                    result.score >= 75 ? 'text-emerald-400' : result.score >= 55 ? 'text-amber-400' : 'text-rose-400'
                                                }`}>
                                                    {result.score}%
                                                </span>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    {result.score >= 75 ? 'High Interview Fit' : result.score >= 55 ? 'Moderate Match' : 'High Rejection Risk'}
                                                </span>
                                            </div>
                                        </div>

                                        <Link
                                            to="/builder"
                                            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0"
                                        >
                                            <span>Tailor in Builder</span>
                                            <ChevronRight size={14} />
                                        </Link>
                                    </div>

                                    {/* AI Summary */}
                                    <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs leading-relaxed font-medium">
                                        {result.summary}
                                    </div>
                                </div>

                                {/* Missing Keywords (Red Flag) */}
                                <div className="p-6 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-rose-500/20 shadow-xl">
                                    <div className="flex items-center gap-2 mb-4">
                                        <XCircle size={18} className="text-rose-400" />
                                        <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">
                                            Missing ATS Keywords
                                        </h3>
                                        <span className="ml-auto text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                                            {result.missingKeywords?.length || 0} gaps
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {result.missingKeywords?.map((k: string) => (
                                            <span 
                                                key={k} 
                                                className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold"
                                            >
                                                + {k}
                                            </span>
                                        ))}
                                        {(!result.missingKeywords || result.missingKeywords.length === 0) && (
                                            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold w-full text-center">
                                                Zero critical keyword gaps detected!
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Matching Keywords (Strengths) */}
                                <div className="p-6 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-emerald-500/20 shadow-xl">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircle2 size={18} className="text-emerald-400" />
                                        <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">
                                            Matched Core Keywords
                                        </h3>
                                        <span className="ml-auto text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                            {result.matchingKeywords?.length || 0} matched
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {result.matchingKeywords?.map((k: string) => (
                                            <span 
                                                key={k} 
                                                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold"
                                            >
                                                ✓ {k}
                                            </span>
                                        ))}
                                        {(!result.matchingKeywords || result.matchingKeywords.length === 0) && (
                                            <span className="text-slate-500 text-xs">No significant overlapping terms detected.</span>
                                        )}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}

export default JobMatcher;
