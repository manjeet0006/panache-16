import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogIn, LayoutDashboard, Shield } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  // Auth state
  const token = localStorage.getItem('panache_token');
  const user = JSON.parse(localStorage.getItem('panache_user') || '{}');

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Events', path: '/events' },
    { name: 'Scanner', path: '/scan' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] border-b border-white/10 bg-black/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all"
          >
            <span className="text-white font-black text-2xl italic">P</span>
          </motion.div>
          <span className="text-2xl font-black tracking-tighter uppercase italic text-white hidden sm:block">
            Panache <span className="text-pink-500">26</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
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

          {/* User Action Icon */}
          <div className="flex items-center pl-6 border-l border-white/10">
            {token ? (
              <Link 
                to="/dashboard"
                className="relative w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-500/50 transition-all group"
              >
                {/* Active Session Indicator */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full animate-pulse"></span>
                
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <User size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                </motion.div>
              </Link>
            ) : (
              <Link 
                to="/login"
                className="w-10 h-10 bg-pink-500/10 border border-pink-500/20 text-pink-500 rounded-xl flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all shadow-[0_0_15px_rgba(236,72,153,0.1)] group"
              >
                <motion.div whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 400 }}>
                    <LogIn size={18} />
                </motion.div>
              </Link>
            )}
          </div>

          {/* Mobile Menu Icon (Simple) */}
          <div className="md:hidden flex flex-col gap-1.5 cursor-pointer group">
            <div className="w-6 h-0.5 bg-white group-hover:bg-pink-500 transition-colors"></div>
            <div className="w-4 h-0.5 bg-white group-hover:w-6 group-hover:bg-pink-500 transition-all"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;