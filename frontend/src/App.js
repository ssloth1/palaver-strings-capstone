import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/general-components/Login';
import Navbar from './components/general-components/Navbar';
import AddUserForm from './components/admin-components/AddUserForm';
import ManageUsers from './components/admin-components/ManageUsers';
import UserDetails from './components/admin-components/UserDetails';
import StudentAssignments from './components/admin-components/StudentAssignments';
import WriteMessage from './components/admin-instructor-components/CreateMessage';
import ViewMessages from './components/general-components/ViewMessages';
import { AuthProvider } from './contexts/AuthContext';
import TakeAttendance from './components/admin-instructor-components/TakeAttendance';
import ViewAttendanceRecords from './components/admin-instructor-components/ViewAttendanceRecords';

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
                    <Route path="/write-message" element={<WriteMessage />} />
                    <Route path="/messages" element={<ViewMessages />} />
                    <Route path="/take-attendance" element={<TakeAttendance />} />
                    <Route path="/view-attendance" element={<ViewAttendanceRecords />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}


export default App;