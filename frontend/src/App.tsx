import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import AnalyticsManager from './components/AnalyticsManager';
import { SettingsProvider } from './context/SettingsContext';

const Builder = lazy(() => import('./pages/Builder'));
const Preview = lazy(() => import('./pages/Preview'));
const CoverLetterList = lazy(() => import('./pages/CoverLetterList'));
const CoverLetterGenerator = lazy(() => import('./pages/CoverLetterGenerator'));
const JobMatcher = lazy(() => import('./pages/JobMatcher'));
const LinkedInOptimizer = lazy(() => import('./pages/LinkedInOptimizer'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Security = lazy(() => import('./pages/Security'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const Landing = lazy(() => import('./pages/Landing'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Templates = lazy(() => import('./pages/Templates'));
const TemplateDetail = lazy(() => import('./pages/TemplateDetail'));
const TemplateBuilder = lazy(() => import('./pages/TemplateBuilder'));
const InterviewSimulator = lazy(() => import('./pages/InterviewSimulator'));
const ResumeGrader = lazy(() => import('./pages/ResumeGrader'));
const GuideDetail = lazy(() => import('./pages/GuideDetail'));
const SharedSpace = lazy(() => import('./pages/SharedSpace'));
const CompanyTailorPage = lazy(() => import('./pages/CompanyTailorPage'));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'));

const PageLoader = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
);

export default function App() {
    return (
        <AuthProvider>
            <SettingsProvider>
                <ModalProvider>
                    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                        <ScrollToTop />
                        <AnalyticsManager />

                        <Suspense fallback={<PageLoader />}>
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
                                <Route path="/tailor" element={<Navigate to="/tailor/google" replace />} />
                                <Route path="/tailor/:companyOrRole" element={<CompanyTailorPage />} />
                                <Route path="/vs/:competitor" element={<ComparisonPage />} />
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
                        </Suspense>
                    </BrowserRouter>
                </ModalProvider>
            </SettingsProvider>
        </AuthProvider>
    );
}