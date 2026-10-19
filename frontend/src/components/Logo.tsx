export default function Logo({ 
    className = "w-9 h-9", 
    animate = true 
}: { 
    className?: string; 
    animate?: boolean; 
}) {
    return (
        <svg
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${className} group-hover:scale-105 transition-all duration-300 drop-shadow-[0_2px_10px_rgba(99,102,241,0.25)]`}
            role="img"
            aria-label="ATSense Logo"
        >
            <defs>
                {/* Left wing gradient: Electric Cyan to Deep Indigo */}
                <linearGradient id="ats-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="45%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#312e81" />
                </linearGradient>

                {/* Right wing gradient: Ultraviolet to Fuchsia to Indigo */}
                <linearGradient id="ats-grad-right" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="50%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#4338ca" />
                </linearGradient>

                {/* Scanning laser beam gradient */}
                <linearGradient id="ats-grad-beam" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>

                {/* Specular ridge gradient */}
                <linearGradient id="ats-specular" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>

                {/* Ambient glow */}
                <radialGradient id="ats-ambient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </radialGradient>

                {/* Optical glow filter */}
                <filter id="ats-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.8" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Ambient Backlight Glow */}
            <circle cx="22" cy="22" r="18" fill="url(#ats-ambient)" />

            {/* Left Facet Ribbon (Ascending Pillar) */}
            <path
                d="M 22 4 L 5.5 36.5 C 5 37.4 5.7 38.5 6.8 38.5 H 14.2 C 15.1 38.5 15.9 38 16.3 37.2 L 22 23 L 22 4 Z"
                fill="url(#ats-grad-left)"
            />

            {/* Right Facet Ribbon (Descending Pillar) */}
            <path
                d="M 22 4 L 38.5 36.5 C 39 37.4 38.3 38.5 37.2 38.5 H 29.8 C 28.9 38.5 28.1 38 27.7 37.2 L 22 23 L 22 4 Z"
                fill="url(#ats-grad-right)"
            />

            {/* Central Spine Specular Highlight */}
            <line
                x1="22"
                y1="4"
                x2="22"
                y2="23"
                stroke="url(#ats-specular)"
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.75"
            />

            {/* Left Leading Edge Highlight */}
            <path
                d="M 22 4 L 5.5 36.5"
                stroke="url(#ats-specular)"
                strokeWidth="0.75"
                strokeLinecap="round"
                opacity="0.6"
            />

            {/* Holographic Scanning Bridge (The ATS Filter Bypass Beam) */}
            <path
                d="M 12 26.5 H 32 L 29.5 31.5 H 14.5 L 12 26.5 Z"
                fill="url(#ats-grad-beam)"
                filter="url(#ats-glow)"
                opacity="0.95"
            >
                {animate && (
                    <animate
                        attributeName="opacity"
                        values="0.8;1;0.8"
                        dur="2.5s"
                        repeatCount="indefinite"
                    />
                )}
            </path>

            {/* AI Radar Reticle / Scanning Lens */}
            <circle
                cx="22"
                cy="29"
                r="4.8"
                stroke="#38bdf8"
                strokeWidth="0.8"
                strokeDasharray="2 1.5"
                opacity="0.85"
            >
                {animate && (
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 22 29"
                        to="360 22 29"
                        dur="8s"
                        repeatCount="indefinite"
                    />
                )}
            </circle>

            {/* Central Optical Core (Light Pulse) */}
            <circle
                cx="22"
                cy="29"
                r="2.4"
                fill="#ffffff"
                filter="url(#ats-glow)"
            >
                {animate && (
                    <animate
                        attributeName="r"
                        values="2.2;2.8;2.2"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                )}
            </circle>

            {/* Apex Signal Node */}
            <circle
                cx="22"
                cy="4"
                r="1.6"
                fill="#38bdf8"
                filter="url(#ats-glow)"
            />
        </svg>
    );
}
