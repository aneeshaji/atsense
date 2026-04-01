import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useToast } from '../context/ToastContext';
import HarvardTemplate from '../templates/HarvardTemplate';
import ExecutiveTemplate from '../templates/ExecutiveTemplate';
import { User, Briefcase, GraduationCap, Code, Shield, Download, Plus, Trash2, ArrowLeft, FileText, Award, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const emptyResume = {
    personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
    summary: '',
    education: [],
    experience: [],
    leadership: [],
    skills: [],
    certifications: [],
    languages: [],
};

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all';
const labelCls = 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1';

export default function TemplateBuilder() {
    const [searchParams] = useSearchParams();
    const initialTemplate = (searchParams.get('template') as 'harvard' | 'executive') || 'harvard';
    const [templateId, setTemplateId] = useState<'harvard' | 'executive'>(initialTemplate);
    const [resume, setResume] = useState<any>(emptyResume);
    const { showToast } = useToast();
    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem('classic_builder_resume');
        if (saved) {
            try { setResume(JSON.parse(saved)); }
            catch (e) { setResume(emptyResume); }
        }
    }, []);

    useEffect(() => {
        if (resume.personalInfo.fullName !== '') {
            localStorage.setItem('classic_builder_resume', JSON.stringify(resume));
        }
    }, [resume]);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: resume.personalInfo?.fullName ? `${resume.personalInfo.fullName.replace(' ', '_')}_Resume` : 'My_Resume',
        onBeforePrint: () => {
            showToast('Generating PDF…', 'success');
            return Promise.resolve();
        }
    });

    // Generic array helpers
    const addItem = (section: string, defaultObj: any) =>
        setResume((prev: any) => ({ ...prev, [section]: [...(prev[section] || []), defaultObj] }));

    const updateItem = (section: string, index: number, field: string, value: string) =>
        setResume((prev: any) => {
            const arr = [...prev[section]];
            arr[index] = { ...arr[index], [field]: value };
            return { ...prev, [section]: arr };
        });

    const removeItem = (section: string, index: number) =>
        setResume((prev: any) => {
            const arr = [...prev[section]];
            arr.splice(index, 1);
            return { ...prev, [section]: arr };
        });

    const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
        <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2 mb-4">
            <Icon size={18} className="text-indigo-500" /> {title}
        </h2>
    );

    const AddButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
        <button
            onClick={onClick}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center justify-center gap-2 text-sm"
        >
            <Plus size={15} /> {label}
        </button>
    );

    const DeleteBtn = ({ onClick }: { onClick: () => void }) => (
        <button onClick={onClick} className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <Trash2 size={15} />
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to="/templates" className="p-2 -ml-2 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="font-black text-gray-900 tracking-tight leading-none text-lg">Classic Builder</h1>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-0.5">ATS Resume Editor</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => setTemplateId('harvard')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${templateId === 'harvard' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            Harvard Standard
                        </button>
                        <button onClick={() => setTemplateId('executive')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${templateId === 'executive' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            Executive Line
                        </button>
                    </div>
                    <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-all">
                        <Download size={16} /> Download PDF
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* ── LEFT FORM ── */}
                <div className="w-1/2 overflow-y-auto p-8 border-r border-gray-100 bg-white">
                    <div className="max-w-2xl mx-auto space-y-10">

                        {/* 1. Personal Info */}
                        <section>
                            <SectionHeader icon={User} title="Personal Details" />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className={labelCls}>Full Name</label>
                                    <input type="text" value={resume.personalInfo.fullName} onChange={e => setResume({ ...resume, personalInfo: { ...resume.personalInfo, fullName: e.target.value } })} className={inputCls} placeholder="Sruthi S" />
                                </div>
                                <div>
                                    <label className={labelCls}>Email</label>
                                    <input type="email" value={resume.personalInfo.email} onChange={e => setResume({ ...resume, personalInfo: { ...resume.personalInfo, email: e.target.value } })} className={inputCls} placeholder="you@example.com" />
                                </div>
                                <div>
                                    <label className={labelCls}>Phone</label>
                                    <input type="text" value={resume.personalInfo.phone} onChange={e => setResume({ ...resume, personalInfo: { ...resume.personalInfo, phone: e.target.value } })} className={inputCls} placeholder="+91 99999 00000" />
                                </div>
                                <div className="col-span-2">
                                    <label className={labelCls}>Location</label>
                                    <input type="text" value={resume.personalInfo.location} onChange={e => setResume({ ...resume, personalInfo: { ...resume.personalInfo, location: e.target.value } })} className={inputCls} placeholder="Kollam, Kerala 691303, India" />
                                </div>
                                <div>
                                    <label className={labelCls}>LinkedIn (optional)</label>
                                    <input type="text" value={resume.personalInfo.linkedin} onChange={e => setResume({ ...resume, personalInfo: { ...resume.personalInfo, linkedin: e.target.value } })} className={inputCls} placeholder="linkedin.com/in/yourname" />
                                </div>
                                <div>
                                    <label className={labelCls}>Portfolio / Website</label>
                                    <input type="text" value={resume.personalInfo.portfolio} onChange={e => setResume({ ...resume, personalInfo: { ...resume.personalInfo, portfolio: e.target.value } })} className={inputCls} placeholder="yourwebsite.com" />
                                </div>
                            </div>
                        </section>

                        {/* 2. Professional Summary */}
                        <section>
                            <SectionHeader icon={FileText} title="Professional Summary" />
                            <label className={labelCls}>Summary Paragraph</label>
                            <textarea
                                rows={4}
                                value={resume.summary}
                                onChange={e => setResume({ ...resume, summary: e.target.value })}
                                className={inputCls + ' resize-y'}
                                placeholder="QA/QC Inspector with 4+ years of experience in precision component inspection for aerospace and defence manufacturing…"
                            />
                        </section>

                        {/* 3. Technical Skills */}
                        <section>
                            <SectionHeader icon={Code} title="Technical Skills" />
                            <label className={labelCls}>
                                One category per line — format: <span className="font-mono text-indigo-500">Category: skill1, skill2</span>
                            </label>
                            <textarea
                                rows={5}
                                value={resume.skills.join('\n')}
                                onChange={e => setResume({ ...resume, skills: e.target.value.split('\n') })}
                                className={inputCls + ' resize-y font-mono text-sm'}
                                placeholder={"Inspection Instruments: Micrometer, Vernier Caliper, Height Gauge\nQuality Methods: GD&T, FAI, SPC, FMEA, Root Cause Analysis\nTools: AutoCAD, QC Documentation Systems\nLanguages: English (Conversational), Malayalam (Native)"}
                            />
                            <p className="text-xs text-gray-400 mt-1">Each line will appear as a bold-label row in the resume. You can also just list skills without colons.</p>
                        </section>

                        {/* 4. Experience */}
                        <section>
                            <SectionHeader icon={Briefcase} title="Professional Experience" />
                            {resume.experience.map((exp: any, i: number) => (
                                <div key={i} className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-4 relative">
                                    <DeleteBtn onClick={() => removeItem('experience', i)} />
                                    <div className="grid grid-cols-2 gap-3 mb-3 mr-8">
                                        <div>
                                            <label className={labelCls}>Job Title</label>
                                            <input type="text" placeholder="QA/QC Inspector" value={exp.title} onChange={e => updateItem('experience', i, 'title', e.target.value)} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Company</label>
                                            <input type="text" placeholder="Kannan Industries" value={exp.company} onChange={e => updateItem('experience', i, 'company', e.target.value)} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Start Date</label>
                                            <input type="text" placeholder="February 2022" value={exp.startDate || ''} onChange={e => updateItem('experience', i, 'startDate', e.target.value)} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>End Date</label>
                                            <input type="text" placeholder="Present" value={exp.endDate} onChange={e => updateItem('experience', i, 'endDate', e.target.value)} className={inputCls} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className={labelCls}>Location</label>
                                            <input type="text" placeholder="Kollam, Kerala" value={exp.location} onChange={e => updateItem('experience', i, 'location', e.target.value)} className={inputCls} />
                                        </div>
                                    </div>
                                    <label className={labelCls}>Responsibilities / Achievements (one per line, use • or –)</label>
                                    <textarea placeholder={"• Performed dimensional inspections of machined components\n• Operated calibrated instruments maintaining measurement traceability"} value={exp.description} onChange={e => updateItem('experience', i, 'description', e.target.value)} className={inputCls + ' resize-y font-mono text-sm'} rows={5} />
                                </div>
                            ))}
                            <AddButton onClick={() => addItem('experience', { title: '', company: '', location: '', startDate: '', endDate: '', description: '' })} label="Add Work Experience" />
                        </section>

                        {/* 5. Education */}
                        <section>
                            <SectionHeader icon={GraduationCap} title="Education" />
                            {resume.education.map((edu: any, i: number) => (
                                <div key={i} className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-4 relative">
                                    <DeleteBtn onClick={() => removeItem('education', i)} />
                                    <div className="grid grid-cols-2 gap-3 mr-8">
                                        <div className="col-span-2">
                                            <label className={labelCls}>Degree / Qualification</label>
                                            <input type="text" placeholder="ITI Machinist – NCVT" value={edu.degree} onChange={e => updateItem('education', i, 'degree', e.target.value)} className={inputCls} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className={labelCls}>Institution / School</label>
                                            <input type="text" placeholder="Government ITI Chandanathope" value={edu.institution} onChange={e => updateItem('education', i, 'institution', e.target.value)} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Start Year</label>
                                            <input type="text" placeholder="2019" value={edu.startDate || ''} onChange={e => updateItem('education', i, 'startDate', e.target.value)} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>End Year</label>
                                            <input type="text" placeholder="2021" value={edu.endDate} onChange={e => updateItem('education', i, 'endDate', e.target.value)} className={inputCls} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className={labelCls}>Location</label>
                                            <input type="text" placeholder="Kollam, Kerala" value={edu.location} onChange={e => updateItem('education', i, 'location', e.target.value)} className={inputCls} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <AddButton onClick={() => addItem('education', { institution: '', degree: '', location: '', startDate: '', endDate: '' })} label="Add Education" />
                        </section>

                        {/* 6. Certifications */}
                        <section>
                            <SectionHeader icon={Award} title="Certifications & Training" />
                            {resume.certifications.map((cert: any, i: number) => (
                                <div key={i} className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-4 relative">
                                    <DeleteBtn onClick={() => removeItem('certifications', i)} />
                                    <div className="grid grid-cols-2 gap-3 mr-8">
                                        <div className="col-span-2">
                                            <label className={labelCls}>Certificate Name</label>
                                            <input type="text" placeholder="ITI Machinist Trade Certificate" value={cert.name || ''} onChange={e => updateItem('certifications', i, 'name', e.target.value)} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Issuing Body</label>
                                            <input type="text" placeholder="Government of Kerala, NCVT" value={cert.issuer || ''} onChange={e => updateItem('certifications', i, 'issuer', e.target.value)} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Year</label>
                                            <input type="text" placeholder="2021" value={cert.date || ''} onChange={e => updateItem('certifications', i, 'date', e.target.value)} className={inputCls} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <AddButton onClick={() => addItem('certifications', { name: '', issuer: '', date: '' })} label="Add Certification" />
                        </section>

                        {/* 7. Leadership / Projects */}
                        <section>
                            <SectionHeader icon={Shield} title="Leadership & Projects" />
                            {resume.leadership.map((item: any, i: number) => (
                                <div key={i} className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-4 relative">
                                    <DeleteBtn onClick={() => removeItem('leadership', i)} />
                                    <div className="grid grid-cols-2 gap-3 mb-3 mr-8">
                                        <div>
                                            <label className={labelCls}>Organization / Project</label>
                                            <input type="text" placeholder="Project / Org Name" value={item.company} onChange={e => updateItem('leadership', i, 'company', e.target.value)} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Dates</label>
                                            <input type="text" placeholder="2023" value={item.endDate} onChange={e => updateItem('leadership', i, 'endDate', e.target.value)} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Role</label>
                                            <input type="text" placeholder="Vice President" value={item.title} onChange={e => updateItem('leadership', i, 'title', e.target.value)} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Location (optional)</label>
                                            <input type="text" placeholder="Remote" value={item.location} onChange={e => updateItem('leadership', i, 'location', e.target.value)} className={inputCls} />
                                        </div>
                                    </div>
                                    <label className={labelCls}>Description</label>
                                    <textarea placeholder="• Led team of 5 engineers…" value={item.description} onChange={e => updateItem('leadership', i, 'description', e.target.value)} className={inputCls + ' resize-y font-mono text-sm'} rows={3} />
                                </div>
                            ))}
                            <AddButton onClick={() => addItem('leadership', { company: '', title: '', location: '', endDate: '', description: '' })} label="Add Leadership / Project" />
                        </section>

                        {/* 8. Languages */}
                        <section>
                            <SectionHeader icon={Globe} title="Languages" />
                            <label className={labelCls}>One language per line — format: <span className="font-mono text-indigo-500">English (Fluent)</span></label>
                            <textarea
                                rows={3}
                                value={(resume.languages || []).join('\n')}
                                onChange={e => setResume({ ...resume, languages: e.target.value.split('\n') })}
                                className={inputCls + ' resize-y font-mono text-sm'}
                                placeholder={"English (Conversational)\nMalayalam (Native)"}
                            />
                        </section>

                    </div>
                </div>

                {/* ── RIGHT PREVIEW ── */}
                <div className="w-1/2 bg-gray-200 overflow-y-auto flex justify-center py-10 relative">
                    <div className="absolute top-4 right-4 bg-white/60 backdrop-blur text-gray-500 px-3 py-1 rounded-full text-xs font-bold border border-gray-300 shadow-sm z-10">
                        Live Print Preview
                    </div>
                    <div className="w-[850px] bg-white shadow-2xl transition-all h-fit self-start">
                        <style>{`
                            @media print {
                                @page { margin: 0; size: letter; }
                                body { margin: 0; padding: 0; }
                                * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; print-color-adjust: exact !important; }
                            }
                        `}</style>
                        {templateId === 'harvard' ? (
                            <HarvardTemplate ref={componentRef} resume={resume} />
                        ) : (
                            <ExecutiveTemplate ref={componentRef} resume={resume} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
