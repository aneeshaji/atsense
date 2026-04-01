import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, HelpCircle, CheckCircle, X } from 'lucide-react';

interface ModalOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'danger' | 'success';
    onConfirm: () => void;
}

interface ModalContextType {
    showConfirm: (options: ModalOptions) => void;
    showAlert: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'danger') => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ModalOptions | null>(null);

    const showConfirm = useCallback((newOptions: ModalOptions) => {
        setOptions(newOptions);
        setIsOpen(true);
    }, []);

    const showAlert = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' | 'danger' = 'info') => {
        setOptions({
            title,
            message,
            type,
            confirmText: 'OK',
            onConfirm: () => {}, // No callback needed for pure alert
        });
        setIsOpen(true);
    }, []);

    const handleConfirm = () => {
        if (options?.onConfirm) options.onConfirm();
        setIsOpen(false);
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    return (
        <ModalContext.Provider value={{ showConfirm, showAlert }}>
            {children}
            
            {/* Modal Portal */}
            {isOpen && options && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in"
                        onClick={handleCancel}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="relative bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-[360px] overflow-hidden animate-scale-in border border-gray-100/50">
                        <div className="p-10 flex flex-col items-center text-center">
                            {/* Stylish Icon Hub */}
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${
                                options.type === 'danger' ? 'bg-red-50 text-red-500' :
                                options.type === 'warning' ? 'bg-amber-50 text-amber-500' :
                                options.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                                'bg-indigo-50 text-indigo-500'
                            }`}>
                                {options.type === 'danger' ? <AlertCircle size={32} strokeWidth={1.5} /> : 
                                 options.type === 'warning' ? <AlertCircle size={32} strokeWidth={1.5} /> :
                                 options.type === 'success' ? <CheckCircle size={32} strokeWidth={1.5} /> : 
                                 <HelpCircle size={32} strokeWidth={1.5} />}
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 leading-tight mb-3">
                                {options.title}
                            </h3>
                            <p className="text-gray-500 text-[15px] font-medium leading-relaxed mb-8">
                                {options.message}
                            </p>
                            
                            <div className="flex flex-col w-full gap-3">
                                <button
                                    onClick={handleConfirm}
                                    className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 shadow-lg ${
                                        options.type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200' :
                                        options.type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' :
                                        'bg-gray-900 hover:bg-indigo-600 text-white shadow-indigo-100'
                                    }`}
                                >
                                    {options.confirmText || 'Confirm'}
                                </button>
                                {options.cancelText !== null && (
                                    <button
                                        onClick={handleCancel}
                                        className="w-full py-4 text-gray-400 hover:text-gray-600 font-bold text-xs uppercase tracking-widest transition-colors"
                                    >
                                        {options.cancelText || 'Maybe Later'}
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Discreet Minimalist Close */}
                        <button 
                            onClick={handleCancel}
                            className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 transition-colors p-1"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be used within a ModalProvider');
    return context;
};
