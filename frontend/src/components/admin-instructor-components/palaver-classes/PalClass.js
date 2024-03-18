import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

function PalClass() {
    const location = useLocation();

    return (
        <div className="class-container">
            <nav className="class-nav">
                <Link to="create-class" className={location.pathname.includes("/create-class") ? "active" : ""}>create a class</Link> | {" "}
                <Link to="view-classes" className={location.pathname.includes("/view-classes") ? "active" : ""}>view classes</Link> | {" "}
                <Link to="update-class" className={location.pathname.includes("/update-class") ? "active" : ""}>update class</Link> 
            </nav>
            <Outlet />{}
        </div>
    );
}

export default PalClass;