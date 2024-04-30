import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(); // Creates a new context for authentication

// AuthProvider component to provide authentication state and functions
export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track the login status
    const [userType, setUserType] = useState([]); // State to track user types
    const [userId, setUserId] = useState(null); // State to track user details
    const [userPermissions, setUserPermissions] = useState([]); //State to track user Permissions

    // Effect to check for saved login status in local storage
    useEffect(() => {
        const savedUserType = localStorage.getItem('userType');
        const savedUserId = localStorage.getItem('userId');
        const savedUserPermissions = localStorage.getItem('userPermissions')
        if (savedUserType && savedUserId && savedUserPermissions) {
            setIsLoggedIn(true);
            setUserType(savedUserType);
            setUserId(savedUserId);
            setUserPermissions(savedUserPermissions);
        }
    }, []);

    // Function to handle login for a user
    const login = (userDetails) => {
        console.log('User details:', userDetails);
        setIsLoggedIn(true);
        setUserType(userDetails.type);
        setUserId(userDetails.id); // Correctly setting the user ID
        setUserPermissions(userDetails.permissions);
        localStorage.setItem('userType', userDetails.type);
        localStorage.setItem('userId', userDetails.id);
        localStorage.setItem('permissions', userDetails.permissions);
    };

    // Function to handle logout for a user
    const logout = () => {
        setIsLoggedIn(false);
        setUserType([]);
        setUserId(null);
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        localStorage.removeItem('permissions');
    };

    // Helper functions to check user's role
    const isAdmin = () => userType.includes('admin');
    const isInstructor = () => userType.includes('instructor');
    const isStudent = () => userType.includes('student');
    const isParent = () => userType.includes('parent');

    // Helper Functions to check user's permissions
    const isDatabaseAdmin = () => userPermissions.includes('database admin');
    const isStaffManager = () => userPermissions.includes('staff manager');
    const isDataManager = () => userPermissions.includes('data manager');
    const isScheduler = () => userPermissions.includes('scheduler');

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
        isParent,
        isDatabaseAdmin,
        isStaffManager,
        isDataManager,
        isScheduler
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Allows a component to access the authentication context
export function useAuth() {
    return useContext(AuthContext);
}