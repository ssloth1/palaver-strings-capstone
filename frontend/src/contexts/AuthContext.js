import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(); // Creates a new context for authentication

// AuthProvider component to provide authentication state and functions
export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track the login status
    const [userType, setUserType] = useState(null); // State to track user types
    const [userId, setUserId] = useState(null); // State to track user details

    // Effect to check for saved login status in local storage
    useEffect(() => {
        const savedUserType = localStorage.getItem('userType');
        const savedUserId = localStorage.getItem('userId');
        if (savedUserType && savedUserId) {
            setIsLoggedIn(true);
            setUserType(savedUserType);
            setUserId(savedUserId);
        }
    }, []);

    // Function to handle login for a user
    const login = (userDetails) => {
        console.log('User details:', userDetails);
        setIsLoggedIn(true);
        setUserType(userDetails.type);
        setUserId(userDetails.id); // Correctly setting the user ID
        localStorage.setItem('userType', userDetails.type);
        localStorage.setItem('userId', userDetails.id);
    };

    // Function to handle logout for a user
    const logout = () => {
        setIsLoggedIn(false);
        setUserType(null);
        setUserId(null);
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
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
        userId,
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