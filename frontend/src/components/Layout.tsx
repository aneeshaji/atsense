import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    const location = useLocation();
    
    // Determine if we are in the "App" / "Workspace" context
    const isAppTools = [
        '/builder', 
        '/job-matcher', 
        '/linkedin-optimizer', 
        '/interview-prep', 
        '/cover-letters', 
        '/preview'
    ].some(path => location.pathname.startsWith(path));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar is always visible at the top */}
            <Navbar />

            {/* Main Content Area - Center-aligned for Workspace focus */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-500 overflow-x-hidden">
                <main className={`flex-1 ${isAppTools ? 'py-6 mt-20' : 'container mx-auto px-4 py-8 max-w-7xl mt-20'}`}>
                    <div className={isAppTools ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' : ''}>
                        <Outlet />
                    </div>
                </main>

                {/* Footer is hidden in App/Workspace views */}
                {!isAppTools && <Footer />}
            </div>
        </div>
    );
};

export default Layout;