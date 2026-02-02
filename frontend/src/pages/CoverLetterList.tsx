import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
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
        api.get('/cover-letters')
            .then((res) => setLetters(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = (id: string) => {
        setLetterToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!letterToDelete) return;
        try {
            await api.delete(`/cover-letters/${letterToDelete}`);
            setLetters(letters.filter(l => l.id !== letterToDelete));
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
                        <h1 className="text-3xl font-bold text-gray-900">Cover Letters</h1>
                        <p className="text-gray-500 mt-1">AI-generated personalized letters</p>
                    </div>
                </div>
                <SkeletonGrid count={6} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Cover Letters</h1>
                    <p className="text-gray-500 mt-1">AI-generated personalized letters</p>
                </div>
                <Link to="/cover-letters/new" className="btn-primary flex items-center gap-2">
                    <span className="text-xl">+</span> New Letter
                </Link>
            </div>

            {letters.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="text-6xl mb-4">✍️</div>
                    <h3 className="text-xl font-medium text-gray-900">No cover letters yet</h3>
                    <p className="text-gray-500 mt-2 mb-6">Create a tailored cover letter for your dream job instantly.</p>
                    <Link to="/cover-letters/new" className="btn-primary">
                        Create Cover Letter
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    🗑️
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
