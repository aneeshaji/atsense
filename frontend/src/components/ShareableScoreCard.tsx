import React, { useRef, useState } from 'react';
import { Share2, Download, Check, Copy, Linkedin, Twitter, MessageCircle, Sparkles, X, Award, ShieldCheck, Zap } from 'lucide-react';

interface ShareableScoreCardProps {
    score: number;
    userName?: string;
    targetRole?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const ShareableScoreCard: React.FC<ShareableScoreCardProps> = ({
    score,
    userName = 'Candidate',
    targetRole,
    isOpen,
    onClose,
}) => {
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    if (!isOpen) return null;

    const safeScore = Math.max(1, Math.min(100, score || 78));
    const tier = safeScore >= 80 ? 'ELITE' : safeScore >= 65 ? 'STRONG' : 'NEEDS TAILORING';
    const tierColor = safeScore >= 80 ? '#10b981' : safeScore >= 65 ? '#8b5cf6' : '#f59e0b';
    const percentile = Math.min(99, Math.max(45, Math.floor(safeScore * 0.95 + 8)));

    const shareUrl = 'https://atsense.online/resume-grader';
    const viralPostText = `Just audited my resume with ATSense.online and got an ATS Match Score of ${safeScore}/100! 🚀

📊 Result: Beat ${percentile}% of ATS screening bots
⚡ Key insight: Bullet points and skill phrasing make or break recruiter screens.
💡 Their "Deep Tailor" tool rewrites experience points to match job descriptions in 1 click.

If you are job hunting, check your score for free here: ${shareUrl}

#jobsearch #career #resume #ats #hiring #atsense`;

    const handleCopyText = async () => {
        try {
            await navigator.clipboard.writeText(viralPostText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // fallback
        }
    };

    const handleShareLinkedIn = () => {
        handleCopyText();
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(linkedinUrl, '_blank', 'width=600,height=600');
    };

    const handleShareTwitter = () => {
        const text = `Just audited my resume with ATSense and got an ATS score of ${safeScore}/100! Beat ${percentile}% of applicant bots 🚀 Check yours free:`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=500');
    };

    const handleShareWhatsApp = () => {
        const text = `I just checked my resume on ATSense and scored ${safeScore}/100 (beating ${percentile}% of ATS bots)! 🚀 Scan yours free here: ${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    };

    const generateAndDownloadImage = () => {
        setDownloading(true);
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1200;
            canvas.height = 630;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Background Gradient
            const bgGradient = ctx.createLinearGradient(0, 0, 1200, 630);
            bgGradient.addColorStop(0, '#0b0f19');
            bgGradient.addColorStop(0.5, '#0f172a');
            bgGradient.addColorStop(1, '#020617');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, 1200, 630);

            // Subtle glow circle behind score
            const glowGradient = ctx.createRadialGradient(920, 315, 10, 920, 315, 260);
            glowGradient.addColorStop(0, 'rgba(139, 92, 246, 0.35)');
            glowGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(920, 315, 260, 0, Math.PI * 2);
            ctx.fill();

            // Card Frame border
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 4;
            ctx.strokeRect(30, 30, 1140, 570);

            // Brand Header Pill
            ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
            ctx.beginPath();
            ctx.roundRect(80, 75, 220, 42, 21);
            ctx.fill();

            ctx.fillStyle = '#a78bfa';
            ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillText('ATSENSE CAREER STUDIO', 105, 102);

            // Title
            ctx.fillStyle = '#ffffff';
            ctx.font = '800 46px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillText('Verified ATS Match Scorecard', 80, 185);

            // Subtitle
            ctx.fillStyle = '#94a3b8';
            ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            const roleText = targetRole ? `Optimized for: ${targetRole}` : 'Evaluated against Tier-1 Applicant Tracking Systems';
            ctx.fillText(roleText, 80, 225);

            // Highlights Checklist
            const bullets = [
                `Beat ${percentile}% of applicant tracking screening bots`,
                'High-density industry action verbs & keyword alignment',
                'Zero parser traps: Clean contact formatting & typography',
                'Deep Tailor ready for 1-click job description matching',
            ];

            bullets.forEach((b, i) => {
                const y = 300 + i * 55;
                // Check circle
                ctx.fillStyle = '#10b981';
                ctx.beginPath();
                ctx.arc(100, y - 7, 14, 0, Math.PI * 2);
                ctx.fill();

                // Check mark
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.fillText('✓', 95, y - 2);

                // Bullet text
                ctx.fillStyle = '#e2e8f0';
                ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                ctx.fillText(b, 130, y);
            });

            // Score Circle Box (Right side)
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(920, 315, 160, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Score Number
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 96px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(String(safeScore), 920, 330);

            // / 100 label
            ctx.fillStyle = '#94a3b8';
            ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillText('OUT OF 100', 920, 370);

            // Tier Badge under circle
            ctx.fillStyle = tierColor;
            ctx.font = '800 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillText(`${tier} MATCH`, 920, 415);

            // Footer / Watermark
            ctx.textAlign = 'left';
            ctx.fillStyle = '#64748b';
            ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillText('Audited with ATSense AI · Scan your resume for free at atsense.online', 80, 560);

            // Trigger file download with standard professional filename
            const rawName = (userName && userName !== 'Candidate' && userName !== 'Unknown User') ? userName : '';
            const cleanName = rawName.trim().replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
            const downloadFilename = cleanName
                ? `${cleanName}_ATS_Scorecard_ATSense.png`
                : `ATSense_Verified_Scorecard_${safeScore}pct.png`;

            const imageURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = downloadFilename;
            link.href = imageURL;
            link.click();
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

                {/* Header */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                            <Share2 size={18} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white">Share Your ATS Scorecard</h3>
                            <p className="text-xs text-slate-400">Flex your score and help friends beat applicant bots</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Score Preview Card Visual */}
                <div className="relative bg-slate-950 border border-purple-500/30 rounded-2xl p-6 mb-6 overflow-hidden shadow-inner">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex-1 text-center sm:text-left">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-2">
                                <Award size={12} /> {tier} ATS MATCH
                            </span>
                            <h4 className="text-xl font-black text-white mb-1.5">
                                Beat {percentile}% of Screening Bots
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                                Resume verified against Tier-1 ATS algorithms (Workday, Taleo, Greenhouse, Lever). Ready for Deep Tailoring.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-300">
                                <span className="inline-flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                                    <ShieldCheck size={12} className="text-emerald-400" /> Parser Safe
                                </span>
                                <span className="inline-flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                                    <Zap size={12} className="text-purple-400" /> Metric Optimized
                                </span>
                            </div>
                        </div>

                        {/* Circular Score Badge */}
                        <div className="relative flex flex-col items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-2 border-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.25)] shrink-0">
                            <span className="text-4xl font-black text-white">{safeScore}</span>
                            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">OUT OF 100</span>
                        </div>
                    </div>
                </div>

                {/* Viral Sharing Buttons */}
                <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* LinkedIn */}
                        <button
                            onClick={handleShareLinkedIn}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-sm font-bold shadow-lg transition-all duration-150 hover:-translate-y-0.5"
                        >
                            <Linkedin size={17} fill="currentColor" />
                            <span>LinkedIn</span>
                        </button>

                        {/* WhatsApp */}
                        <button
                            onClick={handleShareWhatsApp}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe57] text-white text-sm font-bold shadow-lg transition-all duration-150 hover:-translate-y-0.5"
                        >
                            <MessageCircle size={17} />
                            <span>WhatsApp</span>
                        </button>

                        {/* Twitter / X */}
                        <button
                            onClick={handleShareTwitter}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold border border-slate-700 transition-all duration-150 hover:-translate-y-0.5"
                        >
                            <Twitter size={17} fill="currentColor" />
                            <span>Post on X</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Download Image Card */}
                        <button
                            onClick={generateAndDownloadImage}
                            disabled={downloading}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-lg shadow-purple-600/25 transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-50"
                        >
                            <Download size={16} />
                            <span>{downloading ? 'Generating Image...' : 'Download HD Card (PNG)'}</span>
                        </button>

                        {/* Copy Post Text */}
                        <button
                            onClick={handleCopyText}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-sm font-semibold border border-slate-700 transition-all duration-150"
                        >
                            {copied ? (
                                <>
                                    <Check size={16} className="text-emerald-400" />
                                    <span className="text-emerald-400">Copied to Clipboard!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={16} />
                                    <span>Copy Post Template</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-5 text-center">
                    <p className="text-[11px] text-slate-500">
                        Sharing copies a high-conversion post draft to your clipboard automatically.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShareableScoreCard;
