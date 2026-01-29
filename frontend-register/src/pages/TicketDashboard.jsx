import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TicketModal from '../components/TicketModal';
import { Ticket, ArrowLeft, Shield, Star } from 'lucide-react';

const TicketDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // The backend now sends a unified list of all displayable tickets
    const { tickets } = location.state || { tickets: [] };
    const [selectedTicket, setSelectedTicket] = useState(tickets.length > 0 ? tickets[0] : null);

    const handleClose = () => {
        setSelectedTicket(null);
        navigate('/login');
    }

    if (!selectedTicket) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl mb-6 text-red-500">
                        <Ticket size={32} />
                    </div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-4">
                        No Tickets Found
                    </h2>
                    <p className="text-gray-500 font-medium max-w-xs mb-8">
                        We couldn't find any tickets associated with the provided details. Please check your info or contact support.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="group flex items-center justify-center gap-2 bg-white text-black px-6 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-all"
                    >
                        <ArrowLeft size={14} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* The `type` is now dynamic based on the ticket object from the backend */}
            <TicketModal 
                ticket={selectedTicket} 
                type={selectedTicket.__isTeam ? selectedTicket.displayType : selectedTicket.displayType} 
                onClose={handleClose} 
            />
            
            {/* If there are multiple tickets, show a switcher */}
            {tickets.length > 1 && (
                 <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[101] bg-black/50 backdrop-blur-md p-2 rounded-full flex items-center gap-1.5 shadow-2xl border border-white/10">
                    <p className="text-white text-xs font-bold mr-2 pl-3">Your Passes:</p>
                    {tickets.map((ticket) => (
                        <button 
                            key={ticket.id} 
                            onClick={() => setSelectedTicket(ticket)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full font-bold text-xs transition-all ${selectedTicket.id === ticket.id ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                        >
                            {ticket.displayType === 'GATE' ? <Shield size={14} /> : <Star size={14} />}
                            <span className="hidden sm:inline">{ticket.displayType === 'GATE' ? 'Gate' : 'Arena'}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TicketDashboard;
