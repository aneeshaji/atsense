import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Builder from './pages/Builder';
import Preview from './pages/Preview';
import CoverLetterList from './pages/CoverLetterList';
import CoverLetterGenerator from './pages/CoverLetterGenerator';
import JobMatcher from './pages/JobMatcher';
import LinkedInOptimizer from './pages/LinkedInOptimizer';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Security from './pages/Security';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import Landing from './pages/Landing';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Templates from './pages/Templates';
import TemplateDetail from './pages/TemplateDetail';
import TemplateBuilder from './pages/TemplateBuilder';
import InterviewSimulator from './pages/InterviewSimulator';
import ResumeGrader from './pages/ResumeGrader';
import GuideDetail from './pages/GuideDetail';
import Maintenance from './pages/Maintenance';
import { ModalProvider } from './context/ModalContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import api from './services/api';

export default function App() {
    const [maintenance, setMaintenance] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkMaintenance = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second max timeout

            try {
                const res = await api.get('/settings', { signal: controller.signal });
                if (res.data.maintenance_mode === 'true') {
                    setMaintenance(true);
                }
            } catch (err) {
                console.error("Failed to fetch settings (Timeout or Server Error)", err);
            } finally {
                clearTimeout(timeoutId);
                setLoading(false);
            }
        };
        checkMaintenance();
    }, []);

    if (loading) return null;

	return (
		<AuthProvider>
            <ModalProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <ScrollToTop />
                    <Routes>
                        {/* Admin Routes ALWAYS Available */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />

                        {maintenance ? (
                            <Route path="*" element={<Maintenance />} />
                        ) : (
                            <>
                                {/* Public Routes with Layout */}
                                <Route element={<Layout />}>
                                    <Route path="/about" element={<About />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/privacy" element={<Privacy />} />
                                    <Route path="/terms" element={<Terms />} />
                                    <Route path="/security" element={<Security />} />
                                    <Route path="/blog" element={<Blog />} />
                                    <Route path="/blog/:id" element={<BlogDetails />} />
                                    <Route path="/guides/:slug" element={<GuideDetail />} />
                                    <Route path="/templates" element={<Templates />} />
                                    <Route path="/templates/:slug" element={<TemplateDetail />} />
                                    <Route path="/template-builder" element={<TemplateBuilder />} />
                                    <Route path="/resume-grader" element={<ResumeGrader />} />
                                </Route>

                                {/* Application Routes with Layout */}
                                <Route element={<Layout />}>
                                    <Route path="/builder" element={<Builder />} />
                                    <Route path="/preview/:id" element={<Preview />} />
                                    <Route path="/cover-letters" element={<CoverLetterList />} />
                                    <Route path="/cover-letters/:id" element={<CoverLetterGenerator />} />
                                    <Route path="/job-matcher" element={<JobMatcher />} />
                                    <Route path="/linkedin-optimizer" element={<LinkedInOptimizer />} />
                                    <Route path="/interview-prep" element={<InterviewSimulator />} />
                                </Route>

                                {/* Root Route */}
                                <Route path="/" element={<Layout />}>
                                    <Route index element={<Landing />} />
                                </Route>

                                {/* 404 Fallback */}
                                <Route path="*" element={<Navigate to="/builder" replace />} />
                            </>
                        )}
                    </Routes>
                </BrowserRouter>
            </ModalProvider>
		</AuthProvider>
	);
}