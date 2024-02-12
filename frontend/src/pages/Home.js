import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Home.css";

import { useAuth } from '../contexts/AuthContext';

// Home component displays at the root URL of the application
const Home = () => {
    const navigate = useNavigate(); 
    const { isLoggedIn, logout } = useAuth(); // Extracts the state functions from AuthContext
    
    // Redirect to login page if not logged in (ideally this should never happen)
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    // Handler for logging out 
    const handleLogout = () => {
        logout(); // Logout function from AuthContext
        navigate('/login'); // Navigate user back into the login screen. 
    };

    return (
        <div className="home">
            <header>
                <h1>Welcome back!</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>
        </div>
    );
}

export default Home;