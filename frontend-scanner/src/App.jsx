import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import ScannerPage from './pages/ScannerPage';
import TicketSearch from './pages/TicketSearch';
import { io } from 'socket.io-client';
import { AnimatePresence, motion } from 'framer-motion';
import { QrCode, Search } from 'lucide-react';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';



const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  upgrade: false,
  reconnection: true,
  reconnectionDelay: 500,
});

const PageWrapper = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};


function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const activeLinkStyle = {
    backgroundColor: '#4f46e5',
    color: 'white',
  };

  return (
    <>
    <Toaster richColors theme="dark" position="top-right" closeButton />
    <BrowserRouter>
      {/* <div className="min-h-screen bg-gray-100"> */}
        {/* {!isConnected && (
          <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-xs py-1 text-center font-bold uppercase tracking-wider z-50 animate-pulse">
            Connection Lost - Reconnecting...
          </div>
        )}
        <header className="bg-white shadow-md">
          <nav className="container mx-auto px-4">
            <ul className="flex items-center justify-center space-x-2">
              <li>
                <NavLink 
                  to="/" 
                  className="flex items-center px-4 py-3 text-gray-600 font-medium rounded-lg transition-colors duration-200 hover:bg-gray-200"
                  style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Scanner
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/search" 
                  className="flex items-center px-4 py-3 text-gray-600 font-medium rounded-lg transition-colors duration-200 hover:bg-gray-200"
                  style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Ticket Search
                </NavLink>
              </li>
            </ul>
          </nav>
        </header> */}
        {/* <main className="container mx-auto p-4"> */}
          <PageWrapper>
            <Routes>
              <Route path="/" element={<ScannerPage socket={socket} />} />
              <Route path="/search" element={<TicketSearch socket={socket} />} />
            </Routes>
          </PageWrapper>
          <Analytics/>
        {/* </main> */}
      {/* </div> */}
    </BrowserRouter>
    </>
  );
}

export default App;