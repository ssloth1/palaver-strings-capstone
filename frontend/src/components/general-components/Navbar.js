import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import NavigationLink from './NavigationLink.js';
import './styles/Navbar.css';
import { IoMdHome } from "react-icons/io";
import { RiUserAddLine } from "react-icons/ri";
import { FaUserEdit } from 'react-icons/fa'; 
import { MdOutlineAssignmentInd } from "react-icons/md";
import { FaIndent } from 'react-icons/fa';
import { CiMail } from "react-icons/ci";
import { FaRegListAlt } from 'react-icons/fa';
import { VscChecklist } from "react-icons/vsc";


function Navbar() {
    const navigate = useNavigate();
    const { logout, isLoggedIn, isAdmin, isInstructor, isStudent, isParent } = useAuth ();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleMenu = () => {
        setIsExpanded(!isExpanded);
    };

    const handleLogout = async ( ) => {
        await logout();
        navigate('/login');
    };

    // Just logging user roles for debugging. 
    // Wanted to check that the user is seeing the correct options. 
    console.log(
        "isLoggedIn:", isLoggedIn,
        "isAdmin:", isAdmin(),
        "isInstructor:", isInstructor(),
        "isStudent:", isStudent(),
        "isParent:", isParent()
    );

    return (
        <div className={`side-menu ${isExpanded ? 'expanded' : ''}`}>
            <button onClick={toggleMenu}>Toggle Menu</button>
            <div className="menu-content">
                <nav>
                    <NavigationLink Icon={IoMdHome} to="/" label="Home" />
                    {isLoggedIn && isAdmin() && (
                        <>
                            <NavigationLink Icon={RiUserAddLine} to="/create-user" label="Add User" />
                            <NavigationLink Icon={FaUserEdit} to="/users" label="Manage users" />
                            <NavigationLink Icon={MdOutlineAssignmentInd} to="/student-assignments" label="Student Assignments"/>
                        </>
                    )}
                    {isLoggedIn && (isAdmin() || isInstructor()) && (
                        <>
                            <NavigationLink Icon={FaIndent} to="/write-message" label="Compose Messages" />
                            <NavigationLink Icon={FaRegListAlt} to="/take-attendance" label="Take Attendance" />
                            <NavigationLink Icon={VscChecklist} to="/view-attendance" label="View Attendance Records" />
                        </>
                    )}
                    {isLoggedIn && (
                        <>
                            <NavigationLink Icon={CiMail} to="/messages" label="Read Messages" />
                        </>
                    )}
                    {isLoggedIn && (
                        <button onClick={handleLogout}>Logout</button>
                    )}
            </nav>
        </div>
    </div>
       
    );
}

export default Navbar;