import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

import './index.css';
import App from './App';


ReactDOM.createRoot(document.getElementById('root')).render(

        <AuthProvider>
            <App />
        </AuthProvider>

);
