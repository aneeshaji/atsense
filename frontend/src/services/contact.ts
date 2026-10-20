import api from './api';

export interface ContactPayload {
    name?: string;
    email: string;
    message?: string;
    subject?: string;
    phone?: string;
    type?: 'general' | 'newsletter' | 'partnership' | 'support';
    botcheck?: string;
}

export interface ContactResponse {
    ok: boolean;
    message: string;
    mailto?: string;
}

const SUPPORT_EMAIL = 'support@atsense.online';

/**
 * Build fallback mailto link if API server is completely unreachable
 */
export const buildFallbackMailto = (data: ContactPayload): string => {
    const lines = [
        `Name: ${data.name || 'Not provided'}`,
        `Email: ${data.email}`,
        data.phone ? `Phone: ${data.phone}` : null,
        `Category: ${data.type || 'General Inquiry'}`,
        '',
        'Message:',
        data.message || '(No message provided)',
        '',
        '---',
        'Sent via ATSense Web Portal (atsense.online)'
    ].filter(Boolean);

    const subject = encodeURIComponent(
        data.subject
            ? `[ATSense Inquiry] ${data.subject}`
            : `[ATSense Inquiry] Message from ${data.name || data.email}`
    );
    const body = encodeURIComponent(lines.join('\n'));

    return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
};

/**
 * Dispatch inquiry or newsletter subscription to the PHP email backend.
 * Tries the primary Laravel endpoint (/contact), then falls back to standalone (/api/contact.php).
 */
export const sendInquiry = async (payload: ContactPayload): Promise<ContactResponse> => {
    // 1. Primary Attempt: Standard configured Axios API instance
    try {
        const response = await api.post('/contact', {
            name: payload.name || '',
            email: payload.email,
            message: payload.message || '',
            subject: payload.subject || '',
            phone: payload.phone || '',
            type: payload.type || 'general',
            botcheck: payload.botcheck || '',
        });

        if (response.data?.success) {
            return {
                ok: true,
                message: response.data.message || 'Inquiry dispatched successfully.',
            };
        }
    } catch (err: any) {
        console.warn('Primary /api/contact route failed, attempting fallback to /api/contact.php...', err?.message);
    }

    // 2. Secondary Attempt: Direct standalone contact.php endpoint
    try {
        const fallbackRes = await fetch('/api/contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                name: payload.name || '',
                email: payload.email,
                message: payload.message || '',
                subject: payload.subject || '',
                phone: payload.phone || '',
                type: payload.type || 'general',
                botcheck: payload.botcheck || '',
            }),
        });

        const data = await fallbackRes.json().catch(() => ({}));

        if (fallbackRes.ok && data?.success) {
            return {
                ok: true,
                message: data.message || 'Inquiry dispatched successfully.',
            };
        }

        if (data?.message) {
            return {
                ok: false,
                message: data.message,
                mailto: buildFallbackMailto(payload),
            };
        }
    } catch (err: any) {
        console.warn('Direct /api/contact.php also unreachable:', err?.message);
    }

    // 3. Complete Fallback: Server offline or network disconnect
    return {
        ok: false,
        message: 'Could not reach the ATSense mail server. You can click below to send your inquiry directly via your email app.',
        mailto: buildFallbackMailto(payload),
    };
};
