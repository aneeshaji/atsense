import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Loader2, Linkedin, Copy, CheckCircle, Sparkles, User, Briefcase, FileText } from 'lucide-react';
import SEO from '../components/SEO';

interface LinkedInData {
    headlines: string[];
    about: string;
    featuredSkills: string[];
    experienceImprovements: string[];
}

const LinkedInOptimizer = () => {
    const { user } = useAuth();
    const [resumes, setResumes] = useState<any[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<LinkedInData | null>(null);
    const [error, setError] = useState('');
    const [copiedSection, setCopiedSection] = useState('');

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const res = await api.get('/resumes');
            setResumes(res.data);
            if (res.data.length > 0) setSelectedResumeId(res.data[0].id);
        } catch (err) {
            console.error('Error fetching resumes:', err);
        }
    };

    const handleOptimize = async () => {
        if (!selectedResumeId) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await api.post('/ai/linkedin-optimize', {
                resumeId: selectedResumeId,
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
        <>
            <SEO
                title="LinkedIn Profile Optimizer - ATSense"
                description="Transform your resume into a viral LinkedIn profile using AI."
            />
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-6 shadow-lg shadow-blue-200">
                            <Linkedin size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">LinkedIn Profile Optimizer</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Transform your resume into a high-converting LinkedIn profile. Generate a viral headline, professional summary, and optimized skills.
                        </p>
                    </div>

                    {/* Input Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Source Resume</label>
                                <select
                                    value={selectedResumeId}
                                    onChange={(e) => setSelectedResumeId(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5"
                                >
                                    {resumes.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.personalInfo?.fullName}'s Resume ({new Date(r.updatedAt).toLocaleDateString()})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Target Role (Optional)</label>
                                <input
                                    type="text"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    placeholder="e.g. Senior Product Manager"
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleOptimize}
                            disabled={loading || !selectedResumeId}
                            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    Analyzing Profile...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="-ml-1 mr-2 h-5 w-5" />
                                    Optimize My Profile
                                </>
                            )}
                        </button>

                        {error && (
                            <div className="mt-4 p-4 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    {result && (
                        <div className="space-y-6">

                            {/* Headlines */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center gap-2">
                                    <User className="text-blue-600" size={20} />
                                    <h3 className="font-bold text-blue-900">Viral Headlines</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    {result.headlines.map((headline, index) => (
                                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors group">
                                            <div className="flex-1 font-medium text-gray-800">{headline}</div>
                                            <button
                                                onClick={() => copyToClipboard(headline, `headline-${index}`)}
                                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                {copiedSection === `headline-${index}` ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* About Section */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center gap-2">
                                    <FileText size={20} className="text-purple-600" />
                                    <h3 className="font-bold text-purple-900">Professional Summary (About)</h3>
                                </div>
                                <div className="p-6">
                                    <div className="relative bg-gray-50 rounded-xl p-6 border border-gray-100 font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {result.about}
                                        <button
                                            onClick={() => copyToClipboard(result.about, 'about')}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-purple-600 transition-colors bg-white p-2 rounded-lg shadow-sm border border-gray-100"
                                            title="Copy"
                                        >
                                            {copiedSection === 'about' ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Experience Improvements */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                                    <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-2">
                                        <Briefcase size={20} className="text-green-600" />
                                        <h3 className="font-bold text-green-900">Experience Bullets</h3>
                                    </div>
                                    <div className="p-6 flex-1 bg-white">
                                        <ul className="space-y-3">
                                            {result.experienceImprovements.map((bullet, i) => (
                                                <li key={i} className="flex gap-3 text-sm text-gray-700 bg-green-50/50 p-3 rounded-lg border border-green-100/50">
                                                    <div className="mt-1 min-w-[6px] h-1.5 rounded-full bg-green-500"></div>
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                                    <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center gap-2">
                                        <Sparkles size={20} className="text-orange-600" />
                                        <h3 className="font-bold text-orange-900">Featured Skills</h3>
                                    </div>
                                    <div className="p-6 flex-1 bg-white">
                                        <div className="flex flex-wrap gap-2">
                                            {result.featuredSkills.map((skill, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm">
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
        </>
    );
};

export default LinkedInOptimizer;
