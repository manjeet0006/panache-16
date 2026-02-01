import React from 'react';
import { Loader2 } from 'lucide-react';

const ConcertSkeleton = () => {
    return (
        <div className="min-h-screen pt-22 bg-[#020202] text-white font-sans overflow-hidden relative flex flex-col">
            
            {/* --- GLOBAL BACKGROUND (Static) --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
            </div>

            {/* --- HEADER SKELETON --- */}
            <header className="relative z-[50] pt-8 px-8 flex items-center gap-6 max-w-7xl mx-auto w-full">
                {/* Back Button */}
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 animate-pulse" />
                
                {/* Title Text */}
                <div className="space-y-2">
                    <div className="h-2 w-20 bg-white/10 rounded-full animate-pulse" />
                    <div className="h-6 w-48 bg-white/10 rounded-lg animate-pulse" />
                </div>
            </header>

            {/* --- MAIN CONTENT SKELETON --- */}
            <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* 1. LEFT: ARTIST IMAGE SKELETON */}
                <div className="w-full h-[500px] lg:h-[700px] relative rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] shadow-2xl animate-pulse">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-white/20 animate-spin" />
                    </div>
                    
                    {/* Bottom Text Overlay Skeleton */}
                    <div className="absolute bottom-0 left-0 p-10 w-full space-y-4">
                        <div className="h-6 w-32 bg-white/10 rounded-full" />
                        <div className="h-16 w-3/4 bg-white/10 rounded-2xl" />
                    </div>
                </div>

                {/* 2. RIGHT: FORM SKELETON */}
                <div className="w-full bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl h-full min-h-[600px] flex flex-col">
                    
                    {/* Form Header */}
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                        <div className="h-3 w-24 bg-white/10 rounded-full animate-pulse" />
                        <div className="h-3 w-16 bg-pink-500/10 rounded-full animate-pulse" />
                    </div>

                    {/* Inputs Skeleton */}
                    <div className="space-y-3 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 w-full bg-white/5 rounded-xl border border-white/5 animate-pulse" />
                        ))}
                    </div>

                    {/* Tier Selection Skeleton */}
                    <div className="mb-8 flex-1">
                        <div className="h-2 w-32 bg-white/10 rounded-full mb-4 animate-pulse" />
                        <div className="flex flex-col gap-3">
                            {/* 3 Tier Cards */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 w-full bg-white/5 rounded-xl border border-white/5 animate-pulse flex items-center justify-between px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-white/10" />
                                        <div className="h-3 w-20 bg-white/10 rounded-full" />
                                    </div>
                                    <div className="h-4 w-12 bg-white/10 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="mt-auto pt-4 border-t border-white/5">
                        <div className="h-14 w-full bg-white/10 rounded-xl animate-pulse" />
                        <div className="h-3 w-40 bg-white/5 rounded-full mx-auto mt-4" />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ConcertSkeleton;