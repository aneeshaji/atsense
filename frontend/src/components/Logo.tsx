export default function Logo({ className = "w-11 h-11" }: { className?: string }) {
    return (
        <div 
            className={`relative flex items-center justify-center ${className} group shrink-0`}
            role="img"
            aria-label="ATSense Logo"
        >
            {/* Glowing Aura shadow (pulsing) */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-700 animate-pulse"></div>
            
            {/* Main Icon Box */}
            <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-indigo-950 to-slate-900 rounded-xl border border-indigo-400/30 flex items-center justify-center overflow-hidden shadow-[0_8px_16px_rgb(0_0_0/0.2)]">
                
                {/* Diagonal Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent h-[150%] w-[150%] -rotate-45 -translate-y-1/2 -translate-x-1/2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-1000 ease-out"></div>
                
                {/* Document & AI Sparkle SVG */}
                <svg viewBox="0 0 24 24" className="w-[60%] h-[60%] z-10 transform group-hover:scale-110 transition-transform duration-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Back document outline */}
                    <path d="M8 4V3C8 2.44772 8.44772 2 9 2H16.5L21 6.5V16C21 16.5523 20.5523 17 20 17H19" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"/>
                    
                    {/* Front document filled */}
                    <path d="M4 8C4 7.44772 4.44772 7 5 7H12.5L17 11.5V20C17 20.5523 16.5523 21 16 21H5C4.44772 21 4 20.5523 4 20V8Z" fill="url(#frontGrad)" stroke="#E0E7FF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    
                    {/* Skeleton Text Lines inside front document */}
                    <path d="M7 12H11" stroke="#E0E7FF" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M7 16H14" stroke="#E0E7FF" strokeWidth="1.5" strokeLinecap="round"/>
                    
                    {/* Primary AI Sparkle */}
                    <path d="M19 5L19.5 6.5L21 7L19.5 7.5L19 9L18.5 7.5L17 7L18.5 6.5L19 5Z" fill="#38BDF8" className="animate-[pulse_2s_ease-in-out_infinite]"/>
                    
                    {/* Secondary AI Sparkle */}
                    <path d="M14 2.5L14.5 3.5L15.5 4L14.5 4.5L14 5.5L13.5 4.5L12.5 4L13.5 3.5L14 2.5Z" fill="#F472B6" className="animate-[pulse_2s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}/>

                    <defs>
                        <linearGradient id="frontGrad" x1="4" y1="7" x2="17" y2="21" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#4F46E5" stopOpacity="0.85"/>
                            <stop offset="1" stopColor="#9333EA" stopOpacity="0.95"/>
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}
