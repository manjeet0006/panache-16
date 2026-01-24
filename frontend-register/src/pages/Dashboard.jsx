import React, { useEffect, useState, useMemo } from 'react';
import {
    Ticket, Users, ShieldCheck, LogOut, ArrowLeft,
    Phone, Hash, Shield, Info, CheckCircle,
    XCircle, UserCircle, School, CreditCard, ArrowRight,
    Star, LayoutGrid, Activity, Search, Filter,
    Music, Trophy, Calendar, MapPin, Download,
    Zap, TrendingUp, UserPlus, Fingerprint
} from 'lucide-react';
import { toast } from 'sonner';
import API from '../api';
import TicketModal from '../components/TicketModal';

// --- SUB-COMPONENT: STAT CARD ---
const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="group bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.04] transition-all duration-500">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
        </div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-3xl font-black italic text-white tracking-tighter">{value}</p>
    </div>
);

const Dashboard = () => {
    // --- STATE MANAGEMENT ---
    const [teams, setTeams] = useState([]);
    const [user] = useState(JSON.parse(localStorage.getItem('panache_user') || '{}'));
    const [loading, setLoading] = useState(true);
    const [inspectingTeam, setInspectingTeam] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");

    // --- DATA INITIALIZATION ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await API.get('/user/history');
                if (Array.isArray(res.data)) {
                    setTeams(res.data);
                } else {
                    setTeams([]);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                toast.error("Session expired. Please login again.");
                handleLogout();
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };
        fetchDashboardData();
    }, []);

    // --- UTILITIES ---
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const isInternal = (team) => {
        return team?.college?.isInternal || team?.isVgu || false;
    };

    // --- SEARCH & FILTER LOGIC ---
    const filteredTeams = useMemo(() => {
        return teams.filter(team => {
            const matchesSearch = team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                team.event.name.toLowerCase().includes(searchQuery.toLowerCase());
            // Updated Categories
            const matchesFilter = activeFilter === "ALL" || team.event.category === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [teams, searchQuery, activeFilter]);

    // --- RENDER: LOADING VIEW ---
    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 border-t-2 border-pink-500 rounded-full animate-spin mb-6"></div>
                <h2 className="text-white font-bold uppercase tracking-[0.3em] text-xs">Loading Your Dashboard</h2>
            </div>
        </div>
    );

    // --- RENDER: DETAIL VIEW ---
    if (inspectingTeam) {
        return (
            <div className="min-h-screen bg-[#050505] text-white pt-28 pb-20 px-6 animate-in slide-in-from-right duration-500">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={() => setInspectingTeam(null)}
                        className="group flex items-center gap-3 text-gray-500 hover:text-pink-500 transition-all uppercase font-bold text-[10px] tracking-widest mb-12"
                    >
                        <div className="p-2 rounded-full border border-white/10 group-hover:border-pink-500/50">
                            <ArrowLeft size={16} />
                        </div>
                        Back to Home
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-8">
                            <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl relative overflow-hidden">
                                <div className="absolute -top-20 -right-20 w-80 h-80 bg-pink-500/5 blur-[100px] pointer-events-none"></div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-10 border-b border-white/5">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="bg-pink-500 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest">
                                                Registered Event
                                            </span>
                                        </div>
                                        <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-4">
                                            {inspectingTeam.teamName}
                                        </h2>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                                <Calendar size={14} className="text-pink-500" /> Feb 12-14, 2026
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                                <MapPin size={14} className="text-pink-500" /> VGU Campus
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 text-center min-w-[140px]">
                                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
                                        <p className={`text-xl font-black italic uppercase ${inspectingTeam.paymentStatus === 'APPROVED' ? 'text-green-500' : 'text-yellow-500'}`}>
                                            {inspectingTeam.paymentStatus}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-8">
                                        <h4 className="text-[11px] font-bold uppercase text-pink-500 tracking-[0.3em] flex items-center gap-3">
                                            <Users size={16} /> Member List
                                        </h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {inspectingTeam.members.map((member, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-pink-500/20 hover:bg-white/[0.04] transition-all group">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all ${member.isLeader ? 'bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'bg-white/5 text-gray-500'}`}>
                                                        {member.isLeader ? <Shield size={24} /> : i + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold uppercase italic text-xl leading-none mb-2 group-hover:text-pink-500 transition-colors">{member.name}</p>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[9px] text-gray-500 flex items-center gap-1.5 font-bold tracking-widest">
                                                                <Phone size={10} className="text-pink-500" /> {member.phone}
                                                            </span>
                                                            {/* Show Enrollment ID for VGU Students */}
                                                            {isInternal(inspectingTeam) && member.enrollment
                                                                && (
                                                                    <span className="text-[9px] text-gray-500 flex items-center gap-1.5 font-bold tracking-widest">
                                                                        <Hash size={10} className="text-pink-500" /> {member.enrollment
                                                                        }
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {member.isLeader && (
                                                    <div className="text-[8px] font-bold uppercase tracking-widest text-pink-500/50 italic border border-pink-500/20 px-2 py-1 rounded">Head</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl sticky top-28">
                                <h4 className="text-[10px] font-bold uppercase text-pink-500 tracking-[0.3em] mb-8 flex items-center gap-2">
                                    <Fingerprint size={16} /> Access Details
                                </h4>

                                {isInternal(inspectingTeam) ? (
                                    <div className="space-y-8">
                                        <div className="w-24 h-24 bg-pink-500/10 rounded-[2rem] flex items-center justify-center mx-auto text-pink-500 border border-pink-500/20">
                                            <CreditCard size={40} />
                                        </div>
                                        <div className="text-center space-y-4">
                                            <h3 className="text-2xl font-bold uppercase italic text-white tracking-tighter">VGU Student Entry</h3>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed tracking-widest px-4">
                                                Entry for VGU students is verified using your **Physical ID Card**.
                                            </p>
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-3 text-left">
                                                <Info size={16} className="text-pink-500 shrink-0" />
                                                <p className="text-[9px] text-gray-400 font-bold uppercase leading-normal">
                                                    You don't need a QR code. Just show your ID at the registration desk.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="p-8 bg-black/60 rounded-[2rem] border border-white/5 text-center group">
                                            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-2">Ticket Code</p>
                                            <p className="font-mono text-3xl font-bold text-pink-500 uppercase tracking-[0.2em] mb-8 group-hover:scale-105 transition-transform">
                                                {inspectingTeam.ticketCode || '---'}
                                            </p>
                                            <button
                                                onClick={() => setSelectedTicket(inspectingTeam)}
                                                className="w-full bg-white text-black py-5 rounded-2xl font-bold uppercase italic tracking-tighter text-lg hover:bg-pink-500 hover:text-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center gap-3"
                                            >
                                                <Ticket size={20} /> View Ticket
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-6 relative overflow-hidden">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none blur-[150px]" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-16 bg-white/[0.03] border border-white/10 p-8 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden">
                    <div className="flex items-center gap-6 z-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-700 rounded-3xl flex items-center justify-center text-4xl font-black italic shadow-2xl relative border border-white/10">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-1">
                                Welcome, <span className="text-pink-500">{user.name || 'Student'}</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                                <ShieldCheck size={14} className="text-pink-500" /> Account Code: {user.code}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-8 md:mt-0">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest border border-red-500/20 bg-red-500/5 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-red-500"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </header>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    <StatCard
                        label="My Registrations"
                        value={teams.length}
                        icon={LayoutGrid}
                        color="text-white"
                    />
                    <StatCard
                        label="Payments Verified"
                        value={teams.filter(t => t.paymentStatus === 'APPROVED').length}
                        icon={CheckCircle}
                        color="text-green-500"
                    />
                    <StatCard
                        label="Total Members"
                        value={teams.reduce((acc, t) => acc + (t.members?.length || 0), 0)}
                        icon={Users}
                        color="text-purple-500"
                    />
                </div>

                {/* FILTERS */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 px-4">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-pink-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold placeholder:text-gray-600 focus:outline-none focus:border-pink-500/50 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                        {['ALL', 'PANACHE', 'PRATISHTHA', 'PRAGATI'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-5 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${activeFilter === cat ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GRID */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        {filteredTeams.map((team) => {
                            const internal = isInternal(team);
                            return (
                                <div
                                    key={team.id}
                                    className="group relative bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 hover:bg-white/[0.04] hover:border-pink-500/30 transition-all duration-500"
                                >
                                    <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                                        <div className="flex-1 space-y-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-[9px] font-bold px-3 py-1 rounded-lg bg-pink-500/10 text-pink-500 uppercase tracking-widest border border-pink-500/20">
                                                        {team.event?.category}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest">
                                                        <div className={`w-2 h-2 rounded-full ${team.paymentStatus === 'APPROVED' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                                                        {team.paymentStatus}
                                                    </div>
                                                </div>
                                                <h3
                                                    onClick={() => setInspectingTeam(team)}
                                                    className="text-4xl font-black uppercase italic tracking-tighter mb-3 cursor-pointer hover:text-pink-500 transition-colors"
                                                >
                                                    {team.teamName}
                                                </h3>
                                                <p className="text-gray-500 font-bold uppercase text-[10px] flex items-center gap-2 tracking-widest">
                                                    Event: {team.event?.name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            {internal ? (
                                                <div className="px-8 py-5 border border-dashed border-white/10 rounded-3xl flex flex-col items-center gap-2 opacity-50">
                                                    <School size={24} className="text-pink-500" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest italic">Use VGU Student ID</span>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedTicket(team);
                                                    }}
                                                    className="w-full md:w-auto bg-white text-black px-10 py-5 rounded-2xl font-bold uppercase italic tracking-tighter text-lg hover:bg-pink-500 hover:text-white transition-all shadow-xl"
                                                >
                                                    View Ticket
                                                </button>
                                            )}

                                            <button
                                                onClick={() => setInspectingTeam(team)}
                                                className="w-full md:w-auto p-5 rounded-2xl bg-white/5 border border-white/5 text-gray-500 hover:text-pink-500 transition-all"
                                            >
                                                <ArrowRight size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* EMPTY */}
                {filteredTeams.length === 0 && (
                    <div className="py-40 text-center bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[4rem]">
                        <p className="text-gray-600 font-bold uppercase tracking-[0.4em] italic text-sm mb-8">
                            No events found here.
                        </p>
                        <button
                            onClick={() => window.location.href = '/events'}
                            className="bg-white text-black px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-pink-500 hover:text-white transition-all"
                        >
                            <UserPlus size={16} className="inline mr-2" /> Register Now
                        </button>
                    </div>
                )}
            </div>

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