import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Ticket, Users, CheckCircle, LogOut, ArrowLeft,
    Phone, Hash, Shield, Info, CreditCard, ArrowRight,
    LayoutGrid, Search, MapPin,
    Sparkles, User, Mail, GraduationCap, X, Eye, Music
} from 'lucide-react';
import API from '../api';
import DashboardSkeleton from '@/components/loading/dashboard';
import SuccessScreen from '@/components/SuccessScreen';
import TicketModal from '@/components/TicketModal'; // Ensure this path is correct

const Dashboard = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [teams, setTeams] = useState([]);
    const [user] = useState(JSON.parse(localStorage.getItem('panache_user') || '{}'));
    const [loading, setLoading] = useState(true);

    // View State: 'DASHBOARD' or 'CELEBRITY_FINDER'
    const [activeView, setActiveView] = useState('DASHBOARD');

    // Standard Team/Event States
    const [inspectingTeam, setInspectingTeam] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null); // For Standard Events
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");

    // Celebrity Ticket States
    const [celebrityEmail, setCelebrityEmail] = useState('');
    const [celebrityPhone, setCelebrityPhone] = useState('');
    const [celebrityTicket, setCelebrityTicket] = useState([]); // Array of tickets found
    const [celebrityLoading, setCelebrityLoading] = useState(false);
    const [celebrityError, setCelebrityError] = useState(null);
    const [selectedCelebrityTicket, setSelectedCelebrityTicket] = useState(null);

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

    const handleCelebrityTicketSearch = async (e) => {
        e.preventDefault(); // Prevent form reload
        setCelebrityLoading(true);
        setCelebrityError(null);
        setCelebrityTicket([]);
        try {
            const res = await API.post('/concert/find-ticket', {
                email: celebrityEmail,
                phone: celebrityPhone,
            });

            if (res.data.length === 0) {
                setCelebrityError('No tickets found for this email and phone number.');
            } else {
                setCelebrityTicket(res.data);
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setCelebrityError('No tickets found matching these details.');
            } else {
                setCelebrityError('An error occurred while searching. Please try again.');
            }
            console.error("Fetch Error:", err);
        } finally {
            setCelebrityLoading(false);
        }
    };

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

    // --- 🔍 DETAIL VIEW (INSPECTING TEAM) ---
    if (inspectingTeam) {
        return (
            <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 animate-in slide-in-from-bottom-10 duration-500 z-[100] relative">
                {/* ... (Keep Detail View Code exactly as is) ... */}
                {/* Background Glow */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/10 blur-[150px] rounded-full"></div>
                </div>

                <div className="max-w-5xl mx-auto relative z-10">

                    {/* Header / Nav */}
                    <div className="flex flex-row items-center justify-between mt-20 md:mt-13 mb-8 w-full">
                        <button
                            onClick={() => setInspectingTeam(null)}
                            className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                        >
                            <div className="p-2 rounded-full border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                                <ArrowLeft size={18} />
                            </div>
                            <span className="text-xs md:text-sm font-bold uppercase tracking-widest">
                                Back <span className="hidden sm:inline">to Dashboard</span>
                            </span>
                        </button>

                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                            ID: {inspectingTeam.id?.slice(-6)}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Col: Event Info */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Hero Card */}
                            <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-20"><Sparkles size={100} /></div>

                                <span className="inline-block px-3 py-1 rounded bg-pink-500 text-white text-[10px] font-bold uppercase tracking-widest mb-4">
                                    {inspectingTeam.event.category}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-2">
                                    {inspectingTeam.teamName}
                                </h1>
                                <p className="text-xl text-gray-400 font-medium">{inspectingTeam.event.name}</p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/30 border border-white/10">
                                        <div className={`w-2 h-2 rounded-full ${inspectingTeam.paymentStatus === 'APPROVED' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        <span className="text-xs font-bold uppercase tracking-wide">{inspectingTeam.paymentStatus}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/30 border border-white/10">
                                        <Users size={14} className="text-purple-400" />
                                        <span className="text-xs font-bold uppercase tracking-wide">{inspectingTeam.members?.length || 0} Members</span>
                                    </div>
                                </div>
                            </div>

                            {/* 👥 TEAM MEMBERS SECTION */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
                                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                                    <Users className="text-pink-500" size={20} /> Team Roster
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {inspectingTeam.members?.map((member, idx) => (
                                        <div key={idx} className="group p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-pink-500/30 transition-all">
                                            <div className="flex items-start gap-4">
                                                {/* Number Badge */}
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/10 text-sm font-bold shrink-0">
                                                    {idx + 1}
                                                </div>

                                                <div className="overflow-hidden min-w-0">
                                                    {/* Name */}
                                                    <h4 className="font-bold text-white group-hover:text-pink-400 transition-colors truncate">
                                                        {member.name}
                                                    </h4>

                                                    {/* Phone Number */}
                                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                        <Phone size={10} className="text-pink-500/70 shrink-0" />
                                                        <span className="truncate font-mono">{member.phone}</span>
                                                    </div>

                                                    {/* Enrollment Number (Only if available) */}
                                                    {member.enrollment && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                            <CreditCard size={10} className="text-cyan-500/70 shrink-0" />
                                                            <span className="truncate font-mono uppercase">{member.enrollment}</span>
                                                        </div>
                                                    )}

                                                    {/* Team Lead Badge */}
                                                    {(member.isLeader || idx === 0) && (
                                                        <span className="inline-block mt-2 text-[9px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded uppercase tracking-widest border border-purple-500/20">
                                                            Team Lead
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Right Col: Meta Info */}
                        <div className="space-y-6">
                            {/* Contact Card */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Lead Contact</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-lg"><Phone size={16} /></div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 uppercase">Mobile</p>
                                            <p className="font-mono text-sm">{inspectingTeam.members?.[0]?.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-lg"><GraduationCap size={16} /></div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 uppercase">College</p>
                                            <p className="text-sm font-bold">{isInternal(inspectingTeam) ? "VGU Campus" : inspectingTeam.college?.name || "External"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Payment Details</h3>
                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Method</span>
                                        <span className="font-bold">UPI / Online</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm gap-4">
                                        <span className="text-gray-500 shrink-0">Transaction ID</span>
                                        <span className="font-mono text-xs text-right truncate text-gray-300">
                                            {/* Fix: Show just 'VGU_INTERNAL' for campus students, otherwise show full ID */}
                                            {isInternal(inspectingTeam) ? "VGU_INTERNAL" : (inspectingTeam.transactionId || "N/A")}
                                        </span>
                                    </div>
                                    <div className="h-px bg-white/10 my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm">Total Paid</span>
                                        <span className="text-xl font-bold text-green-400">
                                            {/* Fix: Show 'FREE' for internal, Price for external */}
                                            {isInternal(inspectingTeam) ? "FREE" : `₹${inspectingTeam.event?.eventPrice || 0}`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {!isInternal(inspectingTeam) && (
                                <button
                                    onClick={() => { setSelectedTicket(inspectingTeam); }}
                                    className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2"
                                >
                                    <Ticket size={18} /> View Ticket
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // --- MAIN DASHBOARD LAYOUT ---
    return (
        <div className="min-h-screen pt-17 bg-[#050505] text-white flex flex-col md:flex-row relative overflow-hidden selection:bg-pink-500/30">

            {/* Background Atmosphere */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/5 blur-[120px] rounded-full"></div>
            </div>

            {/* 1. SIDEBAR (Desktop) / TOPBAR (Mobile) */}
            <aside className="w-full md:w-72 md:h-screen md:sticky md:top-0 bg-[#0a0a0a]/90 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/5 p-6 md:p-8 flex flex-row md:flex-col justify-between z-50 shrink-0">

                {/* Brand */}
                <div className="flex items-center gap-3">
                    <Sparkles className="text-pink-500" size={24} />
                    <div>
                        <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">Panache</h1>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.3em]">Dashboard</p>
                    </div>
                </div>

                {/* User Profile (Desktop) */}
                <div className="hidden md:flex flex-col gap-6 mt-12">
                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold text-lg text-white">
                            {user.name?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-sm truncate text-white">{user.name}</p>
                            <p className="text-[12px] text-gray-500 uppercase tracking-wider">{user.code}</p>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="space-y-2">
                        {/* 1. My Events Button */}
                        <button
                            onClick={() => setActiveView('DASHBOARD')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all text-left ${activeView === 'DASHBOARD' ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <LayoutGrid size={16} /> My Events
                        </button>

                        {/* 2. All Events (External Link) */}
                        <button
                            onClick={() => window.location.href = '/events'}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all text-left"
                        >
                            <Ticket size={16} /> All Events
                        </button>

                        {/* 3. Celebrity Ticket Button */}
                        <button
                            onClick={() => setActiveView('CELEBRITY_FINDER')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all text-left ${activeView === 'CELEBRITY_FINDER' ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Search size={16} /> Find Celebrity Ticket
                        </button>
                    </nav>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="md:mt-auto mb-12 flex items-center gap-2 text-red-500 hover:text-red-400 font-bold text-[12px] uppercase tracking-widest md:w-full md:px-4 md:py-3 md:bg-red-500/5 md:border md:border-red-500/10 md:rounded-xl transition-all"
                >
                    <LogOut size={18} /> <span className="hidden md:inline">Sign Out</span>
                </button>
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 p-4 md:p-10 md:h-screen md:overflow-y-auto z-10 scroll-smooth">

                {/* --- VIEW A: STANDARD DASHBOARD --- */}
                {activeView === 'DASHBOARD' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-10">
                            <div className="bg-white/[0.02] border border-white/5 p-4 md:p-6 rounded-[2rem]">
                                <div className="flex justify-between mb-4">
                                    <div className="p-2 md:p-3 bg-white/5 rounded-2xl text-white"><LayoutGrid size={20} /></div>
                                </div>
                                <p className="text-[12px] md:text-[14px] font-bold text-gray-500 uppercase tracking-[0.2em]">Registrations</p>
                                <p className="text-2xl md:text-3xl font-black italic">{teams.length}</p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-4 md:p-6 rounded-[2rem]">
                                <div className="flex justify-between mb-4">
                                    <div className="p-2 md:p-3 bg-green-500/10 text-green-500 rounded-2xl"><CheckCircle size={20} /></div>
                                </div>
                                <p className="text-[12px] md:text-[14px] font-bold text-gray-500 uppercase tracking-[0.2em]">Verified</p>
                                <p className="text-2xl md:text-3xl font-black italic">{teams.filter(t => t.paymentStatus === 'APPROVED').length}</p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-4 md:p-6 rounded-[2rem] col-span-2 md:col-span-1">
                                <div className="flex justify-between mb-4">
                                    <div className="p-2 md:p-3 bg-purple-500/10 text-purple-500 rounded-2xl"><Users size={20} /></div>
                                </div>
                                <p className="text-[12px] md:text-[14px] font-bold text-gray-500 uppercase tracking-[0.2em]">Teammates</p>
                                <p className="text-2xl md:text-3xl font-black italic">{teams.reduce((acc, t) => acc + (t.members?.length || 0), 0)}</p>
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
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-6 text-sm font-bold placeholder:text-gray-600 focus:outline-none focus:border-pink-500/50 transition-all text-white"
                                />
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                                {['ALL', 'PANACHE', 'PRATISTHA', 'PRAGATI'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveFilter(cat)}
                                        className={`px-4 py-3 md:px-5 md:py-4 rounded-2xl text-[12px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === cat ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Team Grid */}
                        <div className="grid grid-cols-1 gap-4 pb-20 md:pb-0">
                            {filteredTeams.length === 0 ? (
                                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                                    <p className="text-gray-600 font-bold uppercase tracking-[0.2em]">No Events Found</p>
                                </div>
                            ) : (
                                filteredTeams.map((team) => {
                                    const internal = isInternal(team);
                                    const isTicketSelected = selectedTicket?.id === team.id;
                                    return (
                                        <div
                                            key={team.id}
                                            onClick={() => setInspectingTeam(team)}
                                            className="group bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[2.5rem] hover:bg-white/[0.04] hover:border-pink-500/20 transition-all cursor-pointer relative overflow-hidden"
                                        >
                                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                                                <div className="text-center md:text-left">
                                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded bg-white/5 uppercase tracking-widest ${team.paymentStatus === 'APPROVED' ? 'text-green-500' : 'text-yellow-500'}`}>
                                                            {team.paymentStatus}
                                                        </span>
                                                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-pink-500/10 text-pink-500 uppercase tracking-widest border border-pink-500/20">
                                                            {team.event.category}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter group-hover:text-pink-500 transition-colors text-white">
                                                        {team.teamName}
                                                    </h3>
                                                    <p className="text-gray-500 text-[12px] font-bold uppercase tracking-[0.2em] mt-1">{team.event.name}</p>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {!internal && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedTicket(prev => prev?.id === team.id ? null : team);
                                                            }}
                                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${isTicketSelected ? 'bg-zinc-100 text-black' : 'bg-white text-black hover:bg-pink-500 hover:text-white'}`}
                                                        >
                                                            {isTicketSelected ? <X size={20} /> : <Ticket size={20} />}
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
                    </div>
                )}

                {/* --- VIEW B: CELEBRITY TICKET FINDER --- */}
                {activeView === 'CELEBRITY_FINDER' && (
                    <div className="max-w-3xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-6">
                                <Search size={32} className="text-purple-500" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">
                                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Concert Ticket?</span>
                            </h2>
                            <p className="text-gray-400 max-w-lg mx-auto text-sm">
                                Enter the email and phone number you used during the booking process to retrieve your celebrity night passes.
                            </p>
                        </div>

                        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                            <form onSubmit={handleCelebrityTicketSearch} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Registered Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                                            <input
                                                type="email"
                                                placeholder="john@example.com"
                                                value={celebrityEmail}
                                                onChange={(e) => setCelebrityEmail(e.target.value)}
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-purple-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Phone Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                                            <input
                                                type="text"
                                                placeholder="9876543210"
                                                value={celebrityPhone}
                                                onChange={(e) => setCelebrityPhone(e.target.value)}
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-purple-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={celebrityLoading}
                                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-black uppercase tracking-[0.2em] text-white hover:opacity-90 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {celebrityLoading ? 'Searching Database...' : 'Retrieve Tickets'}
                                </button>
                            </form>

                            {/* Error Message */}
                            {celebrityError && (
                                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                                    <p className="text-red-400 text-sm font-bold uppercase tracking-wide">{celebrityError}</p>
                                </div>
                            )}

                            {/* Results Grid */}
                            {celebrityTicket.length > 0 && (
                                <div className="mt-10 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-px bg-white/10 flex-1"></div>
                                        <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Tickets Found</span>
                                        <div className="h-px bg-white/10 flex-1"></div>
                                    </div>

                                    {celebrityTicket.map((ticket, i) => (
                                        <div key={ticket.id} className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 transition-all">

                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                                                    <Music size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">{ticket.concert?.artistName || 'Concert Ticket'}</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs font-mono text-gray-500 uppercase">{ticket.tier || 'GENERAL'}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                                        <span className="text-xs font-mono text-gray-500">{ticket.concert?.dayLabel || new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
                                                <div className="text-right hidden md:block">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Ticket ID</p>
                                                    <p className="font-mono text-sm text-gray-300">{ticket.arenaCode}</p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedCelebrityTicket(ticket)}
                                                    className="w-full md:w-auto px-6 py-3 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-purple-500 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    <Eye size={14} /> View Ticket
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </main>

            {/* --- REGULAR EVENT TICKET MODAL --- */}
            {selectedTicket && (
                <SuccessScreen
                    data={selectedTicket}
                    eventName={selectedTicket.event?.name}
                    teamName={selectedTicket.teamName}
                    teamSize={selectedTicket.members?.length || 0}
                    isVgu={isInternal(selectedTicket)}
                    onHome={() => setSelectedTicket(null)}
                    dateLabel={selectedTicket.event?.dateLabel}
                    eventDate={selectedTicket.event?.eventDate}
                />
            )}

            {/* --- CELEBRITY TICKET MODAL --- */}
            {selectedCelebrityTicket && (
                <TicketModal
                    ticket={selectedCelebrityTicket}
                    type="CONCERT"
                    onClose={() => setSelectedCelebrityTicket(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;