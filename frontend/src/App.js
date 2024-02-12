import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/general-components/Login';
import Navbar from './components/general-components/Navbar';
import AddUserForm from './components/admin-components/AddUserForm';
import ManageUsers from './components/admin-components/ManageUsers';
import UserDetails from './components/admin-components/UserDetails';
import StudentAssignments from './components/admin-components/StudentAssignments';
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
                    <Route path="/student-assignments" element={<StudentAssignments />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}


export default App;