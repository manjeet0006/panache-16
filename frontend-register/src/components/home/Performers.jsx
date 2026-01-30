"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic2, MapPin, Sparkles, Lock, Ticket, ArrowRight, Star, Ban, ShieldAlert } from "lucide-react";
import confetti from "canvas-confetti";
import ActiveScrollReveal from "../common/ActiveScrollReveal";
import ModernButton from "../common/ModernButton";

// --- DATA ---
const ARTISTS = [

    {
        id: "past-2",
        name: "Darshan Raval",
        year: "2024",
        role: "Star Night",
        image: "https://res.cloudinary.com/duqxp1ejg/image/upload/v1769809063/Darshan_Raval_darshanraval_trending_viral_yefbzh.jpg",
        color: "from-blue-500 to-cyan-500",
        isPast: true,
        isRevealable: true,
    },
    {
        id: "past-1",
        name: "Raftaar",
        year: "2025",
        role: "Headliner",
        image: "https://res.cloudinary.com/duqxp1ejg/image/upload/v1769809148/Double_R_nove6r.jpg",
        color: "from-purple-500 to-indigo-500",
        isPast: true,
        isRevealable: true,
    },

    {
        id: "future-1",
        name: "Grand Opening",
        year: "2026",
        role: "Day 1",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop",
        isLocked: true,
        isRevealable: true, // ✅ Clickable (Moderate blur when closed)
        color: "from-yellow-400 to-orange-500",
    },
    {
        id: "future-2",
        name: "Mystery Reveal",
        year: "2026",
        role: "Top Secret",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1000&auto=format&fit=crop",
        isLocked: true,
        isRevealable: false, // ❌ STRICTLY LOCKED (Heavy blur)
        color: "from-gray-500 to-slate-500",
    },
];

// --- SUB-COMPONENT: Floating Particles ---
const FloatingParticles = () => {
    const particles = Array.from({ length: 20 });
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", opacity: 0, scale: 0 }}
                    animate={{ y: [null, Math.random() * -100 + "%"], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                    transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full blur-[1px]"
                />
            ))}
        </div>
    );
};

