import React from 'react';

const ConcertShowcaseSkeleton = () => {
    return (
        <div className="bg-black text-white font-sans overflow-x-hidden min-h-screen flex flex-col">
            
            {/* BACKGROUND SKELETON */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-white/[0.02] to-black" />
            </div>

            {/* HERO SECTION SKELETON */}
            <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden border-b border-white/5">
                <div className="flex flex-col items-center gap-6 w-full max-w-4xl animate-pulse">
                    {/* Sparkle/Label */}
                    <div className="h-4 w-48 bg-white/10 rounded-full" />
                    
                    {/* Giant Title */}
                    <div className="space-y-4 w-full flex flex-col items-center">
                        <div className="h-[10vw] w-3/4 bg-white/5 rounded-2xl" />
                        <div className="h-[10vw] w-1/2 bg-white/5 rounded-2xl" />
                    </div>
                </div>
            </section>

            {/* ARTIST SECTION SKELETON (Repeated twice to simulate list) */}
            {[1, 2].map((i) => (
                <section key={i} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden border-b border-white/5 bg-black">
                    
                    {/* Content Grid */}
                    <div className="relative z-20 w-full max-w-7xl px-6 py-20 lg:py-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center lg:items-end h-full lg:pb-24 animate-pulse">
                        
                        {/* 1. TITLE SECTION (Middle on Desktop) */}
                        <div className="lg:col-span-5 lg:order-2 text-center lg:text-left order-1 w-full">
                            {/* Label */}
                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                                <div className="h-4 w-4 h-4 rounded-full bg-white/10" />
                                <div className="h-3 w-32 bg-white/10 rounded-full" />
                            </div>

                            {/* Big Artist Name */}
                            <div className="space-y-4 mb-8">
                                <div className="h-20 lg:h-32 w-3/4 mx-auto lg:mx-0 bg-white/5 rounded-3xl" />
                                <div className="h-20 lg:h-32 w-1/2 mx-auto lg:mx-0 bg-white/5 rounded-3xl" />
                            </div>

                            {/* Mobile Image Placeholder (Hidden Desktop) */}
                            <div className="block lg:hidden w-full aspect-[4/5] rounded-[2rem] bg-white/5 mb-8" />
                        </div>

                        {/* 2. META INFO (Left on Desktop) */}
                        <div className="lg:col-span-4 lg:order-1 order-2 flex flex-col gap-6 lg:gap-8 items-center lg:items-start w-full">
                            <div className="flex items-center gap-4">
                                {/* Number Badge */}
                                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10" />
                                
                                {/* Date Lines */}
                                <div className="space-y-2">
                                    <div className="h-3 w-24 bg-white/10 rounded-full" />
                                    <div className="h-3 w-32 bg-white/10 rounded-full" />
                                </div>
                            </div>

                            {/* Description Box */}
                            <div className="w-full lg:w-64 h-32 p-6 border-l-2 border-white/10 bg-white/[0.02] rounded-r-2xl">
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-white/10 rounded-full" />
                                    <div className="h-2 w-5/6 bg-white/10 rounded-full" />
                                    <div className="h-2 w-4/6 bg-white/10 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* 3. PRICING CARD (Right on Desktop) */}
                        <div className="lg:col-span-3 lg:order-3 order-3 w-full">
                            <div className="bg-white/5 border border-white/10 p-6 lg:p-8 rounded-[2rem] h-64 flex flex-col justify-between">
                                {/* Top Label */}
                                <div className="flex justify-between">
                                    <div className="h-3 w-20 bg-white/10 rounded-full" />
                                    <div className="h-3 w-3 bg-white/10 rounded-full" />
                                </div>

                                {/* Price */}
                                <div className="h-12 w-32 bg-white/10 rounded-xl" />

                                {/* Button */}
                                <div className="h-14 w-full bg-white/10 rounded-2xl" />
                            </div>
                        </div>

                    </div>
                </section>
            ))}
        </div>
    );
};

export default ConcertShowcaseSkeleton;