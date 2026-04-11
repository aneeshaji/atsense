import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Sparkles, FileText, ChevronRight, Briefcase, Activity, CheckCircle2 as CheckCircle, XCircle as AlertCircle, Loader2, Search, XCircle } from 'lucide-react';
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

    if (initialLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 p-6">
                <Activity className="animate-spin text-emerald-600 mb-4" size={32} />
                <h2 className="text-xl font-bold text-gray-900">Configuring Matcher...</h2>
            </div>
        );
    }

    if (!hasResume) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center bg-gray-50/50 px-4">
                <div className="max-w-md">
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-emerald-200">
                        <Search size={36} className="text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">Resume Required First</h2>
                    <p className="text-gray-500 text-base leading-relaxed mb-8">
                        To use the Smart Matcher, you need a completed resume in your workspace. 
                        Please fill in your details in the Builder first.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/builder"
                            className="btn-premium"
                        >
                            <Search size={18} />
                            Go to Builder
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleAnalyze = async () => {
        if (!resume || !jobDescription) {
            showToast('Please load a resume in the Builder and enter a Job Description here.', 'warning');
            return;
        }

        setLoading(true);
        try {
            // Note: Update stateless backend or rely on existing /ai/match if it expects raw data. 
            // In a fully stateless world, we send 'resume' instead of 'resumeId'.
            const res = await api.post('/ai/match', {
                resume: resume, // Sent as raw object for stateless processing
                jobDescription
            });
            setResult(res.data);
            showToast('Analysis complete!', 'success');
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
            showToast('Successfully extracted and cleaned job details!', 'success');
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.suggestion || err.response?.data?.message || 'Extraction failed. Please paste the job description text manually.';
            showToast(msg, 'error');
        } finally {
            setExtracting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <SEO title="Smart Job Matcher - ATSense" description="Compare your resume against any job description automatically." />
            
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-[1.5rem] bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 mb-6">
                        <Search size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Smart Job Matcher</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Paste any Job Description below. We'll instantly compare it against the active resume currently loaded in your Workspace.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Input */}
                    <div className="space-y-6">
                        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex flex-col h-full">
                            
                            {/* Resume Source Indicator */}
                            <div className="mb-8 p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Active Source</span>
                                        <span className="block text-sm font-semibold text-gray-900">
                                            {resume?.personalInfo?.fullName ? `${resume.personalInfo.fullName}'s Workspace Resume` : 'No Resume Loaded'}
                                        </span>
                                    </div>
                                </div>
                                {!resume && (
                                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">Missing</span>
                                )}
                            </div>

                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Paste JD or URL</label>
                                <button 
                                    onClick={handleExtract}
                                    disabled={extracting || !jobDescription || loading}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-all border border-indigo-200 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {extracting ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                                    {extracting ? 'Extracting...' : 'Magic Clean / Extract URL'}
                                </button>
                            </div>
                            <textarea
                                className="w-full flex-grow p-5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none min-h-[350px] font-medium text-gray-700 placeholder:text-gray-400"
                                value={jobDescription}
                                onChange={e => setJobDescription(e.target.value)}
                                placeholder="Paste a Job Link (e.g. Lever, Greenhouse) OR paste the messy text from LinkedIn and we'll clean it automatically..."
                            />

                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !jobDescription}
                                className={`w-fit mx-auto flex items-center justify-center gap-2 px-10 py-3.5 rounded-2xl font-black transition-all duration-200 mt-6 ${loading || !jobDescription ? 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-100' : 'btn-premium'}`}
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                <span>{loading ? 'Analyzing Match...' : 'Analyze Match'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Results */}
                    <div className="h-full">
                        {!result ? (
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-white/50 border-2 border-dashed border-gray-200 rounded-[2.5rem]">
                                <div className="p-6 bg-white rounded-full shadow-sm text-gray-300 mb-6">
                                    <Search size={48} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-500 mb-2">Awaiting Analysis</h3>
                                <p className="text-gray-400">Paste your job description and run the analyzer to see your compatibility score.</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                {/* Score Card */}
                                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 rounded-full ${
                                        result.score >= 75 ? 'bg-emerald-500' : result.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                    }`}></div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Overall Match</h3>
                                    <div className="flex items-end gap-3">
                                        <div className={`text-6xl font-black leading-none tracking-tighter ${
                                            result.score >= 75 ? 'text-emerald-600' : result.score >= 50 ? 'text-amber-500' : 'text-red-600'
                                        }`}>
                                            {result.score}%
                                        </div>
                                    </div>
                                    {/* Summary from AI */}
                                    <div className="mt-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-gray-700 text-sm font-medium leading-relaxed">
                                            {result.summary}
                                        </p>
                                    </div>
                                </div>

                                {/* Missing Keywords */}
                                <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-red-50 relative overflow-hidden group">
                                    <div className="flex items-center gap-2 mb-5">
                                        <XCircle className="text-red-500" size={20} />
                                        <h3 className="font-bold text-gray-900 text-lg">Missing Keywords</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingKeywords?.map((k: string) => (
                                            <span key={k} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-xl text-sm font-bold border border-red-100">
                                                {k}
                                            </span>
                                        ))}
                                        {(!result.missingKeywords || result.missingKeywords.length === 0) && (
                                            <span className="text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-sm font-bold w-full text-center">
                                                Perfect match! No core keywords missing.
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Matching Keywords */}
                                <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-emerald-50">
                                    <div className="flex items-center gap-2 mb-5">
                                        <CheckCircle className="text-emerald-500" size={20} />
                                        <h3 className="font-bold text-gray-900 text-lg">Matching Keywords</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {result.matchingKeywords?.map((k: string) => (
                                            <span key={k} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-100">
                                                {k}
                                            </span>
                                        ))}
                                        {(!result.matchingKeywords || result.matchingKeywords.length === 0) && (
                                            <span className="text-gray-500 text-sm">No significant matching keywords found.</span>
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
