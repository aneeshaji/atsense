import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, BookOpen, Target, Linkedin, FileText, Briefcase, Clock, Calendar, User } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../services/api';

const CATEGORIES = ['All', 'ATS Tips', 'Resume Writing', 'LinkedIn', 'Cover Letters', 'Job Search', 'Interview Prep'];

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "How do I beat ATS resume screening?", "acceptedAnswer": { "@type": "Answer", "text": "Use a clean single-column layout, include keywords from the job description, use standard section headings (Experience, Education, Skills), and avoid tables, graphics, and headers/footers." } },
        { "@type": "Question", "name": "What is an ATS score?", "acceptedAnswer": { "@type": "Answer", "text": "An ATS score is a match percentage showing how well your resume matches the keywords and requirements in a specific job description. Higher scores mean a greater chance of reaching a human recruiter." } },
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

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-white min-h-screen font-sans pb-20">
            <SEO
                title="Career Intelligence — Resume Tips, ATS Guides & Job Advice"
                description="Expert guides on resume writing, ATS optimization, LinkedIn profiles, and job search strategies. Updated for 2025."
                keywords="resume tips 2025, how to beat ats, ats resume guide, linkedin optimization"
                url="https://atsense.online/blog"
                schemas={[faqSchema]}
            />

            {/* Premium Blog Hero */}
            <div className="relative pt-32 pb-20 overflow-hidden bg-slate-900 border-b border-slate-800">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs mb-6 uppercase tracking-widest">
                        <Sparkles size={14} className="text-indigo-400" />
                        Career Intelligence Hub
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                        Insights to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-purple-400">Accelerate Your Career.</span>
                    </h1>
                    <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                        Expert-written strategies for the 2025 job market. Zero fluff. Just actionable advice to help you land more interviews and higher offers.
                    </p>

                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-slate-800 border border-slate-700/50 rounded-2xl p-1 shadow-2xl">
                            <Search className="absolute left-4 h-5 w-5 text-slate-500" />
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm font-medium"
                                placeholder="Search our expert database..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Modern Filter */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${selectedCategory === cat
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-slate-50 h-[450px] rounded-[2.5rem] animate-pulse border border-slate-100"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                            {filteredPosts.map((post, idx) => (
                                <Link
                                    key={post.id}
                                    to={`/blog/${post.slug || post.id}`}
                                    className="group relative flex flex-col bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all duration-500 hover:-translate-y-2 h-full"
                                >
                                    {/* Card Header with Icon/Visual */}
                                    <div className="h-48 bg-slate-50 p-8 flex items-center justify-center relative overflow-hidden shrink-0">
                                        <div className="absolute inset-0 opacity-40 pointer-events-none">
                                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${idx % 3 === 0 ? 'bg-indigo-200' : idx % 3 === 1 ? 'bg-purple-200' : 'bg-emerald-200'}`}></div>
                                        </div>
                                        <div className="relative z-10 w-16 h-16 rounded-2xl bg-white shadow-xl border border-slate-100 flex items-center justify-center text-indigo-600 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                            {post.category === 'ATS Tips' ? <Target size={28}/> : post.category === 'LinkedIn' ? <Linkedin size={28}/> : <FileText size={28}/>}
                                        </div>
                                        <div className="absolute top-6 left-6">
                                            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-800 shadow-sm uppercase tracking-widest border border-white/50">
                                                {post.category || 'Expert Insight'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-10 flex flex-col flex-1">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                            <Calendar size={12} />
                                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                            <span>·</span>
                                            <Clock size={12} />
                                            <span>6 MIN READ</span>
                                        </div>
                                        
                                        <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        
                                        <p className="text-slate-500 text-[15px] leading-relaxed line-clamp-3 mb-8 flex-1 font-medium">
                                            {post.excerpt}
                                        </p>

                                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-[10px]">
                                                    <User size={14} />
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-700">ATSense Expert</span>
                                            </div>
                                            <div className="flex items-center text-indigo-600 text-xs font-black uppercase tracking-widest group-hover:gap-2 transition-all gap-1">
                                                Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {filteredPosts.length === 0 && (
                            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl mb-6">
                                    <Search size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No results matched your search</h3>
                                <p className="text-slate-500 font-medium mb-8">Try adjusting your filters or search keywords to find what you're looking for.</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* FAQ SEO Section */}
                <div className="mt-32 pt-20 border-t border-slate-100">
                    <div className="grid md:grid-cols-3 gap-16">
                        <div className="md:col-span-1">
                            <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight tracking-tight">Career<br />Intelligence<br />Q&A</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">Our experts answer the most pressing questions job seekers face in today's competitive AI-driven recruitment landscape.</p>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            {faqSchema.mainEntity.map((faq, i) => (
                                <div key={i} className="group p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all">
                                    <h3 className="text-lg font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-all tracking-tight">{faq.name}</h3>
                                    <p className="text-slate-600 text-[15px] leading-relaxed font-medium">{faq.acceptedAnswer.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
