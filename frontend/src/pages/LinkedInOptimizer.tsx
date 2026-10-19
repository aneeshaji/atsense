import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
    Loader2, Linkedin, Copy, CheckCircle2, Sparkles, User, 
    Briefcase, FileText, ArrowRight, Zap, Target, Layers 
} from 'lucide-react';
import SEO from '../components/SEO';
import type { Resume } from '../types';

interface LinkedInData {
    headlines: string[];
    about: string;
    featuredSkills: string[];
    experienceImprovements: string[];
}

const LinkedInOptimizer = () => {
    const [resume, setResume] = useState<Resume | null>(null);
    const [hasResume, setHasResume] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<LinkedInData | null>(null);
    const [error, setError] = useState('');
    const [copiedSection, setCopiedSection] = useState('');
    const [extracting, setExtracting] = useState(false);

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

    const handleOptimize = async () => {
        if (!resume) {
            setError('Please load your resume in the Workspace Builder first.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await api.post('/ai/linkedin-optimize', {
                resume: resume,
                targetRole
            });
            setResult(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Optimization failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleExtract = async () => {
        if (!targetRole) {
            setError('Please paste a job link or raw text into the input field first.');
            return;
        }
        setExtracting(true);
        setError('');
        try {
            const res = await api.post('/ai/jobs/extract', { url_or_text: targetRole });
            const data = res.data;
            if (data.jobTitle) {
                setTargetRole(`${data.jobTitle}${data.companyName && data.companyName !== 'Unknown' ? ` at ${data.companyName}` : ''}`);
            }
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.suggestion || err.response?.data?.message || 'Extraction failed. Please type the role manually.';
            setError(msg);
        } finally {
            setExtracting(false);
        }
    };

    const copyToClipboard = (text: string, section: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(''), 2000);
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
                <Loader2 className="animate-spin text-cyan-400 mb-4" size={32} />
                <h2 className="text-lg font-bold text-slate-300">Calibrating Profile Intelligence...</h2>
            </div>
        );
    }

    if (!hasResume) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 tech-grid-dark opacity-30"></div>
                <div className="max-w-md text-center relative z-10 p-8 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800 shadow-2xl">
                    <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400">
                        <Linkedin size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">Resume Required First</h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        The LinkedIn Optimizer extracts experience, metrics, and skill clusters from your active workspace resume.
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
                title="LinkedIn Profile Optimizer & Headline Generator — ATSense" 
                description="Transform your resume into a recruiter-magnet LinkedIn profile. AI viral headlines, persuasive About section, and optimized skills." 
            />

            {/* Ambient Background Aura */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 left-1/3 w-[800px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]"></div>
                <div className="absolute top-[35%] -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-10 -left-40 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute inset-0 tech-grid-dark opacity-30"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 font-semibold text-xs uppercase tracking-wider mb-4 backdrop-blur-md">
                        <Linkedin size={13} className="text-blue-400" />
                        <span>Recruiter Magnet AI Engine</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
                        Transform Your Resume into a{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                            High-Converting Profile
                        </span>
                    </h1>

                    <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Convert your raw resume bullet points into algorithmic LinkedIn headlines, an executive summary, and high-visibility recruiter keywords.
                    </p>
                </div>

                {/* Input Card */}
                <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
                    
                    {/* Active Source Banner */}
                    <div className="mb-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                <Briefcase size={18} />
                            </div>
                            <div>
                                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Active Resume Source</span>
                                <span className="block text-sm font-bold text-white">
                                    {resume?.personalInfo?.fullName ? `${resume.personalInfo.fullName}'s Document` : 'Connected'}
                                </span>
                            </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-extrabold uppercase tracking-wider">
                            Ready
                        </span>
                    </div>

                    {/* Role Input */}
                    <div className="space-y-2 mb-6">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                                Target Role or Job URL (Optional)
                            </label>
                            <button
                                onClick={handleExtract}
                                disabled={extracting || !targetRole}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/30 text-blue-300 text-xs font-bold transition-all disabled:opacity-40"
                            >
                                {extracting ? <Loader2 size={13} className="animate-spin text-cyan-400" /> : <Sparkles size={13} className="text-cyan-400" />}
                                <span>{extracting ? 'Extracting...' : 'Clean Job URL'}</span>
                            </button>
                        </div>
                        <input
                            type="text"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            disabled={extracting}
                            placeholder="e.g. Senior Product Designer, Lead Software Architect, or paste a LinkedIn job URL"
                            className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                        />
                    </div>

                    <button
                        onClick={handleOptimize}
                        disabled={loading || !hasResume}
                        className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl ${
                            loading || !hasResume
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white hover:shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99]'
                        }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin text-cyan-400" />
                                <span>Engineering High-Converting Profile...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                <span>Generate Optimized Profile Assets</span>
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold flex items-center gap-2">
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Results View */}
                {result && (
                    <div className="space-y-8 animate-fade-in">
                        
                        {/* Headlines */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                    <User size={18} />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-white text-base">Viral Recruiter Headlines</h3>
                                    <p className="text-slate-400 text-xs">A/B test these formats to boost profile click-through rates.</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {result.headlines.map((headline, idx) => (
                                    <div 
                                        key={idx}
                                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                                    >
                                        <p className="text-sm text-slate-200 font-medium leading-relaxed flex-1">
                                            {headline}
                                        </p>
                                        <button
                                            onClick={() => copyToClipboard(headline, `hl-${idx}`)}
                                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                                        >
                                            {copiedSection === `hl-${idx}` ? (
                                                <>
                                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                                    <span className="text-emerald-400">Copied</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={14} />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* About Me Section */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800 shadow-2xl">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-white text-base">Persuasive About Summary</h3>
                                        <p className="text-slate-400 text-xs">Optimized for first-line preview before the "see more" cutoff.</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => copyToClipboard(result.about, 'about')}
                                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                    {copiedSection === 'about' ? (
                                        <>
                                            <CheckCircle2 size={14} className="text-emerald-400" />
                                            <span className="text-emerald-400">Copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            <span>Copy All</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                                {result.about}
                            </div>
                        </div>

                        {/* Skills and Experience Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Featured Skills */}
                            <div className="p-6 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800 shadow-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <Sparkles size={18} className="text-amber-400" />
                                    <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">
                                        Algorithmic Skill Keywords
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {result.featuredSkills.map((skill, idx) => (
                                        <span 
                                            key={idx}
                                            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:border-slate-700 transition-colors"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Quantified Bullet Points */}
                            <div className="p-6 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800 shadow-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <Zap size={18} className="text-emerald-400" />
                                    <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">
                                        Experience Enhancements
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {result.experienceImprovements.map((bullet, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
                                            <span>{bullet}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default LinkedInOptimizer;
