import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../general-components/Loader';
import './styles/UserDetails.css'; // Make sure your styles are correctly linked

function UserDetails() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/admins/users/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setError(error.toString());
                setLoading(false);
            });
    }, [id]);

    // Handles loading state
    if (loading) {
        return <Loader />;
    }

    // Handles error state
    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    // Handles user not found state
    if (!user) {
        return <Loader />;
    }

    // Render user details
    return (
        <div className="user-details-container">
            <h1 className="user-details-heading">{user.firstName} {user.lastName}</h1>
            <p className="user-detail"><span className="user-detail-title">Email:</span> {user.email}</p>
            <p className="user-detail"><span className="user-detail-title">Role:</span> {user.role}</p>
            
            {/*Function to help render fields for specific roles*/ }
            {renderRoleSpecificFields(user)}
            
            <p className="user-detail"><span className="user-detail-title">Phone Number:</span> {user.phoneNumber || 'Not provided'}</p>
            <p className="user-detail"><span className="user-detail-title">Preferred Communication:</span> {user.preferredCommunication || 'Not provided'}</p>
            <p className="user-detail"><span className="user-detail-title">Gender:</span> {user.gender}</p>
            <p className="user-detail"><span className="user-detail-title">Race/Ethnicity:</span> {user.raceEthnicity}</p>
            <p className="user-detail"><span className="user-detail-title">Primary Language:</span> {user.primaryLanguage}</p>
            <div className="user-detail">
                <span className="user-detail-title">Address:</span>
                <address className="user-detail-list">
                    {user.address.addressLine1 && <div className="user-detail-list-item">{user.address.addressLine1}</div>}
                    {user.address.addressLine2 && <div className="user-detail-list-item">{user.address.addressLine2}</div>}
                    <div className="user-detail-list-item">
                        {user.address.city}{user.address.city && user.address.state ? ', ' : ''}{user.address.state} {user.address.zipCode}
                    </div>
                    {user.address.country && <div className="user-detail-list-item">{user.address.country}</div>}
                </address>
            </div>
        </div>
    );
}

// Function that helps render details more specific to the user's role.
function renderRoleSpecificFields(user) {
    switch (user.role) {
        case 'admin':
            return (
                <>
                    <p className="user-detail"><span className="user-detail-title">Org Email:</span> {user.orgEmail}</p>
                    {user.secondaryEmail && <p className="user-detail"><span className="user-detail-title">Secondary Email:</span> {user.secondaryEmail}</p>}
                    <p className="user-detail"><span className="user-detail-title">Permissions:</span> {user.permissions.join(', ')}</p>
                </>
            );
        case 'instructor':
            return (
                <>
                    <p className="user-detail"><span className="user-detail-title">Org Email:</span> {user.orgEmail}</p>
                    <p className="user-detail"><span className="user-detail-title">Number of Students:</span> {user.students?.length || 0}</p>
                </>
            );
        case 'parent':
            return (
                <>
                    <p className="user-detail"><span className="user-detail-title">Parent Email:</span> {user.parentEmail}</p>
                    <p className="user-detail"><span className="user-detail-title">Discount Percentage:</span> {user.discountPercentage}%</p>
                    <p className="user-detail"><span className="user-detail-title">Children:</span> {user.children}</p>
                </>
            );
        case 'student':
            return (
                <>
                    <p className="user-detail"><span className="user-detail-title">Instrument:</span> {user.instrument}</p>
                    <p className="user-detail"><span className="user-detail-title">Age:</span> {user.age}</p>
                    <p className="user-detail"><span className="user-detail-title">Date of Birth:</span> {new Date(user.dateOfBirth).toLocaleDateString()}</p>
                    <p className="user-detail"><span className="user-detail-title">School:</span> {user.school}</p>
                    <p className="user-detail"><span className="user-detail-title">Grade:</span> {user.grade}</p>
                    <p className="user-detail"><span className="user-detail-title">Parent:</span> {user.parent}</p>
                </>
            );
        default:
            return null;
    }
}

export default UserDetails;