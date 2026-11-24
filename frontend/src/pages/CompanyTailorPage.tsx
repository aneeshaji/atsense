import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Target, 
    Copy, Check, Building2, Briefcase, Zap, Cpu, Award, ChevronRight
} from 'lucide-react';
import SEO from '../components/SEO';
import { COMPANY_PRESETS } from '../data/companyPresets';
import type { CompanyPreset } from '../data/companyPresets';

export const CompanyTailorPage: React.FC = () => {
    const { companyOrRole } = useParams<{ companyOrRole: string }>();
    const navigate = useNavigate();
    const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

    const slug = (companyOrRole || 'google').toLowerCase();
    const preset: CompanyPreset = COMPANY_PRESETS[slug] || COMPANY_PRESETS['google'];

    const handleCopyKeyword = (keyword: string) => {
        navigator.clipboard.writeText(keyword);
        setCopiedKeyword(keyword);
        setTimeout(() => setCopiedKeyword(null), 2000);
    };

    const handleStartTailoring = () => {
        // Directs to builder with preset target context
        navigate(`/builder?target=${preset.slug}`);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white pb-24">
            <SEO
                title={`${preset.headline} | ATSense`}
                description={preset.metaDescription}
                canonical={`https://atsense.online/tailor/${preset.slug}`}
            />

            {/* Top Glow Decorator */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mt-24" />

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/templates" className="hover:text-white transition-colors">ATS Presets</Link>
                    <ChevronRight size={14} />
                    <span className="text-purple-400 uppercase tracking-wider">{preset.name}</span>
                </div>

                {/* Hero Section */}
                <div className="text-center sm:text-left mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300 uppercase tracking-wider mb-4">
                        <Award size={14} /> {preset.badge}
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                        {preset.headline}
                    </h1>
                    <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
                        {preset.metaDescription}
                    </p>

                    {/* Primary Hero CTAs */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={handleStartTailoring}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2.5"
                        >
                            <Sparkles size={18} />
                            <span>Deep Tailor for {preset.name} in 1 Click</span>
                            <ArrowRight size={18} />
                        </button>
                        <Link
                            to="/resume-grader"
                            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Target size={16} />
                            <span>Scan Free ATS Score</span>
                        </Link>
                    </div>
                </div>

                {/* Core Blueprint Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Card 1: Hiring Philosophy */}
                    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-lg">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                            <Building2 size={20} />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">Hiring Philosophy</h3>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                            {preset.hiringPhilosophy}
                        </p>
                    </div>

                    {/* Card 2: ATS Formula */}
                    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-lg">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                            <Zap size={20} />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">Verified ATS Formula</h3>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800/60">
                            {preset.atsFormula}
                        </p>
                    </div>

                    {/* Card 3: ATS Platform Details */}
                    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-lg">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                            <ShieldCheck size={20} />
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">Target ATS Engine</h3>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-2">
                            Filtered primarily through: <strong className="text-white">{preset.atsPlatform}</strong>
                        </p>
                        <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 size={13} /> 100% Parser Compliant in ATSense
                        </p>
                    </div>
                </div>

                {/* Section: Must-Have Keywords Cloud */}
                <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 mb-12">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Semantic Match</span>
                            <h2 className="text-2xl font-black text-white">High-Frequency Keywords for {preset.name}</h2>
                            <p className="text-xs text-slate-400 mt-1">Click any keyword to copy directly to your clipboard</p>
                        </div>
                        <span className="text-xs text-slate-500 self-start sm:self-auto bg-slate-800 px-3 py-1 rounded-full">
                            {preset.mustHaveKeywords.length} Verified Keywords
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                        {preset.mustHaveKeywords.map((kw, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleCopyKeyword(kw)}
                                className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-purple-600/20 border border-slate-800 hover:border-purple-500/50 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-all duration-150"
                            >
                                <span>{kw}</span>
                                {copiedKeyword === kw ? (
                                    <Check size={13} className="text-emerald-400" />
                                ) : (
                                    <Copy size={13} className="text-slate-500 group-hover:text-purple-300 transition-colors" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section: Real Before vs After Comparison */}
                <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 mb-12">
                    <div className="mb-6">
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Deep Tailor Transformation</span>
                        <h2 className="text-2xl font-black text-white">Before vs. After Deep Tailoring for {preset.name}</h2>
                        <p className="text-xs text-slate-400 mt-1">See how our AI rewrites standard bullet points to pass tier-1 applicant screening bots</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Before */}
                        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20">
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 mb-3">
                                Standard Resume (Likely Filtered Out)
                            </span>
                            <p className="text-sm text-slate-300 leading-relaxed font-mono">
                                "{preset.sampleBefore}"
                            </p>
                        </div>

                        {/* After */}
                        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 mb-3">
                                Deep Tailored (Passes ATS & Recruiter Screen)
                            </span>
                            <p className="text-sm text-emerald-200 leading-relaxed font-mono">
                                "{preset.sampleAfter}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section: Recruiter Pro Tips */}
                <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 mb-16">
                    <h2 className="text-xl font-black text-white mb-4">Insider Recruiter Tips for {preset.name}</h2>
                    <div className="space-y-3">
                        {preset.tips.map((tip, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                                <CheckCircle2 size={18} className="text-purple-400 shrink-0 mt-0.5" />
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Directory / Matrix for SEO Internal Linking */}
                <div className="pt-8 border-t border-slate-800">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                        Browse Other Company & Role ATS Blueprints
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.values(COMPANY_PRESETS).map((p) => (
                            <Link
                                key={p.slug}
                                to={`/tailor/${p.slug}`}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                    p.slug === preset.slug
                                        ? 'bg-purple-600 text-white border-purple-500'
                                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                                }`}
                            >
                                {p.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyTailorPage;
