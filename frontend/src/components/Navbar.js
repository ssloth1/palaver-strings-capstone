import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

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
                <Link to="/">Home</Link>
                {isLoggedIn && isAdmin() && <Link to="/create-user">Add User</Link>}
                {isLoggedIn && isAdmin() && <Link to="/users">Manage Users</Link>}
            </nav>
        </div>
    </div>
       
    );
}

export default Navbar;