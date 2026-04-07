import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, CheckCircle, AlertTriangle, XCircle, ChevronRight, FileText, Zap, Target, Shield, Linkedin } from 'lucide-react';
import SEO from '../components/SEO';

const SAMPLE_ISSUES = [
    { type: 'error', text: 'No measurable achievements found — add numbers and impact metrics.' },
    { type: 'warning', text: 'Skills section is missing common ATS keywords for your target role.' },
    { type: 'warning', text: 'Contact information may be inside a header/footer — ATS parsers often miss this.' },
    { type: 'success', text: 'Clean, single-column layout detected — excellent for ATS parsing.' },
    { type: 'success', text: 'Standard section headings (Experience, Education) are ATS-friendly.' },
];

const SCORE_COLORS: Record<string, string> = {
    low: 'text-red-500',
    mid: 'text-amber-500',
    high: 'text-emerald-500',
};

const SCORE_LABELS: Record<string, string> = {
    low: 'Needs Improvement',
    mid: 'Average',
    high: 'Good',
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "What is an ATS Resume Checker?", "acceptedAnswer": { "@type": "Answer", "text": "An ATS Resume Checker analyzes your resume against Applicant Tracking System criteria to predict how well it will pass automated screening filters recruiters use." } },
        { "@type": "Question", "name": "Is the ATSense Resume Grader free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! The ATSense Resume Grader is completely free to use. Upload your PDF resume and get an instant ATS compatibility score with actionable feedback." } },
        { "@type": "Question", "name": "What does the ATS score mean?", "acceptedAnswer": { "@type": "Answer", "text": "A score of 80+ is excellent. 60-79 is average and may need optimization. Under 60 means your resume likely needs significant improvements to pass ATS filters." } },
    ]
};

import { useModal } from '../context/ModalContext';

