import SEO from '../components/SEO';

const Terms = () => {
    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <SEO title="Terms of Service - ATSense" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
                <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
                    <p className="text-lg">
                        Last updated: December 20, 2025
                    </p>
                    <p>
                        By using ATSense, you agree to the following terms and conditions. Please read them carefully.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Use of Services</h2>
                    <p>
                        ATSense provides AI-powered tools for resume analysis and generation. You are responsible for the accuracy of the information you provide and for ensuring that your use of our services complies with applicable laws.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Account Responsibility</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized use of your account.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Limitations of AI</h2>
                    <p>
                        While our AI provides highly accurate suggestions, we cannot guarantee job placement or interview success. The final quality and accuracy of your resume are your own responsibility.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Intellectual Property</h2>
                    <p>
                        The ATSense platform, its branding, and its underlying technology are protected by intellectual property laws. You retain ownership of the content you upload, but grant us a license to process it for the purpose of providing our services.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Termination</h2>
                    <p>
                        We reserve the right to suspend or terminate your access to the service if you violate these terms or engage in fraudulent activity.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
