import { Sparkles, ShieldAlert } from 'lucide-react';
import Logo from '../components/Logo';

export default function Maintenance() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-white">
            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-3xl opacity-70 animate-pulse"></div>
                <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
            </div>

            <div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8 mx-auto shadow-sm transform hover:scale-105 transition-transform cursor-default">
                    <ShieldAlert size={14} className="text-indigo-600 animate-pulse" />
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">System Upgrade in Progress</span>
                </div>

                {/* Main Icon/Graphic */}
                <div className="relative w-32 h-32 mx-auto mb-10">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl animate-[spin_8s_linear_infinite] blur-xl opacity-40"></div>
                    <div className="absolute inset-0 bg-white rounded-3xl border border-gray-100 shadow-2xl flex items-center justify-center transform rotate-3">
                        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white rounded-3xl flex items-center justify-center transform -rotate-3 border border-white">
                            <div className="scale-[2] origin-center animate-pulse">
                                <Logo />
                            </div>
                        </div>
                    </div>
                    {/* Sparkles */}
                    <div className="absolute -top-4 -right-4 text-amber-400 animate-bounce">
                        <Sparkles size={24} />
                    </div>
                </div>

                {/* Product Name */}
                <div className="flex flex-col items-center mb-8">
                    <span className="font-black text-3xl text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 tracking-tighter">
                        ATSense
                    </span>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1 opacity-80">
                        Resume Intelligence
                    </span>
                </div>

                {/* Typography */}
                <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-800 to-gray-500 tracking-tight leading-tight mb-6">
                    Elevating your <br/> experience.
                </h1>
                
                <p className="text-xl text-gray-500 font-medium my-12 max-w-lg mx-auto leading-relaxed">
                    ATSense is currently undergoing a scheduled infrastructure upgrade to bring you an even faster, more powerful AI resume engine. We'll be right back.
                </p>

            </div>
        </div>
    );
}
