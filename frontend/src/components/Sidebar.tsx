import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FileText, 
    Linkedin, 
    Sparkles, 
    ChevronLeft, 
    ChevronRight,
    Search,
    BrainCircuit
} from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

const Sidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/builder', label: 'Resume Builder', icon: LayoutDashboard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { path: '/cover-letters', label: 'Cover Letters', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
        { path: '/job-matcher', label: 'Job Matcher', icon: Search, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { path: '/linkedin-optimizer', label: 'LinkedIn Optimization', icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-50' },
        { path: '/interview-prep', label: 'Interview Simulator', icon: BrainCircuit, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <aside 
            className={`fixed left-0 top-0 h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200 z-[60] transition-all duration-500 ease-in-out hidden lg:flex flex-col ${
                isCollapsed ? 'w-20' : 'w-72'
            }`}
        >
            {/* Sidebar Toggle */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-24 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg hover:border-indigo-200 text-gray-500 hover:text-indigo-600 transition-all z-[70]"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Brand Area */}
            <div className={`p-8 mb-4 transition-all duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                <Link to="/" className="flex items-center gap-3">
                    <Logo />
                    <span className="font-black text-2xl text-gray-900 tracking-tight">ATSense</span>
                </Link>
            </div>

            {/* Navigation Items */}
            <div className={`flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide`}>
                <div className={`mb-4 px-4 ${isCollapsed ? 'hidden' : 'block'}`}>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Workspace Tools</span>
                </div>
                
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                            isActive(item.path)
                                ? `${item.bg} ${item.color} shadow-sm border border-black/5`
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        {/* Active Indicator Bar */}
                        {isActive(item.path) && (
                            <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-current opacity-70`}></div>
                        )}
                        
                        <div className={`shrink-0 transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'}`}>
                             <item.icon size={22} className={isActive(item.path) ? item.color : 'text-gray-400 group-hover:text-gray-600'} />
                        </div>
                        
                        {!isCollapsed && (
                            <span className={`text-[14px] font-bold tracking-tight whitespace-nowrap transition-opacity duration-300`}>
                                {item.label}
                            </span>
                        )}

                        {/* Tooltip for collapsed mode */}
                        {isCollapsed && (
                            <div className="absolute left-[calc(100%+15px)] bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-xl">
                                {item.label}
                                {/* Pointer Arrow */}
                                <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            {/* Bottom Credits / Templates shortcut */}
            <div className={`p-6 mt-auto border-t border-gray-100 ${isCollapsed ? 'items-center' : 'items-stretch'}`}>
                <Link
                    to="/templates"
                    className={`flex items-center gap-3 px-4 py-4 bg-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 group overflow-hidden ${isCollapsed ? 'justify-center w-12 h-12 p-0' : ''}`}
                >
                    <Sparkles size={20} className={isCollapsed ? '' : 'shrink-0'} />
                    {!isCollapsed && <span className="font-bold text-sm">Switch Template</span>}
                </Link>

                {!isCollapsed && (
                    <div className="mt-6 text-center">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">© 2026 ATSense AI</p>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
