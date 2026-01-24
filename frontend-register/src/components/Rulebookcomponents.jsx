import React from 'react';
import { BookOpen, AlertCircle, CheckCircle2, info } from 'lucide-react';

const Rulebook = ({ guidelines }) => {
  // If there are no guidelines, we don't render the component
  if (!guidelines || guidelines.length === 0) return null;

  return (
    <div className="w-full mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-8 px-2">
        <div className="p-2.5 bg-pink-500/10 rounded-xl text-pink-500">
          <BookOpen size={20} />
        </div>
        <div>
          <h3 className="text-[11px] font-black uppercase text-pink-500 tracking-[0.4em] leading-none mb-1">
            Official Rulebook
          </h3>
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
            Panache Era 2026 Guidelines
          </p>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 gap-4">
        {guidelines.map((rule, index) => (
          <div 
            key={index} 
            className="group flex items-start gap-5 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] hover:border-pink-500/20 transition-all duration-300"
          >
            {/* Index Number or Icon */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-gray-500 group-hover:text-pink-500 group-hover:border-pink-500/30 transition-all">
                {index + 1}
              </div>
              <div className="w-px h-full bg-gradient-to-b from-white/10 to-transparent group-last:hidden" />
            </div>

            {/* Rule Text */}
            <div className="flex-1 pt-1.5">
              <p className="text-[13px] text-gray-400 font-medium leading-relaxed group-hover:text-white transition-colors">
                {rule}
              </p>
            </div>

            {/* Subtle Checkmark for 'Read' feel */}
            <div className="pt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <CheckCircle2 size={16} className="text-pink-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Warning/Disclaimer Box */}
      <div className="mt-8 p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-3xl flex items-start gap-4">
        <AlertCircle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-yellow-500/70 font-bold uppercase leading-relaxed tracking-widest">
          Failure to follow the rules mentioned above may lead to immediate disqualification by the event coordinators without refund.
        </p>
      </div>
    </div>
  );
};

export default Rulebook;