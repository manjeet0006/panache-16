// src/components/concert/BookingForm.jsx
import React from 'react';
import { User, Mail, Phone, ArrowRight, Loader2, ShieldCheck, Zap, Crown, Star } from "lucide-react";
import { motion } from "framer-motion";

const BookingForm = ({ formData, setFormData, tiers, selectedTier, setSelectedTier, onBuy, isProcessing, concertSoldOut }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-5 sticky top-8"
    >
        {/* GLASS CARD CONTAINER */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            
            {/* Top Glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-pink-500/20 blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5 relative z-10">
                <h3 className="text-xs font-black uppercase italic tracking-widest text-white">Guest Terminal</h3>
                <span className="text-[9px] font-black uppercase tracking-widest text-pink-500 italic">Phase 01</span>
            </div>
            
            {/* Inputs */}
            <div className="space-y-3 mb-8 relative z-10">
                <InputField icon={User} placeholder="FULL NAME" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <InputField icon={Mail} placeholder="EMAIL" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <InputField icon={Phone} placeholder="PHONE" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            {/* Tier Selection */}
            <div className="mb-8 relative z-10">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-4 pl-2">Select Intensity</p>
                <div className="space-y-2">
                    {tiers?.map(tier => {
                        const isSoldOut = concertSoldOut || tier.soldOut;
                        return (
                            <button 
                                key={tier.tier}
                                onClick={() => !isSoldOut && setSelectedTier(tier)}
                                disabled={isSoldOut}
                                className={`w-full flex justify-between items-center p-4 rounded-xl border transition-all duration-300 ${
                                    selectedTier?.tier === tier.tier && !isSoldOut
                                    ? `bg-white text-black border-white shadow-lg scale-[1.02]` 
                                    : isSoldOut
                                    ? 'bg-red-500/10 text-red-400 border-red-500/20 cursor-not-allowed'
                                    : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {tier.tier === 'PLATINUM' ? <Crown size={16} /> : tier.tier === 'GOLD' ? <Star size={16} /> : <Zap size={16} />}
                                    <span className="text-[10px] font-black uppercase tracking-widest">{tier.tier}</span>
                                </div>
                                <span className="text-lg font-black italic tracking-tighter">
                                    {isSoldOut ? "SOLD OUT" : `₹${tier.price}`}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Checkout Button */}
            <button 
                onClick={onBuy}
                disabled={isProcessing || concertSoldOut || !selectedTier || selectedTier.soldOut}
                className={`w-full py-5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl transition-all flex items-center justify-center gap-3 relative z-10
                ${(!selectedTier || concertSoldOut || (selectedTier && selectedTier.soldOut)) ? 'bg-white/10 text-gray-500 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-600/30'}`}
            >
                {isProcessing ? <Loader2 className="animate-spin" /> : (concertSoldOut || (selectedTier && selectedTier.soldOut)) ? 'SOLD OUT' : <>Initialize Access <ArrowRight size={16}/></>}
            </button>
            
            <p className="mt-6 text-[8px] text-center font-black uppercase tracking-[0.2em] text-gray-600 flex items-center justify-center gap-2">
                <ShieldCheck size={10} className="text-green-500"/> Secured Encryption
            </p>
        </div>
    </motion.div>
  );
};

// Helper Input Component
const InputField = ({ icon: Icon, ...props }) => (
    <div className="group bg-black/40 rounded-xl px-4 py-3.5 flex items-center gap-3 border border-white/5 focus-within:border-pink-500/50 transition-all">
        <Icon size={14} className="text-gray-500 group-focus-within:text-pink-500 transition-colors" />
        <input {...props} className="bg-transparent w-full outline-none text-[10px] font-black placeholder:text-gray-700 text-white uppercase tracking-widest" />
    </div>
);

export default BookingForm;