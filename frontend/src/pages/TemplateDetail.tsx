import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, ChevronRight, Sparkles, Star, Download, LayoutTemplate } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../services/api';

// Industry-specific SEO data for programmatic pages
const INDUSTRY_DATA: Record<string, {
    title: string;
    headline: string;
    description: string;
    keywords: string;
    tips: string[];
    skills: string[];
    jobTitles: string[];
}> = {
    'software-engineer': {
        title: 'Software Engineer Resume Template',
        headline: 'Land Your Dream Software Engineer Job',
        description: 'ATS-optimized Software Engineer resume template. Highlight your tech stack, GitHub contributions, and system design skills to beat automated screening.',
        keywords: 'software engineer resume template, developer resume, ats resume template for developers, coding resume',
        tips: ['Lead with your tech stack prominently in a Skills section', 'Quantify impact: "Reduced API latency by 40%"', 'Link to GitHub profile and key open-source contributions', 'Include system design or architecture achievements for senior roles'],
        skills: ['JavaScript / TypeScript', 'React / Next.js', 'Node.js / Python', 'AWS / GCP / Azure', 'Microservices', 'REST APIs', 'SQL / NoSQL', 'CI/CD'],
        jobTitles: ['Software Engineer', 'Full Stack Developer', 'Backend Engineer', 'Frontend Developer', 'Site Reliability Engineer'],
    },
    'product-manager': {
        title: 'Product Manager Resume Template',
        headline: 'Build a PM Resume That Gets Interviews',
        description: 'ATS-optimized Product Manager resume template. Showcase your product launches, user growth metrics, and cross-functional leadership to stand out.',
        keywords: 'product manager resume template, PM resume, ats resume product manager, product management cv',
        tips: ['Lead with a strong summary focused on product impact', 'Quantify outcomes: "Grew DAU by 35% in Q3"', 'Highlight cross-functional leadership and stakeholder management', 'Show product lifecycle ownership from ideation to launch'],
        skills: ['Product Roadmapping', 'A/B Testing', 'User Research', 'SQL / Analytics', 'Agile / Scrum', 'Jira', 'Figma', 'OKR Planning'],
        jobTitles: ['Product Manager', 'Senior PM', 'Group PM', 'Director of Product', 'VP of Product'],
    },
    'data-scientist': {
        title: 'Data Scientist Resume Template',
        headline: 'Get Hired as a Data Scientist Faster',
        description: 'ATS-optimized Data Scientist resume template. Highlight your ML models, statistical analysis, and data pipeline experience to attract top tech companies.',
        keywords: 'data scientist resume template, machine learning resume, ats resume data science, analytics cv',
        tips: ['List ML frameworks prominently (TensorFlow, PyTorch, scikit-learn)', 'Quantify model performance: "95% accuracy on classification task"', 'Include Kaggle rank or notable research publications', 'Showcase end-to-end project ownership from data ingestion to deployment'],
        skills: ['Python / R', 'Machine Learning', 'TensorFlow / PyTorch', 'SQL / Spark', 'Statistics', 'Data Visualization', 'NLP', 'A/B Testing'],
        jobTitles: ['Data Scientist', 'ML Engineer', 'Data Analyst', 'Research Scientist', 'AI Engineer'],
    },
    'marketing-manager': {
        title: 'Marketing Manager Resume Template',
        headline: 'A Resume That Converts for Marketing Roles',
        description: 'ATS-optimized Marketing Manager resume template. Showcase your campaign ROI, growth metrics, and brand strategy experience to stand out to hiring managers.',
        keywords: 'marketing manager resume template, marketing cv, ats resume marketing, digital marketing resume',
        tips: ['Lead with campaign ROI and channel growth metrics', 'Highlight multichannel expertise (SEO, SEM, Social, Email)', 'Showcase brand awareness or lead generation results', 'Include tools used: HubSpot, GA4, Salesforce, etc.'],
        skills: ['Digital Marketing', 'SEO / SEM', 'Content Strategy', 'Google Analytics', 'HubSpot / Salesforce', 'Email Marketing', 'Paid Ads (Meta/Google)', 'A/B Testing'],
        jobTitles: ['Marketing Manager', 'Growth Marketer', 'Digital Marketing Manager', 'Brand Manager', 'Content Marketing Lead'],
    },
    'nurse': {
        title: 'Nurse Resume Template',
        headline: 'A Professional Nursing Resume That Gets Noticed',
        description: 'ATS-optimized Nurse resume template. Clearly communicate your specializations, certifications, and clinical experience to land your ideal nursing position.',
        keywords: 'nurse resume template, nursing cv, ats resume for nurses, registered nurse resume',
        tips: ['List all certifications prominently (RN, CNA, ACLS, PALS)', 'Specify clinical settings: ICU, ER, NICU, Pediatrics etc.', 'Detail patient ratios and volume where possible', 'Highlight EHR systems used: Epic, Cerner, Meditech'],
        skills: ['Patient Care', 'Electronic Health Records', 'ICU / Critical Care', 'Medication Administration', 'ACLS / BLS Certified', 'Care Planning', 'Patient Education', 'IV Therapy'],
        jobTitles: ['Registered Nurse', 'Charge Nurse', 'Critical Care RN', 'Travel Nurse', 'Nurse Practitioner'],
    },
    'harvard-resume-template': {
        title: 'Harvard Resume Template — ATS Optimized',
        headline: 'The Classic Harvard Resume Format',
        description: 'The Harvard resume format is the gold standard for ATS compliance. Used by top university graduates and Fortune 500 candidates — simple, clean, and recruiter-approved.',
        keywords: 'harvard resume template, harvard cv format, ats optimized resume, professional resume template',
        tips: ['Use a clean, single-column layout for maximum ATS compatibility', 'Keep font size 10–12pt with clear section headings', 'List experience in reverse chronological order', 'Avoid tables, columns, images, and fancy formatting'],
        skills: ['Clear Communication', 'Leadership', 'Analytical Thinking', 'Problem Solving', 'Teamwork', 'Project Management'],
        jobTitles: ['Any Professional Role', 'Finance / Banking', 'Consulting', 'Law', 'Management'],
    },
    'executive-resume-template': {
        title: 'Executive Clean Resume Template — ATS Ready',
        headline: 'A Modern Executive Resume That Stands Out',
        description: 'A sleek executive resume template with clean typography and subtle design — optimized for ATS while impressing senior-level hiring committees.',
        keywords: 'executive resume template, senior resume template, professional cv, ats resume format, clean resume',
        tips: ['Lead with a compelling executive summary highlighting 2–3 signature achievements', 'Quantify leadership impact: "Led a 200-person engineering org"', 'Focus on P&L ownership, board experience, and revenue growth', 'Keep personal branding consistent with your LinkedIn profile'],
        skills: ['Executive Leadership', 'P&L Ownership', 'Strategic Planning', 'Board Reporting', 'M&A', 'Talent Development', 'Operations', 'Fundraising'],
        jobTitles: ['VP of Engineering', 'CTO', 'COO', 'Director of Operations', 'Head of Product'],
    },
};

