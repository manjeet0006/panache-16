import { motion } from "framer-motion";
import { CheckCircle, Ticket, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from 'react';

const SuccessView = ({ ticket, concert, onOpenGate, onOpenArena }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative overflow-hidden font-sans">
      {/* 1. CINEMA OVERLAYS (Consistency with Showcase) */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-noise" />
      <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* Dynamic Success Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="relative z-10 max-w-2xl"
      >
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
          <CheckCircle size={40} className="text-white" />
        </div>
        
        {/* Massive Cinematic Typography */}
        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-6 leading-none">
          YOU'RE <span className="text-outline pl-2 text-green-500">IN.</span>
        </h1>
        
        <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-12">
          Digital passes dispatched to <span className="text-white underline decoration-green-500 underline-offset-4">{ticket.guestEmail}</span>
        </p>

        <div className="flex justify-center gap-6 w-full max-w-lg mx-auto">
          <button 
            onClick={onOpenArena}
            className="group bg-yellow-500 text-black h-20 px-5 rounded-2xl font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-yellow-500/30"
          >
            <Music size={18} /> View Celebrity Night Pass
          </button>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="mt-16 text-gray-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest underline decoration-pink-500 underline-offset-8"
        >
          Return to Home
        </button>
      </motion.div>
    </div>
  );
};

export default SuccessView;