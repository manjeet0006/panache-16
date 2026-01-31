import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Toaster, toast } from 'sonner';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import EventsExplorer from './pages/Events';
import RegisterForm from './pages/RegisterForm';
// import ScannerPage from './pages/ScannerPage';
import Footer from './components/Footer';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import TermsAndConditions from './pages/terms_and_conditions';
import Contact from './pages/Contact';
import ConcertShowcase from './pages/ConcertShowcase';
import ConcertBooking from './pages/ConcertBooking';

import TicketDashboard from './pages/TicketDashboard';
import AboutSection from './pages/AboutSection';





// Initialize Socket outside component
// Replace with your actual backend URL
// App.jsx or Socket config file



const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return null; // Wait for context to load
  if (!token) return <Navigate to="/login" replace />;

  return children;
};



function App() {


  return (
    <Router>
      <div className="min-h-screen bg-[#050505] font-sans text-white selection:bg-pink-500/30">



        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/events" element={<EventsExplorer />} />
            <Route path="/register/:eventId" element={<RegisterForm />} />
            {/* Pass the global socket instance to the scanner */}
            {/* <Route path='/scan' element={<ScannerPage socket={socket} />} /> */}
            <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
            <Route path='/contact' element={<Contact />} />

            {/* 2. CONCERT ROUTES (Guest Accessible) */}
            <Route path="/concerts" element={<ConcertShowcase />} />
            <Route path="/concerts/book/:id" element={<ConcertBooking />} />
            <Route path="/ticket-dashboard" element={<TicketDashboard />}/>
            <Route path='/about' element={<AboutSection/>}/>



            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        <Toaster theme="dark" richColors position="top-right" />
      </div>
    </Router>
  );
}

export default App;