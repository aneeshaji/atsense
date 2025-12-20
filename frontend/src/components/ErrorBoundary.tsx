import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-indigo-900/5 border border-gray-100 p-10 text-center">
                        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <AlertTriangle size={40} />
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 mb-4">Something went wrong</h2>
                        <p className="text-gray-600 mb-10 leading-relaxed">
                            We're sorry, but an unexpected error occurred. Don't worry, your data is safe.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                            >
                                <RefreshCcw size={18} />
                                Reload Page
                            </button>
                            <a
                                href="/"
                                className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-700 font-bold rounded-2xl hover:bg-gray-100 transition-all"
                            >
                                <Home size={18} />
                                Back to Home
                            </a>
                        </div>

                        {import.meta.env.DEV && (
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <p className="text-xs font-mono text-red-500 bg-red-50 p-3 rounded-lg overflow-auto text-left max-h-40">
                                    {this.state.error?.message}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
