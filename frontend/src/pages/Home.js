import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from '../contexts/AuthContext';
import Navbar from "../components/Navbar";

const Home = () => {

    const navigate = useNavigate(); // Hook to programmatically navigate to a new page
    const { isLoggedIn, logout } = useAuth(); // Extract isLoggedIn state and logout method from the AuthContext


    // Login/Logout 

    // Effect to redirect to the login page if the user is not authenticated
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    // Handler for the logout button
    const handleLogout = () => {
        logout();  // Use the logout method from the context
        navigate('/login');
    };





    return (
        <div className="home">
            <Navbar />
            <header>
                <h1>Welcome!</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>
        </div>
    );
}

export default Home;
