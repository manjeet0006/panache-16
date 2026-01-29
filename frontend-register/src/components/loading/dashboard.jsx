import React from 'react';

const DashboardSkeleton = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-15 md:pt-5 p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row gap-8">
            
            {/* 1. Background Atmosphere (Consistent with app theme) */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/5 blur-[120px] rounded-full animate-pulse"></div>
            </div>

            {/* 2. Sidebar Skeleton (Hidden on mobile, visible on desktop) */}
            <div className="hidden md:flex flex-col gap-6 w-64 h-[90vh] bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 shrink-0 relative z-10 overflow-hidden">
                {/* Shimmer Overlay */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent z-20"></div>
                
                {/* Logo Area */}
                <div className="h-10 w-32 bg-white/10 rounded-xl animate-pulse mb-8"></div>
                
                {/* Nav Items */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-white/5 rounded-lg animate-pulse"></div>
                        <div className="h-4 w-24 bg-white/5 rounded animate-pulse delay-100"></div>
                    </div>
                ))}

                {/* Bottom Profile */}
                <div className="mt-auto flex items-center gap-3 pt-6 border-t border-white/5">
                    <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
                    <div className="flex flex-col gap-2">
                        <div className="h-3 w-20 bg-white/5 rounded animate-pulse"></div>
                        <div className="h-2 w-12 bg-white/5 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* 3. Main Content Skeleton */}
            <div className="flex-1 flex flex-col gap-8 relative z-10">
                
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div className="space-y-3">
                        <div className="h-4 w-32 bg-pink-500/20 rounded-full animate-pulse"></div>
                        <div className="h-10 w-64 md:w-96 bg-white/10 rounded-2xl animate-pulse delay-75"></div>
                    </div>
                    {/* Action Button */}
                    <div className="h-12 w-12 md:w-32 bg-white/10 rounded-xl animate-pulse"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-40 bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent z-20" style={{ animationDelay: `${i * 0.2}s` }}></div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse"></div>
                                <div className="h-4 w-16 bg-white/5 rounded animate-pulse"></div>
                            </div>
                            <div className="h-8 w-24 bg-white/10 rounded mb-2 animate-pulse"></div>
                            <div className="h-3 w-32 bg-white/5 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>

                {/* Table / List Section */}
                <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden min-h-[400px]">
                     <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent z-20"></div>
                    
                    {/* Table Header */}
                    <div className="flex justify-between mb-8 pb-4 border-b border-white/5">
                        <div className="h-6 w-32 bg-white/10 rounded animate-pulse"></div>
                        <div className="h-6 w-24 bg-white/5 rounded animate-pulse"></div>
                    </div>

                    {/* List Items */}
                    <div className="space-y-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl animate-pulse"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-40 bg-white/10 rounded animate-pulse"></div>
                                        <div className="h-3 w-24 bg-white/5 rounded animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="h-8 w-24 bg-white/5 rounded-full animate-pulse hidden md:block"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Inline Styles */}
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default DashboardSkeleton;