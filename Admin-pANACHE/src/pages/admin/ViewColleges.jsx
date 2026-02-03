import { useEffect, useState, useMemo } from "react";
import { 
  School, 
  MapPin, 
  Globe, 
  Lock, 
  Search, 
  Plus, 
  Save, 
  X, 
  Trash2, 
  Edit2, 
  RefreshCw, 
  Building2,
  CheckCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";
import API from "../../api";

export default function ViewColleges() {
  // --- STATE ---
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // UX State
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    isInternal: false,
  });

  // --- HELPERS ---
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- API ACTIONS ---
  const fetchColleges = async () => {
    try {
      const res = await API.get("/meta/colleges");
      setColleges(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch colleges", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchColleges();
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // --- FORM HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.city) {
      showToast("Name and City are required", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        // UPDATE Existing
        await API.put(`/meta/colleges/${editingId}`, formData);
        showToast("College updated successfully", "success");
      } else {
        // CREATE New
        await API.post("/meta/colleges", formData);
        showToast("College created successfully", "success");
      }
      
      resetForm();
      fetchColleges();
    } catch (err) {
      console.error(err);
      showToast("Operation failed. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
      await API.delete(`/meta/colleges/${id}`);
      setColleges(prev => prev.filter(c => c.id !== id)); // Optimistic update
      showToast("College deleted", "success");
    } catch (err) {
      console.error(err);
      showToast("Delete failed", "error");
    }
  };

  // --- EDITING LOGIC ---
  const startEdit = (college) => {
    setEditingId(college.id);
    setFormData({
      name: college.name,
      city: college.city,
      isInternal: college.isInternal,
    });
    // Scroll to top on mobile to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", city: "", isInternal: false });
  };

  // --- FILTERING ---
  const filteredColleges = useMemo(() => {
    return colleges.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [colleges, searchTerm]);

  // --- RENDER ---
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col font-sans selection:bg-red-500/30 overflow-hidden relative">
      
      {/* GLOBAL STYLES */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      {/* AMBIENT GLOW */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* HEADER */}
      <header className="flex-none px-8 py-6 border-b border-white/10 bg-black/40 backdrop-blur-md z-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-transparent rounded-xl flex items-center justify-center text-red-500 border border-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <School size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none">
              College <span className="text-red-500">Master</span>
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium mt-1">
              Institutions & Campuses
            </p>
          </div>
        </div>

        <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-3 rounded-xl border border-white/10 bg-white/[0.05] text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
        >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
        </button>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="flex-1 flex flex-col lg:flex-row gap-8 p-8 overflow-hidden z-10 relative">
        
        {/* LEFT: FORM SECTION */}
        <section className="w-full lg:w-[380px] flex-none flex flex-col gap-6">
            <div className={`bg-white/[0.02] border ${editingId ? 'border-yellow-500/30' : 'border-white/5'} rounded-2xl p-6 backdrop-blur-sm shadow-xl transition-colors duration-300`}>
                
                <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-6 ${editingId ? 'text-yellow-500' : 'text-gray-400'}`}>
                    {editingId ? (
                        <><Edit2 size={16} /> Edit College</>
                    ) : (
                        <><Plus size={16} className="text-red-500" /> Create New</>
                    )}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Institution Name</label>
                        <div className="relative group">
                            <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                            <input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. VGU Main Campus"
                                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm outline-none focus:border-red-500/50 focus:bg-white/[0.02] transition-all placeholder:text-gray-600 text-white"
                            />
                        </div>
                    </div>

                    {/* City Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">City / Location</label>
                        <div className="relative group">
                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                            <input
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="e.g. Jaipur"
                                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm outline-none focus:border-red-500/50 focus:bg-white/[0.02] transition-all placeholder:text-gray-600 text-white"
                            />
                        </div>
                    </div>

                    {/* Internal/External Select */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, isInternal: true})}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all
                                    ${formData.isInternal 
                                        ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                                        : 'bg-black/20 border-white/10 text-gray-500 hover:bg-white/5'
                                    }`}
                            >
                                <Lock size={14} /> Internal
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, isInternal: false})}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all
                                    ${!formData.isInternal 
                                        ? 'bg-blue-500/10 border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                                        : 'bg-black/20 border-white/10 text-gray-500 hover:bg-white/5'
                                    }`}
                            >
                                <Globe size={14} /> External
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-2">
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gray-700 transition-all border border-white/5"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all shadow-lg flex items-center justify-center gap-2
                                ${editingId 
                                    ? 'bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-yellow-500/20' 
                                    : 'bg-white text-black hover:bg-red-500 hover:text-white hover:shadow-red-500/20'
                                }`}
                        >
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : (editingId ? "Update" : "Create")}
                        </button>
                    </div>
                </form>
            </div>
        </section>

        {/* RIGHT: LIST SECTION */}
        <section className="flex-1 flex flex-col min-h-0 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden">
            
            {/* List Header */}
            <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-white/5 p-2 rounded-lg"><School size={18} className="text-gray-300" /></div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Registered Colleges</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{filteredColleges.length} Records found</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative group w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search colleges..."
                        className="w-full pl-9 pr-3 py-2 bg-black/20 border border-white/10 rounded-lg text-xs outline-none focus:border-red-500/50 focus:bg-white/[0.02] transition-all placeholder:text-gray-600 text-white"
                    />
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto custom-scroll p-0">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-gray-500 gap-2">
                        <Loader2 size={24} className="animate-spin" /> <span className="text-xs uppercase tracking-widest">Loading...</span>
                    </div>
                ) : filteredColleges.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3 opacity-50">
                        <School size={40} strokeWidth={1} />
                        <p className="text-xs uppercase tracking-widest">No colleges found</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
                            <tr>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-semibold border-b border-white/5">Name</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-semibold border-b border-white/5">Location</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-semibold border-b border-white/5">Type</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-semibold border-b border-white/5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredColleges.map((college) => (
                                <tr key={college.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{college.name}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <MapPin size={12} />
                                            {college.city}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border
                                            ${college.isInternal 
                                                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                                                : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                            }`}
                                        >
                                            {college.isInternal ? <Lock size={10} /> : <Globe size={10} />}
                                            {college.isInternal ? "Internal" : "External"}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => startEdit(college)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(college.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 text-gray-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>

      </main>

      {/* CUSTOM TOAST */}
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
    </div>
  );
}