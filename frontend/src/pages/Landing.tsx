import { Link } from 'react-router-dom';
import { CheckCircle, Zap, Star, ArrowRight, Sparkles, Target, Award, ChevronDown, Rocket, Brain, Shield } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import SEO from '../components/SEO';

const Landing = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Animated counter
    const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
        const [count, setCount] = useState(0);
        const [hasStarted, setHasStarted] = useState(false);
        const ref = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !hasStarted) {
                        setHasStarted(true);
                        const startTime = Date.now();
                        const timer = setInterval(() => {
                            const elapsed = Date.now() - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            setCount(Math.floor(progress * end));
                            if (progress === 1) clearInterval(timer);
                        }, 16);
                        return () => clearInterval(timer);
                    }
                },
                { threshold: 0.5 }
            );

            if (ref.current) observer.observe(ref.current);
            return () => observer.disconnect();
        }, [end, duration, hasStarted]);

        return <div ref={ref}>{count}{suffix}</div>;
    };

    return (
        <div className="-mx-4 -my-8">
            <SEO
                title="ATSense - #1 AI Resume Optimizer & ATS Checker"
                description="Stop getting rejected. ATSense uses GPT-4 to optimize your resume for ATS systems and helps you land 3x more interviews."
                keywords="resume optimizer, ats checker, ai resume builder, cv optimization, career tools, job search, resume scanner"
            />

            {/* Hero Section - Fluid Organic Design with NO gap */}
            <section className="relative min-h-screen flex items-center bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 overflow-hidden">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 animate-gradient"></div>

                {/* Organic Flowing Blobs */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-white rounded-full blur-[100px] animate-float"></div>
                    <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-white rounded-full blur-[120px] animate-float-slow"></div>
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white rounded-full blur-[80px] animate-wave"></div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="particle absolute bg-white rounded-full opacity-40"
                            style={{
                                width: Math.random() * 8 + 4 + 'px',
                                height: Math.random() * 8 + 4 + 'px',
                                left: Math.random() * 100 + '%',
                                bottom: '-20px',
                                animation: `particleFloat ${Math.random() * 10 + 10}s linear infinite`,
                                animationDelay: Math.random() * 5 + 's'
                            }}
                        />
                    ))}
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div className="text-white space-y-6">
                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white font-bold shadow-2xl">
                                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                                <span>Powered by GPT-4 AI Technology</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-black leading-tight">
                                Beat the ATS.
                                <br />
                                <span className="gradient-text-animated inline-block">
                                    Get Hired Faster.
                                </span>
                            </h1>

                            <p className="text-lg text-white/90 leading-relaxed max-w-xl">
                                Stop getting rejected by robots. Our AI-powered resume optimizer ensures your application passes the Applicant Tracking System and lands in front of human recruiters.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    to="/register"
                                    className="group relative inline-flex justify-center items-center px-8 py-4 text-lg font-bold rounded-full text-purple-600 bg-white hover:bg-gray-50 transition-all shadow-2xl hover:shadow-white/50 transform hover:scale-105 overflow-hidden"
                                >
                                    <div className="absolute inset-0 shimmer"></div>
                                    <Rocket className="mr-2 group-hover:translate-x-1 transition-transform" size={22} />
                                    Optimize My Resume Free
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={22} />
                                </Link>
                                <Link
                                    to="/about"
                                    className="inline-flex justify-center items-center px-8 py-4 text-lg font-bold rounded-full text-white bg-white/10 backdrop-blur-xl border-2 border-white/30 hover:bg-white/20 transition-all shadow-xl"
                                >
                                    How It Works
                                </Link>
                            </div>

                            <div className="flex items-center gap-8 text-sm text-white/90 font-semibold pt-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="text-green-300" size={18} />
                                    No credit card required
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="text-green-300" size={18} />
                                    95% Success Rate
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Flowing Organic Stats */}
                        <div className="relative">
                            <div className="relative backdrop-blur-3xl bg-white/10 border border-white/20 rounded-[4rem] p-8 shadow-2xl transform hover:scale-105 transition-all duration-700">
                                {/* Soft ambient glow */}
                                <div className="absolute -inset-4 rounded-[5rem] bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 blur-3xl"></div>

                                <div className="relative space-y-4">
                                    <h3 className="text-xl font-bold text-white text-center mb-6">Real-Time Success Metrics</h3>

                                    {/* Flowing pill-shaped stats */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between px-6 py-4 rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-500/30 backdrop-blur-sm border border-white/30 hover:scale-105 transition-all">
                                            <div className="text-3xl font-black text-cyan-200">
                                                <AnimatedCounter end={3} suffix="x" />
                                            </div>
                                            <div className="text-white font-bold text-sm">More Interviews</div>
                                        </div>
                                        <div className="flex items-center justify-between px-6 py-4 rounded-full bg-gradient-to-r from-purple-400/30 to-pink-500/30 backdrop-blur-sm border border-white/30 hover:scale-105 transition-all">
                                            <div className="text-3xl font-black text-purple-200">
                                                <AnimatedCounter end={95} suffix="%" />
                                            </div>
                                            <div className="text-white font-bold text-sm">Success Rate</div>
                                        </div>
                                        <div className="flex items-center justify-between px-6 py-4 rounded-full bg-gradient-to-r from-pink-400/30 to-rose-500/30 backdrop-blur-sm border border-white/30 hover:scale-105 transition-all">
                                            <div className="text-3xl font-black text-pink-200">
                                                <AnimatedCounter end={10} suffix="k+" />
                                            </div>
                                            <div className="text-white font-bold text-sm">Happy Users</div>
                                        </div>
                                        <div className="flex items-center justify-between px-6 py-4 rounded-full bg-gradient-to-r from-blue-400/30 to-indigo-500/30 backdrop-blur-sm border border-white/30 hover:scale-105 transition-all">
                                            <div className="text-3xl font-black text-blue-200">24/7</div>
                                            <div className="text-white font-bold text-sm">AI Support</div>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-5 rounded-[2rem] bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-300/30 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Award className="text-yellow-300" size={20} />
                                            <span className="text-white font-bold text-sm">Trusted by Top Companies</span>
                                        </div>
                                        <p className="text-white/90 text-xs leading-relaxed">
                                            Our users have landed jobs at Google, Microsoft, Amazon, and 500+ Fortune 500 companies.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ChevronDown className="text-white/70" size={36} />
                </div>
            </section>

            {/* Features Grid - Organic Cards */}
            <section className="py-24 bg-gradient-to-b from-white via-purple-50/30 to-white relative overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, purple 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-100 text-purple-700 font-bold text-sm mb-6">
                            <Target size={16} />
                            Everything You Need
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                            Powerful Tools to <span className="gradient-text-animated">Land the Job</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Designed to help you stand out in a crowded job market with cutting-edge AI technology.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 - Organic blob card */}
                        <div className="group relative">
                            <div className="relative p-8 rounded-[3rem] bg-white border border-blue-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                {/* Organic blob background */}
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-blue-500/30">
                                        <Brain size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Resume Analysis</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        Get instant, actionable feedback on your resume. Identify missing keywords and formatting issues that block you from getting interviews.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative">
                            <div className="relative p-8 rounded-[3rem] bg-white border border-purple-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-purple-500/30">
                                        <Zap size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">AI Cover Letters</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        Generate personalized cover letters in seconds. Our AI analyzes the job description and your resume to craft the perfect pitch.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative">
                            <div className="relative p-8 rounded-[3rem] bg-white border border-green-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-green-500/30">
                                        <Shield size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Job Match Scorer</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        See exactly how well you match a job description before applying. Save time by focusing on roles where you're a top candidate.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works - Flowing Design */}
            <section className="py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
                {/* Animated Waves */}
                <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden opacity-10">
                    <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="white" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                            <animate attributeName="d" dur="10s" repeatCount="indefinite" values="
                                M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                                M0,160L48,144C96,128,192,96,288,96C384,96,480,128,576,144C672,160,768,160,864,144C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                                M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                        </path>
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">How It Works</h2>
                        <p className="text-lg text-gray-300">Three simple steps to your next job.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { num: 1, title: "Upload Resume", desc: "Import your existing resume or create one from scratch using our intuitive editor.", gradient: "from-cyan-400 to-blue-500" },
                            { num: 2, title: "Analyze & Optimize", desc: "Our AI identifies gaps and adds the right keywords to beat ATS systems.", gradient: "from-purple-400 to-pink-500" },
                            { num: 3, title: "Get Hired", desc: "Apply with confidence and start getting 3x more interview invitations.", gradient: "from-green-400 to-emerald-500" }
                        ].map((step, i) => (
                            <div key={i} className="group relative">
                                <div className={`absolute -inset-2 bg-gradient-to-r ${step.gradient} rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-all`}></div>
                                <div className="relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-[3rem] p-8 hover:bg-white/15 transition-all transform hover:scale-105 duration-500">
                                    <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-2xl`}>
                                        {step.num}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-center">{step.title}</h3>
                                    <p className="text-gray-300 text-center leading-relaxed text-sm">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { end: 10000, suffix: '+', label: 'Happy Users', color: 'from-blue-500 to-indigo-600' },
                            { end: 95, suffix: '%', label: 'Success Rate', color: 'from-purple-500 to-pink-600' },
                            { end: 500, suffix: '+', label: 'Companies', color: 'from-green-500 to-emerald-600' },
                            { end: 24, suffix: '/7', label: 'Support', color: 'from-orange-500 to-red-600' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-6 rounded-[2rem] bg-gradient-to-br from-gray-50 to-purple-50 border border-purple-100 hover:border-purple-200 transition-all hover:scale-105 duration-500 shadow-sm hover:shadow-md">
                                <div className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                    <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                                </div>
                                <div className="text-gray-600 font-bold text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* FAQ - Smooth Accordion */}
            <section className="py-24 bg-gradient-to-b from-white to-purple-50/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                            Frequently Asked <span className="gradient-text-animated">Questions</span>
                        </h2>
                        <p className="text-gray-600 text-lg">Got questions? We've got answers.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "How does the ATS score work?",
                                a: "Our AI analyzes your resume against 50+ common ATS algorithms. We check for keyword density, formatting issues, and structural elements that impact how machines read your profile."
                            },
                            {
                                q: "Is my data secure?",
                                a: "Yes. We use industry-standard encryption and never sell your personal data. Resumes are processed securely and you can delete them at any time."
                            },
                            {
                                q: "Can I use the AI for any industry?",
                                a: "Absolutely. Our GPT-4 powered engine is trained on millions of job descriptions across tech, marketing, finance, healthcare, and more."
                            },
                            {
                                q: "What's included in the Free plan?",
                                a: "The Free plan includes 5 generations within 15 mins, standard templates, and our job match scorer. It's everything you need to start seeing results."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="group border border-purple-100 rounded-[2rem] overflow-hidden hover:border-purple-200 transition-all hover:shadow-md bg-white">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full p-6 flex items-center justify-between hover:bg-purple-50/50 transition-all"
                                >
                                    <h3 className="text-base font-bold text-gray-900 text-left flex items-center gap-3">
                                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center text-sm shrink-0 shadow-md">
                                            ?
                                        </span>
                                        {faq.q}
                                    </h3>
                                    <ChevronDown
                                        className={`text-purple-600 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                                        size={22}
                                    />
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ${openFaq === i ? 'max-h-64' : 'max-h-0'}`}>
                                    <p className="px-6 pb-6 pl-16 text-gray-600 leading-relaxed text-sm">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Flowing Design */}
            <section className="relative py-24 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600"></div>

                {/* Floating Organic Shapes */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full animate-float-slow blur-2xl"
                            style={{
                                width: Math.random() * 150 + 100 + 'px',
                                height: Math.random() * 150 + 100 + 'px',
                                left: Math.random() * 100 + '%',
                                top: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 5 + 's'
                            }}
                        />
                    ))}
                </div>

                <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white font-bold mb-8 shadow-2xl">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        <span>Start Your Success Story Today</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Ready to upgrade your career?
                    </h2>
                    <p className="text-white/95 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
                        Join thousands of professionals who improved their resume with ATSense and landed their dream jobs.
                    </p>
                    <Link
                        to="/register"
                        className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-600 font-bold rounded-full text-xl hover:bg-gray-50 transition-all shadow-2xl hover:shadow-white/30 hover:scale-110 transform duration-500"
                    >
                        <Rocket className="group-hover:translate-y-[-4px] transition-transform" size={24} />
                        Start For Free
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                    </Link>
                    <p className="mt-6 text-white/90 font-medium text-sm">No credit card required • Cancel anytime</p>
                </div>
            </section>
        </div>
    );
};

export default Landing;
