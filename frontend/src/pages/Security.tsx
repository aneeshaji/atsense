import { Shield, Lock, Server } from 'lucide-react';

const Security = () => {
    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Security at ATSense</h1>
                    <p className="text-lg text-gray-600">
                        We take the security of your data seriously. Here's how we protect your information.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                            <Shield size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Data Protection</h3>
                        <p className="text-sm text-gray-600">
                            AES-256 encryption at rest and TLS 1.3 encryption in transit for all sensitive data.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                            <Lock size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Access Control</h3>
                        <p className="text-sm text-gray-600">
                            Strict role-based access controls and multi-factor authentication for internal tools.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                            <Server size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Infrastructure</h3>
                        <p className="text-sm text-gray-600">
                            Hosted on secure cloud infrastructure with 24/7 monitoring and automated backups.
                        </p>
                    </div>
                </div>

                <div className="prose prose-indigo max-w-none text-gray-600">
                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Vulnerability Disclosure</h2>
                    <p>
                        If you believe you have found a security vulnerability in ATSense, please contact us at security@atsense.com.
                        We appreciate your help in disclosing any vulnerabilities in a responsible manner.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Compliance</h2>
                    <p>
                        We are committed to complying with all applicable data protection laws and regulations. We regularly audit our
                        systems and processes to ensure compliance with industry standards.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Security;
