import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import '../styles/Attendance.css';

function PalClass() {
    const location = useLocation();

    return (
        <div className="container">
            <nav className="nav">
                <Link to="create-class" className={location.pathname.includes("/create-class") ? "navLink activeNavLink" : "navLink"}>create a class</Link> | {" "}
                <Link to="view-classes" className={location.pathname.includes("/view-classes") ? "navLink activeNavLink" : "navLink"}>view classes</Link> | {" "}
                <Link to="update-class" className={location.pathname.includes("/update-class") ? "navLink activeNavLink" : "navLink"}>update class</Link> 
            </nav>
            <Outlet />{}
        </div>
    );
}

export default PalClass;