import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeEditor from './pages/ResumeEditor';
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
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

function App() {
	return (
		<AuthProvider>
			<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
				<ScrollToTop />
				<Routes>

					{/* Public Routes with Layout */}
					<Route element={<Layout />}>
						<Route path="/about" element={<About />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/privacy" element={<Privacy />} />
						<Route path="/terms" element={<Terms />} />
						<Route path="/security" element={<Security />} />
						<Route path="/blog" element={<Blog />} />
						<Route path="/blog/:id" element={<BlogDetails />} />
					</Route>

					{/* Public Routes without Layout (Login/Register) */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					{/* Protected Routes with Layout */}
					<Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/resume/:id" element={<ResumeEditor />} />
						<Route path="/preview/:id" element={<Preview />} />
						<Route path="/cover-letters" element={<CoverLetterList />} />
						<Route path="/cover-letters/:id" element={<CoverLetterGenerator />} />
						<Route path="/job-matcher" element={<JobMatcher />} />
						<Route path="/linkedin-optimizer" element={<LinkedInOptimizer />} />
					</Route>

					{/* Root Route */}
					<Route path="/" element={<Layout />}>
						<Route index element={<Landing />} />
					</Route>

					{/* 404 Fallback */}
					<Route path="*" element={<Navigate to="/dashboard" replace />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;