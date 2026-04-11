import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Sparkles, FileText, Briefcase, Building2, Copy, ArrowLeft, Loader2, Check } from 'lucide-react';
import { useModal } from '../context/ModalContext';

function CoverLetterGenerator() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useModal();

    // Form State
    const [resumes, setResumes] = useState<any[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    // Result State
    const [generatedContent, setGeneratedContent] = useState('');
    const [copied, setCopied] = useState(false);

    // UI State
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasResume, setHasResume] = useState(false);
    const [extracting, setExtracting] = useState(false);

    const isNew = id === 'new';

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch resume from local session
                const localResumeStr = localStorage.getItem('atsense_current_resume');
                
                if (localResumeStr && localResumeStr !== 'undefined' && localResumeStr !== 'null') {
                    try {
                        const localResume = JSON.parse(localResumeStr);
                        
                        // VALIDATION: Must be an object AND have personalInfo.fullName
                        const isObject = localResume && typeof localResume === 'object' && !Array.isArray(localResume);
                        const hasName = localResume.personalInfo?.fullName && localResume.personalInfo.fullName.trim().length > 0;
                        
                        if (isObject && hasName) {
                            setResumes([{ 
                                id: 'local', 
                                title: `${localResume.personalInfo.fullName}'s Resume`, 
                                data: localResume 
                            }]);
                            setSelectedResumeId('local');
                            setHasResume(true);
                        } else {
                            // If it exists but is invalid/empty, don't treat it as a resume
                            setHasResume(false);
                            console.warn('Resume data in session is empty or invalid.');
                        }
                    } catch (parseErr) {
                        console.error('Failed to parse resume from localStorage:', parseErr);
                        setHasResume(false);
                    }
                } else {
                    setHasResume(false);
                }

                // If editing/viewing existing
                if (!isNew && id) {
                    const storedLetters = localStorage.getItem('atsense_cover_letters_list');
                    if (storedLetters) {
                        const lettersArray = JSON.parse(storedLetters);
                        const data = lettersArray.find((l: any) => l.id === id);
                        if (data) {
                            setJobTitle(data.jobTitle);
                            setCompanyName(data.companyName);
                            setJobDescription(data.jobDescription);
                            setGeneratedContent(data.content);
                        }
                    }
                }
            } catch (err) {
                console.error(err);
                setHasResume(false);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchData();
    }, [id, isNew]);

    const handleGenerate = async () => {
        if (!selectedResumeId || !jobTitle || !jobDescription) {
            showAlert('Missing Information', 'Please provide a job title and description. You also need an active resume in the builder to tailor the content.', 'warning');
            return;
        }

        const selectedResumeData = resumes.find(r => r.id === selectedResumeId)?.data;
        if (!selectedResumeData) {
            showAlert('Data Not Found', 'We could not retrieve your resume details. Please head over to the Resume Builder to create your profile first.', 'danger');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/ai/cover-letter', {
                resume: selectedResumeData,
                jobTitle,
                companyName,
                jobDescription
            });
            
            const newLetter = {
                id: Date.now().toString(),
                resumeId: selectedResumeId,
                jobTitle,
                companyName,
                jobDescription,
                content: res.data.content,
                createdAt: new Date().toISOString()
            };

            const storedLetters = localStorage.getItem('atsense_cover_letters_list');
            const lettersArray = storedLetters ? JSON.parse(storedLetters) : [];
            lettersArray.unshift(newLetter);
            localStorage.setItem('atsense_cover_letters_list', JSON.stringify(lettersArray));

            // Redirect to view mode of the newly created letter
            navigate(`/cover-letters/${newLetter.id}`);
        } catch (err: any) {
            console.error(err);
            showAlert('Generation Failed', 'Our AI service encountered an error while writing your letter. Please check your internet connection or try again in a moment.', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const handleExtract = async () => {
        if (!jobDescription) {
            showAlert('Notice', 'Paste a job link or raw text into the description box first.', 'info');
            return;
        }
        setExtracting(true);
        try {
            const res = await api.post('/ai/jobs/extract', { url_or_text: jobDescription });
            const data = res.data;
            if (data.jobTitle) setJobTitle(data.jobTitle);
            if (data.companyName && data.companyName !== 'Unknown') setCompanyName(data.companyName);
            const cleanedDesc = `Job Title: ${data.jobTitle}\nCompany: ${data.companyName}\n\n${data.jobDescription}`;
            setJobDescription(cleanedDesc);
            showAlert('Extraction Complete', 'Successfully loaded job details!', 'success');
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.suggestion || err.response?.data?.message || 'Extraction failed. Please paste the job description text manually.';
            showAlert('Extraction Failed', msg, 'danger');
        } finally {
            setExtracting(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (initialLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 p-6">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
                <h2 className="text-xl font-bold text-gray-900">Loading Configuration...</h2>
            </div>
        );
    }

    // GATE: No resume in session — block generation
    if (isNew && !hasResume) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center bg-gray-50/50 px-4">
                <div className="max-w-md">
                    <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-indigo-200">
                        <FileText size={36} className="text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">Resume Required First</h2>
                    <p className="text-gray-500 text-base leading-relaxed mb-8">
                        To generate a personalized cover letter, you need to have a completed resume in your workspace. 
                        Please fill in your details in the Builder first.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/builder"
                            className="btn-premium"
                        >
                            <Sparkles size={18} />
                            Go to Builder
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 pb-32 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <button 
                        onClick={() => navigate('/builder')}
                        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors group mb-6"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Workspace
                    </button>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        {isNew ? 'Generate Cover Letter' : 'Cover Letter Details'} <Sparkles size={28} className="text-indigo-500" />
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        {isNew ? 'Instantly draft a tailored cover letter based on your current resume.' : 'Review and copy your professionally generated cover letter.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: Inputs */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-gray-200/80 shadow-sm p-6 sm:p-8">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                <Briefcase size={20} />
                            </div>
                            <h3 className="font-black text-gray-900 text-xl">Target Role Details</h3>
                        </div>

                        <div className="space-y-5">
                            {/* Simplified: Removed selects source dropdown and replaced with simple info badge if needed */}
                            {isNew && hasResume && (
                                <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3 mb-2">
                                    <FileText size={16} className="text-indigo-500" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Resume</p>
                                        <p className="text-xs font-bold text-slate-700">{resumes[0].title}</p>
                                    </div>
                                </div>
                            )}

                            <div className="group flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm transition-all duration-200 hover:border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 min-w-0 cursor-text">
                                <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg shrink-0 text-gray-400 group-focus-within:bg-indigo-50 group-focus-within:text-indigo-600 group-focus-within:border-indigo-100 transition-colors">
                                    <Briefcase size={16} />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5 group-focus-within:text-indigo-600 transition-colors">Job Title</label>
                                    <input
                                        type="text"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        disabled={!isNew}
                                        placeholder="e.g. Senior Frontend Engineer"
                                        className="bg-transparent border-none focus:outline-none text-[14px] font-bold text-gray-900 w-full placeholder:text-gray-300 p-0 truncate outline-none ring-0 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="group flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm transition-all duration-200 hover:border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 min-w-0 cursor-text">
                                <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg shrink-0 text-gray-400 group-focus-within:bg-indigo-50 group-focus-within:text-indigo-600 group-focus-within:border-indigo-100 transition-colors">
                                    <Building2 size={16} />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5 group-focus-within:text-indigo-600 transition-colors">Company Name</label>
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        disabled={!isNew}
                                        placeholder="e.g. Google"
                                        className="bg-transparent border-none focus:outline-none text-[14px] font-bold text-gray-900 w-full placeholder:text-gray-300 p-0 truncate outline-none ring-0 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="group flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm transition-all duration-200 hover:border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 min-w-0 cursor-text">
                                <div className="mt-0.5 p-2 bg-gray-50 border border-gray-100 rounded-lg shrink-0 text-gray-400 group-focus-within:bg-indigo-50 group-focus-within:text-indigo-600 group-focus-within:border-indigo-100 transition-colors">
                                    <FileText size={16} />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">Job Description or URL</label>
                                        {isNew && (
                                            <button 
                                                onClick={handleExtract}
                                                disabled={extracting || !jobDescription}
                                                className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg transition-colors disabled:opacity-50 border border-indigo-100"
                                            >
                                                {extracting ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                                {extracting ? 'Extracting...' : 'Magic Extract'}
                                            </button>
                                        )}
                                    </div>
                                    <textarea
                                        value={jobDescription}
                                        onChange={e => setJobDescription(e.target.value)}
                                        disabled={!isNew || extracting}
                                        placeholder="Paste a link (e.g. lever.co/job) or the full job description here..."
                                        className="bg-transparent border-none focus:outline-none text-[14px] font-medium leading-relaxed text-gray-700 w-full placeholder:text-gray-300 p-0 resize-y min-h-[140px] outline-none ring-0 disabled:text-gray-500 scrollbar-hide"
                                    />
                                </div>
                            </div>

                            {isNew && (
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !jobTitle || !jobDescription}
                                    className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black transition-all duration-200 mt-6 ${loading || !jobTitle || !jobDescription ? 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-100' : 'btn-premium'}`}
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                    <span>{loading ? 'Writing Letter...' : 'Generate with AI'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Output */}
                <div className="lg:col-span-12 xl:col-span-7 h-full">
                    <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-xl h-full min-h-[600px] flex flex-col relative overflow-hidden">
                        
                        {/* Internal Header Background */}
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-indigo-50 to-transparent pointer-events-none opacity-50"></div>

                        <div className="flex justify-between items-center p-8 pb-4 relative z-10 border-b border-gray-100">
                            <h3 className="font-black text-gray-900 text-xl flex items-center gap-2">
                                <FileText size={20} className="text-indigo-500" />
                                Generated Letter
                            </h3>
                            {!isNew && generatedContent && (
                                <button
                                    onClick={handleCopy}
                                    className="btn-outline-premium !px-4 !py-2 !text-xs"
                                >
                                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy Text'}
                                </button>
                            )}
                        </div>

                        {generatedContent ? (
                            <div className="flex-1 p-8 overflow-y-auto relative z-10">
                                <textarea
                                    className="w-full h-full min-h-[400px] focus:outline-none font-sans text-[15px] leading-loose text-gray-700 bg-transparent resize-none scrollbar-hide"
                                    value={generatedContent}
                                    readOnly={true} 
                                />
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 relative z-10">
                                <div className="w-20 h-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-6">
                                    <FileText size={32} className="text-gray-300" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 mb-2">Ready to Generate</h4>
                                <p className="text-center font-medium max-w-sm text-sm">
                                    Fill out the target role details on the left and hit the magic button. Your tailored cover letter will instantly populate here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoverLetterGenerator;
