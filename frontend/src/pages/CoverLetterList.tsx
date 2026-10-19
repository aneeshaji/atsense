import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, Trash2, Plus, ArrowRight, Calendar, Building2, Briefcase } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import { SkeletonGrid } from '../components/Skeleton';
import SEO from '../components/SEO';

function CoverLetterList() {
    const [letters, setLetters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [letterToDelete, setLetterToDelete] = useState<string | null>(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('atsense_cover_letters_list');
            if (stored) {
                setLetters(JSON.parse(stored));
            }
        } catch (err) {
            console.error("Failed to load cover letters from local storage", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDelete = (id: string) => {
        setLetterToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!letterToDelete) return;
        try {
            const updatedLetters = letters.filter(l => l.id !== letterToDelete);
            setLetters(updatedLetters);
            localStorage.setItem('atsense_cover_letters_list', JSON.stringify(updatedLetters));
            showToast('Cover letter deleted successfully', 'success');
            setShowDeleteModal(false);
            setLetterToDelete(null);
        } catch (err) {
            console.error(err);
            showToast('Failed to delete cover letter', 'error');
        }
    };

    if (loading) {
        return (
            <div className="py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="text-3xl font-black text-slate-900 tracking-tight">Cover Letters</div>
                        <p className="text-slate-500 mt-1">AI-generated personalized letters</p>
                    </div>
                </div>
                <SkeletonGrid count={6} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SEO title="Cover Letter Studio — ATSense" description="Generate tailored, high-impact cover letters matched to any job spec." />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        Cover Letter <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Studio</span>
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">
                        Custom AI cover letters calibrated with metrics and role-specific keywords.
                    </p>
                </div>

                <Link
                    to="/cover-letters/new"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                    <Plus size={16} />
                    <span>Create New Letter</span>
                </Link>
            </div>

            {letters.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 border border-slate-200/80 rounded-3xl p-8 max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No Cover Letters Drafted Yet</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-md mx-auto">
                        Craft a tailored cover letter customized to any job description in seconds using your workspace resume data.
                    </p>
                    <Link 
                        to="/cover-letters/new" 
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-indigo-500/20 transition-all"
                    >
                        <Sparkles size={15} />
                        <span>Draft Your First Letter</span>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create New Letter Card */}
                    <Link 
                        to="/cover-letters/new" 
                        className="group flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 rounded-3xl transition-all duration-300 min-h-[220px]"
                    >
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Sparkles size={26} />
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900">New Tailored Letter</h3>
                        <p className="text-slate-400 text-xs mt-1 text-center">Draft with custom AI voice</p>
                    </Link>

                    {letters.map((letter) => (
                        <div 
                            key={letter.id} 
                            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
                                        Tailored AI Draft
                                    </span>
                                    <button
                                        onClick={() => handleDelete(letter.id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        title="Delete draft"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <h3 className="font-extrabold text-base text-slate-900 truncate mb-1" title={letter.jobTitle}>
                                    {letter.jobTitle || 'Untitled Position'}
                                </h3>

                                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-3">
                                    <Building2 size={13} />
                                    <span>{letter.companyName || 'Target Company'}</span>
                                </div>

                                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4 font-normal">
                                    {letter.content}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                    <Calendar size={12} />
                                    <span>{new Date(letter.createdAt).toLocaleDateString()}</span>
                                </div>

                                <Link
                                    to={`/cover-letters/${letter.id}`}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    <span>Open Studio</span>
                                    <ArrowRight size={13} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Cover Letter"
                message="Are you sure you want to delete this cover letter? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setLetterToDelete(null);
                }}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
}

export default CoverLetterList;
