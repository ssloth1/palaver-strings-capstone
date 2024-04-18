import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/UserViewTab.css';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaAngleDown, FaAngleRight } from 'react-icons/fa';
import Loader from '../general-components/Loader';

/**
 * Helper function to export parent data to an Excel file
 * @param {*} parents 
 */
const exportToExcel = (parents) => {
    const ws = XLSX.utils.json_to_sheet(parents.map(parent => ({
        'First Name': parent.firstName,
        'Last Name': parent.lastName,
        'Email': parent.email,
        'Address Line 1': parent.address.addressLine1,
        'Address Line 2': parent.address.addressLine2,
        'City': parent.address.city,
        'State': parent.address.state,
        'Zip Code': parent.address.zipCode,
        'Phone Number': parent.phoneNumber,
        'Preferred Communication': parent.preferredCommunication,
        'Gender': parent.gender,
        'Race/Ethnicity': parent.raceEthnicity,
        'Primary Language': parent.primaryLanguage,
        'Created': new Date(parent.createdAt).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        }),
        'Children': parent.children.map(child => child.name).join(', ')
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Parents');
    XLSX.writeFile(wb, 'parents.xlsx');
};

/**
 * Assists in displaying parent data in a table format, with the ability to export to Excel.
 * @returns ParentViewTab component 
 */
const ParentViewTab = () => {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedParentId, setExpandedParentId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchParents = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/parents');
                if (!response.ok) throw new Error('Network response was not ok');
                let parentsData = await response.json();

                // Fetch details for each child of each parent
                const parentsWithChildren = await Promise.all(parentsData.map(async (parent) => {
                    const childrenDetails = await Promise.all(parent.children.map(async (childId) => {
                        const childResponse = await fetch(`/api/users/${childId}`);
                        if (!childResponse.ok) {
                            console.error('Failed to fetch child details');
                            return { id: childId, name: 'Unknown', firstName: 'Unknown', lastName: '' };
                        }
                        const childData = await childResponse.json();
                        return {
                            id: childId,
                            name: `${childData.firstName} ${childData.lastName}`
                        };
                    }));
                    return { ...parent, children: childrenDetails };
                }));

                setParents(parentsWithChildren);
            } catch (error) {
                console.error('Error fetching parents:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchParents();
    }, []);

    /**
     * Helper function to handle clicking on a child's name, navigating to the child's details page
     * @param {*} childId 
     * @param {*} event 
     */
    const handleChildClick = (childId, event) => {
        event.stopPropagation();
        navigate(`/user-details/${childId}`);
    };

    /**
     * Helper function to toggle the display of children for a parent, expanding or collapsing the list
     * @param {*} parentId 
     */
    const toggleChildrenDisplay = (parentId) => {
        setExpandedParentId(prevId => prevId === parentId ? null : parentId);
    };

    const filteredParents = parents.filter(parent =>
        parent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );


    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;


    return (
        <div className='overall-container'>
            <div className='table-container'>
                <input
                    type="text"
                    className='search-input'
                    placeholder='Search parents...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Address Line 1</th>
                            <th>Address Line 2</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Zip Code</th>
                            <th>Phone Number</th>
                            <th>Preferred Communication</th>
                            <th>Gender</th>
                            <th>Race/Ethnicity</th>
                            <th>Primary Language</th>
                            <th>Created</th>
                            <th>Children</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredParents.map((parent) => (
                            <React.Fragment key={parent._id}>
                                <tr key={parent._id}>
                                    <td>{parent.firstName}</td>
                                    <td>{parent.lastName}</td>
                                    <td>{parent.email}</td>
                                    <td>{parent.address.addressLine1}</td>
                                    <td>{parent.address.addressLine2}</td>
                                    <td>{parent.address.city}</td>
                                    <td>{parent.address.state}</td>
                                    <td>{parent.address.zipCode}</td>
                                    <td>{parent.phoneNumber}</td>
                                    <td>{parent.preferredCommunication}</td>
                                    <td>{parent.gender}</td>
                                    <td>{parent.raceEthnicity}</td>
                                    <td>{parent.primaryLanguage}</td>
                                    <td>{new Date(parent.createdAt).toLocaleDateString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric',
                                    })}</td>
                                    <td>
                                        {parent.children.length === 1 ? (
                                            // If there is only one child, display the name and make it clickable
                                            <div onClick={(e) => handleChildClick(parent.children[0].id, e)} style={{ cursor: 'pointer' }}>
                                                {parent.children[0].name}
                                            </div>
                                        ) : parent.children.length > 1 ? (
                                            // If there are multiple children, show a dropdown icon to expand/collapse the list
                                            <div onClick={() => toggleChildrenDisplay(parent._id)} style={{ cursor: 'pointer' }}>
                                                {expandedParentId === parent._id ? <FaAngleDown /> : <FaAngleRight />} Multiple Children
                                            </div>
                                        ) : (
                                            // If there are no children
                                            <div> - </div>
                                        )}
                                    </td>
                                </tr>
                                {expandedParentId === parent._id && parent.children.map((child, index) => (
                                    // Render all children in the dropdown when expanded, ensuring they are all clickable
                                    <tr key={child.id} onClick={(e) => handleChildClick(child.id, e)}>
                                        <td colSpan="100%" style={{ cursor: 'pointer', paddingLeft: '20px' }}>
                                            {child.name}
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={() => exportToExcel(parents)} className="export-button">
                <FaFileExcel /> Export to Excel
            </button>
        </div>
    );
};

export default ParentViewTab;