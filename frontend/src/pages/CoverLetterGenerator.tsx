import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function CoverLetterGenerator() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Form State
    const [resumes, setResumes] = useState<any[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    // Result State
    const [generatedContent, setGeneratedContent] = useState('');

    // UI State
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const isNew = id === 'new';

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch resumes for selection dropdown
                const resumeRes = await api.get('/resumes');
                setResumes(resumeRes.data);
                if (resumeRes.data.length > 0) setSelectedResumeId(resumeRes.data[0]._id);

                // If editing/viewing existing
                if (!isNew && id) {
                    const letterRes = await api.get(`/cover-letters/${id}`);
                    const data = letterRes.data;
                    setJobTitle(data.jobTitle);
                    setCompanyName(data.companyName);
                    setJobDescription(data.jobDescription);
                    setGeneratedContent(data.content);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchData();
    }, [id, isNew]);

    const handleGenerate = async () => {
        if (!selectedResumeId || !jobTitle || !jobDescription) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/cover-letters', {
                resumeId: selectedResumeId,
                jobTitle,
                companyName,
                jobDescription
            });
            // Redirect to view mode of the newly created letter
            navigate(`/cover-letters/${res.data._id}`);
        } catch (err: any) {
            console.error(err);
            alert('Generation failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{isNew ? 'Generate Cover Letter' : 'Cover Letter Details'}</h1>
                {!isNew && <p className="text-gray-500">View your generated letter below.</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT: Inputs */}
                <div className="space-y-6">
                    <div className="card">
                        <h3 className="font-bold text-gray-900 mb-4">Job Details</h3>

                        {isNew && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Resume Source</label>
                                <select
                                    className="input-field"
                                    value={selectedResumeId}
                                    onChange={e => setSelectedResumeId(e.target.value)}
                                >
                                    {resumes.map(r => (
                                        <option key={r._id} value={r._id}>{r.title || 'Untitled Resume'}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                            <input
                                className="input-field"
                                value={jobTitle}
                                onChange={e => setJobTitle(e.target.value)}
                                disabled={!isNew}
                                placeholder="e.g. Senior Frontend Engineer"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input
                                className="input-field"
                                value={companyName}
                                onChange={e => setCompanyName(e.target.value)}
                                disabled={!isNew}
                                placeholder="e.g. Google"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                            <textarea
                                className="input-field min-h-[150px]"
                                value={jobDescription}
                                onChange={e => setJobDescription(e.target.value)}
                                disabled={!isNew}
                                placeholder="Paste the JD here..."
                            />
                        </div>

                        {isNew && (
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="btn-primary w-full py-3"
                            >
                                {loading ? 'Writing Letter...' : 'Generate with AI ✨'}
                            </button>
                        )}
                    </div>
                </div>

                {/* RIGHT: Output */}
                <div>
                    <div className="card h-full min-h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900">Generated Letter</h3>
                            {!isNew && (
                                <button
                                    onClick={() => navigator.clipboard.writeText(generatedContent)}
                                    className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
                                >
                                    Copy Text
                                </button>
                            )}
                        </div>

                        {generatedContent ? (
                            <textarea
                                className="w-full h-full p-4 border rounded-lg bg-gray-50 font-sans text-sm leading-relaxed"
                                value={generatedContent}
                                readOnly={true} // For now read-only, could be editable later
                            />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
                                <span className="text-4xl mb-2">📄</span>
                                <p>Letter will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoverLetterGenerator;
