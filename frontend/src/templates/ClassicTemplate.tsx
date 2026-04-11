import React from 'react';

// -----------------------------------------------------------------------
// Classic Consulting Template – Strict formatting favored by Finance/Consulting
// Uses pure Times New Roman, highly readable 10pt structure.
// -----------------------------------------------------------------------

const s = {
    page: {
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '10pt',
        lineHeight: '1.4',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: '0.6in 0.8in',
        maxWidth: '850px',
        margin: '0 auto',
        minHeight: '1056px',
        boxSizing: 'border-box' as const,
    },
    // Header
    headerName: {
        fontSize: '18pt',
        fontWeight: 'bold',
        margin: '0 0 4px 0',
        textAlign: 'center' as const,
        textTransform: 'uppercase' as const,
    },
    headerContact: {
        fontSize: '10pt',
        margin: 0,
        textAlign: 'center' as const,
    },
    // Section
    section: {
        marginBottom: '14px',
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: '11pt',
        textTransform: 'uppercase' as const,
        borderBottom: '1px solid #000',
        paddingBottom: '2px',
        margin: '0 0 6px 0',
    },
    // Row Flex
    rowFlex: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' },
    
    // Bullet list
    bulletList: {
        listStyleType: 'disc',
        margin: '4px 0 0 1.2em',
        padding: 0,
    },
    bulletItem: {
        margin: '0 0 3px 0',
        paddingLeft: '4px',
    },
    // Plain text
    para: { margin: '0 0 4px 0' },
};

// ── helpers ──────────────────────────────────────────────────────────────

const SectionHeader = ({ title }: { title: string }) => (
    <div style={s.sectionTitle}>{title}</div>
);

const BulletList = ({ description }: { description: string }) => {
    if (!description) return null;
    const lines = description.split('\n').filter((l) => l.trim());
    if (lines.length === 0) return null;
    return (
        <ul style={s.bulletList}>
            {lines.map((line, i) => {
                const clean = line.replace(/^[•\-\*]\s*/, '').trim();
                return <li key={i} style={s.bulletItem}>{clean}</li>;
            })}
        </ul>
    );
};

const SkillsBlock = ({ skills }: { skills: string[] }) => {
    if (!skills || skills.length === 0) return null;
    const lines = skills.filter((l) => l.trim());
    if (lines.length === 0) return null;

    const isGrouped = lines.some((l) => l.includes(':'));

    if (isGrouped) {
        return (
            <div>
                {lines.map((line, i) => {
                    const colon = line.indexOf(':');
                    if (colon === -1) return <p key={i} style={s.para}>{line}</p>;
                    const label = line.substring(0, colon).trim();
                    const vals  = line.substring(colon + 1).trim();
                    return (
                        <p key={i} style={s.para}>
                            <strong style={s.bold}>{label}:</strong>{'\u2002'}{vals}
                        </p>
                    );
                })}
            </div>
        );
    }

    return <p style={s.para}>{lines.join(', ')}</p>;
};

// ── component ─────────────────────────────────────────────────────────────

const ClassicTemplate = React.forwardRef<HTMLDivElement, { resume: any }>((props, ref) => {
    const { resume } = props;
    const {
        personalInfo,
        summary,
        experience,
        education,
        skills,
        certifications,
        languages,
    } = resume;

    const contactLine = [
        personalInfo?.location,
        personalInfo?.phone,
        personalInfo?.email,
        personalInfo?.linkedin,
        personalInfo?.portfolio,
    ]
        .filter(Boolean)
        .join(' | ');

    return (
        <div ref={ref} style={s.page}>

            {/* ── HEADER ── */}
            <div style={{ marginBottom: '16px' }}>
                <div style={s.headerName}>{personalInfo?.fullName || 'YOUR NAME'}</div>
                {contactLine && <div style={s.headerContact}>{contactLine}</div>}
            </div>

            {/* ── EDUCATION (Often First in Consulting) ── */}
            {education && education.length > 0 && (
                <div style={s.section}>
                    <SectionHeader title="Education" />
                    {education.map((edu: any, i: number) => {
                        const degree = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ');
                        const dateStr = edu.startDate && edu.endDate
                            ? `${edu.startDate} \u2013 ${edu.endDate}`
                            : edu.endDate || edu.startDate || '';
                        return (
                            <div key={i} style={{ marginBottom: '8px' }}>
                                <div style={s.rowFlex}>
                                    <span style={s.bold}>{edu.institution || 'Institution'}</span>
                                    <span>{edu.location || ''}</span>
                                </div>
                                <div style={s.rowFlex}>
                                    <span style={s.italic}>{degree || 'Degree'}</span>
                                    <span>{dateStr}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── EXPERIENCE ── */}
            {experience && experience.length > 0 && (
                <div style={s.section}>
                    <SectionHeader title="Experience" />
                    {experience.map((exp: any, i: number) => (
                        <div key={i} style={{ marginBottom: '10px' }}>
                            <div style={s.rowFlex}>
                                <span style={s.bold}>{exp.company || 'Company'}</span>
                                <span>{[exp.location, `${exp.startDate} \u2013 ${exp.endDate}`].filter(Boolean).join(', ')}</span>
                            </div>
                            <div style={s.italic}>
                                {exp.title || 'Position'}
                            </div>
                            <BulletList description={exp.description} />
                        </div>
                    ))}
                </div>
            )}

            {/* ── PROFESSIONAL SUMMARY (If wanted) ── */}
            {summary && (
                <div style={s.section}>
                    <SectionHeader title="Summary" />
                    <p style={{ ...s.para, textAlign: 'justify' }}>{summary}</p>
                </div>
            )}

            {/* ── SKILLS & INFO ── */}
            {((skills && skills.length > 0) || (certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
                <div style={s.section}>
                    <SectionHeader title="Additional Information" />
                    {skills && skills.length > 0 && (
                        <div style={{ display: 'flex', marginBottom: '4px' }}>
                            <span style={{ ...s.bold, width: '120px', flexShrink: 0 }}>Technical Skills:</span>
                            <span>{skills.join(', ')}</span>
                        </div>
                    )}
                    {languages && languages.length > 0 && (
                        <div style={{ display: 'flex', marginBottom: '4px' }}>
                            <span style={{ ...s.bold, width: '120px', flexShrink: 0 }}>Languages:</span>
                            <span>
                                {Array.isArray(languages)
                                    ? languages.map((l: any) => typeof l === 'string' ? l : `${l.name || l.language || ''}`).filter(Boolean).join(', ')
                                    : languages}
                            </span>
                        </div>
                    )}
                    {certifications && certifications.length > 0 && (
                        <div style={{ display: 'flex', marginBottom: '4px' }}>
                            <span style={{ ...s.bold, width: '120px', flexShrink: 0 }}>Certifications:</span>
                            <span>
                                {certifications.map((c: any) => c.name || c.title).filter(Boolean).join(', ')}
                            </span>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
});

ClassicTemplate.displayName = 'ClassicTemplate';

export default ClassicTemplate;
