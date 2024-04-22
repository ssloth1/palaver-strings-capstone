// Attendance.js - A new component to serve as the parent for attendance-related pages
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import styles from '../styles/Attendance.module.css';

function Attendance() {
    const location = useLocation();

    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <Link to="take" className={location.pathname.includes("/take") ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}>Take Attendance</Link> |{" "}
                <Link to="view" className={location.pathname.includes("/view") ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}>View Attendance Records</Link> | {" "}
                <Link to="update" className={location.pathname.includes("/update") ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}>Update Attendance Record</Link>
            </nav>
            <Outlet />
        </div>
    );
}

export default Attendance;