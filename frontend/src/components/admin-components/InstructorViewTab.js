import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/UserViewTab.css';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaAngleDown, FaAngleRight } from 'react-icons/fa';
import Loader from '../general-components/Loader';

/**
 * Helper function to export instructor data to an Excel file
 * @param {*} instructors 
 */
const exportToExcel = (instructors) => {
    const ws = XLSX.utils.json_to_sheet(instructors.map(instructor => ({
        'First Name': instructor.firstName,
        'Last Name': instructor.lastName,
        'Email': instructor.email,
        'Address Line 1': instructor.address.addressLine1,
        'Address Line 2': instructor.address.addressLine2,
        'City': instructor.address.city,
        'State': instructor.address.state,
        'Zip Code': instructor.address.zipCode,
        'Phone Number': instructor.phoneNumber,
        'Preferred Communication': instructor.preferredCommunication,
        'Gender': instructor.gender,
        'Race/Ethnicity': instructor.raceEthnicity,
        'Primary Language': instructor.primaryLanguage,
        'Created': new Date(instructor.createdAt).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        }),
        'Students': instructor.students.map(student => student.name).join(', ')
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Instructors');
    XLSX.writeFile(wb, 'instructors.xlsx');
};

/**
 * Assists in displaying instructor data in a table format, with the ability to export to Excel.
 * @returns ParentViewTab component 
 */
const InstructorViewTab = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedInstructorId, setExpandedInstructorId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInstructors = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/instructors');
                if (!response.ok) throw new Error('Network response was not ok');
                let instructorsData = await response.json();

                // Fetch details for each student of each instructor
                const instructorsWithStudents = await Promise.all(instructorsData.map(async (instructor) => {
                    const studentsDetails = await Promise.all(instructor.students.map(async (studentId) => {
                        const studentResponse = await fetch(`/api/students/${studentId}`);
                        if (!studentResponse.ok) {
                            console.error('Failed to fetch student details');
                            return { id: studentId, name: 'Unknown', firstName: 'Unknown', lastName: '' };
                        }
                        const studentData = await studentResponse.json();
                        return {
                            id: studentId,
                            name: `${studentData.firstName} ${studentData.lastName}`
                        };
                    }));
                    return { ...instructor, students: studentsDetails };
                }));

                setInstructors(instructorsWithStudents);
            } catch (error) {
                console.error('Error fetching instructors:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, []);

    /**
     * Helper function to handle clicking on a students's name, navigating to the students's details page
     * @param {*} studentId 
     * @param {*} event 
     */
    const handleStudentClick = (studentId, event) => {
        event.stopPropagation();
        navigate(`/user-details/${studentId}`);
    };

    /**
     * Helper function to toggle the display of students for a instructor, expanding or collapsing the list
     * @param {*} instructorId 
     */
    const toggleStudentDisplay = (instructorId) => {
        setExpandedInstructorId(prevId => prevId === instructorId ? null : instructorId);
    };

    const filteredInstructors = instructors.filter(instructor =>
        instructor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;


    return (
        <div className='overall-container'>
            <div className='table-container'>
                <input
                    type="text"
                    className='search-input'
                    placeholder='Search instructors...'
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
                        {filteredInstructors.map((instructor) => (
                            <React.Fragment key={instructor._id}>
                                <tr key={instructor._id}>
                                    <td>{instructor.firstName}</td>
                                    <td>{instructor.lastName}</td>
                                    <td>{instructor.email}</td>
                                    <td>{instructor.address.addressLine1}</td>
                                    <td>{instructor.address.addressLine2}</td>
                                    <td>{instructor.address.city}</td>
                                    <td>{instructor.address.state}</td>
                                    <td>{instructor.address.zipCode}</td>
                                    <td>{instructor.phoneNumber}</td>
                                    <td>{instructor.preferredCommunication}</td>
                                    <td>{instructor.gender}</td>
                                    <td>{instructor.raceEthnicity}</td>
                                    <td>{instructor.primaryLanguage}</td>
                                    <td>{new Date(instructor.createdAt).toLocaleDateString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric',
                                    })}</td>
                                    <td>
                                        {instructor.students.length === 1 ? (
                                            // If there is only one student, display the name and make it clickable
                                            <div onClick={(e) => handleStudentClick(instructor.students[0].id, e)} style={{ cursor: 'pointer' }}>
                                                {instructor.students[0].name}
                                            </div>
                                        ) : instructor.students.length > 1 ? (
                                            // If there are multiple students, show a dropdown icon to expand/collapse the list
                                            <div onClick={() => toggleStudentDisplay(instructor._id)} style={{ cursor: 'pointer' }}>
                                                {expandedInstructorId === instructor._id ? <FaAngleDown /> : <FaAngleRight />} Multiple Children
                                            </div>
                                        ) : (
                                            // If there are no students
                                            <div> - </div>
                                        )}
                                    </td>
                                </tr>
                                {expandedInstructorId === instructor._id && instructor.students.map((student, index) => (
                                // Render all students in the dropdown when expanded, ensuring they are all clickable
                                <tr key={student.id} onClick={(e) => handleStudentClick(student.id, e)}>
                                    <td colSpan="100%" style={{ cursor: 'pointer', paddingLeft: '20px' }}>
                                        {student.name}
                                    </td>
                                </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={() => exportToExcel(instructors)} className="export-button">
                <FaFileExcel /> Export to Excel
            </button>
        </div>
    );
};

export default InstructorViewTab;