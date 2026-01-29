import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, Sparkles, Ticket, User, Mail, Phone } from 'lucide-react';
import API from '../api';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
    const [loginType, setLoginType] = useState('event'); // 'event' or 'ticket'
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const { setAuthUser } = useAuth(); // Import from your context

    const navigate = useNavigate();

    const handleEventLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post('/user/login', { username: code, password: code });

            // 1. Set Local Storage
            localStorage.setItem('panache_token', res.data.token);
            localStorage.setItem('panache_user', JSON.stringify(res.data));
            localStorage.setItem('panache_user_type', 'event');

            // 2. UPDATE REACT STATE HERE (Crucial Step)
            // If you use Context/Redux, dispatch the update here so the app knows we are logged in immediately.
            if (setAuthUser) {
                setAuthUser(res.data);
            }

            toast.success("Welcome back! Loading your dashboard...");

            // 3. Navigate
            // navigate('/dashboard'); // Remove this
            window.location.href = '/dashboard'; // Add this

        } catch (err) {
            toast.error(err.response?.data?.error || "We couldn't find that code.");
        } finally {
            setLoading(false);
        }
    };

    const handleTicketLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post('/concert/find-ticket', { email, phone });
            // Navigate to a new page to display tickets, passing tickets data
            navigate('/ticket-dashboard', { state: { tickets: res.data } });
        } catch (err) {
            toast.error(err.response?.data?.error || "No tickets found for this email and phone combination.");
        } finally {
            setLoading(false);
        }
    };

    const EventLoginForm = (
        <form onSubmit={handleEventLogin} className="space-y-6">
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
                {loading ? "Checking your invite..." : <>Take me to my dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
        </form>
    );

    const TicketLoginForm = (
        <form onSubmit={handleTicketLogin} className="space-y-4">
            <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="email"
                    className="w-full bg-white/[0.05] border border-white/10 pl-16 pr-6 py-6 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all font-sans text-lg text-blue-300 font-bold placeholder:text-gray-600"
                    placeholder="your.email@example.com"
                    value={email}
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="relative group">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="tel"
                    className="w-full bg-white/[0.05] border border-white/10 pl-16 pr-6 py-6 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all font-sans text-lg text-blue-300 font-bold placeholder:text-gray-600"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="group w-full bg-blue-500 text-white py-6 rounded-2xl font-black uppercase italic tracking-tighter text-lg hover:bg-blue-400 transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-2"
            >
                {loading ? "Searching for tickets..." : <>Find My Tickets <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
        </form>
    );

    return (
        <div className="min-h-screen bg-[#050505] pt-23 flex items-center justify-center px-6 relative overflow-hidden">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${loginType === 'event' ? 'bg-pink-500/10' : 'bg-blue-500/10'} blur-[120px] rounded-full pointer-events-none transition-colors duration-500`} />
            <div className="w-full max-w-lg relative">
                <div className="bg-white/[0.03] border border-white/10 p-5 md:p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl">
                    <div className="text-center mb-7">
                        <div className={`inline-flex items-center justify-center w-14 h-14 ${loginType === 'event' ? 'bg-pink-500/10 text-pink-500' : 'bg-blue-500/10 text-blue-500'} rounded-2xl mb-6 transition-colors duration-500`}>
                            {loginType === 'event' ? <Sparkles size={28} /> : <Ticket size={28} />}
                        </div>
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-3">
                            {loginType === 'event' ? <>Your <span className="text-pink-500">Spot</span> is Ready</> : <>View Your <span className="text-blue-500">Concert</span> Ticket</>}
                        </h2>
                        <p className="text-gray-500 font-medium text-sm">
                            {loginType === 'event' ? "Enter the unique access code sent to your department or team." : "Enter your registered email and phone to find your tickets."}
                        </p>
                    </div>

                    <div className="flex items-center justify-center bg-black/20 p-1 rounded-full mb-8">
                        <button onClick={() => setLoginType('event')} className={`w-1/2 py-3 rounded-full text-xs font-bold uppercase tracking-widest ${loginType === 'event' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5'}`}>Event Login</button>
                        <button onClick={() => setLoginType('ticket')} className={`w-1/2 py-3 rounded-full text-xs font-bold uppercase tracking-widest ${loginType === 'ticket' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5'}`}>Ticket Finder</button>
                    </div>

                    {loginType === 'event' ? EventLoginForm : TicketLoginForm}

                    <div className="mt-5 pt-3 border-t border-white/5 text-center">
                        <p className="text-gray-600 text-[11px] font-bold uppercase tracking-[0.2em]">
                            Need help? <span className="text-pink-500/50 hover:text-pink-500 cursor-pointer transition-colors">Contact Support</span>
                        </p>
                    </div>
                </div>
                <p className="text-center mt-8 pb-5  text-white/20 font-black italic tracking-widest text-[12px] uppercase">
                    Panache 2026 • The Ultimate Celebration
                </p>
            </div>
        </div>
    );
};

export default Login;