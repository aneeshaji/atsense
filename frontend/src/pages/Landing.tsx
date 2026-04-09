import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Zap, Star, Brain, Search, FileText, Upload, Briefcase, Activity, Target, ChevronRight } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import SEO from '../components/SEO';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

// Scroll reveal component
const FadeInSection = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisible(true);
                    if (domRef.current) observer.unobserve(domRef.current);
                }
            },
            { threshold: 0.15 }
        );

        if (domRef.current) observer.observe(domRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-[1200ms] ease-out transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// Animated Progress Bar component
const AnimatedBar = () => {
    const [isVisible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setVisible(true);
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="h-4 bg-gray-100 rounded-full overflow-hidden relative">
            <div 
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-green-400 to-green-500 transition-all duration-[2000ms] ease-out rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                style={{ width: isVisible ? '98%' : '0%' }}
            >
                {/* Internal Shimmer */}
                <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 translate-x-[-200%] animate-[shimmer_2s_infinite]"></div>
            </div>
        </div>
    );
};

// Animated counter component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                    const startTime = Date.now();
                    const timer = setInterval(() => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        setCount(Math.floor(progress * end));
                        if (progress >= 1) clearInterval(timer);
                    }, 16);
                    return () => clearInterval(timer);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration, hasStarted]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};


