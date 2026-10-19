import { Link, useNavigate } from 'react-router-dom';
import { 
    CheckCircle, Zap, Star, Brain, Search, FileText, Upload, Briefcase, 
    Activity, Target, ChevronRight, ChevronDown, Sparkles, ShieldCheck, 
    ArrowRight, Cpu, Layers, TrendingUp, RefreshCw, Check, X, ArrowUpRight, 
    Lock, FileCheck, Sliders, Play, Award
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import SEO from '../components/SEO';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { trackEvent, ANALYTICS_EVENTS } from '../services/analytics';
import Logo from '../components/Logo';

// Smooth Scroll Reveal Component
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
            { threshold: 0.1 }
        );

        if (domRef.current) observer.observe(domRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-700 ease-out transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// Animated Progress Bar Component
const AnimatedBar = ({ value = 98 }: { value?: number }) => {
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
        <div ref={ref} className="h-2.5 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700/60 p-0.5">
            <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 transition-all duration-[2000ms] ease-out rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] relative" 
                style={{ width: isVisible ? `${value}%` : '0%' }}
            >
                <div className="absolute inset-0 bg-white/30 w-1/2 -skew-x-12 translate-x-[-200%] animate-[shimmer_2s_infinite]"></div>
            </div>
        </div>
    );
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 1800, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
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
            { threshold: 0.4 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration, hasStarted]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// Interactive Live Hero Simulator Window
