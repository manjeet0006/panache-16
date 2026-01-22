import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Events', path: '/events' },
    { name: 'Scanner', path: '/scan' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 12 }}
            className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-transform"
          >
            <span className="text-white font-black text-2xl italic">P</span>
          </motion.div>
          <span className="text-2xl font-black tracking-tighter uppercase italic text-white">
            Panache <span className="text-pink-500 text-outline">26</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
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

        {/* Mobile Action (Example) */}
        <div className="md:hidden">
          <div className="w-6 h-0.5 bg-white mb-1.5"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </div>
      </div>
    </nav>
  );
};

export default Header;