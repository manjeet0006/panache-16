import React from 'react';
import QRCode from 'react-qr-code';
import { X, Download, MapPin, Calendar, Info } from 'lucide-react';

const TicketModal = ({ team, onClose }) => {
    if (!team) return null;

    return (
        <div className="fixed inset-0 z-[100] pt-30 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm">


                {/* TICKET BODY */}

                <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(236,72,153,0.3)]">

                    {/* Header Section */}
                    <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-8 text-white">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full">
                                Official Entry Pass <span className="text-[8px] font-mono font-bold opacity-70">#PAN26</span>
                            </span>
                            
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute-top-12 right-0 text-white/50 hover:text-white transition-colors"
                            >
                                <X size={32} />
                            </button>

                        </div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-1">
                            {team.event.name}
                        </h2>
                        <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest">Team: {team.teamName}</p>

                        <div className="mt-4 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                                <Calendar size={12} /> Feb 12-14, 2026
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                                <MapPin size={12} /> Main Stage, VGU Jaipur
                            </div>
                        </div>
                    </div>

                    {/* THE NOTCH (The visual 'cut' in the ticket) */}
                    <div className="relative h-6 bg-white flex items-center">
                        <div className="absolute -left-3 w-6 h-6 bg-black rounded-full"></div>
                        <div className="absolute -right-3 w-6 h-6 bg-black rounded-full"></div>
                        <div className="w-full border-t-2 border-dashed border-gray-100 mx-6"></div>
                    </div>

                    {/* QR SECTION */}
                    <div className="p-5 flex flex-col items-center">
                        <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 mb-4">
                            <QRCode
                                value={team.ticketCode || "NO_CODE"}
                                size={150}
                                fgColor="#000000"
                                className="rounded-lg"
                            />
                        </div>

                        <div className="text-center mb-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Authorization Code</p>
                            <p className="text-2xl font-black text-black tracking-[0.2em] font-mono">
                                {team.ticketCode}
                            </p>
                        </div>

                        <div className="w-full p-4 bg-pink-50 rounded-2xl flex items-start gap-3">
                            <Info size={16} className="text-pink-500 shrink-0" />
                            <p className="text-[9px] text-pink-700 font-bold leading-relaxed uppercase">
                                Present this QR at the gate for fast-track entry. Do not share this code with anyone outside your squad.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => window.print()}
                    className="w-full mt-6 bg-white/10 border border-white/20 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                    <Download size={16} /> Save Offline (PDF)
                </button>
            </div>
        </div>
    );
};

export default TicketModal;