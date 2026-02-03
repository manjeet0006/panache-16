import { useEffect, useState, useMemo } from "react";
import { customAlphabet } from 'nanoid';
import { v4 as uuidv4 } from "uuid";
import { 
  Building2, 
  Layers, 
  Plus, 
  Hash, 
  Search, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  RefreshCw,
  School,
  Code2,
  Trash2, 
  Loader2 
} from "lucide-react";
import API from "../../api";

export default function CreateDepartment() {
  // --- STATE ---
  const [name, setName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null); 
  
  // UX State
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null); 

  // --- LOGIC ---

  const generateSecretCode = () => `VGU-${customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)()}`;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchColleges = async () => {
    try {
      const res = await API.get("/meta/colleges");
      setColleges(res.data);
    } catch (err) {
      console.error("Failed to fetch colleges", err);
      showToast("Failed to fetch colleges", "error");
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await API.get("/meta/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Failed to fetch departments", err);
      showToast("Failed to fetch departments", "error");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchColleges(), fetchDepartments()]);
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    fetchColleges();
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!collegeId) {
      showToast("Please select a college", "error");
      return;
    }

    const secretCode = generateSecretCode();
    setLoading(true);

    try {
      // Create Route matches: router.post('/departments', ...)
      await API.post("/admin/departments", {
        name,
        secretCode,
        collegeId,
      });

      showToast(`Department created! Code: ${secretCode}`, "success");
      setName("");
      setCollegeId("");
      fetchDepartments();
    } catch (err) {
      showToast(err.response?.data?.error || "Error creating department", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (id) => {
    // 1. Confirm before deleting
    if (!window.confirm("Are you sure? This will delete the Department AND all associated Teams.")) {
      return;
    }

    setDeletingId(id);

    try {
      // 2. Delete Request
      // Matches Backend Route: router.delete('/departments/:id', ...)
      // Assuming your router is mounted at /api/admin
      await API.delete(`/departments/${id}`); 

      // 3. Optimistic UI Update (Remove from list instantly)
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      
      showToast("Department deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || "Failed to delete department", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard", "success");
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.secretCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.college?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  // --- RENDER ---
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col font-sans selection:bg-red-500/30 overflow-hidden relative">
      
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* HEADER */}
      <header className="flex-none px-8 py-6 border-b border-white/10 bg-black/40 backdrop-blur-md z-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-transparent rounded-xl flex items-center justify-center text-red-500 border border-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none">
              Department <span className="text-red-500">Manager</span>
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium mt-1">
              Structure & Organization
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
        
        {/* LEFT: CREATE FORM */}
        <section className="w-full lg:w-[400px] flex-none flex flex-col gap-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-6">
                    <Plus size={16} className="text-red-500" /> Create New
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* College Select */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">College</label>
                        <div className="relative group">
                            <School size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                            <select
                                value={collegeId}
                                onChange={(e) => setCollegeId(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm outline-none focus:border-red-500/50 focus:bg-white/[0.02] transition-all appearance-none text-gray-300"
                            >
                                <option value="" className="bg-neutral-900 text-gray-500">Select Affiliation...</option>
                                {colleges.map((c) => (
                                    <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l border-white/10 pl-2">
                                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-gray-500"></div>
                            </div>
                        </div>
                    </div>

                    {/* Department Name Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Department Name</label>
                        <div className="relative group">
                            <Layers size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Computer Science (CSE)"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm outline-none focus:border-red-500/50 focus:bg-white/[0.02] transition-all placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex gap-3 items-start">
                        <Code2 size={16} className="text-blue-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-blue-200/60 leading-relaxed">
                            A unique <span className="font-mono text-blue-300">Secret Code</span> (e.g. VGU-A1B2) will be auto-generated upon creation.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-white text-black rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] mt-2"
                    >
                        {loading ? "Processing..." : "Create Department"}
                    </button>
                </form>
            </div>
        </section>

        {/* RIGHT: LIST */}
        <section className="flex-1 flex flex-col min-h-0 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden">
            
            {/* List Header */}
            <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-white/5 p-2 rounded-lg"><Layers size={18} className="text-gray-300" /></div>
                    <div>
                        <h3 className="text-sm font-bold text-white">All Departments</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{filteredDepartments.length} Records found</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative group w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search departments..."
                        className="w-full pl-9 pr-3 py-2 bg-black/20 border border-white/10 rounded-lg text-xs outline-none focus:border-red-500/50 focus:bg-white/[0.02] transition-all placeholder:text-gray-600"
                    />
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto custom-scroll p-0">
                {filteredDepartments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3 opacity-50">
                        <Layers size={40} strokeWidth={1} />
                        <p className="text-xs uppercase tracking-widest">No departments found</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/[0.02] sticky top-0 z-10 backdrop-blur-md">
                            <tr>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-semibold border-b border-white/5">Department Name</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-semibold border-b border-white/5">Secret Code</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-semibold border-b border-white/5">College</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-semibold border-b border-white/5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredDepartments.map((d) => (
                                <tr key={d.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{d.name}</div>
                                    </td>
                                    <td className="p-4">
                                        <div 
                                            onClick={() => copyToClipboard(d.secretCode)}
                                            className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 cursor-pointer transition-all group/code"
                                            title="Click to copy"
                                        >
                                            <Hash size={12} className="text-red-500/60" />
                                            <span className="font-mono text-xs text-red-200/80">{d.secretCode}</span>
                                            <Copy size={10} className="opacity-0 group-hover/code:opacity-100 text-red-500 transition-opacity" />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <School size={12} />
                                            {d.college?.name || <span className="italic opacity-50">N/A</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleDelete(d.id)}
                                            disabled={deletingId === d.id}
                                            className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Delete Department"
                                        >
                                            {deletingId === d.id ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>

      </main>

      {/* CUSTOM TOAST COMPONENT */}
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