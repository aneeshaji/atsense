import { useState } from 'react';
import SEO from '../components/SEO';
import { useModal } from '../context/ModalContext';
import { Mail, MessageSquare, Clock, Globe, Send, Sparkles, ShieldCheck } from 'lucide-react';

const Contact = () => {
    const { showAlert } = useModal();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 1500));
        showAlert('Message Received', "Thanks for reaching out! Our career excellence team will review your inquiry and get back to you within 24 hours.", 'success');
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitting(false);
    };

    return (
        <main className="-mx-4 -my-8 font-sans bg-white overflow-hidden">
            <SEO
                title="Contact Our Team - Support & Business Inquiries"
                description="Have questions about our AI resume optimizer? Get in touch with the ATSense team for premium support, feedback, or business collaborations."
                url="https://atsense.online/contact"
            />

            {/* Premium Contact Hero */}
            <section className="relative bg-[#0b1f3b] pt-24 pb-48 overflow-hidden text-white">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen opacity-50 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-[40%] h-[50%] bg-blue-600/15 blur-[100px] rounded-full mix-blend-screen opacity-60 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[#60efff] font-black text-xs uppercase tracking-[0.2em] mb-8">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Support Excellence Hub</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                        How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60efff] to-blue-400">help you excel?</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto font-medium leading-relaxed">
                        Whether you're a job seeker needing help or a partner looking to collaborate, our team is ready to talk.
                    </p>
                </div>
            </section>

            {/* Split Contact Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-32 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Info Column */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 h-full">
                            <h2 className="text-2xl font-black text-gray-900 mb-8">Channel your inquiry</h2>
                            
                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm shadow-blue-500/10 transition-transform hover:scale-110">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 mb-1">Direct Outreach</h3>
                                        <p className="text-gray-500 font-bold text-sm mb-1">support@atsense.online</p>
                                        <p className="text-xs text-gray-400 font-medium leading-relaxed">Primary channel for technical support and bug reporting.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-sm shadow-emerald-500/10 transition-transform hover:scale-110">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 mb-1">Global Response</h3>
                                        <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest px-3 py-1 bg-indigo-50 rounded-full w-fit mb-2">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>24/7 Monitoring</span>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium leading-relaxed">Our AI-assisted support monitors incoming tickets across all timezones.</p>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-100">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                            <span className="font-black text-gray-900 text-sm">Secure Communication</span>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed">All messages are encrypted and handled following our strict Privacy Policy. We never share your resume data with third parties.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form Column */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-indigo-100/30 border border-indigo-50 relative overflow-hidden group">
                            {/* Decorative Blobs */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            
                            <form onSubmit={handleSubmit} className="relative z-10 space-y-7">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Identity</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all font-bold shadow-sm"
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Communication</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all font-bold shadow-sm"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Description</label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        className="w-full px-6 py-4 rounded-[2rem] bg-gray-50 border border-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all font-bold shadow-sm resize-none"
                                        placeholder="Tell us how we can help..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full group px-8 py-5 bg-[#0b1f3b] text-white font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50 overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-white/10 w-1/2 -skew-x-12 translate-x-[-250%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                    <div className="flex items-center justify-center gap-3">
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span>Deploy Message</span>
                                                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                </button>

                                <div className="flex items-center justify-center gap-2 pt-2">
                                    <Sparkles className="w-4 h-4 text-[#60efff]" />
                                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider italic">Powered by ATSense Support Excellence AI</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contact;

