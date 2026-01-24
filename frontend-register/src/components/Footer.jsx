import React from 'react';
import { Instagram, Twitter, Youtube, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-20 py-12 bg-[#050505] border-t border-white/5 px-6 overflow-hidden">
      {/* Tiny soft glow in the corner */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500/10 blur-[60px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-xl font-black uppercase italic tracking-tighter text-white">
              Panache Era<span className="text-pink-500">.</span>
            </div>
            <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-600 flex items-center gap-2">
              <Sparkles size={8} className="text-pink-500" /> VGU Jaipur Cultural Fest
            </p>
          </div>

          {/* Navigation with Dot Separators */}
          <nav className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Events</a>
            <span className="w-1 h-1 bg-white/10 rounded-full" />
            <a href="#" className="hover:text-white transition-colors">Rules</a>
            <span className="w-1 h-1 bg-white/10 rounded-full" />
            <a href="#" className="hover:text-white transition-colors">Team</a>
            <span className="w-1 h-1 bg-white/10 rounded-full" />
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </nav>

          {/* Social Icons */}
          <div className="flex gap-6">
            <SocialIcon icon={<Instagram size={18} />} />
            <SocialIcon icon={<Twitter size={18} />} />
            <SocialIcon icon={<Youtube size={18} />} />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.2em]">
            © 2026 Vivekananda Global University
          </p>
          
          <div className="flex items-center gap-2 bg-white/[0.02] px-4 py-2 rounded-full border border-white/5">
            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
              Made with <Heart size={10} className="text-pink-500 fill-pink-500 animate-pulse" /> by 
              <span className="text-gray-300">Tech Team</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Simplified Social Icon
const SocialIcon = ({ icon }) => (
  <a 
    href="#" 
    className="text-gray-600 hover:text-pink-500 transition-all duration-300 hover:scale-110 active:scale-95"
  >
    {icon}
  </a>
);

export default Footer;