import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowRight, User, Mail, Lock, CheckCircle2, TrendingUp, Shield, Sparkles, Star } from 'lucide-react';
import api from '../services/api';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', form);
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
            {/* Animated Organic Background Blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/20 rounded-full blur-[100px] animate-float"></div>
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-white/20 rounded-full blur-[120px] animate-float-slow"></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-300/30 rounded-full blur-[80px] animate-wave"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="particle absolute bg-white/40 rounded-full"
                        style={{
                            width: Math.random() * 6 + 3 + 'px',
                            height: Math.random() * 6 + 3 + 'px',
                            left: Math.random() * 100 + '%',
                            bottom: '-20px',
                            animation: `particleFloat ${Math.random() * 10 + 10}s linear infinite`,
                            animationDelay: Math.random() * 5 + 's'
                        }}
                    />
                ))}
            </div>

            {/* Left Side - Form (Primary Focus) */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10">
                <div className="mx-auto w-full max-w-md">
                    {/* Glassmorphism Form Card */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl p-10 border border-white/20">
                        <div className="mb-8">
                            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                                <div className="w-11 h-11 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="font-black text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">ATSense</span>
                            </Link>
                            <h2 className="text-3xl font-black tracking-tight text-gray-900">
                                Create your account
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 font-medium">
                                Start optimizing your resume for free today.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 sm:text-sm transition-all font-medium"
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 sm:text-sm transition-all font-medium"
                                        placeholder="name@company.com"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 sm:text-sm transition-all font-medium"
                                        placeholder="Min 8 characters"
                                        value={form.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 overflow-hidden"
                            >
                                <div className="absolute inset-0 shimmer"></div>
                                {loading ? (
                                    <Loader2 className="animate-spin h-5 w-5 relative z-10" />
                                ) : (
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Sparkles size={18} className="animate-pulse" />
                                        Create Account
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600 font-medium">
                                Already have an account?{' '}
                                <Link to="/login" className="font-bold text-purple-600 hover:text-purple-500 hover:underline transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Details Sidebar */}
            <div className="hidden lg:flex w-[480px] bg-gradient-to-br from-purple-50 to-pink-50 border-l border-white/20 p-12 flex-col justify-center relative overflow-hidden backdrop-blur-sm">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-400 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-sm mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-purple-200 text-purple-700 font-bold text-sm mb-6">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span>Join 10,000+ Users</span>
                    </div>

                    <h3 className="text-3xl font-black text-gray-900 mb-8">
                        Why ATSense?
                    </h3>

                    <div className="space-y-6">
                        <div className="flex gap-4 group p-5 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg flex items-center justify-center text-white">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900">Increase Interview Rate</h4>
                                <p className="text-sm text-gray-600 mt-1 leading-relaxed font-medium">
                                    Our users report getting 3x more callbacks after optimizing their resume keywords.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 group p-5 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg flex items-center justify-center text-white">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900">Beat the Bots</h4>
                                <p className="text-sm text-gray-600 mt-1 leading-relaxed font-medium">
                                    We reverse-engineered top ATS systems to ensure your resume never gets filtered out.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 group p-5 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg flex items-center justify-center text-white">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900">100% Secure</h4>
                                <p className="text-sm text-gray-600 mt-1 leading-relaxed font-medium">
                                    Your personal data is encrypted and never shared with recruiters without permission.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 p-6 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-purple-100 shadow-lg relative">
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white shadow-lg">
                            <Star size={20} fill="currentColor" />
                        </div>
                        <p className="text-gray-700 italic text-sm mb-4 font-medium leading-relaxed">
                            "I was applying for months with no luck. After one scan with ATSense, I fixed my keyword gaps and got hired at Spotify!"
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md">MK</div>
                            <div>
                                <div className="text-sm font-black text-gray-900">Michael K.</div>
                                <div className="text-xs text-gray-500 font-medium">Software Engineer</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
