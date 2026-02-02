import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import ATSScore from '../components/ATSScore';
import ATSScoreBreakdown from '../components/ATSScoreBreakdown';
import { useToast } from '../context/ToastContext';

interface Resume {
	id?: string;
	title: string;
	atsScore: number;
	experience: any[];
	skills: string[];
	education: any[];
	certifications: any[];
	projects: any[];
	languages: any[];
	personalInfo: {
		fullName: string;
		email: string;
		phone: string;
		location: string;
		linkedin?: string;
		github?: string;
		portfolio?: string;
	};
}

const emptyResume: Resume = {
	title: '',
	atsScore: 0,
	experience: [],
	skills: [],
	education: [],
	certifications: [],
	projects: [],
	languages: [],
	personalInfo: {
		fullName: '',
		email: '',
		phone: '',
		location: '',
		linkedin: '',
		github: '',
		portfolio: '',
	},
};

function ResumeEditor() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { showToast } = useToast();

	const [resume, setResume] = useState<Resume | null>(null);
	const [jobDescription, setJobDescription] = useState('');
	const [jobTitle, setJobTitle] = useState('');
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [optimizing, setOptimizing] = useState(false);
	const [atsBreakdown, setAtsBreakdown] = useState<any>(null);

	// Fetch ATS breakdown
	const fetchBreakdown = async (resumeId: string) => {
		try {
			const res = await api.get(`/resumes/${resumeId}/ats-breakdown`);
			setAtsBreakdown(res.data);
		} catch (err) {
			console.error('Failed to fetch ATS breakdown:', err);
		}
	};

	// Load resume or initialize new
	useEffect(() => {
		if (id === 'new') {
			setResume(emptyResume);
		} else if (id) {
			setLoading(true);
			api
				.get(`/resumes/${id}`)
				.then((res) => {
					setResume(res.data);
					fetchBreakdown(id); // Fetch breakdown when resume loads
				})
				.catch((err) => console.error(err))
				.finally(() => setLoading(false));
		}
	}, [id]);

	// Save new resume
	const saveResume = async () => {
		if (!resume) return;
		setSaving(true);
		try {
			const endpoint = resume.id ? `/resumes/${resume.id}` : '/resumes';
			const method = resume.id ? 'put' : 'post';

			// @ts-ignore
			const res = await api[method](endpoint, resume);
			setResume(res.data);
			if (!resume.id) navigate(`/resume/${res.data.id}`);

			// Refresh breakdown after save
			if (res.data.id) fetchBreakdown(res.data.id);

			showToast('Resume saved successfully!', 'success');
		} catch (err) {
			console.error(err);
			showToast('Failed to save resume', 'error');
		} finally {
			setSaving(false);
		}
	};

	// Generate ATS optimized content
	const generateAI = async () => {
		if (!resume?.id) return;

		setOptimizing(true);
		try {
			await api.post('/ai/generate', {
				resumeId: resume.id,
				jobTitle,
				jobDescription,
			});

			const updated = await api.get(`/resumes/${resume.id}`);
			setResume(updated.data);

			// Refresh breakdown after optimization
			fetchBreakdown(resume.id);

			showToast('Resume optimized successfully!', 'success');
		} catch (err: any) {
			console.error(err);
			showToast(err.response?.data?.message || 'AI optimization failed', 'error');
		} finally {
			setOptimizing(false);
		}
	};

	if (loading || !resume) return (
		<div className="flex justify-center items-center h-64">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
		</div>
	);

	return (
		<div className="max-w-4xl mx-auto pb-20">
			{/* Header / Actions */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">{id === 'new' ? 'New Resume' : 'Edit Resume'}</h1>
				</div>

				<div className="flex gap-3">
					<button
						onClick={saveResume}
						disabled={saving}
						className="btn-primary"
					>
						{saving ? 'Saving...' : 'Save Changes'}
					</button>

					{resume.id && (
						<>
							<button onClick={() => navigate(`/preview/${resume.id}`)} className="btn-secondary">
								Preview
							</button>
						</>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* LEFT COLUMN - Main Content */}
				<div className="lg:col-span-2 space-y-6">

					{/* Basic Info Card */}
					<div className="card">
						<label className="block text-sm font-semibold text-gray-700 mb-2">Resume Title (Internal)</label>
						<input
							type="text"
							placeholder="e.g. Frontend Developer Resume"
							value={resume.title}
							onChange={(e) => setResume({ ...resume, title: e.target.value })}
							className="input-field text-lg font-medium"
						/>
					</div>

					{/* Personal Information */}
					<div className="card">
						<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
							<span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md text-sm">👤</span>
							Personal Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-xs font-medium text-gray-500 uppercase mb-1">Full Name</label>
								<input
									type="text"
									value={resume.personalInfo?.fullName || ''}
									onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, fullName: e.target.value } })}
									className="input-field"
									placeholder="John Doe"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-500 uppercase mb-1">Email</label>
								<input
									type="email"
									value={resume.personalInfo?.email || ''}
									onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, email: e.target.value } })}
									className="input-field"
									placeholder="john@example.com"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-500 uppercase mb-1">Phone</label>
								<input
									type="text"
									value={resume.personalInfo?.phone || ''}
									onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, phone: e.target.value } })}
									className="input-field"
									placeholder="+1 234 567 890"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-500 uppercase mb-1">Location</label>
								<input
									type="text"
									value={resume.personalInfo?.location || ''}
									onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, location: e.target.value } })}
									className="input-field"
									placeholder="New York, NY"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-500 uppercase mb-1">LinkedIn</label>
								<input
									type="text"
									value={resume.personalInfo?.linkedin || ''}
									onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, linkedin: e.target.value } })}
									className="input-field"
									placeholder="linkedin.com/in/yourname"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-500 uppercase mb-1">GitHub</label>
								<input
									type="text"
									value={resume.personalInfo?.github || ''}
									onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, github: e.target.value } })}
									className="input-field"
									placeholder="github.com/yourname"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-500 uppercase mb-1">Portfolio</label>
								<input
									type="text"
									value={resume.personalInfo?.portfolio || ''}
									onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, portfolio: e.target.value } })}
									className="input-field"
									placeholder="yourwebsite.com"
								/>
							</div>
						</div>
					</div>

					{/* Editor Placeholders (Experience/Skills) - Visual Only for now as complex editors take time */}
					<div className="card opacity-70">
						<h3 className="text-lg font-bold text-gray-900 mb-2">Experience & Education</h3>
						<p className="text-gray-500 text-sm">Complex list editing is managed via JSON/AI for now. Use the "Optimize for ATS" feature to generate this content automatically.</p>
					</div>

				</div>

				{/* RIGHT COLUMN - AI Tools */}
				<div className="space-y-6">
					{/* ATS Score Breakdown */}
					{resume.id && (
						<ATSScoreBreakdown breakdown={atsBreakdown} />
					)}

					{/* AI Optimization Card */}
					<div className="card bg-gradient-to-b from-white to-indigo-50/30 border-indigo-100">
						<h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
							<span className="text-xl">✨</span> AI Optimize
						</h3>

						<div className="space-y-4">
							<div>
								<label className="block text-xs font-bold text-indigo-400 uppercase mb-1">Target Job Title</label>
								<input
									type="text"
									value={jobTitle}
									onChange={(e) => setJobTitle(e.target.value)}
									className="input-field bg-white"
									placeholder="e.g. Senior Product Manager"
								/>
							</div>

							<div>
								<label className="block text-xs font-bold text-indigo-400 uppercase mb-1">Job Description</label>
								<textarea
									rows={8}
									value={jobDescription}
									onChange={(e) => setJobDescription(e.target.value)}
									className="input-field bg-white text-sm"
									placeholder="Paste the JD here to tailor your resume..."
								/>
							</div>

							<button
								onClick={generateAI}
								disabled={!resume.id || !jobTitle || optimizing}
								className="w-full btn-primary py-3 shadow-indigo-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{optimizing ? 'Optimizing...' : 'Optimize Resume'}
							</button>
							{!resume.id && (
								<p className="text-xs text-red-500 text-center mt-2">
									Please <b>Save Changes</b> above before optimizing.
								</p>
							)}
							{resume.id && !jobTitle && (
								<p className="text-xs text-amber-600 text-center mt-2">
									Enter a <b>Target Job Title</b> to enable.
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ResumeEditor;