const Landing = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);
        setImporting(true);
        try {
            const res = await api.post('/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            localStorage.setItem('atsense_current_resume', JSON.stringify(res.data));
            showToast('Resume imported successfully!', 'success');
            navigate('/builder');
        } catch (err: any) {
            console.error(err);
            showToast(err.response?.data?.message || 'Failed to import resume', 'error');
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Is this resume builder really free to start?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, ATSense is a guest-first platform. You can access our professional resume builder and ATS workspace immediately without any registration or credit card."
                }
            },
            {
                "@type": "Question",
                "name": "What exactly is an ATS-friendly resume?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "An ATS (Applicant Tracking System) friendly resume is a document specifically optimized for the algorithms used by Fortune 500 companies."
                }
            }
        ]
    };

    return (
        <main className="-mx-4 -my-8 font-sans bg-gray-50 overflow-hidden">
            <SEO
                title="Free ATS Resume Builder — Check & Beat the ATS Online"
                description="The #1 Free ATS Resume Builder & Checker. Get a professional ATS score, optimize with AI keywords, and bypass Applicant Tracking Systems to land more interviews."
                keywords="ats resume builder, free ats checker, resume score, ats friendly resume maker, ai resume optimizer, resume keywords, resume scanner"
                schemas={[faqSchema]}
            />
            
            {/* Custom Animations injected directly to avoid tailwind config changes */}
            <style>
                {`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(2deg); }
                    50% { transform: translateY(-15px) rotate(-1deg); }
                    100% { transform: translateY(0px) rotate(2deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes shimmer {
                    100% { transform: translateX(200%); }
                }
                .glass-flare {
                    background: radial-gradient(circle at center, rgba(96, 239, 255, 0.15) 0%, transparent 70%);
                }
                `}
            </style>

            {/* HERO SECTION - Deep Navy Blue with Glowing Orbs */}
            <section className="relative bg-[#0b1f3b] pt-16 pb-32 overflow-hidden text-white">
                {/* Glowing Background Elements */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] glass-flare rounded-full mix-blend-screen opacity-50 pointer-events-none animate-pulse duration-[5000ms]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-indigo-600/20 blur-[100px] rounded-full mix-blend-screen opacity-60 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <FadeInSection className="space-y-8 text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                                #1 Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60efff] to-blue-400">ATS Resume Builder</span> & ATS Checker
                            </h1>
                            <p className="text-lg md:text-xl text-blue-100 max-w-xl mx-auto lg:mx-0 opacity-90 leading-relaxed">
                                Create an ATS-friendly resume that highlights your best achievements and gets you hired faster, completely frictionless.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={importing}
                                    className="group relative px-12 py-5 bg-white text-[#0b1f3b] font-black rounded-full text-xl hover:bg-blue-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap active:scale-95"
                                >
                                    <div className="absolute inset-0 bg-white/40 w-1/2 -skew-x-12 translate-x-[-250%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                    <Upload size={24} className="shrink-0 group-hover:-translate-y-1 transition-transform" />
                                    <span>{importing ? 'Importing...' : 'Upload & Optimize Resume'}</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf,.docx"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="flex items-center justify-center lg:justify-start gap-2 pt-2 animate-in fade-in duration-1000 delay-500">
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#60efff] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#60efff]"></span>
                                </span>
                                <p className="text-sm text-blue-200 font-medium">No registration required to start</p>
                            </div>
                            {/* Free Grader secondary CTA */}
                            <div className="flex justify-center lg:justify-start pt-1">
                                <Link
                                    to="/resume-grader"
                                    className="inline-flex items-center gap-2 text-[#60efff] font-bold text-sm hover:underline underline-offset-4 transition-all"
                                >
                                    <Target size={15} />
                                    Already have a resume? Check your ATS Score for free →
                                </Link>
                            </div>
                        </FadeInSection>

                        {/* Hero Image Mockup */}
                        <FadeInSection delay={200} className="relative mx-auto w-full max-w-lg perspective-1000">
                            <img 
                                src="/hero-mockup.png" 
                                alt="ATSense AI Resume Builder Interface" 
                                className="w-full h-auto rounded-xl shadow-2xl animate-float border-[6px] border-white/10 ring-1 ring-black/10"
                            />
                            {/* Decorative badge */}
                            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 rounded-2xl shadow-2xl animate-bounce duration-[3000ms]">
                                <div className="flex items-center gap-2">
                                    <Star className="fill-current text-yellow-300" size={20} />
                                    <span className="font-bold">#1 Rated Tool</span>
                                </div>
                            </div>
                        </FadeInSection>
                    </div>
                </div>

                {/* Bottom Wave Divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg className="relative block w-full h-16 md:h-24 fill-white" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </section>

            {/* Features Ribbon */}
            <section className="py-12 bg-white relative z-20 -mt-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <FadeInSection delay={100} className="px-6 py-4 group cursor-default">
                            <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <Zap className="text-yellow-500" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Fast & Easy to Use</h3>
                            <p className="text-gray-600 text-sm">Intuitive interface that walks you through creation from start to finish. Built to save you time.</p>
                        </FadeInSection>
                        <FadeInSection delay={200} className="px-6 py-4 group cursor-default">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                                <Brain className="text-blue-500" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Step-by-Step Guidance</h3>
                            <p className="text-gray-600 text-sm">AI assistance and expert-approved bullet points customized for your industry.</p>
                        </FadeInSection>
                        <FadeInSection delay={300} className="px-6 py-4 group cursor-default">
                            <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <FileText className="text-pink-500" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">ATS-Friendly Templates</h3>
                            <p className="text-gray-600 text-sm">Optimized formatting and templates that bypass ATS software and catch recruiter attention.</p>
                        </FadeInSection>
                    </div>
                </div>
            </section>


            {/* Free Grader Feature Banner */}
            <section className="py-14 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs uppercase tracking-widest mb-3">
                                <Target size={12} /> Free Tool
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Is Your Resume Actually Passing ATS Filters?</h2>
                            <p className="text-indigo-200 font-medium max-w-xl">
                                Upload your existing resume and get an instant ATS compatibility score with personalized fixes — completely free, no account needed.
                            </p>
                        </div>
                        <Link
                            to="/resume-grader"
                            className="shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-xl hover:-translate-y-1 text-sm uppercase tracking-wider whitespace-nowrap"
                        >
                            <Target size={16} />
                            Check My ATS Score <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-32 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -z-10"></div>
                <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
                    <FadeInSection>
                        <h2 className="text-3xl md:text-5xl font-black text-[#0b1f3b] mb-20 tracking-tight">Build your perfect resume in 3 simple steps</h2>
                    </FadeInSection>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                        {/* Connecting line for desktop */}
                        <div className="hidden md:block absolute top-[3.5rem] left-[16.66%] right-[16.66%] h-[3px] bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-100 -z-10"></div>
                        
                        {[
                            { num: "1", title: "Choose a template", desc: "Select from expertly designed ATS-friendly templates that grab recruiters' attention instantly." },
                            { num: "2", title: "Let AI write your bullets", desc: "Just provide a brief summary of what you did, and our AI perfectly translates it to professional achievements." },
                            { num: "3", title: "Download & apply", desc: "Export to flawless PDF instantly, bypassing the bots to land your next big job interview." }
                        ].map((step, i) => (
                            <FadeInSection key={i} delay={i * 200} className="flex flex-col items-center group cursor-default">
                                <div className="w-24 h-24 bg-white border-[6px] border-[#0b1f3b] text-[#0b1f3b] rounded-full flex items-center justify-center text-4xl font-black mb-6 shadow-xl group-hover:bg-[#0b1f3b] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                    {step.num}
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-base max-w-[280px] font-medium">{step.desc}</p>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEW SEO SECTION: How to Beat the ATS */}
            <section className="py-32 bg-slate-50 border-y border-gray-100 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="flex-1 space-y-8">
                            <FadeInSection>
                                <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm mb-4 tracking-wide">THE PROBLEM</div>
                                <h2 className="text-4xl md:text-5xl font-black text-[#0b1f3b] leading-tight tracking-tight">
                                    How to Beat the <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Applicant Tracking System</span>
                                </h2>
                                <p className="text-gray-600 text-xl leading-relaxed mt-6">
                                    Did you know that <strong>75% of resumes are never seen by a human recruiter?</strong> They are filtered out by robotic measuring systems before they even reach a hiring manager.
                                </p>
                            </FadeInSection>
                            
                            <div className="space-y-6 mt-8">
                                {[
                                    { title: "Smart Keyword Alignment", desc: "Our AI identifies the exact keywords from the job description and weaves them naturally into your resume." },
                                    { title: "Standardized Formatting", desc: "We use machine-readable layouts that ensure your data is parsed correctly by systems like Workday, Greenhouse, and Lever." },
                                    { title: "Real-time ATS Scoring", desc: "Get an instant score based on how well your resume matches the job requirements." }
                                ].map((item, i) => (
                                    <FadeInSection key={i} delay={200 + (i * 150)} className="flex gap-5 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="mt-1 bg-indigo-50 p-2 rounded-xl text-indigo-600 h-fit shrink-0">
                                            <CheckCircle size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                                            <p className="text-gray-500 leading-relaxed mt-1">{item.desc}</p>
                                        </div>
                                    </FadeInSection>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full lg:w-auto">
                            <FadeInSection delay={400}>
                                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 relative group hover:-translate-y-2 transition-transform duration-500">
                                    <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-full font-black shadow-xl text-lg flex items-center gap-2">
                                        <Zap size={20} className="fill-current" />
                                        <span><AnimatedCounter end={98} />% Match</span>
                                    </div>
                                    <h3 className="font-black text-2xl mb-8 text-gray-900">Live ATS Readiness Report</h3>
                                    <div className="space-y-8">
                                        <div>
                                            <div className="flex justify-between mb-2 font-bold text-sm">
                                                <span className="text-gray-600 uppercase tracking-widest">Match Score</span>
                                                <span className="text-green-600">Excellent</span>
                                            </div>
                                            <AnimatedBar />
                                        </div>
                                        
                                        <div className="h-px bg-gray-100"></div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-5 bg-green-50/50 rounded-2xl border border-green-100">
                                                <p className="text-xs text-green-600/80 uppercase font-black tracking-widest mb-1">Keywords</p>
                                                <p className="text-xl font-bold text-green-700">Optimal</p>
                                            </div>
                                            <div className="p-5 bg-green-50/50 rounded-2xl border border-green-100">
                                                <p className="text-xs text-green-600/80 uppercase font-black tracking-widest mb-1">Formatting</p>
                                                <p className="text-xl font-bold text-green-700">Verified</p>
                                            </div>
                                            <div className="p-5 bg-red-50/50 rounded-2xl border border-red-100">
                                                <p className="text-xs text-red-600/80 uppercase font-black tracking-widest mb-1">Typos</p>
                                                <p className="text-xl font-bold text-red-700">0 Found</p>
                                            </div>
                                            <div className="p-5 bg-green-50/50 rounded-2xl border border-green-100">
                                                <p className="text-xs text-green-600/80 uppercase font-black tracking-widest mb-1">Length</p>
                                                <p className="text-xl font-bold text-green-700">Perfect</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </FadeInSection>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW SEO SECTION: AI Career Intelligence */}
            <section className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <FadeInSection>
                        <h2 className="text-4xl md:text-5xl font-black text-[#0b1f3b] mb-6 tracking-tight">
                            AI-Powered <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Career Intelligence</span>
                        </h2>
                        <p className="text-gray-500 text-xl max-w-2xl mx-auto mb-20 leading-relaxed font-medium">
                            More than just a resume builder. ATSense uses advanced GPT-4 models to act as your personal career coach around the clock.
                        </p>
                    </FadeInSection>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                        {[
                            { icon: <Zap size={28} className="text-amber-500" />, title: "AI Bullet Points", desc: "Generate professional achievement statements in seconds based on your role." },
                            { icon: <Briefcase size={28} className="text-blue-500" />, title: "Job Description Analysis", desc: "Upload any job post and instantly get an actionable gap analysis." },
                            { icon: <Search size={28} className="text-purple-500" />, title: "Keyword Extraction", desc: "Never miss the crucial soft and hard skills recruiters are intensely searching for." },
                            { icon: <Activity size={28} className="text-emerald-500" />, title: "ATS Optimization", desc: "Automatically format and structure your resume to definitively pass the bots." }
                        ].map((feat, i) => (
                            <FadeInSection key={i} delay={i * 150} className="p-8 rounded-[2rem] bg-gray-50/80 border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-default">
                                <div className="mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ring-1 ring-gray-100">
                                    {feat.icon}
                                </div>
                                <h3 className="font-black text-gray-900 text-xl mb-3">{feat.title}</h3>
                                <p className="text-gray-500 text-base leading-relaxed font-medium">{feat.desc}</p>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>


        </main>
    );
};

export default Landing;
