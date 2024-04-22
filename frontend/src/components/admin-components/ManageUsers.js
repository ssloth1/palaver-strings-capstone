import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../general-components/Loader';
import './styles/ManageUsers.css';
import {IoClose} from 'react-icons/io5';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const usersByRole = {
        'admin':[],
        'instructor':[],
        'parent':[],
        'student':[],
    };

    // This state is used to keep track of which sections are collapsed
    const initialCollapsedState = {
        admin: true,
        student: true,
        instructor: true,
        parent: true,
    };
    const [collapsedSections, setCollapsedSections] = useState(initialCollapsedState);

    // Fetch users on component mount
    useEffect(() => {
        setLoading(true);
        fetch('/api/users/')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            // Set users and filtered users to the response data
            .then(data => {
                setUsers(data);
                setFilteredUsers(data);
            })
            // Set error state if fetch fails
            .catch(error => {
                setError(error.toString());
            })
            // Set loading to false when fetch is complete
            .finally(() => setLoading(false));
    }, []);

    // Filter users based on search term. Also, collapse sections if no users are found in a section
    useEffect(() => {
        const result = users.filter(user =>
            // Check if first name or last name includes the search term
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(result);
        /*
        const rolesInSearchResults = new Set(result.map(user => user.roles));
        setCollapsedSections(prevState => {
            const newState = { ...prevState };
            Object.keys(newState).forEach(role => {
                newState[role] = !rolesInSearchResults.has(role);
            });
            return newState;
        });
        */
    }, [searchTerm, users]);

    // Delete user, and remove from state
    const deleteUser = (userId, event) => {
        event.stopPropagation();
        // Asks for confirmation before deleting user, and then sends a DELETE request to the server
        const isConfirmed = window.confirm("Are you sure you want to remove this user?");
        if (isConfirmed) {
            fetch(`/api/users/${userId}`, { method: 'DELETE' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    setUsers(currentUsers => currentUsers.filter(user => user._id !== userId));
                    setFilteredUsers(currentFilteredUsers => currentFilteredUsers.filter(user => user._id !== userId));
                })
                .catch(error => {
                    setError(error.toString());
                });
        }
    };

    // Navigate to user details page
    const navigateToUserDetails = (userId) => {
        navigate(`/user/${userId}`);
    };

    // Toggle section collapse
    const toggleSection = (role) => {
        setCollapsedSections(prevState => ({
            ...prevState,
            [role]: !prevState[role],
        }));
    };

    // Handles error state
    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    // Handles loading state
    if (loading) {
        return <Loader />;
    }
    
    // Group users by role
    for (const user of filteredUsers) {
        if (user.roles.includes('admin')){
            usersByRole['admin'].push(user);
        }
        if (user.roles.includes('instructor')){
            usersByRole['instructor'].push(user);
        }
        if (user.roles.includes('parent')){
            usersByRole['parent'].push(user);
        }
        if (user.roles.includes('student')){
            usersByRole['student'].push(user);
        }
    }

    // Create sections for each role
    const userSections = Object.entries(usersByRole).map(([role, users]) => (
        <div key={role} className="user-section">
            <div className="section-header" onClick={() => toggleSection(role)}>
                {collapsedSections[role] ? '➤' : '▼'} {role[0].toUpperCase() + role.substring(1)}s
            </div>
            {!collapsedSections[role] && (
                <ul>
                    {users.map(user => (
                        <li key={user._id} onClick={() => navigateToUserDetails(user._id)} className="user-item">
                            {user.firstName} {user.lastName} - {user.email}
                            <button onClick={(e) => deleteUser(user._id, e)} className="delete-button">
                                <IoClose />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    ));
    

    return (
        <div className="manage-users">
            <h1>Manage Users</h1>
            <button className='advanced-view-button' onClick={() => navigate('/advanced-user-view')}>Go to Advanced View</button>
            <input
                type="text"
                placeholder="Search users..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {userSections.length > 0 ? userSections : <p>No users found.</p>}
        </div>
    );
}

export default ManageUsers;