const RELATED: Record<string, string[]> = {
    'software-engineer': ['data-scientist', 'product-manager'],
    'product-manager': ['marketing-manager', 'software-engineer'],
    'data-scientist': ['software-engineer', 'product-manager'],
    'marketing-manager': ['product-manager', 'nurse'],
    'nurse': ['marketing-manager', 'data-scientist'],
    'harvard-resume-template': ['executive-resume-template', 'software-engineer'],
    'executive-resume-template': ['harvard-resume-template', 'product-manager'],
};

// HowTo schema for rich results
function buildHowToSchema(data: typeof INDUSTRY_DATA[string]) {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to Write a ${data.title.replace(' Template', '')}`,
        "description": data.description,
        "step": data.tips.map((tip, i) => ({
            "@type": "HowToStep",
            "position": i + 1,
            "name": tip.split(':')[0] || `Step ${i + 1}`,
            "text": tip,
        }))
    };
}

export default function TemplateDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [backendTemplate, setBackendTemplate] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const res = await api.get(`/templates`);
                const found = res.data.find((t: any) => t.slug === slug);
                setBackendTemplate(found || null);
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        };
        fetchTemplate();
    }, [slug]);

    const data = slug ? INDUSTRY_DATA[slug] : null;
    const related = slug ? (RELATED[slug] || []) : [];

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    const templateName = backendTemplate?.name || data?.title || `${slug?.replace(/-/g, ' ')} Resume Template`;
    const templateDesc = backendTemplate?.description || data?.description || 'A professionally designed, ATS-optimized resume template.';

    return (
        <div className="bg-white min-h-screen font-sans">
            {data && (
                <SEO
                    title={data.title}
                    description={data.description}
                    keywords={data.keywords}
                    url={`https://atsense.online/templates/${slug}`}
                    schemas={[buildHowToSchema(data)]}
                />
            )}

            {/* Breadcrumb */}
            <div className="pt-24 pb-0 px-4 sm:px-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-8">
                    <Link to="/templates" className="hover:text-slate-900 flex items-center gap-1"><ArrowLeft size={14} /> Templates</Link>
                    <ChevronRight size={13} className="text-slate-300" />
                    <span className="text-slate-900">{templateName}</span>
                </div>
            </div>

            {/* Hero */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid md:grid-cols-2 gap-16 items-start">
                    {/* Preview Card */}
                    <div className="sticky top-28">
                        <div className="aspect-[3/4] bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200/60 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                            <div className="relative z-10 w-48 h-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl flex flex-col p-5 space-y-3 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="w-full h-5 bg-slate-200 rounded animate-pulse" />
                                <div className="w-1/2 h-3 bg-slate-100 rounded" />
                                <div className="border-t border-slate-100 pt-3 space-y-2">
                                    <div className="w-full h-2 bg-slate-100 rounded" />
                                    <div className="w-full h-2 bg-slate-100 rounded" />
                                    <div className="w-4/5 h-2 bg-slate-100 rounded" />
                                </div>
                                <div className="border-t border-slate-100 pt-3 space-y-2">
                                    <div className="w-full h-2 bg-slate-100 rounded" />
                                    <div className="w-full h-2 bg-slate-100 rounded" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-slate-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                            <span className="font-semibold text-slate-700">4.9 / 5.0</span>
                            <span className="text-slate-400">·  1,200+ downloads</span>
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100">
                            <CheckCircle size={12} />
                            ATS Compliance: 100%
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4 leading-tight">{data?.headline || templateName}</h1>
                        <p className="text-slate-600 text-lg leading-relaxed mb-8">{templateDesc}</p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-10">
                            <Link 
                                to={slug?.includes('harvard') ? '/template-builder?template=harvard' : slug?.includes('executive') ? '/template-builder?template=executive' : '/builder'} 
                                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 text-sm uppercase tracking-wider"
                            >
                                <Sparkles size={16} />
                                Use This Template
                            </Link>
                            <Link to="/resume-grader" className="flex items-center justify-center gap-2 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 font-bold py-4 px-6 rounded-2xl transition-all text-sm uppercase tracking-wider">
                                <Download size={16} />
                                Check My Score
                            </Link>
                        </div>

                        {/* Key Skills */}
                        {data && (
                            <div className="mb-8">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Key Skills for This Role</h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.map(skill => (
                                        <span key={skill} className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Writing Tips */}
                        {data && (
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Resume Writing Tips</h3>
                                <ul className="space-y-3">
                                    {data.tips.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                            <CheckCircle size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Related Templates */}
            {related.length > 0 && (
                <div className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">Related Templates</h2>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {related.map(relSlug => {
                                const relData = INDUSTRY_DATA[relSlug];
                                if (!relData) return null;
                                return (
                                    <Link key={relSlug} to={`/templates/${relSlug}`} className="group bg-white border border-slate-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-indigo-50 rounded-xl">
                                                <LayoutTemplate size={18} className="text-indigo-600" />
                                            </div>
                                            <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{relData.title}</span>
                                        </div>
                                        <p className="text-slate-500 text-sm line-clamp-2">{relData.description}</p>
                                        <div className="flex items-center gap-1 mt-4 text-indigo-600 text-sm font-semibold">
                                            View Template <ChevronRight size={14} />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
