import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import NavigationLink from './NavigationLink.js';
import './styles/Navbar.css';
import { IoMdHome } from "react-icons/io";
import { RiUserAddLine } from "react-icons/ri";
import { FaUserEdit } from 'react-icons/fa'; 
import { MdOutlineAssignmentInd } from "react-icons/md";


function Navbar() {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleMenu = () => {
        setIsExpanded(!isExpanded);
    };

    // Unpack the values form AuthContext
    const {
        isLoggedIn, 
        isAdmin, 
        isInstructor, 
        isStudent, 
        isParent 
    } = useContext(AuthContext);

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
            </nav>
        </div>
    </div>
       
    );
}

export default Navbar;