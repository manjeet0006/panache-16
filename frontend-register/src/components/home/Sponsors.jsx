import { motion } from "framer-motion";
import ActiveScrollReveal from "../common/ActiveScrollReveal";

const SPONSORS = [
  { name: "RedBull", logo: "⚡" },
  { name: "Spotify", logo: "🎧" },
  { name: "Realme", logo: "📱" },
  { name: "Canon", logo: "📸" },
  { name: "Ubisoft", logo: "🎮" },
  { name: "Zolo", logo: "🏠" },
  { name: "Razorpay", logo: "💳" },
  { name: "MTV", logo: "📺" },
  { name: "Nothing", logo: "🔴" },
  { name: "Boat", logo: "🔊" },
];

const SponsorTicker = () => (
  <div className="relative w-full py-12 bg-[#050505] overflow-hidden border-y border-white/5">
    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />
    <div className="flex overflow-hidden">
      <motion.div
        className="flex gap-16"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 30, repeat: Infinity }}
      >
        {[...SPONSORS, ...SPONSORS, ...SPONSORS, ...SPONSORS].map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
          >
            <span className="text-2xl">{s.logo}</span>
            <span className="text-xl font-black uppercase italic">{s.name}</span>
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
        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-12">
          Supported By
        </p>
        <SponsorTicker />
      </ActiveScrollReveal>
    </section>
  );
};

export default Sponsors;
