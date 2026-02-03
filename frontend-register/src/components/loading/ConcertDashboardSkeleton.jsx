import React from 'react';

const ConcertTicketSkeleton = () => {
    return (
        <div className="min-h-screen bg-gradient-to-tr from-[#0a0a0a] to-[#1a1a1a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            
            {/* --- Background FX (Static) --- */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] z-0"></div>
            <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full"></div>

            {/* --- Ticket Card Skeleton --- */}
            <div className="relative z-10 w-full max-w-md bg-white/[0.03] border border-white/10 rounded-[3rem] backdrop-blur-xl shadow-2xl overflow-hidden animate-pulse">
                <div className="p-8 md:p-10">
                    
                    {/* Header Section */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-3 w-full">
                            {/* Title Skeleton */}
                            <div className="h-8 bg-white/10 rounded-lg w-3/4"></div>
                            {/* Subtitle Skeleton */}
                            <div className="h-3 bg-blue-500/20 rounded-full w-1/3"></div>
                        </div>
                        {/* Icon Box Skeleton */}
                        <div className="h-12 w-12 bg-white/10 rounded-2xl flex-shrink-0"></div>
                    </div>

                    {/* Divider */}
                    <div className="my-10 h-px bg-white/10"></div>

                    {/* Details List (4 Rows) */}
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                {/* Icon Circle */}
                                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-white/10"></div>
                                {/* Text Lines */}
                                <div className="space-y-2 w-full">
                                    <div className="h-2 bg-white/10 rounded w-16"></div>
                                    <div className="h-4 bg-white/10 rounded w-48"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Section */}
                <div className="bg-black/20 px-10 py-6 border-t border-white/5 flex justify-center">
                    <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </div>
            </div>
        </div>
    );
};

export default ConcertTicketSkeleton;