import React from "react";
import { motion } from "framer-motion";
import ActiveScrollReveal from "../common/ActiveScrollReveal";

// 1. CONFIRM YOUR FILE PATH
// If this file is in 'src/components/', use '../assets/...'
// If this file is in 'src/', use './assets/...'
// Based on typical structures, we assume: src/components/Sponsors.jsx

import bobImg from '../../assets/sponsor/bob.png';
import decathlonImg from '../../assets/sponsor/decathlon.png';
import havmorImg from '../../assets/sponsor/havmor.png';
import pwImg from '../../assets/sponsor/pw.png';
import redbullImg from '../../assets/sponsor/redbull.png';
import royalImg from '../../assets/sponsor/royal.png';
import swiggyImg from '../../assets/sponsor/swiggy.png';
import vivoImg from '../../assets/sponsor/vivo.png';
import zoloImg from '../../assets/sponsor/zolo.jpg'; // Note: .jpg extension

const SPONSORS = [
  { name: "RedBull", logo: redbullImg },
  { name: "Bank of Baroda", logo: bobImg },
  { name: "Decathlon", logo: decathlonImg },
  { name: "Havmor", logo: havmorImg },
  { name: "PW", logo: pwImg },
  { name: "Royal Enfield", logo: royalImg },
  { name: "Swiggy", logo: swiggyImg },
  { name: "Vivo", logo: vivoImg },
  { name: "Zolo", logo: zoloImg },
];

const SponsorTicker = () => (
  <div className="relative w-full py-12 bg-[#050505] overflow-hidden border-y border-white/5">
    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />
    
    <div className="flex overflow-hidden">
      <motion.div
        className="flex gap-20"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 30, repeat: Infinity }}
      >
        {[...SPONSORS, ...SPONSORS, ...SPONSORS, ...SPONSORS].map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200 cursor-pointer shrink-0"
          >
            <img 
              src={s.logo}
              alt={s.name}
              className="h-13 md:h-15 w-auto object-contain invert"
              // ADD THIS: It helps debug if the path is wrong
              onError={(e) => {
                console.error(`Failed to load image: ${s.name}`);
                e.target.style.display = 'none'; // Hide broken images instead of showing a block
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  </div>
);


const Sponsors = () => {
  return (
    <section className="py-24 border-t border-white/5">
      <ActiveScrollReveal>
        <p className="text-center text-[18px] font-black uppercase tracking-[0.3em] text-gray-500 mb-12">
          Supported By
        </p>
        <SponsorTicker />
      </ActiveScrollReveal>
    </section>
  );
};

export default Sponsors;