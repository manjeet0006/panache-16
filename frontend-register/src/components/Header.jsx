import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogIn, Menu, X, ArrowRight, Home, Calendar, Scan, ChevronRight } from 'lucide-react';

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
    closed: { x: 20, opacity: 0 },
    open: (i) => ({ 
      x: 0, 
      opacity: 1, 
      transition: { delay: i * 0.1 + 0.2 } 
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
              Panache <span className="text-pink-500">16</span>
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

          {/* MOBILE TOGGLE BUTTON (Hidden when open to avoid double buttons) */}
          <button 
            onClick={() => setIsOpen(true)} 
            className={`md:hidden relative z-[1002] w-10 h-10 flex items-center justify-center text-white transition-opacity duration-200 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <Menu size={28} />
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
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1001] md:hidden"
            />
            
            {/* Slide-out Menu */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-xs bg-[#0A0A0A] border-l border-white/10 z-[1002] md:hidden flex flex-col shadow-2xl"
            >
              {/* 1. Mobile Menu Header (With Close Button) */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-xs italic">P</span>
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-white">Menu</span>
                 </div>
                 
                 {/* Close Button */}
                 <button 
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full text-gray-400 hover:bg-pink-500 hover:text-white transition-all"
                 >
                    <X size={18} />
                 </button>
              </div>

              {/* 2. Compact Links Section */}
              <div className="flex-1 flex flex-col  overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.div 
                    key={link.name}
                    custom={i}
                    variants={linkVariants}
                  >
                    <Link 
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center justify-between p-3 rounded-xl transition-all ${
                        location.pathname === link.path 
                        ? 'bg-pink-500/10 border border-pink-500/20' 
                        : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                          <link.icon size={20} className={location.pathname === link.path ? 'text-pink-500' : 'text-gray-500 group-hover:text-white'} />
                          <span className={`text-lg font-bold uppercase tracking-wide ${location.pathname === link.path ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                            {link.name}
                          </span>
                      </div>
                      <ChevronRight size={16} className={`text-gray-600 group-hover:text-white transition-transform group-hover:translate-x-1 ${location.pathname === link.path ? 'text-pink-500' : ''}`} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* 3. Mobile Auth Footer */}
              <div className="p-6 border-t border-white/5 bg-black/20">
                {token ? (
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 w-full p-3 bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-xl active:scale-95 transition-transform"
                  >
                    <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                        <User size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-white leading-none mb-1">My Dashboard</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">View Profile</p>
                    </div>
                  </Link>
                ) : (
                  <Link 
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-pink-600 text-white font-bold uppercase text-xs tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.3)] active:scale-95 transition-transform"
                  >
                    <LogIn size={16} /> Login Access
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