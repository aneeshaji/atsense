import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Target, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';

const GUIDES: Record<string, {
    title: string;
    category: string;
    readTime: string;
    description: string;
    keywords: string;
    intro: string;
    sections: { heading: string; body: string; tips?: string[] }[];
    cta: { text: string; link: string; label: string };
}> = {
    'guide-ats': {
        title: 'How to Beat an ATS in 2025: The Complete Guide',
        category: 'ATS Tips',
        readTime: '8 min read',
        description: 'Learn exactly how Applicant Tracking Systems parse and score your resume — and the 7 proven strategies to ensure your resume always reaches a human recruiter.',
        keywords: 'how to beat ats, ats resume tips, applicant tracking system guide, ats optimization',
        intro: 'Up to 75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them. Understanding how these systems work is the single most important thing you can do to improve your job search success rate.',
        sections: [
            { heading: 'What is an ATS and How Does It Work?', body: 'An Applicant Tracking System (ATS) is software used by employers to manage job applications. When you submit your resume, the ATS parses it into structured data — job titles, skills, dates, education — and scores it against the job description using keyword matching algorithms. Systems like Workday, Greenhouse, Lever, and Taleo are used by the majority of mid-to-large companies.' },
            { heading: '1. Use a Single-Column Layout', body: 'Multi-column resumes confuse ATS parsers. The text gets read left-to-right across columns, garbling your content. Stick to a clean, single-column document with clear section headings.', tips: ['Avoid tables, text boxes, and columns', 'Never put key information in headers or footers', 'Use 10–12pt standard fonts like Arial, Calibri, or Georgia'] },
            { heading: '2. Match Keywords from the Job Description', body: 'ATS filters rank resumes by how closely they match the job posting. If the posting says "Project Management" and your resume says "Managed Projects," you may not match. Use exact phrases.', tips: ['Copy key requirements word-for-word where truthful', 'Include both long-form and acronyms (e.g., "Search Engine Optimization (SEO)")', 'Use ATSense to automatically extract and align keywords'] },
            { heading: '3. Use Standard Section Headings', body: 'ATS software is trained to find specific headers. Non-standard headings like "My Story" or "What I\'ve Done" will cause your sections to be missed entirely.', tips: ['Work Experience (not "Career Journey")', 'Education (not "Academic Background")', 'Skills (not "What I Know")'] },
            { heading: '4. Save in the Right Format', body: 'Unless the application specifically asks for a Word document, submit your resume as a .pdf. PDFs preserve formatting, but ensure yours was created digitally (not scanned). ATS tools handle text-based PDFs well.', tips: ['Avoid image-based PDFs (scans)', 'Name your file: FirstName-LastName-Resume.pdf', 'Never embed fonts that might not parse correctly'] },
            { heading: '5. Quantify Your Achievements', body: 'While keyword matching gets you through the ATS, the quantified impact impresses the human recruiter who reviews passing resumes. Numbers stand out fast in a scan.', tips: ['"Reduced customer churn by 22%"', '"Led a team of 8 engineers across 3 product lines"', '"Generated $1.2M in new business in Q4"'] },
            { heading: '6. Tailor for Every Application', body: 'A generic resume blast is the lowest ROI job search strategy. A targeted resume that mirrors the language of a specific job listing will outperform a generic one every time. It takes an extra 10 minutes and can completely change your results.' },
            { heading: '7. Test Your Resume Before Submitting', body: 'Use a free ATS checker (like ATSense) to scan your resume before submitting. You can identify parsing problems, missing keywords, and formatting issues before they cost you the interview.' },
        ],
        cta: { text: 'Ready to test your resume right now?', link: '/resume-grader', label: 'Check My ATS Score Free →' },
    },
    'guide-linkedin': {
        title: 'Optimize Your LinkedIn Profile for Recruiter Searches',
        category: 'LinkedIn',
        readTime: '6 min read',
        description: 'Recruiters use LinkedIn every day to find candidates. Here\'s how to rank at the top of their searches with keyword optimization and strategic positioning.',
        keywords: 'linkedin profile optimization, linkedin for job search, linkedin seo, linkedin recruiter search',
        intro: 'LinkedIn has over 1 billion members, but most profiles are invisible to recruiters. Strategic optimization can increase your profile views by 10x and lead to recruiters reaching out to you, rather than the other way around.',
        sections: [
            { heading: 'Optimize Your Headline', body: 'Your LinkedIn headline is the most important SEO field on your profile. It appears in search results and is heavily weighted by LinkedIn\'s algorithm. Don\'t just put your job title — pack it with keywords.', tips: ['Bad: "Software Engineer at Acme Corp"', 'Good: "Senior Software Engineer | React · Node.js · AWS | Open to New Opportunities"', 'Use the | separator to add more keywords'] },
            { heading: 'Write a Keyword-Rich About Section', body: 'The About section (summary) is indexed by LinkedIn\'s search engine. Write 3–5 paragraphs covering: who you are, what you do, your key skills and industries, and a call to action. Include the exact job titles you\'re targeting.', tips: ['Start with a strong hook', 'Include 8–12 relevant skills and tools', 'End with your email or preferred contact method'] },
            { heading: 'Treat Your Experience Like a Resume', body: 'Don\'t just list job titles and companies. Add bullet points with quantified achievements for each role. Use the same keywords a recruiter would search for. LinkedIn indexes all this text.' },
            { heading: 'Skills & Endorsements Matter', body: 'Add up to 50 skills (LinkedIn only shows 3 by default). Prioritize the skills most common in your target job listings. Endorsements from colleagues make your profile more credible and boost your visibility.' },
            { heading: 'Get the "Open to Work" Banner Right', body: 'If you\'re actively searching, enable the "Open to Work" feature and specify: target job titles (use multiple variations), location preferences, and job types. LinkedIn shows your profile to more recruiters when this is active.', tips: ['Add 5+ target job titles', 'Choose "Recruiters only" if you\'re employed', 'Update it regularly to remain active in searches'] },
            { heading: 'Engage to Increase Visibility', body: 'LinkedIn\'s algorithm boosts profiles of active users. Commenting on industry posts, resharing relevant content, and posting once a week can significantly expand who sees your profile — including recruiters who aren\'t actively searching.' },
        ],
        cta: { text: 'Build a resume that matches your LinkedIn profile', link: '/builder', label: 'Build My Resume →' },
    },
    'guide-resume': {
        title: 'Writing a Resume That Gets 3x More Interviews',
        category: 'Resume Writing',
        readTime: '10 min read',
        description: 'The single biggest mistake most candidates make is writing a resume for humans. Here\'s how to write one that passes ATS filters and impresses recruiters.',
        keywords: 'how to write a resume, resume writing tips, resume guide 2025, professional resume writing',
        intro: 'Most people write their resume like a job description: a list of responsibilities. The most successful candidates write their resume like a marketing document — selling their impact, not just their duties.',
        sections: [
            { heading: 'Start with a Powerful Summary', body: 'Your resume summary (2–4 lines at the top) is your elevator pitch. It should immediately communicate who you are, your level of experience, and your most impressive achievement. Recruiters spend 6 seconds scanning a resume before deciding.', tips: ['Include your target job title', 'Mention years of experience', 'Add your single biggest measurable achievement'] },
            { heading: 'Use the STAR Framework for Bullet Points', body: 'Each bullet point should describe a Situation/Task, the Action you took, and the Result. Focus on the result first — that\'s what grabs attention.', tips: ['"Rebuilt the checkout flow (Action), reducing cart abandonment by 34% (Result)"', '"Managed cross-functional team of 10 (Action) to deliver $2M product launch on time (Result)"'] },
            { heading: 'Quantify Everything Possible', body: 'Numbers are the most powerful elements in a resume. They\'re specific, credible, and scannable. Look back at your experience and quantify audience sizes, revenue, savings, team sizes, timelines, and growth rates.' },
            { heading: 'Tailor Your Skills Section', body: 'Your skills section should reflect the exact terminology used in your target job posting. Group skills logically: Programming Languages, Frameworks, Tools, Soft Skills. Don\'t pad it with obvious skills like "Microsoft Word."' },
            { heading: 'Education Formatting Rules', body: 'List education in reverse chronological order. Include degree, major, university, and graduation year. If you\'re early-career (under 3 years experience), put education above experience. After that, move it below.', tips: ['Include GPA only if above 3.5', 'List relevant coursework if you\'re a new graduate', 'Remove high school once you have a college degree'] },
            { heading: 'Length and Formatting', body: 'One page for under 10 years experience. Two pages for senior professionals. No photos. No colors that reduce ATS readability. No icons. Standard fonts at 10–12pt. Consistent margins (0.5–1 inch). Save as PDF.' },
        ],
        cta: { text: 'Build your optimized resume with AI assistance', link: '/builder', label: 'Start Building Free →' },
    },
    'guide-cover-letter': {
        title: 'How to Write a Cover Letter That Actually Gets Read',
        category: 'Cover Letters',
        readTime: '5 min read',
        description: 'Most cover letters are ignored. This guide shows you how to write a compelling, personalized cover letter that complements your resume and gets noticed.',
        keywords: 'how to write a cover letter, cover letter tips, cover letter guide, cover letter examples',
        intro: 'A well-crafted cover letter can set you apart when two candidates have identical resumes. A poorly written one can get your application discarded even if your resume is strong.',
        sections: [
            { heading: 'The Opening Hook', body: 'Never start with "I am writing to apply for..." — every recruiter has read that 1,000 times. Open with a compelling statement that immediately establishes why you\'re the right person.', tips: ['"After scaling 3 SaaS products to $10M ARR, I\'m excited to bring that growth mindset to [Company]."', '"[Company]\'s commitment to sustainable supply chains is why I built my entire career around operations."'] },
            { heading: 'Paragraph 2: What You\'ve Done', body: 'In one paragraph, highlight your most relevant achievement for this specific role. This is not a summary of your entire resume — it\'s the one story that proves you can do this exact job.' },
            { heading: 'Paragraph 3: Why This Company', body: 'Show you\'ve done your research. Reference a recent product launch, company initiative, or values statement. This proves you\'re genuinely interested — not just spray-and-praying applications.' },
            { heading: 'The Close', body: 'End with a confident, action-oriented close. Not "I hope to hear from you" but "I\'d love to explore how my experience can drive [specific outcome] at [Company]. I\'m available for a call this week."' },
            { heading: 'Formatting Rules', body: 'Keep it to one page. Use the same fonts and styling as your resume for a cohesive application. Address it to a specific person if at all possible (check LinkedIn for the hiring manager\'s name).', tips: ['Max 4 short paragraphs', 'Under 350 words total', 'Proofread twice — typos here are a death sentence'] },
        ],
        cta: { text: 'Generate a tailored cover letter with AI', link: '/cover-letters', label: 'Write My Cover Letter →' },
    },
    'guide-job-search': {
        title: 'The 2025 Job Search Strategy: From Application to Offer',
        category: 'Job Search',
        readTime: '12 min read',
        description: 'A step-by-step system for organizing your job search, tracking applications, nailing interviews, and negotiating a salary 20–30% higher.',
        keywords: 'job search strategy 2025, how to find a job, job application tips, salary negotiation',
        intro: 'The average job search takes 3–6 months. But candidates with a structured, strategic approach cut that in half. Here\'s the system that consistently works.',
        sections: [
            { heading: 'Step 1: Define Your Target Before Applying', body: 'The biggest job search mistake is applying to everything. Define your target first: 3–5 specific job titles, 2–3 industries, preferred company size, and non-negotiable location or remote requirements. This focus makes everything more efficient.' },
            { heading: 'Step 2: Build Your Tracking System', body: 'Track every application in a spreadsheet: Company, Role, Date Applied, Status, Next Action, and Contact Name. Review it every Monday. Most job seekers lose opportunities because they forget to follow up.', tips: ['Use Google Sheets or Notion', 'Set a calendar reminder to follow up after 7 days', 'Log every recruiter email and LinkedIn message'] },
            { heading: 'Step 3: The 60/40 Rule', body: 'Spend 60% of your job search time on networking and only 40% on direct applications. Research consistently shows 70–80% of jobs are filled through referrals and networking before ever being publicly posted.' },
            { heading: 'Step 4: Target Quality Over Quantity', body: 'Sending 100 generic applications yields fewer interviews than 20 highly tailored ones. For each target role, spend 15 minutes customizing your resume to match the job description before applying.' },
            { heading: 'Step 5: Interview Preparation Framework', body: 'Prepare 3 strong STAR stories for behavioral questions. Research the company\'s recent news, products, and competitors. Prepare 5 thoughtful questions for the interviewer. Practice out loud — not just in your head.', tips: ['Use ATSense\'s Interview Prep tool for AI mock interviews', 'Record yourself answering questions to spot nervous habits', 'Research the interviewer on LinkedIn beforehand'] },
            { heading: 'Step 6: Salary Negotiation', body: 'Never accept the first offer. Research the market rate (Levels.fyi, Glassdoor, LinkedIn Salary). Counter at the top of the market range. The company expects negotiation — candidates who don\'t negotiate leave 10–20% on the table.', tips: ['"Based on my research and experience, I was expecting $X. Is there flexibility there?"', 'Negotiate total comp, not just base (RSUs, bonus, PTO, remote days)', 'Always negotiate in writing via email to have a record'] },
        ],
        cta: { text: 'Start with a powerful, ATS-optimized resume', link: '/builder', label: 'Build My Resume Free →' },
    },
    'guide-interview': {
        title: 'The STAR Method: Answering Behavioral Interview Questions',
        category: 'Interview Prep',
        readTime: '7 min read',
        description: 'Master the Situation, Task, Action, Result framework to answer behavioral interview questions with confidence and clarity.',
        keywords: 'star method interview, behavioral interview questions, how to answer tell me about yourself, interview prep',
        intro: 'Behavioral interviews are designed to predict your future performance based on past actions. The STAR method gives you a reliable, structured way to answer any behavioral question with confidence.',
        sections: [
            { heading: 'What is the STAR Method?', body: 'STAR stands for Situation, Task, Action, Result. It\'s a framework for structuring answers to behavioral questions ("Tell me about a time when..."). Each component plays a specific role in making your answer clear and compelling.' },
            { heading: 'S — Situation', body: 'Set the scene briefly. Give just enough context for the interviewer to understand the stakes. Keep this to 1–2 sentences. The situation is not the focus — it\'s just the stage.', tips: ['"Our team was 3 weeks from launching a product when the lead engineer left unexpectedly."'] },
            { heading: 'T — Task', body: 'Describe your specific responsibility. What were you accountable for? This clarifies your role and ownership.', tips: ['"I was tasked with recruiting a replacement and keeping the launch timeline intact."'] },
            { heading: 'A — Action', body: 'This is the most important part. Describe exactly what YOU did — not what the team did. Use "I" not "we." Be specific about your decision-making process.', tips: ['"I posted the role, screened 14 candidates in 4 days, and brought in a contract engineer by day 5."'] },
            { heading: 'R — Result', body: 'Always end with a measurable outcome. What happened? What did you achieve? If possible, quantify it.', tips: ['"We launched on schedule and the product hit 10,000 users in the first month — 40% ahead of forecast."'] },
            { heading: 'The 5 Must-Prepare STAR Stories', body: 'Prepare 5 strong stories that can be adapted to multiple questions. cover these themes:', tips: ['Leadership / Influence', 'Conflict / Disagreement', 'Failure / Mistake & Recovery', 'Innovation / Problem Solving', 'Collaboration / Teamwork'] },
            { heading: 'Use the Interview Prep Tool', body: 'ATSense includes an AI Interview Simulator that generates role-specific behavioral questions and gives you real-time feedback on your answers. Practice until your stories feel natural and concise.' },
        ],
        cta: { text: 'Practice with AI-powered mock interviews', link: '/interview-prep', label: 'Start Interview Prep →' },
    },
};

