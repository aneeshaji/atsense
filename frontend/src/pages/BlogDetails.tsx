import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, Linkedin, Twitter, Bookmark } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';

const BlogDetails = () => {
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === Number(id));

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    // Mock related posts (excluding current one)
    const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 3);

    return (
        <div className="bg-white min-h-screen pb-20">
            <SEO
                title={post.title}
                description={post.excerpt}
                url={`https://atsense.online/blog/${post.id}`}
            />
            {/* Header/Hero */}
            <div className="bg-gray-50 border-b border-gray-100 pt-20 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/blog" className="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors mb-8 group font-medium text-sm">
                        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Blog
                    </Link>

                    <div className="space-y-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide">
                            {post.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white">
                                    {post.author.charAt(0)}
                                </div>
                                <span className="font-medium text-gray-900">{post.author}</span>
                            </div>
                            <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></span>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                {post.date}
                            </div>
                            <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></span>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                5 min read
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-8 lg:col-start-3">
                    <article className="prose prose-lg prose-indigo max-w-none text-gray-700 leading-relaxed font-newsreader">
                        {/* Drop cap for first paragraph logic would go here in CSS usually */}
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </article>

                    {/* Author Bio Box */}
                    <div className="mt-16 bg-gray-50 rounded-2xl p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left border border-gray-100">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                            {post.author.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">About {post.author}</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Senior Career Strategist and Resume Expert. Passionate about helping professionals unlock their potential and land their dream jobs through actionable advice.
                            </p>
                            <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-800 transition-colors">
                                View all articles
                            </button>
                        </div>
                    </div>

                    {/* Share Actions */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4 text-center">Share this article</h4>
                        <div className="flex justify-center gap-4">
                            <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                                <Twitter size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors">
                                <Linkedin size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <Share2 size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <Bookmark size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Articles Strip */}
            <div className="mt-24 border-t border-gray-100 bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Read next</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedPosts.map(related => (
                            <Link key={related.id} to={`/blog/${related.id}`} className="group block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all hover:-translate-y-1">
                                <span className="text-xs font-bold text-indigo-600 mb-2 block">{related.category}</span>
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {related.title}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{related.excerpt}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
