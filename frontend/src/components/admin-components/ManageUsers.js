import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../general-components/Loader';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch the list of users from the database.
    useEffect(() => {
        setLoading(true);
        fetch('/api/admins/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.warn('Received data is not in an array');
                    setUsers([]);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setError(error.toString());
            })
            .finally(() => setLoading(false)); // Stop loading (purely cosmetic)
    }, []);

    // Delete a user from the database.
    const deleteUser = (userId, event) => {
        event.stopPropagation();
        fetch(`/api/admins/users/${userId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                setUsers(users.filter(user => user._id !== userId));
            })
            .catch(error => {
                console.error('Delete error:', error);
                setError(error.toString());
            });
    };

    // Function to navigate to user details when a user is clicked on. 
    const navigateToUserDetails = (userId) => {
        navigate(`/user/${userId}`);
    };

    // If there is an error, display it.
    if (error) {
        return <div>Error: {error}</div>;
    }

    // If the users are still being fetched, display a loading message.
    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <h1>Manage Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user._id} onClick={() => navigateToUserDetails(user._id)}>
                        Name: {user.firstName} {user.lastName}, Email: {user.email}, Type: {user.role}, Created: {new Date(user.createdAt).toLocaleDateString()}
                        <button onClick={(e) => deleteUser(user._id, e)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ManageUsers;