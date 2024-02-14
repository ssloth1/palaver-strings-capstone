import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function UserDetails() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    // Fetch the user details from the database.
    useEffect(() => {
        fetch(`/api/admins/users/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setUser(data))
            .catch(error => {
                console.error('Fetch error:', error);
                setError(error.toString());
            });
    }, [id]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    // Function the handle rendering role-specific fields based on the type of user.
    const renderRoleSpecificFields = () => {
        switch (user.role) {
            case 'admin':
                return (
                    <>
                        <p>Org Email: {user.orgEmail}</p>
                        {user.secondaryEmail && <p>Secondary Email: {user.secondaryEmail}</p>}
                        <p>Permissions: {user.permissions.join(', ')}</p>
                    </>
                );
            case 'instructor':
                return (
                    <>
                        <p>Org Email: {user.orgEmail}</p>
                        <p>Number of Students: {user.students?.length || 0}</p>
                    </>
                );
            case 'parent':
                return (
                    <>
                        <p>Parent Email: {user.parentEmail}</p>
                        <p>Discount Percentage: {user.discountPercentage}%</p>
                        <p>Children: {user.children}</p>
                    </>
                );
            case 'student':
                return (
                    <>
                        <p>Instrument: {user.instrument}</p>
                        <p>Age: {user.age}</p>
                        <p>Date of Birth: {new Date(user.dateOfBirth).toLocaleDateString()}</p>
                        <p>School: {user.school}</p>
                        <p>Grade: {user.grade}</p>
                        <p>Parent: {user.parent}</p>
                    </>
                );
            default:
                return null;
        }
    };

    // General User Fields:
    return (
        <div>
            <h1>User Details</h1>
            <p>Name: {user.firstName} {user.lastName}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            {/* Render role-specific fields */}
            {renderRoleSpecificFields()}
            <p>Phone Number: {user.phoneNumber || 'Not provided'}</p>
            <p>Preferred Communication: {user.preferredCommunication || 'Not provided'}</p>
            <p>Gender: {user.gender}</p>
            <p>Race/Ethnicity: {user.raceEthnicity}</p>
            <p>Primary Language: {user.primaryLanguage}</p>
            <p>Address:</p>
            <ul>
                <li>Country: {user.address.country}</li>
                <li>Address Line 1: {user.address.addressLine1}</li>
                <li>Address Line 2: {user.address.addressLine2 || ''}</li>
                <li>City: {user.address.city}</li>
                <li>State: {user.address.state}</li>
                <li>Zip Code: {user.address.zipCode || ''}</li>
            </ul>   
        </div>
    );
}

export default UserDetails;