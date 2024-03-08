import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/general-components/Login';
import PasswordReset from './components/general-components/PasswordReset';
import Navbar from './components/general-components/Navbar';
import AddUserForm from './components/admin-components/AddUserForm';
import ManageUsers from './components/admin-components/ManageUsers';
import UserDetails from './components/admin-components/UserDetails';
import StudentAssignments from './components/admin-components/StudentAssignments';
import WriteMessage from './components/admin-instructor-components/CreateMessage';
import ViewMessages from './components/general-components/ViewMessages';
import { AuthProvider } from './contexts/AuthContext';
import TakeAttendance from './components/admin-instructor-components/attendance/TakeAttendance';
import ViewAttendanceRecords from './components/admin-instructor-components/attendance/ViewAttendanceRecords';
import Attendance from './components/admin-instructor-components/attendance/Attendance';
import CreateClass from './components/admin-instructor-components/palaver-classes/CreateClass';


// This is our main app component, for now it sets up routes and context for the web application
function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/password-reset" element={<PasswordReset />} />
                    <Route path="/create-user" element={<AddUserForm />} />
                    <Route path="/users" element={<ManageUsers />} />
                    <Route path="/user/:id" element={<UserDetails />} />
                    <Route path="/student-assignments" element={<StudentAssignments />} />
                    <Route path="/write-message" element={<WriteMessage />} />
                    <Route path="/messages" element={<ViewMessages />} />
                    <Route path="/admin-instructor/attendance" element={<Attendance />}>
                        <Route path="take" element={<TakeAttendance />} />
                        <Route path="view" element={<ViewAttendanceRecords />} />
                    </Route>
                    <Route path="/take-attendance" element={<TakeAttendance />} />
                    <Route path="/view-attendance" element={<ViewAttendanceRecords />} />
                    <Route path="/create-class" element={<CreateClass />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}


export default App;