import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    schemas?: object[];
    type?: 'website' | 'article';
}

const SEO = ({
    title = "ATSense - AI Resume Optimizer & ATS Checker",
    description = "Boost your resume's ATS score with AI. Beat Applicant Tracking Systems, optimize your resume with GPT-4, and land 3x more interviews today.",
    keywords = "resume optimizer, ATS checker, AI resume builder, career tools, job search, resume scanner, ats bypass, resume feedback",
    image = "https://atsense.online/og-image.jpg",
    url = typeof window !== 'undefined' ? window.location.href : "https://atsense.online",
    schemas = [],
    type = 'website',
}: SEOProps) => {
    const siteTitle = "ATSense";
    const fullTitle = title === siteTitle ? `${siteTitle} - #1 AI Resume Optimizer` : `${title} | ${siteTitle}`;

    const softwareAppSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "ATSense",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": description,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "1250"
        }
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ATSense",
        "url": "https://atsense.online",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://atsense.online/templates/{search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "ATSense",
        "url": "https://atsense.online",
        "logo": "https://atsense.online/logo.png",
        "sameAs": [
            "https://twitter.com/atsense",
            "https://linkedin.com/company/atsense"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "support@atsense.online"
        }
    };

    return (
        <Helmet>
            {/* Basic Meta */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content="index, follow" />
            <meta name="author" content="ATSense" />
            <meta name="theme-color" content="#4f46e5" />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="ATSense" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:site" content="@atsense" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Core Structured Data */}
            <script type="application/ld+json">{JSON.stringify(softwareAppSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>

            {/* Page-level schemas (FAQPage, HowTo, etc.) */}
            {schemas.map((schema, i) => (
                <script key={`schema-${i}`} type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEO;
