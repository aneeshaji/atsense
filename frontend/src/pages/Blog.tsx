import { useState } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const Blog = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-gray-50 min-h-screen">
            <SEO
                title="Career Blog - Resume Tips, ATS Guides & Job Advice"
                description="Expert advice on resume optimization, beating ATS algorithms, LinkedIn profiles, and career growth. Stay updated with the latest job search strategies."
                url="https://atsense.online/blog"
            />
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50 to-transparent pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium text-sm mb-6">
                            <Sparkles size={14} />
                            <span>Career Insights & Tips</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                            Master your job search with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">expert career advice.</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                            Discover the latest strategies for resume optimization, interview prep, and salary negotiation.
                        </p>

                        <div className="relative max-w-lg">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm shadow-sm transition-shadow hover:shadow-md"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.id}`}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="h-52 bg-gray-100 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${post.id % 3 === 0 ? 'from-purple-100 to-indigo-50' :
                                        post.id % 2 === 0 ? 'from-blue-50 to-cyan-50' :
                                            'from-indigo-50 to-pink-50'
                                        }`}></div>

                                    {/* Abstract Pattern overlay */}
                                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm border border-white/50">
                                            {post.category}
                                        </span>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="bg-white/30 backdrop-blur-sm p-3 rounded-full text-indigo-600 shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                                            <ArrowRight size={24} />
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center text-xs text-gray-500 mb-3 gap-2 font-medium">
                                        <span>{post.date}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span>{post.author}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
                                        <span className="text-indigo-600 font-semibold group-hover:underline">Read Article</span>
                                        <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
                        <p className="mt-2 text-gray-500">We couldn't find any articles matching your search.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All') }}
                            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
