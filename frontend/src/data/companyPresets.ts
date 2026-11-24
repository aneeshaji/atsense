export interface CompanyPreset {
    slug: string;
    name: string;
    category: 'company' | 'role';
    badge: string;
    headline: string;
    metaDescription: string;
    hiringPhilosophy: string;
    atsFormula: string;
    atsPlatform: string;
    mustHaveKeywords: string[];
    sampleBefore: string;
    sampleAfter: string;
    tips: string[];
}

export const COMPANY_PRESETS: Record<string, CompanyPreset> = {
    google: {
        slug: 'google',
        name: 'Google',
        category: 'company',
        badge: 'FAANG / Big Tech',
        headline: 'Google ATS Resume Tailor & Keyword Matcher (2026)',
        metaDescription: 'Optimize your resume for Google recruiters and internal ATS screeners using the verified Google X-Y-Z achievement formula and role keywords.',
        hiringPhilosophy: 'Google evaluates candidates based on general cognitive ability, role-related knowledge, leadership, and "Googleyness".',
        atsFormula: 'Accomplished [X], as measured by [Y], by doing [Z]. Always include baseline numbers, percentages, and dollar scale.',
        atsPlatform: 'Google Hire / Custom Internal ATS',
        mustHaveKeywords: [
            'Distributed Systems', 'Scale', 'Latency Optimization', 'Data Structures', 
            'System Architecture', 'GCP', 'Cross-functional Collaboration', 'A/B Testing', 
            'Algorithms', 'High Availability', 'Production Reliability', 'Telemetry'
        ],
        sampleBefore: 'Worked on backend services and made the database faster.',
        sampleAfter: 'Optimized PostgreSQL queries and Redis caching for distributed microservices, reducing p99 API latency by 42% across 2.5M daily active users.',
        tips: [
            'Every single bullet point must contain a quantifiable metric (% improvement, latency ms, $ saved).',
            'Focus on scale: specify requests per second (RPS), database record volume, or team size.',
            'Highlight cross-functional alignment between engineering, product, and design.'
        ]
    },
    amazon: {
        slug: 'amazon',
        name: 'Amazon',
        category: 'company',
        badge: 'FAANG / E-Commerce & Cloud',
        headline: 'Amazon ATS Resume Tailor & Leadership Principles',
        metaDescription: 'Format your resume for Amazon ATS and bar raisers. Infuse your bullets with Customer Obsession, Ownership, and Deliver Results.',
        hiringPhilosophy: 'Amazon hiring is centered around the 16 Leadership Principles (LPs). Every resume line must demonstrate at least one principle.',
        atsFormula: 'Customer Obsession + Bias for Action = Quantified Business Impact. Highlight end-to-end ownership.',
        atsPlatform: 'Amazon Internal ATS / iCIMS',
        mustHaveKeywords: [
            'AWS Services', 'Customer Obsession', 'Ownership', 'Deliver Results', 
            'Cost Optimization', 'Microservices', 'Serverless', 'DynamoDB', 
            'SLA Compliance', 'Frugality', 'Operational Excellence', 'High-throughput'
        ],
        sampleBefore: 'Built cloud pipelines for customer data processing.',
        sampleAfter: 'Spearheaded automated AWS serverless event pipeline (Lambda, SQS, DynamoDB), cutting data processing turnaround from 4 hours to 8 minutes and saving $85K/yr.',
        tips: [
            'Explicitly incorporate Leadership Principle phrases: "Delivered Results", "Demonstrated Ownership", "Invent and Simplify".',
            'Quantify cost savings ($) and efficiency gains (hours/minutes reduced).',
            'Clarify your individual contribution rather than saying "we built".'
        ]
    },
    microsoft: {
        slug: 'microsoft',
        name: 'Microsoft',
        category: 'company',
        badge: 'Enterprise & AI',
        headline: 'Microsoft ATS Resume Tailor & Azure Guidelines',
        metaDescription: 'Tailor your resume for Microsoft engineering, product, and cloud positions with verified ATS keyword targeting.',
        hiringPhilosophy: 'Microsoft prioritizes "Growth Mindset", empathy for customer scenarios, collaboration across teams, and scalable cloud architecture.',
        atsPlatform: 'Microsoft Careers / SAP SuccessFactors',
        atsFormula: 'Problem Solved + Technology Stack + Global Enterprise Impact + Collaborative Leadership.',
        mustHaveKeywords: [
            'Azure Cloud', 'Enterprise Architecture', 'Growth Mindset', 'TypeScript', 
            '.NET Core / C#', 'DevOps CI/CD', 'Security & Compliance', 'Scalability', 
            'Cross-team Synergy', 'Customer Scenario Modeling', 'API Design'
        ],
        sampleBefore: 'Managed Azure migration for internal services.',
        sampleAfter: 'Architected multi-region Azure migration (App Services, CosmosDB, Azure DevOps), achieving 99.99% uptime and zero-downtime deployment for 500K+ enterprise seats.',
        tips: [
            'Emphasize security, compliance, and multi-tenant enterprise reliability.',
            'Show evidence of continuous learning (Growth Mindset) and mentoring peers.',
            'Highlight cloud-native technologies, particularly Azure or hybrid cloud.'
        ]
    },
    meta: {
        slug: 'meta',
        name: 'Meta',
        category: 'company',
        badge: 'FAANG / Social & AI',
        headline: 'Meta (Facebook) ATS Resume Tailor & Impact Matcher',
        metaDescription: 'Beat Meta recruiter filters by showcasing high-velocity engineering, hyper-scale consumer impact, and end-to-end ownership.',
        hiringPhilosophy: 'Meta values candidates who "Move Fast", "Focus on Long-Term Impact", and handle massive consumer scale with high autonomy.',
        atsPlatform: 'Custom Meta Recruiting ATS',
        atsFormula: 'High Velocity Execution + Consumer Scale Metric + Technical Innovation.',
        mustHaveKeywords: [
            'Hyper-scale Systems', 'Move Fast', 'Product Sense', 'GraphQL', 
            'React', 'Real-time Analytics', 'PyTorch / ML Infra', 'A/B Testing', 
            'Concurrency', 'User Retention Metrics', 'Distributed Storage'
        ],
        sampleBefore: 'Created web features and ran experiments for mobile users.',
        sampleAfter: 'Designed and shipped high-performance GraphQL feed endpoints with React, driving a +14% lift in user session length across 12M global mobile sessions.',
        tips: [
            'Highlight direct metric lifts: Retention, MAU, DAU, engagement, or conversion.',
            'Show experience with rapid iterative experimentation and feature flags.',
            'Demonstrate strong product intuition alongside technical engineering rigor.'
        ]
    },
    deloitte: {
        slug: 'deloitte',
        name: 'Deloitte',
        category: 'company',
        badge: 'Big 4 / Consulting',
        headline: 'Deloitte Consulting ATS Resume Tailor & Keywords',
        metaDescription: 'Tailor your resume for Deloitte Advisory, Consulting, and Tech practices. Pass Taleo/Workday filters with executive-ready metrics.',
        hiringPhilosophy: 'Deloitte seeks candidates with structured analytical thinking, client advisory presence, digital transformation expertise, and project leadership.',
        atsPlatform: 'Taleo / Workday Recruiting',
        atsFormula: 'Client Challenge + Strategic Solution + Multi-Million Dollar Business Outcome.',
        mustHaveKeywords: [
            'Digital Transformation', 'Stakeholder Management', 'Strategic Advisory', 
            'Agile PMO', 'Business Process Re-engineering', 'ERP / Cloud', 
            'Executive Briefings', 'Risk Mitigation', 'Change Management', 'KPI Delivery'
        ],
        sampleBefore: 'Helped client upgrade their financial systems and reporting.',
        sampleAfter: 'Advised Fortune 500 client on digital ERP cloud migration, directing a 14-person agile team to automate reconciliations and accelerate quarterly close by 6 days.',
        tips: [
            'Frame bullets in terms of client value created and business transformation.',
            'Mention team sizes led, budgets managed ($M), and executive presentations.',
            'Ensure clean standard typography: Deloitte ATS strictly rejects decorative columns.'
        ]
    },
    'goldman-sachs': {
        slug: 'goldman-sachs',
        name: 'Goldman Sachs',
        category: 'company',
        badge: 'Tier-1 Investment Banking & FinTech',
        headline: 'Goldman Sachs ATS Resume Tailor & Quant Guidelines',
        metaDescription: 'Optimize your resume for Goldman Sachs Technology, Global Markets, and Asset Management ATS screeners.',
        hiringPhilosophy: 'Goldman Sachs values extreme precision, low-latency performance, rigorous risk governance, and analytical problem-solving.',
        atsPlatform: 'Kenexa / Workday Financial',
        atsFormula: 'Financial Scope + Mathematical / Technical Rigor + Regulatory & Risk Governance.',
        mustHaveKeywords: [
            'High-frequency Trading', 'Low Latency', 'Risk Management', 'FinTech Architecture', 
            'SEC Compliance', 'Quantitative Analysis', 'C++ / Java Core', 'Algorithmic Execution', 
            'Data Integrity', 'Zero Tolerance Error', 'Financial Modeling'
        ],
        sampleBefore: 'Worked on payment and transaction backend services.',
        sampleAfter: 'Engineered sub-millisecond transaction processing engine handling $420M in daily trade volume with zero transactional defects and 100% regulatory audit compliance.',
        tips: [
            'Emphasize zero-defect reliability, audit readiness, and compliance.',
            'Highlight experience with mission-critical systems and monetary throughput.',
            'List exact programming languages, financial instruments, and performance metrics.'
        ]
    },
    'software-engineer': {
        slug: 'software-engineer',
        name: 'Software Engineer',
        category: 'role',
        badge: 'Tech & Engineering',
        headline: 'Software Engineer ATS Resume Tailor (2026)',
        metaDescription: 'Pass ATS scanners for Frontend, Backend, and Full Stack Software Engineer roles with verified technical keyword benchmarks.',
        hiringPhilosophy: 'Recruiters search for concrete programming stacks, system scale, code quality practices, and business impact.',
        atsPlatform: 'Greenhouse, Lever, Workday',
        atsFormula: 'Role Responsibilities + Technologies Used + Measurable Architectural Improvement.',
        mustHaveKeywords: [
            'System Design', 'Microservices', 'RESTful APIs', 'CI/CD Pipelines', 
            'Unit & Integration Testing', 'Docker / Kubernetes', 'PostgreSQL / NoSQL', 
            'Code Optimization', 'Cloud Infrastructure', 'Git Flow', 'Agile / Scrum'
        ],
        sampleBefore: 'Wrote code for web application backend.',
        sampleAfter: 'Architected Node.js/Go microservices with Docker & Kubernetes, automating CI/CD pipeline deployments and shrinking deploy failure rates from 11% to under 0.4%.',
        tips: [
            'Group your technical skills into categorized sections (Languages, Frameworks, Cloud, Databases).',
            'Avoid generic buzzwords like "hard worker"; use active verbs like "Architected", "Engineered", "Benchmarked".',
            'Pair every technology mentioned with where and how you applied it.'
        ]
    },
    'product-manager': {
        slug: 'product-manager',
        name: 'Product Manager',
        category: 'role',
        badge: 'Product & Strategy',
        headline: 'Product Manager (PM) ATS Resume Tailor',
        metaDescription: 'Tailor your PM resume for modern tech companies. Highlight product discovery, user retention, roadmap execution, and revenue growth.',
        hiringPhilosophy: 'Hiring managers seek PMs who bridge engineering, design, and business, with data-driven decision-making and clear ownership.',
        atsPlatform: 'Greenhouse, Lever, SmartRecruiters',
        atsFormula: 'Customer Pain Point + Discovery & Roadmap + Business Revenue or Retention Outcome.',
        mustHaveKeywords: [
            'Product Discovery', 'User Journey Mapping', 'A/B Testing', 'Roadmap Prioritization', 
            'Go-To-Market (GTM)', 'PRD Specifications', 'Customer Retention (LTV/CAC)', 
            'OKRs / KPIs', 'User Research', 'Cross-functional Leadership', 'Agile Sprint Planning'
        ],
        sampleBefore: 'Managed the product backlog and worked with designers.',
        sampleAfter: 'Spearheaded end-to-end launch of self-serve onboarding flow across web & mobile, elevating 30-day user activation by +28% and generating $340K in new ARR.',
        tips: [
            'Quantify customer metrics: Adoption, Churn reduction, ARR/NPS impact.',
            'Show how you validated hypotheses through user interviews and data analytics.',
            'Highlight cross-functional leadership without formal authority.'
        ]
    }
};
