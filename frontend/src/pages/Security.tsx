import { useEffect } from 'react';
import SEO from '../components/SEO';

const Security = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen py-20 font-sans selection:bg-slate-100 selection:text-slate-900">
            <SEO title="Data Security - ATSense" />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Brand Header */}
                <header className="mb-16 border-b border-slate-100 pb-10">
                    <div className="flex items-center mb-8">
                        <span className="font-black text-2xl text-slate-900 tracking-tight">ATSense</span>
                        <span className="text-slate-300 mx-3 text-xl font-light">/</span>
                        <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mt-0.5">Security</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-5">Data Security</h1>
                    <p className="text-xl text-slate-600 max-w-2xl leading-relaxed mb-6 font-medium">
                        Your professional data is private, secure, and completely under your control at ATSense.
                    </p>
                    <div className="flex items-center text-sm font-medium text-slate-500 uppercase tracking-wider">
                         <span>Effective Date: December 20, 2025</span>
                    </div>
                </header>

                {/* Standard Document Content */}
                <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-teal-600 hover:prose-a:text-teal-700">
                    
                    <p className="text-lg text-slate-800 mb-12">
                        Your professional data is private, secure, and completely under your control at ATSense. We implement stringent technical constraints and advanced architectural design to ensure your career data is perpetually safe from unauthorized access.
                    </p>

                    <section className="mb-12">
                        <h2>1. Data Encryption</h2>
                        <p>
                            All data transferred between your browser and our servers is strictly encrypted using industry-standard SSL/TLS protocols. At rest, sensitive database fields are heavily encrypted to prevent intrusion.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2>2. Secure AI Processing</h2>
                        <p>
                            We exclusively use leading AI LLM APIs (like OpenAI) through an enterprise-grade secure connection. The data you process is <strong>never stored permanently</strong> by the AI provider and is <strong>never</strong> utilized to train or fine-tune public language models.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2>3. Cloud Security</h2>
                        <p>
                            Our digital infrastructure resides safely within leading global cloud providers. These platforms exercise rigorous physical perimeter controls, continuously patched operating system environments, and around-the-clock digital threat monitoring.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2>4. Privacy by Design</h2>
                        <p>
                            We inherently only collect the precise minimal data necessary to provide our service successfully. This 'lean data' approach ensures your privacy footprint remains small. You can automatically purge your data completely at any time with a single click inside your workspace.
                        </p>
                    </section>

                    <section className="mb-12 pt-12 border-t border-slate-100">
                        <h2 className="text-2xl mt-0">Our Core Commitment</h2>
                        <p>
                            We intimately understand that your career history contains deeply sensitive personal details. We are committed to treating this data with the absolute identical care we give towards our own proprietary source code.
                        </p>
                        <ul>
                            <li><strong>Zero Data Selling:</strong> We absolutely never sell your information strictly to any third-party marketing entities.</li>
                            <li><strong>Total Control:</strong> Your parsed resumes are exclusively yours. Permanently delete them and your entire account anytime.</li>
                            <li><strong>Maximum Transparency:</strong> We operate with transparency at our foundation. What you read is what we practice securely.</li>
                        </ul>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Security;
