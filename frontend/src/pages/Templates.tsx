import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutTemplate, ChevronRight, Target } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../services/api';

const DEFAULT_TEMPLATES = [
    {
        id: 'harvard-default',
        name: 'The Harvard Resume Template',
        slug: 'harvard-resume-template',
        description: 'The classic, highly-parsable ATS safe template. Preferred by top-tier universities, investment banks, and Fortune 500 recruiters.',
    },
    {
        id: 'executive-default',
        name: 'The Executive Clean Template',
        slug: 'executive-resume-template',
        description: 'A modern, clean sans-serif alternative with robust typographic hierarchy. Best for mid-to-senior level roles and tech companies.',
    }
];

const INDUSTRY_TEMPLATES = [
    { id: 'se', name: 'Software Engineer Resume', slug: 'software-engineer', description: 'Optimized for ATS with tech stacks, GitHub links, and impact metrics. Trusted by FAANG candidates.' },
    { id: 'pm', name: 'Product Manager Resume', slug: 'product-manager', description: 'Showcase product launches, growth metrics, and cross-functional leadership for PM roles.' },
    { id: 'ds', name: 'Data Scientist Resume', slug: 'data-scientist', description: 'Highlight ML models, statistical skills, and data pipelines for top analytics roles.' },
    { id: 'mm', name: 'Marketing Manager Resume', slug: 'marketing-manager', description: 'Stand out with campaign ROI, brand strategy, and growth hacking skills for marketing roles.' },
    { id: 'nr', name: 'Nurse Resume', slug: 'nurse', description: 'Clearly communicate clinical certifications, specializations, and patient care experience.' },
];

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "Are these resume templates ATS-friendly?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every ATSense template is designed from the ground up to be 100% ATS-compatible, using clean formatting, standard headings, and no tables or graphics that trip up parsers." } },
        { "@type": "Question", "name": "Can I customize the template with my own content?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. Select any template and our AI Resume Builder will help you fill it in, optimize your content, and tailor it to any job description." } },
    ]
};

export default function Templates() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
            <SEO
                title="Free ATS Resume Templates — By Industry & Role"
                description="Browse ATS-optimized resume templates for Software Engineers, Product Managers, Nurses, Data Scientists, and more. Free, instant, and recruiter-approved."
                keywords="ats resume templates, free resume templates, resume template by industry, software engineer resume template, nurse resume template"
                url="https://atsense.online/templates"
                schemas={[faqSchema]}
            />
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-4">
                        Premium Resume <span className="text-indigo-600">Templates</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                        Select a professionally designed, ATS-compliant template to start building your career-defining resume.
                    </p>
                    <Link to="/resume-grader" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm border border-indigo-100 hover:bg-indigo-100 transition-colors">
                        <Target size={14} /> Free ATS Score Checker →
                    </Link>
                </div>

                {/* Premium Templates - Now at the Top */}
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-wide mb-8">Premium Formats</h2>

                {loading ? (
                    <div className="flex justify-center items-center py-20 mb-12">
                        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 mb-20">
                        {[...DEFAULT_TEMPLATES, ...templates].map((tpl, i) => {
                            const gradients = [
                                'from-blue-600 to-indigo-600',
                                'from-indigo-600 to-purple-600',
                                'from-purple-600 to-pink-600',
                                'from-emerald-600 to-teal-600'
                            ];
                            const gradient = gradients[i % gradients.length];

                            return (
                                <div 
                                    key={tpl.id}
                                    className="group relative bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all duration-500 flex flex-col h-full"
                                >
                                    {/* Template Preview Section */}
                                    <div className={`h-64 bg-gradient-to-br ${gradient} p-8 flex items-center justify-center relative overflow-hidden`}>
                                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                                        <div className="relative z-10 w-40 h-52 bg-white/90 backdrop-blur-md rounded-lg shadow-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500 border border-white/50 flex flex-col p-4 space-y-3">
                                            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="w-2/3 h-2 bg-gray-100 rounded"></div>
                                            <div className="space-y-2 mt-4">
                                                <div className="w-full h-1.5 bg-gray-50 rounded"></div>
                                                <div className="w-full h-1.5 bg-gray-50 rounded"></div>
                                                <div className="w-full h-1.5 bg-gray-50 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Details Section */}
                                    <div className="p-10 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`p-2 rounded-xl bg-gray-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors`}>
                                                <LayoutTemplate size={20} />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ATS Compliance: 100%</span>
                                        </div>
                                        
                                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">{tpl.name}</h3>
                                        <p className="text-gray-500 leading-relaxed mb-8 font-medium text-[15px]">
                                            {tpl.description}
                                        </p>
                                        
                                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                                            <Link to={`/templates/${tpl.slug}`} className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors inline-flex items-center gap-2">
                                                View Details <ChevronRight size={16} />
                                            </Link>
                                            <Link to={`/template-builder?template=${tpl.slug.includes('harvard') ? 'harvard' : tpl.slug.includes('executive') ? 'executive' : tpl.slug}`} className="px-5 py-2.5 bg-gray-900 text-white group-hover:bg-indigo-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md group-hover:shadow-indigo-500/30">
                                                Use Template
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Industry-Specific Templates - Now below */}
                <div className="mb-20">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-wide mb-8 font-sans">Browse By Industry</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {INDUSTRY_TEMPLATES.map((tpl) => (
                            <Link key={tpl.id} to={`/templates/${tpl.slug}`} className="group bg-white border border-gray-100 shadow-sm rounded-3xl p-6 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 transition-colors">
                                        <LayoutTemplate size={18} className="text-indigo-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">100% ATS Safe</span>
                                </div>
                                <h3 className="font-black text-gray-900 text-lg mb-3 group-hover:text-indigo-600 transition-colors">{tpl.name}</h3>
                                <p className="text-gray-500 text-[14px] leading-relaxed line-clamp-2 mb-6 font-medium">{tpl.description}</p>
                                <div className="flex items-center text-indigo-600 text-sm font-extrabold uppercase tracking-wider">
                                    View Template <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {!loading && templates.length === 0 && DEFAULT_TEMPLATES.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white border border-dashed border-gray-200 rounded-3xl">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                            <LayoutTemplate size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Templates Available Yet</h3>
                        <p className="text-gray-500 font-medium max-w-sm">
                            We're currently designing new premium templates. Please check back later or contact support.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
