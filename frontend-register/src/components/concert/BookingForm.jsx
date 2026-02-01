import React from 'react';
import { User, Mail, Phone, ArrowRight, Loader2, ShieldCheck, Zap, Crown, Star, ChevronDown, Check, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- 🛠️ CONFIGURATION: TIER PERKS DATA ---
const TIER_METADATA = {
    'SILVER': {
        icon: Shield,
        color: "text-gray-400",
        perks: ["General Arena Access",  "Standard Security"]
    },
    'GOLD': {
        icon: Zap,
        color: "text-yellow-400",
        perks: ["Premium Viewing Area", "Fast Track Entry", "1 Free Drink"]
    },
    'PLATINUM': {
        icon: Star,
        color: "text-pink-500",
        perks: ["VIP Front Row", "Meet & Greet", "VIP Lounge", "Signed Merch"]
    }
};

const BookingForm = ({ formData, setFormData, tiers, selectedTier, setSelectedTier, onBuy, isProcessing, concertSoldOut }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full h-full"
    >
        {/* GLASS CARD */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden h-full flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <h3 className="text-xs font-black uppercase italic tracking-widest text-white">Guest Terminal</h3>
                <span className="text-[9px] font-black uppercase tracking-widest text-pink-500 italic">Phase 01</span>
            </div>
            
            {/* Inputs */}
            <div className="space-y-3 mb-8">
                <InputField icon={User} placeholder="FULL NAME" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <InputField icon={Mail} placeholder="EMAIL" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <InputField icon={Phone} placeholder="PHONE" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            {/* --- ACCORDION TIER SELECTION --- */}
            <div className="mb-8 flex-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-4 pl-1">Select Access Level</p>
                <div className="flex flex-col gap-3">
                    {tiers?.map((tier) => {
                        const isSoldOut = concertSoldOut || tier.soldOut;
                        const isSelected = selectedTier?.id === tier.id;
                        const meta = TIER_METADATA[tier.tier] || TIER_METADATA['SILVER'];
                        const Icon = meta.icon;

                        return (
                            <div 
                                key={tier.id}
                                onClick={() => !isSoldOut && setSelectedTier(tier)}
                                className={`relative rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden group
                                    ${isSelected 
                                        ? 'bg-white border-white scale-[1.02] shadow-lg z-10' 
                                        : isSoldOut 
                                        ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed' 
                                        : 'bg-white/5 border-white/10 hover:border-white/30'
                                    }
                                `}
                            >
                                {/* Tier Header */}
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} className={isSelected ? 'text-black' : meta.color} />
                                        <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-black' : 'text-white'}`}>
                                            {tier.tier}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-black italic ${isSelected ? 'text-black' : 'text-white'}`}>
                                            {isSoldOut ? "SOLD OUT" : `₹${tier.price}`}
                                        </span>
                                        {!isSoldOut && (
                                            <ChevronDown size={14} className={`transition-transform duration-300 ${isSelected ? 'text-black rotate-180' : 'text-gray-500'}`} />
                                        )}
                                    </div>
                                </div>

                                {/* Accordion Body (Perks) */}
                                <AnimatePresence>
                                    {isSelected && !isSoldOut && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 pt-0">
                                                <div className="h-px w-full bg-black/10 mb-3" />
                                                <ul className="grid grid-cols-1 gap-2">
                                                    {meta.perks.map((perk, i) => (
                                                        <motion.li 
                                                            key={i}
                                                            initial={{ x: -10, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-black/70"
                                                        >
                                                            <Check size={10} className="text-pink-600" />
                                                            {perk}
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Checkout Button */}
            <div className="mt-auto pt-4 border-t border-white/10">
                <button 
                    onClick={onBuy}
                    disabled={isProcessing || concertSoldOut || !selectedTier || selectedTier.soldOut}
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl transition-all flex items-center justify-center gap-3
                    ${(!selectedTier || concertSoldOut || (selectedTier && selectedTier.soldOut)) ? 'bg-white/10 text-gray-500 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-600/30'}`}
                >
                    {isProcessing ? <Loader2 className="animate-spin" /> : (concertSoldOut) ? 'SOLD OUT' : <>Initialize Access <ArrowRight size={16}/></>}
                </button>
                
                <p className="mt-4 text-[8px] text-center font-bold uppercase tracking-widest text-gray-600 flex items-center justify-center gap-2">
                    <ShieldCheck size={10} className="text-green-500"/> Secured via Razorpay
                </p>
            </div>
        </div>
    </motion.div>
  );
};

// Helper Input
const InputField = ({ icon: Icon, ...props }) => (
    <div className="group bg-black/30 rounded-xl px-4 py-3.5 flex items-center gap-3 border border-white/10 focus-within:border-pink-500/50 transition-all">
        <Icon size={14} className="text-gray-500 group-focus-within:text-pink-500 transition-colors" />
        <input {...props} className="bg-transparent w-full outline-none text-[10px] font-black placeholder:text-gray-700 text-white uppercase tracking-widest" />
    </div>
);

export default BookingForm;