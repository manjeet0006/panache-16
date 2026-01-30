import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Ticket, Users, CheckCircle, LogOut, ArrowLeft,
    Phone, Hash, Shield, Info, CreditCard, ArrowRight,
    LayoutGrid, Search, Music, Trophy, Calendar, MapPin, 
    Zap, Cpu, School, Sparkles, User
} from 'lucide-react';
import { toast } from 'sonner';
import API from '../api';
import DashboardSkeleton from '@/components/loading/dashboard';
import SuccessScreen from '@/components/SuccessScreen';


const Dashboard = () => {
    const navigate = useNavigate();
    // --- STATE ---
    const [teams, setTeams] = useState([]);
    const [user] = useState(JSON.parse(localStorage.getItem('panache_user') || '{}'));
    const [loading, setLoading] = useState(true);
    const [inspectingTeam, setInspectingTeam] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");

    // --- FETCH DATA ---
    useEffect(() => {
        const userType = localStorage.getItem('panache_user_type');
        if (userType === 'ticket') {
            navigate('/concert-dashboard');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const res = await API.get('/user/history');
                setTeams(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };
        fetchDashboardData();
    }, [navigate]);


    // --- HELPERS ---
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const isInternal = (team) => team?.college?.isInternal || team?.isVgu || false;

    // --- FILTER LOGIC ---
    const filteredTeams = useMemo(() => {
        return teams.filter(team => {
            const matchesSearch = team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                team.event.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === "ALL" || team.event.category === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [teams, searchQuery, activeFilter]);

    if (loading) return <DashboardSkeleton />;

    // --- DETAIL VIEW (INSPECTING) ---
    if (inspectingTeam) {
        // ... (Keep your detail view code here, just wrapping it in the same layout style if desired, 
        // or keep it full screen overlay. For brevity, assuming full screen overlay logic from previous code is fine).
        return (
             <div className="min-h-screen bg-[#050505] text-white pt-12 pb-20 px-6 animate-in slide-in-from-right duration-500">
                {/* ... Paste the Detail View Code from previous response here ... */}
                {/* Add a button to go back: setInspectingTeam(null) */}
                <div className="max-w-6xl mx-auto">
                    <button onClick={() => setInspectingTeam(null)} className="flex items-center gap-2 text-gray-500 hover:text-white mb-8">
                        <ArrowLeft size={16}/> Back to Dashboard
                    </button>
                    {/* Reuse the detail card design you liked */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10">
                        <h2 className="text-4xl font-black uppercase italic">{inspectingTeam.teamName}</h2>
                        {/* ... details ... */}
                    </div>
                </div>
             </div>
        )
    }

    // --- MAIN DASHBOARD LAYOUT ---
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-16 flex flex-col md:flex-row relative overflow-hidden selection:bg-pink-500/30">
            
            {/* Background Atmosphere */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/5 blur-[120px] rounded-full"></div>
            </div>

            {/* 1. SIDEBAR (Desktop) / TOPBAR (Mobile) */}
            <aside className="w-full md:w-72 md:h-screen md:sticky md:top-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/5 p-6 md:p-8 flex flex-row md:flex-col justify-between z-50">
                
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <Sparkles className="text-pink-500" size={24} />
                    <div>
                        <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">Panache</h1>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em]">Dashboard</p>
                    </div>
                </div>

                {/* User Profile (Desktop) */}
                <div className="hidden md:flex flex-col gap-6 mt-12">
                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold text-lg">
                            {user.name?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-sm truncate">{user.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{user.code}</p>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="space-y-2">
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-pink-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-pink-500/20">
                            <Ticket size={16} /> My Tickets
                        </button>
                        <button onClick={() => window.location.href='/events'} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                            <LayoutGrid size={16} /> All Events
                        </button>
                    </nav>
                </div>

                {/* Logout Button */}
                <button 
                    onClick={handleLogout}
                    className="md:mt-auto flex items-center gap-2 text-red-500 hover:text-red-400 font-bold text-[10px] uppercase tracking-widest md:w-full md:px-4 md:py-3 md:bg-red-500/5 md:border md:border-red-500/10 md:rounded-xl transition-all"
                >
                    <LogOut size={16} /> <span className="hidden md:inline">Sign Out</span>
                </button>
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 p-5 md:p-10 md:h-screen md:overflow-y-auto z-10 scroll-smooth">
                
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3  gap-6 mb-10">
                    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
                        <div className="flex justify-between mb-4">
                            <div className="p-3 bg-white/5 rounded-2xl text-white"><LayoutGrid size={20} /></div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Registrations</p>
                        <p className="text-3xl font-black italic">{teams.length}</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
                        <div className="flex justify-between mb-4">
                            <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl"><CheckCircle size={20} /></div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Verified</p>
                        <p className="text-3xl font-black italic">{teams.filter(t => t.paymentStatus === 'APPROVED').length}</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
                        <div className="flex justify-between mb-4">
                            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl"><Users size={20} /></div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Teammates</p>
                        <p className="text-3xl font-black italic">{teams.reduce((acc, t) => acc + (t.members?.length || 0), 0)}</p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-0 z-40 py-2 bg-[#050505]/80 backdrop-blur-xl md:static md:bg-transparent">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-pink-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find your ticket..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold placeholder:text-gray-600 focus:outline-none focus:border-pink-500/50 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {['ALL', 'PANACHE', 'PRATISHTHA', 'PRAGATI'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-5 py-4 rounded-2xl text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === cat ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {filteredTeams.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                            <p className="text-gray-600 font-bold uppercase tracking-[0.2em]">No Events Found</p>
                        </div>
                    ) : (
                        filteredTeams.map((team) => {
                             const internal = isInternal(team);
                             return (
                                <div 
                                    key={team.id}
                                    onClick={() => setInspectingTeam(team)}
                                    className="group bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[2.5rem] hover:bg-white/[0.04] hover:border-pink-500/20 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                                        <div className="text-center md:text-left">
                                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                                 <span className={`text-[8px] font-bold px-2 py-1 rounded bg-white/5 uppercase tracking-widest ${team.paymentStatus === 'APPROVED' ? 'text-green-500' : 'text-yellow-500'}`}>
                                                    {team.paymentStatus}
                                                 </span>
                                                 <span className="text-[8px] font-bold px-2 py-1 rounded bg-pink-500/10 text-pink-500 uppercase tracking-widest border border-pink-500/20">
                                                    {team.event.category}
                                                 </span>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter group-hover:text-pink-500 transition-colors">
                                                {team.teamName}
                                            </h3>
                                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{team.event.name}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {!internal && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setSelectedTicket(team); }}
                                                    className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all shadow-lg"
                                                >
                                                    <Ticket size={20} />
                                                </button>
                                            )}
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 text-gray-400 flex items-center justify-center group-hover:bg-white/10 group-hover:text-white transition-all">
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Hover Glow */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                </div>
                             )
                        })
                    )}
                </div>

            </main>

            {/* Ticket Modal */}
            {selectedTicket && (
                <SuccessScreen 
                    data={selectedTicket}
                    eventName={selectedTicket.event.name}
                    teamName={selectedTicket.teamName}
                    teamSize={selectedTicket.members.length}
                    isVgu={isInternal(selectedTicket)}
                    onHome={() => setSelectedTicket(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;