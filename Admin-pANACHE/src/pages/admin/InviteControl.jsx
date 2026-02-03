import { useEffect, useMemo, useState } from "react";
import {
  Ticket,
  Plus,
  Trash2,
  Users,
  Grid,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Hash,
  AlertCircle,
  Copy,
  FileSpreadsheet,
  RefreshCw,
  RotateCw,
  X,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import API from "../../api";

export default function InviteControl() {
  const [events, setEvents] = useState([]);
  const [eventSearch, setEventSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [count, setCount] = useState(5);
  const [codes, setCodes] = useState([]);
  const [expandedCode, setExpandedCode] = useState(null);

  const [codeFilter, setCodeFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  // --- NEW: Custom UI States ---
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
  const [confirmModal, setConfirmModal] = useState(null); // { message, onConfirm }

  /* =====================
       Toast Helper
  ===================== */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Auto dismiss after 3s
  };

  /* =====================
       Load events
  ===================== */
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/admin/events");
      const flat = [];
      Object.values(res?.data || {}).forEach((g) =>
        Object.values(g || {}).forEach((a) => Array.isArray(a) && flat.push(...a))
      );
      setEvents(flat);
    } catch {
      setError("Failed to load events");
    }
  };

  /* =====================
       Load codes
  ===================== */
  useEffect(() => {
    if (selectedEvent?.id) {
      fetchCodes(selectedEvent.id);
      setExpandedCode(null);
    }
  }, [selectedEvent]);

  const fetchCodes = async (eventId) => {
    try {
      const res = await API.get(`/admin/invites/available/${eventId}`);
      setCodes(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCodes([]);
    }
  };

  /* =====================
       Manual Refresh
  ===================== */
  const handleRefresh = async () => {
    if (!selectedEvent) return;
    setRefreshing(true);
    await fetchCodes(selectedEvent.id);
    setTimeout(() => setRefreshing(false), 500);
  };

  /* =====================
       Generate codes
  ===================== */
  const generateCodes = async () => {
    if (!selectedEvent) return setError("Select an event first");
    if (!count || count < 1) return setError("Enter a valid number");

    try {
      setLoading(true);
      setError("");
      await API.post("/admin/invites/generate", {
        eventId: selectedEvent.id,
        count,
      });
      await fetchCodes(selectedEvent.id);
      showToast(`${count} codes generated successfully`, "success");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate codes");
      showToast("Generation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
       Delete code (Updated)
  ===================== */
  const handleDeleteRequest = (code, e) => {
    e.stopPropagation();
    // Open Custom Modal instead of window.confirm
    setConfirmModal({
        message: `Permanently delete invite code ${code}?`,
        onConfirm: async () => {
            try {
                await API.delete(`/admin/invites/${code}`);
                setCodes((prev) => prev.filter((c) => c.code !== code));
                if (expandedCode === code) setExpandedCode(null);
                showToast("Code deleted", "success");
            } catch {
                showToast("Failed to delete code", "error");
            }
            setConfirmModal(null);
        }
    });
  };

  /* =====================
       Sync to Google Sheets (Updated)
  ===================== */
  const handleSheetSync = async () => {
    if (!selectedEvent) return;
    try {
      setSyncing(true);
      await API.post(`/admin/events/${selectedEvent.id}/sync-sheet`);
      showToast(`Synced to "${selectedEvent.name}" sheet`, "success");
    } catch (err) {
      console.error(err);
      showToast("Sync failed. Check permissions.", "error");
    } finally {
      setSyncing(false);
    }
  };

  /* =====================
       Helpers
  ===================== */
  const toggleExpand = (code) => {
    setExpandedCode((prev) => (prev === code ? null : code));
  };

  const copyToClipboard = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard", "success");
  };

  const filteredEvents = useMemo(() => {
    return events.filter((e) =>
      e.name.toLowerCase().includes(eventSearch.toLowerCase())
    );
  }, [events, eventSearch]);

  const filteredCodes = useMemo(() => {
    if (codeFilter === "USED") return codes.filter((c) => c.isUsed);
    if (codeFilter === "UNUSED") return codes.filter((c) => !c.isUsed);
    return codes;
  }, [codes, codeFilter]);

  const usedCount = codes.filter((c) => c.isUsed).length;
  const unusedCount = codes.filter((c) => !c.isUsed).length;

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex flex-col overflow-hidden font-sans selection:bg-red-500/30">
      
      {/* GLOBAL STYLES */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* AMBIENT GLOW */}
      <div className="fixed top-0 left-1/4 w-[800px] h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* HEADER */}
      <header className="flex-none px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md z-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-transparent rounded-xl flex items-center justify-center text-red-500 border border-red-500/10">
            <Ticket size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black italic uppercase tracking-tighter leading-none">
              Invite <span className="text-red-500">Control</span>
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
              Admin Console
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
            {loading ? 'PROCESSING...' : 'SYSTEM ACTIVE'}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        
        {/* SIDEBAR: Event Directory */}
        <aside className="w-80 xl:w-96 flex flex-col border-r border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="p-5 border-b border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Grid size={14} /> Event Directory
            </h3>
            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
              <input
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                placeholder="Find event..."
                className="w-full pl-9 pr-3 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll p-3 space-y-1">
            {filteredEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`group w-full p-3 rounded-xl border text-left transition-all duration-200 relative overflow-hidden
                  ${
                    selectedEvent?.id === event.id
                      ? "bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                      : "bg-transparent border-transparent hover:bg-white/[0.04] text-gray-400 hover:text-gray-200"
                  }`}
              >
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="font-bold text-sm truncate w-56">{event.name}</div>
                        <div className={`text-[10px] uppercase font-medium tracking-wide mt-0.5 ${selectedEvent?.id === event.id ? 'text-red-200' : 'text-gray-600 group-hover:text-gray-500'}`}>
                        {event.category}
                        </div>
                    </div>
                    {selectedEvent?.id === event.id && <ChevronRight size={14} className="animate-in slide-in-from-left-2" />}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* WORKSPACE */}
        <section className="flex-1 flex flex-col min-w-0 bg-white/[0.02]">
          
          {!selectedEvent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-4">
              <div className="w-24 h-24 bg-white/[0.02] rounded-full flex items-center justify-center border border-white/5">
                <Grid size={40} className="opacity-20" />
              </div>
              <p className="text-sm uppercase tracking-widest opacity-50">Select an event to manage invites</p>
            </div>
          ) : (
            <>
              {/* TOP BAR */}
              <div className="flex-none p-6 border-b border-white/5 flex flex-col gap-6">
                
                {/* Title & Actions Row */}
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">{selectedEvent.name}</h1>
                    <div className="flex items-center gap-2 mt-1 text-gray-500">
                        <span className="text-xs font-mono bg-white/5 px-1.5 rounded text-gray-400">ID: {selectedEvent.id}</span>
                    </div>
                  </div>
                  
                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-3">
                    
                    {/* REFRESH BUTTON */}
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-3 rounded-xl border border-white/10 bg-white/[0.05] text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                        title="Refresh List"
                    >
                        <RotateCw size={18} className={refreshing ? "animate-spin" : ""} />
                    </button>

                    {/* SYNC BUTTON */}
                    <button 
                        onClick={handleSheetSync}
                        disabled={syncing}
                        className="group flex items-center gap-2 px-4 py-3 rounded-xl border border-green-500/20 bg-green-500/5 text-green-400 hover:bg-green-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                        title="Sync to Google Sheet"
                    >
                        {syncing ? <RefreshCw size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
                        {syncing ? "Syncing..." : "Sync Sheet"}
                    </button>

                    {/* GENERATOR INPUT */}
                    <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-xl border border-white/10">
                        <input
                        type="number"
                        min="1"
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="w-16 bg-transparent text-center font-mono text-lg outline-none focus:text-red-400 transition-colors"
                        />
                        <button
                        onClick={generateCodes}
                        disabled={loading}
                        className="bg-white text-black px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                        <Plus size={14} strokeWidth={3} />
                        Generate
                        </button>
                    </div>
                  </div>
                </div>

                {/* FILTERS & STATS */}
                <div className="flex items-center justify-between">
                    <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                        {["ALL", "UNUSED", "USED"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setCodeFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all
                            ${
                                codeFilter === f
                                ? "bg-white/10 text-white shadow-sm"
                                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            }`}
                        >
                            {f}
                        </button>
                        ))}
                    </div>
                    <div className="flex gap-4 text-xs font-medium text-gray-500">
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {unusedCount} Available</span>
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {usedCount} Redeemed</span>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg text-sm border border-red-500/20">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}
              </div>

              {/* CODES GRID */}
              <div className="flex-1 overflow-y-auto custom-scroll p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-start">
                  
                  {filteredCodes.map(({ code, isUsed, usedByTeam }) => {
                    const isOpen = expandedCode === code;
                    return (
                        <div
                        key={code}
                        onClick={() => isUsed && toggleExpand(code)}
                        className={`
                            relative p-5 rounded-2xl border transition-all duration-300 h-fit
                            ${isUsed 
                                ? "bg-gradient-to-br from-red-900/10 to-transparent border-red-500/20 cursor-pointer hover:border-red-500/40" 
                                : "bg-white/[0.02] border-white/5 hover:border-green-500/30 hover:bg-green-500/[0.02]"
                            }
                            ${isOpen ? "bg-white/[0.04] ring-1 ring-red-500/40 shadow-xl" : ""}
                        `}
                        >
                        {/* Header Row */}
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1 group/hash">
                                    <Hash size={12} className={isUsed ? "text-red-500/50" : "text-green-500/50"} />
                                    <span 
                                      onClick={(e) => copyToClipboard(code, e)}
                                      className={`font-mono text-xl tracking-wider font-bold hover:opacity-80 active:scale-95 transition-all cursor-copy flex items-center gap-2 ${isUsed ? "text-red-100" : "text-white"}`}
                                      title="Click to copy"
                                    >
                                        {code}
                                        <Copy size={10} className="opacity-0 group-hover/hash:opacity-50" />
                                    </span>
                                </div>
                                <div className={`text-[10px] uppercase font-bold tracking-widest ${isUsed ? "text-red-500" : "text-green-500"}`}>
                                    {isUsed ? "Redeemed" : "Available"}
                                </div>
                            </div>

                            {!isUsed ? (
                            <button
                                onClick={(e) => handleDeleteRequest(code, e)}
                                className="text-white/10 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2 rounded-lg hover:bg-white/5"
                            >
                                <Trash2 size={16} />
                            </button>
                            ) : (
                                <ChevronDown 
                                    size={16} 
                                    className={`text-red-500/40 transition-transform duration-300 -mr-1 ${isOpen ? 'rotate-180 text-red-500' : ''}`} 
                                />
                            )}
                        </div>

                        {/* Collapsible Details */}
                        {isUsed && (
                            <div className={`grid transition-[grid-template-rows,padding,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] mt-4 pt-4 border-t border-red-500/20 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="min-h-0 overflow-hidden">
                                    {usedByTeam ? (
                                        <div className="space-y-3">
                                            <div className="flex flex-col bg-black/20 p-2 rounded-lg border border-white/5">
                                                <span className="text-red-400 text-[10px] uppercase tracking-wider font-bold mb-0.5">Team Name</span>
                                                <span className="text-white font-bold text-sm leading-tight">{usedByTeam.teamName}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-white/[0.02] p-2 rounded-lg">
                                                    <span className="text-gray-500 text-[10px] uppercase block mb-1">College</span>
                                                    <div className="text-gray-300 text-xs truncate" title={usedByTeam.college?.name}>{usedByTeam.college?.name || "N/A"}</div>
                                                </div>
                                                <div className="bg-white/[0.02] p-2 rounded-lg">
                                                    <span className="text-gray-500 text-[10px] uppercase block mb-1">Department</span>
                                                    <div className="text-gray-300 text-xs truncate">{usedByTeam.department?.name || "External"}</div>
                                                </div>
                                            </div>
                                            {/* Payment Status */}
                                            <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded-lg">
                                                <span className="text-gray-500 text-[10px] uppercase">Payment Status</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                                    usedByTeam.paymentStatus === 'PAID' 
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                }`}>
                                                    {usedByTeam.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-2"><span className="text-gray-500 italic text-xs">No team data found</span></div>
                                    )}
                                </div>
                            </div>
                        )}
                        </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>

        {/* --- CUSTOM COMPONENTS --- */}
        
        {/* 1. Custom Toast */}
        {toast && (
            <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-xl shadow-2xl animate-[slideIn_0.3s_ease-out]
                ${toast.type === 'error' 
                    ? 'bg-red-950/80 border-red-500/30 text-red-200' 
                    : 'bg-green-950/80 border-green-500/30 text-green-200'
                }`}
            >
                {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                <span className="font-medium text-sm tracking-wide">{toast.message}</span>
                <button onClick={() => setToast(null)} className="ml-2 opacity-50 hover:opacity-100">
                    <X size={16} />
                </button>
            </div>
        )}

        {/* 2. Custom Confirm Modal */}
        {confirmModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
                <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-red-900/20 transform scale-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <AlertCircle size={20} className="text-red-500" />
                            Confirmation Required
                        </h3>
                        <button onClick={() => setConfirmModal(null)} className="text-gray-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        {confirmModal.message}
                    </p>

                    <div className="flex gap-3 justify-end">
                        <button 
                            onClick={() => setConfirmModal(null)}
                            className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmModal.onConfirm}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-900/20"
                        >
                            Confirm Action
                        </button>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}