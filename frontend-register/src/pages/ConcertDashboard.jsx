import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Ticket, User, Calendar, MapPin, Music } from 'lucide-react';
import API from '../api';
import { toast } from 'sonner';

const ConcertDashboard = () => {
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user] = useState(JSON.parse(localStorage.getItem('panache_user') || '{}'));


    useEffect(() => {
        const userType = localStorage.getItem('panache_user_type');
        if (userType !== 'ticket') {
            navigate('/dashboard');
            return;
        }

        const fetchTicket = async () => {
            try {
                const res = await API.get('/user/concert-ticket');
                setTicket(res.data);
            } catch (err) {
                toast.error("Could not load your ticket.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/ticket-login';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-white font-bold">Loading Your Ticket...</div>
            </div>
        );
    }

    if (!ticket) {
        return (
             <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6">
                <h2 className="text-2xl font-bold mb-4">No Ticket Found</h2>
                <p className="text-gray-500 mb-8">We couldn't find a concert ticket associated with your account.</p>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-tr from-[#0a0a0a] to-[#1a1a1a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] z-0"></div>
            
            <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full"></div>

            <div className="relative z-10 w-full max-w-md bg-white/[0.03] border border-white/10 rounded-[3rem] backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="p-8 md:p-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
                                Celebrity Night Pass
                            </h1>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em]">
                                GOLD VIP Lounge
                            </span>
                        </div>
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
                            <Music size={24} />
                        </div>
                    </div>

                    <div className="my-10 h-px bg-white/10"></div>

                    <div className="space-y-6 text-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-white/5 flex items-center justify-center">
                                <User size={18} className="text-gray-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs uppercase tracking-wider">Attendee</p>
                                <p className="font-bold text-base">{user.name || "Attendee"}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-4">
                             <div className="w-10 h-10 flex-shrink-0 rounded-full bg-white/5 flex items-center justify-center">
                                 <Ticket size={18} className="text-gray-400" />
                             </div>
                             <div>
                                 <p className="text-gray-400 text-xs uppercase tracking-wider">Ticket ID</p>
                                 <p className="font-bold text-base font-mono tracking-widest">{ticket.ticketId}</p>
                             </div>
                         </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-white/5 flex items-center justify-center">
                                <Calendar size={18} className="text-gray-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs uppercase tracking-wider">Date</p>
                                <p className="font-bold text-base">{new Date(ticket.concert.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-4">
                             <div className="w-10 h-10 flex-shrink-0 rounded-full bg-white/5 flex items-center justify-center">
                                 <MapPin size={18} className="text-gray-400" />
                             </div>
                             <div>
                                 <p className="text-gray-400 text-xs uppercase tracking-wider">Venue</p>
                                 <p className="font-bold text-base">{ticket.concert.venue}</p>
                             </div>
                         </div>
                    </div>
                </div>
                <div className="bg-black/20 px-10 py-4 border-t border-white/5">
                    <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                        Present this screen at the entry gate.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConcertDashboard;