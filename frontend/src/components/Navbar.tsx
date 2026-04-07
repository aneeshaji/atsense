import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, LayoutDashboard, FileText, Briefcase, Linkedin, LayoutTemplate, Sparkles } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const getLinkClass = (path: string) => {
        return `flex items-center gap-2 px-1 py-2 text-sm font-bold transition-all duration-200 border-b-2 ${
            isActive(path)
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-200'
        }`;
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20">
                <div className="flex justify-between items-center h-full">
                    
                    {/* Brand Section */}
                    <div className="flex items-center shrink-0">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                {/* Subtle glow effect on hover */}
                                <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                                <div className="relative"><Logo /></div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="font-black text-2xl text-slate-900 tracking-tight leading-none group-hover:text-indigo-950 transition-colors duration-300">
                                    ATSense
                                </span>
                                <span className="text-[9px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 uppercase tracking-[0.25em] mt-0.5 opacity-90 group-hover:opacity-100 transition-opacity">
                                    Resume Intelligence
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center flex-1 gap-6 px-8">
                        {/* Free Grader — Highlighted CTA in nav */}
                        <Link
                            to="/resume-grader"
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 border ${
                                isActive('/resume-grader')
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                                    : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-md hover:shadow-indigo-200'
                            }`}
                        >
                            <Sparkles size={13} />
                            Free Grader
                        </Link>

                        <Link to="/builder" className={getLinkClass('/builder')}>
                            <LayoutDashboard size={14} className={isActive('/builder') ? 'text-indigo-600' : 'text-gray-400'} />
                            Builder
                        </Link>

                        <Link to="/cover-letters" className={getLinkClass('/cover-letters')}>
                            <FileText size={14} className={isActive('/cover-letters') ? 'text-indigo-600' : 'text-gray-400'} />
                            Cover Letters
                        </Link>

                        <Link to="/job-matcher" className={getLinkClass('/job-matcher')}>
                            <Briefcase size={14} className={isActive('/job-matcher') ? 'text-indigo-600' : 'text-gray-400'} />
                            Matcher
                        </Link>

                        <Link to="/linkedin-optimizer" className={getLinkClass('/linkedin-optimizer')}>
                            <Linkedin size={14} className={isActive('/linkedin-optimizer') ? 'text-indigo-600' : 'text-gray-400'} />
                            LinkedIn
                        </Link>

                        <Link to="/templates" className={getLinkClass('/templates')}>
                            <LayoutTemplate size={14} className={isActive('/templates') ? 'text-indigo-600' : 'text-gray-400'} />
                            Templates
                        </Link>

                        <Link to="/blog" className={getLinkClass('/blog')}>
                            <FileText size={14} className={isActive('/blog') ? 'text-indigo-600' : 'text-gray-400'} />
                            Blogs
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center group">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-3 bg-gray-50 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-gray-100"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 space-y-3">
                    <Link to="/builder" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-sm font-bold"><LayoutDashboard size={18} /> Builder</Link>
                    <Link to="/cover-letters" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-sm font-bold"><FileText size={18} /> Cover Letters</Link>
                    <Link to="/job-matcher" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-sm font-bold"><Briefcase size={18} /> Job Matcher</Link>
                    <Link to="/linkedin-optimizer" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-sm font-bold"><Linkedin size={18} /> LinkedIn</Link>
                    <Link to="/templates" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-sm font-bold"><LayoutTemplate size={18} /> Templates</Link>
                    <Link to="/blog" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-sm font-bold"><FileText size={18} /> Blogs</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;