import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Users, ShieldAlert, Rocket, Calendar,
  ChevronDown, ChevronUp,
  Search, Zap, Sparkles, X,
  IndianRupee, Trophy, Music, Cpu, SlidersHorizontal
} from 'lucide-react';

import API from '../api';
import EventSkeleton from '@/components/loading/eventSkeleton';
import { toast } from 'sonner';

const EventsExplorer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isVgu = searchParams.get('isVgu') === 'true';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState(null);

  // --- FILTER STATES ---
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [priceFilter, setPriceFilter] = useState("ALL");

  const CATEGORIES = [
    { id: 'PANACHE', label: 'Panache', icon: Music },
    { id: 'PRAGATI', label: 'Pragati', icon: Cpu },
    { id: 'PRATISHTHA', label: 'Pratishtha', icon: Trophy }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get(`/register/list-events?isVgu=${isVgu}`);
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
        const serverErrorMessage = err.response?.data?.error;
        toast.error(serverErrorMessage || err.message || "Failed to load events");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [isVgu]);

  const filteredEvents = events.filter(e => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || e.category === selectedCategory;

    let matchesPrice = true;
    if (priceFilter === "FREE") matchesPrice = Number(e.eventPrice) === 0;
    if (priceFilter === "PAID") matchesPrice = Number(e.eventPrice) > 0;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleCategoryClick = (catId) => setSelectedCategory(prev => prev === catId ? "ALL" : catId);
  const handlePriceClick = (type) => setPriceFilter(prev => prev === type ? "ALL" : type);
  const activeFiltersCount = (selectedCategory !== "ALL" ? 1 : 0) + (priceFilter !== "ALL" ? 1 : 0);

  if (loading) return <EventSkeleton />

  return (
    <div className="min-h-screen p-2 bg-[#050505] pt-24 text-white pb-12 relative selection:bg-pink-500/30">

      {/* Background Atmosphere */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Section */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-6 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles size={14} className="text-pink-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Panache Era 2026</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-8 animate-in fade-in zoom-in duration-700 delay-100">
            <div className="text-white">Event</div> <div className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-pink-500 to-purple-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]">Explorer</div>
          </h1>

          {/* --- SEARCH & FILTER BAR --- */}
          <div className="max-w-4xl mx-auto flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            {/* Search Bar */}
            <div className="flex items-center gap-3 w-full max-w-xl mx-auto">
              <div className="relative group flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-pink-500/40 focus:bg-white/[0.08] transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-full transition-colors">
                    <X size={14} className="text-gray-400" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative p-3.5 rounded-2xl border transition-all md:hidden ${showFilters || activeFiltersCount > 0
                  ? "bg-pink-500 border-pink-500 text-white"
                  : "bg-white/[0.05] border-white/10 text-gray-400 hover:text-white"
                  }`}
              >
                <SlidersHorizontal size={20} />
                {activeFiltersCount > 0 && !showFilters && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white text-pink-500 text-[11px] font-black rounded-full flex items-center justify-center border border-pink-500">
                    {activeFiltersCount}
                  </div>
                )}
              </button>
            </div>

            {/* Filter Panel */}
            <div className={`flex-col gap-4 overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'flex max-h-[500px] opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100 md:flex'}`}>
              <div className="p-4 bg-white/[0.03] rounded-3xl border border-white/5 backdrop-blur-sm flex flex-col gap-4">
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => setSelectedCategory("ALL")} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedCategory === "ALL" ? "bg-white text-black border-white" : "bg-transparent text-gray-500 border-transparent hover:bg-white/5"}`}>All</button>
                  <div className="w-px h-8 bg-white/10 mx-2 hidden md:block"></div>
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button key={cat.id} onClick={() => handleCategoryClick(cat.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${isActive ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20" : "bg-white/5 border-white/5 text-gray-400 hover:border-pink-500/30 hover:text-white"}`}>
                        {isActive ? <X size={14} /> : <Icon size={14} />} {cat.label}
                      </button>
                    )
                  })}
                </div>
                <div className="flex justify-center border-t border-white/5 pt-4">
                  <div className="inline-flex gap-2">
                    {["FREE", "PAID"].map((type) => {
                      const isActive = priceFilter === type;
                      return (
                        <button key={type} onClick={() => handlePriceClick(type)} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${isActive ? "bg-white text-black border-white" : "bg-transparent text-gray-500 border-white/10 hover:border-white/30"}`}>
                          {isActive && <X size={12} />} {type} Only
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* GRID SECTION */}
        <div className="grid grid-cols-1 p-3 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full py-20 text-center rounded-[3rem] border border-dashed border-white/10">
              <ShieldAlert size={40} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-sm">No Events Match</p>
              <button onClick={() => { setSearchQuery(""); setSelectedCategory("ALL"); setPriceFilter("ALL"); }} className="mt-4 text-pink-500 text-[12px] font-bold uppercase tracking-widest underline">Reset Filters</button>
            </div>
          ) : (
            filteredEvents.map(event => {
              const prizeAmount = isVgu ? event.vguPrice : event.outsiderPrice;
              const hasPrize = prizeAmount && Number(prizeAmount) > 0;

              return (
                <div
                  key={event.id}
                  className="group relative bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04] hover:border-pink-500/20 shadow-2xl overflow-hidden"
                >

                  {/* --- 🏆 PREMIUM PRIZE TAG (Responsive) --- */}
                  {hasPrize && (
                    // Responsive Positioning: top-4/right-4 on mobile, top-6/right-6 on desktop
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
                      {/* Responsive Padding & Sizing */}
                      <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-yellow-900/40 to-black/60 border border-yellow-500/30 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-[0_0_15px_rgba(234,179,8,0.1)] group-hover:border-yellow-500/60 group-hover:shadow-yellow-500/20 transition-all duration-500">
                        {/* Animated Icon Container */}
                        <div className="relative p-1 md:p-1.5 bg-yellow-500/20 rounded-full overflow-hidden">
                          <div className="absolute inset-0 bg-yellow-400 blur opacity-20 animate-pulse"></div>
                          {/* Responsive Icon Size */}
                          <Trophy className="relative text-yellow-400 drop-shadow-md w-3 h-3 md:w-3.5 md:h-3.5" />
                        </div>

                        {/* Text Data */}
                        <div className="flex flex-col">
                          {/* Responsive Font Size */}
                          <span className="text-[8px] md:text-[9px] font-bold text-yellow-500/70 uppercase tracking-widest leading-tight">Prize Worth</span>
                          <span className="text-sm md:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 italic leading-none drop-shadow-sm">
                            ₹{prizeAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Visual Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col gap-2">
                        <span className={`w-fit text-[12px] font-black uppercase tracking-widest px-3 py-1 rounded shadow-lg italic ${event.category === 'PANACHE' ? 'bg-purple-500 shadow-purple-500/20' :
                          event.category === 'PRAGATI' ? 'bg-cyan-500 shadow-cyan-500/20' :
                            'bg-pink-500 shadow-pink-500/20'
                          }`}>
                          {event.category}
                        </span>
                        <div className="flex items-center gap-2 text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                          <Calendar size={12} className="text-pink-500" />
                          {event.dateLabel || "TBA"}
                        </div>
                      </div>
                      {!event.allowOutside && (
                        <div className="flex items-center gap-1.5 bg-red-500/10 px-3 py-1 rounded text-[10px] font-black text-red-500 border border-red-500/10">
                          <Zap size={10} fill="currentColor" /> VGU
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div className="h-[4.5rem] mb-2 flex items-center pr-4">
                      <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-[0.9] group-hover:text-pink-500 transition-colors line-clamp-2">
                        {event.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <div className="h-[4.5rem] mb-4">
                      <p className="text-gray-500 text-[13px] font-medium leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    </div>

                    {/* Rulebook Toggle */}
                    <div className="mb-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedEvent(expandedEvent === event.id ? null : event.id)
                        }}
                        className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-pink-500/80 hover:text-pink-500 transition-all cursor-pointer relative z-20"
                      >
                        {expandedEvent === event.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {expandedEvent === event.id ? "Close Rules" : "Read Rulebook"}
                      </button>

                      {expandedEvent === event.id && (
                        <div className="mt-4 p-5 bg-black/40 rounded-2xl border border-white/5 animate-in slide-in-from-top duration-300">
                          <div className="space-y-3">
                            {event.guidelines?.map((rule, idx) => (
                              <div key={idx} className="flex gap-3">
                                <div className="w-1 h-1 rounded-full bg-pink-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(236,72,153,1)]"></div>
                                <p className="text-[12px] text-gray-400 font-light leading-normal italic">{rule}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* --- FOOTER: 2 COLUMNS (Players | Entry) --- */}
                  <div className="relative z-10 pt-4 border-t border-white/5 flex flex-col gap-6">

                    <div className="flex justify-around items-center gap-2">

                      {/* 1. PLAYERS (LEFT) */}
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Users size={14} className="text-pink-500/50" />
                          <span className="text-[13px] font-bold uppercase tracking-wider text-gray-500">Players</span>
                        </div>
                        <span className="text-[15px] mx-auto font-black uppercase tracking-widest text-white">
                          {event.minPlayers === event.maxPlayers
                            ? event.minPlayers
                            : `${event.minPlayers}-${event.maxPlayers}`
                          }
                        </span>
                      </div>

                      {/* 2. ENTRY FEE (RIGHT) */}
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <IndianRupee size={14} className="text-pink-500/50" />
                          <span className="text-[12px] font-bold uppercase tracking-wider text-gray-500">Entry</span>
                        </div>
                        {event.eventPrice > 0 && !isVgu ? (
                          <span className="text-[17px] mx-auto font-black uppercase tracking-widest text-white">
                            ₹{event.eventPrice}
                          </span>
                        ) : (
                          <span className="text-[15px] font-black uppercase tracking-widest text-green-500">FREE</span>
                        )}
                      </div>

                    </div>

                    <button
                      onClick={() => navigate(`/register/${event.id}?isVgu=${isVgu}`)}
                      className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase text-[18px] tracking-[0.2em] transition-all hover:bg-pink-500 hover:text-white shadow-xl active:scale-[0.98] group-hover:shadow-pink-500/10"
                    >
                      Start Registration
                    </button>
                  </div>

                  <Rocket className="absolute -bottom-10 -right-10 w-32 h-32 text-white/[0.02] -rotate-12 group-hover:scale-110 group-hover:text-pink-500/[0.03] transition-all duration-700 pointer-events-none" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsExplorer;