import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send an email
        alert('Thanks for contacting us! We will get back to you shortly.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="bg-white min-h-screen py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Get in touch</h1>
                    <p className="text-xl text-gray-600">
                        Have questions about our AI or need help with your resume? We're here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div>
                        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Email Us</h4>
                                        <p className="text-gray-600">support@atsense.com</p>
                                        <p className="text-gray-600">business@atsense.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Office</h4>
                                        <p className="text-gray-600">123 AI Innovation Drive</p>
                                        <p className="text-gray-600">San Francisco, CA 94103</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Phone</h4>
                                        <p className="text-gray-600">+1 (555) 123-4567</p>
                                        <p className="text-gray-500 text-sm">Mon-Fri from 9am to 6pm PST</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
