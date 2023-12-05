import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import AddUserForm from './components/AddUserForm';
import { AuthProvider } from './contexts/AuthContext';

// This is our main app component, for now it sets up routes and context for the web application
function App() {
    return (
        
        // AuthProvider wraps the entire application to provide authentication context for different routes and components
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/create-user" element={<AddUserForm />} /> 
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;