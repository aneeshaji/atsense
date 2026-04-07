import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const AnalyticsManager: React.FC = () => {
    const { settings, loading } = useSettings();

    useEffect(() => {
        if (loading || !settings) return;

        const gaId = settings.google_analytics_id;
        const gscTag = settings.google_search_console_tag;
        const indexing = settings.seo_indexing;

        // 1. Handle Google Analytics (GA4)
        if (gaId && gaId !== 'UA-XXXXXXX-X' && !window.gtag_initialized) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
            document.head.appendChild(script);

            script.onload = () => {
                window.dataLayer = window.dataLayer || [];
                function gtag(...args: any[]) {
                    window.dataLayer.push(args);
                }
                (window as any).gtag = gtag;
                gtag('js', new Date());
                gtag('config', gaId);
                window.gtag_initialized = true;
            };
        }

        // 2. Handle Google Search Console Tag
        if (gscTag && gscTag.includes('<meta')) {
            const temp = document.createElement('div');
            temp.innerHTML = gscTag;
            const metaTag = temp.firstChild as HTMLMetaElement;
            if (metaTag && metaTag.tagName === 'META') {
                if (!document.querySelector(`meta[name="${metaTag.name}"]`)) {
                    document.head.appendChild(metaTag);
                }
            }
        }

        // 3. Handle Global Indexing
        if (indexing === 'false') {
            let noIndex = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
            if (noIndex) {
                noIndex.content = 'noindex, nofollow';
            } else {
                const meta = document.createElement('meta');
                meta.name = 'robots';
                meta.content = 'noindex, nofollow';
                document.head.appendChild(meta);
            }
        }
    }, [settings, loading]);

    return null;
};

declare global {
    interface Window {
        dataLayer: any[];
        gtag_initialized: boolean;
    }
}

export default AnalyticsManager;
