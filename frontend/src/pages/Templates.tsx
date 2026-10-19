import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    LayoutTemplate, ChevronRight, Target, Sparkles, CheckCircle2, 
    ArrowRight, ShieldCheck, Zap, Download, ExternalLink, Star 
} from 'lucide-react';
import SEO from '../components/SEO';
import api from '../services/api';

const DEFAULT_TEMPLATES = [
    {
        id: 'harvard-default',
        name: 'The Harvard Classic',
        slug: 'harvard-resume-template',
        category: 'Executive & Finance',
        rating: 4.95,
        downloads: '42k+',
        description: 'The gold-standard academic and corporate format. Rigorously engineered for 100% parsability across Workday, Taleo, and BrassRing.',
        gradient: 'from-blue-600 via-indigo-700 to-slate-900',
        badge: 'Top Pick for Banking & Consulting',
    },
    {
        id: 'executive-default',
        name: 'The Silicon Modern',
        slug: 'executive-resume-template',
        category: 'Tech & Engineering',
        rating: 4.98,
        downloads: '58k+',
        description: 'Sleek sans-serif hierarchy tailored for software architects, product managers, and engineering leaders. Emphasizes tech stacks and impact metrics.',
        gradient: 'from-indigo-600 via-violet-700 to-slate-900',
        badge: 'Recommended for FAANG / Tech',
    }
];

const INDUSTRY_TEMPLATES = [
    { id: 'se', name: 'Software Engineer', slug: 'software-engineer', category: 'Tech', count: '14k uses', description: 'Engineered with dedicated tech-stack matrices, GitHub links, and quantified system throughput bullets.' },
    { id: 'pm', name: 'Product Manager', slug: 'product-manager', category: 'Product', count: '9.8k uses', description: 'Showcases cross-functional sprint leadership, North Star metrics, and ARR impact metrics.' },
    { id: 'ds', name: 'Data Scientist & AI', slug: 'data-scientist', category: 'Data', count: '8.4k uses', description: 'Highlights ML model deployments, pipeline architectures, and Kaggle/PyTorch credentials.' },
    { id: 'mm', name: 'Marketing Growth Lead', slug: 'marketing-manager', category: 'Growth', count: '6.2k uses', description: 'Focuses on CAC/LTV payback, multi-channel acquisition funnels, and brand scale.' },
    { id: 'nr', name: 'Healthcare Specialist', slug: 'nurse', category: 'Clinical', count: '7.1k uses', description: 'Prioritizes state clinical licensure, patient care ratios, and hospital system compliance.' },
];

const CATEGORIES = ['All Templates', 'Tech & Engineering', 'Executive & Finance', 'Growth & Marketing'];

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "Are these resume templates ATS-friendly?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every ATSense template is designed from the ground up to be 100% ATS-compatible, using clean formatting, standard headings, and zero unparsable graphics." } },
        { "@type": "Question", "name": "Can I customize the template with my own content?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. Select any template and our AI Resume Builder will help you fill it in, optimize your content, and tailor it to any job description." } },
    ]
};

