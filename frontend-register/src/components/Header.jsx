import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring } from 'framer-motion';
import { User, LogIn, Menu, X, Home, Calendar, Scan, ChevronRight, Phone, FileText } from 'lucide-react';

import panacheLogo from '../assets/image.png'; 
import NoiseOverlay from './common/NoiseOverlay';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const token = localStorage.getItem('panache_token');

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);


  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Events', path: '/events', icon: Calendar },
    // { name: 'Scanner', path: '/scan', icon: Scan },
    { name: 'Rulebook', path: '/terms-and-conditions', icon: FileText }, // Added Rulebook
    { name: 'Contact', path: '/contact', icon: Phone }, // Added Contact
  ];

  const menuVariants = {
    closed: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const linkVariants = {
    closed: { x: 20, opacity: 0 },
    open: (i) => ({ x: 0, opacity: 1, transition: { delay: i * 0.1 + 0.2 } })
  };

  return (
    <>
      <NoiseOverlay />
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 origin-left z-[1001] shadow-[0_0_20px_rgba(236,72,153,0.5)]"
      />
      <motion.nav 
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-[1000] border-b border-white/10 bg-[#030303]/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-3 group z-[1002]">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              src={panacheLogo} 
              alt="Panache 2026" 
              className="h-8 md:h-10 object-contain" 
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-8 text-[13px] font-black uppercase tracking-[0.2em]">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.name}
                    to={link.path} 
                    className={`relative transition-colors duration-300 ${
                      isActive ? 'text-pink-500' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div 
                        layoutId="navUnderline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-500"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center pl-6 border-l border-white/10 gap-2">
              {token ? (
                <Link to="/dashboard" className="relative w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-500/50 transition-all group">
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full animate-pulse"></span>
                  <User size={20} />
                </Link>
              ) : (
                <>
                <Link to="/ticket-login" className="text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  Ticket Login
                </Link>
                <Link to="/login" className="w-10 h-10 bg-pink-500/10 border border-pink-500/20 text-pink-500 rounded-xl flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all">
                  <LogIn size={18} />
                </Link>
                </>
              )}
            </div>
          </div>

          <button 
            onClick={() => setIsOpen(true)} 
            className={`md:hidden relative z-[1002] w-10 h-10 flex items-center justify-center text-white transition-opacity duration-200 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <Menu size={28} />
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1001] md:hidden"
            />
            <motion.div
              variants={menuVariants} initial="closed" animate="open" exit="closed"
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-xs bg-[#0A0A0A] border-l border-white/10 z-[1002] md:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                 <img src={panacheLogo} alt="Logo" className="h-8 object-contain" />
                 <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full text-gray-400 hover:bg-pink-500 hover:text-white transition-all">
                    <X size={18} />
                 </button>
              </div>

              <div className="flex-1 flex flex-col overflow-y-auto py-4">
                {navLinks.map((link, i) => (
                  <motion.div key={link.name} custom={i} variants={linkVariants}>
                    <Link 
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center justify-between p-3 mx-4 my-1 rounded-xl transition-all ${
                        location.pathname === link.path ? 'bg-pink-500/10 border border-pink-500/20' : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                          <link.icon size={20} className={location.pathname === link.path ? 'text-pink-500' : 'text-gray-500 group-hover:text-white'} />
                          <span className={`text-lg font-bold uppercase tracking-wide ${location.pathname === link.path ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                            {link.name}
                          </span>
                      </div>
                      <ChevronRight size={16} className={`text-gray-600 ${location.pathname === link.path ? 'text-pink-500' : ''}`} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 border-t border-white/5 bg-black/20">
                {token ? (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full p-3 bg-white/5 border border-white/10 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white"><User size={20} /></div>
                    <div className="flex-1"><p className="text-sm font-bold text-white mb-1">My Dashboard</p><p className="text-[10px] text-gray-500 uppercase tracking-widest">View Profile</p></div>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full py-3.5 bg-pink-600 text-white font-bold uppercase text-xs tracking-[0.2em] rounded-xl">
                      <LogIn size={16} /> Login Access
                    </Link>
                    <Link to="/ticket-login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600/20 text-blue-400 font-bold uppercase text-xs tracking-[0.2em] rounded-xl">
                      Ticket Login
                    </Link>
                  </div>
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