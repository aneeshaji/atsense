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
import SharedSpace from './pages/SharedSpace';
import { ModalProvider } from './context/ModalContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import AnalyticsManager from './components/AnalyticsManager';
import { SettingsProvider } from './context/SettingsContext';

export default function App() {
    return (
        <AuthProvider>
            <SettingsProvider>
                <ModalProvider>
                    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                        <ScrollToTop />
                        <AnalyticsManager />

                        <Routes>
                            {/* Admin Routes ALWAYS Available */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />

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
                                <Route path="/community" element={<SharedSpace />} />
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
                        </Routes>
                    </BrowserRouter>
                </ModalProvider>
            </SettingsProvider>
        </AuthProvider>
    );
}