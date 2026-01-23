import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, Sparkles } from 'lucide-react';
import API from '../api';

const Login = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/user/login', { username: code, password: code });
      
      localStorage.setItem('panache_token', res.data.token);
      localStorage.setItem('panache_user', JSON.stringify(res.data));
      
      toast.success("Welcome back! Loading your dashboard...");
      // Hard reload or navigate to ensure Header updates
      window.location.href = '/dashboard';
    } catch (err) {
      toast.error(err.response?.data?.error || "We couldn't find that code. Try again?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
      
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg relative">
        <div className="bg-white/[0.03] border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl">
          
          {/* Human-centric Heading */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-pink-500/10 rounded-2xl mb-6 text-pink-500">
              <Sparkles size={28} />
            </div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-3">
              Your <span className="text-pink-500">Spot</span> is Ready
            </h2>
            <p className="text-gray-500 font-medium text-sm">
              Enter the unique access code sent to your department or team to see your tickets and schedule.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input 
                className="w-full bg-white/[0.05] border border-white/10 p-6 rounded-2xl outline-none focus:border-pink-500/50 focus:bg-white/[0.08] transition-all text-center font-mono text-2xl text-pink-500 font-black tracking-widest placeholder:text-gray-700"
                placeholder="Ex: VGU-CSE-00"
                value={code}
                autoFocus
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
              />
              <div className="absolute inset-0 rounded-2xl border border-pink-500/20 scale-105 opacity-0 group-focus-within:opacity-100 transition-all pointer-events-none" />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="group w-full bg-white text-black py-6 rounded-2xl font-black uppercase italic tracking-tighter text-lg hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {loading ? (
                "Checking your invite..."
              ) : (
                <>
                  Take me to my dashboard
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Supportive Footer */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-600 text-[11px] font-bold uppercase tracking-[0.2em]">
              Can't find your code? <span className="text-pink-500/50 hover:text-pink-500 cursor-pointer transition-colors">Contact your Coordinator</span>
            </p>
          </div>
        </div>

        {/* Brand identity anchor */}
        <p className="text-center mt-8 text-white/20 font-black italic tracking-widest text-[10px] uppercase">
          Panache 2026 • The Ultimate Celebration
        </p>
      </div>
    </div>
  );
};

export default Login;