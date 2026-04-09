import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Lock, Mail, Key } from 'lucide-react';

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
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <Lock className="w-8 h-8" strokeWidth={2.5} />
                    </div>
                </div>
                <h2 className="mt-2 text-center text-3xl font-black text-gray-900 tracking-tight">
                    Admin Portal
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 font-medium">
                    Secure access for ATSense administrators
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-3">
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label htmlFor="admin-email" className="block text-sm font-bold text-gray-700">Email Address</label>
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="admin-email"
                                    type="email"
                                    required
                                    className="pl-10 block w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition-colors"
                                    placeholder="admin@atsense.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="admin-password" className="block text-sm font-bold text-gray-700">Password</label>
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="admin-password"
                                    type="password"
                                    required
                                    className="pl-10 block w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 font-medium transition-colors"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