export default function Templates() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Templates');

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await api.get('/templates');
                setTemplates(res.data);
            } catch (err) {
                console.error('Failed to fetch templates:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    const allPremiumTemplates = [...DEFAULT_TEMPLATES, ...templates];

    const filteredTemplates = activeTab === 'All Templates'
        ? allPremiumTemplates
        : allPremiumTemplates.filter(t => t.category?.toLowerCase().includes(activeTab.toLowerCase().split(' ')[0]));

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans relative overflow-hidden">
            <SEO
                title="Free ATS Resume Templates — 100% Bot-Tested Formats"
                description="Download and use the best free ATS resume templates. Every template is rigorously tested to pass Applicant Tracking Systems and recruiter screens."
                keywords="ats resume template, free ats resume templates, ats friendly resume template, recruiter approved resumes, ats maker"
                url="https://atsense.online/templates"
                schemas={[faqSchema]}
            />

            {/* Ambient Background Aura */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]"></div>
                <div className="absolute top-[40%] -right-40 w-[600px] h-[500px] bg-violet-600/10 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-10 -left-40 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute inset-0 tech-grid-dark opacity-30"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
                
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 font-semibold text-xs uppercase tracking-wider mb-6 backdrop-blur-md">
                        <Sparkles size={13} className="text-cyan-400" />
                        <span>100% Parser-Proof Geometric Hierarchy</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
                        Battle-Tested ATS Resume{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300">
                            Templates
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
                        Crafted without the parsing traps, multi-column bugs, or unreadable graphics that get 75% of applications auto-rejected.
                    </p>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {CATEGORIES.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                                    activeTab === tab
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Premium Templates Section */}
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        {filteredTemplates.map((tpl) => (
                            <div 
                                key={tpl.id}
                                className="group relative bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col"
                            >
                                {/* Preview Window Header */}
                                <div className={`h-64 bg-gradient-to-br ${tpl.gradient || 'from-indigo-600 to-slate-900'} p-6 flex items-center justify-center relative overflow-hidden`}>
                                    <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none"></div>

                                    {/* Mock Document Sheet */}
                                    <div className="relative z-10 w-44 h-52 bg-white rounded-lg shadow-2xl p-4 flex flex-col space-y-2.5 transform group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300 border border-slate-200/40">
                                        <div className="w-full h-3 bg-slate-800 rounded-sm"></div>
                                        <div className="w-1/2 h-1.5 bg-slate-400 rounded-sm"></div>
                                        <div className="w-full h-px bg-slate-200 my-1"></div>
                                        <div className="space-y-1.5">
                                            <div className="w-full h-1 bg-slate-200 rounded-sm"></div>
                                            <div className="w-5/6 h-1 bg-slate-200 rounded-sm"></div>
                                            <div className="w-full h-1 bg-slate-200 rounded-sm"></div>
                                        </div>
                                        <div className="pt-2 space-y-1.5">
                                            <div className="w-1/3 h-1.5 bg-indigo-600 rounded-sm"></div>
                                            <div className="w-full h-1 bg-slate-200 rounded-sm"></div>
                                            <div className="w-4/5 h-1 bg-slate-200 rounded-sm"></div>
                                        </div>
                                    </div>

                                    {/* Badge Overlay */}
                                    {tpl.badge && (
                                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-cyan-300 text-[10px] font-extrabold uppercase tracking-wider">
                                            {tpl.badge}
                                        </div>
                                    )}
                                </div>

                                {/* Body Card */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between gap-4 mb-3">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={16} className="text-emerald-400" />
                                            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                                                100% Workday / Taleo Safe
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                                            <Star size={13} className="fill-current" />
                                            <span>{tpl.rating || '4.95'}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-cyan-300 transition-colors">
                                        {tpl.name}
                                    </h3>

                                    <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                                        {tpl.description}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-slate-800/80 flex items-center justify-between gap-4">
                                        <Link 
                                            to={`/templates/${tpl.slug}`} 
                                            className="text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                                        >
                                            View Spec Sheet <ChevronRight size={14} />
                                        </Link>

                                        <Link 
                                            to={`/template-builder?template=${tpl.slug.includes('harvard') ? 'harvard' : tpl.slug.includes('executive') ? 'executive' : tpl.slug}`}
                                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/25 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                                        >
                                            <span>Use Template</span>
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Industry Formats Grid */}
                <div className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-1">Targeted Industry Formats</h2>
                            <p className="text-slate-400 text-sm">Specialized section hierarchies configured for specific hiring loops.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {INDUSTRY_TEMPLATES.map((tpl) => (
                            <Link 
                                key={tpl.id} 
                                to={`/templates/${tpl.slug}`}
                                className="group p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                                            {tpl.category}
                                        </span>
                                        <span className="text-[11px] text-slate-500 font-medium">{tpl.count}</span>
                                    </div>
                                    <h3 className="font-bold text-white text-base mb-2 group-hover:text-cyan-300 transition-colors">
                                        {tpl.name}
                                    </h3>
                                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                                        {tpl.description}
                                    </p>
                                </div>

                                <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center text-indigo-400 group-hover:text-cyan-300 text-xs font-bold">
                                    <span>Inspect ATS Keywords</span>
                                    <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Free Checker Bottom Callout */}
                <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-950 to-slate-900 border border-indigo-500/20 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-black text-white mb-2">Already have a resume draft?</h3>
                        <p className="text-slate-400 text-sm max-w-xl">
                            Test your existing resume file against our automated ATS parser simulator before deciding on a template.
                        </p>
                    </div>
                    <Link
                        to="/resume-grader"
                        className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                    >
                        <Target size={15} className="text-cyan-400" />
                        <span>Run Free ATS Grader</span>
                    </Link>
                </div>

            </div>
        </div>
    );
}
