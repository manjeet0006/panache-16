import React from 'react';
import { Crown, Users, Trash2, User, Phone, Hash, AlertCircle } from 'lucide-react';

const MemberCard = ({ index, member, isVgu, onUpdate, onRemove, showRemove }) => {
  const isLeader = index === 0;

  // Helper for the required badge
  const RequiredBadge = () => (
    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-[8px] text-red-400 font-black uppercase tracking-tighter">
      Required
    </span>
  );

  return (
    <div className={`relative group overflow-hidden p-6 rounded-[2rem] transition-all duration-500 border-2 backdrop-blur-md ${isLeader ? 'bg-pink-500/5 border-pink-500/30 shadow-[0_0_40px_rgba(236,72,153,0.1)]' : 'bg-white/[0.02] border-white/10 hover:border-white/20'}`}>
      
      {/* Visual background indicator for missing info */}
      {(!member.name || !member.phone) && (
        <div className="absolute top-0 right-0 w-1 h-full bg-red-500/20" />
      )}

      {isLeader && <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/20 blur-[80px] pointer-events-none" />}
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${isLeader ? 'bg-pink-500 text-black shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 'bg-white/5 text-gray-400'}`}>
            {isLeader ? <Crown size={20} /> : <Users size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 leading-none">Role</p>
                {/* Visual warning if empty */}
                {(!member.name || !member.phone) && <AlertCircle size={10} className="text-red-500 animate-pulse" />}
            </div>
            <h4 className={`text-sm font-black uppercase italic tracking-tighter ${isLeader ? 'text-pink-500' : 'text-white'}`}>
              {isLeader ? "Team Leader" : `Player ${index + 1}`}
            </h4>
          </div>
        </div>
        
        {showRemove && (
          <button type="button" onClick={() => onRemove(index)} className="p-2 rounded-lg bg-red-500/10 text-red-500/50 hover:bg-red-500 hover:text-white transition-all">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Name Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-[9px] font-bold uppercase text-gray-500 tracking-widest flex items-center gap-1"><User size={10} /> Full Name</label>
            <RequiredBadge />
          </div>
          <input className="w-full bg-black/40 border border-white/5 p-3.5 rounded-2xl text-sm outline-none focus:border-pink-500/50 focus:bg-pink-500/5 transition-all" placeholder="John Doe" value={member.name} onChange={e => onUpdate(index, 'name', e.target.value)} required />
        </div>

        {/* Phone Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-[9px] font-bold uppercase text-gray-500 tracking-widest flex items-center gap-1"><Phone size={10} /> WhatsApp</label>
            <RequiredBadge />
          </div>
          <input className="w-full bg-black/40 border border-white/5 p-3.5 rounded-2xl text-sm outline-none focus:border-pink-500/50 focus:bg-pink-500/5 transition-all" placeholder="+91..." value={member.phone} onChange={e => onUpdate(index, 'phone', e.target.value)} required />
        </div>

        {/* Enrollment Input (Conditional) */}
        {isVgu && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
                <label className="text-[9px] font-bold uppercase text-gray-500 tracking-widest flex items-center gap-1"><Hash size={10} /> Enrollment</label>
                <RequiredBadge />
            </div>
            <input className="w-full bg-black/40 border border-white/5 p-3.5 rounded-2xl text-sm outline-none focus:border-pink-500/50 focus:bg-pink-500/5 transition-all" placeholder="VGU23..." value={member.enrollment} onChange={e => onUpdate(index, 'enrollment', e.target.value)} required />
          </div>
        )}
      </div>
    </div>
  );
};
export default MemberCard;