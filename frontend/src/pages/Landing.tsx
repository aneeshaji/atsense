import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Zap, TrendingUp, Star, ArrowRight } from 'lucide-react';

import SEO from '../components/SEO';

const Landing = () => {
    return (
        <div className="bg-white">
            <SEO
                title="ATSense - #1 AI Resume Optimizer & Builder"
                description="Stop getting rejected. ATSense uses GPT-4 to optimize your resume for ATS systems and helps you land 3x more interviews."
                keywords="resume optimizer, ats checker, ai resume builder, cv optimization, career tools"
            />
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm mb-8 animate-fade-in-up">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                            </span>
                            Now with GPT-4 Powered Analysis
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
                            Beat the ATS. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Get Hired Faster.</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Stop getting rejected by robots. Our AI-powered resume optimizer ensures your application passes the Applicant Tracking System and lands in front of human recruiters.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="inline-flex justify-center items-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1">
                                Optimize My Resume Free
                                <ArrowRight className="ml-2" size={20} />
                            </Link>
                            <Link to="/about" className="inline-flex justify-center items-center px-8 py-4 text-lg font-bold rounded-xl text-gray-700 bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all">
                                How It Works
                            </Link>
                        </div>
                        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="text-green-500" size={18} />
                                No credit card required
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="text-green-500" size={18} />
                                95% Success Rate
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background decorative blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-purple-100/40 to-transparent rounded-bl-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-indigo-100/40 to-transparent rounded-tr-full blur-3xl transform -translate-x-1/3 translate-y-1/4"></div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to land the job</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful tools designed to help you stand out in a crowded job market.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow group">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                <FileText size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Resume Analysis</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Get instant, actionable feedback on your resume. Identify missing keywords and formatting issues that block you from getting interviews.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow group">
                            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Cover Letters</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Generate personalized cover letters in seconds. Our AI analyzes the job description and your resume to craft the perfect pitch.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow group">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Job Match Scorer</h3>
                            <p className="text-gray-600 leading-relaxed">
                                See exactly how well you match a job description before applying. Save time by focusing on roles where you're a top candidate.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-24 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                        <p className="text-xl text-gray-400">Three simple steps to your next job.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-700 -z-0"></div>

                        {/* Step 1 */}
                        <div className="relative z-10 text-center">
                            <div className="w-24 h-24 bg-gray-800 border-4 border-gray-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-xl">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-3">Upload Resume</h3>
                            <p className="text-gray-400">Import your existing resume or create one from scratch.</p>
                        </div>
                        {/* Step 2 */}
                        <div className="relative z-10 text-center">
                            <div className="w-24 h-24 bg-indigo-600 border-4 border-gray-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-xl shadow-indigo-900/50">
                                2
                            </div>
                            <h3 className="text-xl font-bold mb-3">Analyze & Optimize</h3>
                            <p className="text-gray-400">Our AI identifies gaps and adds the right keywords.</p>
                        </div>
                        {/* Step 3 */}
                        <div className="relative z-10 text-center">
                            <div className="w-24 h-24 bg-gray-800 border-4 border-gray-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-xl">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-3">Get Hired</h3>
                            <p className="text-gray-400">Apply with confidence and start getting interviews.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Flexible plans for every career stage</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Start for free and upgrade as you grow. No hidden fees.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Free Tier */}
                        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-black text-gray-900">$0</span>
                                    <span className="text-gray-500 ml-2 font-medium">/forever</span>
                                </div>
                                <p className="mt-4 text-gray-500 font-medium">Perfect for getting started with your job search.</p>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {[
                                    'Up to 3 AI Resume Analyses',
                                    'Standard ATS Optimization',
                                    'Basic Job Match Scorer',
                                    'Standard Resume Templates',
                                    'Community Support'
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                                        <CheckCircle className="text-green-500 shrink-0" size={18} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link to="/register" className="w-full py-4 px-6 text-center font-bold text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-colors">
                                Get Started Free
                            </Link>
                        </div>

                        {/* Pro Tier (Coming Soon) */}
                        <div className="relative p-10 rounded-3xl bg-white border-2 border-indigo-500 shadow-2xl shadow-indigo-100 flex flex-col transform md:scale-105 z-20">
                            <div className="absolute top-0 right-10 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                                Coming Soon
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">Best Value</span>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-black text-gray-900">$9</span>

                                    <span className="text-gray-500 ml-2 font-medium">/month</span>
                                </div>
                                <p className="mt-4 text-gray-500 font-medium">Advanced tools for serious job seekers ready to land top roles.</p>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {[
                                    'Unlimited GPT-4 Optimizations',
                                    'Personalized AI Cover Letters',
                                    'LinkedIn Profile Optimizer',
                                    'Priority Support (24h)',
                                    'Exclusive Premium Templates',
                                    'Custom Career Roadmap'
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                                        <CheckCircle className="text-indigo-500 shrink-0" size={18} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button disabled className="w-full py-4 px-6 text-center font-bold text-white bg-indigo-600 rounded-2xl opacity-80 cursor-not-allowed">
                                Join the Waitlist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-60"></div>
            </div>

            {/* Testimonials */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Loved by job seekers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Alex Morgan",
                                role: "Software Engineer",
                                text: "I applied to 50 jobs with no response. After using ATSense, I got 3 interviews in a week. The keyword optimization is a game changer.",
                                image: "AM"
                            },
                            {
                                name: "Sarah Jenkins",
                                role: "Marketing Manager",
                                text: "The cover letter generator saved me hours. It writes better than I do! Highly recommend for anyone serious about their career.",
                                image: "SJ"
                            },
                            {
                                name: "David Chen",
                                role: "Product Designer",
                                text: "Finally, a tool that tells you exactly what's wrong with your resume. Simple, fast, and effective.",
                                image: "DC"
                            }
                        ].map((t, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                                <div className="flex text-yellow-400 mb-4">
                                    {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-gray-600 mb-6 flex-1 italic">"{t.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {t.image}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                                        <p className="text-gray-500 text-xs">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-600">Got questions? We've got answers.</p>
                    </div>

                    <div className="space-y-6">
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
                                a: "The Free plan includes 3 full AI analyses, standard templates, and our job match scorer. It's everything you need to start seeing results."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="group p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">?</span>
                                    {faq.q}
                                </h3>
                                <p className="text-gray-600 leading-relaxed pl-11">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-indigo-600 py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to upgrade your career?</h2>
                    <p className="text-indigo-100 text-xl mb-10 max-w-2xl mx-auto">
                        Join thousands of professionals who improved their resume with ATSense.
                    </p>
                    <Link to="/register" className="inline-block px-10 py-4 bg-white text-indigo-600 font-bold rounded-xl text-lg hover:bg-gray-50 transition-colors shadow-2xl">
                        Start For Free
                    </Link>
                    <p className="mt-6 text-indigo-200 text-sm">No credit card required • Cancel anytime</p>
                </div>
            </div>
        </div>
    );
};

export default Landing;
