// src/components/concert/ArtistShowcase.jsx
import React from 'react';
import { motion } from "framer-motion";
import { Mic2, Camera, Calendar, MapPin } from "lucide-react";

const ArtistShowcase = ({ concert }) => {
  // 1. Safe Data Access to prevent crash
  if (!concert) return null;
  
  const name = concert.artistName || "Unknown Artist";
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(1).join(' ');
  const displayDate = concert.date ? new Date(concert.date).toDateString() : "TBA";

  // 2. Fallback Image if API image is broken/missing
  const fallbackImage = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2670&auto=format&fit=crop"; 

  return (
    <div className="lg:col-span-7 flex flex-col justify-center h-full pt-10">
        
        {/* FLOATING FOCAL IMAGE */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full md:w-[85%] aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 bg-[#1a1a1a]"
        >
            <img 
                src={concert.imageUrl || fallbackImage} 
                onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }} // Handle 404
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
                alt={name} 
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            
            {/* Content Over Image */}
            <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-3 mb-4">
                    <Mic2 size={16} className="text-pink-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Headlining Act</span>
                </div>
                
                {/* Fixed Text Sizing to prevent overlap */}
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] text-white mb-6 break-words">
                    {firstName} <br />
                    <span className="text-outline text-transparent">{lastName}</span>
                </h2>

                <div className="flex flex-wrap gap-4 md:gap-6">
                    <div className="flex items-center gap-2 text-white/80">
                        <Calendar size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{displayDate}</span>
                    </div>
                     <div className="flex items-center gap-2 text-white/80">
                        <MapPin size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Main Arena</span>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Decorative Element Behind */}
        <div className="hidden md:block absolute top-[20%] left-[-5%] w-[500px] h-[500px] bg-pink-500/10 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
};

export default ArtistShowcase;