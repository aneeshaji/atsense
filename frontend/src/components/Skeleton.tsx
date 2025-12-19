// Skeleton loading components for better perceived performance

export const SkeletonCard = () => (
    <div className="card animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="flex gap-3 pt-4 border-t border-gray-50">
            <div className="h-10 bg-gray-200 rounded flex-1"></div>
            <div className="h-10 bg-gray-200 rounded flex-1"></div>
            <div className="h-10 bg-gray-200 rounded w-10"></div>
        </div>
    </div>
);

export const SkeletonText = ({ className = '' }: { className?: string }) => (
    <div className={`h-4 bg-gray-200 rounded animate-pulse ${className}`}></div>
);

export const SkeletonButton = ({ className = '' }: { className?: string }) => (
    <div className={`h-10 bg-gray-200 rounded animate-pulse ${className}`}></div>
);

export const SkeletonAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    return (
        <div className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse`}></div>
    );
};

export const SkeletonGrid = ({ count = 3 }: { count?: number }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} />
        ))}
    </div>
);
