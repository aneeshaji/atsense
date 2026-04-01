import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Loader2, Linkedin, Copy, CheckCircle, Sparkles, User, Briefcase, FileText } from 'lucide-react';
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
                <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                <h2 className="text-xl font-bold text-gray-900">Configuring Optimizer...</h2>
            </div>
        );
    }

    if (!hasResume) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center bg-gray-50/50 px-4">
                <div className="max-w-md">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-blue-200">
                        <Linkedin size={36} className="text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">Resume Required First</h2>
                    <p className="text-gray-500 text-base leading-relaxed mb-8">
                        To optimize your LinkedIn profile, you need a completed resume in your workspace. 
                        Please fill in your details in the Builder first.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/builder"
                            className="btn-premium"
                        >
                            <Sparkles size={18} />
                            Go to Builder
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
                resume: resume, // Send raw resume payload securely
                targetRole
            });
            setResult(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Optimization failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, section: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(''), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <SEO title="LinkedIn Profile Optimizer - ATSense" description="Transform your resume into a viral LinkedIn profile using AI." />
            
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-[1.5rem] bg-blue-600 text-white shadow-xl shadow-blue-500/30 mb-6">
                        <Linkedin size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">LinkedIn Optimizer</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Transform the resume from your Workspace into a high-converting LinkedIn profile. Generate a viral headline, professional summary, and optimized skills instantly.
                    </p>
                </div>

                {/* Input Section */}
                <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
                    
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
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Target Role (Optional)</label>
                        <input
                            type="text"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            placeholder="e.g. Senior Product Manager"
                            className="w-full text-lg p-4 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                        />
                    </div>

                    <button 
                        onClick={handleOptimize}
                        disabled={loading || !hasResume}
                        className={`w-fit mx-auto flex items-center justify-center gap-2 px-10 py-3.5 rounded-2xl font-black transition-all duration-200 mt-6 ${loading || !hasResume ? 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-100' : 'btn-premium'}`}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                        <span>{loading ? 'Optimizing Profile...' : 'Transform LinkedIn Profile'}</span>
                    </button>

                    {error && (
                        <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-700 text-sm font-bold flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            {error}
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {result && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pt-6">

                        {/* Headlines */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-blue-100 overflow-hidden">
                            <div className="bg-blue-50/50 px-8 py-5 border-b border-blue-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <User className="text-blue-600" size={24} />
                                    <h3 className="font-black text-blue-900 text-lg uppercase tracking-wider">Viral Headlines</h3>
                                </div>
                            </div>
                            <div className="p-8 space-y-4">
                                {result.headlines.map((headline, index) => (
                                    <div key={index} className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-blue-50/30 hover:border-blue-200 transition-colors group">
                                        <div className="flex-1 font-medium text-gray-800 leading-relaxed text-[15px]">{headline}</div>
                                        <button
                                            onClick={() => copyToClipboard(headline, `headline-${index}`)}
                                            className="text-gray-400 hover:text-blue-600 hover:bg-blue-100 p-2 rounded-xl transition-all"
                                        >
                                            {copiedSection === `headline-${index}` ? <CheckCircle size={22} className="text-green-500" /> : <Copy size={22} />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-purple-100 overflow-hidden">
                            <div className="bg-purple-50/50 px-8 py-5 border-b border-purple-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText size={24} className="text-purple-600" />
                                    <h3 className="font-black text-purple-900 text-lg uppercase tracking-wider">About Me</h3>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="relative bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 font-medium text-gray-700 leading-loose text-[15px] whitespace-pre-wrap">
                                    {result.about}
                                    <button
                                        onClick={() => copyToClipboard(result.about, 'about')}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-purple-600 hover:bg-purple-100 transition-all bg-white p-2.5 rounded-xl shadow-sm border border-gray-100"
                                    >
                                        {copiedSection === 'about' ? <CheckCircle size={22} className="text-green-500" /> : <Copy size={22} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Experience Improvements */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-[2.5rem] shadow-xl border border-emerald-100 overflow-hidden flex flex-col">
                                <div className="bg-emerald-50/50 px-8 py-5 border-b border-emerald-100 flex items-center gap-3">
                                    <Briefcase size={24} className="text-emerald-600" />
                                    <h3 className="font-black text-emerald-900 text-lg uppercase tracking-wider">Experience Formatting</h3>
                                </div>
                                <div className="p-8 flex-1 bg-white">
                                    <ul className="space-y-4">
                                        {result.experienceImprovements.map((bullet, i) => (
                                            <li key={i} className="flex items-start gap-4 text-[15px] text-gray-700 bg-emerald-50/30 p-4 rounded-2xl border border-emerald-50">
                                                <div className="mt-1.5 min-w-[8px] h-2 rounded-full bg-emerald-500"></div>
                                                <span className="leading-relaxed font-medium">{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] shadow-xl border border-amber-100 overflow-hidden flex flex-col">
                                <div className="bg-amber-50/50 px-8 py-5 border-b border-amber-100 flex items-center gap-3">
                                    <Sparkles size={24} className="text-amber-600" />
                                    <h3 className="font-black text-amber-900 text-lg uppercase tracking-wider">Featured Skills</h3>
                                </div>
                                <div className="p-8 flex-1 bg-white">
                                    <div className="flex flex-wrap gap-2.5">
                                        {result.featuredSkills.map((skill, i) => (
                                            <span key={i} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-bold text-gray-700 shadow-sm hover:border-amber-300 transition-colors">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
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
