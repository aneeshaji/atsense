import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Send, CheckCircle2 } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        // Mock API call
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1200);
    };

    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Newsletter Section */}
                <div className="mb-16 p-8 rounded-[2rem] bg-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-bold text-white mb-2">Get Job Search Tips</h3>
                            <p className="text-indigo-100 font-medium">Join 10,000+ job seekers getting our weekly AI career insights.</p>
                        </div>

                        {status === 'success' ? (
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 animate-fade-in">
                                <CheckCircle2 className="text-green-400" size={24} />
                                <span className="text-white font-bold">You're on the list! Check your inbox soon.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    className="flex-1 px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={status === 'loading'}
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="px-6 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {status === 'loading' ? (
                                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Subscribe
                                            <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-2 lg:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span className="font-bold text-2xl text-gray-900 tracking-tight">ATSense</span>
                        </Link>

                        <p className="text-gray-500 text-lg leading-relaxed max-w-sm mb-8 font-medium">
                            Helping job seekers land their dream jobs with AI-powered resume optimization and intelligent insights.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-gray-100">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Product</h3>
                        <ul className="space-y-4 text-sm text-gray-600 font-medium">
                            <li><Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Resumes</Link></li>
                            <li><Link to="/cover-letters" className="hover:text-indigo-600 transition-colors">Cover Letters</Link></li>
                            <li><Link to="/job-matcher" className="hover:text-indigo-600 transition-colors">Job Matcher</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Company</h3>
                        <ul className="space-y-4 text-sm text-gray-600 font-medium">
                            <li><Link to="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
                            <li><Link to="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
                            <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Legal</h3>
                        <ul className="space-y-4 text-sm text-gray-600 font-medium">
                            <li><Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link></li>
                            <li><Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link></li>
                            <li><Link to="/security" className="hover:text-indigo-600 transition-colors">Security</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-100">
                    <p className="text-center text-sm text-gray-400 font-medium">
                        &copy; {currentYear} ATSense Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