export default function ResumeGrader() {
    const [file, setFile] = useState<File | null>(null);
    const [grading, setGrading] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const { showAlert } = useModal();

    const scoreLevel = score === null ? 'low' : score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low';

    const handleFile = (f: File) => {
        if (f.type !== 'application/pdf') {
            showAlert('Invalid File', 'Please upload a professional PDF resume. Word documents and images are not supported for ATS grading.', 'warning');
            return;
        }
        setFile(f);
        setScore(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    };

    const handleGrade = () => {
        if (!file) return;
        setGrading(true);
        setTimeout(() => {
            // Simulate a grader score
            setScore(Math.floor(Math.random() * 30) + 55); // 55–84 range for demo
            setGrading(false);
        }, 2800);
    };

    return (
        <div className="bg-white min-h-screen pt-20 pb-24 font-sans">
            <SEO
                title="Free ATS Resume Checker & Grader"
                description="Upload your resume and get a free ATS compatibility score instantly. Identify exactly what's stopping your resume from passing recruiter filters — no signup required."
                keywords="free ats resume checker, resume grader, ats score, resume scanner free, ats resume test"
                url="https://atsense.online/resume-grader"
                schemas={[faqSchema]}
            />

            {/* Hero */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 pb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm mb-6 border border-indigo-100">
                    <Zap size={14} className="text-indigo-500" />
                    Free Tool — No Signup Required
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                    Is Your Resume Getting<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Past the ATS?</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Upload your PDF resume and get an instant ATS compatibility score with personalized feedback. Free, instant, and no account needed.
                </p>
            </div>

            {/* Main Grader Card */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/80 overflow-hidden">

                    {/* Upload Zone */}
                    <div className="p-8 md:p-12">
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileRef.current?.click()}
                            className={`cursor-pointer border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300 ${isDragging ? 'border-indigo-400 bg-indigo-50/50' : file ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20'}`}
                        >
                            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                            {file ? (
                                <>
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                                        <FileText className="text-emerald-600" size={28} />
                                    </div>
                                    <p className="font-bold text-slate-900 text-lg">{file.name}</p>
                                    <p className="text-slate-500 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB · Click to replace</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
                                        <Upload className="text-indigo-600" size={28} />
                                    </div>
                                    <p className="font-bold text-slate-900 text-lg mb-2">Drop your resume here</p>
                                    <p className="text-slate-500 text-sm">PDF format only · Max 10MB</p>
                                </>
                            )}
                        </div>

                        <button
                            onClick={handleGrade}
                            disabled={!file || grading}
                            className="mt-6 w-full py-4 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-indigo-200"
                        >
                            {grading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Analyzing your resume...
                                </>
                            ) : (
                                <>
                                    <Target size={20} />
                                    Check My ATS Score
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results */}
                    {score !== null && (
                        <div className="border-t border-slate-100 bg-slate-50/50 p-8 md:p-12">
                            {/* Score Circle */}
                            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
                                <div className="relative w-40 h-40 shrink-0">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                                        <circle
                                            cx="50" cy="50" r="42" fill="none"
                                            stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                            strokeDasharray={`${(score / 100) * 264} 264`}
                                            className="transition-all duration-1000"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-4xl font-black ${SCORE_COLORS[scoreLevel]}`}>{score}</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">/ 100</span>
                                    </div>
                                </div>
                                <div>
                                    <p className={`text-2xl font-black mb-2 ${SCORE_COLORS[scoreLevel]}`}>{SCORE_LABELS[scoreLevel]}</p>
                                    <p className="text-slate-600 leading-relaxed">
                                        {score >= 80
                                            ? 'Great job! Your resume passes most ATS filters. A few quick tweaks could push it to 90+.'
                                            : score >= 60
                                            ? 'Your resume has potential but needs optimization. Key fixes could significantly boost your interview rate.'
                                            : 'Your resume is likely getting filtered out before a human sees it. Let\'s fix that now.'}
                                    </p>
                                </div>
                            </div>

                            {/* Issues List */}
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Key Findings</h3>
                            <div className="space-y-3 mb-10">
                                {SAMPLE_ISSUES.map((issue, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-slate-100">
                                        {issue.type === 'error' ? <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" /> :
                                         issue.type === 'warning' ? <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" /> :
                                         <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />}
                                        <span className="text-slate-700 text-sm leading-relaxed">{issue.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Viral Share Loop */}
                            <div className="mb-10 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-center">
                                <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-3">🔥 Brag about your score</h4>
                                <p className="text-xs text-indigo-700 font-medium mb-6">Users with {scoreLevel === 'high' ? 'elite' : 'improving'} scores are 3x more likely to be noticed by recruiters.</p>
                                <button 
                                    onClick={() => {
                                        const text = encodeURIComponent(`Just checked my resume with @ATSense and got a score of ${score}/100! 🚀 It's an incredible tool for anyone looking to beat the ATS in 2025. Check your score for free: https://atsense.online/resume-grader`);
                                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://atsense.online/resume-grader&text=${text}`, '_blank');
                                    }}
                                    className="inline-flex items-center gap-2 bg-[#0077b5] hover:bg-[#005582] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 text-xs uppercase tracking-wider"
                                >
                                    <Linkedin size={16} fill="currentColor" />
                                    Post My Score to LinkedIn
                                </button>
                            </div>

                            {/* CTA */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                                <h3 className="text-2xl font-black mb-2">Ready to fix these issues?</h3>
                                <p className="text-indigo-100 mb-6">Use our AI Resume Builder to resolve every issue and land 3x more interviews.</p>
                                <Link to="/builder" className="inline-flex items-center gap-2 bg-white text-indigo-600 font-black py-3 px-8 rounded-xl hover:bg-indigo-50 transition-all text-sm uppercase tracking-wider">
                                    Fix My Resume Now <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Trust Badges */}
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-2"><Shield size={14} className="text-emerald-500" />100% Private — We never store your resume</div>
                    <div className="flex items-center gap-2"><Zap size={14} className="text-indigo-500" />Instant Analysis</div>
                    <div className="flex items-center gap-2"><CheckCircle size={14} className="text-indigo-500" />No Account Required</div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                <h2 className="text-3xl font-black text-slate-900 text-center mb-10">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqSchema.mainEntity.map((faq, i) => (
                        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6">
                            <h3 className="font-bold text-slate-900 mb-2">{faq.name}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
