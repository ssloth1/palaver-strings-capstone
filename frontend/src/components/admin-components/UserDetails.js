import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '../general-components/Loader';
import './styles/UserDetails.css'; 

/**
 * This component fetches and displays the details of a user based on the user's ID.
 * It also fetches and displays additional details specific to the user's role.
 * @returns {JSX} elements that render the user's details
 */
function UserDetails() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [children, setChildren] = useState([]);
    const [parent, setParent] = useState([]);


    useEffect(() => {
        setLoading(true);
        // Fetch user details
        fetch(`/api/users/${id}`)
            .then(response => response.json())
            .then(data => {
                setUser(data);
                setLoading(false);
                // If the user is a parent, fetch their children
                if (data.roles.includes('parent')) {
                    fetch(`/api/parents/${id}/children`)
                        .then(response => response.json())
                        .then(childrenData => {
                            console.log('Children fetched:', childrenData);
                            setChildren(childrenData);
                        })
                        .catch(error => {
                            console.error('Fetch children error:', error);
                        });
                }
                // If the user is a student, fetch their parent
                if (data.roles.includes('student')) {
                    fetch(`/api/students/${id}/parent`)
                        .then(response => response.json())
                        .then(parentData => {
                            console.log('Parent fetched:', parentData);
                            setParent(parentData);
                        })
                        .catch(error => {
                            console.error('Fetch parent error:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Fetch user error:', error);
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

    console.log(user.age);

    // Render user details
    return (
        <div className="user-details-container">
            <h1 className="user-details-heading">{user.firstName} {user.lastName}</h1>
            <p className="user-detail"><span className="user-detail-title">Email:</span> {user.email}</p>
            <p className="user-detail"><span className="user-detail-title">Role:</span> {user.role}</p>
            
            {/*Function to help render fields for specific roles*/ }
            {renderRoleSpecificFields(user, children, parent)}

            {user.roles.includes('admin') ? 
                <>
                <p className="user-detail"><span className="user-detail-title">Org Email:</span> {user.orgEmail}</p>
                {user.secondaryEmail && <p className="user-detail"><span className="user-detail-title">Secondary Email:</span> {user.secondaryEmail}</p>}
                <p className="user-detail"><span className="user-detail-title">Permissions:</span> {user.permissions.join(', ')}</p>
            </>
                : <></>
            }

            {user.roles.includes('instructor') ? 
                <>
                    <p className="user-detail"><span className="user-detail-title">Org Email:</span> {user.orgEmail}</p>
                    <p className="user-detail"><span className="user-detail-title">Number of Students:</span> {user.students?.length || 0}</p>
                </> 
                : <></>
            }

            {user.roles.includes('parent') ? 
                <>
                <p className="user-detail"><span className="user-detail-title">Parent Email:</span> {user.parentEmail}</p>
                <p className="user-detail"><span className="user-detail-title">Discount Percentage:</span> {user.discountPercentage}%</p>
                <div className="user-detail">
                    <span className="user-detail-title">Children:</span>
                    <ul>
                        {children.map((child, index) => (
                            <li key={index}>
                                <Link to={`/user-details/${child._id}`}>
                                    {child.firstName} {child.lastName}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </>
                : <></>
            }

            {user.roles.includes('student') ? 
                <>
                <p className="user-detail"><span className="user-detail-title">Instrument:</span> {user.instrument}</p>
                <p className="user-detail"><span className="user-detail-title">Age:</span> {user.age}</p>
                <p className="user-detail"><span className="user-detail-title">Date of Birth:</span> {new Date(user.dateOfBirth).toLocaleDateString()}</p>
                <p className="user-detail"><span className="user-detail-title">School:</span> {user.school}</p>
                <p className="user-detail"><span className="user-detail-title">Grade:</span> {user.grade}</p>
                {parent && (
                    <p className="user-detail">
                        <span className="user-detail-title">Parent:</span> 
                        <Link to={`/user-details/${parent._id}`}>
                            {parent.firstName} {parent.lastName}
                        </Link>
                    </p>
                )}
            </>
                : <></>
            }

            
            
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
            <p className="user-detail">
                <span className="user-detail-title">Account Created On:</span> 
                {new Date(user.createdAt).toLocaleString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
                })}
            </p>     
        </div>
    );
}

// Function that helps render details more specific to the user's role.
function renderRoleSpecificFields(user, children, parent) {
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
                    <div className="user-detail">
                        <span className="user-detail-title">Children:</span>
                        <ul>
                            {children.map((child, index) => (
                                <li key={index}>
                                    <Link to={`/user-details/${child._id}`}>
                                        {child.firstName} {child.lastName}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
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
                    {parent && (
                        <p className="user-detail">
                            <span className="user-detail-title">Parent:</span> 
                            <Link to={`/user-details/${parent._id}`}>
                                {parent.firstName} {parent.lastName}
                            </Link>
                        </p>
                    )}
                </>
            );
        default:
            return null;
    }
}

export default UserDetails;