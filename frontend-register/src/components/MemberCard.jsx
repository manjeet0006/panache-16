import React from 'react';
import { Crown, Users, Trash2, User, Phone, Hash, ShieldCheck, Zap } from 'lucide-react';

const MemberCard = ({ index, member, isVgu, onUpdate, onRemove, showRemove }) => {
  const isLeader = index === 0;

  return (
    <div className={`relative group p-6 rounded-[2rem] border overflow-hidden transition-colors duration-200 ${
      isLeader 
        ? 'bg-white/[0.03] border-pink-500/30 shadow-2xl' 
        : 'bg-white/[0.01] border-white/5 hover:border-white/10'
    }`}>
      
      {/* 1. STATIC AMBIENT GLOW */}
      {isLeader && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-[60px] pointer-events-none" />
      )}

      {/* 2. ERROR INDICATOR (STATIC) */}
      {(!member.name || !member.phone || (isVgu && !member.enrollment)) && (
        <div className="absolute top-5 right-5">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
        </div>
      )}

      {/* 3. HEADER: IDENTITY BLOCK */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`relative w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${
            isLeader 
              ? 'bg-pink-500 text-black border-pink-500 shadow-lg shadow-pink-500/20' 
              : 'bg-white/5 text-gray-500 border-white/5'
          }`}>
            {isLeader ? <Crown size={18} /> : <Users size={18} />}
            {isLeader && <Zap size={10} className="absolute -top-1 -right-1 text-pink-500 fill-pink-500" />}
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[7px] font-black uppercase tracking-[0.4em] text-gray-600">Personnel Registry</span>
                {isLeader && <ShieldCheck size={10} className="text-pink-500/50" />}
            </div>
            <h4 className={`text-sm font-black uppercase italic tracking-widest leading-none ${isLeader ? 'text-pink-500' : 'text-white'}`}>
              {isLeader ? "Squad Captain" : `Member // 0${index + 1}`}
            </h4>
          </div>
        </div>
        
        {showRemove && (
          <button 
            type="button" 
            onClick={() => onRemove(index)} 
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-700 hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/10"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* 4. INPUT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        <InputField 
            icon={<User size={14} />} 
            placeholder="FULL NAME" 
            value={member.name} 
            onChange={(val) => onUpdate(index, 'name', val)} 
        />
        <InputField 
            icon={<Phone size={14} />} 
            placeholder="WHATSAPP NO" 
            value={member.phone} 
            onChange={(val) => onUpdate(index, 'phone', val)} 
        />
        {isVgu && (
          <InputField 
            icon={<Hash size={14} />} 
            placeholder="ENROLLMENT ID" 
            value={member.enrollment} 
            onChange={(val) => onUpdate(index, 'enrollment', val)} 
          />
        )}
      </div>
    </div>
  );
};

// --- REFINED INPUT SUB-COMPONENT ---
const InputField = ({ icon, placeholder, value, onChange }) => (
    <div className="relative group/input">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-pink-500 transition-colors duration-200">
            {icon}
        </div>
        <input 
            type="text"
            className="w-full bg-black/20 border border-white/5 pl-11 pr-4 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.1em] outline-none focus:border-pink-500/40 transition-all duration-200 placeholder:text-gray-800 text-white" 
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
        />
    </div>
);

export default MemberCard;