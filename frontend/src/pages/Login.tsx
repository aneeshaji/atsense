import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowRight, Mail, Lock } from 'lucide-react';
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

            {/* Main Container with Vibrant Gradient */}
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">

                {/* Background Decor Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/30 blur-[100px] animate-blob"></div>
                    <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-500/20 blur-[100px] animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-violet-500/30 blur-[100px] animate-blob animation-delay-4000"></div>
                </div>

                {/* Card */}
                <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl relative z-10 p-8 md:p-10 border border-white/20">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                            Welcome back
                        </h2>
                        <p className="text-gray-500">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                            <div className="relative group">
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white transition-all duration-200"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-500 transition-colors">
                                    <Mail className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-gray-700">Password</label>
                                <Link to="/forgot-password" title="Forgot Password" className="text-sm font-semibold text-violet-600 hover:text-violet-500 hover:underline">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white transition-all duration-200"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-500 transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-violet-500/30 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
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

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-violet-600 hover:text-fuchsia-600 transition-colors">
                            Sign up freely
                        </Link>
                    </p>
                </div>

                {/* Footer Copyright - White on Gradient */}
                <div className="absolute bottom-6 text-center text-white/60 text-xs font-medium">
                    © {new Date().getFullYear()} ATSense Inc. All rights reserved.
                </div>
            </div>
        </>
    );
}

export default Login;
