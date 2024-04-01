import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/UserViewTab.css';
import * as XLSX from 'xlsx';
import { FaFileExcel } from 'react-icons/fa';
import Loader from '../general-components/Loader';

const exportToExcel = (admins) => {
    const ws = XLSX.utils.json_to_sheet(admins.map(admin => ({
        'First Name': admin.firstName,
        'Last Name': admin.lastName,
        'Email': admin.email,
        'Address Line 1': admin.address.addressLine1,
        'Address Line 2': admin.address.addressLine2 || '',
        'City': admin.address.city,
        'State': admin.address.state,
        'Zip Code': admin.address.zipCode,
        'Phone Number': admin.phoneNumber,
        'Preferred Communication': admin.preferredCommunication,
        'Gender': admin.gender,
        'Race/Ethnicity': admin.raceEthnicity,
        'Primary Language': admin.primaryLanguage,
        'Created': new Date(admin.createdAt).toLocaleDateString('en-US'),
        'Permissions': admin.permissions.join(', ')
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Admins');
    XLSX.writeFile(wb, 'admins.xlsx');
};

const AdminViewTab = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAdmins = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/admins');
                if (!response.ok) throw new Error('Network response was not ok');
                const adminsData = await response.json();
                setAdmins(adminsData);
            } catch (error) {
                setError(error.toString());
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    const handleRowClick = (adminId) => {
        console.log('Clicked on admin with ID:', adminId);
        navigate(`/user-details/${adminId}`);
    };

    const filteredAdmins = admins.filter(admin =>
        admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='overall-container'>
            <div className='table-container'>
                <input
                    type="text"
                    className='search-input'
                    placeholder='Search admins...'
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
                            <th>Permissions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAdmins.map(admin => (
                            <tr key={admin._id} onClick={() => handleRowClick(admin._id)} style={{ cursor: 'pointer' }}>
                                <td>{admin.firstName}</td>
                                <td>{admin.lastName}</td>
                                <td>{admin.email}</td>
                                <td>{admin.address.addressLine1}</td>
                                <td>{admin.address.addressLine2}</td>
                                <td>{admin.address.city}</td>
                                <td>{admin.address.state}</td>
                                <td>{admin.address.zipCode}</td>
                                <td>{admin.phoneNumber}</td>
                                <td>{admin.preferredCommunication}</td>
                                <td>{admin.gender}</td>
                                <td>{admin.raceEthnicity}</td>
                                <td>{admin.primaryLanguage}</td>
                                <td>{new Date(admin.createdAt).toLocaleDateString('en-US')}</td>
                                <td>{admin.permissions.join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={() => exportToExcel(admins)} className="export-button">
                <FaFileExcel /> Export to Excel
            </button>
        </div>
    );
};

export default AdminViewTab;