"use client";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Target, Eye, Zap, Globe, ArrowUpRight, Sparkles } from "lucide-react";
import ActiveScrollReveal from "@/components/common/ActiveScrollReveal";


// --- DATA ---
const CARDS = [
  {
    id: 1,
    title: "The Mission",
    icon: Target,
    text: "To curate an immersive ecosystem where art, technology, and culture converge. We aim to transcend the boundaries of a traditional college fest by fostering innovation and creative rebellion.",
    tag: "PROTOCOL_01"
  },
  {
    id: 2,
    title: "The Vision",
    icon: Eye,
    text: "To be the beacon of youth culture in North India. Panache envisions a platform that empowers the next generation of artists, coders, and leaders to showcase their raw, unfiltered talent.",
    tag: "PROTOCOL_02"
  }
];

const STATS = [
  { label: "Footfall", value: "25K+", sub: "Across 3 Days" },
  { label: "Colleges", value: "150+", sub: "Pan India" },
  { label: "Events", value: "60+", sub: "Tech & Cultural" },
  { label: "Prize Pool", value: "₹10L", sub: "Total Worth" },
];

// --- SUB-COMPONENT: SPOTLIGHT INFO CARD ---
const InfoCard = ({ item }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className="group relative h-full bg-[#080808] border border-white/10 rounded-3xl p-8 overflow-hidden hover:border-white/20 transition-colors duration-500"
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-white group-hover:scale-110 transition-transform duration-500">
                <item.icon size={24} />
            </div>
            <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest border border-white/5 px-2 py-1 rounded">
                {item.tag}
            </span>
        </div>
        
        <h3 className="text-3xl font-black uppercase italic text-white mb-4">
            {item.title}
        </h3>
        <p className="text-gray-400 text-sm font-medium leading-relaxed">
            {item.text}
        </p>
      </div>
    </div>
  );
};

const AboutSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="relative py-32 bg-[#050505] overflow-hidden">
      
      {/* 1. BACKGROUND NOISE & GRID */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* 2. HEADER: VGU IDENTITY */}
        <ActiveScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-12 mb-20 gap-8">
                <div className="max-w-4xl">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-12 h-[2px] bg-pink-500" />
                        <span className="text-pink-500 text-xs font-bold uppercase tracking-[0.2em]">
                            Vivekananda Global University
                        </span>
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black uppercase italic text-white tracking-tighter leading-[0.9]">
                        The Cultural <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                            Singularity
                        </span>
                    </h2>
                </div>
                
                {/* VGU Logo/Text Area */}
                <div className="hidden md:block text-right">
                    <Globe size={48} className="text-white/20 mb-4 ml-auto" />
                    <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">
                        Est. 2012 // Jaipur<br/>
                        Grade A+ Accreditation
                    </p>
                </div>
            </div>
        </ActiveScrollReveal>

        {/* 3. CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* LEFT: STORY TEXT (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
                <ActiveScrollReveal>
                    <p className="text-xl md:text-2xl text-white font-medium leading-normal">
                        Panache is more than a festival; it is a <span className="text-gray-400">movement</span>.
                    </p>
                    <p className="text-gray-500 leading-relaxed">
                        Born from the vibrant campus of VGU, Panache has evolved into one of North India's premier cultural phenomena. It is a 3-day saga where music, fashion, and technology collide to create an experience that defies definition.
                    </p>
                    <p className="text-gray-500 leading-relaxed">
                        This year, we go <strong>Stealth</strong>. We strip away the noise to focus on raw talent, groundbreaking performances, and a digital experience like never before.
                    </p>
                    
                    <div className="pt-4">
                        <button className="group flex items-center gap-3 text-white border-b border-white/30 pb-1 hover:border-white transition-all">
                            <span className="text-sm font-bold uppercase tracking-widest">Explore History</span>
                            <ArrowUpRight size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </ActiveScrollReveal>
            </div>

            {/* RIGHT: MISSION CARDS (7 Cols) */}
            <div className="lg:col-span-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    {CARDS.map((item, idx) => (
                        <ActiveScrollReveal key={item.id} delay={idx * 0.2} direction="up" className="h-full">
                            <InfoCard item={item} />
                        </ActiveScrollReveal>
                    ))}
                </div>
            </div>

        </div>


      </div>
      
      {/* 5. SCROLLING TICKER FOOTER */}
      <div className="absolute bottom-10 left-0 w-full overflow-hidden opacity-10 pointer-events-none">
         <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] flex gap-8">
            {[...Array(10)].map((_, i) => (
                <span key={i} className="text-6xl font-black uppercase italic text-transparent stroke-white" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}>
                    Panache 2026 // Stealth Mode //
                </span>
            ))}
         </div>
      </div>

    </section>
  );
};

export default AboutSection;