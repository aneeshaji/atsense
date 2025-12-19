const Privacy = () => {
    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
                <div className="prose prose-indigo max-w-none text-gray-600">
                    <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
                    <p>
                        Welcome to ATSense ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you
                        about your privacy rights and how the law protects you.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Data We Collect</h2>
                    <p>
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                        <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                        <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
                        <li><strong>Resume Data</strong> includes content you upload for analysis.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Data</h2>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li>To provide the AI analysis services you requested.</li>
                        <li>To manage your account and subscription.</li>
                        <li>To improve our website and services.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Data Security</h2>
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
                    <p>
                        If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@atsense.com.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
