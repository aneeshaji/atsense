import React from 'react';

// A high-density, tech-focused template tailored for Developers, Engineers & Data Scientists
const TechTemplate = React.forwardRef<HTMLDivElement, { resume: any }>((props, ref) => {
    const { resume } = props;
    const { personalInfo, summary, experience, education, skills, projects } = resume;

    return (
        <div 
            ref={ref} 
            className="bg-white text-gray-900 p-10 max-w-[850px] mx-auto shadow-sm"
            style={{ 
                fontFamily: '"Roboto", "Inter", "Helvetica Neue", Helvetica, sans-serif', 
                fontSize: '9.5pt',
                lineHeight: '1.35',
                minHeight: '1100px'
            }}
        >
            {/* Header */}
            <header className="mb-4 flex flex-col justify-center items-center">
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-1" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    {personalInfo?.fullName || 'YOUR NAME'}
                </h1>
                
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[9pt] font-medium text-gray-700">
                    {personalInfo?.email && <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.location && <span>{personalInfo.location}</span>}
                </div>
                
                {/* Tech links prioritized */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[9pt] font-bold text-indigo-700 mt-1">
                    {personalInfo?.github && <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>}
                    {personalInfo?.linkedin && <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>}
                    {personalInfo?.portfolio && <a href={personalInfo.portfolio} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a>}
                </div>
            </header>

            {/* Tech Priority: Skills Array immediately visible to ATS bots and Recruiters */}
            {skills && skills.length > 0 && (
                <section className="mb-4 border-t-2 border-b-2 border-gray-900 py-3">
                    <p className="text-[9.5pt] text-gray-900 font-medium leading-relaxed">
                        <strong className="text-gray-900 mr-2 uppercase text-[9pt] tracking-widest" style={{ fontFamily: '"Courier New", Courier, monospace' }}>CORE TECHNOLOGIES:</strong>
                        {skills.join(' • ')}
                    </p>
                </section>
            )}

            {/* Summary */}
            {summary && (
                <section className="mb-5">
                    <p className="text-[10pt] leading-relaxed text-gray-800 text-justify">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-[12pt] font-bold text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        Experience
                    </h2>
                    <div className="space-y-4">
                        {experience.map((exp: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="font-bold text-[10.5pt] text-gray-900">{exp.title || 'Software Engineer'}</h3>
                                    <span className="text-[9pt] font-bold text-gray-600">
                                        {exp.startDate} {exp.startDate && exp.endDate ? '—' : ''} {exp.endDate}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline mb-2">
                                    <span className="font-semibold text-indigo-800">{exp.company || 'Tech Company'}</span>
                                    {exp.location && <span className="text-[9pt] text-gray-500 italic">{exp.location}</span>}
                                </div>
                                {exp.description && (
                                    <ul className="list-disc pl-5 text-gray-800 space-y-1">
                                        {exp.description.split('\n').filter((p: string) => p.trim()).map((point: string, j: number) => {
                                            const cleanPoint = point.replace(/^[•\-\*]\s*/, '').trim();
                                            return <li key={j} className="text-[9.5pt]">{cleanPoint}</li>;
                                        })}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Specialized Area: Key Projects */}
            {projects && projects.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-[12pt] font-bold text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        Open Source & Projects
                    </h2>
                    {projects.map((proj: any, i: number) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between items-baseline font-bold text-gray-900 mb-1">
                                <span className="text-[10pt]">{proj.name || 'Project Name'}</span>
                                {proj.date && <span className="text-[9pt] font-medium text-gray-600">{proj.date}</span>}
                            </div>
                            {proj.description && (
                                <ul className="list-disc pl-5 text-gray-800">
                                    {proj.description.split('\n').filter((p: string) => p.trim()).map((point: string, j: number) => {
                                        const cleanPoint = point.replace(/^[•\-\*]\s*/, '').trim();
                                        return <li key={j} className="text-[9.5pt]">{cleanPoint}</li>;
                                    })}
                                </ul>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-[12pt] font-bold text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        Education
                    </h2>
                    <div className="space-y-3">
                        {education.map((edu: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline font-bold text-gray-900">
                                    <span className="text-[10pt]">{edu.institution || 'University Name'}</span>
                                    <span className="text-[9pt] text-gray-600">{edu.endDate || 'Year'}</span>
                                </div>
                                <div className="flex justify-between text-gray-800 mt-0.5">
                                    <span className="text-[9.5pt]">{edu.degree || 'Degree'} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</span>
                                    {edu.location && <span className="text-[9pt] text-gray-500 italic">{edu.location}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications (Common in Tech) */}
            {resume.certifications && resume.certifications.length > 0 && (
                <section>
                    <h2 className="text-[12pt] font-bold text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-300 pb-1" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                        Certifications
                    </h2>
                    <div className="space-y-2">
                        {resume.certifications.map((cert: any, i: number) => (
                            <div key={i} className="flex justify-between items-baseline">
                                <span className="font-bold text-[9.5pt] text-gray-900">{cert.name || 'Certification Name'}</span>
                                <span className="text-[9pt] text-gray-600">{cert.date || 'Year'}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
});

export default TechTemplate;
