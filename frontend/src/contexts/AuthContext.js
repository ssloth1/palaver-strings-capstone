import { createContext, useContext, useState, useEffect } from 'react';

// Creates a 'Context' for authentication-related data and methods
const AuthContext = createContext();

// I made this custom hook to provide a shorthand for useContext(AuthContext)
export function useAuth() {
    return useContext(AuthContext);
}

// Provider component to wrap parts of the app where AuthContext should be accessible
export function AuthProvider({ children }) {

    // Tracks if the user is logged in or not. Initialized to true if a token is stored locally.
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));

    // Effect to listen for changes in local storage, especially when the user logs out in another tab
    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('adminToken'));
        };
        
        // Add event listener for storage changes
        window.addEventListener('storage', handleStorageChange);

        // Cleanup: remove the event listener when the compnent de-mounts (Remember to pick up your toys when you're done playing!)
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Method to set the user as logged in.
    const login = () => setIsLoggedIn(true);

    // Method to log the user out and remove the token from localstorage
    const logout = () => {
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
    };

    // The value that will be provid
    const value = {
        isLoggedIn,
        login,
        logout
    };

    // Provides the AuthContext to child components
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}