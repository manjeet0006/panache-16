import React, { useEffect, useState } from 'react';
import { 
    Ticket, Users, ShieldCheck, LogOut, ArrowLeft, 
    Phone, Hash, Shield, Info, CheckCircle, Clock, 
    XCircle, ArrowRight, UserCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import API from '../api';
import TicketModal from '../components/TicketModal';

const Dashboard = () => {
    // --- 1. STATE MANAGEMENT ---
    const [teams, setTeams] = useState([]);
    const [user] = useState(JSON.parse(localStorage.getItem('panache_user')) || {});
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null); // For the QR Modal
    const [inspectingTeam, setInspectingTeam] = useState(null); // For the Detail View

    // --- 2. DATA FETCHING ---
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // The API instance should have an interceptor to attach the Bearer Token
                const res = await API.get('/user/history');
                setTeams(res.data);
            } catch (err) {
                toast.error("Security session expired. Re-authorizing...");
                handleLogout();
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // --- 3. HANDLERS ---
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const getStatusIcon = (status) => {
        if (status === 'APPROVED') return <CheckCircle className="text-green-500" size={14} />;
        if (status === 'REJECTED') return <XCircle className="text-red-500" size={14} />;
        return <Clock className="text-yellow-500" size={14} />;
    };

    // --- 4. RENDER: LOADING STATE ---
    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
            <p className="text-pink-500 font-black uppercase italic tracking-widest text-xs animate-pulse">
                Syncing Command Center...
            </p>
        </div>
    );

    // --- 5. RENDER: SQUAD INSPECTION VIEW (Drill-down) ---
    if (inspectingTeam) {
        return (
            <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4 md:px-10 animate-in slide-in-from-right duration-500">
                <div className="max-w-4xl mx-auto">
                    <button 
                        onClick={() => setInspectingTeam(null)}
                        className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors uppercase font-black text-[10px] tracking-[0.3em] mb-10"
                    >
                        <ArrowLeft size={16} /> Return to Grid
                    </button>

                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500/10 blur-[120px] pointer-events-none"></div>

                        <header className="mb-12 border-b border-white/5 pb-8">
                            <span className="bg-pink-500 text-[10px] font-black px-4 py-1.5 rounded-lg uppercase italic tracking-tighter mb-4 inline-block">
                                Personnel File
                            </span>
                            <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-2">
                                {inspectingTeam.teamName}
                            </h2>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-sm">
                                Deployment: <span className="text-white">{inspectingTeam.event.name}</span>
                            </p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase text-pink-500 tracking-[0.4em] mb-6 flex items-center gap-2">
                                   <Users size={14} /> Squad Roster
                                </h4>
                                {inspectingTeam.members.map((member, i) => (
                                    <div key={i} className="flex items-center gap-5 p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-pink-500/30 transition-all">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl ${member.isLeader ? 'bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]' : 'bg-white/10 text-gray-400'}`}>
                                            {member.isLeader ? <Shield size={24} /> : i + 1}
                                        </div>
                                        <div>
                                            <p className="font-black uppercase italic text-xl leading-none mb-2">{member.name}</p>
                                            <div className="flex flex-wrap gap-4">
                                                <span className="text-[10px] text-gray-500 flex items-center gap-1.5 font-bold">
                                                    <Phone size={12} className="text-pink-500" /> {member.phone}
                                                </span>
                                                {member.enrollment && (
                                                    <span className="text-[10px] text-gray-500 flex items-center gap-1.5 font-bold">
                                                        <Hash size={12} className="text-pink-500" /> {member.enrollment}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-8">
                                <div className="p-8 bg-black/40 rounded-[2rem] border border-white/5">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Authorization Code</p>
                                    <p className="font-mono text-3xl font-bold text-pink-500 uppercase">{inspectingTeam.ticketCode || 'PENDING'}</p>
                                    <div className="mt-6 pt-6 border-t border-white/5">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Origin</p>
                                        <p className="text-white font-bold uppercase italic">{inspectingTeam.college.name}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedTicket(inspectingTeam)}
                                    className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase italic tracking-tighter text-xl hover:bg-pink-500 hover:text-white transition-all shadow-2xl"
                                >
                                    Launch Digital Pass
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- 6. RENDER: MAIN DASHBOARD VIEW ---
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 md:px-10">
            <div className="max-w-7xl mx-auto">

                {/* HEADER / TOP BAR */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-black italic shadow-lg shadow-pink-500/20">
                            {user.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                                Welcome, <span className="text-pink-500">{user.name || 'Leader'}</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                <ShieldCheck size={12} className="text-pink-500" /> Authorized: {user.code}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest border border-white/10 hover:bg-red-500/10 hover:border-red-500/50 transition-all text-gray-400 hover:text-red-500">
                        <LogOut size={16} /> Terminate Session
                    </button>
                </header>

                {/* STATS OVERVIEW */}
                <div className="grid grid-cols-2  md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Active Squads', val: teams.length, color: 'text-white' },
                        { label: 'Verified', val: teams.filter(t => t.paymentStatus === 'APPROVED').length, color: 'text-green-500' },
                        { label: 'Pending', val: teams.filter(t => t.paymentStatus === 'PENDING').length, color: 'text-yellow-500' },
                        { label: 'Total Players', val: teams.reduce((acc, t) => acc + t.members.length, 0), color: 'text-pink-500' }
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 border flex flex-col items-center border-white/10 p-6 rounded-3xl backdrop-blur-sm">
                            <p className="text-[15px] font-black uppercase text-gray-500 tracking-widest mb-1">{s.label}</p>
                            <p className={`text-3xl font-black italic ${s.color}`}>{s.val}</p>
                        </div>
                    ))}
                </div>

                {/* SQUAD GRID */}
                <div className="grid grid-cols-1 gap-6">
                    {teams.map((team) => (
                        <div 
                            key={team.id} 
                            onClick={() => setInspectingTeam(team)}
                            className="relative group bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-10 hover:border-pink-500/30 transition-all duration-500 cursor-pointer overflow-hidden"
                        >
                            <div className="flex flex-col lg:flex-row gap-10 items-start">
                                
                                {/* Info Section */}
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-pink-500 text-[10px] font-black px-3 py-1 rounded-md uppercase italic tracking-tighter">
                                                {team.event.category}
                                            </span>
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-black uppercase text-gray-400">
                                                {getStatusIcon(team.paymentStatus)} {team.paymentStatus}
                                            </div>
                                        </div>
                                        <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-1 leading-none">{team.teamName}</h3>
                                        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Event: {team.event.name}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {team.members.map((m, idx) => (
                                            <div key={idx} className="bg-black/40 border border-white/5 px-3 py-2 rounded-xl flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${m.isLeader ? 'bg-pink-500' : 'bg-gray-600'}`}></div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{m.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Journey Tracker */}
                                <div className="w-full lg:w-72 bg-black/40 border border-white/5 p-6 rounded-3xl">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Journey Tracking</p>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Registration', done: true },
                                            { label: 'Payment Verified', done: team.paymentStatus === 'APPROVED' },
                                            { label: 'Gate Entry', done: team.entryLogs?.some(l => l.type === 'ENTRY') },
                                        ].map((step, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.done ? 'bg-green-500' : 'bg-white/10 text-gray-600'}`}>
                                                    {step.done && <CheckCircle size={12} className="text-black" />}
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${step.done ? 'text-white' : 'text-gray-600'}`}>{step.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="w-full lg:w-64 flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => setSelectedTicket(team)}
                                        className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase italic tracking-tighter text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <Ticket size={20} /> View Ticket
                                    </button>
                                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Pass Code</p>
                                        <p className="font-mono text-sm font-bold text-pink-500 uppercase">{team.ticketCode || "PROCESSING"}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* EMPTY STATE */}
                {teams.length === 0 && (
                    <div className="py-32 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                        <Info className="mx-auto mb-4 text-gray-700" size={48} />
                        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] italic">No squads deployed to the field.</p>
                        <button onClick={() => window.location.href = '/events'} className="mt-6 text-pink-500 font-black uppercase tracking-tighter border-b-2 border-pink-500 hover:text-white transition-all">Recruit Team Now</button>
                    </div>
                )}
            </div>

            {/* MODAL OVERLAYS */}
            {selectedTicket && (
                <TicketModal
                    team={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;