import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import { SkeletonGrid } from '../components/Skeleton';
import OnboardingTour from '../components/OnboardingTour';
import type { Resume } from '../types';

function Dashboard() {
	const [resumes, setResumes] = useState<Resume[]>([]);
	const [loading, setLoading] = useState(true);
	const [importing, setImporting] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();
	const { showToast } = useToast();

	// Modal state
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);

	useEffect(() => {
		api
			.get('/resumes')
			.then((res) => setResumes(res.data))
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));
	}, []);

	const handleImportClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append('resume', file);

		setImporting(true);
		try {
			const res = await api.post('/resumes/import', formData, {
				headers: { 'Content-Type': 'multipart/form-data' }
			});
			navigate(`/resume/${res.data._id}`);
			showToast('Resume imported successfully!', 'success');
		} catch (err: any) {
			console.error(err);
			showToast(err.response?.data?.message || 'Failed to import resume', 'error');
		} finally {
			setImporting(false);
			if (fileInputRef.current) fileInputRef.current.value = '';
		}
	};

	const handleDelete = (id: string) => {
		setResumeToDelete(id);
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		if (!resumeToDelete) return;

		try {
			await api.delete(`/resumes/${resumeToDelete}`);
			setResumes(resumes.filter(r => r._id !== resumeToDelete));
			setShowDeleteModal(false);
			setResumeToDelete(null);
			showToast('Resume deleted successfully', 'success');
		} catch (err) {
			console.error(err);
			showToast('Failed to delete resume', 'error');
		}
	};

	if (loading) {
		return (
			<div>
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
						<p className="text-gray-500 mt-1">Manage and optimize your resumes</p>
					</div>
				</div>
				<SkeletonGrid count={6} />
			</div>
		);
	}

	return (
		<div>
			<OnboardingTour />

			<input
				type="file"
				ref={fileInputRef}
				className="hidden"
				accept=".pdf,.docx"
				onChange={handleFileChange}
			/>

			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dashboard-title">Dashboard</h1>
					<p className="text-gray-500 mt-1">Manage and optimize your resumes</p>
				</div>
				<div className="flex gap-3">
					<button
						onClick={handleImportClick}
						disabled={importing}
						className="btn-secondary flex items-center gap-2 import-resume-btn"
					>
						{importing ? 'Importing...' : '☁️ Import Resume'}
					</button>
					<Link to="/resume/new" className="btn-primary flex items-center gap-2 create-resume-btn">
						<span className="text-xl">+</span> New Resume
					</Link>
				</div>
			</div>

			{resumes.length === 0 ? (
				<div className="text-center py-24 card border-dashed border-2 bg-gray-50/50">
					<div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
						<span className="text-4xl">📄</span>
					</div>
					<h3 className="text-2xl font-bold text-gray-900 mb-2">No resumes created yet</h3>
					<p className="text-gray-500 max-w-sm mx-auto mb-8">
						Create your first ATS-optimized resume to get started. We'll help you score it against job descriptions.
					</p>
					<Link to="/resume/new" className="btn-primary inline-flex items-center gap-2 px-6 py-3 create-resume-btn">
						<span className="text-xl">+</span> Build Your First Resume
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{resumes.map((resume) => (
						<div key={resume._id} className="card group relative hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-t-4 border-t-indigo-500">
							<div className="flex justify-between items-start mb-4">
								<div>
									<h3 className="font-bold text-lg text-gray-900 truncate pr-2 mb-1" title={resume.title}>
										{resume.title || 'Untitled Resume'}
									</h3>
									<p className="text-xs text-gray-500 flex items-center gap-1">
										<span>🕒</span> Updated {new Date(resume.updatedAt || Date.now()).toLocaleDateString()}
									</p>
								</div>
								<div className="shrink-0">
									<span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${resume.atsScore >= 80 ? 'bg-green-50 text-green-700 border-green-200' :
											resume.atsScore >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
												'bg-gray-50 text-gray-600 border-gray-200'
										}`}>
										{resume.atsScore || 0}%
									</span>
								</div>
							</div>

							<div className="h-px bg-gray-100 my-4"></div>

							<div className="flex gap-2">
								<Link
									to={`/resume/${resume._id}`}
									className="flex-1 text-center px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
								>
									Edit
								</Link>
								<Link
									to={`/preview/${resume._id}`}
									className="flex-1 text-center px-3 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
								>
									Preview
								</Link>
								<button
									onClick={() => handleDelete(resume._id)}
									className="px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
									title="Delete resume"
								>
									🗑️
								</button>
							</div>
						</div>
					))}

					{/* Add New Resume Card */}
					<Link to="/resume/new" className="card border-dashed border-2 border-gray-300 bg-gray-50/50 hover:bg-gray-50 hover:border-indigo-400 hover:text-indigo-600 flex flex-col items-center justify-center p-8 transition-all group cursor-pointer h-full min-h-[180px]">
						<div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
							<span className="text-2xl text-gray-400 group-hover:text-indigo-500">+</span>
						</div>
						<span className="font-medium text-gray-500 group-hover:text-indigo-600">Create New Resume</span>
					</Link>
				</div>
			)}

			<ConfirmModal
				isOpen={showDeleteModal}
				title="Delete Resume"
				message="Are you sure you want to delete this resume? This action cannot be undone."
				onConfirm={confirmDelete}
				onCancel={() => {
					setShowDeleteModal(false);
					setResumeToDelete(null);
				}}
				confirmText="Delete"
				cancelText="Cancel"
				type="danger"
			/>
		</div>
	);
}

export default Dashboard;
