import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion, useScroll, useTransform, useSpring,
  AnimatePresence
} from "framer-motion";
import {
  ArrowRight, Globe, School, X, Zap, Trophy, Music,
  Camera, Sparkles, Clock, MapPin, ChevronDown, ArrowUpRight
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const bgTextX = useTransform(smoothProgress, [0, 1], ["0%", "-40%"]);

  return (
    <div ref={containerRef} className="relative bg-[#030303] text-white selection:bg-pink-500 overflow-x-hidden">

      {/* --- 1. GLOBAL BACKGROUND ELEMENTS --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px]" />
        <motion.div
          style={{ x: bgTextX }}
          className="absolute top-1/2 left-0 -translate-y-1/2 text-[25vw] font-black text-white/[0.02] whitespace-nowrap uppercase italic"
        >
          Panache S16 Cultural Fest
        </motion.div>
      </div>

      {/* --- 2. CINEMATIC HERO SECTION --- */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center z-10 pt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="px-5 py-2 mb-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
        >
          <span className="text-pink-400 text-[10px] font-bold uppercase tracking-[0.4em]">#The Biggest Cultural Fest</span>
        </motion.div>

        <h1 className="text-[14vw] md:text-[11vw] font-[1000] leading-[0.8] tracking-tighter uppercase italic">
          UNLEASH THE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            PANACHE ERA
          </span>
        </h1>

        <p className="mt-10 max-w-xl text-gray-400 text-lg md:text-xl font-medium leading-relaxed px-6">
          Step into a world of vibrant culture, fierce competition, and
          unforgettable memories. Your stage is waiting.
        </p>

        {/* --- ADDED BUTTONS --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row gap-6 items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="group relative px-10 py-5 bg-white text-black rounded-full font-black uppercase tracking-tighter transition-all hover:bg-pink-500 hover:text-white shadow-xl shadow-white/5 overflow-hidden"
          >
            <span className="relative z-10">Start Registration</span>
            <div className="absolute inset-0 bg-pink-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/events')}
            className="px-10 py-5 border border-white/20 rounded-full font-black uppercase tracking-tighter hover:bg-white/5 transition-all flex items-center gap-3"
          >
            Explore Events <ArrowRight size={18} className="text-pink-500" />
          </motion.button>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 text-gray-600 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Scroll Experience</span>
          <ChevronDown size={16} />
        </motion.div>
      </motion.section>

      {/* --- 3. BENTO GRID --- */}
      {/* --- NEW EVENT CORE SECTION --- */}
      <section className="relative z-20 py-40 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="w-8 h-[1px] bg-pink-500"></span>
              <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em]">Explore the Vibe</span>
            </motion.div>
            <h2 className="text-6xl md:text-9xl font-[1000] uppercase italic tracking-tighter leading-none">
              THE <span className="text-pink-600">CORE</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/50 to-white/5">SPECTRUM</span>
            </h2>
          </div>
          <p className="max-w-xs text-gray-500 text-sm font-medium leading-relaxed border-l border-white/10 pl-6">
            From high-octane stage battles to futuristic tech expos, experience the diverse energy of the Panache Era.
          </p>
        </div>

        {/* --- THE HYPER BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[300px]">

          {/* 01. Star Night - The Feature Card */}
          <BentoCard
            col="md:col-span-4" row="md:row-span-2"
            title="Star Night"
            category="Main Stage"
            desc="Headline performances by global icons in the main arena under the stars."
            img="https://media.istockphoto.com/id/1806011581/es/foto/j%C3%B3venes-felices-y-alegres-bailando-saltando-y-cantando-durante-el-concierto-del-grupo-favorito.jpg?s=1024x1024&w=is&k=20&c=Y40epnfXDMcaqCy5ThmZJsiuioqeg98-XchxCeyaW_Q="
            icon={<Music className="text-pink-500" size={32} />}
            accent="bg-pink-600"
          />

          {/* 02. Workshops */}
          <BentoCard
            col="md:col-span-2" row="md:row-span-1"
            title="Workshops"
            category="Learning"
            desc="Masterclasses in design & media."
            icon={<Zap className="text-yellow-400" size={24} />}
            bg="bg-[#111]"
          />

          {/* 03. Competitions */}
          <BentoCard
            col="md:col-span-2" row="md:row-span-2"
            title="Competitions"
            category="Battle"
            desc="50+ events spanning 4 days of fierce cultural rivalry."
            img="https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&q=80&w=800"
            icon={<Trophy className="text-indigo-400" size={32} />}
            accent="bg-indigo-600"
          />

          {/* 04. 24H Hackathon */}
          <BentoCard
            col="md:col-span-2" row="md:row-span-1"
            title="Hackathon"
            category="Innovation"
            desc="Code for a better future."
            icon={<Sparkles className="text-purple-400" size={24} />}
            bg="bg-[#0a0a0a] border border-white/5"
          />

          {/* 05. Vloggers Zone */}
          <BentoCard
            col="md:col-span-2" row="md:row-span-1"
            title="Vloggers"
            category="Media"
            desc="Connect with India's top creators."
            icon={<Camera className="text-blue-400" size={24} />}
            bg="bg-[#151515]"
          />
        </div>
      </section>

      {/* --- 4. UPDATED POPUP (MODAL) --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 md:p-16 overflow-hidden shadow-2xl"
            >
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-pink-500/20 blur-[100px]" />
              <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition"><X /></button>

              <div className="mb-12 text-center">
                <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                  Identify <span className="text-pink-500">Yourself</span>
                </h2>
                <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-[10px]">Choose your category to proceed</p>
              </div>

              <div className="flex flex-col gap-5">
                <SelectionButton
                  title="VGU Student"
                  sub="Internal Access"
                  icon={<School size={32} />}
                  color="group-hover:text-pink-500"
                  onClick={() => navigate('/events?isVgu=true')}
                />
                <SelectionButton
                  title="Outside Student"
                  sub="Open Registration"
                  icon={<Globe size={32} />}
                  color="group-hover:text-indigo-500"
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

// --- HELPERS ---
const BentoCard = ({ col, row, bg, icon, title, desc, category, img, accent }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${col} ${row} ${bg || 'bg-[#111]'} group relative rounded-[2.5rem] overflow-hidden flex flex-col justify-end p-8 transition-all duration-500 shadow-2xl`}
    >
      {/* Background Image Reveal */}
      {img && (
        <div className="absolute inset-0 z-0">
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-60 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
      )}

      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] group-hover:bg-pink-500/10 transition-colors" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:border-white/30 transition-all">
            {icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
            {category}
          </span>
        </div>

        <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-2 leading-none">
          {title}
        </h3>
        <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[200px] group-hover:text-gray-300 transition-colors">
          {desc}
        </p>

        {/* Hover Arrow */}
        <div className="absolute bottom-2 right-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all">
          <ArrowUpRight size={24} className="text-pink-500" />
        </div>
      </div>

      {/* Interaction Accent Line */}
      <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 ${accent || 'bg-white/20'}`} />
    </motion.div>
  );
};

const SelectionButton = ({ title, sub, icon, onClick, color }) => (
  <button onClick={onClick} className="group relative flex items-center justify-between p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/[0.07] transition-all text-left">
    <div className="flex items-center gap-8">
      <div className={`text-gray-500 ${color} transition-colors duration-500`}>{icon}</div>
      <div>
        <h3 className="text-2xl font-black uppercase tracking-tight">{title}</h3>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">{sub}</p>
      </div>
    </div>
    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
      <ArrowUpRight size={20} />
    </div>
  </button>
);

export default Home;