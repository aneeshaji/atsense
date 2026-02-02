import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Settings, FileText, Briefcase, Linkedin, Sparkles } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            {/* Modern Logo with Organic Design */}
                            <div className="relative">
                                <div className="w-11 h-11 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                            <div>
                                <span className="font-black text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">ATSense</span>
                                <p className="text-xs text-gray-500 -mt-0.5 font-medium">Resume Intelligence</p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/dashboard"
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${isActive('/dashboard')
                                                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                            }`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/cover-letters"
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${isActive('/cover-letters')
                                                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                            }`}
                                    >
                                        Cover Letters
                                    </Link>
                                    <Link
                                        to="/job-matcher"
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${isActive('/job-matcher')
                                                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                            }`}
                                    >
                                        Job Matcher
                                    </Link>
                                    <Link
                                        to="/linkedin-optimizer"
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${isActive('/linkedin-optimizer')
                                                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                            }`}
                                    >
                                        LinkedIn
                                    </Link>
                                </div>

                                <div className="h-6 w-px bg-gray-200"></div>

                                {/* User Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 group focus:outline-none"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-left hidden lg:block">
                                            <p className="text-sm font-bold text-gray-700 group-hover:text-purple-600 transition-colors">{user?.name}</p>
                                        </div>
                                        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-purple-100 py-2 transform origin-top-right transition-all animate-fade-in">
                                            <div className="px-4 py-3 border-b border-purple-50 mb-2">
                                                <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>

                                            <Link
                                                to="/dashboard"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all rounded-2xl mx-2"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <LayoutDashboard size={18} />
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/cover-letters"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all rounded-2xl mx-2"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <FileText size={18} />
                                                Cover Letters
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all rounded-2xl mx-2"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <Settings size={18} />
                                                Account Settings
                                            </Link>

                                            <div className="my-2 border-t border-purple-50"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-all rounded-2xl mx-2"
                                            >
                                                <LogOut size={18} />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex gap-3">
                                <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-gray-700 hover:text-purple-600 transition-colors rounded-full hover:bg-purple-50">
                                    Login
                                </Link>
                                <Link to="/register" className="group relative px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
                                    <div className="absolute inset-0 shimmer"></div>
                                    <span className="relative flex items-center gap-2">
                                        <Sparkles size={16} className="animate-pulse" />
                                        Get Started
                                    </span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-2xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 focus:outline-none transition-all"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-purple-100 absolute w-full shadow-2xl">
                    <div className="px-4 pt-4 pb-6 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-[2rem] border border-purple-100">
                                    <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{user?.name}</div>
                                        <div className="text-sm text-gray-500">{user?.email}</div>
                                    </div>
                                </div>

                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-[2rem] text-base font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all"
                                >
                                    <LayoutDashboard size={20} />
                                    Dashboard
                                </Link>
                                <Link
                                    to="/cover-letters"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-[2rem] text-base font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all"
                                >
                                    <FileText size={20} />
                                    Cover Letters
                                </Link>
                                <Link
                                    to="/job-matcher"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-[2rem] text-base font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all"
                                >
                                    <Briefcase size={20} />
                                    Job Matcher
                                </Link>
                                <Link
                                    to="/linkedin-optimizer"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-[2rem] text-base font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all"
                                >
                                    <Linkedin size={20} />
                                    LinkedIn Optimizer
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-[2rem] text-base font-semibold text-red-600 hover:bg-red-50 transition-all"
                                >
                                    <LogOut size={20} />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="space-y-3 pt-4">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center px-4 py-3 border-2 border-purple-200 text-gray-900 rounded-full font-bold hover:bg-purple-50 transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white rounded-full font-bold hover:shadow-lg transition-all"
                                >
                                    Get Started Free
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;