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
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white pb-24">
            <SEO
                title={`${preset.headline} | ATSense`}
                description={preset.metaDescription}
                canonical={`https://atsense.online/tailor/${preset.slug}`}
            />

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
                    <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/templates" className="hover:text-indigo-600 transition-colors">ATS Presets</Link>
                    <ChevronRight size={14} />
                    <span className="text-indigo-600 uppercase tracking-wider">{preset.name}</span>
                </div>

                {/* Hero Section */}
                <div className="text-center sm:text-left mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-4">
                        <Award size={14} /> {preset.badge}
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                        {preset.headline}
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8">
                        {preset.metaDescription}
                    </p>

                    {/* Primary Hero CTAs */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={handleStartTailoring}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-base shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2.5"
                        >
                            <Sparkles size={18} />
                            <span>Deep Tailor for {preset.name} in 1 Click</span>
                            <ArrowRight size={18} />
                        </button>
                        <Link
                            to="/resume-grader"
                            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-200 transition-colors flex items-center justify-center gap-2 shadow-xs"
                        >
                            <Target size={16} className="text-indigo-600" />
                            <span>Scan Free ATS Score</span>
                        </Link>
                    </div>
                </div>

                {/* Core Blueprint Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Card 1: Hiring Philosophy */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                            <Building2 size={20} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">Hiring Philosophy</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {preset.hiringPhilosophy}
                        </p>
                    </div>

                    {/* Card 2: ATS Formula */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                            <Zap size={20} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">Verified ATS Formula</h3>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            {preset.atsFormula}
                        </p>
                    </div>

                    {/* Card 3: ATS Platform Details */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                            <ShieldCheck size={20} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">Target ATS Engine</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                            Filtered primarily through: <strong className="text-slate-900">{preset.atsPlatform}</strong>
                        </p>
                        <p className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                            <CheckCircle2 size={13} /> 100% Parser Compliant in ATSense
                        </p>
                    </div>
                </div>

                {/* Section: Must-Have Keywords Cloud */}
                <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs mb-12">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Semantic Match</span>
                            <h2 className="text-2xl font-black text-slate-900">High-Frequency Keywords for {preset.name}</h2>
                            <p className="text-xs text-slate-500 mt-1">Click any keyword to copy directly to your clipboard</p>
                        </div>
                        <span className="text-xs text-slate-600 self-start sm:self-auto bg-slate-100 px-3 py-1 rounded-full font-semibold">
                            {preset.mustHaveKeywords.length} Verified Keywords
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                        {preset.mustHaveKeywords.map((kw, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleCopyKeyword(kw)}
                                className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-700 transition-all duration-150"
                            >
                                <span>{kw}</span>
                                {copiedKeyword === kw ? (
                                    <Check size={13} className="text-emerald-600" />
                                ) : (
                                    <Copy size={13} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section: Real Before vs After Comparison */}
                <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs mb-12">
                    <div className="mb-6">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Deep Tailor Transformation</span>
                        <h2 className="text-2xl font-black text-slate-900">Before vs. After Deep Tailoring for {preset.name}</h2>
                        <p className="text-xs text-slate-500 mt-1">See how our AI rewrites standard bullet points to pass tier-1 applicant screening bots</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Before */}
                        <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200">
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700 mb-3">
                                Standard Resume (Likely Filtered Out)
                            </span>
                            <p className="text-sm text-slate-700 leading-relaxed font-mono">
                                "{preset.sampleBefore}"
                            </p>
                        </div>

                        {/* After */}
                        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700 mb-3">
                                Deep Tailored (Passes ATS & Recruiter Screen)
                            </span>
                            <p className="text-sm text-emerald-900 leading-relaxed font-mono">
                                "{preset.sampleAfter}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section: Recruiter Pro Tips */}
                <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs mb-16">
                    <h2 className="text-xl font-black text-slate-900 mb-4">Insider Recruiter Tips for {preset.name}</h2>
                    <div className="space-y-3">
                        {preset.tips.map((tip, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                                <CheckCircle2 size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Directory / Matrix for SEO Internal Linking */}
                <div className="pt-8 border-t border-slate-200">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                        Browse Other Company & Role ATS Blueprints
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.values(COMPANY_PRESETS).map((p) => (
                            <Link
                                key={p.slug}
                                to={`/tailor/${p.slug}`}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                    p.slug === preset.slug
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
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
