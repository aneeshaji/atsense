import { useState } from 'react';
import SEO from '../components/SEO';
import { useModal } from '../context/ModalContext';
import { Mail, MessageSquare, Clock, Send, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react';
import { sendInquiry } from '../services/contact';

const Contact = () => {
    const { showAlert } = useModal();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        type: 'general' as 'general' | 'partnership' | 'support',
        message: '',
        botcheck: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [fallbackMailto, setFallbackMailto] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);
        setFallbackMailto(null);

        try {
            const result = await sendInquiry(formData);

            if (result.ok) {
                showAlert(
                    'Inquiry Dispatched',
                    result.message || "Thank you for reaching out. The ATSense engineering & support team will respond within 24 hours.",
                    'success'
                );
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    type: 'general',
                    message: '',
                    botcheck: ''
                });
            } else {
                setErrorMessage(result.message);
                if (result.mailto) {
                    setFallbackMailto(result.mailto);
                }
                showAlert('Delivery Notice', result.message, 'warning');
            }
        } catch {
            const mailto = `mailto:support@atsense.online?subject=${encodeURIComponent('[Inquiry] ' + (formData.subject || formData.name))}&body=${encodeURIComponent(formData.message)}`;
            setErrorMessage('Could not establish connection to the mail server. You can click below to send via your local email client.');
            setFallbackMailto(mailto);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="font-sans bg-slate-900 text-slate-100 overflow-hidden relative min-h-screen">
            <SEO
                title="Contact ATSense — Support & Enterprise Inquiries"
                description="Have questions regarding our AI resume optimizer or API integrations? Reach out to the ATSense team for dedicated career assistance."
                url="https://atsense.online/contact"
            />

            {/* Ambient Background Aura */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]"></div>
                <div className="absolute top-[35%] -right-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-10 -left-40 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute inset-0 tech-grid-dark opacity-35"></div>
            </div>

            {/* Hero Header */}
            <section className="relative z-10 pt-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 font-semibold text-xs uppercase tracking-wider mb-6 backdrop-blur-md">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Support & Partnership Channels</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
                    How Can We Help You{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300">
                        Excel?
                    </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                    Whether you have questions about our ATS heuristic models, need template support, or want to collaborate, our team is ready to connect.
                </p>
            </section>

            {/* Split Contact Workspace */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Channels Column */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="p-8 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl space-y-6">
                            <h2 className="text-xl font-black text-white">Direct Channels</h2>

                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Direct Support</h3>
                                        <a href="mailto:support@atsense.online" className="text-cyan-400 font-mono text-xs font-semibold my-0.5 block hover:underline">
                                            support@atsense.online
                                        </a>
                                        <p className="text-xs text-slate-400 leading-relaxed">Primary channel for account queries, bug reports, and feedback.</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Global Response Time</h3>
                                        <div className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider my-0.5">
                                            Under 24 Hours
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">Support operates continuously across North America, Europe, and Asia timezones.</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Encrypted Communications</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                                            All submitted inquiries and files are encrypted end-to-end. We never share or sell personal candidate data.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form Column */}
                    <div className="lg:col-span-7">
                        <div className="p-8 sm:p-10 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl">
                            <h2 className="text-2xl font-black text-white mb-2">Send us a message</h2>
                            <p className="text-slate-400 text-sm mb-6">Fill in the fields below and our engineering team will get back to you promptly.</p>

                            {errorMessage && (
                                <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-medium">{errorMessage}</p>
                                        {fallbackMailto && (
                                            <a
                                                href={fallbackMailto}
                                                className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-white font-bold text-xs transition-colors"
                                            >
                                                <span>Open in Email Client</span>
                                                <ExternalLink size={13} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Honeypot field for bot protection */}
                                <input
                                    type="text"
                                    name="botcheck"
                                    id="botcheck"
                                    value={formData.botcheck}
                                    onChange={(e) => setFormData({ ...formData, botcheck: e.target.value })}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ display: 'none' }}
                                    aria-hidden="true"
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Your Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                                            placeholder="Sarah Jenkins"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                                            placeholder="sarah@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="type" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Inquiry Type</label>
                                        <select
                                            id="type"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        >
                                            <option value="general">General Inquiry</option>
                                            <option value="support">Technical & ATS Scoring Support</option>
                                            <option value="partnership">Partnership & Creator Inquiries</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label htmlFor="subject" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                                            placeholder="e.g. Question about ATS compatibility"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="message" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Message Description</label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium resize-none leading-relaxed"
                                        placeholder="Tell us about your resume goals, questions, or feedback..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-extrabold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Send Inquiry</span>
                                            <Send size={15} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
};

export default Contact;
