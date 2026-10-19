import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Target, Users, Zap, ShieldCheck, Heart, Sparkles, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';

const About = () => {
    return (
        <main className="font-sans bg-slate-900 text-slate-100 overflow-hidden relative">
            <SEO
                title="About ATSense — Bridging Human Potential and Hiring Algorithms"
                description="Learn the story behind ATSense. We're on a mission to empower job seekers with next-gen AI tools that beat enterprise ATS filters and land top-tier interviews."
                url="https://atsense.online/about"
            />

            {/* Ambient Background Aura */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]"></div>
                <div className="absolute top-[40%] -right-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-10 -left-40 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute inset-0 tech-grid-dark opacity-35"></div>
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 font-semibold text-xs uppercase tracking-wider mb-6 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>The ATSense Manifesto</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1] max-w-4xl mx-auto">
                    We're Leveling the Playing Field in{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300">
                        Modern Hiring
                    </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                    Modern hiring algorithms shouldn't stand between extraordinary talent and career-defining opportunities. We build the intelligence layer that makes you impossible to filter out.
                </p>

                {/* Stat Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[
                        { label: 'Job Seekers Empowered', val: '50k+', icon: Users, color: 'text-cyan-400', border: 'border-cyan-500/20' },
                        { label: 'Average Interview Rate Boost', val: '3.4x', icon: Zap, color: 'text-amber-400', border: 'border-amber-500/20' },
                        { label: 'Enterprise ATS Compatibility', val: '100%', icon: ShieldCheck, color: 'text-emerald-400', border: 'border-emerald-500/20' },
                    ].map((stat, i) => (
                        <div key={i} className={`p-8 rounded-3xl bg-slate-950/80 backdrop-blur-xl border ${stat.border} shadow-xl hover:scale-[1.02] transition-all`}>
                            <stat.icon className={`w-8 h-8 ${stat.color} mb-4 mx-auto`} />
                            <h3 className="text-4xl font-black text-white mb-1 tracking-tight">{stat.val}</h3>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-4">
                            Our Philosophy
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 tracking-tight leading-tight">
                            Bridging the gap between human genius and automated parsers.
                        </h2>
                        <div className="space-y-4 text-slate-300 text-base leading-relaxed">
                            <p>
                                Today, over 98% of Fortune 500 corporations rely on Applicant Tracking Systems like Workday, Taleo, and Greenhouse. These platforms parse resumes with strict syntactic rules — discarding qualified candidates simply because of margin offsets, unparsed bullet verbs, or missing semantic tokens.
                            </p>
                            <p>
                                ATSense is not just another templates tool. It's a real-time semantic translation engine that maps your accomplishments directly into the algorithmic vocabulary recruiters and hiring models search for.
                            </p>
                        </div>

                        <div className="pt-6 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 font-bold text-slate-200 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                                <span>Human-Centric Career Coaching</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-slate-200 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
                                <Cpu className="w-4 h-4 text-cyan-400" />
                                <span>Calibrated against Top ATS Parsers</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="p-8 rounded-3xl bg-slate-950/90 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                            
                            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2.5">
                                <Sparkles className="w-5 h-5 text-cyan-400" />
                                The ATSense Standard
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { title: 'Zero-Storage Privacy', desc: 'Your career credentials and contact information are processed in memory and never sold or shared.' },
                                    { title: 'STAR Method Bullet Generator', desc: 'Transforms passive duties into quantified, high-impact achievements with metrics.' },
                                    { title: 'Real-time Taleo/Workday Emulation', desc: 'Predicts exact parser scoring thresholds before you apply.' },
                                    { title: 'Instant Tailoring Engine', desc: 'Aligns your skills to any target job description in seconds.' },
                                ].map((item, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{item.title}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                <div className="bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight leading-tight">
                            Ready to make your resume unstoppable?
                        </h2>
                        <p className="text-slate-300 text-base mb-8">
                            Take control of your applications today with our free neural grader and AI builder.
                        </p>
                        <Link 
                            to="/builder" 
                            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black rounded-xl text-sm uppercase tracking-wider hover:scale-105 transition-all shadow-xl shadow-cyan-500/25"
                        >
                            <span>Open Career Cockpit</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
