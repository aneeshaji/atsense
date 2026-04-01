import React from 'react';

// -----------------------------------------------------------------------
// Harvard / ATS-Classic Template  –  mirrors the LaTeX pdfLaTeX style
// Uses ONLY inline styles so print output is 100% predictable & ATS-safe
// -----------------------------------------------------------------------

const s = {
    page: {
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '10.5pt',
        lineHeight: '1.35',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: '0.5in 0.6in',
        maxWidth: '850px',
        margin: '0 auto',
        minHeight: '1056px',
        boxSizing: 'border-box' as const,
    },
    // Header
    headerName: {
        fontSize: '20pt',
        fontWeight: 'bold',
        margin: '0 0 4px 0',
        letterSpacing: '0.02em',
        color: '#000000',
    },
    headerContact: {
        fontSize: '10pt',
        color: '#000000',
        margin: 0,
    },
    // Section
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: '10.5pt',
        fontVariant: 'small-caps' as const,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.04em',
        color: '#000000',
        margin: '0 0 1px 0',
    },
    sectionRule: {
        border: 'none',
        borderTop: '0.5px solid #000000',
        margin: '0 0 5px 0',
    },
    section: {
        marginBottom: '10px',
    },
    // Experience / Education row
    rowFlex: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '8px',
    },
    bold: { fontWeight: 'bold', color: '#000000' },
    italic: { fontStyle: 'italic', color: '#000000' },
    // Bullet list
    bulletList: {
        listStyle: 'none',
        margin: '3px 0 0 0',
        padding: 0,
        color: '#000000',
    },
    bulletItem: {
        margin: '0 0 2px 1.5em',
        textIndent: '-1.5em',
        color: '#000000',
    },
    // Plain text
    para: { margin: '0 0 3px 0', color: '#000000' },
};

// ── helpers ──────────────────────────────────────────────────────────────

const SectionHeader = ({ title }: { title: string }) => (
    <div style={{ marginTop: '8px' }}>
        <div style={s.sectionTitle}>{title}</div>
        <hr style={s.sectionRule} />
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
                        <span>&#8211;&ensp;</span>{clean}
                    </li>
                );
            })}
        </ul>
    );
};

/** Renders the skills array in one of two modes:
 *  - Grouped:  lines like "Category: val1, val2" → bold label + values
 *  - Flat:     everything comma-joined on one line
 */
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

const HarvardTemplate = React.forwardRef<HTMLDivElement, { resume: any }>((props, ref) => {
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

    // Contact line — pipe-separated
    const contactLine = [
        personalInfo?.location,
        personalInfo?.phone,
        personalInfo?.email,
        personalInfo?.linkedin,
        personalInfo?.portfolio,
    ]
        .filter(Boolean)
        .join('\u2002|\u2002');   // en-space | en-space

    return (
        <div ref={ref} style={s.page}>

            {/* ── HEADER ── */}
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <p style={s.headerName}>{personalInfo?.fullName || 'YOUR NAME'}</p>
                {contactLine && <p style={s.headerContact}>{contactLine}</p>}
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
                    <SectionHeader title="Technical Skills" />
                    <SkillsBlock skills={skills} />
                </div>
            )}

            {/* ── PROFESSIONAL EXPERIENCE ── */}
            {experience && experience.length > 0 && (
                <div style={s.section}>
                    <SectionHeader title="Professional Experience" />
                    {experience.map((exp: any, i: number) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                            {/* Title ············· Dates */}
                            <div style={s.rowFlex}>
                                <span style={s.bold}>{exp.title || 'Position'}</span>
                                <span style={s.bold}>
                                    {exp.startDate}
                                    {exp.startDate && exp.endDate ? ' \u2013 ' : ''}
                                    {exp.endDate}
                                </span>
                            </div>
                            {/* Company & Location (italic) */}
                            <div style={s.italic}>
                                {[exp.company, exp.location].filter(Boolean).join(' \u2014 ')}
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
                        const degree = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(' \u2013 ');
                        const dateStr = edu.startDate && edu.endDate
                            ? `${edu.startDate} \u2013 ${edu.endDate}`
                            : edu.endDate || edu.startDate || '';
                        return (
                            <div key={i} style={{ marginBottom: '6px' }}>
                                <div style={s.rowFlex}>
                                    <span style={s.bold}>{degree || 'Degree'}</span>
                                    <span style={s.bold}>{dateStr}</span>
                                </div>
                                <div style={s.italic}>
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
                    <SectionHeader title="Certifications &amp; Training" />
                    {certifications.map((cert: any, i: number) => {
                        const name   = cert.name   || cert.title || '';
                        const issuer = cert.issuer || cert.organization || '';
                        const date   = cert.date   || cert.year || cert.endDate || '';
                        return (
                            <div key={i} style={{ ...s.rowFlex, marginBottom: '4px' }}>
                                <span style={{ color: '#000000' }}>
                                    <strong style={s.bold}>{name}</strong>
                                    {issuer && ` \u2013 ${issuer}`}
                                </span>
                                {date && <span style={{ color: '#000000' }}>{date}</span>}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── LANGUAGES ── */}
            {languages && languages.length > 0 && (
                <div style={s.section}>
                    <SectionHeader title="Languages" />
                    <p style={s.para}>
                        {Array.isArray(languages)
                            ? languages
                                .map((l: any) =>
                                    typeof l === 'string'
                                        ? l
                                        : `${l.name || l.language || ''}${l.level || l.proficiency ? ` (${l.level || l.proficiency})` : ''}`
                                )
                                .filter(Boolean)
                                .join(', ')
                            : languages}
                    </p>
                </div>
            )}

        </div>
    );
});

HarvardTemplate.displayName = 'HarvardTemplate';

export default HarvardTemplate;
