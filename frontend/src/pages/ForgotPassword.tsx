import { useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight, Mail, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO title="Forgot Password - ATSense" description="Reset your ATSense password." />
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
                                Reset password
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                {success
                                    ? "Check your email for a link to reset your password."
                                    : "Enter your email address and we'll send you a link to reset your password."
                                }
                            </p>
                        </div>

                        {success ? (
                            <div className="bg-green-50 border border-green-100 text-green-700 px-6 py-8 rounded-2xl text-center">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                <h3 className="font-bold text-lg mb-2">Email Sent!</h3>
                                <p className="text-sm opacity-90 mb-6">
                                    We've sent a password reset link to <strong>{email}</strong>.
                                </p>
                                <Link
                                    to="/login"
                                    className="text-indigo-600 font-bold hover:underline"
                                >
                                    Return to Login
                                </Link>
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : (
                                        <>
                                            Send Reset Link
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </button>

                                <div className="text-center">
                                    <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;
