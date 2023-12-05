import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(); // Creates a new context for authentication

// AuthProvider component to provide authentication state and functions
export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track the login status
    const [userType, setUserType] = useState(null); // State to track user types

    // Effect to check for saved login status in local storage
    useEffect(() => {
        const savedUserType = localStorage.getItem('userType');
        if (savedUserType) {
            setIsLoggedIn(true);
            setUserType(savedUserType);
        }
    }, []);

    // Function to handle login for a user
    const login = (userDetails) => {
        setIsLoggedIn(true);
        setUserType(userDetails.type);
        localStorage.setItem('userType', userDetails.type);
    };

    // Function to handle logout for a user
    const logout = () => {
        setIsLoggedIn(false);
        setUserType(null);
        localStorage.removeItem('userType');
    };

    // Helper functions to check user's role
    const isAdmin = () => userType === 'admin';
    const isInstructor = () => userType === 'instructor';
    const isStudent = () => userType === 'student';
    const isParent = () => userType === 'parent';

    // Context values that will be accessible to the components that use this context
    const value = {
        isLoggedIn,
        userType,
        login,
        logout,
        isAdmin,
        isInstructor,
        isStudent,
        isParent
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Allows a component to access the authentication context
export function useAuth() {
    return useContext(AuthContext);
}