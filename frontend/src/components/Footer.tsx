import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand Section - Spans 2 columns on large screens */}
                    <div className="col-span-2 lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                <span className="font-bold text-lg">A</span>
                            </div>
                            <span className="font-bold text-xl text-gray-900">ATSense</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
                            Helping job seekers land their dream jobs with AI-powered resume optimization and intelligent insights.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 text-sm">Product</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Resumes</Link></li>
                            <li><Link to="/cover-letters" className="hover:text-indigo-600 transition-colors">Cover Letters</Link></li>
                            <li><Link to="/job-matcher" className="hover:text-indigo-600 transition-colors">Job Matcher</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 text-sm">Company</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link to="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
                            <li><Link to="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
                            <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 text-sm">Legal</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link></li>
                            <li><Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link></li>
                            <li><Link to="/security" className="hover:text-indigo-600 transition-colors">Security</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-400">
                        &copy; {currentYear} ATSense Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
