import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

const SEO = ({
    title = "ATSense - AI Resume Optimizer & ATS Checker",
    description = "Boost your resume's ATS score with AI. Beat Applicant Tracking Systems, optimize your resume with GPT-4, and land 3x more interviews today.",
    keywords = "resume optimizer, ATS checker, AI resume builder, career tools, job search, resume scanner, ats bypass, resume feedback",
    image = "https://atsense.online/og-image.jpg",
    url = "https://atsense.online"
}: SEOProps) => {
    const siteTitle = "ATSense";
    const fullTitle = title === siteTitle ? `${siteTitle} - #1 AI Resume Optimizer` : `${title} | ${siteTitle}`;

    // SoftwareApplication schema
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "ATSense",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": description,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "1250"
        }
    };

    // WebSite schema
    const websiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ATSense",
        "url": url,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${url}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    // BreadcrumbList schema
    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://atsense.online"
            }
        ]
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbData)}
            </script>
        </Helmet>
    );
};

export default SEO;
