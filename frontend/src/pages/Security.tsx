import SEO from '../components/SEO';
import { Shield, Lock, Server, EyeOff } from 'lucide-react';

const Security = () => {
    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <SEO title="Security - ATSense" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Security at ATSense</h1>
                    <p className="text-xl text-gray-600">Your professional data is private, secure, and under your control.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="p-8 rounded-2xl bg-indigo-50 border border-indigo-100">
                        <Shield className="text-indigo-600 mb-4" size={32} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Data Encryption</h3>
                        <p className="text-gray-600">All data transferred between your browser and our servers is encrypted using industry-standard SSL/TLS protocols.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-purple-50 border border-purple-100">
                        <Lock className="text-purple-600 mb-4" size={32} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Secure AI Processing</h3>
                        <p className="text-gray-600">We use OpenAI's API through an enterprise-grade secure connection. Your data is not stored permanently by the AI provider and is not used for public model training.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-teal-50 border border-teal-100">
                        <Server className="text-teal-600 mb-4" size={32} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Cloud Security</h3>
                        <p className="text-gray-600">Our infrastructure is hosted on leading cloud providers with rigorous physical and digital security measures.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-orange-50 border border-orange-100">
                        <EyeOff className="text-orange-600 mb-4" size={32} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy by Design</h3>
                        <p className="text-gray-600">We only collect the data necessary to provide our service. You can delete your data at any time with a single click.</p>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-3xl p-10 text-white">
                    <h2 className="text-2xl font-bold mb-6">Our Commitment</h2>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                        We understand that your resume contains sensitive personal and professional information. We treat your data with the same care we would our own.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>We never sell your data to third parties.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Your resumes are yours—delete them anytime.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Transparency is our core value.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Security;