export default function GuideDetail() {
    const { slug } = useParams<{ slug: string }>();
    const guide = slug ? GUIDES[slug] : null;

    if (!guide) {
        return (
            <div className="min-h-screen bg-white pt-32 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Guide not found</h1>
                <Link to="/blog" className="text-indigo-600 font-semibold hover:underline">← Back to Resources</Link>
            </div>
        );
    }

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": guide.title,
        "description": guide.description,
        "author": { "@type": "Organization", "name": "ATSense" },
        "publisher": { "@type": "Organization", "name": "ATSense", "url": "https://atsense.online" },
        "url": `https://atsense.online/blog/${slug}`,
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            <SEO
                title={guide.title}
                description={guide.description}
                keywords={guide.keywords}
                url={`https://atsense.online/blog/${slug}`}
                type="article"
                schemas={[articleSchema]}
            />

            {/* Article Header */}
            <div className="pt-24 pb-12 border-b border-slate-100 bg-slate-50/50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors">
                        <ArrowLeft size={14} /> Back to Resources
                    </Link>
                    <div className="flex items-center gap-3 mb-5">
                        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">{guide.category}</span>
                        <span className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
                            <Clock size={12} /> {guide.readTime}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-5">{guide.title}</h1>
                    <p className="text-xl text-slate-600 leading-relaxed font-medium">{guide.intro}</p>
                </div>
            </div>

            {/* Article Body */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="space-y-12">
                    {guide.sections.map((section, i) => (
                        <div key={i}>
                            <h2 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100">{section.heading}</h2>
                            <p className="text-slate-600 leading-relaxed text-base mb-4">{section.body}</p>
                            {section.tips && (
                                <ul className="space-y-2 mt-4">
                                    {section.tips.map((tip, j) => (
                                        <li key={j} className="flex items-start gap-3 text-slate-700 text-sm">
                                            <CheckCircle size={15} className="text-indigo-500 shrink-0 mt-0.5" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA Box */}
                <div className="mt-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white text-center">
                    <Target size={28} className="mx-auto mb-4 text-indigo-200" />
                    <h3 className="text-2xl font-black mb-3">{guide.cta.text}</h3>
                    <Link
                        to={guide.cta.link}
                        className="inline-flex items-center gap-2 bg-white text-indigo-600 font-black py-3 px-8 rounded-xl hover:bg-indigo-50 transition-all text-sm uppercase tracking-wider mt-2"
                    >
                        {guide.cta.label} <ChevronRight size={16} />
                    </Link>
                </div>

                {/* Back link */}
                <div className="mt-10 pt-8 border-t border-slate-100">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors">
                        <ArrowLeft size={14} /> All Resources
                    </Link>
                </div>
            </div>
        </div>
    );
}
