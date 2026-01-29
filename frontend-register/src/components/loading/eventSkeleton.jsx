import React from 'react';

const EventSkeleton = () => {
    return (
        <div className="min-h-screen bg-[#050505] pt-13 pb-5 relative overflow-hidden">

            {/* 1. Background Atmosphere (Matches main page) */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/5 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/5 blur-[120px] rounded-full animate-pulse delay-700"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* 2. Header Skeleton */}
                <div className="mb-10 pt-16 text-center flex flex-col items-center">
                    {/* Tag Pill */}
                    <div className="h-8 w-48 bg-white/5 rounded-full mb-8 animate-pulse border border-white/5"></div>

                    {/* Title Text */}
                    <div className="flex flex-col items-center gap-2 mb-8">
                        <div className="h-16 w-64 bg-white/10 rounded-2xl animate-pulse"></div>
                        <div className="h-16 w-80 bg-white/5 rounded-2xl animate-pulse delay-100"></div>
                    </div>

                    {/* Search Bar Skeleton */}
                    <div className="w-full max-w-xl h-16 bg-white/5 rounded-3xl mb-6 animate-pulse delay-200 border border-white/5"></div>
                </div>

                {/* 3. Event Cards Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="relative bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between h-[500px] overflow-hidden"
                        >
                            {/* Shimmer Effect Overlay */}
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent z-20"></div>

                            <div className="relative z-10">
                                {/* Card Header (Category + Date) */}
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex flex-col gap-3">
                                        <div className="h-6 w-20 bg-white/10 rounded-md animate-pulse"></div>
                                        <div className="h-4 w-24 bg-white/5 rounded-md animate-pulse delay-75"></div>
                                    </div>
                                    <div className="h-6 w-16 bg-white/5 rounded-md animate-pulse"></div>
                                </div>

                                {/* Event Title */}
                                <div className="h-10 w-3/4 bg-white/10 rounded-xl mb-4 animate-pulse delay-100"></div>

                                {/* Description Lines */}
                                <div className="space-y-3 mb-6">
                                    <div className="h-3 w-full bg-white/5 rounded animate-pulse delay-150"></div>
                                    <div className="h-3 w-5/6 bg-white/5 rounded animate-pulse delay-200"></div>
                                    <div className="h-3 w-4/6 bg-white/5 rounded animate-pulse delay-300"></div>
                                </div>
                            </div>

                            {/* Bottom Section (Stats + Button) */}
                            <div className="pt-6 border-t border-white/5 flex flex-col gap-6 mt-auto relative z-10">
                                <div className="flex justify-between px-2">
                                    <div className="h-3 w-16 bg-white/5 rounded animate-pulse"></div>
                                    <div className="h-3 w-16 bg-white/5 rounded animate-pulse"></div>
                                    <div className="h-3 w-16 bg-white/5 rounded animate-pulse"></div>
                                </div>
                                <div className="h-14 w-full bg-white/10 rounded-xl animate-pulse delay-500"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inline CSS for the Shimmer Animation */}
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default EventSkeleton;