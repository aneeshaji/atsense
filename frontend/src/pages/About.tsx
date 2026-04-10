import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Target, Users, Zap, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

const About = () => {
    return (
        <main className="font-sans bg-white overflow-hidden">
            <SEO
                title="About Us - Reimagining the Job Search with AI"
                description="Learn the story behind ATSense. We're on a mission to empower job seekers with premium AI tools that beat the ATS and land dream interviews."
                url="https://atsense.online/about"
            />

            {/* Premium Hero Section - Matching Landing Page Theme */}
            <section className="relative bg-[#0b1f3b] pt-24 pb-40 overflow-hidden text-white">
                {/* Glowing Background Elements */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen opacity-50 pointer-events-none animate-pulse duration-[5000ms]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-blue-600/20 blur-[100px] rounded-full mix-blend-screen opacity-60 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[#60efff] font-black text-xs uppercase tracking-[0.2em] mb-8">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Our Origin Story</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]">
                        We're Here to Fix the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60efff] to-blue-400">Broken Hiring Process</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                        ATSense was founded on a simple belief: the best talent shouldn't be hidden by bad algorithms. We build tools that make you impossible to ignore.
                    </p>
                </div>
            </section>

            {/* Stats/Highlight Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Job Seekers Helped', val: '50k+', icon: Users, color: 'text-blue-500' },
                        { label: 'Interview Rate Increase', val: '3x', icon: Zap, color: 'text-amber-500' },
                        { label: 'ATS Systems Bypassed', val: '100%', icon: ShieldCheck, color: 'text-emerald-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 transition-all hover:-translate-y-2 group">
                            <stat.icon className={`w-10 h-10 ${stat.color} mb-6 group-hover:scale-110 transition-transform duration-500`} />
                            <h3 className="text-4xl font-black text-gray-900 mb-2">{stat.val}</h3>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Our Philosophy</div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight leading-tight">Bridging the gap between human talent and AI algorithms.</h2>
                        <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-medium">
                            <p>
                                Modern hiring relies heavily on automated Applicant Tracking Systems (ATS). While these systems save companies time, they often filter out qualified, incredible human beings because their resumes don't speak "robot."
                            </p>
                            <p>
                                At ATSense, we don't just build a "resume builder." We build a career translation layer. We take your unique professional story and translate it into a language that both people and machines understand perfectly.
                            </p>
                        </div>
                        <div className="pt-8 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-xl text-sm">
                                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                                <span>Human Centered</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-xl text-sm">
                                <Target className="w-4 h-4 text-indigo-500" />
                                <span>Data Driven</span>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 relative">
                        <div className="absolute -inset-10 bg-indigo-500/5 blur-[100px] rounded-full"></div>
                        <div className="relative aspect-square bg-[#0b1f3b] rounded-[3rem] overflow-hidden group shadow-2xl">
                             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent"></div>
                             {/* Abstract AI Visual Mockup */}
                             <div className="absolute inset-x-8 top-12 bottom-12 border-2 border-white/10 rounded-2xl flex flex-col items-center justify-center gap-6 p-8">
                                 <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div className="w-3/4 h-full bg-gradient-to-r from-[#60efff] to-blue-400"></div>
                                 </div>
                                 <div className="w-full h-2 bg-white/10 rounded-full"></div>
                                 <div className="w-full h-2 bg-white/10 rounded-full"></div>
                                 <div className="w-20 h-20 rounded-full border-4 border-[#60efff] flex items-center justify-center animate-pulse">
                                     <Sparkles className="w-10 h-10 text-[#60efff]" />
                                 </div>
                                 <div className="grid grid-cols-2 gap-4 w-full pt-4">
                                     <div className="h-2 bg-white/10 rounded-full"></div>
                                     <div className="h-2 bg-white/10 rounded-full"></div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Values / Features Section */}
            <section className="bg-gray-50 py-32 rounded-[4rem]">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Values that drive us</h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">The ATSense Guarantee</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Privacy First', desc: 'Your career data stays yours. We don\'t sell your info or share resumes without permission.' },
                            { title: 'Always Free to Start', desc: 'Experience the AI magic instantly. No credit cards, no login required for basic building.' },
                            { title: 'Scientific Precision', desc: 'Our templates are built based on real eye-tracking studies from Fortune 500 recruiters.' },
                        ].map((v, i) => (
                            <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-gray-100 hover:border-indigo-200 transition-all duration-300">
                                <h4 className="text-xl font-black text-gray-900 mb-4">{v.title}</h4>
                                <p className="text-gray-500 font-medium leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                 </div>
            </section>

            {/* Premium CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
                 <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-700 rounded-[3.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 blur-[100px] rounded-full -ml-48 -mb-48"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Your next chapter begins here.</h2>
                        <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                            Stop guessing what recruiters want. Use our intelligence to build a career that truly reflects your potential.
                        </p>
                        <Link 
                            to="/builder" 
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-white/20 hover:-translate-y-1 active:scale-95 group"
                        >
                            <span>Launch ATS Workspace</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                 </div>
            </section>
        </main>
    );
};

export default About;

