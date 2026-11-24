import { useState } from 'react';
import { Share2, Lock, Zap, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

interface ATSBreakdown {
    overallScore: number;
    breakdown: {
        [key: string]: {
            score: number;
            weight: number;
            max: number;
        };
    };
    missingKeywords: string[];
    matchedKeywords: string[];
    issues: string[];
    recommendations: string[];
}

interface Props {
    breakdown: ATSBreakdown | null;
    onShare?: () => void;
}

const UNLOCK_KEY = 'atsense_breakdown_unlocked';

const ATSScoreBreakdown = ({ breakdown, onShare }: Props) => {
    const [unlocked, setUnlocked] = useState(() => !!localStorage.getItem(UNLOCK_KEY));
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!breakdown || !breakdown.overallScore) return null;

    const {
        overallScore = 0,
        breakdown: categories = {},
        missingKeywords = [],
        matchedKeywords = [],
        issues = [],
        recommendations = []
    } = breakdown;

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50';
        if (score >= 60) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getProgressColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const categoryIcons: { [key: string]: string } = {
        keywords: '🔑', skills: '⚡', experience: '💼',
        education: '🎓', formatting: '📋', completeness: '✅'
    };
    const categoryLabels: { [key: string]: string } = {
        keywords: 'Keywords', skills: 'Skills', experience: 'Experience',
        education: 'Education', formatting: 'Formatting', completeness: 'Completeness'
    };

    const categoryEntries = Object.entries(categories);
    // Always show first 3 categories free; rest gated
    const FREE_ROWS = 3;
    const freeRows = categoryEntries.slice(0, FREE_ROWS);
    const gatedRows = categoryEntries.slice(FREE_ROWS);
    const hasGated = gatedRows.length > 0 || missingKeywords.length > 0 || issues.length > 0 || recommendations.length > 0;

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSubmitting(true);
        try {
            await api.post('/leads/capture', { email: email.trim(), source: 'breakdown_gate' });
        } catch {
            // silent
        } finally {
            setSubmitting(false);
            localStorage.setItem(UNLOCK_KEY, '1');
            setUnlocked(true);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Overall Score Card */}
            <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 shrink-0 p-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Overall ATS Score</h3>
                        <p className="text-xs text-gray-500 mt-1">Based on 6 key factors</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {onShare && (
                            <button
                                type="button"
                                onClick={onShare}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 hover:-translate-y-0.5 transition-all"
                            >
                                <Share2 size={13} />
                                <span>Share Scorecard</span>
                            </button>
                        )}
                        <div className={`text-4xl font-black ${getScoreColor(overallScore)} px-4 py-2 rounded-xl`}>
                            {overallScore}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable details container */}
            <div className="max-h-[320px] overflow-y-auto pr-2 pb-2 space-y-4 scrollbar-thin border-b border-t border-transparent hover:border-gray-100">

                {/* Category Breakdown — always visible */}
                <div className="card">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-lg">📊</span>
                        Score Breakdown
                    </h3>
                    <div className="space-y-3">
                        {freeRows.map(([key, data]) => (
                            <div key={key}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <span>{categoryIcons[key]}</span>
                                        {categoryLabels[key]}
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">{data.score}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className={`h-2 rounded-full transition-all ${getProgressColor(data.score)}`} style={{ width: `${data.score}%` }} />
                                </div>
                            </div>
                        ))}

                        {/* Gated remaining rows */}
                        {!unlocked && gatedRows.length > 0 && (
                            <div className="relative">
                                {gatedRows.map(([key, data]) => (
                                    <div key={key} className="blur-sm select-none pointer-events-none mb-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <span>{categoryIcons[key]}</span>
                                                {categoryLabels[key] || key}
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">{data.score}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className={`h-2 rounded-full ${getProgressColor(data.score)}`} style={{ width: `${data.score}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {unlocked && gatedRows.map(([key, data]) => (
                            <div key={key}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <span>{categoryIcons[key]}</span>
                                        {categoryLabels[key] || key}
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">{data.score}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className={`h-2 rounded-full transition-all ${getProgressColor(data.score)}`} style={{ width: `${data.score}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── EMAIL GATE ── */}
                {!unlocked && hasGated && (
                    <div className="card border-2 border-dashed border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                                <Lock size={14} className="text-violet-600" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900">Full Report Locked</p>
                                <p className="text-xs text-slate-500">Keyword gaps, issues & fix recommendations</p>
                            </div>
                        </div>

                        {/* Blurred preview of what's hidden */}
                        <div className="blur-sm select-none pointer-events-none mb-4 space-y-2">
                            <div className="h-3 bg-slate-200 rounded-full w-3/4" />
                            <div className="h-3 bg-red-200 rounded-full w-1/2" />
                            <div className="h-3 bg-green-200 rounded-full w-2/3" />
                            <div className="h-3 bg-slate-200 rounded-full w-5/6" />
                        </div>

                        <form onSubmit={handleUnlock} className="space-y-2">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="your@email.com — unlock full report"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-violet-200 bg-white text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
                            />
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-xs shadow-[0_3px_12px_rgba(139,92,246,0.4)] hover:shadow-[0_5px_18px_rgba(139,92,246,0.55)] hover:-translate-y-0.5 transition-all disabled:opacity-70"
                            >
                                {submitting
                                    ? <><Loader2 size={13} className="animate-spin" /> Unlocking…</>
                                    : <><Zap size={13} /> Unlock Full Analysis <ArrowRight size={12} /></>
                                }
                            </button>
                        </form>
                        <p className="text-center text-[10px] text-slate-400 mt-2">Free. We'll also email you your full report.</p>
                    </div>
                )}

                {/* Keyword Analysis — only when unlocked */}
                {unlocked && (missingKeywords.length > 0 || matchedKeywords.length > 0) && (
                    <div className="card">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="text-lg">🎯</span>
                            Keyword Analysis
                        </h3>
                        {matchedKeywords.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-xs font-bold text-green-600 uppercase mb-2">✅ Matched Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                    {matchedKeywords.map((keyword, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-100">{keyword}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {missingKeywords.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold text-red-600 uppercase mb-2">⚠️ Missing Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                    {missingKeywords.map((keyword, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium border border-red-100">{keyword}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Issues — only when unlocked */}
                {unlocked && issues.length > 0 && (
                    <div className="card bg-red-50 border-red-100">
                        <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                            <span className="text-lg">🚨</span>
                            Issues Found
                        </h3>
                        <ul className="space-y-2">
                            {issues.map((issue, idx) => (
                                <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">•</span>
                                    {issue}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Recommendations — only when unlocked */}
                {unlocked && recommendations.length > 0 && (
                    <div className="card bg-blue-50 border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <span className="text-lg">💡</span>
                            Recommendations
                        </h3>
                        <ul className="space-y-2">
                            {recommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">→</span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ATSScoreBreakdown;
