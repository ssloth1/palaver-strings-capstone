import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

function PalClass() {
    const location = useLocation();

    return (
        <div className="class-container">
            <nav className="class-nav">
                <Link to="create-class" className={location.pathname.includes("/create-class") ? "active" : ""}>Create a Class</Link> | {" "}
                <Link to="view-classes" className={location.pathname.includes("/view-classes") ? "active" : ""}>View Classes</Link>
            </nav>
            <Outlet />{}
        </div>
    );
}

export default PalClass;