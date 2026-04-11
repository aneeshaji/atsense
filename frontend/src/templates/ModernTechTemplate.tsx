import React from 'react';

// -----------------------------------------------------------------------
// Modern Tech Template – ATS Friendly but visually striking
// Uses ONLY inline styles so print output is predictable & safe
// -----------------------------------------------------------------------

const theme = {
    primary: '#4338ca', // Indigo-700
    textMain: '#1e293b', // Slate-800
    textMuted: '#64748b', // Slate-500
    border: '#cbd5e1', // Slate-300
};

const s = {
    page: {
        fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: '1.5',
        color: theme.textMain,
        backgroundColor: '#ffffff',
        padding: '0.6in 0.6in',
        maxWidth: '850px',
        margin: '0 auto',
        minHeight: '1056px',
        boxSizing: 'border-box' as const,
    },
    // Header
    headerContainer: {
        borderBottom: `2px solid ${theme.primary}`,
        paddingBottom: '16px',
        marginBottom: '16px',
    },
    headerName: {
        fontSize: '24pt',
        fontWeight: 800,
        margin: '0 0 6px 0',
        letterSpacing: '-0.02em',
        color: theme.primary,
        textTransform: 'uppercase' as const,
    },
    headerContact: {
        fontSize: '9.5pt',
        color: theme.textMuted,
        fontWeight: 500,
        margin: 0,
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '12px',
    },
    // Section
    section: {
        marginBottom: '18px',
    },
    sectionTitle: {
        fontWeight: 700,
        fontSize: '12pt',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        color: theme.primary,
        margin: '0 0 8px 0',
        display: 'flex',
        alignItems: 'center',
    },
    // Experience / Education row
    rowFlex: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    title: { fontWeight: 700, color: theme.textMain, fontSize: '10.5pt' },
    date: { fontWeight: 600, color: theme.primary, fontSize: '9.5pt' },
    company: { fontWeight: 600, color: theme.textMuted, fontSize: '10pt' },
    
    // Bullet list
    bulletList: {
        listStyle: 'none',
        margin: '6px 0 0 0',
        padding: 0,
    },
    bulletItem: {
        margin: '0 0 4px 1.2em',
        textIndent: '-1.2em',
        color: theme.textMain,
    },
    // Plain text
    para: { margin: '0 0 6px 0', color: theme.textMain },
};

// ── helpers ──────────────────────────────────────────────────────────────

const SectionHeader = ({ title }: { title: string }) => (
    <div style={s.sectionTitle}>
        {title}
    </div>
);

const BulletList = ({ description }: { description: string }) => {
    if (!description) return null;
    const lines = description.split('\n').filter((l) => l.trim());
    if (lines.length === 0) return null;
    return (
        <ul style={s.bulletList}>
            {lines.map((line, i) => {
                const clean = line.replace(/^[•\-\*]\s*/, '').trim();
                return (
                    <li key={i} style={s.bulletItem}>
                        <span style={{ color: theme.primary, fontWeight: 'bold' }}>&#8226;&ensp;</span>{clean}
                    </li>
                );
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
                            <strong style={{ color: theme.primary }}>{label}:</strong>{'\u2002'}{vals}
                        </p>
                    );
                })}
            </div>
        );
    }

    return <p style={s.para}>{lines.join(' • ')}</p>;
};

// ── component ─────────────────────────────────────────────────────────────

const ModernTechTemplate = React.forwardRef<HTMLDivElement, { resume: any }>((props, ref) => {
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

    const contacts = [
        personalInfo?.location,
        personalInfo?.phone,
        personalInfo?.email,
        personalInfo?.linkedin,
        personalInfo?.portfolio,
    ].filter(Boolean);

    return (
        <div ref={ref} style={s.page}>

            {/* ── HEADER ── */}
            <div style={s.headerContainer}>
                <h1 style={s.headerName}>{personalInfo?.fullName || 'YOUR NAME'}</h1>
                {contacts.length > 0 && (
                    <div style={s.headerContact}>
                        {contacts.map((c, i) => (
                            <span key={i}>
                                {c}{i < contacts.length - 1 && <span style={{ color: theme.border, marginLeft: '12px' }}>|</span>}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* ── PROFESSIONAL SUMMARY ── */}
            {summary && (
                <div style={s.section}>
                    <SectionHeader title="Professional Summary" />
                    <p style={{ ...s.para, textAlign: 'justify' }}>{summary}</p>
                </div>
            )}

            {/* ── TECHNICAL SKILLS ── */}
            {skills && skills.length > 0 && (
                <div style={s.section}>
                    <SectionHeader title="Technical Core" />
                    <SkillsBlock skills={skills} />
                </div>
            )}

            {/* ── PROFESSIONAL EXPERIENCE ── */}
            {experience && experience.length > 0 && (
                <div style={s.section}>
                    <SectionHeader title="Experience" />
                    {experience.map((exp: any, i: number) => (
                        <div key={i} style={{ marginBottom: '16px' }}>
                            <div style={s.rowFlex}>
                                <span style={s.title}>{exp.title || 'Position'}</span>
                                <span style={s.date}>
                                    {exp.startDate}
                                    {exp.startDate && exp.endDate ? ' \u2013 ' : ''}
                                    {exp.endDate}
                                </span>
                            </div>
                            <div style={s.company}>
                                {[exp.company, exp.location].filter(Boolean).join(' • ')}
                            </div>
                            <BulletList description={exp.description} />
                        </div>
                    ))}
                </div>
            )}

            {/* ── EDUCATION ── */}
            {education && education.length > 0 && (
                <div style={s.section}>
                    <SectionHeader title="Education" />
                    {education.map((edu: any, i: number) => {
                        const degree = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ');
                        const dateStr = edu.startDate && edu.endDate
                            ? `${edu.startDate} \u2013 ${edu.endDate}`
                            : edu.endDate || edu.startDate || '';
                        return (
                            <div key={i} style={{ marginBottom: '12px' }}>
                                <div style={s.rowFlex}>
                                    <span style={s.title}>{degree || 'Degree'}</span>
                                    <span style={s.date}>{dateStr}</span>
                                </div>
                                <div style={s.company}>
                                    {[edu.institution, edu.location].filter(Boolean).join(', ')}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── CERTIFICATIONS & TRAINING ── */}
            {certifications && certifications.length > 0 && (
                <div style={s.section}>
                    <SectionHeader title="Certifications" />
                    {certifications.map((cert: any, i: number) => {
                        const name   = cert.name   || cert.title || '';
                        const issuer = cert.issuer || cert.organization || '';
                        const date   = cert.date   || cert.year || cert.endDate || '';
                        return (
                            <div key={i} style={{ ...s.rowFlex, marginBottom: '6px' }}>
                                <span style={s.para}>
                                    <strong style={s.title}>{name}</strong>
                                    {issuer && <span style={s.company}> \u2013 {issuer}</span>}
                                </span>
                                {date && <span style={s.date}>{date}</span>}
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
});

ModernTechTemplate.displayName = 'ModernTechTemplate';

export default ModernTechTemplate;
