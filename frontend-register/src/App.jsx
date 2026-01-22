import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Toaster, toast } from 'sonner';

// Pages
import Home from './pages/Home';
import EventsExplorer from './pages/Events';
import RegisterForm from './pages/RegisterForm';
import ScannerPage from './pages/ScannerPage';

// Initialize Socket outside component
// Replace with your actual backend URL
// App.jsx or Socket config file

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;


const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  upgrade: false, // Skip the "polling" phase entirely
  reconnection: true,
  reconnectionDelay: 500
});
function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('connect_error', () => toast.error("Gate Terminal Offline"));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[#050505] font-sans text-white selection:bg-pink-500/30">

        {/* Offline Alert Banner */}
        {!isConnected && (
          <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-[10px] py-1 text-center font-black uppercase tracking-[0.2em] z-[110] animate-pulse">
            Connection Lost - Reconnecting...
          </div>
        )}

        {/* Global Glassmorphic Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:rotate-12 transition-transform">
                <span className="text-white font-black text-2xl">P</span>
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">
                Panache <span className="text-pink-500">26</span>
              </span>
            </Link>

            <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
              <Link to="/" className="hover:text-pink-500 transition-colors">Home</Link>
              <Link to="/events" className="hover:text-pink-500 transition-colors">All Events</Link>
              <Link to="/scan" className="text-pink-500 border-b border-pink-500/50">Scanner</Link>
            </div>
          </div>
        </nav>

        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventsExplorer />} />
            <Route path="/register/:eventId" element={<RegisterForm />} />
            {/* Pass the global socket instance to the scanner */}
            <Route path='/scan' element={<ScannerPage socket={socket} />} />
          </Routes>
        </main>

        <footer className="border-t border-white/10 py-12 bg-black mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
            <h2 className="text-xl font-bold uppercase tracking-tighter text-pink-500">Panache 2026</h2>
            <p className="text-gray-600 text-xs mt-2">© 2026 Developed by Panache Tech Team</p>
          </div>
        </footer>

        <Toaster theme="dark" richColors position="top-right" />
      </div>
    </Router>
  );
}

export default App;