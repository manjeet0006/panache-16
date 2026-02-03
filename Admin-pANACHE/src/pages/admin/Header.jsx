import { useNavigate, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  LayoutTemplate,
  Ticket,
  Building2,
  Users,
  LogOut,
} from "lucide-react";

/* ================= NAV BUTTON ================= */
const NavButton = ({ onClick, icon, label, active }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
        ${
          active
            ? "bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(220,38,38,0.2)]"
            : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
};

/* ================= HEADER ================= */
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("panache_admin_token");
    localStorage.removeItem("panache_admin");
    navigate("/admin/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* --- HEADER NAVIGATION --- */}
      <header className="mb-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 pb-6 border-b border-white/10">

        {/* 🔴 LEFT BRAND */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-transparent
                          flex items-center justify-center text-red-500
                          border border-red-500/10
                          shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              Admin <span className="text-red-500">Console</span>
            </h1>
            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mt-1 flex items-center gap-2">
              Panache 2026
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </p>
          </div>
        </div>

        {/* 🧭 NAVIGATION */}
        <nav className="flex flex-wrap items-center gap-3">
          <NavButton
            onClick={() => navigate("/admin/events")}
            icon={<LayoutTemplate size={16} />}
            label="Events"
            active={isActive("/admin/events")}
          />

          <NavButton
            onClick={() => navigate("/admin/invite-codes")}
            icon={<Ticket size={16} />}
            label="Invites"
            active={isActive("/admin/invite-codes")}
          />

          <NavButton
            onClick={() => navigate("/admin/departments")}
            icon={<Building2 size={16} />}
            label="Departments"
            active={isActive("/admin/departments")}
          />

          <NavButton
            onClick={() => navigate("/admin/colleges")}
            icon={<Users size={16} />}
            label="Colleges"
            active={isActive("/admin/colleges")}
          />

          {/* 🔓 LOGOUT */}
          <NavButton
            onClick={handleLogout}
            icon={<LogOut size={16} />}
            label="Logout"
          />
        </nav>
      </header>
    </>
  );
};

export default Header;
