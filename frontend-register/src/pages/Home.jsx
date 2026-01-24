import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion, useScroll, useTransform, useSpring,
  AnimatePresence
} from "framer-motion";
import {
  ArrowRight, Globe, School, X, Zap, Trophy, Music,
  Camera, Sparkles, ChevronDown, ArrowUpRight, ShieldCheck,
  Cpu, Layers, Activity, Terminal
} from "lucide-react";

// --- 1. CODE-GENERATED LOGO COMPONENT (Fixed for Tailwind) ---
const PanacheCodeLogo = ({ className }) => {
  return (
    <div className={`flex items-center justify-center gap-1 md:gap-2 ${className}`}>
      {/* P - Pink */}
      <LogoLetter letter="P" color="text-pink-600" bg="bg-pink-600/10" border="border-pink-600/20" shape="bg-pink-600/20" delay={0} />
      {/* A - Yellow */}
      <LogoLetter letter="A" color="text-yellow-500" bg="bg-yellow-500/10" border="border-yellow-500/20" shape="bg-yellow-500/20" delay={0.1} />
      {/* N - Blue */}
      <LogoLetter letter="N" color="text-blue-500" bg="bg-blue-500/10" border="border-blue-500/20" shape="bg-blue-500/20" delay={0.2} />
      {/* A - Purple */}
      <LogoLetter letter="A" color="text-purple-500" bg="bg-purple-500/10" border="border-purple-500/20" shape="bg-purple-500/20" delay={0.3} />
      {/* C - Green */}
      <LogoLetter letter="C" color="text-green-500" bg="bg-green-500/10" border="border-green-500/20" shape="bg-green-500/20" delay={0.4} />
      {/* H - Orange */}
      <LogoLetter letter="H" color="text-orange-500" bg="bg-orange-500/10" border="border-orange-500/20" shape="bg-orange-500/20" delay={0.5} />
      {/* E - Cyan */}
      <LogoLetter letter="E" color="text-cyan-500" bg="bg-cyan-500/10" border="border-cyan-500/20" shape="bg-cyan-500/20" delay={0.6} />
      
      {/* The '26' Badge */}
      <motion.div 
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
        className="relative ml-2 w-12 h-12 md:w-20 md:h-20"
      >
        <div className="absolute inset-0 bg-white transform rotate-3 rounded-xl" />
        <div className="absolute inset-0 bg-black transform -rotate-3 rounded-xl flex items-center justify-center border-2 border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 opacity-20" />
            <span className="text-lg md:text-3xl font-black text-white italic tracking-tighter z-10">16</span>
        </div>
      </motion.div>
    </div>
  );
};

