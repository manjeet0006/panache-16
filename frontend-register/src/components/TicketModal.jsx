import React from 'react';
import QRCode from 'react-qr-code';
import { X, Download, MapPin, Calendar, Info, Zap, ShieldCheck, Music, Crown, Star, User } from 'lucide-react';

const TicketModal = ({ ticket, type, onClose }) => {
    if (!ticket) return null;

    // 1. DATA PREPARATION
    const isTeam = Boolean(ticket.teamName);
    const isArena = type === 'CONCERT';

    // Normalize Tier (Default to SILVER)
    const rawTier = ticket.tier || ticket.ticketTier || 'SILVER';
    const tier = rawTier.toUpperCase();

    // 2. TIER THEME CONFIGURATION
    const themes = {
        SILVER: {
            accent: 'text-slate-400',
            border: 'border-slate-200',
            shadow: 'shadow-[0_0_40px_rgba(148,163,184,0.3)]',
            headerBg: 'bg-zinc-900',
            icon: Zap,
            label: 'Standard Access',
            gradient: 'from-slate-200 to-slate-400',
            button: 'bg-slate-800 text-white'
        },
        GOLD: {
            accent: 'text-yellow-500',
            border: 'border-yellow-500',
            shadow: 'shadow-[0_0_60px_rgba(234,179,8,0.4)]',
            headerBg: 'bg-yellow-950',
            icon: Star,
            label: 'VIP Lounge',
            gradient: 'from-yellow-300 via-yellow-500 to-yellow-200',
            button: 'bg-yellow-500 text-black'
        },
        PLATINUM: {
            accent: 'text-[#C69F62]',
            border: 'border-[#C69F62]',
            shadow: 'shadow-[0_0_80px_rgba(198,159,98,0.55)]',
            headerBg: 'bg-slate-950',
            icon: Crown,
            label: 'Pro / Fan-Pit',
            gradient: 'from-[#E6C27A] via-[#C69F62] to-[#604D30]',
            button: 'bg-gradient-to-r from-[#C69F62] to-[#604D30] text-white'
        }
    };

    const theme = themes[tier] || themes.SILVER;
    const TierIcon = theme.icon;

    // Normalize Display Data
    const data = {
        name: isTeam ? ticket.teamName : ticket.guestName,
        eventName: isArena ? (ticket.concert?.artistName || "Star Night") : "Panache Entry",
        date: new Date(ticket.concert?.date || ticket.createdAt || Date.now()),
        code: isArena ? (ticket.concertCode || ticket.arenaCode) : (ticket.ticketCode || ticket.gateCode),
    };

    const dateDisplay = data.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timeDisplay = data.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300 h-dvh w-full overflow-hidden font-sans">

            {/* Background Noise */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>

            <div className="relative w-full max-w-[340px] flex flex-col">

                {/* TICKET CONTAINER */}
                <div className={`bg-white mt-15 rounded-[2.5rem] overflow-hidden ${theme.shadow} flex-shrink-0 border-2 ${tier === 'SILVER' ? 'border-transparent' : theme.border}`}>

                    {/* --- TICKET HEADER --- */}
                    <div className={`${theme.headerBg} p-6 pb-5 text-white relative overflow-hidden`}>

                        {/* Top Gradient Line */}
                        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.gradient}`}></div>

                        {/* Header Row */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                <TierIcon size={12} className={tier === 'PLATINUM' ? 'text-cyan-400' : theme.accent} />
                                <span className={`text-[9px] font-black uppercase tracking-widest ${theme.accent}`}>
                                    {tier} {theme.label}
                                </span>
                            </div>
                            <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/20 transition-all -mr-2 -mt-2">
                                <X size={16} className="text-white/70" />
                            </button>
                        </div>

                        {/* Event Name */}
                        <h2 className={`text-4xl font-black uppercase italic tracking-tighter leading-[0.85] mb-3 break-words ${tier === 'PLATINUM' ? 'text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-200 to-purple-400' : 'text-white'}`}>
                            {data.eventName}
                        </h2>

                        {/* User Name */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className={`p-1 rounded-full bg-white/10 ${theme.accent}`}>
                                {isTeam ? <User size={12} /> : <ShieldCheck size={12} />}
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-white/90 truncate max-w-[200px]">
                                {data.name}
                            </p>
                        </div>

                        {/* Date/Loc Grid */}
                        <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                            <div>
                                <p className="text-[13px] font-bold uppercase tracking-widest text-white/40 mb-1">Date</p>
                                <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-white">
                                    <Calendar size={12} className={theme.accent} /> {dateDisplay}
                                </div>
                            </div>
                            <div>
                                <p className="text-[13px] font-bold uppercase tracking-widest text-white/40 mb-1">Venue</p>
                                <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-white">
                                    <MapPin size={12} className={theme.accent} /> {isArena ? "Main Arena" : "Gate 1"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- THE NOTCH (Tear Line) --- */}
                    <div className="relative h-8 bg-white flex items-center justify-between">
                        <div className="w-4 h-8 bg-black rounded-r-full"></div>
                        <div className="flex-1 border-b-2 border-dashed border-gray-200 mx-2"></div>
                        <div className="w-4 h-8 bg-black rounded-l-full"></div>
                    </div>

                    {/* --- QR SECTION --- */}
                    <div className="px-6 pb-8 pt-2 flex flex-col items-center bg-white">

                        {/* QR Container */}
                        <div className="bg-white p-3 rounded-2xl border-2 border-dashed border-gray-200 mb-5 relative group cursor-pointer hover:border-gray-400 transition-colors">
                            <QRCode
                                value={data.code || "NO_CODE"}
                                size={140}
                                fgColor="black"
                                bgColor="transparent"
                                level="Q"
                            />
                            {/* Brand Logo in Center */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-11 h-11 bg-white rounded-md flex items-center justify-center border-2 border-white shadow-sm">
                                    <div className="w-full h-full bg-black rounded-sm flex items-center justify-center">
                                        <span className="text-[10px] font-black text-white">P16</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Scan to Verify</p>
                        <p className="text-xl font-black text-black tracking-[0.3em] font-mono leading-none">
                            {data.code}
                        </p>

                        {/* Tier-Specific Footer Note */}
                        {tier === 'PLATINUM' && (
                            <div className="mt-6 w-full py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg flex items-center justify-center gap-2 border border-cyan-500/20">
                                <Crown size={12} className="text-cyan-600" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-cyan-800">Priority Access Active</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- DOWNLOAD BUTTON --- */}
                <button
                    onClick={() => window.print()}
                    className={`w-full mt-6 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl flex items-center justify-center gap-3 transform active:scale-95 transition-all ${theme.button}`}
                >
                    <Download size={16} /> Save to Photos
                </button>
            </div>
        </div>
    );
};

export default TicketModal;