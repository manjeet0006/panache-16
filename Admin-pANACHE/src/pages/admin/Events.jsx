import { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Trash2,
  Plus,
  CheckCircle2,
  Search,
  LayoutGrid,
  Users,
  Trophy,
  MoreVertical,
  X,
  ChevronDown,
  Filter,
  Save,
  RefreshCw // Added Icon
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import API from "../../api";

const CATEGORIES = ["PANACHE", "PRAGATI", "PRATISHTHA"];

const emptyForm = {
  name: "",
  description: "",
  category: "PANACHE",
  minPlayers: 1,
  maxPlayers: 1,
  allowOutside: false,
  eventPrice: "0",
  eventDate: "",
  dateLabel: "",
  guidelines: "",
  registrationOpen: true,
};

export default function Events() {
  const [eventData, setEventData] = useState(null);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null); // 'NEW' or Event Object
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  /* ---------------- LOGIC ---------------- */
  const fetchEvents = async () => {
    setLoading(true); // Ensure loading state is active during sync
    try {
      const res = await API.get("/admin/events");
      setEventData(res.data);
    } catch (err) {
      console.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (!eventData) return [];
    const allEvents = [
      ...(eventData.PANACHE?.internal || []),
      ...(eventData.PANACHE?.outside || []),
      ...(eventData.PRAGATI?.internal || []),
      ...(eventData.PRAGATI?.outside || []),
      ...(eventData.PRATISHTHA?.internal || []),
      ...(eventData.PRATISHTHA?.outside || []),
    ];

    return allEvents.filter((e) => {
      const matchesType =
        typeFilter === "ALL"
          ? true
          : typeFilter === "INTERNAL"
          ? !e.allowOutside
          : e.allowOutside;
      const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [eventData, typeFilter, search]);

  /* ---------------- ACTIONS ---------------- */
  const openEditor = (event = null) => {
    if (event) {
      setEditing(event);
      setForm({
        name: event.name,
        description: event.description,
        category: event.category,
        minPlayers: event.minPlayers,
        maxPlayers: event.maxPlayers,
        allowOutside: event.allowOutside,
        eventPrice: event.eventPrice,
        eventDate: event.eventDate ? event.eventDate.slice(0, 16) : "",
        dateLabel: event.dateLabel || "",
        guidelines: event.guidelines?.join(", ") || "",
        registrationOpen: event.registrationOpen,
      });
    } else {
      setEditing("NEW");
      setForm(emptyForm);
    }
  };

  const closeEditor = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        minPlayers: Number(form.minPlayers),
        maxPlayers: Number(form.maxPlayers),
        guidelines: form.guidelines
          ? form.guidelines.split(",").map((g) => g.trim())
          : [],
      };

      if (editing && editing !== "NEW") {
        await API.put(`/admin/events/${editing.id}`, payload);
      } else {
        await API.post("/admin/crevents", payload);
      }

      showSuccess();
      fetchEvents();
      closeEditor();
    } catch (err) {
      alert("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event permanently?")) return;
    await API.delete(`/admin/events/${id}`);
    fetchEvents();
    if (editing?.id === id) closeEditor();
  };

  const showSuccess = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1500);
  };

  /* ---------------- COLORS ---------------- */
  const getCategoryColor = (cat) => {
    switch (cat) {
        case "PANACHE": return "text-purple-400 border-purple-500/30 bg-purple-500/10";
        case "PRAGATI": return "text-blue-400 border-blue-500/30 bg-blue-500/10";
        case "PRATISHTHA": return "text-amber-400 border-amber-500/30 bg-amber-500/10";
        default: return "text-gray-400 border-gray-500/30 bg-gray-500/10";
    }
  };

  return (
    <div className="h-screen w-full bg-[#09090b] text-white overflow-hidden relative font-sans selection:bg-indigo-500/30">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 30, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 size={18} /> Operation Successful
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER & FILTERS */}
      <div className="relative z-10 flex flex-col h-full">
        
        
        {/* Top Bar */}
        <div className="flex-none px-8 py-6 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-black tracking-tighter text-white">
                    Event<span className="text-indigo-500">Grid</span>
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-widest uppercase mt-1">
                    Management Console
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                {/* SYNC BUTTON */}
                <button
                    onClick={fetchEvents}
                    disabled={loading}
                    className="h-10 w-10 flex items-center justify-center bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-white rounded-xl transition-all shadow-sm"
                    title="Sync Data"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin text-indigo-400" : "text-gray-400"} />
                </button>

                {/* CREATE BUTTON */}
                <button
                    onClick={() => openEditor()}
                    className="bg-white text-black hover:bg-indigo-500 hover:text-white transition-all px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg hover:shadow-indigo-500/20"
                >
                    <Plus size={16} strokeWidth={3} /> Create Event
                </button>
            </div>
        </div>

        {/* Filter Bar */}
        <div className="flex-none px-8 pb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-md group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search events..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-600"
                />
            </div>

            <div className="bg-white/[0.03] border border-white/10 p-1 rounded-xl flex">
                {["ALL", "INTERNAL", "OUTSIDE"].map(f => (
                    <button
                        key={f}
                        onClick={() => setTypeFilter(f)}
                        className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                            typeFilter === f 
                            ? "bg-white/10 text-white shadow-sm" 
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
            
            <div className="ml-auto text-xs font-mono text-gray-600">
                {filteredEvents.length} RESULTS
            </div>
        </div>

        {/* MAIN GRID */}
        <div className="flex-1 overflow-y-auto px-8 pb-20 custom-scroll">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map(e => (
                    <motion.div 
                        layoutId={e.id}
                        key={e.id}
                        onClick={() => openEditor(e)}
                        className="group bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.04] rounded-3xl p-6 cursor-pointer transition-all duration-300 relative overflow-hidden"
                    >
                        <div className={`absolute top-6 right-6 w-2 h-2 rounded-full ${e.registrationOpen ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-rose-500"}`} />

                        <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border mb-4 ${getCategoryColor(e.category)}`}>
                            {e.category}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">
                            {e.name}
                        </h3>
                        
                        <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">
                            {e.description || "No description provided."}
                        </p>

                        <div className="flex items-center justify-between text-xs font-medium text-gray-400 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-1.5">
                                <Users size={14} />
                                <span>{e.minPlayers}-{e.maxPlayers}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                <span>{e.eventDate ? new Date(e.eventDate).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : "TBA"}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {filteredEvents.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                    <Filter size={48} className="mb-4 opacity-20" />
                    <p className="text-sm uppercase tracking-widest">No events found</p>
                </div>
            )}
        </div>
      </div>

      {/* FULL SCREEN EDITOR OVERLAY */}
      <AnimatePresence>
        {(editing) && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-full max-w-5xl h-full max-h-[90vh] bg-[#0e0e11] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* MODAL HEADER */}
                    <div className="flex-none p-6 sm:p-8 border-b border-white/10 flex items-center justify-between bg-[#0e0e11]">
                        <div>
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                {editing === "NEW" ? "Create New Event" : `Edit: ${editing.name}`}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${editing === 'NEW' ? 'bg-indigo-500' : 'bg-purple-500'}`} />
                                <p className="text-xs text-gray-500 font-mono">
                                    {editing !== "NEW" ? `ID: ${editing.id}` : "MODE: Creation"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {editing !== "NEW" && (
                                <button 
                                    onClick={() => handleDelete(editing.id)} 
                                    className="px-4 py-2 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            )}
                            <button 
                                onClick={closeEditor} 
                                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-full transition"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* MODAL CONTENT (2-Column Grid) */}
                    <div className="flex-1 overflow-y-auto custom-scroll p-6 sm:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            
                            {/* LEFT COLUMN: Core Info */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-indigo-400 mb-2">
                                        <LayoutGrid size={18} />
                                        <h4 className="text-sm font-bold uppercase tracking-widest">Core Identity</h4>
                                    </div>
                                    <div className="space-y-5">
                                        <Input label="Event Name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="e.g. Hackathon 2026" />
                                        <Select label="Category" value={form.category} onChange={v => setForm({ ...form, category: v })} />
                                        <Textarea label="Short Description" value={form.description} onChange={v => setForm({ ...form, description: v })} height="h-32" />
                                    </div>
                                </div>

                                <div className="space-y-6 pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-amber-400 mb-2">
                                        <Trophy size={18} />
                                        <h4 className="text-sm font-bold uppercase tracking-widest">Rules & Guidelines</h4>
                                    </div>
                                    <Textarea label="Guidelines (Comma Separated)" value={form.guidelines} onChange={v => setForm({ ...form, guidelines: v })} height="h-40" />
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Config & Settings */}
                            <div className="space-y-8">
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
                                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                        <Users size={18} />
                                        <h4 className="text-sm font-bold uppercase tracking-widest">Logistics</h4>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-5">
                                        <Input label="Min Players" type="number" value={form.minPlayers} onChange={v => setForm({ ...form, minPlayers: v })} />
                                        <Input label="Max Players" type="number" value={form.maxPlayers} onChange={v => setForm({ ...form, maxPlayers: v })} />
                                    </div>
                                    
                                    <Input label="Registration Fee (₹)" type="number" value={form.eventPrice} onChange={v => setForm({ ...form, eventPrice: v })} />
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                                        <Input label="Event Date (System)" type="datetime-local" value={form.eventDate} onChange={v => setForm({ ...form, eventDate: v })} />
                                        <Input label="Display Label" value={form.dateLabel} onChange={v => setForm({ ...form, dateLabel: v })} placeholder="e.g. 12th Jan - 10 AM" />
                                    </div>
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
                                    <div className="flex items-center gap-2 text-rose-400 mb-2">
                                        <MoreVertical size={18} />
                                        <h4 className="text-sm font-bold uppercase tracking-widest">Visibility Controls</h4>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <Toggle 
                                            label="Registration Open" 
                                            desc="Users can currently register for this event."
                                            checked={form.registrationOpen} 
                                            onChange={v => setForm({ ...form, registrationOpen: v })} 
                                            activeColor="bg-emerald-500"
                                        />
                                        <div className="h-px w-full bg-white/5" />
                                        <Toggle 
                                            label="Allow Outside Participants" 
                                            desc="Students from other colleges can join."
                                            checked={form.allowOutside} 
                                            onChange={v => setForm({ ...form, allowOutside: v })} 
                                            activeColor="bg-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* MODAL FOOTER */}
                    <div className="flex-none p-6 border-t border-white/10 bg-[#0e0e11] flex justify-end gap-4">
                        <button 
                            onClick={closeEditor}
                            className="px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit}
                            className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2 shadow-lg"
                        >
                            <Save size={16} />
                            {editing === "NEW" ? "Publish Event" : "Save Changes"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

/* ---------------- COMPONENT LIBRARY ---------------- */

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 px-4 py-3.5 rounded-xl text-sm text-white placeholder:text-gray-700
                    focus:border-indigo-500/50 focus:bg-black/60 focus:outline-none transition-all"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, height = "h-32" }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full bg-black/40 border border-white/10 px-4 py-3.5 rounded-xl text-sm text-white resize-none
                    focus:border-indigo-500/50 focus:bg-black/60 focus:outline-none transition-all ${height}`}
      />
    </div>
  );
}

function Select({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">{label}</label>
      <div className="relative">
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-black/40 border border-white/10 px-4 py-3.5 rounded-xl text-sm text-white appearance-none
                    focus:border-indigo-500/50 focus:bg-black/60 focus:outline-none transition-all cursor-pointer"
        >
            {CATEGORIES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}

function Toggle({ label, desc, checked, onChange, activeColor }) {
    return (
        <label className="flex items-center justify-between cursor-pointer group select-none">
            <div>
                <span className={`text-sm font-bold transition-colors ${checked ? "text-white" : "text-gray-400 group-hover:text-gray-300"}`}>
                    {label}
                </span>
                {desc && <p className="text-[10px] text-gray-600 mt-0.5">{desc}</p>}
            </div>
            <div className="relative">
                <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="hidden" />
                <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${checked ? activeColor : "bg-white/10"}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-0"}`} />
                </div>
            </div>
        </label>
    )
}