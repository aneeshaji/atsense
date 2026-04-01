import React from 'react';

// A modern, clean, sans-serif alternative to the Harvard template
const ExecutiveTemplate = React.forwardRef<HTMLDivElement, { resume: any }>((props, ref) => {
    const { resume } = props;
    const { personalInfo, summary, experience, education, skills, projects } = resume;

    return (
        <div 
            ref={ref} 
            className="bg-white text-gray-900 p-10 max-w-[850px] mx-auto shadow-sm"
            style={{ 
                fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif', 
                fontSize: '10pt',
                lineHeight: '1.4',
                minHeight: '1100px'
            }}
        >
            {/* Header */}
            <header className="mb-6 flex flex-col items-center border-b-2 border-gray-800 pb-4">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase mb-2">{personalInfo?.fullName || 'YOUR NAME'}</h1>
                <div className="flex flex-wrap justify-center gap-3 text-[9pt] font-medium text-gray-600">
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.email && <span>• {personalInfo.email}</span>}
                    {personalInfo?.location && <span>• {personalInfo.location}</span>}
                    {personalInfo?.linkedin && <span>• {personalInfo.linkedin}</span>}
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-5">
                    <p className="text-[10pt] leading-relaxed text-gray-800">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-[11pt] font-black text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">Professional Experience</h2>
                    <div className="space-y-4">
                        {experience.map((exp: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="font-bold text-[10.5pt] text-gray-900">{exp.title || 'Job Title'}</h3>
                                    <span className="text-[9pt] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                                        {exp.startDate} {exp.startDate && exp.endDate ? '—' : ''} {exp.endDate}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline mb-2">
                                    <span className="font-semibold text-gray-700">{exp.company || 'Company Name'}</span>
                                    {exp.location && <span className="text-[9pt] text-gray-500">{exp.location}</span>}
                                </div>
                                {exp.description && (
                                    <ul className="list-disc pl-4 text-gray-700 space-y-1">
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

            {/* Projects */}
            {projects && projects.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-[11pt] font-black text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">Key Projects</h2>
                    {projects.map((proj: any, i: number) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between font-bold text-gray-900 mb-1">
                                <span>{proj.name || 'Project Name'}</span>
                                {proj.date && <span className="text-[9pt] font-medium">{proj.date}</span>}
                            </div>
                            {proj.description && (
                                <ul className="list-disc pl-4 text-gray-700">
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
                    <h2 className="text-[11pt] font-black text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">Education</h2>
                    <div className="space-y-3">
                        {education.map((edu: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between font-bold text-gray-900">
                                    <span>{edu.institution || 'University Name'}</span>
                                    <span className="text-[9pt] font-medium">{edu.endDate || 'Year'}</span>
                                </div>
                                <div className="flex justify-between text-gray-700 mt-0.5">
                                    <span>{edu.degree || 'Degree'} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</span>
                                    {edu.location && <span className="text-[9pt] text-gray-500">{edu.location}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
                <section>
                    <h2 className="text-[11pt] font-black text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">Technical Skills</h2>
                    <p className="text-[9.5pt] text-gray-800 leading-relaxed">
                        {skills.join(' • ')}
                    </p>
                </section>
            )}
        </div>
    );
});

export default ExecutiveTemplate;
