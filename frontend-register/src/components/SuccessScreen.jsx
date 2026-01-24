import React from 'react';
import QRCode from 'react-qr-code';
import { Download, MapPin, Calendar, Info, CheckCircle, Home, CreditCard, ShieldCheck, Zap } from 'lucide-react';

const SuccessScreen = ({ data, eventName, isVgu, onHome }) => {
    const team = data; 
    const ticketCode = team?.ticketCode || "PENDING";

    if (!team) return null;

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 animate-in fade-in duration-700 overflow-hidden relative selection:bg-pink-500/30">
            
            {/* Background Texture - Adds a 'Pro' feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3")` }}>
            </div>

            {/* Header: Centered & Minimal */}
            <div className="text-center mb-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 mb-4">
                    <CheckCircle size={12} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Transaction Verified</span>
                </div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">
                    PANACHE <span className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]">2026</span>
                </h2>
            </div>

            <div className="relative w-full max-w-[330px] z-10 group">
                {/* PRO TICKET SHAPE */}
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)] transform transition-transform group-hover:scale-[1.01] duration-500">
                    
                    {/* Header: Dark Stealth Mode */}
                    <div className="bg-[#000] p-6 pb-5 text-white relative overflow-hidden">
                        {/* Subtle Holographic Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>
                        
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <Zap size={14} className="text-pink-500 fill-pink-500" />
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Official Entry</span>
                            </div>
                            <ShieldCheck size={18} className="text-white opacity-20"/>
                        </div>

                        <h2 className="text-[26px] font-black uppercase italic tracking-tighter leading-none mb-2 break-words">
                            {eventName}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-[12px] font-black uppercase tracking-widest text-pink-500 truncate">
                                {team.teamName || "The Squad"}
                            </p>
                        </div>
                    </div>

                    {/* Realistic Perforated Notch */}
                    <div className="relative h-8 bg-white flex items-center justify-center">
                        <div className="absolute -left-4 w-8 h-8 bg-[#050505] rounded-full shadow-inner"></div>
                        <div className="absolute -right-4 w-8 h-8 bg-[#050505] rounded-full shadow-inner"></div>
                        {/* Dot Pattern Perforation */}
                        <div className="flex gap-2 opacity-10">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="w-1 h-1 bg-black rounded-full"></div>
                            ))}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-6 pb-6 pt-2 flex flex-col items-center">
                        
                        {isVgu ? (
                            /* VGU PRO CONTENT */
                            <div className="w-full py-4 flex flex-col items-center">
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-10 animate-pulse"></div>
                                    <div className="relative w-20 h-20 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-center shadow-inner">
                                        <CreditCard size={38} className="text-pink-600" />
                                    </div>
                                </div>
                                <div className="text-center mb-5">
                                    <h3 className="text-[15px] font-black text-black uppercase italic leading-none mb-2">VGU Physical ID</h3>
                                    <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.2em] leading-relaxed">
                                        No digital scan required. <br /> Present Student Card at Desk.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* GLOBAL PRO CONTENT */
                            <>
                                <div className="bg-gray-50 p-4 rounded-[2.5rem] border border-gray-100 mb-4 mt-2 shadow-inner group-hover:border-pink-500/20 transition-colors">
                                    <QRCode value={ticketCode} size={130} fgColor="#000" qrStyle="dots" />
                                </div>
                                <div className="text-center mb-6">
                                    <p className="text-[18px] font-black text-black tracking-[0.3em] font-mono leading-none">
                                        {ticketCode}
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Pro Meta Grid */}
                        <div className="w-full grid grid-cols-2 gap-3 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                                <Calendar size={14} className="text-pink-600" />
                                <div className="flex flex-col">
                                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">Date</span>
                                    <span className="text-[10px] font-black text-black uppercase">Feb 12-14</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                                <MapPin size={14} className="text-pink-600" />
                                <div className="flex flex-col">
                                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">Venue</span>
                                    <span className="text-[10px] font-black text-black uppercase">Main Arena</span>
                                </div>
                            </div>
                        </div>

                        {/* Micro Disclaimer */}
                        <div className="w-full flex items-start gap-3 p-3 bg-pink-500/[0.03] rounded-2xl border border-pink-500/10">
                            <Info size={14} className="text-pink-600 shrink-0" />
                            <p className="text-[8px] text-pink-900 font-bold leading-normal uppercase tracking-tight">
                                {isVgu 
                                    ? "Verification is manual. Keep your VGU ID handy throughout the event." 
                                    : "Unique squad pass. Screenshots with low brightness may fail at the gate."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* PRO BUTTONS: Ultra Minimal */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onHome}
                        className="flex-1 bg-white/[0.03] border border-white/10 text-gray-400 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                        <Home size={14} className="inline mr-2" /> Home
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="flex-1 bg-pink-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] shadow-[0_15px_30px_rgba(219,39,119,0.3)] hover:bg-pink-500 transition-all active:scale-95"
                    >
                        <Download size={14} className="inline mr-2" /> Save Pass
                    </button>
                </div>
            </div>
            
            {/* Minimal Brand Footer */}
            <div className="mt-10 flex items-center gap-4 opacity-20">
                <div className="h-px w-8 bg-white"></div>
                <p className="text-[10px] text-white font-black uppercase tracking-[0.5em]">
                    VGU Jaipur
                </p>
                <div className="h-px w-8 bg-white"></div>
            </div>
        </div>
    );
};

export default SuccessScreen;