/**
 * Analytics Service
 * Handles event tracking for GA4
 */

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    } else {
        // Fallback or debug
        console.log(`[Analytics] ${category} > ${action} ${label ? `(${label})` : ''}`);
    }
};

export const ANALYTICS_EVENTS = {
    CONVERSION: {
        RESUME_UPLOAD: 'resume_upload',
        PDF_DOWNLOAD: 'pdf_download',
        DOCX_DOWNLOAD: 'docx_download',
        DEEP_TAILOR: 'deep_tailor_start',
        INTERVIEW_SIM: 'interview_sim_start',
        LINKEDIN_OPTIMIZE: 'linkedin_optimize_start',
        JOB_MATCH: 'job_match_start',
    },
    ENGAGEMENT: {
        RESUME_RESET: 'resume_reset',
        SECTION_EDIT: 'section_edit',
        AI_SUGGESTION_APPLIED: 'ai_suggestion_applied',
    }
};

declare global {
    interface Window {
        gtag: any;
        dataLayer: any[];
    }
}
