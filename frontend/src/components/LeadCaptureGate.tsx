import React, { useState } from 'react';
import { Lock, Mail, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../services/api';

interface LeadCaptureGateProps {
    source: string;
    title?: string;
    subtitle?: string;
    buttonLabel?: string;
    defaultName?: string;
    children: React.ReactNode;
}

const STORAGE_KEY = 'atsense_lead_captured_email';

export default function LeadCaptureGate({
    source,
    title = 'Unlock Your Full AI Result',
    subtitle = 'Enter your email to view, copy, and download your personalized output — plus get free ATS optimization tips.',
    buttonLabel = 'Unlock Full Result',
    defaultName = '',
    children,
}: LeadCaptureGateProps) {
    const [unlocked, setUnlocked] = useState<boolean>(() => Boolean(sessionStorage.getItem(STORAGE_KEY)));
    const [name, setName] = useState(defaultName);
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (unlocked) {
        return <>{children}</>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const trimmed = email.trim();
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setError('Please enter a valid email address.');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/leads/capture', {
                name: name.trim() || trimmed.split('@')[0],
                email: trimmed,
                source,
            });
            sessionStorage.setItem(STORAGE_KEY, trimmed);
            setUnlocked(true);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Could not save your email. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="relative rounded-2xl overflow-hidden border border-indigo-200 bg-white shadow-sm">
            {/* Blurred preview underneath */}
            <div className="pointer-events-none select-none blur-sm opacity-45 max-h-72 overflow-hidden">
                {children}
            </div>

            {/* Gate overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/95 to-white flex items-center justify-center p-4 sm:p-6">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white rounded-2xl border border-indigo-100 shadow-xl p-5 sm:p-6 space-y-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                            <Lock size={18} />
                        </div>
                        <div>
                            <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                                {title} <Sparkles size={14} className="text-indigo-500" />
                            </h4>
                            <p className="text-xs text-slate-500 leading-snug mt-0.5">{subtitle}</p>
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <div className="space-y-2.5">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name (optional)"
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white text-slate-800"
                        />
                        <div className="relative">
                            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white text-slate-800"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                    >
                        <span>{submitting ? 'Unlocking…' : buttonLabel}</span>
                        <ArrowRight size={15} />
                    </button>

                    <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-500" /> 100% free · No spam · Instant access
                    </p>
                </form>
            </div>
        </div>
    );
}
