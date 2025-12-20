import SEO from '../components/SEO';

const Privacy = () => {
    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <SEO title="Privacy Policy - ATSense" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
                <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
                    <p className="text-lg">
                        Last updated: December 20, 2025
                    </p>
                    <p>
                        At ATSense, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our AI-powered resume optimization services.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Data We Collect</h2>
                    <p>
                        We collect information that you provide directly to us, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Account information (name, email).</li>
                        <li>Resume data (uploaded files, text content).</li>
                        <li>Usage data (how you interact with our tools).</li>
                    </ul>
                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. How We Use AI</h2>
                    <p>
                        We use OpenAI's GPT-4 to analyze and optimize your resume content. Your data is sent to OpenAI securely and is protected by their enterprise-grade security. We do not use your personal data to train public AI models.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Data Retention</h2>
                    <p>
                        You have full control over your data. You can delete your resumes and account at any time through the dashboard. Once deleted, data is permanently removed from our active systems.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Contact Us</h2>
                    <p>
                        If you have questions about this policy, please contact us at privacy@atsense.com.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