// --- SUB-COMPONENT: Artist Panel ---
const ArtistPanel = ({ artist, isActive, onClick, onTicketClick }) => {

    const handleClick = () => {
        onClick();

        // Only trigger Confetti if it IS revealable and locked
        if (artist.isRevealable && artist.isLocked && !isActive) {
            const end = Date.now() + 1000;
            const colors = ['#fbbf24', '#f59e0b', '#ffffff'];
            (function frame() {
                confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
                confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
        }
    };

    // --- BLUR CALCULATION ---
    // Determine how much blur to apply based on state
    let blurClass = "blur-0";
    if (isActive) {
        // If active but NOT revealable, keep it blurry
        if (artist.isLocked && !artist.isRevealable) blurClass = "blur-xl scale-105";
    } else {
        // If inactive AND locked
        if (artist.isLocked) {
            // If strictly locked (not revealable) -> Heavy blur
            if (!artist.isRevealable) blurClass = "blur-2xl grayscale-[30%]";
            // If locked but revealable -> Medium blur
            else blurClass = "blur-md";
        }
    }

    return (
        <motion.div
            layout
            onClick={handleClick}
            initial={false}
            animate={{
                flex: isActive ? 3 : 1,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`relative overflow-hidden rounded-3xl cursor-pointer group border border-white/10 
        min-h-[80px] md:min-h-0 md:min-w-[100px]
        ${isActive ? "grayscale-0" : "grayscale hover:grayscale-0"}
        ${isActive && artist.isLocked && artist.isRevealable ? "ring-2 ring-yellow-500/50" : ""} 
      `}
        >
            {/* Background Image with Dynamic Blur */}
            <motion.img
                layoutId={`img-${artist.id}`}
                src={artist.image}
                alt={artist.name}
                // Changed transition-transform to transition-all for smooth blur animation
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 
          ${isActive ? "scale-110" : "scale-100"}
          ${blurClass} 
        `}
            />

            {/* Aura only if revealable */}
            {artist.isLocked && isActive && artist.isRevealable && <FloatingParticles />}

            {/* Overlays - Darker overlay for strictly locked items */}
            <div className={`absolute inset-0 transition-all duration-500
        ${artist.isLocked && !artist.isRevealable ? "bg-black/80" : "bg-black/40"} 
        ${isActive ? "opacity-0" : "opacity-100"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

            {/* Locked State Overlay Icon (Only visible when NOT active) */}
            {artist.isLocked && (
                <div className={`absolute inset-0 backdrop-blur-[2px] bg-black/30 flex items-center justify-center transition-all duration-500 ${isActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                    <div className={`mb-12 md:mb-0 p-3 md:p-4 rounded-full border ${artist.isRevealable ? "bg-white/10 border-white/20 animate-pulse" : "bg-white/5 border-white/10"}`}>
                        <Lock className="text-white/70" size={24} />
                    </div>
                </div>
            )}

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">

                {/* --- COLLAPSED TEXT (Shows when NOT active) --- */}
                {!isActive && (
                    <div className="absolute bottom-6 left-6 md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:rotate-[-90deg] whitespace-nowrap md:origin-left z-20">
                        {artist.isRevealable ? (
                            <h3 className="text-xl md:text-2xl font-bold text-white/70 uppercase tracking-widest">
                                {artist.year}
                            </h3>
                        ) : (
                            <div className="flex flex-col items-start md:items-center gap-1">
                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
                                    Panache {artist.year}
                                </span>
                                <h3 className="text-xl md:text-2xl font-black text-white/80 uppercase italic tracking-widest flex items-center gap-2">
                                    {artist.name} <Ban size={16} className="text-white/30" />
                                </h3>
                            </div>
                        )}
                    </div>
                )}

                {/* --- EXPANDED CONTENT --- */}
                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                            className="flex flex-col items-start"
                        >
                            {/* LOGIC: Check if Revealable */}
                            {artist.isRevealable ? (
                                // --- CASE A: REVEALABLE CARD (Shows Details) ---
                                <>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${artist.color} mb-3 md:mb-4 shadow-[0_0_15px_rgba(251,191,36,0.4)]`}>
                                        {artist.isLocked ? <Star size={12} className="text-white animate-[spin_3s_linear_infinite]" /> : <Mic2 size={12} className="text-white" />}
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                            {artist.role}
                                        </span>
                                    </div>

                                    <h2 className="text-3xl md:text-6xl font-black uppercase italic text-white leading-none mb-2 drop-shadow-lg">
                                        {artist.name}
                                    </h2>

                                    <div className="flex items-center gap-4 text-gray-300 mb-6">
                                        <div className="flex items-center gap-1 text-[10px] md:text-sm font-medium uppercase tracking-wider">
                                            <span className="w-2 h-2 rounded-full bg-white/50" />
                                            Panache {artist.year}
                                        </div>
                                        {!artist.isLocked && (
                                            <div className="flex items-center gap-1 text-[10px] md:text-sm font-medium uppercase tracking-wider">
                                                <MapPin size={12} />
                                                Main Arena
                                            </div>
                                        )}
                                    </div>

                                    {!artist.isPast ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onTicketClick();
                                            }}
                                            className="group flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs md:text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all"
                                        >
                                            <Ticket size={16} className="text-black" />
                                            {artist.isLocked ? "Join Waitlist" : "Grab Tickets"}
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </motion.button>
                                    ) : (
                                        <button className="text-white/50 text-xs font-bold uppercase tracking-widest border-b border-white/20 pb-1 hover:text-white hover:border-white transition-all">
                                            View Gallery
                                        </button>
                                    )}
                                </>
                            ) : (
                                // --- CASE B: NON-REVEALABLE (Shows "LOCKED" Message) ---
                                <div className="w-full flex flex-col items-center justify-center py-10 opacity-60">
                                    <ShieldAlert size={48} className="text-white/30 mb-4" />
                                    <h2 className="text-3xl md:text-5xl font-black uppercase italic text-white/40 leading-none mb-2">
                                        Classified
                                    </h2>
                                    <p className="text-white/30 text-xs md:text-sm font-bold uppercase tracking-widest text-center">
                                        This announcement is locked until further notice.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.div>
    );
};

const Performers = () => {
    const [activeId, setActiveId] = useState("past-1");
    const navigate = useNavigate();

    const handleTicketClick = () => {
        navigate("/");
    };

    return (
        <section className="relative py-16 md:py-24 px-4 max-w-7xl mx-auto">
            <ActiveScrollReveal>
                <div className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-end">
                    <div>
                        <div className="inline-block mb-3">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10">
                                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">
                                    Hall of Fame
                                </span>
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
                            Legends at <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">VGU</span>
                        </h2>
                    </div>

                    <div className="hidden md:block mb-2">
                        <ModernButton onClick={() => navigate("/")}>
                            View Ticket
                        </ModernButton>
                    </div>
                </div>
            </ActiveScrollReveal>

            <ActiveScrollReveal direction="up" delay={0.2}>
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 h-[600px]">
                    {ARTISTS.map((artist) => (
                        <ArtistPanel
                            key={artist.id}
                            artist={artist}
                            isActive={activeId === artist.id}
                            onClick={() => setActiveId(artist.id)}
                            onTicketClick={handleTicketClick}
                        />
                    ))}
                </div>
            </ActiveScrollReveal>
        </section>
    );
};

export default Performers;