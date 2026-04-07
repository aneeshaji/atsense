import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Layout, 
  FileCheck,
  Zap
} from 'lucide-react';

interface ScoreBreakdown {
  score: number;
  weight: number;
  max: number;
}

interface BreakdownData {
  overallScore: number;
  breakdown: {
    keywords: ScoreBreakdown;
    skills: ScoreBreakdown;
    experience: ScoreBreakdown;
    education: ScoreBreakdown;
    formatting: ScoreBreakdown;
    completeness: ScoreBreakdown;
  };
  missingKeywords: string[];
  matchedKeywords: string[];
  issues: string[];
  recommendations: string[];
}

interface Props {
  data: BreakdownData;
  onClose: () => void;
  onOptimize: () => void;
}

const AdvancedScorecard: React.FC<Props> = ({ data, onClose, onOptimize }) => {
  if (!data) return null;

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (percentage >= 50) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  const getProgressColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const categories = [
    { key: 'experience', label: 'Work Experience', icon: <Award size={18} /> },
    { key: 'skills', label: 'Technical Skills', icon: <Zap size={18} /> },
    { key: 'keywords', label: 'JD Keyphrase Match', icon: <FileCheck size={18} /> },
    { key: 'education', label: 'Academic Background', icon: <BookOpen size={18} /> },
    { key: 'completeness', label: 'Profile Depth', icon: <TrendingUp size={18} /> },
    { key: 'formatting', label: 'ATS Parsability', icon: <Layout size={18} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Advanced ATS Health Audit</h2>
            <p className="text-slate-500 text-sm mt-1">Deep analysis based on Google-standard hiring heuristics</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Overall & Breakdown */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Overall Score Hero */}
              <div className="bg-indigo-600 rounded-2xl p-8 text-white flex items-center gap-8 shadow-lg shadow-indigo-200">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-indigo-500/30" />
                    <circle 
                      cx="64" cy="64" r="58" stroke="white" strokeWidth="8" fill="transparent" 
                      strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * (data.overallScore / 100))}
                      strokeLinecap="round" className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black">{data.overallScore}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Resume Authority Score</h3>
                  <p className="text-indigo-100/80 text-sm leading-relaxed max-w-md">
                    Target a score of 85+ for top-tier companies. Your current score reflects high performance but identifies immediate optimizations.
                  </p>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const item = (data.breakdown as any)[cat.key] as ScoreBreakdown;
                  if (!item) return null;
                  return (
                    <div key={cat.key} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                          <span className="text-indigo-500">{cat.icon}</span>
                          {cat.label}
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getScoreColor(item.score, item.max)}`}>
                          {item.score}/{item.max}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-700 ${getProgressColor(item.score, item.max)}`}
                          style={{ width: `${(item.score / item.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendations & Issues */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className="font-bold flex items-center gap-2 text-rose-600">
                        <AlertCircle size={18} /> Critical Fixes Required
                    </h4>
                    <div className="space-y-2">
                        {data.issues.map((issue, idx) => (
                            <div key={idx} className="flex gap-2 text-sm text-slate-600 items-start">
                                <span className="text-rose-400 mt-1">•</span>
                                {issue}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <h4 className="font-bold flex items-center gap-2 text-indigo-600">
                        <CheckCircle2 size={18} /> Key Improvements
                    </h4>
                    <div className="space-y-2">
                        {data.recommendations.map((rec, idx) => (
                            <div key={idx} className="flex gap-2 text-sm text-slate-600 items-start">
                                <span className="text-emerald-400 mt-1">•</span>
                                {rec}
                            </div>
                        ))}
                    </div>
                </div>
              </div>

            </div>

            {/* Right Column: Keywords */}
            <div className="space-y-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              
              <div>
                <h4 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                   <CheckCircle2 size={18} className="text-emerald-500" /> Matched Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                   {data.matchedKeywords.length > 0 ? data.matchedKeywords.map((kw, idx) => (
                      <span key={idx} className="text-xs font-semibold px-3 py-1.5 bg-white text-emerald-700 border border-emerald-100 rounded-full shadow-sm">
                        {kw}
                      </span>
                   )) : <p className="text-xs text-slate-400 italic">No matches found yet.</p>}
                </div>
              </div>

              <div>
                <h4 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                   <AlertCircle size={18} className="text-rose-500" /> Missing High-Impact Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                   {data.missingKeywords.length > 0 ? data.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="text-xs font-semibold px-3 py-1.5 bg-white text-rose-600 border border-rose-100 rounded-full shadow-sm hover:border-rose-400 transition-colors">
                        + {kw}
                      </span>
                   )) : <p className="text-xs text-slate-400 italic">No missing keywords detected.</p>}
                </div>
                <p className="mt-4 text-[10px] text-slate-400 leading-relaxed italic">
                    AI Insight: Incorporating these missing keywords naturally into your 'Experience' bullets can boost your score by up to 15%.
                </p>
              </div>

              <button 
                onClick={onOptimize}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
              >
                Got it, let's optimize!
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdvancedScorecard;
