import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/general-components/Navbar';
import MessageCenter from './components/admin-instructor-components/messaging/MessageCenter';
import WriteMessage from './components/admin-instructor-components/messaging/CreateMessage';
import SentMessages from './components/admin-instructor-components/messaging/Outbox';
import ViewMessages from './components/general-components/ViewMessages';
import { AuthProvider } from './contexts/AuthContext';
import TakeAttendance from './components/admin-instructor-components/attendance/TakeAttendance';
import ViewAttendanceRecords from './components/admin-instructor-components/attendance/ViewAttendanceRecords';
import Attendance from './components/admin-instructor-components/attendance/Attendance';
import CreateClass from './components/admin-instructor-components/palaver-classes/CreateClass';
import ViewClasses from './components/admin-instructor-components/palaver-classes/ViewClasses';
import PalClass from './components/admin-instructor-components/palaver-classes/PalClass';
import ClassDetails from './components/admin-instructor-components/palaver-classes/ClassDetails';
import StudentList from './components/instructor-components/StudentList';
import ProgressReportForm from './components/instructor-components/ProgressReportForm'
import UpdateClass from './components/admin-instructor-components/palaver-classes/UpdateClass';
import GetEmails from './components/admin-instructor-components/messaging/GetEmails';

/* Import components from the admin-components directory */
import { AddUserForm, ManageUsers, StudentAssignments, UserDetails, AdvancedUserView } from './components/admin-components';

/* Import components from the authentication-components directory */
import { Login, RequestPasswordReset, ResetPasswordConfirm } from './components/authentication-components';
import UpdateAttendanceRecord from './components/admin-instructor-components/attendance/UpdateAttendanceRecords';



// This is our main app component, for now it sets up routes and context for the web application
function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/password-reset-request" element={<RequestPasswordReset />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordConfirm />} />
                    <Route path="/create-user" element={<AddUserForm />} />
                    <Route path="/users" element={<ManageUsers />} />
                    <Route path="/advanced-user-view" element={<AdvancedUserView />} /> 
                    <Route path="/user/:id" element={<UserDetails />} />
                    <Route path="/user-details/:id" element={<UserDetails />} />
                    <Route path="/student-assignments" element={<StudentAssignments />} />
                    <Route path="/admin-instructor/getemails" element={<GetEmails/>} />
                    <Route path="/admin-instructor/messages" element={<MessageCenter/>}>
                        <Route path="compose" element={<WriteMessage />} />
                        <Route path="read" element={<ViewMessages />} />
                        <Route path="sent" element={<SentMessages />} />
                    </Route>
                    <Route path="/admin-instructor/write-message" element={<WriteMessage />} />
                    <Route path="/admin-instructor/sent-messages" element={<SentMessages />} />
                    <Route path="/messages" element={<ViewMessages />} />
                    <Route path="/admin-instructor/attendance" element={<Attendance />}>
                        <Route path="take" element={<TakeAttendance />} />
                        <Route path="view" element={<ViewAttendanceRecords />} />
                        <Route path="update" element={<UpdateAttendanceRecord />} />
                    </Route>
                    <Route path="/classes" element={<PalClass />}>
                        <Route path="create-class" element={<CreateClass />} />
                        <Route path="view-classes" element={<ViewClasses />} />
                        <Route path=":classId" element={<ClassDetails />} />
                        <Route path="update-class" element={<UpdateClass />} />
                    </Route>
                    <Route path="/mystudents" element={<StudentList />} /> 
                    <Route path="/prog-report" element={<ProgressReportForm />} /> 
                </Routes>
            </Router>
        </AuthProvider>
    );
}


export default App;