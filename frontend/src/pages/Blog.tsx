import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, BookOpen, Target, Linkedin, FileText, Briefcase } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../services/api';

// Static resource guides that always appear even with no backend posts
const STATIC_GUIDES = [
    {
        id: 'guide-ats',
        title: 'How to Beat an ATS in 2025: The Complete Guide',
        excerpt: 'Learn exactly how Applicant Tracking Systems parse and score your resume — and the 7 proven strategies to ensure your resume always makes it to a human recruiter.',
        category: 'ATS Tips',
        readTime: '8 min read',
        icon: Target,
        color: 'from-indigo-500 to-purple-500',
        slug: '/guides/guide-ats',
    },
    {
        id: 'guide-linkedin',
        title: 'Optimize Your LinkedIn Profile for Recruiter Searches',
        excerpt: 'Recruiters use LinkedIn every single day to find candidates. Here\'s how to ensure your profile ranks at the top of their searches with keyword optimization and strategic positioning.',
        category: 'LinkedIn',
        readTime: '6 min read',
        icon: Linkedin,
        color: 'from-blue-500 to-cyan-500',
        slug: '/guides/guide-linkedin',
    },
    {
        id: 'guide-resume',
        title: 'Writing a Resume That Gets 3x More Interviews',
        excerpt: 'The single biggest mistake most candidates make is writing a resume for humans. Here\'s how to write one that passes the ATS filter and then impresses the recruiter.',
        category: 'Resume Writing',
        readTime: '10 min read',
        icon: FileText,
        color: 'from-emerald-500 to-teal-500',
        slug: '/guides/guide-resume',
    },
    {
        id: 'guide-cover-letter',
        title: 'How to Write a Cover Letter That Actually Gets Read',
        excerpt: 'Most cover letters are ignored. This guide shows you how to write a compelling, personalized cover letter that complements your resume and gets noticed by hiring managers.',
        category: 'Cover Letters',
        readTime: '5 min read',
        icon: BookOpen,
        color: 'from-amber-500 to-orange-500',
        slug: '/guides/guide-cover-letter',
    },
    {
        id: 'guide-job-search',
        title: 'The 2025 Job Search Strategy: From Application to Offer',
        excerpt: 'A step-by-step system for organizing your job search, tracking applications, nailing interviews, and negotiating a salary 20–30% higher than the initial offer.',
        category: 'Job Search',
        readTime: '12 min read',
        icon: Briefcase,
        color: 'from-rose-500 to-pink-500',
        slug: '/guides/guide-job-search',
    },
    {
        id: 'guide-interview',
        title: 'The STAR Method: Answering Behavioral Interview Questions',
        excerpt: 'Behavioral interviews trip up even the most qualified candidates. Master the Situation, Task, Action, Result framework to structure compelling answers every time.',
        category: 'Interview Prep',
        readTime: '7 min read',
        icon: Sparkles,
        color: 'from-violet-500 to-purple-500',
        slug: '/guides/guide-interview',
    },
];

const CATEGORIES = ['All', 'ATS Tips', 'Resume Writing', 'LinkedIn', 'Cover Letters', 'Job Search', 'Interview Prep'];

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "How do I beat ATS resume screening?", "acceptedAnswer": { "@type": "Answer", "text": "Use a clean single-column layout, include keywords from the job description, use standard section headings (Experience, Education, Skills), and avoid tables, graphics, and headers/footers." } },
        { "@type": "Question", "name": "What is an ATS score?", "acceptedAnswer": { "@type": "Answer", "text": "An ATS score is a match percentage showing how well your resume matches the keywords and requirements in a specific job description. Higher scores mean a greater chance of reaching a human recruiter." } },
        { "@type": "Question", "name": "How long should a resume be in 2025?", "acceptedAnswer": { "@type": "Answer", "text": "For most professionals, one page is ideal for under 10 years of experience. Two pages are acceptable for senior-level candidates. Anything beyond that should be trimmed unless you are an academic or researcher." } },
    ]
};

const Blog = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/posts');
                setBlogPosts(res.data);
            } catch (err) {
                console.error('Failed to fetch blog posts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const filteredGuides = STATIC_GUIDES.filter(guide => {
        const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guide.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || guide.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

    return (
        <div className="bg-white min-h-screen font-sans">
            <SEO
                title="Career Resources — Resume Tips, ATS Guides & Job Advice"
                description="Expert guides on resume writing, ATS optimization, LinkedIn profiles, cover letters, and job search strategies. Updated for 2025."
                keywords="resume tips 2025, how to beat ats, ats resume guide, linkedin optimization, cover letter tips, job search strategy"
                url="https://atsense.online/blog"
                schemas={[faqSchema]}
            />

            {/* Hero */}
            <div className="bg-white border-b border-slate-100 pt-28 pb-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm mb-6 border border-indigo-100">
                            <BookOpen size={13} />
                            Career Resources Hub
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-5 leading-tight tracking-tight">
                            Land More Interviews<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">with Expert Career Guides</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
                            Free guides and strategies on ATS optimization, resume writing, LinkedIn, and job search — all written specifically for 2025.
                        </p>

                        {/* Search */}
                        <div className="relative max-w-lg">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm"
                                placeholder="Search guides and articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Static Expert Guides */}
                {filteredGuides.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Expert Guides</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGuides.map(guide => {
                                const Icon = guide.icon;
                                return (
                                    <Link
                                        key={guide.id}
                                        to={guide.slug}
                                        className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                    >
                                        {/* Color header */}
                                        <div className={`h-2 bg-gradient-to-r ${guide.color}`} />
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={`p-2 rounded-xl bg-gradient-to-br ${guide.color} text-white`}>
                                                    <Icon size={15} />
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                                                    <span>{guide.category}</span>
                                                    <span>·</span>
                                                    <span>{guide.readTime}</span>
                                                </div>
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 mb-3 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                {guide.title}
                                            </h3>
                                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                                                {guide.excerpt}
                                            </p>
                                            <div className="flex items-center text-indigo-600 text-sm font-bold mt-auto group-hover:gap-2 transition-all gap-1">
                                                Read Guide <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Backend Blog Posts */}
                {!loading && filteredPosts.length > 0 && (
                    <div>
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Latest Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    to={`/blog/${post.id}`}
                                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                >
                                    <div className="h-44 bg-gradient-to-br from-slate-100 to-indigo-50 relative flex items-center justify-center">
                                        <BookOpen size={32} className="text-indigo-200" />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                                                {post.category || 'Article'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <p className="text-xs text-slate-400 font-semibold mb-2">
                                            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <h3 className="text-base font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 flex-1 mb-4">{post.excerpt}</p>
                                        <div className="flex items-center text-indigo-600 text-sm font-bold mt-auto gap-1 group-hover:gap-2 transition-all">
                                            Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredGuides.length === 0 && filteredPosts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                            <Search className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No results found</h3>
                        <p className="mt-2 text-slate-500">Try a different search term or category.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* FAQ Section for SEO */}
                <div className="mt-20 pt-16 border-t border-slate-100">
                    <h2 className="text-2xl font-black text-slate-900 mb-8">Common Resume & Job Search Questions</h2>
                    <div className="space-y-4">
                        {faqSchema.mainEntity.map((faq, i) => (
                            <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-2">{faq.name}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
