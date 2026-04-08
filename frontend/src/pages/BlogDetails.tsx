import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, Linkedin, Twitter, Bookmark, User, Tag, Sparkles, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import api from '../services/api';
import parse from 'html-react-parser';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/posts/${id}`);
                setPost(res.data);
                
                const allRes = await api.get('/posts');
                const others = allRes.data.filter((p: any) => p.slug !== id && p.id !== parseInt(id as string)).slice(0, 3);
                setRelatedPosts(others);
            } catch (err) {
                console.error('Failed to fetch post details:', err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchPost();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-white pt-32 text-center px-4">
                <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
                        <Sparkles className="text-slate-300" size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Article not found</h1>
                    <p className="text-slate-500 mb-8 font-medium">The resource you're looking for might have been moved or is currently being updated by our team.</p>
                    <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                        <ArrowLeft size={18} /> Back to Library
                    </Link>
                </div>
            </div>
        );
    }

    const postDate = new Date(post.created_at).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });

    return (
        <div className="bg-white min-h-screen pb-20 font-sans">
            <SEO
                title={post.meta_title || post.title}
                description={post.meta_description || post.excerpt}
                url={`https://atsense.online/blog/${post.slug || post.id}`}
                type="article"
            />
            
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-20 z-40 py-3 hidden md:block">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Link to="/blog" className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                        <ArrowLeft size={14} /> Back to Blog
                    </Link>
                    <div className="text-slate-400 text-xs font-bold truncate max-w-md">
                        Reading: <span className="text-slate-900 ml-1">{post.title}</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50/50 pt-16 pb-16 border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
                    <div className="mb-8">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.15em] border border-indigo-100 shadow-sm">
                            <Tag size={12} /> {post.category || 'Expert Insight'}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500 text-xs font-bold uppercase tracking-wider mb-12">
                        <div className="flex items-center gap-2.5 bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-100">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white scale-90">
                                <User size={14} />
                            </div>
                            <span className="text-slate-900">ATSense Expert</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>{postDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>~6 MIN READ</span>
                        </div>
                    </div>
                    
                    {post.cover_image && (
                        <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl mb-12 border border-slate-100 relative">
                            <div className="absolute inset-0 bg-slate-900/10 pointer-events-none z-10"></div>
                            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                    <div className="lg:col-span-1 hidden lg:block">
                        <div className="sticky top-40 space-y-12">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Spread the word</h4>
                                <div className="flex flex-col gap-3">
                                    <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-all flex items-center justify-center border border-slate-100">
                                        <Twitter size={18} />
                                    </button>
                                    <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center border border-slate-100">
                                        <Linkedin size={18} />
                                    </button>
                                    <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center border border-slate-100">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
                                    <Sparkles className="text-indigo-400 mb-4" size={24} />
                                    <h5 className="font-black text-sm mb-2">Resume Score: 98%</h5>
                                    <p className="text-[11px] text-slate-400 leading-relaxed mb-4">Want to pass the ATS filter like a pro? Check your resume score now.</p>
                                    <Link to="/resume-grader" className="block w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-center text-[10px] font-black uppercase tracking-widest transition-colors">
                                        Test Free
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <p className="text-xl text-slate-600 leading-relaxed font-medium mb-12 border-l-4 border-indigo-500 pl-8 italic">
                            {post.excerpt}
                        </p>

                        <article className="blog-content prose prose-slate prose-lg lg:prose-xl max-w-none 
                            prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900
                            prose-li:text-slate-600 prose-a:text-indigo-600 lg:prose-p:text-lg">
                            {parse(post.content || '')}
                        </article>

                        <div className="mt-20 pt-12 border-t border-slate-100">
                            <div className="bg-slate-50 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                <div className="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                                    <User size={32} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">ATSense Excellence Team</h3>
                                            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Career Strategy & AI Ethics</p>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                        Our content is crafted by a specialized team of recruitment veterans and AI engineers to ensure you get the absolute best, most up-to-date career advice for the 2025 job market.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-4 mt-12 py-8 border-y border-slate-100 lg:hidden">
                             <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600"><Twitter size={14} /> Tweet</button>
                             <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600"><Linkedin size={14} /> Share</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 py-24 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-4">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-black text-slate-900 mb-2">Continue Reading</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Broaden your career intelligence</p>
                        </div>
                        <Link to="/blog" className="text-indigo-600 font-black text-sm hover:underline underline-offset-4">Browse All →</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedPosts.map(related => (
                            <Link key={related.id} to={`/blog/${related.slug || related.id}`} className="group bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                                <span className="inline-block px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-6 w-fit">
                                    {related.category || 'Article'}
                                </span>
                                <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
                                    {related.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-8 flex-1">{related.excerpt}</p>
                                <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mt-auto">
                                    Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
