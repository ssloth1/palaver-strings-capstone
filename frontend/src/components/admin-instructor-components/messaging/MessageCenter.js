//MessageCenter - landing page for messaging for admins and instructors.
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

function MessageCenter() {
    console.log("Message Center");

    const location = useLocation();

    return (
        <div className="message-center">
            <nav className="message-nav">
                <Link to="compose" className={location.pathname.includes("/compose") ? "active" : ""}>compose messages</Link> |{" "}
                <Link to="read" className={location.pathname.includes("/read") ? "active" : ""}>read messages</Link> |{" "}
                <Link to="sent" className={location.pathname.includes("/sent") ? "active" : ""}>sent messages</Link>
            </nav>
            <Outlet />
        </div>
    );
}

export default MessageCenter;