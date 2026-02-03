"use client";
import React from "react";
import { motion } from "framer-motion";
import { Target, Eye, Zap, BookOpen } from "lucide-react";
import ActiveScrollReveal from "../common/ActiveScrollReveal";

const VGU_DATA = [
  {
    id: "mission",
    title: "Our Mission",
    icon: <Target size={32} />,
    text: "To focus on the holistic development of students by offering quality education, research exposure, and innovation opportunities, nurturing them into responsible global citizens.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "vision",
    title: "Our Vision",
    icon: <Eye size={32} />,
    text: "To be a globally recognized institution committed to excellence in education, research, and entrepreneurship, fostering sustainable growth and societal development.",
    gradient: "from-purple-500 to-pink-500",
  },
];

const InfoCard = ({ item }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="group relative p-1 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 overflow-hidden"
  >
    {/* Hover Gradient Glow */}
    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />
    
    <div className="relative h-full bg-[#0a0a0a] rounded-[22px] p-8 flex flex-col justify-between overflow-hidden">
        {/* Decorative Background Icon */}
        <div className={`absolute -right-4 -bottom-4 opacity-5 text-white transform rotate-[-15deg] group-hover:scale-110 transition-transform duration-500`}>
            {React.cloneElement(item.icon, { size: 120 })}
        </div>

        <div>
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} text-white mb-6 shadow-lg`}>
                {item.icon}
            </div>
            <h3 className="text-3xl font-black uppercase italic text-white mb-4">
                {item.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
                {item.text}
            </p>
        </div>
        
        {/* Decorative Line */}
        <div className={`w-12 h-1 mt-6 rounded-full bg-gradient-to-r ${item.gradient}`} />
    </div>
  </motion.div>
);

const About = () => {
  return (
    <section className="relative py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SIDE: About Panache */}
        <ActiveScrollReveal direction="right">
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[2px] bg-pink-500" />
              <span className="text-pink-500 text-xs font-bold uppercase tracking-widest">
                The Saga Continues
              </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white mb-8 leading-[0.9]">
              About <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                Panache
              </span>
            </h2>

            <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
              <p>
                <strong className="text-white">Panache</strong> is not just a cultural fest; it is the heartbeat of <strong className="text-white">Vivekananda Global University</strong>. It is a fusion of art, technology, and pure adrenaline—a 8-day spectacle where talent meets opportunity.
              </p>
              <p>
                From electrifying pro-nites featuring India's top artists to intense technical battles and high-fashion runways, Panache is where memories are forged in neon and sound.
              </p>
            </div>

            {/* Stat Row */}
            <div className="grid grid-cols-3 gap-6 mt-10 border-t border-white/10 pt-8">
               {[
                 { label: "Footfall", value: "15K+" },
                 { label: "Events", value: "40+" },
                 { label: "Colleges", value: "45+" }
               ].map((stat, i) => (
                 <div key={i}>
                   <h4 className="text-3xl font-black text-white italic">{stat.value}</h4>
                   <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{stat.label}</p>
                 </div>
               ))}
            </div>
          </div>
        </ActiveScrollReveal>

        {/* RIGHT SIDE: VGU Mission & Vision */}
        <div className="grid grid-cols-1 gap-6">
            {VGU_DATA.map((item, idx) => (
                <ActiveScrollReveal key={item.id} delay={0.2 + (idx * 0.1)} direction="left">
                    <InfoCard item={item} />
                </ActiveScrollReveal>
            ))}
        </div>

      </div>
    </section>
  );
};

export default About;