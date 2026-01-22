import React from 'react';
import { Instagram, Twitter, Youtube, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-20 py-20 bg-[#050505] border-t border-white/5 px-10">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Brand Name */}
        <div className="text-4xl font-[1000] uppercase italic mb-8 tracking-tighter text-white">
          Panache Era<span className="text-pink-600">.</span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-6 mb-12">
          <SocialIcon icon={<Instagram size={20} />} color="hover:bg-pink-600" />
          <SocialIcon icon={<Twitter size={20} />} color="hover:bg-blue-500" />
          <SocialIcon icon={<Youtube size={20} />} color="hover:bg-red-600" />
        </div>

        {/* Links Grid (Optional) */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-12 text-[10px] font-black uppercase tracking-widest text-gray-500">
          <a href="#" className="hover:text-white transition">About Fest</a>
          <a href="#" className="hover:text-white transition">Sponsorships</a>
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Contact Us</a>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[1em]">
            © 2026 VGU Jaipur
          </p>
          <p className="flex items-center gap-2 text-[9px] text-gray-800 font-bold uppercase tracking-widest">
            Developed with <Heart size={10} className="text-pink-500 fill-pink-500" /> by Panache Tech Team
          </p>
        </div>
      </div>
    </footer>
  );
};

// Helper Social Icon Component
const SocialIcon = ({ icon, color }) => (
  <a 
    href="#" 
    className={`w-12 h-12 border border-white/10 rounded-2xl flex items-center justify-center text-gray-400 transition-all duration-500 ${color} hover:text-white hover:border-transparent hover:-translate-y-2`}
  >
    {icon}
  </a>
);

export default Footer;