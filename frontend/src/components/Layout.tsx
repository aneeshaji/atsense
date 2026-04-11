import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    const location = useLocation();
    
    // App/Workspace routes — inner max-w-7xl container, no footer
    const isAppTools = [
        '/builder', 
        '/job-matcher', 
        '/linkedin-optimizer', 
        '/interview-prep', 
        '/cover-letters', 
        '/preview'
    ].some(path => location.pathname.startsWith(path));

    // Full-width marketing pages — no padding or max-width wrapper at all
    // These pages manage their own section widths internally
    const isFullWidthPage = [
        '/',
        '/about',
        '/contact',
        '/blog',
        '/templates',
        '/resume-grader',
        '/community',
    ].some(path =>
        path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path)
    );

    const renderContent = () => {
        if (isAppTools) {
            return (
                <main className="flex-1 py-6 mt-20">
                    <div className="max-w-full mx-auto px-4 md:px-8 lg:px-12">
                        <Outlet />
                    </div>
                </main>
            );
        }

        if (isFullWidthPage) {
            return (
                <main className="flex-1 mt-20 w-full">
                    <Outlet />
                </main>
            );
        }

        // Standard content pages (privacy, terms, security, guides, etc.)
        return (
            <main className="flex-1 mt-20 container mx-auto px-4 py-8 max-w-7xl">
                <Outlet />
            </main>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar is always visible at the top */}
            <Navbar />

            <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
                {renderContent()}

                {/* Footer is hidden in App/Workspace views */}
                {!isAppTools && <Footer />}
            </div>
        </div>
    );
};

export default Layout;