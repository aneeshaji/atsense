import { useEffect } from 'react';
import SEO from '../components/SEO';

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen py-20 font-sans selection:bg-slate-100 selection:text-slate-900">
            <SEO 
                title="Terms of Service - ATSense Platform Rules" 
                description="Review the ATSense Terms of Service. By using our AI resume builder, you agree to our platform rules regarding data processing and usage."
            />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Brand Header */}
                <header className="mb-16 border-b border-slate-100 pb-10">
                    <div className="flex items-center mb-8">
                        <span className="font-black text-2xl text-slate-900 tracking-tight">ATSense</span>
                        <span className="text-slate-300 mx-3 text-xl font-light">/</span>
                        <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mt-0.5">Legal</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-5">Terms of Service</h1>
                    <p className="text-xl text-slate-600 max-w-2xl leading-relaxed mb-6 font-medium">
                        Welcome to ATSense. By using our services, you agree to these legal terms. Please read them carefully.
                    </p>
                    <div className="flex items-center text-sm font-medium text-slate-500 uppercase tracking-wider">
                         <span>Effective Date: December 20, 2025</span>
                    </div>
                </header>

                {/* Standard Document Content */}
                <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-indigo-600 hover:prose-a:text-indigo-700">
                    
                    <p className="text-lg text-slate-800 mb-12">
                        By using ATSense, you agree to the following terms and conditions. These terms govern your use of our website, services, and any content or tools we offer.
                    </p>

                    <section className="mb-12">
                        <h2>1. Use of Services</h2>
                        <p>
                            ATSense provides AI-powered tools for resume analysis and generation. You are responsible for the accuracy of the information you provide and for ensuring that your use of our services complies with applicable laws. 
                        </p>
                        <p>
                            By using our service, you explicitly consent to the collection and processing of your basic personal details (such as name, email, and contact information) as comprehensively described in our <a href="/privacy" className="hover:text-indigo-600">Privacy Policy</a>.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2>2. Account Responsibility</h2>
                        <p>
                            You are strictly responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized use of your account or any other breach of security. We cannot and will not be liable for any loss or damage arising from your failure to comply with this security obligation.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2>3. Limitations of AI</h2>
                        <p>
                            While our AI models provide highly accurate, industry-standard suggestions, we cannot guarantee job placement, interview success, or career progression. The final quality, formatting, and accuracy of your resume are entirely your own responsibility. We recommend thoroughly reviewing all AI-generated content before submission to employers.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2>4. Intellectual Property</h2>
                        <p>
                            The ATSense platform, its distinct branding, design elements, and underlying proprietary technology are protected by intellectual property laws. You retain full ownership of the personal content you upload, but you grant us a limited, secure license to process it solely for the purpose of providing our expected services to you.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2>5. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate your access to the service immediately, without prior notice or liability, if you fundamentally violate these terms, engage in fraudulent activity, or abuse the API systems that power ATSense.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Terms;
