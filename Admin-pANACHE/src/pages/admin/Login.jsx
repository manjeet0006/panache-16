import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck, ArrowRight } from "lucide-react";
import API from "../../api";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("panache_admin_token");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/admin/login", {
        email,
        password,
      });

      // ✅ SAVE ADMIN SESSION (FIXED)
      localStorage.setItem("panache_admin_token", res.data.token);
      localStorage.setItem(
        "panache_admin",
        JSON.stringify(res.data.admin)
      );

      toast.success("Welcome Admin. Loading dashboard…");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-red-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg relative">
        <div className="bg-white/[0.03] border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/10 rounded-2xl mb-6 text-red-500">
              <ShieldCheck size={28} />
            </div>

            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-3">
              Admin <span className="text-red-500">Access</span>
            </h2>

            <p className="text-gray-500 font-medium text-sm">
              Restricted control panel. Authorized personnel only.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">

            <input
              className="w-full bg-white/[0.05] border border-white/10 p-5 rounded-2xl outline-none focus:border-red-500/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-gray-600"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="w-full bg-white/[0.05] border border-white/10 p-5 rounded-2xl outline-none focus:border-red-500/50 focus:bg-white/[0.08] transition-all text-white placeholder:text-gray-600"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-white text-black py-6 rounded-2xl font-black uppercase italic tracking-tighter text-lg hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {loading ? (
                "Authenticating…"
              ) : (
                <>
                  Enter Control Panel
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-600 text-[11px] font-bold uppercase tracking-[0.2em]">
              Unauthorized access is monitored & logged
            </p>
          </div>
        </div>

        {/* Brand */}
        <p className="text-center mt-8 text-white/20 font-black italic tracking-widest text-[10px] uppercase">
          Panache 2026 • Admin Console
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
