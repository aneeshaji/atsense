import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { Sparkles, FileText, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import { SkeletonGrid } from '../components/Skeleton';

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
            <div>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="text-3xl font-bold text-gray-900">Cover Letters</div>
                        <p className="text-gray-500 mt-1">AI-generated personalized letters</p>
                    </div>
                </div>
                <SkeletonGrid count={6} />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Cover Letters</h1>
                <p className="text-gray-500 mt-2 text-lg">AI-powered letters tailored to your target roles.</p>
            </div>

            {letters.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-sm flex flex-col items-center">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-8">
                        <FileText size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">No cover letters yet</h3>
                    <p className="text-gray-500 mt-3 mb-10 max-w-sm mx-auto font-medium">Create a tailored cover letter for your dream job instantly using our AI engine.</p>
                    <Link to="/cover-letters/new" className="btn-premium">
                        Create Your First Letter
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* New Letter Card */}
                    <Link 
                        to="/cover-letters/new" 
                        className="group relative flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-gray-200 rounded-[2rem] hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-300 min-h-[250px]"
                    >
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Sparkles size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">New Letter</h3>
                        <p className="text-gray-500 text-sm mt-1 text-center">Start a new AI-powered draft</p>
                    </Link>

                    {letters.map((letter) => (
                        <div key={letter.id} className="card hover:shadow-md transition-shadow group relative flex flex-col">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-900 truncate" title={letter.jobTitle}>
                                    {letter.jobTitle}
                                </h3>
                                <div className="text-indigo-600 font-medium text-sm mb-2">{letter.companyName || 'Unknown Company'}</div>
                                <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                                    {letter.content}
                                </p>
                            </div>

                            <div className="text-xs text-gray-400 mb-4">
                                Created: {new Date(letter.createdAt).toLocaleDateString()}
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-gray-50 mt-auto">
                                <Link
                                    to={`/cover-letters/${letter.id}`}
                                    className="flex-1 text-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                                >
                                    View/Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(letter.id)}
                                    className="px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
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
