import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowRight, Mail, Lock, Zap, Target, BookOpen } from 'lucide-react';
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
            <div className="flex min-h-screen bg-white">
                {/* Left Side - Form (Primary Focus) */}
                <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div className="mb-10">
                            <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110">
                                    A
                                </div>
                                <span className="text-xl font-bold text-gray-900 tracking-tight">ATSense</span>
                            </Link>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                                Welcome back
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Please sign in to access your dashboard.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 sm:text-sm transition-all"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 sm:text-sm transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                                    Sign up for free
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Details Sidebar */}
                <div className="hidden lg:flex w-[480px] bg-slate-50 border-l border-gray-200 p-12 flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10 max-w-sm mx-auto">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            New features available
                        </h3>

                        <div className="space-y-8">
                            <div className="flex gap-4 group">
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">GPT-4 Analysis</h4>
                                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                        Our updated scoring engine is now 40% more accurate at predicting interview success.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 group">
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center text-teal-600 group-hover:scale-105 transition-transform">
                                    <Target size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Target Role Matching</h4>
                                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                        Set a target job title and get specific advice on how to tailor your experience.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 group">
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Career Resources</h4>
                                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                        Access exclusive guides on salary negotiation and interview prep.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                            <p className="text-indigo-800 font-bold mb-2">Pro Tip:</p>
                            <p className="text-indigo-600 text-sm">
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