const InteractiveHeroSimulator = () => {
    const [activeTab, setActiveTab] = useState<'scan' | 'keywords' | 'star'>('scan');

    return (
        <div className="relative mx-auto w-full select-none">
            {/* Ambient Multi-Color Aura Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl pointer-events-none"></div>

            {/* Main Window Shell */}
            <div className="relative rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-[0_25px_60px_rgba(15,23,42,0.3)] overflow-hidden">
                
                {/* Window Titlebar */}
                <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block"></span>
                        <span className="ml-2.5 text-xs font-mono text-slate-400 hidden sm:flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            atsense-engine v3.0 • live simulator
                        </span>
                    </div>

                    {/* Interactive Tab Switcher */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                        <button
                            onClick={() => setActiveTab('scan')}
                            className={`px-3 py-1 rounded-lg font-bold transition-all ${
                                activeTab === 'scan' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Live Scan
                        </button>
                        <button
                            onClick={() => setActiveTab('keywords')}
                            className={`px-3 py-1 rounded-lg font-bold transition-all ${
                                activeTab === 'keywords' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Keywords
                        </button>
                        <button
                            onClick={() => setActiveTab('star')}
                            className={`px-3 py-1 rounded-lg font-bold transition-all ${
                                activeTab === 'star' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            STAR Polish
                        </button>
                    </div>
                </div>

                {/* Window Body */}
                <div className="p-5 sm:p-6 min-h-[380px] flex flex-col justify-between">
                    {activeTab === 'scan' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            {/* Top Status Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                        <Activity size={18} className="animate-spin" style={{ animationDuration: '6s' }} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">
                                            Parsing: Senior_Fullstack_Resume.pdf
                                        </p>
                                        <p className="text-xs text-slate-400">Target: Senior Software Engineer • Tier 1 Tech</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black px-3 py-1 rounded-full">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                    ATS PASS RATE: 98%
                                </div>
                            </div>

                            {/* Stylized Document Skeleton with Scanning Laser */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                                <div className="md:col-span-3 relative bg-slate-900 rounded-2xl p-4 border border-slate-800 overflow-hidden shadow-inner">
                                    {/* Laser Scan Line */}
                                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanline pointer-events-none z-20"></div>

                                    {/* Resume Structure Simulation */}
                                    <div className="space-y-3 opacity-90">
                                        <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                                            <div>
                                                <div className="h-3 w-28 bg-white/90 rounded"></div>
                                                <div className="h-2 w-44 bg-cyan-400/70 rounded mt-1.5"></div>
                                            </div>
                                            <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                                                Verified Clean
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-1.5">
                                            <div className="h-2 w-20 bg-slate-400 rounded"></div>
                                            <div className="h-2 w-full bg-slate-700 rounded"></div>
                                            <div className="h-2 w-5/6 bg-slate-700 rounded"></div>
                                        </div>

                                        <div className="space-y-2 pt-1">
                                            <div className="p-2 rounded-xl bg-slate-950/80 border border-emerald-500/30">
                                                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-emerald-400 font-bold">
                                                    <Check size={12} /> Quantified Impact Found (+42% throughput)
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-700 rounded"></div>
                                            </div>
                                            <div className="p-2 rounded-xl bg-slate-950/80 border border-cyan-500/30">
                                                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-cyan-400 font-bold">
                                                    <Check size={12} /> 18 Critical Job Keywords Synced
                                                </div>
                                                <div className="h-1.5 w-4/5 bg-slate-700 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Stats Column */}
                                <div className="md:col-span-2 space-y-3">
                                    <div className="p-3.5 bg-gradient-to-br from-indigo-950/60 to-slate-900 rounded-2xl border border-indigo-500/30">
                                        <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                                            <span>Workday & Taleo Score</span>
                                            <span className="text-emerald-400 font-mono">98%</span>
                                        </div>
                                        <AnimatedBar value={98} />
                                    </div>

                                    <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 text-xs">
                                        <div className="flex items-center justify-between text-slate-300">
                                            <span className="flex items-center gap-1.5">
                                                <CheckCircle size={14} className="text-emerald-400" /> Layout Formatting
                                            </span>
                                            <span className="text-emerald-400 font-semibold">100% Passed</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-300">
                                            <span className="flex items-center gap-1.5">
                                                <CheckCircle size={14} className="text-emerald-400" /> Keyword Density
                                            </span>
                                            <span className="text-cyan-400 font-semibold">Optimal</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-300">
                                            <span className="flex items-center gap-1.5">
                                                <CheckCircle size={14} className="text-emerald-400" /> Hidden Table Traps
                                            </span>
                                            <span className="text-emerald-400 font-semibold">0 Found</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'keywords' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <div>
                                    <h4 className="text-sm font-bold text-white">Target Job Keywords Analysis</h4>
                                    <p className="text-xs text-slate-400">Extracted from target vacancy posting</p>
                                </div>
                                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
                                    18 of 18 Matched
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                                {[
                                    { skill: "React.js & TypeScript", weight: "Critical" },
                                    { skill: "System Architecture", weight: "Critical" },
                                    { skill: "Cloud Services (AWS)", weight: "High" },
                                    { skill: "CI/CD & Docker", weight: "High" },
                                    { skill: "Team Mentorship", weight: "Medium" },
                                    { skill: "Performance Optimization", weight: "High" },
                                ].map((item, idx) => (
                                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                            <span className="text-xs font-medium text-slate-200">{item.skill}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-bold">
                                            100%
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/30 text-xs text-indigo-200">
                                ✨ <strong>AI Result:</strong> Zero critical keyword deficits. File is primed for recruiter algorithmic search.
                            </div>
                        </div>
                    )}

                    {activeTab === 'star' && (
                        <div className="space-y-3.5 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Sparkles size={16} className="text-amber-400" />
                                    AI STAR Bullet Transformation
                                </h4>
                                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">
                                    Score: 42 ➔ 99
                                </span>
                            </div>

                            {/* Before Card */}
                            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30">
                                <div className="flex items-center justify-between text-xs text-rose-400 font-bold mb-1">
                                    <span className="flex items-center gap-1"><X size={14} /> Weak Generic Duty</span>
                                    <span>ATS Score: 42/100</span>
                                </div>
                                <p className="text-xs text-slate-400 line-through">
                                    "Responsible for maintaining backend APIs and fixing software bugs for web customers."
                                </p>
                            </div>

                            {/* After Card */}
                            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
                                    <span className="flex items-center gap-1"><CheckCircle size={14} /> ATSense Optimized Result</span>
                                    <span className="bg-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">ATS Score: 99/100</span>
                                </div>
                                <p className="text-xs text-slate-100 font-medium leading-relaxed">
                                    "Architected high-throughput REST APIs handling <strong className="text-emerald-300">2.4M daily requests</strong>, optimizing query execution to <strong className="text-emerald-300">reduce latency by 44%</strong> and saving $180K in annual AWS infrastructure."
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono border border-indigo-500/30">
                                        Action Verb: Architected
                                    </span>
                                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-mono border border-cyan-500/30">
                                        Metric: 2.4M daily
                                    </span>
                                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                                        ROI: $180K saved
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Status Ticker */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            Algorithmic screening cleared
                        </span>
                        <Link to="/builder" className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors">
                            Launch Studio <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Floating Live Badges */}
            <div className="hidden sm:flex absolute -top-4 -right-4 bg-white text-slate-900 px-4 py-2 rounded-2xl shadow-xl items-center gap-2 text-xs font-black border border-slate-200">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>Workday & Taleo Verified</span>
            </div>

            <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-2xl shadow-xl items-center gap-2 text-xs font-black">
                <Zap size={16} className="text-yellow-300 fill-current" />
                <span>+340% Callback Rate</span>
            </div>
        </div>
    );
};

// Interactive Live Bullet Playground Component
const InteractiveBulletPlayground = () => {
    const [selectedRole, setSelectedRole] = useState<'swe' | 'pm' | 'mkt'>('swe');

    const examples = {
        swe: {
            role: "Software Engineer",
            weak: "Helped write code for client web application and solved bugs when reported.",
            weakScore: 36,
            strong: "Engineered scalable GraphQL microservices serving 1.4M active users, slashing endpoint latency by 45% and reducing infrastructure costs by $120,000 annually.",
            strongScore: 99,
            tags: ["Action Verb: Engineered", "Metric: 1.4M users", "Latency: -45%", "ROI: $120K saved"]
        },
        pm: {
            role: "Product Manager",
            weak: "Managed product roadmap and organized weekly sprint meetings with the engineering team.",
            weakScore: 41,
            strong: "Spearheaded end-to-end product redesign for checkout funnel across 4 cross-functional squads, lifting mobile conversion by 28% and driving $3.2M incremental ARR.",
            strongScore: 98,
            tags: ["Action Verb: Spearheaded", "Team: 4 squads", "Conversion: +28%", "ARR: +$3.2M"]
        },
        mkt: {
            role: "Marketing Manager",
            weak: "Created social media campaigns and sent marketing emails to prospective customers.",
            weakScore: 38,
            strong: "Orchestrated multi-channel acquisition campaign across paid search and email, acquiring 45,000+ qualified MQLs while cutting Customer Acquisition Cost (CAC) by 32%.",
            strongScore: 97,
            tags: ["Action Verb: Orchestrated", "Volume: 45K MQLs", "Efficiency: -32% CAC"]
        }
    };

    const cur = examples[selectedRole];

    return (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-800">
                <div>
                    <span className="text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">
                        Interactive STAR Playground
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                        Watch Dull Bullet Points Transform into Offers
                    </h3>
                </div>

                {/* Role Switcher */}
                <div className="flex flex-wrap gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                    <button
                        onClick={() => setSelectedRole('swe')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            selectedRole === 'swe' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Software Engineer
                    </button>
                    <button
                        onClick={() => setSelectedRole('pm')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            selectedRole === 'pm' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Product Manager
                    </button>
                    <button
                        onClick={() => setSelectedRole('mkt')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            selectedRole === 'mkt' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Marketing Lead
                    </button>
                </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Traditional Weak Card */}
                <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center gap-1.5 border border-rose-500/30">
                                <X size={14} /> Unoptimized Draft
                            </span>
                            <span className="text-rose-400 font-mono font-bold text-sm">
                                ATS Score: {cur.weakScore}/100
                            </span>
                        </div>
                        <p className="text-slate-400 text-base leading-relaxed italic">
                            "{cur.weak}"
                        </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-rose-500/20 text-xs text-rose-300/80 font-medium">
                        ⚠️ Lacks quantifiable impact, action verbs, and core algorithmic keywords.
                    </div>
                </div>

                {/* ATSense Optimized Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30">
                                <CheckCircle size={14} /> ATSense Enhanced Result
                            </span>
                            <span className="bg-emerald-500/20 text-emerald-300 font-mono font-bold text-sm px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                                ATS Score: {cur.strongScore}/100
                            </span>
                        </div>
                        <p className="text-slate-100 text-base leading-relaxed font-medium">
                            "{cur.strong}"
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {cur.tags.map((tag, i) => (
                                <span key={i} className="text-xs bg-indigo-500/20 text-indigo-200 px-2.5 py-1 rounded-lg border border-indigo-500/30 font-mono">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-emerald-500/20 text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                        <Check size={14} /> Result: Instant recruiter callbacks & algorithmic clearance.
                    </div>
                </div>
            </div>
        </div>
    );
};

// FAQ Accordion Item
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-200 hover:border-indigo-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                aria-expanded={isOpen}
            >
                <span className="text-base sm:text-lg">{question}</span>
                <div className={`p-1.5 rounded-full bg-slate-100 text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-indigo-50 text-indigo-600' : ''}`}>
                    <ChevronDown size={18} />
                </div>
            </button>
            {isOpen && (
                <div className="px-6 pb-6 pt-1 text-slate-600 leading-relaxed font-normal text-sm sm:text-base border-t border-slate-100 animate-in fade-in duration-200">
                    {answer}
                </div>
            )}
        </div>
    );
};

const Landing = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleUploadProcess = async (file: File) => {
        const allowedTypes = [
            'application/pdf', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];
        
        if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
            showToast('Please upload a PDF or DOCX file.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);
        setImporting(true);

        try {
            const res = await api.post('/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const resumeData = res.data.resume || res.data;
            localStorage.setItem('atsense_current_resume', JSON.stringify(resumeData));

            trackEvent(ANALYTICS_EVENTS.CONVERSION.RESUME_UPLOAD, 'Conversion', file.name);

            showToast('Resume imported and parsed successfully!', 'success');
            navigate('/builder');
        } catch (err: any) {
            console.error(err);
            showToast(err.response?.data?.message || 'Failed to import resume. Starting with fresh template.', 'error');
            navigate('/builder');
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUploadProcess(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUploadProcess(e.dataTransfer.files[0]);
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
                "name": "What exactly is a modern hiring document?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A modern hiring document is a file specifically built to pass the automated filters used by large companies."
                }
            }
        ]
    };

    const companyLogos = [
        "Google", "Amazon", "Microsoft", "Meta", "Stripe", "Spotify", "Netflix", "Uber"
    ];

    return (
        <main id="main-content" className="font-sans bg-slate-50 overflow-hidden text-slate-900">
            <SEO
                title="ATSense — Next-Gen AI Resume Builder & ATS Intelligence"
                description="Bypass automated recruiter filters with algorithm-compliant resumes. Instant ATS scoring, STAR bullet point generator, and 1-click job tailoring."
                keywords="ats resume checker, free cv maker, resume score optimizer, career intelligence, pass applicant tracking systems"
                schemas={[faqSchema]}
            />

            {/* HERO SECTION - Dark Immersive Power Canvas */}
            <section 
                className="relative min-h-[92vh] flex items-center bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 overflow-hidden"
                onDragEnter={handleDrag}
            >
                {/* Full-Page Drag and Drop Active Overlay */}
                {dragActive && (
                    <div 
                        onDragEnter={handleDrag} 
                        onDragLeave={handleDrag} 
                        onDragOver={handleDrag} 
                        onDrop={handleDrop}
                        className="fixed inset-0 z-50 bg-indigo-950/90 backdrop-blur-xl flex flex-col items-center justify-center border-4 border-dashed border-cyan-400/50 p-8"
                    >
                        <Upload size={64} className="text-cyan-400 animate-bounce mb-4" />
                        <h3 className="text-3xl font-black text-white mb-2">Drop Your Resume Here</h3>
                        <p className="text-slate-300">We'll auto-extract your content and run the ATS compliance scan instantly.</p>
                    </div>
                )}

                {/* Ambient Floating Mesh Gradient Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-float"></div>
                    <div className="absolute top-40 right-[5%] w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[100px] animate-float-slow"></div>
                    <div className="absolute bottom-10 left-[30%] w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[130px] animate-float"></div>
                </div>

                {/* Subtle Grid Overlay */}
                <div className="absolute inset-0 tech-grid-dark opacity-30 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">
                        
                        {/* Left Column: Hero Copy & Upload */}
                        <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
                            
                            {/* Pill Badge */}
                            <FadeInSection delay={0} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm text-sm font-semibold text-indigo-300">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                                </span>
                                <span>ATSense 3.0 — Resume Intelligence Engine</span>
                            </FadeInSection>

                            {/* Main Headline */}
                            <FadeInSection delay={100}>
                                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black leading-[1.1] tracking-tight text-white">
                                    Your Resume Keeps Getting{' '}
                                    <span className="relative inline-block">
                                        <span className="gradient-text-animated">Rejected by Bots.</span>
                                        <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 300 8" fill="none">
                                            <path d="M1 5.5C50 2 100 2 150 4C200 6 250 3 299 5.5" stroke="url(#underline-grad)" strokeWidth="2.5" strokeLinecap="round">
                                                <animate attributeName="stroke-dashoffset" values="600;0" dur="1.5s" fill="freeze" />
                                                <animate attributeName="stroke-dasharray" values="0,600;600,0" dur="1.5s" fill="freeze" />
                                            </path>
                                            <defs>
                                                <linearGradient id="underline-grad" x1="0" y1="0" x2="300" y2="0">
                                                    <stop stopColor="#6366f1" />
                                                    <stop offset="1" stopColor="#a855f7" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </span>
                                    <br />
                                    <span className="text-slate-400 font-extrabold">We Fix That.</span>
                                </h1>
                            </FadeInSection>

                            {/* Subtitle */}
                            <FadeInSection delay={200}>
                                <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    75% of resumes are auto-rejected by Workday, Taleo & Greenhouse before a human sees them. ATSense reverse-engineers these filters to optimize your resume in seconds.
                                </p>
                            </FadeInSection>

                            {/* Upload Card */}
                            <FadeInSection delay={300} className="pt-1">
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="group relative p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/40 backdrop-blur-sm transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-center gap-4 hover:bg-white/[0.07]"
                                >
                                    {/* Hover glow */}
                                    <div className="absolute inset-0 rounded-2xl bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                    
                                    <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 relative z-10">
                                        {importing ? (
                                            <RefreshCw size={22} className="animate-spin" />
                                        ) : (
                                            <Upload size={22} />
                                        )}
                                    </div>
                                    <div className="flex-1 text-center sm:text-left relative z-10">
                                        <p className="font-bold text-white text-sm sm:text-base group-hover:text-indigo-300 transition-colors">
                                            {importing ? 'Analyzing with AI...' : 'Upload & Audit Your Resume Free'}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Drop PDF / DOCX here, or click to browse
                                        </p>
                                    </div>
                                    <button 
                                        disabled={importing}
                                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wide shrink-0 shadow-lg shadow-indigo-500/20 transition-all relative z-10"
                                    >
                                        Browse File
                                    </button>
                                </div>

                                <input
                                    type="file"
                                    id="resume-upload"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf,.docx,.doc"
                                    aria-label="Choose resume file"
                                    onChange={handleFileChange}
                                />
                            </FadeInSection>

                            {/* Secondary Links */}
                            <FadeInSection delay={400} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm">
                                <Link
                                    to="/resume-grader"
                                    className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                                >
                                    <Target size={14} /> Free Resume Grader →
                                </Link>
                                <span className="text-slate-700">•</span>
                                <Link
                                    to="/builder"
                                    className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-400 font-semibold transition-colors"
                                >
                                    Start from Scratch
                                </Link>
                            </FadeInSection>

                            {/* Trust Markers */}
                            <FadeInSection delay={500} className="flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-500 font-medium">
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle size={14} className="text-emerald-500" /> Free to build & export
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle size={14} className="text-emerald-500" /> No credit card
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Lock size={14} className="text-indigo-400" /> 100% Encrypted
                                </span>
                            </FadeInSection>

                            {/* Social Proof */}
                            <FadeInSection delay={600} className="flex items-center justify-center lg:justify-start gap-3">
                                <div className="flex -space-x-2 overflow-hidden">
                                    <div className="inline-flex h-7 w-7 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-indigo-500 to-purple-500 text-[9px] font-bold text-white items-center justify-center">AK</div>
                                    <div className="inline-flex h-7 w-7 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-cyan-500 to-blue-500 text-[9px] font-bold text-white items-center justify-center">MS</div>
                                    <div className="inline-flex h-7 w-7 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-emerald-500 to-teal-500 text-[9px] font-bold text-white items-center justify-center">JD</div>
                                    <div className="inline-flex h-7 w-7 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-rose-500 to-pink-500 text-[9px] font-bold text-white items-center justify-center">SL</div>
                                    <div className="inline-flex h-7 w-7 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-amber-500 to-orange-500 text-[9px] font-bold text-white items-center justify-center">VT</div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={13} className="fill-current" />
                                        ))}
                                    </div>
                                    <span className="font-bold text-slate-300">4.9/5</span>
                                    <span className="text-slate-500">from 42K+ users</span>
                                </div>
                            </FadeInSection>
                        </div>

                        {/* Right Column: Live Interactive ATS Simulator */}
                        <FadeInSection delay={250} className="lg:col-span-6">
                            <InteractiveHeroSimulator />
                        </FadeInSection>
                    </div>
                </div>
                
                {/* Bottom fade into next section */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
            </section>


            {/* FULL-WIDTH METRIC STATS TICKER */}
            <section className="py-8 bg-slate-900 text-white border-y border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                                <AnimatedCounter end={45000} suffix="+" />
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Resumes Optimized</p>
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                                98.2%
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">ATS Pass Rate</p>
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
                                3.4x
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">More Interview Invites</p>
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                                $32,000
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Avg. Salary Bump</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMPANY LOGOS RIBBON */}
            <section className="py-8 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                        Candidates successfully hired at world-class organizations
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-75">
                        {companyLogos.map((company, index) => (
                            <span 
                                key={index} 
                                className="text-slate-500 hover:text-slate-900 font-black text-lg md:text-xl tracking-tight transition-colors duration-200 cursor-default"
                            >
                                {company}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* INTERACTIVE STAR PLAYGROUND SECTION */}
            <section className="py-20 md:py-28 bg-slate-50 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection className="text-center max-w-3xl mx-auto mb-14">
                        <span className="text-indigo-600 font-extrabold text-xs uppercase tracking-[0.25em] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
                            Live Interactive Experience
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight">
                            See How AI Turns Generic Bullets into Job Offers
                        </h2>
                        <p className="text-slate-600 text-lg mt-3 font-normal">
                            Recruiters and automated filters scan for metrics, tools, and STAR structure. Test different sample career roles below:
                        </p>
                    </FadeInSection>

                    <InteractiveBulletPlayground />
                </div>
            </section>

            {/* 3-STEP INTUITIVE WORKFLOW */}
            <section className="py-20 md:py-28 bg-white border-t border-slate-200/80 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-600 font-extrabold text-xs uppercase tracking-[0.25em] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
                            Effortless 3-Minute Workflow
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight">
                            Build an Interview-Ready CV in 3 Simple Steps
                        </h2>
                        <p className="text-slate-600 text-lg mt-4 font-normal">
                            No complex menus or formatting headaches. ATSense handles all algorithmic parameters so you focus on telling your story.
                        </p>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {[
                            {
                                step: "01",
                                title: "Upload or Start Fresh",
                                desc: "Import your current resume in PDF or Word. Our parser maps your career chronology with zero data loss in 3 seconds.",
                                icon: <Upload size={24} className="text-indigo-600" />,
                                badge: "Instant 3s Import"
                            },
                            {
                                step: "02",
                                title: "AI Optimization & Matching",
                                desc: "Paste your target job post. The engine cross-references keywords, rewrites weak bullets into STAR metrics, and verifies ATS compatibility.",
                                icon: <Cpu size={24} className="text-purple-600" />,
                                badge: "Real-time Scoring"
                            },
                            {
                                step: "03",
                                title: "Export & Apply Confidently",
                                desc: "Download single-column, verified machine-readable PDF or DOCX files designed to pass Workday, Taleo, and Greenhouse with ease.",
                                icon: <FileCheck size={24} className="text-emerald-600" />,
                                badge: "98% Pass Rate"
                            }
                        ].map((item, i) => (
                            <FadeInSection key={i} delay={i * 150} className="group">
                                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-sm hover:border-indigo-300 hover:bg-white hover:shadow-xl transition-all duration-300 relative h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                                                {item.icon}
                                            </div>
                                            <span className="font-mono text-3xl font-black text-slate-300 group-hover:text-indigo-600 transition-colors">
                                                {item.step}
                                            </span>
                                        </div>
                                        <div className="inline-block text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-3 border border-indigo-100">
                                            {item.badge}
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed text-sm font-normal">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <div className="pt-6 mt-6 border-t border-slate-200/80 flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                                        <span>Learn more</span>
                                        <ChevronRight size={14} className="ml-1" />
                                    </div>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* BENTO GRID: REVOLUTIONARY FEATURES */}
            <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200/80 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <FadeInSection className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-600 font-extrabold text-xs uppercase tracking-[0.25em] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
                            Algorithmic Superpowers
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight">
                            Engineered Specifically to Beat Candidate Screening Bots
                        </h2>
                        <p className="text-slate-600 text-lg mt-4 font-normal">
                            Traditional templates look nice to human eyes, but appear as scrambled errors to automated hiring software. ATSense bridges the gap.
                        </p>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Big Bento Card 1 */}
                        <FadeInSection delay={100} className="md:col-span-2 group">
                            <div className="p-8 md:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-indigo-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
                                <div>
                                    <div className="p-3 w-fit rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-6">
                                        <Target size={28} />
                                    </div>
                                    <span className="text-xs font-mono text-indigo-600 uppercase tracking-widest font-bold">Smart Keyword Alignment</span>
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-2 mb-4">
                                        Reverse-Engineer Any Job Description URL
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-base max-w-xl font-normal">
                                        Paste any job vacancy link or text. ATSense extracts the exact semantic keywords, certifications, and hard skills recruiters configured their filter for, highlighting missing terms in your profile.
                                    </p>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                                    <span className="text-xs bg-slate-50 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 font-semibold">Workday Parser</span>
                                    <span className="text-xs bg-slate-50 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 font-semibold">Taleo Compliance</span>
                                    <span className="text-xs bg-slate-50 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 font-semibold">Greenhouse Verified</span>
                                    <span className="text-xs bg-slate-50 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 font-semibold">Lever Ready</span>
                                </div>
                            </div>
                        </FadeInSection>

                        {/* Bento Card 2 */}
                        <FadeInSection delay={200} className="group">
                            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-purple-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
                                <div>
                                    <div className="p-3 w-fit rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 mb-6">
                                        <Brain size={28} />
                                    </div>
                                    <span className="text-xs font-mono text-purple-600 uppercase tracking-widest font-bold">STAR AI Polish</span>
                                    <h3 className="text-2xl font-black text-slate-900 mt-2 mb-3">
                                        Quantified Impact Generator
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-sm font-normal">
                                        Turn passive task descriptions into quantified achievements using the STAR methodology (Situation, Task, Action, Result).
                                    </p>
                                </div>
                                <div className="mt-6 p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-800 font-medium">
                                    "Increased delivery velocity by 35% through containerization."
                                </div>
                            </div>
                        </FadeInSection>

                        {/* Bento Card 3 */}
                        <FadeInSection delay={300} className="group">
                            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-indigo-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
                                <div>
                                    <div className="p-3 w-fit rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-6">
                                        <Layers size={28} />
                                    </div>
                                    <span className="text-xs font-mono text-indigo-600 uppercase tracking-widest font-bold">Layout Integrity</span>
                                    <h3 className="text-2xl font-black text-slate-900 mt-2 mb-3">
                                        Zero Broken Tables
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-sm font-normal">
                                        Two-column templates and graphic icons cause 40% of ATS parsing errors. ATSense strictly generates clean single-column layouts that never glitch.
                                    </p>
                                </div>
                                <div className="mt-6 flex items-center gap-2 text-xs text-indigo-700 font-bold">
                                    <CheckCircle size={16} className="text-emerald-600" /> 100% Parsing Accuracy
                                </div>
                            </div>
                        </FadeInSection>

                        {/* Big Bento Card 4 */}
                        <FadeInSection delay={400} className="md:col-span-2 group">
                            <div className="p-8 md:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-emerald-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
                                <div>
                                    <div className="p-3 w-fit rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-6">
                                        <Zap size={28} />
                                    </div>
                                    <span className="text-xs font-mono text-emerald-600 uppercase tracking-widest font-bold">Guest-First Philosophy</span>
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-2 mb-4">
                                        Instant Studio Access — Zero Paywalls
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-base max-w-xl font-normal">
                                        We believe top-tier career software should be democratized. Jump straight into building, auditing, and exporting without entering credit cards, creating passwords, or hitting sudden paywalls.
                                    </p>
                                </div>
                                <div className="mt-8 flex flex-wrap items-center gap-4">
                                    <Link
                                        to="/builder"
                                        className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wider transition-all inline-flex items-center gap-2"
                                    >
                                        Open Studio Directly <ArrowUpRight size={16} />
                                    </Link>
                                    <span className="text-xs text-slate-500 font-medium">Zero account setup required</span>
                                </div>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* COMPARISON MATRIX: TRADITIONAL VS ATSENSE */}
            <section className="py-20 md:py-28 bg-white border-t border-slate-200/80 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-600 font-extrabold text-xs uppercase tracking-[0.25em] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
                            The Brutal Reality
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight">
                            Why Ordinary Resumes Fail Algorithmic Screening
                        </h2>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                        {/* Red / Failing Card */}
                        <FadeInSection delay={100}>
                            <div className="p-8 md:p-10 rounded-3xl bg-rose-50/60 border-2 border-rose-200 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 font-black text-xs uppercase tracking-wider">
                                            Traditional Resume
                                        </span>
                                        <span className="text-rose-600 font-mono font-bold text-sm">74% Rejection Risk</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-6">The Old-Fashioned Way</h3>
                                    
                                    <ul className="space-y-4">
                                        {[
                                            "Multi-column tables confuse parsers, turning work history into scrambled text",
                                            "Fancy graphics, rating stars, and icons are completely invisible to software",
                                            "Lacks exact keyword tokens from the employer's specific job description",
                                            "Generic bullet points list daily duties rather than quantified outcomes",
                                            "Exported fonts often decode as corrupt characters in recruiter terminals"
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                                                <div className="p-1 rounded-full bg-rose-200/70 text-rose-700 mt-0.5 shrink-0">
                                                    <X size={14} />
                                                </div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-8 pt-6 border-t border-rose-200 text-xs font-semibold text-rose-700">
                                    Result: Rejected within 5 seconds by automated screening filters.
                                </div>
                            </div>
                        </FadeInSection>

                        {/* Green / Winning Card */}
                        <FadeInSection delay={200}>
                            <div className="p-8 md:p-10 rounded-3xl bg-white text-slate-900 border-2 border-indigo-600 shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs uppercase tracking-wider border border-emerald-200">
                                            ATSense Optimized
                                        </span>
                                        <span className="text-emerald-600 font-mono font-bold text-sm">98% Pass Rate</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-6">The Algorithmic Edge</h3>
                                    
                                    <ul className="space-y-4">
                                        {[
                                            "Standardized hierarchy validated against Workday, Taleo, and Greenhouse parsers",
                                            "Automated semantic keyword alignment tuned to your specific target position",
                                            "STAR method achievement generator with quantified percentage & revenue impact",
                                            "Clean universal typography recognized by every ATS and OCR reader",
                                            "Live instant compatibility score with prioritized recommendations"
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-800 font-medium">
                                                <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                                                    <Check size={14} />
                                                </div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                                    <CheckCircle size={16} /> Result: Document surfaces to the top of recruiter search queues.
                                </div>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* LIVE SCORECARD FEATURE BANNER */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 relative overflow-hidden text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-3 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white font-bold text-xs uppercase tracking-widest backdrop-blur-sm">
                                <Sparkles size={14} className="text-yellow-300" /> Instant Free Diagnostic
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                                Is Your Current CV Clearing Hiring Algorithms?
                            </h2>
                            <p className="text-indigo-100 text-base sm:text-lg leading-relaxed font-normal">
                                Upload your existing PDF or Word file to run an instant 100-point compatibility diagnostic. Discover hidden errors and missing keywords in under 15 seconds.
                            </p>
                        </div>
                        <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <Link
                                to="/resume-grader"
                                className="px-8 py-4.5 bg-white text-indigo-900 hover:bg-slate-50 font-black rounded-2xl text-base uppercase tracking-wider transition-all shadow-xl hover:-translate-y-0.5 inline-flex items-center justify-center gap-2.5 active:scale-95"
                            >
                                <Target size={20} className="text-indigo-600" />
                                <span>Check Match Score Free</span>
                                <ChevronRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CANDIDATE TESTIMONIALS */}
            <section className="py-20 md:py-28 bg-white border-t border-slate-200/80 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-600 font-extrabold text-xs uppercase tracking-[0.25em] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
                            Real Candidate Results
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight">
                            From 0 Callbacks to Multiple Offers
                        </h2>
                    </FadeInSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "I applied to 60+ jobs over 4 months with zero responses. After running my resume through ATSense and adopting the suggested keyword density, I got 4 interview requests in two weeks.",
                                name: "Marcus Chen",
                                role: "Senior Cloud Engineer",
                                company: "Hired at Amazon",
                                score: "Score jumped from 51% to 96%"
                            },
                            {
                                quote: "The STAR achievement enhancer is like having a $500 executive resume writer in your browser. It rewrote my dull bullet points into quantified accomplishments that recruiters actually loved.",
                                name: "Elena Rostova",
                                role: "Lead Product Designer",
                                company: "Hired at Stripe",
                                score: "3 Job Offers Received"
                            },
                            {
                                quote: "I had no idea my fancy Canva two-column resume was completely unreadable by Workday. ATSense cleaned up the structure and I finally cleared the automated screening gates.",
                                name: "David Adebayo",
                                role: "Fullstack Developer",
                                company: "Hired at Spotify",
                                score: "+$32k Salary Increase"
                            }
                        ].map((t, i) => (
                            <FadeInSection key={i} delay={i * 150}>
                                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex text-amber-400 mb-4">
                                            {[...Array(5)].map((_, idx) => (
                                                <Star key={idx} size={16} className="fill-current" />
                                            ))}
                                        </div>
                                        <p className="text-slate-700 leading-relaxed text-sm italic mb-6">
                                            "{t.quote}"
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-200">
                                        <div className="font-black text-slate-900">{t.name}</div>
                                        <div className="text-xs text-slate-500">{t.role} • <strong className="text-indigo-600">{t.company}</strong></div>
                                        <div className="mt-2 inline-block text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                                            ✓ {t.score}
                                        </div>
                                    </div>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* INTERACTIVE FAQ ACCORDION */}
            <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeInSection className="text-center mb-14">
                        <span className="text-indigo-600 font-extrabold text-xs uppercase tracking-[0.25em] bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100">
                            Clear Answers
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4 tracking-tight">
                            Frequently Asked Questions
                        </h2>
                    </FadeInSection>

                    <div className="space-y-4">
                        <FAQItem
                            question="What is an Applicant Tracking System (ATS) and why does it matter?"
                            answer="An Applicant Tracking System is recruitment software used by over 95% of Fortune 500 organizations to filter and rank resumes before a human recruiter ever sees them. It parses text, checks for matching keywords from the job description, and rejects files with conflicting formatting, multi-column tables, or unreadable fonts."
                        />
                        <FAQItem
                            question="How does the free ATSense resume grader work?"
                            answer="Our diagnostic engine analyzes your file using the exact parsing logic of top enterprise systems like Workday, Taleo, iCIMS, and Greenhouse. It calculates a compatibility score out of 100 based on layout clarity, section hierarchy, keyword density, and quantified achievement metrics."
                        />
                        <FAQItem
                            question="Is ATSense really free to use with no hidden fees?"
                            answer="Yes! ATSense operates as a guest-first, community-accessible platform. You can build, edit, test, and export your resumes without entering credit cards, paying monthly subscription fees, or dealing with watermarks."
                        />
                        <FAQItem
                            question="Why do two-column and graphic templates cause rejection?"
                            answer="Many resume parsing engines read text strictly from left-to-right across the entire page width. When a two-column template is scanned, text from disparate columns gets merged into a single jumbled sentence, causing the parser to fail to identify your work experience, job titles, or dates."
                        />
                        <FAQItem
                            question="Can I customize and tailor multiple resumes for different job postings?"
                            answer="Absolutely. Tailoring your resume for each specific role increases your interview callback rate by up to 340%. With ATSense's Job Matcher tool, you can paste the target vacancy URL and immediately align your keywords for that specific position."
                        />
                    </div>
                </div>
            </section>

            {/* DETAILED CAREER & SEO GUIDES */}
            <section className="py-20 bg-white border-t border-slate-200/80">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Modern Resume Architecture in 2026
                        </h2>
                        <p className="text-slate-600 mt-3 text-base">Expert insights from professional recruiters and algorithmic screening specialists.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-4">
                            <h3 className="text-xl font-black text-slate-900">Mastering Algorithmic ATS Optimization</h3>
                            <p className="text-slate-600 text-sm leading-relaxed font-normal">
                                In the current hiring market, your resume isn't just a document; it's a data packet designed to be parsed by sophisticated machine algorithms. Effective optimization requires strategic alignment of your career achievements with target position requirements.
                            </p>
                            <p className="text-slate-600 text-sm leading-relaxed font-normal">
                                Always cross-reference job postings for recurring competencies. Weave high-priority keywords naturally into your experience using the STAR framework rather than generic keyword stuffing, which is easily flagged by contemporary semantic parsers.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-4">
                            <h3 className="text-xl font-black text-slate-900">Generative AI & Recruiter Discovery (GEO)</h3>
                            <p className="text-slate-600 text-sm leading-relaxed font-normal">
                                Modern talent teams now deploy AI sourcing agents to discover candidates directly from talent databases. Adhering to single-column, standard-compliant formatting ensures that your certifications and skill matrices are accurately indexed for high-value executive searches.
                            </p>
                            <p className="text-slate-600 text-sm leading-relaxed font-normal">
                                Stick to universal system typefaces like Inter, Arial, or Calibri with standard header labels. This ensures instant readability across both automated machine filters and human hiring managers.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center text-xs text-slate-400">
                        <p className="font-semibold uppercase tracking-wider">Published by ATSense Editorial & Career Intelligence Team</p>
                        <p className="mt-1">Last audited for hiring software compliance • 2026 Edition</p>
                    </div>
                </div>
            </section>

            {/* FINAL HIGH-CONVERTING BOTTOM CTA */}
            <section className="py-20 bg-slate-900 text-white text-center overflow-hidden relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2">
                        <Sparkles size={16} className="text-yellow-400" />
                        Next-Gen Algorithmic Optimization
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Ready to Land Your Next Big Career Move?
                    </h2>
                    <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                        Join over 42,000 candidates who stopped getting rejected by bots and started receiving direct recruiter interview calls.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/builder"
                            className="w-full sm:w-auto px-10 py-4.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black rounded-2xl text-lg hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                        >
                            <span>Open Resume Studio Free</span>
                            <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/resume-grader"
                            className="w-full sm:w-auto px-8 py-4.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-2xl text-lg border border-slate-700 transition-all inline-flex items-center justify-center gap-2"
                        >
                            <Target size={20} className="text-indigo-400" />
                            <span>Run Free Scan</span>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Landing;
