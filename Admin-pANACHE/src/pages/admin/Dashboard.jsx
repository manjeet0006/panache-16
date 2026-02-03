import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  ShieldCheck,
  Search,
  Download,
  RefreshCcw,
  Users,
  Building2,
  Calendar,
  Ticket,
  LayoutTemplate,
  Loader2, // Added Loader
  CheckCircle, // Added for Toast
  AlertTriangle, // Added for Toast
  X // Added for Toast
} from "lucide-react";
import * as XLSX from "xlsx";
import API from "../../api";

// shadcn (RELATIVE IMPORTS – SAFE)
import { Card, CardContent } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

function AdminDashboard() {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    inCollege: 0,
    outCollege: 0,
    totalEvents: 0
  });
  
  // Loading States
  const [loading, setLoading] = useState(true); // Initial Load
  const [refreshing, setRefreshing] = useState(false); // Background Refresh

  // Filters
  const [search, setSearch] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("");

  // Modals & UX
  const [activeModal, setActiveModal] = useState(null);
  const [toast, setToast] = useState(null);

  // --- HELPERS ---
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 🔁 FETCH DASHBOARD
  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await API.get("/admin/dashboard");
      
      // Safety checks in case API returns partial data
      setTeams(res.data.teams || []);
      setStats(res.data.stats || {
        totalRegistrations: 0,
        inCollege: 0,
        outCollege: 0,
        totalEvents: 0
      });

      if (isRefresh) showToast("Dashboard updated", "success");

    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      showToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // 🔍 FILTER + SEARCH (Optimized with useMemo)
  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const matchesSearch =
        t.teamName?.toLowerCase().includes(search.toLowerCase()) ||
        t.college?.name?.toLowerCase().includes(search.toLowerCase());

      const matchesCollege = collegeFilter
        ? t.college?.name === collegeFilter
        : true;

      const matchesEvent = eventFilter
        ? t.event?.name === eventFilter
        : true;

      return matchesSearch && matchesCollege && matchesEvent;
    });
  }, [teams, search, collegeFilter, eventFilter]);

  // 📤 EXPORT EXCEL
  const exportExcel = () => {
    if (filteredTeams.length === 0) {
      showToast("No data to export", "error");
      return;
    }

    try {
      const data = filteredTeams.map((t) => ({
        Team: t.teamName,
        Event: t.event?.name || "N/A",
        College: t.college?.name || "External",
        Members: t.members?.length || 0,
        Payment: t.paymentStatus,
        Leader: t.members?.[0]?.name || "N/A", // Added Leader Name
        Phone: t.members?.[0]?.phone || "N/A", // Added Contact
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Teams");
      XLSX.writeFile(workbook, "panache_admin_export.xlsx");
      showToast("Export downloaded successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to export Excel", "error");
    }
  };

  // --- RENDER LOADING SCREEN (Initial Only) ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white gap-4">
        <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
            <Loader2 size={40} className="animate-spin text-red-500 relative z-10" />
        </div>
        <p className="text-sm font-mono uppercase tracking-widest text-gray-500 animate-pulse">Initializing Admin Console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white px-6 py-10 font-sans selection:bg-red-500/30">
      
      {/* --- HEADER NAVIGATION --- */}
      <header className="mb-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-transparent flex items-center justify-center text-red-500 border border-red-500/10 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              Admin <span className="text-red-500">Console</span>
            </h1>
            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mt-1 flex items-center gap-2">
              Panache 2026 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> Live
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-3">
          <NavButton onClick={() => navigate("/admin/events")} icon={<LayoutTemplate size={16} />} label="Events" />
          <NavButton onClick={() => navigate("/admin/invite-codes")} icon={<Ticket size={16} />} label="Invites" />
          <NavButton onClick={() => navigate("/admin/departments")} icon={<Building2 size={16} />} label="Departments" />
          <NavButton onClick={() => navigate("/admin/colleges")} icon={<Users size={16} />} label="Colleges" />
        </nav>
      </header>

      {/* --- DASHBOARD CONTROLS --- */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-gray-500 text-sm mt-1">Real-time registration metrics & analytics</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search team or college..."
              className="bg-white/[0.05] border border-white/10 rounded-xl pl-10 pr-4 h-10 text-sm text-white placeholder:text-gray-500 w-64 focus:border-red-500/50 transition-all"
            />
          </div>

          <Button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] h-10 rounded-xl px-4"
          >
            <RefreshCcw size={14} className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Updating..." : "Refresh"}
          </Button>

          <Button
            onClick={exportExcel}
            className="bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 h-10 rounded-xl px-4"
          >
            <Download size={14} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Registrations"
          value={stats.totalRegistrations}
          icon={<Users />}
          onClick={() => setActiveModal("registrations")}
        />
        <StatCard
          label="In College"
          value={stats.inCollege}
          icon={<Building2 />}
          onClick={() => setActiveModal("college")}
          color="blue"
        />
        <StatCard
          label="Out College"
          value={stats.outCollege}
          icon={<Building2 />}
          onClick={() => setActiveModal("college")}
          color="purple"
        />
        <StatCard
          label="Total Events"
          value={stats.totalEvents}
          icon={<Calendar />}
          onClick={() => navigate("/admin/events")}
          color="green"
        />
      </div>

      {/* --- TABLE --- */}
      <Card className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <div className="max-h-[520px] overflow-y-auto custom-scroll relative">
            
            {refreshing && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" />
                </div>
            )}

            <Table>
              <TableHeader className="sticky top-0 bg-[#0a0a0a] z-10 border-b border-white/10 shadow-md">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="px-6 py-4 text-left text-gray-500 font-bold uppercase text-[10px] tracking-widest">Team</TableHead>
                  <TableHead className="px-6 py-4 text-left text-gray-500 font-bold uppercase text-[10px] tracking-widest">Event</TableHead>
                  <TableHead className="px-6 py-4 text-left text-gray-500 font-bold uppercase text-[10px] tracking-widest">College</TableHead>
                  <TableHead className="px-6 py-4 text-center text-gray-500 font-bold uppercase text-[10px] tracking-widest">Members</TableHead>
                  <TableHead className="px-6 py-4 text-center text-gray-500 font-bold uppercase text-[10px] tracking-widest">Payment</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTeams.length > 0 ? (
                  filteredTeams.map((t) => (
                    <TableRow
                      key={t.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                    >
                      <TableCell className="px-6 py-4 font-bold text-white group-hover:text-red-400 transition-colors">
                        {t.teamName}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-300 text-sm">
                        {t.event?.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-400 text-sm">
                        {t.college?.name || <span className="italic opacity-50">External / Unassigned</span>}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center font-mono text-sm text-gray-300">
                        {t.members?.length || 0}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Badge
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${
                            t.paymentStatus === "APPROVED" || t.paymentStatus === "PAID"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : t.paymentStatus === "PENDING"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {t.paymentStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center text-gray-500 text-sm">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Search size={30} strokeWidth={1} className="opacity-50" />
                        <p>No registrations found matching "{search}"</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* --- MODAL --- */}
      <Dialog open={!!activeModal} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#0b0b0b] border border-white/10 rounded-3xl text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-black flex items-center gap-2">
                {activeModal === "registrations" && <><Users size={20} className="text-red-500"/> Registrations</>}
                {activeModal === "college" && <><Building2 size={20} className="text-blue-500"/> College Stats</>}
            </DialogTitle>
          </DialogHeader>

          {activeModal === "college" && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-gray-400 text-sm font-medium">Internal (VGU)</span>
                  <span className="text-2xl font-bold text-white">{stats.inCollege}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-gray-400 text-sm font-medium">External</span>
                  <span className="text-2xl font-bold text-white">{stats.outCollege}</span>
              </div>
            </div>
          )}

          {activeModal === "registrations" && (
            <div className="py-6 text-center">
                <p className="text-5xl font-black text-white">{stats.totalRegistrations}</p>
                <p className="text-gray-500 text-sm uppercase tracking-widest mt-2">Total Participants</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- CUSTOM TOAST --- */}
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

      {/* --- CSS UTILS --- */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

// --- SUB COMPONENTS ---

function NavButton({ onClick, icon, label }) {
    return (
        <Button
            onClick={onClick}
            className="bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] text-gray-300 hover:text-white transition-all h-10 px-4 rounded-xl"
        >
            <span className="mr-2 opacity-70">{icon}</span>
            {label}
        </Button>
    )
}

function StatCard({ label, value, icon, onClick, color = "red" }) {
    // Dynamic color classes based on props
    const colorClasses = {
        red: "group-hover:bg-red-500",
        blue: "group-hover:bg-blue-500",
        purple: "group-hover:bg-purple-500",
        green: "group-hover:bg-green-500",
    }[color] || "group-hover:bg-red-500";

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer bg-white/[0.03] border border-white/10 rounded-3xl hover:bg-white/[0.06] transition-all group overflow-hidden relative"
    >
      <CardContent className="p-6 relative z-10">
        <div className={`w-12 h-12 rounded-2xl bg-white/[0.05] text-white flex items-center justify-center mb-4 ${colorClasses} group-hover:text-white transition-colors shadow-lg`}>
          {icon}
        </div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black mt-1 text-white tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}

export default AdminDashboard;