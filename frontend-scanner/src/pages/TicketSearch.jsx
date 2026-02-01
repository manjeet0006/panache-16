import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  ShieldCheck,
  Search,
  ChevronLeft,
  XCircle,
  Ticket,
  Loader,
  Calendar,
  User,
  Clock,
  RefreshCw,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TicketSearch = () => {
  const [scannerId, setScannerId] = useState(null); // 'MAIN_GATE' or 'CELEBRITY_GATE'
  const [ticketTypePrefix, setTicketTypePrefix] = useState(''); // 'PAN-' or 'STAR-'
  const [ticketCodeSuffix, setTicketCodeSuffix] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  // --- 1. UI FIX: Auto-set prefix & CLEAN INPUT based on Gate ---
  useEffect(() => {
    // Clear previous search data when gate changes
    setTicketCodeSuffix('');
    setResult(null);
    setIsSearched(false);

    if (scannerId === 'CELEBRITY_GATE') {
        setTicketTypePrefix('STAR-');
    } else if (scannerId === 'MAIN_GATE') {
        if (ticketTypePrefix !== 'STAR-') setTicketTypePrefix('PAN-');
    }
  }, [scannerId]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const ticketCode = ticketTypePrefix + ticketCodeSuffix;
    if (!ticketCode.trim() || !ticketTypePrefix) {
      toast.warning("Please select a ticket type and enter a code.");
      return;
    }
    setLoading(true);
    setResult(null);
    setIsSearched(true);
    
    try {
      const response = await axios.post(`${API_URL}/scan/search`, { ticketCode });
      setResult(response.data);
      toast.success("Ticket found!");
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An error occurred';
      setResult({ isError: true, error: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAction = async (action, teamId, memberId) => {
    // Optimistic UI update or loading toast
    const toastId = toast.loading("Processing...");
    try {
      let url, body;
      const ticketCode = ticketTypePrefix + ticketCodeSuffix;
      
      if (result.type === 'event') {
        url = `${API_URL}/scan/event/${action}`;
        body = { teamId, memberId, scannerId: scannerId };
      } else { // concert
        url = `${API_URL}/scan/concert/entry`;
        body = { concertTicketId: result.details.id, scannerId: scannerId };
      }
      
      await axios.post(url, body);
      toast.dismiss(toastId);
      
      if(action === 'entry') toast.success("Marked Entered ✅");
      else toast.success("Marked Exited 📤");
      
      // Refresh data to show updated state
      const refreshResponse = await axios.post(`${API_URL}/scan/search`, { ticketCode });
      setResult(refreshResponse.data);

    } catch (err) {
      toast.dismiss(toastId);
      const errorMessage = err.response?.data?.error || 'Failed to update status.';
      toast.error(errorMessage);
    }
  };

  const handleNewSearch = () => {
    setResult(null);
    setIsSearched(false);
    setTicketCodeSuffix('');
  };
  
  
  const checkIsWrongDate = (dateString) => {
      if (!dateString) return true;
      const eventDate = new Date(dateString);
      const today = new Date();
      
      const eventYear = eventDate.getUTCFullYear();
      const eventMonth = eventDate.getUTCMonth();
      const eventDay = eventDate.getUTCDate();

      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth();
      const todayDay = today.getDate();

      return eventYear !== todayYear || eventMonth !== todayMonth || eventDay !== todayDay;
  };

  const gateColor = scannerId === 'MAIN_GATE' ? 'text-blue-500' : 'text-pink-500';

  // --- RENDER: GATE SELECTION SCREEN ---
  if (!scannerId) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center bg-[#050505] p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a,transparent)] opacity-40 pointer-events-none" />
        <div className="text-center z-10 mb-12">
            <div className="w-16 h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                <Search size={32} className="text-yellow-500" />
            </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
            Manual<span className="text-yellow-500">Search</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Select a Gate to Begin</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl z-10 px-4">
          <button onClick={() => setScannerId('MAIN_GATE')} className="flex-1 group relative bg-blue-900/10 border border-blue-500/20 hover:bg-blue-600/20 p-8 rounded-3xl flex items-center gap-6 transition-all active:scale-95">
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20"><Users size={28} /></div>
            <div className="text-left"><h2 className="text-2xl font-black uppercase italic text-white">Main Gate</h2><p className="text-xs font-bold text-blue-300 uppercase tracking-widest">Students & Teams</p></div>
          </button>
          <button onClick={() => setScannerId('CELEBRITY_GATE')} className="flex-1 group relative bg-pink-900/10 border border-pink-500/20 hover:bg-pink-600/20 p-8 rounded-3xl flex items-center gap-6 transition-all active:scale-95">
            <div className="w-14 h-14 bg-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20"><ShieldCheck size={28} /></div>
            <div className="text-left"><h2 className="text-2xl font-black uppercase italic text-white">VIP Gate</h2><p className="text-xs font-bold text-pink-300 uppercase tracking-widest">Celebrity Access</p></div>
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN SEARCH UI ---
  return (
    <div className="h-dvh bg-[#050505] text-white flex flex-col md:flex-row relative overflow-hidden font-sans">
      
      {/* LEFT COLUMN: Search Input */}
      <div className="w-full md:w-1/2 h-auto md:h-full flex flex-col p-4 md:p-6 gap-6 relative z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between shrink-0 px-2">
            <div className="flex items-center gap-4">
                <button onClick={() => setScannerId(null)} className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h2 className="text-sm font-black uppercase italic tracking-tighter leading-none">
                        Manual <span className={gateColor}>Search</span>
                    </h2>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"/> ONLINE
                    </p>
                </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${scannerId === 'MAIN_GATE' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-pink-500/10 border-pink-500/20 text-pink-400'}`}>
                {scannerId === 'MAIN_GATE' ? 'MAIN GATE' : 'VIP GATE'}
            </div>
          </div>

          {/* Search Form Container */}
          <div className="flex-1 flex items-center justify-center relative w-full">
             <div className="relative w-full max-w-sm md:max-w-md aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black flex flex-col items-center justify-center p-8">
                <div className="w-24 h-24 mx-auto bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                    <Search size={48} className="text-yellow-500" />
                </div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none text-center">
                    Find <span className="text-yellow-500">Ticket</span>
                </h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2 mb-8">Enter Code Manually</p>
                
                <div className="w-full flex gap-2 mb-4">
                    {/* UI FIX: Hide Event button at Celebrity Gate */}
                    {scannerId !== 'CELEBRITY_GATE' && (
                        <button onClick={() => setTicketTypePrefix('PAN-')} className={cn('flex-1 py-3 rounded-lg text-xs font-bold uppercase transition-colors', ticketTypePrefix === 'PAN-' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20')}>Event</button>
                    )}
                    <button onClick={() => setTicketTypePrefix('STAR-')} className={cn('flex-1 py-3 rounded-lg text-xs font-bold uppercase transition-colors', ticketTypePrefix === 'STAR-' ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20')}>Concert</button>
                </div>

                <form onSubmit={handleSearch} className="w-full flex flex-col gap-4">
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-yellow-500 transition-all">
                    <span className="px-4 text-gray-500 font-mono uppercase text-lg tracking-widest">{ticketTypePrefix || '??-'}</span>
                    <input
                      type="text"
                      value={ticketCodeSuffix}
                      onChange={(e) => setTicketCodeSuffix(e.target.value.toUpperCase())}
                      placeholder="ABC123"
                      className="flex-1 bg-transparent pr-4 py-3 text-left font-mono uppercase text-lg tracking-widest focus:outline-none"
                    />
                  </div>
                  <button type="submit" className={cn("w-full py-4 bg-yellow-500 text-black rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", loading && "animate-pulse")} disabled={loading || !ticketTypePrefix}>
                    {loading ? <Loader className="animate-spin" size={16}/> : <Search size={16} />}
                    {loading ? 'Searching...' : 'Search Ticket'}
                  </button>
                </form>
             </div>
          </div>
      </div>

      {/* RIGHT COLUMN: Results */}
      <div className={cn(
          "z-20 bg-[#0a0a0a] flex flex-col transition-all duration-300",
          isSearched ? 'fixed inset-0 md:relative md:inset-auto md:w-1/2 md:h-full' : 'hidden md:flex md:relative md:inset-auto md:w-1/2 md:h-full'
      )}>
          <AnimatePresence mode="wait">
            {loading ? (
                 <motion.div key="loader" initial={{ opacity: 0}} animate={{ opacity: 1}} exit={{ opacity: 0 }} className="flex flex-col h-full items-center justify-center">
                    <Loader size={48} className={cn("animate-spin", gateColor)} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white mt-4">Searching...</p>
                 </motion.div>
            ) : result?.isError ? (
                 <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full items-center justify-center p-8 text-center bg-red-950/20">
                    <div className="w-32 h-32 rounded-full flex items-center justify-center mb-8 border-4 bg-red-500 border-red-400 shadow-2xl">
                        <XCircle size={64} className="text-white" />
                    </div>
                    <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-4 text-white">Denied</h2>
                    <div className="bg-white/5 border border-white/10 px-8 py-2 rounded-full mb-8"><p className="text-xs font-bold uppercase tracking-widest text-red-400">{result.error}</p></div>
                    <button onClick={handleNewSearch} className="w-full max-w-sm py-5 bg-white text-black rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-colors">New Search</button>
                </motion.div>
            ) : result && result.type === 'event' ? (
                // --- EVENT TICKET RESULT (LIST VIEW) ---
                (() => {
                    const isWrongDate = checkIsWrongDate(result.details.event.eventDate);

                    if (isWrongDate) {
                        return (
                             <motion.div key="wrong-date-event" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full items-center justify-center p-8 text-center bg-orange-950/20">
                                <div className="w-32 h-32 rounded-full flex items-center justify-center mb-8 border-4 bg-orange-500 border-orange-400 shadow-2xl">
                                    <Clock size={64} className="text-white" />
                                </div>
                                <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-4 text-white">Wrong Date</h2>
                                <p className="text-orange-300 font-bold uppercase tracking-widest mb-8">Valid on: {new Date(result.details.event.eventDate).toLocaleDateString('en-US', { dateStyle: 'full', timeZone: 'UTC' })}</p>
                                <button onClick={handleNewSearch} className="w-full max-w-sm py-5 bg-white text-black rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-colors">New Search</button>
                             </motion.div>
                        )
                    }

                    return (
                        <motion.div key="event-details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                            {/* Header */}
                            <div className="p-6 bg-gradient-to-b from-blue-900/20 to-transparent border-b border-white/10 shrink-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"><Users size={24} className="text-white" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{result.details.event.name}</p>
                                            <h2 className="text-2xl font-black uppercase italic leading-none text-white truncate max-w-[200px] md:max-w-[300px]">{result.details.teamName}</h2>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white">{result.details.members.filter(m => m.entryLogs.some(l => l.type === 'ENTRY')).length} / {result.details.members.length} IN</div>
                                </div>
                            </div>

                            {/* Member List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 md:pb-4">
                              {result.details.members.map((member) => {
                                const isEntered = member.entryLogs.some(l => l.type === 'ENTRY');
                                return (
                                  <div key={member.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                      <div className={cn("w-2 h-2 rounded-full", isEntered ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]")} />
                                      <span className="font-bold uppercase tracking-wider text-sm">{member.name}</span>
                                    </div>
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => handleMarkAction('entry', result.details.id, member.id)} 
                                        disabled={isEntered} 
                                        className="p-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg hover:bg-green-500 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-green-500 transition-all"
                                        title="Mark Entry"
                                      >
                                        <CheckCircle2 size={18} />
                                      </button>
                                      <button 
                                        onClick={() => handleMarkAction('exit', result.details.id, member.id)} 
                                        disabled={!isEntered} 
                                        className="p-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-red-500 transition-all"
                                        title="Mark Exit"
                                      >
                                        <LogOut size={18} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 mt-auto">
                                <button onClick={handleNewSearch} className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-gray-200">
                                <RefreshCw size={16} /> New Search
                                </button>
                            </div>
                        </motion.div>
                    );
                })()
            ) : result && result.type === 'concert' ? (
                // --- CONCERT TICKET RESULT ---
                 (() => {
                    const isWrongDate = checkIsWrongDate(result.details.concert.date);

                    if (isWrongDate) {
                        return (
                             <motion.div key="wrong-date-concert" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full items-center justify-center p-8 text-center bg-orange-950/20">
                                <div className="w-32 h-32 rounded-full flex items-center justify-center mb-8 border-4 bg-orange-500 border-orange-400 shadow-2xl">
                                    <Clock size={64} className="text-white" />
                                </div>
                                <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-4 text-white">Wrong Date</h2>
                                <p className="text-orange-300 font-bold uppercase tracking-widest mb-8">Valid on: {new Date(result.details.concert.date).toLocaleDateString('en-US', { dateStyle: 'full', timeZone: 'UTC' })}</p>
                                <button onClick={handleNewSearch} className="w-full max-w-sm py-5 bg-white text-black rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-colors">New Search</button>
                             </motion.div>
                        )
                    }

                    // Determine Entry Status based on Gate
                    const isAlreadyEntered = 
                        (scannerId === 'MAIN_GATE' && result.details.isEnterMainGate) ||
                        (scannerId === 'CELEBRITY_GATE' && result.details.isEnterArena);
                    
                    return (
                        <motion.div key="concert-details" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={`flex flex-col h-full items-center justify-center p-8 text-center bg-green-950/20`}>
                            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 border-4 bg-green-500 border-green-400 shadow-2xl`}>
                                <Ticket size={64} className="text-white" />
                            </div>
                            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-2 text-white">{result.details.concert.artistName}</h2>
                            <p className="text-lg font-bold uppercase tracking-widest text-green-300 mb-6">{result.details.tier} Tier</p>
                            
                            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-xl mb-8 text-left w-full max-w-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <User size={18} className="text-gray-400"/>
                                <p className="text-lg font-bold text-white">{result.details.guestName}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar size={18} className="text-gray-400"/>
                                <p className="text-sm font-mono text-gray-300">{new Date(result.details.concert.date).toLocaleDateString('en-US', { dateStyle: 'full', timeZone: 'UTC' })}</p>
                            </div>
                            </div>

                            {/* 3. ANIMATED STATUS / BUTTON */}
                            <AnimatePresence mode='wait'>
                              {isAlreadyEntered ? (
                                  <motion.div
                                    key="already-entered"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="px-8 py-3 rounded-full bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400"
                                  >
                                    <p className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                                      <CheckCircle2 size={24} />
                                      Entered
                                    </p>
                                  </motion.div>
                              ) : (
                                <motion.button
                                  key="enter-btn"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleMarkAction('entry')} 
                                  className="w-full max-w-sm py-5 bg-green-500 text-black rounded-xl font-black uppercase tracking-[0.2em] text-sm hover:bg-green-400 transition-colors shadow-xl"
                                >
                                  Mark as Entered
                                </motion.button>
                              )}
                            </AnimatePresence>

                            <button onClick={handleNewSearch} className="absolute bottom-6 text-xs uppercase tracking-widest text-gray-400 hover:text-white">New Search</button>
                        </motion.div>
                    );
                 })()
            ) : (
                <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-12 opacity-30">
                    <Search size={64} className="mb-6" />
                    <h3 className="text-2xl font-black uppercase italic">Search for a Ticket</h3>
                    <p className="text-sm font-bold uppercase tracking-widest mt-2">Enter a ticket code to see details</p>
                </div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
};

export default TicketSearch;