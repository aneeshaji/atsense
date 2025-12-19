import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowRight, User, Mail, Lock, CheckCircle2, TrendingUp, Shield } from 'lucide-react';
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
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Start optimizing your resume for free today.
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
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 sm:text-sm transition-all"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

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
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 sm:text-sm transition-all"
                                    placeholder="Min 8 characters"
                                    value={form.password}
                                    onChange={handleChange}
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
                                    Create Account
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Details Sidebar */}
            <div className="hidden lg:flex w-[480px] bg-slate-50 border-l border-gray-200 p-12 flex-col justify-center relative overflow-hidden">
                <div className="relative z-10 max-w-sm mx-auto">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Why thousands choose ATSense
                    </h3>

                    <div className="space-y-8">
                        <div className="flex gap-4 group">
                            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Increase Interview Rate</h4>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                    Our users report getting 3x more callbacks after optimizing their resume keywords.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 group">
                            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center text-green-600 group-hover:scale-105 transition-transform">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Beat the Bots</h4>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                    We reverse-engineered top ATS systems to ensure your resume never gets filtered out.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 group">
                            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">100% Secure</h4>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                    Your personal data is encrypted and never shared with recruiters without permission.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative">
                        <div className="absolute top-0 right-0 -mr-2 -mt-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </div>
                        <p className="text-gray-600 italic text-sm mb-4">
                            "I was applying for months with no luck. After one scan with ATSense, I fixed my keyword gaps and got hired at Spotify!"
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">MK</div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">Michael K.</div>
                                <div className="text-xs text-gray-500">Software Engineer</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
