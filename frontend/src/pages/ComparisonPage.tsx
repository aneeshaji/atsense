import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, X, Sparkles, ArrowRight, ShieldCheck, Zap, Target } from 'lucide-react';
import SEO from '../components/SEO';

interface CompetitorData {
    slug: string;
    name: string;
    tagline: string;
    description: string;
    priceComparison: string;
    rows: { feature: string; atsense: string; competitor: string; atsenseWins: boolean }[];
}

const COMPETITORS: Record<string, CompetitorData> = {
    jobscan: {
        slug: 'jobscan',
        name: 'Jobscan',
        tagline: 'ATSense vs Jobscan — Free AI Resume Optimization Without Paywalls',
        description: 'Compare ATSense and Jobscan side-by-side. Get unlimited ATS score scans, 1-click AI bullet rewriting, and instant PDF export without \$49.95/month subscriptions.',
        priceComparison: '\$49.95/mo on Jobscan vs Free on ATSense',
        rows: [
            { feature: 'ATS Compatibility Scan', atsense: 'Unlimited & Free', competitor: '5 free scans/month', atsenseWins: true },
            { feature: 'AI Resume Rewriting (Deep Tailor)', atsense: '1-Click Included', competitor: 'Paid Power Edit', atsenseWins: true },
            { feature: 'Cover Letter & LinkedIn Optimizer', atsense: 'All-in-One Free Suite', competitor: 'Limited / Paid Tier', atsenseWins: true },
            { feature: 'ATS-Safe PDF Builder', atsense: 'Built-in Studio', competitor: 'Basic / Separate', atsenseWins: true },
            { feature: 'No Credit Card Required', atsense: 'Yes — Start Instantly', competitor: 'Trial requires card', atsenseWins: true },
        ],
    },
    resumeworded: {
        slug: 'resumeworded',
        name: 'Resume Worded',
        tagline: 'ATSense vs Resume Worded — Built for Modern ATS & AI Recruiters',
        description: 'See how ATSense compares to Resume Worded for resume scoring, keyword matching, LinkedIn optimization, and tailored PDF exports.',
        priceComparison: '\$49/mo on Resume Worded vs Free on ATSense',
        rows: [
            { feature: 'Full ATS Score Breakdown', atsense: 'Free Instant Report', competitor: 'Gated Behind Pro', atsenseWins: true },
            { feature: 'Job Description Keyword Matcher', atsense: 'Free & Unlimited', competitor: 'Pro Plan Only', atsenseWins: true },
            { feature: 'AI Interview Simulator', atsense: 'Included Free', competitor: 'Not Included', atsenseWins: true },
            { feature: 'Resume PDF Export', atsense: 'Clean ATS Templates', competitor: 'Separate Editor Needed', atsenseWins: true },
            { feature: 'LinkedIn Profile Optimizer', atsense: 'Included Free', competitor: 'Pro Plan Only', atsenseWins: true },
        ],
    },
    enhancv: {
        slug: 'enhancv',
        name: 'Enhancv',
        tagline: 'ATSense vs Enhancv — Strict Single-Column ATS Parsing That Passes',
        description: 'Compare ATSense and Enhancv. Avoid multi-column parser traps and get deep AI job-description tailoring for Workday, Greenhouse, and Lever.',
        priceComparison: '\$24.99/mo on Enhancv vs Free on ATSense',
        rows: [
            { feature: 'Workday & Taleo Parser Safety', atsense: '100% Single-Column Safe', competitor: 'Multi-column templates can break parsers', atsenseWins: true },
            { feature: 'Deep Tailor to Job Description', atsense: '1-Click AI Rewrite', competitor: 'Manual Editing', atsenseWins: true },
            { feature: 'ATS Score & Gap Report', atsense: '20-Point Diagnostic', competitor: 'Basic Content Check', atsenseWins: true },
            { feature: 'Watermark-Free PDF Export', atsense: 'Free', competitor: 'Paid Subscription', atsenseWins: true },
            { feature: 'Interview & Cover Letter AI', atsense: 'Included Free', competitor: 'Add-on / Limited', atsenseWins: true },
        ],
    },
};

export default function ComparisonPage() {
    const { competitor } = useParams<{ competitor: string }>();
    const key = (competitor || 'jobscan').toLowerCase();
    const data = COMPETITORS[key] || COMPETITORS.jobscan;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
            <SEO
                title={`${data.tagline} | ATSense`}
                description={data.description}
                canonical={`https://atsense.online/vs/${data.slug}`}
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 space-y-12">
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        <ShieldCheck size={14} /> {data.priceComparison}
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                        ATSense vs {data.name}
                    </h1>
                    <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        {data.description}
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            to="/resume-grader"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                        >
                            <Target size={17} />
                            <span>Scan Your Resume Free</span>
                            <ArrowRight size={17} />
                        </Link>
                        <Link
                            to="/builder"
                            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 shadow-xs"
                        >
                            <Sparkles size={16} className="text-indigo-600" />
                            <span>Open Resume Studio</span>
                        </Link>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-3 bg-slate-50 px-6 py-4 border-b border-slate-200 text-xs font-black uppercase tracking-wider">
                        <div className="text-slate-500">Feature</div>
                        <div className="text-indigo-600 text-center">ATSense</div>
                        <div className="text-slate-500 text-center">{data.name}</div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {data.rows.map((r, i) => (
                            <div key={i} className="grid grid-cols-3 px-6 py-4 items-center text-xs sm:text-sm gap-3">
                                <div className="font-bold text-slate-900">{r.feature}</div>
                                <div className="text-center">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs">
                                        <Check size={13} /> {r.atsense}
                                    </span>
                                </div>
                                <div className="text-center text-slate-500 font-medium flex items-center justify-center gap-1.5">
                                    <X size={13} className="text-rose-500 shrink-0 hidden sm:inline" />
                                    <span>{r.competitor}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Switch CTA */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200 text-center space-y-4 shadow-sm">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        <Zap size={14} /> Ready in 10 Seconds
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                        Why Pay Monthly When ATSense Does More for Free?
                    </h2>
                    <p className="text-sm text-slate-600 max-w-xl mx-auto">
                        Upload your existing PDF or DOCX resume to get an instant ATS diagnostic score and 1-click Deep Tailoring.
                    </p>
                    <Link
                        to="/builder"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-slate-800 transition-colors"
                    >
                        <span>Try ATSense Studio Free</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
