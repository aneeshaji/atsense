import React from 'react';

// An elegant, refined template suited for Creatives, Marketing, and Design roles
const CreativeTemplate = React.forwardRef<HTMLDivElement, { resume: any }>((props, ref) => {
    const { resume } = props;
    const { personalInfo, summary, experience, education, skills, projects } = resume;

    return (
        <div 
            ref={ref} 
            className="bg-white text-gray-900 p-12 max-w-[850px] mx-auto shadow-sm tracking-wide"
            style={{ 
                fontFamily: '"Georgia", "Times New Roman", Times, serif', 
                fontSize: '10pt',
                lineHeight: '1.6',
                minHeight: '1100px'
            }}
        >
            {/* Header: Left Aligned, Strong aesthetic focus */}
            <header className="mb-8 border-l-4 border-indigo-200 pl-6 py-2">
                <h1 className="text-4xl font-normal text-gray-900 tracking-tight mb-2" style={{ fontFamily: '"Georgia", serif' }}>
                    {personalInfo?.fullName?.toUpperCase() || 'YOUR NAME'}
                </h1>
                
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-[9.5pt] font-normal text-gray-600 italic">
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.location && <span>{personalInfo.location}</span>}
                    {personalInfo?.linkedin && <span>{personalInfo.linkedin}</span>}
                    {personalInfo?.portfolio && <span className="text-indigo-600">{personalInfo.portfolio}</span>}
                </div>
            </header>

            {/* Summary: Emphasized as a personal "Statement" */}
            {summary && (
                <section className="mb-8">
                    <p className="text-[10.5pt] leading-relaxed text-gray-700 italic border-l-2 border-gray-100 pl-4">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-[14pt] font-normal text-indigo-900 mb-4 pb-1 border-b border-indigo-50" style={{ fontFamily: '"Georgia", serif' }}>
                        Professional Experience
                    </h2>
                    <div className="space-y-6">
                        {experience.map((exp: any, i: number) => (
                            <div key={i} className="pl-4">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-[11pt] text-gray-900 tracking-wide">{exp.title || 'Job Title'}</h3>
                                    <span className="text-[9pt] font-bold text-indigo-400 uppercase">
                                        {exp.startDate} {exp.startDate && exp.endDate ? '—' : ''} {exp.endDate}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline mb-3">
                                    <span className="text-[10pt] text-gray-800 uppercase tracking-wider">{exp.company || 'Company Name'}</span>
                                    {exp.location && <span className="text-[9.5pt] text-gray-500 italic">{exp.location}</span>}
                                </div>
                                {exp.description && (
                                    <ul className="list-[circle] pl-5 text-gray-700 space-y-2">
                                        {exp.description.split('\n').filter((p: string) => p.trim()).map((point: string, j: number) => {
                                            const cleanPoint = point.replace(/^[•\-\*]\s*/, '').trim();
                                            return <li key={j} className="text-[10pt] leading-relaxed">{cleanPoint}</li>;
                                        })}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education & Skills Split Container */}
            <div className="grid grid-cols-2 gap-10 mb-8">
                {/* Education */}
                {education && education.length > 0 && (
                    <section>
                        <h2 className="text-[14pt] font-normal text-indigo-900 mb-4 pb-1 border-b border-indigo-50" style={{ fontFamily: '"Georgia", serif' }}>
                            Education
                        </h2>
                        <div className="space-y-4 pl-4">
                            {education.map((edu: any, i: number) => (
                                <div key={i}>
                                    <h3 className="font-bold text-[10.5pt] text-gray-900 mb-0.5">{edu.degree || 'Degree'} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</h3>
                                    <div className="text-[10pt] text-gray-700 uppercase tracking-wider mb-1">{edu.institution || 'University Name'}</div>
                                    <div className="text-[9.5pt] text-indigo-400 italic">
                                        {edu.endDate || 'Year'} {edu.location && `• ${edu.location}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section>
                        <h2 className="text-[14pt] font-normal text-indigo-900 mb-4 pb-1 border-b border-indigo-50" style={{ fontFamily: '"Georgia", serif' }}>
                            Expertise
                        </h2>
                        <div className="pl-4">
                            <ul className="list-disc pl-4 text-gray-700 space-y-1.5 marker:text-indigo-200">
                                {skills.map((skill: string, i: number) => (
                                    <li key={i} className="text-[10pt]">{skill}</li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}
            </div>

            {/* Projects */}
            {projects && projects.length > 0 && (
                <section>
                    <h2 className="text-[14pt] font-normal text-indigo-900 mb-4 pb-1 border-b border-indigo-50" style={{ fontFamily: '"Georgia", serif' }}>
                        Selected Works
                    </h2>
                    <div className="space-y-4 pl-4">
                        {projects.map((proj: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-[11pt] text-gray-900">{proj.name || 'Project Name'}</h3>
                                    {proj.date && <span className="text-[9.5pt] italic text-indigo-400">{proj.date}</span>}
                                </div>
                                {proj.description && (
                                    <p className="text-[10pt] text-gray-700 leading-relaxed text-left">
                                        {proj.description.replace(/^[•\-\*]\s*/gm, '').replace(/\n/g, ' ')}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
});

export default CreativeTemplate;
