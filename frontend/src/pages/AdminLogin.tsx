import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Lock, Mail, Key, ArrowRight, ShieldCheck } from 'lucide-react';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/admin/login', { email, password });
            localStorage.setItem('admin_token', res.data.token);
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[680px] h-[420px] rounded-full bg-indigo-600/20 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 right-1/4 w-[420px] h-[320px] rounded-full bg-violet-600/15 blur-[120px]" />

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 p-[1px] shadow-2xl shadow-indigo-500/30">
                        <div className="w-full h-full bg-[#0B101D] rounded-2xl flex items-center justify-center">
                            <Lock className="w-6 h-6 text-indigo-400" strokeWidth={2.2} />
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-bold tracking-widest uppercase text-indigo-300 mb-3">
                        <ShieldCheck size={12} /> ATSense Operations
                    </span>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        Admin Console
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-400 font-medium">
                        Sign in to manage leads, enquiries, and platform analytics
                    </p>
                </div>
            </div>

            <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[#0E1422]/90 backdrop-blur-xl py-8 px-6 sm:px-9 rounded-3xl border border-white/[0.08] shadow-2xl shadow-black/60">
                    <form className="space-y-5" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-rose-500/10 text-rose-300 p-3.5 rounded-xl text-xs font-semibold border border-rose-500/25">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="admin-email" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    id="admin-email"
                                    type="email"
                                    required
                                    className="pl-10 block w-full bg-[#070A12]/80 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-medium transition-all"
                                    placeholder="admin@atsense.online"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Key className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    id="admin-password"
                                    type="password"
                                    required
                                    className="pl-10 block w-full bg-[#070A12]/80 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-medium transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0E1422] focus:ring-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                        >
                            <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
