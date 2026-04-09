import { useEffect } from 'react';
import SEO from '../components/SEO';

const Privacy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen py-20 font-sans selection:bg-slate-100 selection:text-slate-900">
            <SEO 
                title="Privacy Policy - How We Protect Your Data" 
                description="Read the ATSense Privacy Policy. Learn how we securely handle your resume data and personal information with industry-leading encryption."
            />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Brand Header */}
                <header className="mb-16 border-b border-slate-100 pb-10">
                    <div className="flex items-center mb-8">
                        <span className="font-black text-2xl text-slate-900 tracking-tight">ATSense</span>
                        <span className="text-slate-300 mx-3 text-xl font-light">/</span>
                        <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mt-0.5">Legal</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-5">Privacy Policy</h1>
                    <p className="text-xl text-slate-600 max-w-2xl leading-relaxed mb-6 font-medium">
                        At ATSense, we believe in complete transparency. This policy outlines exactly how we handle, protect, and process your personal data.
                    </p>
                    <div className="flex items-center text-sm font-medium text-slate-500 uppercase tracking-wider">
                         <span>Effective Date: December 20, 2025</span>
                    </div>
                </header>

                {/* Standard Document Content */}
                <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-indigo-600 hover:prose-a:text-indigo-700">
                    
                    <p className="text-lg text-slate-800 mb-12 leading-relaxed">
                        At ATSense, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our AI-powered resume optimization services.
                    </p>

                    <section className="mb-12">
                        <h2>1. Data We Collect</h2>
                        <p>We collect information that you provide directly to us in order to deliver our services effectively, including:</p>
                        <ul>
                            <li><strong>Basic Details:</strong> Your full name, email address, phone number, and any other contact information provided.</li>
                            <li><strong>Account Information:</strong> Information securely used for registration and authentication.</li>
                            <li><strong>Resume Data:</strong> Uploaded files, text content, employment history, and educational background.</li>
                            <li><strong>Usage Metrics:</strong> Anonymized interaction data detailing how you use our tools to help us improve.</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2>2. How We Use AI</h2>
                        <p>
                            We use sophisticated large language models (such as OpenAI's GPT-4) to analyze and optimize your resume content. Your data is sent directly securely via API and is protected by comprehensive enterprise-grade security protocols. 
                        </p>
                        <p>
                            We do not use your personal data to train public AI models. All interactions on our platform are transient and used strictly for analyzing your own specific skills privately.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2>3. Data Retention</h2>
                        <p>
                            You have absolute full control over your data. You may delete individual resumes or your entire account at any time through your dashboard. Once deleted, the corresponding data is permanently removed from our active systems immediately.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2>4. Contact Us</h2>
                        <p>
                            If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us at:
                        </p>
                        <p>
                            <a href="mailto:privacy@atsense.online" className="font-medium text-slate-900 hover:text-indigo-600">privacy@atsense.online</a>
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Privacy;