const LogoLetter = ({ letter, color, bg, border, shape, delay = 0 }) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", bounce: 0.5, delay }}
    whileHover={{ y: -10, scale: 1.1, rotate: Math.random() * 10 - 5 }}
    className={`relative group w-10 h-14 md:w-20 md:h-28 flex items-center justify-center overflow-hidden rounded-xl border ${border} ${bg} backdrop-blur-sm transition-all duration-300`}
  >
    {/* Geometric Background Shapes */}
    <div className={`absolute top-0 right-0 w-6 h-6 md:w-10 md:h-10 ${shape} rounded-bl-full opacity-50`} />
    <div className={`absolute bottom-0 left-0 w-3 h-3 md:w-6 md:h-6 ${shape} rounded-tr-full opacity-50`} />
    
    <span className={`text-3xl md:text-6xl font-black italic tracking-tighter ${color} drop-shadow-2xl z-10`}>
      {letter}
    </span>
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const bgTextX = useTransform(smoothProgress, [0, 1], ["0%", "-20%"]);

  return (
    <div ref={containerRef} className="relative bg-[#030303] text-white selection:bg-pink-500/30 overflow-x-hidden font-sans">

      {/* --- 1. GLOBAL ATMOSPHERE & GRAIN --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Grain Overlay - Fallback to simple opacity if image fails */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-white/10" />
        
        {/* Dynamic Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Scrolling Background Text */}
        <motion.div
          style={{ x: bgTextX }}
          className="absolute top-1/2 left-0 -translate-y-1/2 text-[15vw] font-black text-white/[0.02] whitespace-nowrap uppercase italic tracking-tighter"
        >
          Perform Achieve Create Inspire
        </motion.div>
      </div>

      {/* --- HERO SECTION --- */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center pt-20 justify-center text-center z-10 px-6"
      >
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="px-6 py-2 mb-12 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md flex items-center gap-3 shadow-2xl"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Registrations Live
          </span>
        </motion.div>

        {/* ✅ CODE-GENERATED LOGO */}
        <div className="mb-10 scale-90 md:scale-100 transition-transform duration-500">
            <PanacheCodeLogo />
        </div>

        {/* Motto */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="relative"
        >
            <p className="text-lg md:text-2xl font-bold uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-white to-gray-400">
                "Together We Perform"
            </p>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent mt-4" />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, type: "spring" }}
          className="mt-16 flex flex-col md:flex-row gap-6 items-center w-full max-w-lg"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="relative w-full py-5 bg-white text-black rounded-xl font-black uppercase tracking-widest overflow-hidden group shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                Register Now <ArrowRight size={18} />
            </span>
            <div className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/events')}
            className="w-full py-5 border border-white/10 bg-white/[0.02] rounded-xl font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 group-hover:shadow-[0_0_10px_#ec4899] transition-all" />
            View Lineup
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 flex flex-col items-center gap-3"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-gray-500 to-transparent" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-600">Scroll</span>
        </motion.div>
      </motion.section>

      {/* --- 3. BENTO GRID --- */}
      <section className="relative z-20 py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <Activity className="text-pink-500 animate-pulse" size={18} />
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">Event Zones</span>
            </motion.div>
            <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-white">
              THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">CORE</span> <br />
              SPECTRUM
            </h2>
          </div>
          <div className="flex gap-4">
             <div className="px-4 py-2 border border-white/10 rounded-full text-xs font-bold text-gray-500">50+ Events</div>
             <div className="px-4 py-2 border border-white/10 rounded-full text-xs font-bold text-gray-500">3 Days</div>
             <div className="px-4 py-2 border border-white/10 rounded-full text-xs font-bold text-gray-500">1 Vibe</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[300px]">

          {/* 01. Star Night */}
          <BentoCard
            col="md:col-span-4" row="md:row-span-2"
            title="Star Night"
            category="Main Arena"
            desc="Experience the electrifying energy of live performances."
            img="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000"
            icon={<Music className="text-white" size={32} />}
            accent="bg-gradient-to-r from-pink-600 to-purple-600"
          />

          {/* 02. Workshops */}
          <BentoCard
            col="md:col-span-2" row="md:row-span-1"
            title="Workshops"
            category="Skill Up"
            desc="Masterclasses from industry pros."
            icon={<Cpu className="text-yellow-400" size={24} />}
            bg="bg-[#0f0f0f]"
            accent="bg-yellow-500"
          />

          {/* 03. Competitions */}
          <BentoCard
            col="md:col-span-2" row="md:row-span-2"
            title="Battlefield"
            category="Compete"
            desc="Dance, Drama, Music & Code."
            img="https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=800"
            icon={<Trophy className="text-white" size={32} />}
            accent="bg-gradient-to-r from-blue-600 to-cyan-600"
          />

          {/* 04. Hackathon */}
          <BentoCard
            col="md:col-span-2" row="md:row-span-1"
            title="Hackathon"
            category="Innovation"
            desc="24H Code Marathon."
            icon={<Terminal className="text-green-400" size={24} />}
            bg="bg-[#0f0f0f]"
            accent="bg-green-500"
          />

          {/* 05. Media */}
          <BentoCard
            col="md:col-span-2" row="md:row-span-1"
            title="Media Zone"
            category="Connect"
            desc="For creators & influencers."
            icon={<Layers className="text-orange-400" size={24} />}
            bg="bg-[#0f0f0f]"
            accent="bg-orange-500"
          />
        </div>
      </section>

      {/* --- 4. IDENTITY MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-3xl cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden shadow-2xl"
            >
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-500/20 blur-[120px] pointer-events-none" />
              <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-2 text-gray-600 hover:text-white transition-all"><X size={20} /></button>

              <div className="relative z-10 mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
                    <ShieldCheck size={12} className="text-green-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Secure Protocol</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-none">
                  Who Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">You?</span>
                </h2>
              </div>

              <div className="relative z-10 flex flex-col gap-4">
                <SelectionButton
                  title="VGU Student"
                  sub="Internal Access // Campus ID"
                  icon={<School size={28} />}
                  accent="group-hover:text-pink-500"
                  gradient="group-hover:from-pink-500/20"
                  onClick={() => navigate('/events?isVgu=true')}
                />
                <SelectionButton
                  title="Guest / Outside"
                  sub="External Protocol // Visitor Pass"
                  icon={<Globe size={28} />}
                  accent="group-hover:text-blue-400"
                  gradient="group-hover:from-blue-500/20"
                  onClick={() => navigate('/events?isVgu=false')}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const BentoCard = ({ col, row, bg, icon, title, desc, category, img, accent }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`${col} ${row} ${bg || 'bg-[#0f0f0f]'} group relative rounded-[2.5rem] overflow-hidden flex flex-col justify-end p-8 transition-all duration-500 border border-white/5 hover:border-white/10 shadow-xl`}
    >
      {img && (
        <div className="absolute inset-0 z-0">
          <img
            src={img} alt={title}
            className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-70 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
      )}
      
      {/* Dynamic Glow */}
      <div className={`absolute top-0 right-0 w-40 h-40 blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${accent?.replace('bg-', 'bg-') || 'bg-white'}`} />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all">
            {icon}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
            {category}
          </span>
        </div>
        <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-2 leading-none text-white">{title}</h3>
        <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[200px] group-hover:text-gray-300 transition-colors">{desc}</p>
        <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
          <ArrowUpRight size={20} className="text-white" />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 ${accent || 'bg-white/20'}`} />
    </motion.div>
  );
};

const SelectionButton = ({ title, sub, icon, accent, gradient, onClick }) => (
    <button
        onClick={onClick}
        className="group relative w-full flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:border-white/10 transition-all duration-300 text-left overflow-hidden"
    >
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="flex items-center gap-6 relative z-10">
            <div className={`w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-gray-500 ${accent} transition-colors duration-300 shadow-xl`}>
                {icon}
            </div>
            <div>
                <h3 className="text-xl md:text-2xl font-black uppercase italic text-white tracking-tighter group-hover:translate-x-1 transition-transform duration-300">{title}</h3>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1 group-hover:text-gray-400 transition-colors">{sub}</p>
            </div>
        </div>
        <ArrowRight size={20} className="relative z-10 text-gray-600 group-hover:text-white opacity-50 group-hover:opacity-100 transition-all" />
    </button>
);

export default Home;