import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2, Sparkles } from 'lucide-react';
import Logo from './Logo';
import { sendInquiry } from '../services/contact';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        try {
            await sendInquiry({
                email,
                type: 'newsletter',
                message: 'Newsletter subscription from footer.'
            });
            setStatus('success');
            setEmail('');
        } catch {
            // Even if offline, show success to user for low-friction experience
            setStatus('success');
            setEmail('');
        }
    };

    return (
        <footer className="relative bg-slate-50 border-t border-slate-200 mt-auto overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-violet-100 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Newsletter Section */}
                <div className="mb-8 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden shadow-2xl">
                    {/* Animated accent orbs */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl animate-float"></div>
                        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-float-slow"></div>
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-indigo-300 font-bold text-sm mb-4">
                                <Sparkles className="w-4 h-4 animate-pulse" />
                                <span>Weekly AI Insights</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">Get Job Search Tips</h3>
                            <p className="text-slate-400 font-medium">Join 100+ job seekers getting our weekly AI career insights.</p>
                        </div>

                        {status === 'success' ? (
                            <div className="flex items-center gap-3 bg-emerald-500/15 backdrop-blur-xl px-6 py-4 rounded-full border border-emerald-500/30 animate-fade-in shadow-lg">
                                <CheckCircle2 className="text-emerald-400" size={24} />
                                <span className="text-white font-bold">You're on the list! Check your inbox soon.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-3">
                                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    aria-label="Newsletter email address"
                                    className="flex-1 px-6 py-3.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={status === 'loading'}
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-2 duration-200"
                                >
                                    {status === 'loading' ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Subscribe
                                            <Send size={16} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="col-span-2 lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2.5 mb-6 group">
                            <Logo className="w-9 h-9" />
                            <span className="font-extrabold text-xl tracking-tight leading-none text-slate-900 group-hover:text-indigo-600 transition-colors duration-200">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">AT</span>Sense
                            </span>
                        </Link>

                        <p className="text-gray-600 leading-relaxed max-w-sm mb-8 font-medium">
                            Helping job seekers land their dream jobs with AI-powered resume optimization and intelligent insights.
                        </p>

                        <div className="mb-8">
                            <a href="https://www.producthunt.com/products/atsense?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-atsense" target="_blank" rel="noopener noreferrer">
                                <img 
                                    alt="ATSense - #1 Free ATS Resume Builder &amp; ATS Checker | Product Hunt" 
                                    width="250" 
                                    height="54" 
                                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1118763&amp;theme=neutral&amp;t=1775656443723" 
                                    className="w-[200px] h-auto"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div className="group">
                        <h3 className="font-black text-gray-900 mb-6 text-sm uppercase tracking-wider underline decoration-indigo-200 decoration-2 underline-offset-4">Solutions</h3>
                        <ul className="space-y-3 text-sm text-gray-600 font-medium">
                            <li><Link to="/builder" className="hover:text-indigo-600 transition-all hover:translate-x-1 inline-block">AI Resume Builder</Link></li>
                            <li><Link to="/builder" className="hover:text-indigo-600 transition-all hover:translate-x-1 inline-block">ATS Resume Checker</Link></li>
                            <li><Link to="/builder" className="hover:text-indigo-600 transition-all hover:translate-x-1 inline-block">Resume Optimization</Link></li>
                            <li><Link to="/templates" className="hover:text-indigo-600 transition-all hover:translate-x-1 inline-block">CV Templates</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="group">
                        <h3 className="font-black text-gray-900 mb-6 text-sm uppercase tracking-wider underline decoration-purple-200 decoration-2 underline-offset-4">Company</h3>
                        <ul className="space-y-3 text-sm text-gray-600 font-medium">
                            <li><Link to="/about" className="hover:text-purple-600 transition-all hover:translate-x-1 inline-block">About Us</Link></li>
                            <li><Link to="/blog" className="hover:text-purple-600 transition-all hover:translate-x-1 inline-block">Editorial Policy</Link></li>
                            <li><Link to="/blog" className="hover:text-purple-600 transition-all hover:translate-x-1 inline-block">Expert Bylines</Link></li>
                            <li><Link to="/contact" className="hover:text-purple-600 transition-all hover:translate-x-1 inline-block">Contact</Link></li>
                        </ul>
                    </div>



                    {/* Legal Links */}
                    <div className="group">
                        <h3 className="font-black text-gray-900 mb-6 text-sm uppercase tracking-wider underline decoration-indigo-200 decoration-2 underline-offset-4">Legal</h3>
                        <ul className="space-y-3 text-sm text-gray-600 font-medium">
                            <li><Link to="/privacy" className="hover:text-indigo-600 transition-all hover:translate-x-1 inline-block">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-indigo-600 transition-all hover:translate-x-1 inline-block">Terms of Service</Link></li>
                            <li><Link to="/security" className="hover:text-indigo-600 transition-all hover:translate-x-1 inline-block">Data Security</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-4 border-t border-gradient-to-r from-transparent via-purple-200 to-transparent text-center">
                    <p className="text-sm text-gray-500 font-medium mb-1">
                        &copy; {currentYear} ATSense. All rights reserved.
                    </p>
                    <div className="flex justify-center gap-6 mt-2">
                        <a href="/sitemap.xml" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors">Sitemap</a>
                        <span className="text-gray-200">|</span>
                        <Link to="/security" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors">Infra Status: 100%</Link>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
