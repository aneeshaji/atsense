import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Settings, FileText, Briefcase, Linkedin } from 'lucide-react';

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
        return location.pathname === path ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50';
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-lg bg-white/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            {/* Modern Logo */}
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ATSense</span>
                                <p className="text-xs text-gray-500 -mt-0.5">Resume Intelligence</p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-1">
                                    <Link to="/dashboard" className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard')}`}>
                                        Dashboard
                                    </Link>
                                    <Link to="/cover-letters" className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive('/cover-letters')}`}>
                                        Cover Letters
                                    </Link>
                                    <Link to="/job-matcher" className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive('/job-matcher')}`}>
                                        Job Matcher
                                    </Link>
                                    <Link to="/linkedin-optimizer" className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive('/linkedin-optimizer')}`}>
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
                                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-all">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-left hidden lg:block">
                                            <p className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">{user?.name}</p>
                                        </div>
                                        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 transform origin-top-right transition-all">
                                            <div className="px-4 py-3 border-b border-gray-50 mb-2">
                                                <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>

                                            <Link
                                                to="/dashboard"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <LayoutDashboard size={16} />
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/cover-letters"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <FileText size={16} />
                                                Cover Letters
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <Settings size={16} />
                                                Account Settings
                                            </Link>

                                            <div className="my-2 border-t border-gray-50"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex gap-3">
                                <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="px-5 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg h-screen">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
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
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <LayoutDashboard size={20} />
                                    Dashboard
                                </Link>
                                <Link
                                    to="/cover-letters"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <FileText size={20} />
                                    Cover Letters
                                </Link>
                                <Link
                                    to="/job-matcher"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <Briefcase size={20} />
                                    Job Matcher
                                </Link>
                                <Link
                                    to="/linkedin-optimizer"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <Linkedin size={20} />
                                    LinkedIn Optimizer
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    <LogOut size={20} />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="space-y-4 pt-4">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center px-4 py-3 border border-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-50"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg"
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