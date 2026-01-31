import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring } from 'framer-motion';
import { 
    User, LogIn, Menu, X, Home, Calendar, ChevronRight, Phone, 
    FileText, Music, Info, Sparkles, ChevronDown, MoreHorizontal ,Trophy
} from 'lucide-react';

import panacheLogo from '../assets/image.png'; 
import NoiseOverlay from './common/NoiseOverlay';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const token = localStorage.getItem('panache_token');

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100, damping: 30, restDelta: 0.001
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  // --- NAVIGATION CONFIGURATION ---
  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Concert', path: '/concerts', icon: Music },
    { name: 'Rules', path: '/terms-and-conditions', icon: FileText },
    { name: 'Contact', path: '/contact', icon: Phone },
    // --- ITEMS BELOW THIS WILL GO INTO 'MORE' ---
    { name: 'Gallery', path: '/gallery', icon: Sparkles }, // Example
    { name: 'Score', path: '/score-board', icon: Trophy }, 
    { name: 'Team', path: '/team', icon: User },         
    { name: 'About', path: '/about', icon: Info },
  ];

  // Logic: First 5 items are visible, the rest go to dropdown
  const VISIBLE_COUNT = 5;
  const visibleLinks = navLinks.slice(0, VISIBLE_COUNT);
  const dropdownLinks = navLinks.slice(VISIBLE_COUNT);

  const menuVariants = {
    closed: { x: "100%", opacity: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const linkVariants = {
    closed: { x: 50, opacity: 0 },
    open: (i) => ({ x: 0, opacity: 1, transition: { delay: i * 0.05 + 0.1 } })
  };

  return (
    <>
      <NoiseOverlay />
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 origin-left z-[1001] shadow-[0_0_20px_rgba(236,72,153,0.8)]" />

      <motion.nav 
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
            isScrolled 
            ? 'h-16 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
            : 'h-24 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="relative z-[1002] flex items-center gap-2 group">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <img src={panacheLogo} alt="Panache 2026" className={`object-contain transition-all duration-500 ${isScrolled ? 'h-8' : 'h-10'}`} />
            </motion.div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-1">
            <div className="flex items-center p-1 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-sm mr-6">
              
              {/* 1. VISIBLE LINKS */}
              {visibleLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link key={link.name} to={link.path} className="relative px-5 py-2 group">
                    {isActive && (
                      <motion.div layoutId="navPill" className="absolute inset-0 bg-white/[0.08] rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                    )}
                    <span className={`relative text-[12px] font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                      {link.name}
                    </span>
                  </Link>
                
                );
              })}

              {/* 2. MORE DROPDOWN (Only if needed) */}
              {dropdownLinks.length > 0 && (
                <div className="relative group px-2">
                    <button className="flex items-center gap-1 px-3 py-2 text-gray-400 group-hover:text-white transition-colors">
                        <span className="text-[12px] font-bold uppercase tracking-widest">More</span>
                        <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-300" />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full right-0 mt-4 w-48 bg-[#0A0A0A] border border-white/10 rounded-2xl p-2 shadow-2xl opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 transform origin-top-right">
                        {dropdownLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
                                    location.pathname === link.path ? 'bg-pink-500 text-white' : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                }`}
                            >
                                <link.icon size={16} />
                                <span className="text-[11px] font-bold uppercase tracking-widest">{link.name}</span>
                            </Link>
                        ))}
                    </div>
                    {/* Invisible Bridge to prevent closing on gap */}
                    <div className="absolute top-full left-0 w-full h-4 bg-transparent" />
                </div>
              )}
            </div>

            {/* LOGIN / PROFILE */}
            <div className="pl-6 border-l border-white/10">
              {token ? (
                <Link to="/dashboard" className="relative group">
                    <div className="absolute inset-0 bg-pink-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:border-pink-500/50 transition-all overflow-hidden">
                         <User size={18} />
                    </div>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full animate-pulse" />
                </Link>
              ) : (
                <Link to="/login" className="relative group overflow-hidden rounded-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative px-6 py-2.5 flex items-center gap-2 text-white text-[11px] font-black uppercase tracking-widest">
                        <LogIn size={14} /> <span>Access</span>
                    </div>
                </Link>
              )}
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            onClick={() => setIsOpen(true)} 
            className={`md:hidden relative z-[1002] w-10 h-10 flex items-center justify-center text-white transition-all duration-300 ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
          >
            <Menu size={28} />
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU (Shows ALL links in one list) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1001] md:hidden" />
            <motion.div variants={menuVariants} initial="closed" animate="open" exit="closed" className="fixed top-0 right-0 bottom-0 w-full max-w-[320px] bg-[#0A0A0A] border-l border-white/10 z-[1002] md:hidden flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20">
                 <div className="flex items-center gap-2"><Sparkles size={16} className="text-pink-500" /><span className="text-xs font-bold uppercase tracking-[0.2em] text-white">Navigation</span></div>
                 <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-all"><X size={18} /></button>
              </div>

              <div className="flex-1 flex flex-col overflow-y-auto py-6 px-4 space-y-2">
                {/* On Mobile, we map ALL links (visible + dropdown) together */}
                {navLinks.map((link, i) => (
                  <motion.div key={link.name} custom={i} variants={linkVariants}>
                    <Link to={link.path} onClick={() => setIsOpen(false)} className={`group relative overflow-hidden flex items-center justify-between p-4 rounded-2xl transition-all ${location.pathname === link.path ? 'bg-white/[0.08] text-white shadow-inner' : 'hover:bg-white/[0.03] text-gray-400 hover:text-white'}`}>
                      <div className="flex items-center gap-4 relative z-10">
                          <div className={`p-2 rounded-lg transition-colors ${location.pathname === link.path ? 'bg-pink-500 text-white' : 'bg-white/5 text-gray-500 group-hover:text-white'}`}><link.icon size={18} /></div>
                          <span className="text-sm font-bold uppercase tracking-widest">{link.name}</span>
                      </div>
                      <ChevronRight size={16} className={`relative z-10 transition-transform group-hover:translate-x-1 ${location.pathname === link.path ? 'text-pink-500' : 'text-gray-600'}`} />
                      {location.pathname === link.path && <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent pointer-events-none" />}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-sm">
                {token ? (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-4 w-full p-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-lg shadow-pink-500/20 active:scale-95 transition-transform">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm"><User size={20} /></div>
                    <div className="flex-1"><p className="text-sm font-black text-white uppercase tracking-wider">Dashboard</p><p className="text-[10px] text-white/70 font-medium">Manage Events</p></div>
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-gray-200 active:scale-95 transition-all">
                    <LogIn size={16} /> Member Access
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;