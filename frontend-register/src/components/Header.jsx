import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogIn, Menu, X, ArrowRight, Home, Calendar, Scan } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Auth state
  const token = localStorage.getItem('panache_token');

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'All Events', path: '/events', icon: Calendar },
    { name: 'Scanner', path: '/scan', icon: Scan },
  ];

  // Animation variants
  const menuVariants = {
    closed: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const linkVariants = {
    closed: { x: 50, opacity: 0 },
    open: (i) => ({ 
      x: 0, 
      opacity: 1, 
      transition: { delay: i * 0.1 + 0.1 } 
    })
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[1000] border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group z-[1002]">
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.1 }}
              className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)]"
            >
              <span className="text-white font-black text-2xl italic">P</span>
            </motion.div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-white">
              Panache <span className="text-pink-500">26</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
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

            {/* Desktop Auth Button */}
            <div className="flex items-center pl-6 border-l border-white/10">
              {token ? (
                <Link to="/dashboard" className="relative w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-500/50 transition-all group">
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full animate-pulse"></span>
                  <User size={20} />
                </Link>
              ) : (
                <Link to="/login" className="w-10 h-10 bg-pink-500/10 border border-pink-500/20 text-pink-500 rounded-xl flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all">
                  <LogIn size={18} />
                </Link>
              )}
            </div>
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden relative z-[1002] w-10 h-10 flex items-center justify-center text-white"
          >
            <AnimatePresence mode='wait'>
                {isOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                        <X size={28} />
                    </motion.div>
                ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                        <Menu size={28} />
                    </motion.div>
                )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] md:hidden"
            />
            
            {/* Slide-out Menu */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0A0A0A] border-l border-white/10 z-[1001] md:hidden flex flex-col shadow-2xl"
            >
              {/* Menu Header */}
              <div className="h-24 flex items-end px-8 pb-6 border-b border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Navigation // System</p>
              </div>

              {/* Links */}
              <div className="flex-1 flex flex-col justify-center px-8 gap-8">
                {navLinks.map((link, i) => (
                  <motion.div 
                    key={link.name}
                    custom={i}
                    variants={linkVariants}
                  >
                    <Link 
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 text-2xl font-black uppercase tracking-tighter ${location.pathname === link.path ? 'text-pink-500' : 'text-white/60'}`}
                    >
                      <link.icon size={24} className={location.pathname === link.path ? 'text-pink-500' : 'text-gray-600'} />
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Auth Footer */}
              <div className="p-8 border-t border-white/5">
                {token ? (
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between w-full p-4 bg-white/5 border border-white/10 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500">
                            <User size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-white">My Dashboard</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Access Profile</p>
                        </div>
                    </div>
                    <ArrowRight size={16} className="text-gray-500" />
                  </Link>
                ) : (
                  <Link 
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-pink-600 text-white font-bold uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.3)] active:scale-95 transition-transform"
                  >
                    <LogIn size={18} /> Login / Join
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