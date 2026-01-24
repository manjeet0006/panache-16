import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-20 bg-[#050505] border-t border-white/5 overflow-hidden pt-4 pb-3 md:pt-12 md:pb-12 px-6">

      {/* Tiny soft glow in the corner */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 md:w-40 md:h-40 bg-pink-500/10 blur-[60px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">

          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-white">
              Panache Era<span className="text-pink-500">.</span>
            </div>
            <p className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.3em] text-gray-600 flex items-center gap-2">
              <Sparkles size={8} className="text-pink-500" /> VGU Jaipur Cultural Fest
            </p>
          </div>

          {/* Navigation with Dot Separators - Wraps nicely on mobile */}
          <nav className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-500">
            <Link to="/events" className="hover:text-white transition-colors">Events</Link>
            <span className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white/10 rounded-full" />
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Rules & Protocol</Link>
            <span className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white/10 rounded-full" />
            <Link to="/team" className="hover:text-white transition-colors">Core Team</Link>
          </nav>

          {/* Social Icons */}
          <div className="flex gap-5 md:gap-6">
            <SocialIcon href="https://instagram.com" icon={<Instagram size={16} />} />
            <SocialIcon href="https://twitter.com" icon={<Twitter size={16} />} />
            <SocialIcon href="https://youtube.com" icon={<Youtube size={16} />} />
          </div>
        </div>

        {/* Bottom Bar - Reduced Top Margin */}
        <div className="mt-2 pt-2 md:mt-10 md:pt-8 border-t border-white/[0.03] flex flex-col-reverse md:flex-row justify-between items-center gap-2">
          <p className="text-[7px] md:text-[8px] text-gray-700 font-bold uppercase tracking-[0.2em] text-center md:text-left">
            © 2026 Vivekananda Global University
          </p>

          <div className="flex items-center gap-2 bg-white/[0.02] px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/5">
            <p className="text-[7px] md:text-[8px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
              Made with <Heart size={10} className="text-pink-500 fill-pink-500 animate-pulse" /> by

              <span className="text-gray-300">Tech Team</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Simplified Social Icon with hover effects
const SocialIcon = ({ icon, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-600 hover:text-pink-500 transition-all duration-300 hover:scale-110 active:scale-95"
  >
    {icon}
  </a>
);

export default Footer;