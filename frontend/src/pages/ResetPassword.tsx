import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            const res = await api.post(`/auth/reset-password/${token}`, { password });
            setSuccess(true);
            // Automatically log them in after a few seconds
            setTimeout(() => {
                login(res.data.token, res.data.user);
                navigate('/dashboard');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Token is invalid or has expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO title="Reset Password - ATSense" description="Set your new ATSense password." />
            <div className="flex min-h-screen bg-white">
                <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div className="mb-10 text-center">
                            <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110">
                                    A
                                </div>
                                <span className="text-xl font-bold text-gray-900 tracking-tight">ATSense</span>
                            </Link>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                                New password
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Please enter your new password below.
                            </p>
                        </div>

                        {success ? (
                            <div className="bg-green-50 border border-green-100 text-green-700 px-6 py-8 rounded-2xl text-center">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                <h3 className="font-bold text-lg mb-2">Password Updated!</h3>
                                <p className="text-sm opacity-90 mb-6">
                                    Your password has been changed successfully. Redirecting you to the dashboard...
                                </p>
                                <Loader2 className="animate-spin h-6 w-6 text-indigo-600 mx-auto" />
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        </div>
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 sm:text-sm transition-all"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                            Update Password
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;
