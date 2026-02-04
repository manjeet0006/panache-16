import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TicketModal from '../components/TicketModal';
import { Ticket, ArrowLeft, Shield, Star, AlertCircle } from 'lucide-react';


const TicketDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Safety check for location state
    const { tickets } = location.state || { tickets: [] };
    const [selectedTicket, setSelectedTicket] = useState(tickets.length > 0 ? tickets[0] : null);

    const handleClose = () => {
        // In a dashboard context, closing might mean logging out or returning home
        navigate('/'); 
    }

    // --- 1. NO TICKETS FOUND (Cinematic Access Denied) ---
    if (!selectedTicket) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden font-sans">
                
                {/* Background Overlays */}
                <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03] bg-noise mix-blend-overlay" />
                <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 blur-[150px] rounded-full pointer-events-none" />

                <div className="relative z-10 text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl mb-8 shadow-[0_0_40px_rgba(239,68,68,0.2)] animate-pulse">
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                    
                    <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white mb-6 leading-[0.85]">
                        No Passes <br/><span className="text-outline text-transparent">Found</span>
                    </h2>
                    
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-10 leading-relaxed">
                        We couldn't locate any active tickets for this account. <br/> Please check your credentials.
                    </p>
                    
                    <button
                        onClick={() => navigate('/login')}
                        className="group w-full py-5 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                        <ArrowLeft size={14} /> Return to Login
                    </button>
                </div>

                <style>{`
                    .text-outline { -webkit-text-stroke: 1px rgba(255,255,255,0.3); }
                    .bg-noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
                `}</style>
            </div>
        );
    }

    // console.log(selectedTicket);
    // --- 2. TICKET DASHBOARD (Main View) ---
    return (
        <div className="min-h-screen bg-[#050505] font-sans selection:bg-pink-500 relative">
            
            {/* Background Overlays */}
            <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.03] bg-noise mix-blend-overlay" />
            <div className="fixed inset-0 pointer-events-none z-[40] opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

            {/* THE TICKET MODAL */}
            {/* Note: TicketModal usually has a fixed overlay. We render it directly here. */}
            
            <TicketModal 
                ticket={selectedTicket} 
                type={'CONCERT'} 
                onClose={handleClose} 
            />
            
            {/* --- 3. MULTI-TICKET SWITCHER (Floating Dock) --- */}
            {tickets.length > 1 && (
                 <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-max max-w-[90vw]">
                    <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-2 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-2 overflow-x-auto no-scrollbar">
                        
                        <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest pl-4 pr-2 whitespace-nowrap">
                            Passes ({tickets.length})
                        </p>

                        {tickets.map((ticket) => {
                            const isActive = selectedTicket.id === ticket.id;
                            const isGate = ticket.displayType === 'GATE';
                            
                            return (
                                <button 
                                    key={ticket.id} 
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-300
                                        ${isActive 
                                            ? 'bg-pink-600 text-white shadow-[0_0_20px_rgba(219,39,119,0.4)]' 
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }
                                    `}
                                >
                                    {isGate ? <Shield size={12} /> : <Star size={12} />}
                                    <span className="whitespace-nowrap">
                                        {isGate ? 'Gate Access' : (ticket.concert?.artistName?.split(' ')[0] || 'Event')}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <style>{`
                .text-outline { -webkit-text-stroke: 1.5px white; }
                .bg-noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
            `}</style>
        </div>
    );
};

export default TicketDashboard;