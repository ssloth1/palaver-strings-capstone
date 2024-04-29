// Attendance.js - A new component to serve as the parent for attendance-related pages
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import '../styles/Attendance.css';

function Attendance() {
    const location = useLocation();

    return (
        <div className="container">
            <nav className="nav">
                <Link to="take" className={location.pathname.includes("/take") ? "navLink activeNavLink" : "navLink"}>take attendance</Link> |{" "}
                <Link to="view" className={location.pathname.includes("/view") ? "navLink activeNavLink" : "navLink"}>view attendance records</Link> | {" "}
                <Link to="update" className={location.pathname.includes("/update") ? "navLink activeNavLink" : "navLink"}>update attendance record</Link>
            </nav>
            <Outlet />
        </div>
    );
}

export default Attendance;