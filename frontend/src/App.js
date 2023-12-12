import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import AddUserForm from './components/AddUserForm';
import ManageUsers from './components/ManageUsers';
import UserDetails from './components/UserDetails';
import { AuthProvider } from './contexts/AuthContext';

// This is our main app component, for now it sets up routes and context for the web application
function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/create-user" element={<AddUserForm />} />
                    <Route path="/users" element={<ManageUsers />} />
                    <Route path="/user/:id" element={<UserDetails />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}


export default App;