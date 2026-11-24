import { useState, useEffect, useRef } from 'react';
import { X, Zap, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

const SESSION_KEY = 'atsense_exit_intent_shown';

const ExitIntentPopup = () => {
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const triggered = useRef(false);

    useEffect(() => {
        // Only show once per session, and not if already a lead
        if (sessionStorage.getItem(SESSION_KEY)) return;

        const handleMouseLeave = (e: MouseEvent) => {
            if (triggered.current) return;
            if (e.clientY <= 10) {
                triggered.current = true;
                setVisible(true);
                sessionStorage.setItem(SESSION_KEY, '1');
                document.removeEventListener('mouseleave', handleMouseLeave);
            }
        };

        // Wait 8s before enabling — don't fire on accidental quick exits
        const timer = setTimeout(() => {
            document.addEventListener('mouseleave', handleMouseLeave);
        }, 8000);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSubmitting(true);
        try {
            await api.post('/leads/capture', { email: email.trim(), source: 'exit_intent' });
        } catch {
            // silent — still show success
        } finally {
            setSubmitting(false);
            setDone(true);
            setTimeout(() => setVisible(false), 2500);
        }
    };

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={(e) => e.target === e.currentTarget && setVisible(false)}
        >
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-400">
                {/* Top gradient bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-500" />

                {/* Close */}
                <button
                    onClick={() => setVisible(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                >
                    <X size={15} />
                </button>

                <div className="px-8 py-7">
                    {!done ? (
                        <>
                            {/* Urgency badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                Wait — don't leave yet
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                                Get your free ATS score<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">in under 10 seconds</span>
                            </h2>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                75% of resumes are auto-rejected before a human ever reads them.
                                Find out exactly where yours stands — free, instant, no sign-up required.
                            </p>

                            {/* Value pills */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {['✅ Instant score', '✅ Keyword gaps', '✅ Fix recommendations'].map(pill => (
                                    <span key={pill} className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">{pill}</span>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm shadow-[0_4px_16px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_24px_rgba(139,92,246,0.55)] hover:-translate-y-0.5 transition-all disabled:opacity-70"
                                >
                                    {submitting
                                        ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
                                        : <><Zap size={15} /> Get My Free ATS Score <ArrowRight size={14} /></>
                                    }
                                </button>
                            </form>

                            <p className="text-center text-xs text-slate-400 mt-3">
                                No spam. We'll send your score report to this email.
                            </p>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🎯</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">You're in!</h3>
                            <p className="text-slate-500 text-sm">Check your inbox — your ATS score report is on its way.</p>
                        </div>
                    )}
                </div>

                {/* Bottom CTA link */}
                {!done && (
                    <div className="px-8 pb-5 text-center">
                        <a
                            href="/resume-grader"
                            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-violet-600 transition-colors font-medium"
                        >
                            Or check your score instantly — no email needed <ArrowRight size={11} />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExitIntentPopup;
