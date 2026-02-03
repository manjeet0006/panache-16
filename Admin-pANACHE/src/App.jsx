import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Events from "./pages/admin/Events";
import InviteControl from "./pages/admin/InviteControl";
import CreateDepartment from "./pages/admin/CreateDepartment";
import ViewColleges from "./pages/admin/ViewColleges";

import CsvToJson from "./pages/admin/CsvToJson";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
            
                <AdminDashboard />
              
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <AdminProtectedRoute>
             
                <Events />
             
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/invite-codes"
          element={
            <AdminProtectedRoute>
            
                <InviteControl />
           
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/departments"
          element={
            <AdminProtectedRoute>
          
                <CreateDepartment />
              
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/colleges"
          element={
            <AdminProtectedRoute>
           
                <ViewColleges />
             
            </AdminProtectedRoute>
          }
        />

         <Route
          path="/csvtojson"
          element={
            <AdminProtectedRoute>
              
               <CsvToJson/>
              
            </AdminProtectedRoute>
          }
        />

        {/* 🔁 Fallback: redirect everything else to admin login */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
