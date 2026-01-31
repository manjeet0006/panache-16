import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { 
    motion, 
    AnimatePresence, 
    useMotionValue, 
    useTransform, 
    useSpring 
} from 'framer-motion';
import { 
    Trophy, Medal, Crown, Building2, BookOpen, AlertCircle, Loader2, 
    Sparkles, TrendingUp, TrendingDown, Search, Filter, X, 
    Activity, Zap, BarChart3, Share2, ChevronRight, Globe,
    Monitor, Hash, Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import API from '../api';

// --- CONFIGURATION & UTILS ---
const CONFETTI_COLORS = ['#ec4899', '#a855f7', '#06b6d4', '#fbbf24'];

const playHoverSfx = () => {
    // In a real app, use a robust sound hook. 
    // const audio = new Audio('/sfx/hover.mp3'); audio.volume = 0.1; audio.play().catch(() => {});
};

// Simulated Chart Data Generator
const generateChartData = () => Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));

// --- SUB-COMPONENT: 3D TILT CARD ---
const TiltCard = ({ children, className, onClick }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;
        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`relative transition-all duration-200 ease-out ${className}`}
        >
            {children}
        </motion.div>
    );
};

// --- SUB-COMPONENT: TEAM DETAIL MODAL ---
const TeamDetailModal = ({ team, onClose }) => {
    if (!team) return null;

    const chartData = useMemo(() => generateChartData(), [team]);
    const maxVal = Math.max(...chartData);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
                layoutId={`card-${team.id}`}
                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-[101]"
            >
                {/* Header Background */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-cyan-600/20 blur-xl" />
                
                <div className="relative p-8">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-3xl font-black shadow-inner">
                            {team.teamName.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest">
                                    Rank #{team.rank}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                    <TrendingUp size={10} /> Trending
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white mb-2">
                                {team.teamName}
                            </h2>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                {team.deptName && (
                                    <div className="flex items-center gap-1.5"><BookOpen size={14} className="text-cyan-400"/> {team.deptName}</div>
                                )}
                                {team.collegeName && (
                                    <div className="flex items-center gap-1.5"><Building2 size={14} className="text-purple-400"/> {team.collegeName}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Score</p>
                            <p className="text-2xl font-black text-white">{team.score}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Win Rate</p>
                            <p className="text-2xl font-black text-green-400">92%</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Events</p>
                            <p className="text-2xl font-black text-cyan-400">4</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-2xl font-black text-purple-400">Elite</p>
                        </div>
                    </div>

                    {/* Performance Graph (Simulated) */}
                    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <Activity size={16} className="text-pink-500"/> Performance History
                             </h3>
                        </div>
                        
                        <div className="flex items-end justify-between h-32 gap-2">
                            {chartData.map((val, i) => (
                                <div key={i} className="w-full bg-white/5 rounded-t-sm relative group">
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(val / maxVal) * 100}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-600 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                                        {val}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button className="flex-1 py-3 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors">
                            View Full Profile
                        </button>
                        <button className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">
                            <Share2 size={18} />
                        </button>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

// --- SUB-COMPONENT: REAL-TIME TICKER ---
const NewsTicker = ({ scores }) => {
    if(!scores.length) return null;
    return (
        <div className="fixed bottom-0 left-0 right-0 h-10 bg-black/90 border-t border-white/10 z-50 flex items-center overflow-hidden">
            <div className="flex items-center px-4 bg-pink-600 h-full z-10 font-bold text-[10px] uppercase tracking-widest text-white shadow-lg">
                <Zap size={12} className="mr-2 animate-pulse" /> Live Feed
            </div>
            <div className="flex-1 overflow-hidden relative">
                <motion.div 
                    animate={{ x: ["0%", "-100%"] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    className="flex items-center gap-12 whitespace-nowrap absolute top-1/2 -translate-y-1/2 left-0"
                >
                    {[...scores, ...scores].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-mono text-gray-400">
                            <span className="text-white font-bold">{item.teamName}</span>
                            <span className="text-green-500">+{Math.floor(Math.random() * 50)} pts</span>
                            <span className="text-gray-600">|</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const ScoreBoard = () => {
    const [scores, setScores] = useState([]);
    const [filteredScores, setFilteredScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [prevTopTeam, setPrevTopTeam] = useState(null);

    // --- FETCH DATA ---
    const fetchScores = useCallback(async () => {
        try {
            const res = await API.get('/judge/score'); // Ensure route is correct
            const data = Array.isArray(res.data) ? res.data : [];

            const sortedData = data.sort((a, b) => {
                const scoreA = parseFloat(a.score) || 0;
                const scoreB = parseFloat(b.score) || 0;
                return scoreB - scoreA;
            });

            // Add Rank and Trend Logic
            const processedData = sortedData.map((item, idx) => ({
                ...item,
                rank: idx + 1,
                trend: Math.random() > 0.5 ? 'up' : 'stable' // Simulated trend
            }));

            // Confetti Trigger Check
            if (processedData.length > 0) {
                const currentTop = processedData[0].id;
                if (prevTopTeam && prevTopTeam !== currentTop) {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.3 },
                        colors: CONFETTI_COLORS
                    });
                }
                setPrevTopTeam(currentTop);
            }

            setScores(processedData);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Connection lost. Retrying...");
        } finally {
            setLoading(false);
        }
    }, [prevTopTeam]);

    useEffect(() => {
        fetchScores();
        const interval = setInterval(fetchScores, 15000);
        return () => clearInterval(interval);
    }, [fetchScores]);

    // --- FILTERING LOGIC ---
    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = scores.filter(item => 
            item.teamName.toLowerCase().includes(lowerSearch) ||
            item.deptName?.toLowerCase().includes(lowerSearch) ||
            item.collegeName?.toLowerCase().includes(lowerSearch)
        );
        setFilteredScores(filtered);
    }, [searchTerm, scores]);

    // --- RENDER HELPERS ---
    const getRankBadge = (index) => {
        const badges = [
            <Trophy size={20} className="text-black" fill="black" />,
            <Medal size={18} className="text-black" />,
            <Medal size={16} className="text-black" />
        ];
        const colors = ["bg-yellow-500", "bg-gray-300", "bg-orange-500"];
        
        if (index < 3) {
            return (
                <div className={`relative w-10 h-10 rounded-xl ${colors[index]} flex items-center justify-center shadow-lg shadow-${colors[index]}/50`}>
                    <div className="absolute inset-0 bg-white/30 rounded-xl blur-sm animate-pulse" />
                    <div className="relative z-10">{badges[index]}</div>
                </div>
            );
        }
        return <span className="text-xl font-black text-gray-600 font-mono tracking-tighter">#{index + 1}</span>;
    };

    const getRowStyle = (index) => {
        const base = "relative group grid grid-cols-12 gap-4 items-center p-4 md:p-5 rounded-2xl border transition-all duration-300 backdrop-blur-sm cursor-pointer overflow-hidden";
        if (index === 0) return `${base} bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/40 shadow-[0_0_40px_rgba(234,179,8,0.15)] z-30`;
        if (index === 1) return `${base} bg-gradient-to-r from-gray-400/10 to-transparent border-gray-400/30 z-20`;
        if (index === 2) return `${base} bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/30 z-10`;
        return `${base} bg-white/[0.02] border-white/5 hover:bg-white/[0.05]`;
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white pt-28 pb-20 px-4 md:px-8 relative overflow-hidden font-sans selection:bg-pink-500/30">
            
            {/* --- BACKGROUND FX --- */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] animate-[pulse_8s_infinite]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] animate-[pulse_10s_infinite_reverse]" />

            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/5 text-pink-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                        >
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                            </span>
                            Real-Time Intelligence
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]"
                        >
                            Panache <br/> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-gradient-x">Leaderboard</span>
                        </motion.h1>
                    </div>

                    {/* Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full md:w-auto"
                    >
                        <div className="relative group w-full md:w-80">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
                            <div className="relative bg-black rounded-xl flex items-center p-1 border border-white/10">
                                <Search className="ml-3 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search Team or Dept..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-transparent border-none text-sm p-3 focus:outline-none text-white placeholder:text-gray-600 font-bold uppercase tracking-wider"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- STATS OVERVIEW (Optional) --- */}
                {!loading && scores.length > 0 && (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {[
                            { label: "Total Teams", val: scores.length, icon: Hash, color: "text-white" },
                            { label: "Top Score", val: scores[0]?.score, icon: Crown, color: "text-yellow-400" },
                            { label: "Active Depts", val: new Set(scores.map(s => s.deptName)).size, icon: Building2, color: "text-purple-400" },
                            { label: "Updates", val: "Live", icon: Activity, color: "text-green-400" },
                        ].map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center text-center group hover:bg-white/[0.06] transition-colors"
                            >
                                <stat.icon size={20} className={`${stat.color} mb-2 opacity-80 group-hover:scale-110 transition-transform`} />
                                <span className="text-2xl font-black italic tracking-tighter">{stat.val}</span>
                                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500">{stat.label}</span>
                            </motion.div>
                        ))}
                     </div>
                )}

                {/* --- TABLE HEADER --- */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-8 pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5 mb-4">
                    <div className="col-span-1 text-center">Rank</div>
                    <div className="col-span-8 pl-4">Team / Department</div>
                    <div className="col-span-3 text-right pr-4">Performance</div>
                </div>

                {/* --- CONTENT LIST --- */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-pink-500 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 size={24} className="text-pink-500 animate-pulse" />
                            </div>
                        </div>
                        <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em] animate-pulse">Synchronizing Data...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20 text-center backdrop-blur-md">
                        <AlertCircle className="mx-auto text-red-500 mb-4" size={40} />
                        <h3 className="text-xl font-bold text-white mb-2">Transmission Interrupted</h3>
                        <p className="text-red-400/80 text-sm">{error}</p>
                    </div>
                ) : filteredScores.length === 0 ? (
                    <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                        <Search size={48} className="text-white/10 mx-auto mb-4" />
                        <p className="text-gray-600 font-bold uppercase tracking-[0.2em]">No Matches Found</p>
                    </div>
                ) : (
                    <div className="space-y-3 pb-32">
                        <AnimatePresence>
                            {filteredScores.map((item, idx) => (
                                <motion.div
                                    key={item.id || idx}
                                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    onMouseEnter={playHoverSfx}
                                >
                                    <TiltCard 
                                        className={getRowStyle(idx)}
                                        onClick={() => setSelectedTeam({...item, rank: idx + 1})}
                                    >
                                        {/* Rank */}
                                        <div className="col-span-2 md:col-span-1 flex justify-center relative z-10">
                                            {getRankBadge(idx)}
                                        </div>

                                        {/* Team Info */}
                                        <div className="col-span-7 md:col-span-8 flex flex-col justify-center pl-2 md:pl-4 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <h3 className={`text-lg md:text-2xl font-black uppercase italic tracking-tighter truncate ${
                                                    idx === 0 ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600' : 'text-white'
                                                }`}>
                                                    {item.teamName}
                                                </h3>
                                                {/* Hot Streak Indicator */}
                                                {idx < 3 && (
                                                    <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                                                        <Sparkles size={10} className="text-red-500 animate-pulse" />
                                                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-wide">Hot</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-wrap items-center gap-3 mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                {item.deptName && (
                                                    <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-wide">
                                                        <BookOpen size={10} className="text-cyan-400" />
                                                        {item.deptName}
                                                    </div>
                                                )}
                                                {item.collegeName && (
                                                    // ✅ MODIFIED: Changed from "hidden md:flex" to "flex" to show on mobile
                                                    <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                                                        <Building2 size={10} />
                                                        {item.collegeName}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Score */}
                                        <div className="col-span-3 text-right pr-2 md:pr-4 relative z-10">
                                            <div className="flex flex-col items-end">
                                                <span className={`text-2xl md:text-5xl font-black italic tracking-tighter leading-none ${
                                                    idx === 0 ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 'text-white'
                                                }`}>
                                                    {item.score}
                                                </span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {item.trend === 'up' ? (
                                                        <TrendingUp size={12} className="text-green-500" />
                                                    ) : (
                                                        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                                                            <div className="h-full bg-white/30 w-2/3"></div>
                                                        </div>
                                                    )}
                                                    <span className="text-[9px] font-bold uppercase text-gray-600 tracking-[0.2em]">
                                                        PTS
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Background Hover Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/5 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
                                    </TiltCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* --- MODALS & OVERLAYS --- */}
            <AnimatePresence>
                {selectedTeam && (
                    <TeamDetailModal 
                        team={selectedTeam} 
                        onClose={() => setSelectedTeam(null)} 
                    />
                )}
            </AnimatePresence>

            <NewsTicker scores={scores.slice(0, 10)} />
        </div>
    );
};

export default ScoreBoard;