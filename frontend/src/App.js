import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import AddUserForm from './components/AddUserForm';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Main App
function App() {

  return (
    <AuthProvider> {/* Need to wrap the whole app with the AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-user" element={<ProtectedRoute/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Protected route component that will redirect to login if not logged in
function ProtectedRoute() {
  const { isLoggedIn, isAdmin } = useAuth();
  // Render AddUserForm if logged in and is admin, otherwise redirect to login
  return isLoggedIn && isAdmin ? <AddUserForm /> : <Navigate to="/login" replace />;
}

export default App;