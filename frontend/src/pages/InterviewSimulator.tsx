import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  ArrowLeft, 
  MessageSquare, 
  Info, 
  Lightbulb, 
  Printer, 
  ChevronRight,
  ChevronDown,
  Sparkles,
  Search,
  Briefcase,
  Play,
  Loader2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Question {
  question: string;
  category: string;
  rationale: string;
  tip: string;
}

interface Evaluation {
  score: number;
  goodPoints: string[];
  improvements: string[];
  sampleBetterAnswer: string;
}

interface InterviewData {
  questions: Question[];
  context: string;
}

const InterviewSimulator: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasResume, setHasResume] = useState(false);
    const [resumeData, setResumeData] = useState<any>(null);
    const [data, setData] = useState<InterviewData | null>(null);
    const [mode, setMode] = useState<'prep' | 'live'>('prep');
    const [showSetup, setShowSetup] = useState(false);
    
    // Setup State
    const [targetRole, setTargetRole] = useState('');
    const [setupJD, setSetupJD] = useState('');

    // Live Mode State
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [evaluating, setEvaluating] = useState(false);
    const [feedback, setFeedback] = useState<Evaluation | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
    const [extracting, setExtracting] = useState(false);

    useEffect(() => {
        const checkContext = () => {
            const savedData = localStorage.getItem('atsense_current_resume');
            if (savedData && savedData !== 'null' && savedData !== 'undefined') {
                try {
                    const parsed = JSON.parse(savedData);
                    const isValid = parsed && typeof parsed === 'object' && parsed.personalInfo?.fullName?.trim().length > 0;
                    
                    if (isValid) {
                        setResumeData(parsed);
                        setHasResume(true);
                        // If they already have a JD in the resume, we could auto-start, but let's just show setup
                        if (parsed.job_description) {
                            setSetupJD(parsed.job_description);
                        }
                    }
                } catch (e) {
                    console.error("Failed to parse saved resume", e);
                }
            }
            setInitialLoading(false);
            setShowSetup(true); // Always show setup first for interview
        };

        checkContext();
    }, []);

    if (initialLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 p-6">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
                <h2 className="text-xl font-bold text-gray-900">Syncing Simulator...</h2>
            </div>
        );
    }

    if (!hasResume) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center bg-gray-50/50 px-4">
                <div className="max-w-md">
                    <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-indigo-200">
                        <Sparkles size={36} className="text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">Resume Required First</h2>
                    <p className="text-gray-500 text-base leading-relaxed mb-8">
                        To generate tailored interview questions, you need a completed resume in your workspace. 
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

    const handleStartSimulation = async (resume: any = {}, jd: string) => {
        if (!jd.trim()) {
            showToast('Please provide a job description first.', 'info');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/ai/interview/questions', {
                resume: resume,
                jobDescription: jd
            });
            setData(res.data);
            setShowSetup(false);
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Failed to simulate interview', 'error');
            setShowSetup(true);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickStart = () => {
        handleStartSimulation(resumeData, setupJD);
    };

    const handleExtract = async () => {
        if (!setupJD) {
            showToast('Paste a job link or raw text into the job description box first.', 'info');
            return;
        }
        setExtracting(true);
        try {
            const res = await api.post('/ai/jobs/extract', { url_or_text: setupJD });
            const data = res.data;
            if (data.jobTitle) setTargetRole(data.jobTitle);
            const cleanedDesc = `Job Title: ${data.jobTitle}\nCompany: ${data.companyName}\n\n${data.jobDescription}`;
            setSetupJD(cleanedDesc);
            showToast('Successfully loaded job details!', 'success');
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.suggestion || err.response?.data?.message || 'Extraction failed. Please paste the job description text manually.';
            showToast(msg, 'error');
        } finally {
            setExtracting(false);
        }
    };

    const handleEvaluate = async () => {
        if (!userAnswer.trim() || !data) return;
        
        setEvaluating(true);
        try {
            const res = await api.post('/ai/interview/evaluate', {
                question: data.questions[currentIdx].question,
                answer: userAnswer,
                jobDescription: setupJD || (JSON.parse(localStorage.getItem('atsense_current_resume') || '{}').job_description)
            });
            setFeedback(res.data);
            setHistory([...history, { 
                question: data.questions[currentIdx].question, 
                answer: userAnswer, 
                evaluation: res.data 
            }]);
        } catch (err) {
            showToast('Failed to evaluate answer', 'error');
        } finally {
            setEvaluating(false);
        }
    };

    const nextQuestion = () => {
        if (!data) return;
        if (currentIdx < data.questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setUserAnswer('');
            setFeedback(null);
        } else {
            setIsComplete(true);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-6">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 animate-bounce ring-1 ring-gray-100">
                    <Sparkles className="text-indigo-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 animate-pulse">Syncing with Recruiter Heuristics...</h2>
                <p className="text-gray-500 text-sm mt-2 font-medium">Generating tailored questions based on the role requirements.</p>
            </div>
        );
    }

    if (showSetup) {
        return (
            <div className="max-w-full mx-auto px-6 py-20 flex flex-col items-center">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-6 shadow-sm border border-indigo-100/50">
                        <Sparkles size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Simulation <span className="text-indigo-600">Setup</span></h1>
                    <p className="text-lg text-gray-500 font-medium max-w-lg">
                        Practice for any role instantly. Fill in the job details below to start your AI-powered interview.
                    </p>
                </div>

                <div className="w-full max-w-2xl bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 md:p-12 space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="space-y-6">
                        <div className="group relative">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Target Role Name</label>
                            <div className="flex items-center gap-4 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                                <Briefcase className="text-gray-400" size={20} />
                                <input 
                                    type="text" 
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    placeholder="e.g. Senior Software Engineer" 
                                    className="bg-transparent border-none focus:outline-none text-lg font-bold text-gray-900 placeholder:text-gray-300 w-full outline-none ring-0"
                                />
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="flex items-center justify-between mb-2 px-1">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Job Description or URL</label>
                                <button 
                                    onClick={handleExtract}
                                    disabled={extracting || !setupJD}
                                    className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg transition-colors disabled:opacity-50 border border-indigo-100 shadow-sm"
                                >
                                    {extracting ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                    {extracting ? 'Extracting...' : 'Magic Extract'}
                                </button>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                                <Search className="text-gray-400 mt-1" size={20} />
                                <textarea 
                                    value={setupJD}
                                    onChange={(e) => setSetupJD(e.target.value)}
                                    disabled={extracting}
                                    rows={6}
                                    placeholder="Paste a link (e.g. lever.co/job) or the job description here..."
                                    className="bg-transparent border-none focus:outline-none text-base font-medium text-gray-700 placeholder:text-gray-300 w-full resize-none outline-none ring-0 disabled:text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={handleQuickStart}
                            disabled={!setupJD.trim()}
                            className={`w-full h-16 flex items-center justify-center gap-3 rounded-2xl font-bold text-lg transition-all mt-4 ${
                                !setupJD.trim() 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 hover:-translate-y-0.5'
                            }`}
                        >
                            <Play size={20} fill="currentColor" className={!setupJD.trim() ? 'text-gray-300' : 'text-indigo-400'} />
                            Start Simulation
                        </button>
                        
                        <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center">
                            <button 
                                onClick={() => navigate('/builder')}
                                className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft size={16} /> or Go back to Resume Builder
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-full mx-auto px-6 lg:px-12 py-12 pb-32 min-h-screen">
            
            {/* Nav */}
            <div className="flex items-center justify-between mb-8 print:hidden">
                <button 
                    onClick={() => navigate('/builder')}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Workspace
                </button>

                <div className="flex bg-gray-100/80 backdrop-blur-sm p-1 rounded-xl ring-1 ring-gray-200/50">
                    <button 
                        onClick={() => setMode('prep')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${mode === 'prep' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Prep Sheet
                    </button>
                    <button 
                        onClick={() => setMode('live')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${mode === 'live' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Live Simulation
                    </button>
                </div>
            </div>

            {mode === 'prep' ? (
                <div className="animate-in fade-in duration-500">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                Interview Prep <span className="text-indigo-500"><Sparkles size={28} /></span>
                            </h1>
                            <p className="text-gray-500 mt-2 text-lg">Your personalized practice sheet for the upcoming role.</p>
                        </div>
                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:border-indigo-300 hover:shadow-sm transition-all print:hidden"
                        >
                            <Printer size={18} /> Print Prep Sheet
                        </button>
                    </div>

                    {/* Context Card */}
                    {data?.context && (
                        <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-2xl mb-8 flex gap-4 items-start shadow-sm">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200/50">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Recruiter's Perspective</span>
                                <p className="text-emerald-900 font-medium leading-relaxed mt-1">"{data.context}"</p>
                            </div>
                        </div>
                    )}

                    {/* Questions List */}
                    <div className="space-y-4">
                        {data?.questions.map((q, idx) => (
                            <div 
                                key={idx} 
                                className={`bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${
                                    expandedIdx === idx ? 'ring-2 ring-indigo-500 border-indigo-100 shadow-xl' : 'border-gray-100 hover:border-gray-300 shadow-sm'
                                }`}
                            >
                                <button 
                                    onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left group"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm ${
                                            expandedIdx === idx ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                                        }`}>
                                            {idx + 1}
                                        </span>
                                        <h3 className={`font-bold text-lg leading-tight transition-colors ${expandedIdx === idx ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                            {q.question}
                                        </h3>
                                    </div>
                                    {expandedIdx === idx ? <ChevronDown className="text-indigo-600" /> : <ChevronRight className="text-gray-400 group-hover:text-gray-600" />}
                                </button>

                                {expandedIdx === idx && (
                                    <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-300">
                                        <div className="p-1 px-3 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-4">
                                            {q.category}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-2">
                                                    <Info size={16} className="text-indigo-500" /> Rationale
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed">{q.rationale}</p>
                                            </div>
                                            <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                                                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-2">
                                                    <Lightbulb size={16} className="text-emerald-500" /> Success Tip
                                                </div>
                                                <p className="text-gray-700 text-sm leading-relaxed font-medium">{q.tip}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {!isComplete ? (
                        <div className="space-y-8">
                            {/* Progress bar */}
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden shadow-inner">
                                <div 
                                    className="bg-indigo-600 h-full transition-all duration-500" 
                                    style={{ width: `${((currentIdx + 1) / (data?.questions.length || 1)) * 100}%` }}
                                ></div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-md border border-gray-200/60 shadow-xl rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -z-10 opacity-60"></div>

                                <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 block">Question {currentIdx + 1} of {data?.questions.length}</span>
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-8 relative z-10">
                                    {data?.questions[currentIdx].question}
                                </h2>

                                <textarea 
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="Type your answer here..."
                                    className="w-full h-48 bg-gray-50/50 border border-gray-200 rounded-[1.5rem] p-6 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 transition-all resize-none font-medium mb-6 relative z-10"
                                    disabled={evaluating || !!feedback}
                                />

                                {!feedback ? (
                                    <button 
                                        onClick={handleEvaluate}
                                        disabled={!userAnswer.trim() || evaluating}
                                        className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none transition-all flex items-center justify-center gap-3 relative z-10"
                                    >
                                        {evaluating ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Evaluating Response...
                                            </>
                                        ) : (
                                            <>
                                                Submit Answer
                                                <Sparkles size={18} className="text-white" />
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <div className="animate-in zoom-in-95 duration-300 relative z-10">
                                        <div className="bg-[#0b1f3b] text-white rounded-[2rem] p-8 mb-6 relative overflow-hidden shadow-2xl">
                                            {/* Score Badge */}
                                            <div className="absolute top-6 right-8 text-center bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                                                <div className="text-4xl font-black text-[#60efff] leading-none">{feedback.score}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-[#60efff]/70 mt-1">AI Score</div>
                                            </div>

                                            <h4 className="flex items-center gap-2 text-indigo-300 text-xs font-black uppercase tracking-widest mb-6">
                                                <Sparkles size={14} className="text-[#60efff]"/> AI Expert Feedback
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">What you did well</span>
                                                    <ul className="mt-4 space-y-3">
                                                        {feedback.goodPoints.map((p, i) => (
                                                            <li key={i} className="text-sm text-blue-100/80 flex items-start gap-3">
                                                                <div className="bg-green-500/20 text-green-400 p-0.5 rounded shrink-0">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                                </div>
                                                                <span className="leading-relaxed">{p}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest">Where to improve</span>
                                                    <ul className="mt-4 space-y-3">
                                                        {feedback.improvements.map((p, i) => (
                                                            <li key={i} className="text-sm text-blue-100/80 flex items-start gap-3">
                                                                <div className="bg-amber-500/20 text-amber-400 p-0.5 rounded shrink-0">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                                </div>
                                                                <span className="leading-relaxed">{p}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-8 border-t border-white/10">
                                                <span className="text-[#60efff] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-3">
                                                    <Lightbulb size={12} /> Golden Sample Answer
                                                </span>
                                                <p className="text-sm text-blue-100 italic leading-loose">"{feedback.sampleBetterAnswer}"</p>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={nextQuestion}
                                            className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all shadow-xl"
                                        >
                                            Next Question
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-500 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-emerald-50/50 pointer-events-none"></div>

                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-indigo-200 relative z-10">
                                <Sparkles size={48} />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight relative z-10">Interview Complete!</h2>
                            <p className="text-gray-500 text-lg mb-12 font-medium relative z-10">You've successfully conquered the simulation.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 relative z-10">
                                <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm">
                                    <div className="text-3xl font-black text-gray-900">{history.length}</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Questions</div>
                                </div>
                                <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm">
                                    <div className="text-3xl font-black text-indigo-600">
                                        {history.length > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.evaluation.score, 0) / history.length) : 0}
                                    </div>
                                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Avg Score</div>
                                </div>
                                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">
                                    <div className="text-3xl font-black text-emerald-600">READY</div>
                                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Status</div>
                                </div>
                            </div>

                            <button 
                                onClick={() => {
                                    setIsComplete(false);
                                    setCurrentIdx(0);
                                    setHistory([]);
                                    setFeedback(null);
                                    setUserAnswer('');
                                }}
                                className="px-10 py-5 bg-gray-900 text-white rounded-full font-black uppercase tracking-widest text-sm shadow-xl shadow-gray-200 hover:bg-black hover:-translate-y-1 transition-all relative z-10"
                            >
                                Re-simulate Interview
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Disclaimer */}
            <p className="mt-12 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                AI Coach: Powered by Real-time HR Intelligence Heuristics
            </p>
        </div>
    );
};

export default InterviewSimulator;
