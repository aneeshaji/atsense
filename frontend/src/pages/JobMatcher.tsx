import { useEffect, useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import type { Resume, JobMatchResult } from '../types';

function JobMatcher() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [result, setResult] = useState<JobMatchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        api.get('/resumes')
            .then(res => {
                setResumes(res.data);
                if (res.data.length > 0) setSelectedResumeId(res.data[0].id);
            })
            .catch(console.error);
    }, []);

    const handleAnalyze = async () => {
        if (!selectedResumeId || !jobDescription) {
            showToast('Please select a resume and enter a job description', 'warning');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/ai/match', {
                resumeId: selectedResumeId,
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

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Smart Job Matcher</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div className="card">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Resume</label>
                        <select
                            className="input-field mb-4"
                            value={selectedResumeId}
                            onChange={e => setSelectedResumeId(e.target.value)}
                        >
                            {resumes.map(r => (
                                <option key={r.id} value={r.id}>{r.title || 'Untitled'}</option>
                            ))}
                        </select>

                        <label className="block text-sm font-medium text-gray-700 mb-2">Paste Job Description</label>
                        <textarea
                            className="input-field min-h-[300px]"
                            value={jobDescription}
                            onChange={e => setJobDescription(e.target.value)}
                            placeholder="Paste the entire JD here..."
                        />

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="btn-primary w-full mt-4 py-3"
                        >
                            {loading ? 'Analyzing...' : 'Analyze Match'}
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div>
                    {!result ? (
                        <div className="card h-full flex flex-col items-center justify-center text-gray-400 border-dashed">
                            <div className="text-6xl mb-4">🔍</div>
                            <p>Results will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Score Card */}
                            <div className="card flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Match Score</h3>
                                    <p className="text-gray-500 text-sm">Based on keywords & skills</p>
                                </div>
                                <div className={`text-5xl font-black ${result.score >= 75 ? 'text-green-600' :
                                    result.score >= 50 ? 'text-yellow-500' : 'text-red-500'
                                    }`}>
                                    {result.score}%
                                </div>
                            </div>

                            {/* Keywords */}
                            <div className="card">
                                <h3 className="font-bold text-gray-900 mb-4">Keyword Analysis</h3>

                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-red-600 uppercase mb-2">⚠️ Missing Keywords</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingKeywords?.map((k: string) => (
                                            <span key={k} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100">
                                                {k}
                                            </span>
                                        ))}
                                        {(!result.missingKeywords || result.missingKeywords.length === 0) && <span className="text-gray-400 text-sm">None! Great job.</span>}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-green-600 uppercase mb-2">✅ Matching Keywords</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.matchingKeywords?.map((k: string) => (
                                            <span key={k} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                                                {k}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="card bg-indigo-50 border-indigo-100">
                                <h3 className="font-bold text-indigo-900 mb-2">AI Summary</h3>
                                <p className="text-indigo-800 text-sm leading-relaxed">
                                    {result.summary}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JobMatcher;
