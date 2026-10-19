import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, FileText, Briefcase, Linkedin, LayoutTemplate, Sparkles, ChevronRight } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const getLinkClass = (path: string) => {
        return `relative flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
            isActive(path)
                ? 'text-indigo-600 bg-indigo-50/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`;
    };

    return (
        <>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-indigo-600 focus:text-white focus:font-black focus:rounded-xl focus:shadow-2xl">
                Skip to Content
            </a>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
                scrolled 
                    ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_24px_rgba(0,0,0,0.04)] border-b border-slate-200/60' 
                    : 'bg-white/60 backdrop-blur-md border-b border-transparent'
            }`}>
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                    
                    {/* Brand Section */}
                    <div className="flex items-center shrink-0">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <Logo className="w-9 h-9" />
                            <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-xl tracking-tight leading-none text-slate-900 group-hover:text-indigo-600 transition-colors duration-200">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">AT</span>Sense
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center flex-1 gap-1 px-6">
                        {/* Free Grader — Highlighted CTA in nav */}
                        <Link
                            to="/resume-grader"
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all duration-200 ${
                                isActive('/resume-grader')
                                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                                    : 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600 hover:from-indigo-600 hover:to-violet-600 hover:text-white hover:shadow-md hover:shadow-indigo-200'
                            }`}
                        >
                            <Sparkles size={13} />
                            Free Grader
                        </Link>

                        <Link to="/builder" className={getLinkClass('/builder')}>
                            <LayoutDashboard size={14} />
                            Builder
                        </Link>

                        <Link to="/cover-letters" className={getLinkClass('/cover-letters')}>
                            <FileText size={14} />
                            Cover Letters
                        </Link>

                        <Link to="/job-matcher" className={getLinkClass('/job-matcher')}>
                            <Briefcase size={14} />
                            Matcher
                        </Link>

                        <Link to="/linkedin-optimizer" className={getLinkClass('/linkedin-optimizer')}>
                            <Linkedin size={14} />
                            LinkedIn
                        </Link>

                        <Link to="/templates" className={getLinkClass('/templates')}>
                            <LayoutTemplate size={14} />
                            Templates
                        </Link>

                        <Link to="/blog" className={getLinkClass('/blog')}>
                            <FileText size={14} />
                            Blog
                        </Link>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center">
                        <Link
                            to="/builder"
                            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-bold transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1.5 active:scale-95"
                        >
                            Start Building
                            <ChevronRight size={14} />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
                            className="p-2.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className="bg-white/95 backdrop-blur-xl border-t border-slate-100 py-3 px-4 space-y-1">
                    <Link to="/resume-grader" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600">
                        <Sparkles size={16} /> Free Grader
                    </Link>
                    <Link to="/builder" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        <LayoutDashboard size={16} /> Builder
                    </Link>
                    <Link to="/cover-letters" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        <FileText size={16} /> Cover Letters
                    </Link>
                    <Link to="/job-matcher" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        <Briefcase size={16} /> Job Matcher
                    </Link>
                    <Link to="/linkedin-optimizer" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        <Linkedin size={16} /> LinkedIn
                    </Link>
                    <Link to="/templates" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        <LayoutTemplate size={16} /> Templates
                    </Link>
                    <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        <FileText size={16} /> Blog
                    </Link>
                    <div className="pt-2 px-1">
                        <Link to="/builder" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold">
                            Start Building →
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
        </>
    );
};

export default Navbar;