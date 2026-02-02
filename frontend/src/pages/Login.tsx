import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowRight, Mail, Lock, Zap, Target, BookOpen, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO title="Login - ATSense" description="Login to ATSense to access your dashboard and resume tools." />
            <div className="flex min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
                {/* Animated Organic Background Blobs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/20 rounded-full blur-[100px] animate-float"></div>
                    <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-white/20 rounded-full blur-[120px] animate-float-slow"></div>
                    <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300/30 rounded-full blur-[80px] animate-wave"></div>
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
                                    Welcome back
                                </h2>
                                <p className="mt-2 text-sm text-gray-600 font-medium">
                                    Please sign in to access your dashboard.
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
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-bold text-gray-700">Password</label>
                                        <Link to="/forgot-password" title="Forgot Password" className="text-sm font-bold text-purple-600 hover:text-purple-500 transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                        </div>
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 sm:text-sm transition-all font-medium"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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
                                            Sign In
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-600 font-medium">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="font-bold text-purple-600 hover:text-purple-500 hover:underline transition-colors">
                                        Sign up for free
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
                            <span>New Features</span>
                        </div>

                        <h3 className="text-3xl font-black text-gray-900 mb-8">
                            What's New
                        </h3>

                        <div className="space-y-6">
                            <div className="flex gap-4 group p-5 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg flex items-center justify-center text-white">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900">GPT-4 Analysis</h4>
                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed font-medium">
                                        Our updated scoring engine is now 40% more accurate at predicting interview success.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 group p-5 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl shadow-lg flex items-center justify-center text-white">
                                    <Target size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900">Target Role Matching</h4>
                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed font-medium">
                                        Set a target job title and get specific advice on how to tailor your experience.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 group p-5 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg flex items-center justify-center text-white">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900">Career Resources</h4>
                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed font-medium">
                                        Access exclusive guides on salary negotiation and interview prep.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-[2rem] p-6 border border-white/20 shadow-xl">
                            <p className="text-white font-black mb-2 flex items-center gap-2">
                                <Sparkles size={18} className="animate-pulse" />
                                Pro Tip:
                            </p>
                            <p className="text-white/90 text-sm font-medium leading-relaxed">
                                Tailoring your resume for each application increases your chances by 50%. Use our "Job Match" tool to do it in seconds.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
