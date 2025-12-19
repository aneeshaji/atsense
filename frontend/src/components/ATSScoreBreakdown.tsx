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
}

const ATSScoreBreakdown = ({ breakdown }: Props) => {
    if (!breakdown) {
        return (
            <div className="card text-center py-8 text-gray-400">
                <p className="text-sm">No ATS analysis available yet.</p>
                <p className="text-xs mt-1">Use "Optimize Resume" to generate a score.</p>
            </div>
        );
    }

    const { overallScore, breakdown: categories, missingKeywords, matchedKeywords, issues, recommendations } = breakdown;

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
        keywords: '🔑',
        skills: '⚡',
        experience: '💼',
        education: '🎓',
        formatting: '📋',
        completeness: '✅'
    };

    const categoryLabels: { [key: string]: string } = {
        keywords: 'Keywords',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
        formatting: 'Formatting',
        completeness: 'Completeness'
    };

    return (
        <div className="space-y-6">
            {/* Overall Score Card */}
            <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Overall ATS Score</h3>
                        <p className="text-xs text-gray-500 mt-1">Based on 6 key factors</p>
                    </div>
                    <div className={`text-5xl font-black ${getScoreColor(overallScore)} px-6 py-3 rounded-xl`}>
                        {overallScore}%
                    </div>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="card">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    Score Breakdown
                </h3>
                <div className="space-y-3">
                    {Object.entries(categories).map(([key, data]) => (
                        <div key={key}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <span>{categoryIcons[key]}</span>
                                    {categoryLabels[key]}
                                </span>
                                <span className="text-sm font-bold text-gray-900">{data.score}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${getProgressColor(data.score)}`}
                                    style={{ width: `${data.score}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Keywords Analysis */}
            {(missingKeywords.length > 0 || matchedKeywords.length > 0) && (
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
                                    <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-100">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {missingKeywords.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-red-600 uppercase mb-2">⚠️ Missing Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {missingKeywords.map((keyword, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium border border-red-100">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Issues */}
            {issues.length > 0 && (
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

            {/* Recommendations */}
            {recommendations.length > 0 && (
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
    );
};

export default ATSScoreBreakdown;
