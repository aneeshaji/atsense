import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const About = () => {
    return (
        <div className="bg-white min-h-screen">
            <SEO
                title="About Us - Our Mission to Fix the Hiring Process"
                description="Learn how ATSense is bridging the gap between talent and opportunity using AI to help job seekers beat the ATS."
                url="https://atsense.online/about"
            />
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Empowering Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Career Journey</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        ATSense uses advanced AI to optimize your resume and cover letters, ensuring you get noticed by recruiters and Applicant Tracking Systems.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">Our Mission</div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">Bridging the gap between talent and opportunity</h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-6 font-medium">
                            We believe that every qualified candidate deserves a fair chance. Modern hiring processes rely heavily on automated systems, often filtering out great candidates due to formatting issues or keyword mismatches.
                        </p>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium">
                            ATSense creates a level playing field by providing you with the same powerful insights that recruiters use, helping you tell your professional story effectively.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-20 blur-xl"></div>
                        <div className="relative bg-white border border-gray-100 rounded-2xl shadow-xl p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">AI-Powered Analysis</h3>
                                    <p className="text-sm text-gray-500">Instant feedback on your resume</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">ATS Optimization</h3>
                                    <p className="text-sm text-gray-500">Keyword matching & formatting</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Tailored Cover Letters</h3>
                                    <p className="text-sm text-gray-500">Customized for every job application</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team/Features/Numbers Section could go here */}

            {/* CTA Section */}
            <div className="bg-gray-950 py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay opacity-30 blur-3xl pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to land your dream job?</h2>
                    <p className="text-gray-400 text-xl mb-12 font-medium max-w-2xl mx-auto">
                        Join thousands of job seekers who are using ATSense to optimize their job search. Completely frictionless to start.
                    </p>
                    <Link to="/builder" className="inline-block px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 transform">
                        Start Building Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;
