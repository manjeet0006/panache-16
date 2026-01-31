"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Code2, Layers, Cpu } from "lucide-react";
import ActiveScrollReveal from "../common/ActiveScrollReveal";

// --- TEAM DATA ---
const TEAM = [
  {
    id: 1,
    name: "Manjeet Kumar",
    role: "Technical Head",
    sub: "Lead Architect",
    image: "https://res.cloudinary.com/duqxp1ejg/image/upload/v1769810588/Gemini_Generated_Image_wtaz4dwtaz4dwtaz_lra0ou.png",
    links: {
      github: "https://github.com/manjeet0006",
      linkedin: "https://www.linkedin.com/in/manjeet-kumar-50a463301/",
      instagram: "https://www.instagram.com/manjeet_rajput_0006",
    },
    tech: ["React", "Next.js", "Node" , "Fullstack" , "UI/UX"],
    accent: "group-hover:text-purple-400",
    border: "group-hover:border-purple-500/50"
  },
  {
    id: 2,
    name: "Harshit Choudhary",
    role: "Technical Team Member",
    sub: "Systems Engineer",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop", 
    links: {
      github: "https://github.com/harshitinnetin",
      linkedin: "https://www.linkedin.com/in/harshitchoudhayin?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      instagram: "https://www.instagram.com/harshitchoudhary.in?igsh=aGcxZ253dGE5aGJ2",
    },
    tech: ["Fullstack","React", "Next.js", "Node" , "UI/UX"],
    accent: "group-hover:text-cyan-400",
    border: "group-hover:border-cyan-500/50"
  },
];

const SpotlightCard = ({ member }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`group relative h-[450px] md:h-[500px] w-full rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden transition-colors duration-500 ${member.border}`}
    >
      {/* 1. BACKGROUND TEXTURE */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      {/* 2. DYNAMIC SPOTLIGHT EFFECT (Hidden on Mobile for Performance) */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />

      {/* 3. IMAGE SECTION (Top Half) */}
      <div className="relative h-[55%] md:h-[60%] w-full overflow-hidden border-b border-white/10 z-20">
         <img 
            src={member.image} 
            alt={member.name}
            // UPDATE: grayscale-0 by default (Mobile), grayscale on md (Desktop)
            className="h-full w-full object-cover grayscale-0 md:grayscale transition-all duration-700 md:group-hover:grayscale-0 group-hover:scale-105"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80" />
         
         {/* UPDATE: Floating Socials 
            - Mobile: visible (opacity-100), no translation
            - Desktop (md): hidden (opacity-0), translates on hover
         */}
         <div className="absolute top-3 right-3 md:top-4 md:right-4 flex flex-col gap-2 
                         opacity-100 translate-x-0 
                         md:opacity-0 md:translate-x-10 md:group-hover:translate-x-0 md:group-hover:opacity-100 
                         transition-all duration-500 z-30">
            {[ 
                { Icon: Github, href: member.links.github },
                { Icon: Linkedin, href: member.links.linkedin },
                { Icon: Instagram, href: member.links.instagram }
            ].map((Item, i) => (
                <a 
                    key={i} 
                    href={Item.href} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-white hover:text-black transition-colors shadow-lg"
                >
                    <Item.Icon size={18} />
                </a>
            ))}
         </div>
      </div>

      {/* 4. INFO SECTION (Bottom Half) */}
      <div className="relative h-[45%] md:h-[40%] p-6 md:p-8 flex flex-col justify-between z-20">
         
         <div>
             <div className="flex items-center justify-between mb-2">
                 <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 transition-colors ${member.accent}`}>
                    {member.sub}
                 </span>
                 <Layers size={14} className="text-white/20" />
             </div>
             
             {/* Name */}
             <h3 className="text-3xl md:text-4xl font-black uppercase italic text-white leading-none mb-1">
                {member.name}
             </h3>
             <p className="text-gray-400 text-xs md:text-sm font-medium">{member.role}</p>
         </div>

         {/* Tech Stack Pills */}
         <div className="flex flex-wrap gap-2 mt-4 md:mt-6">
            {member.tech.map((tech, i) => (
                <span 
                    key={i} 
                    className="px-2 py-1 md:px-3 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/60 border border-white/10 rounded-full group-hover:border-white/30 group-hover:text-white transition-colors bg-black/50"
                >
                    {tech}
                </span>
            ))}
         </div>

      </div>
    </motion.div>
  );
};

const Developers = () => {
  return (
    <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto min-h-auto md:min-h-[80vh] flex flex-col justify-center">
      
      {/* SECTION HEADER */}
      <ActiveScrollReveal>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 pb-8 border-b border-white/10 gap-6 md:gap-8">
            <div className="max-w-3xl w-full">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4 md:mb-6">
                    <Cpu size={12} className="text-gray-400" />
                    <span className="text-[10px] md:text-xs font-bold text-green-400 uppercase tracking-[0.3em]">
                       System Creators
                    </span>
                </div>
                
                {/* Title */}
                <h2 className="text-5xl md:text-8xl font-black uppercase italic text-white tracking-tighter leading-[0.9] mb-4 md:mb-6">
                    Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">Engineers</span>
                </h2>
                
                {/* Description */}
                <p className="text-gray-500 text-xs md:text-base font-medium leading-relaxed uppercase tracking-widest max-w-xl">
                    The masterminds who engineered the digital pulse of Panache. <br className="hidden md:block"/>
                    <span className="text-white">Forged in code, driven by innovation.</span>
                </p>
            </div>
            
            {/* Version Tag (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest shrink-0">
                <Code2 size={14} />
                <span>v2.0.26 // Stable</span>
            </div>
        </div>
      </ActiveScrollReveal>

      {/* DEVELOPER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
         {TEAM.map((member, idx) => (
             <ActiveScrollReveal key={member.id} delay={idx * 0.1} direction="up">
                 <SpotlightCard member={member} />
             </ActiveScrollReveal>
         ))}
      </div>

    </section>
  );
};

export default Developers;