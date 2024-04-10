import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/UserViewTab.css';
import * as XLSX from 'xlsx';
import { FaFileExcel } from 'react-icons/fa';
import Loader from '../general-components/Loader';


/**
 * Helps to export a list of students to a PDF file.
 * Might need some minor adjustments, but it should work -Jim
 * @param {*} students 
 */
const exportToExcel = (students) => {
    const ws = XLSX.utils.json_to_sheet(students.map(student => ({
        'First Name': student.firstName,
        'Last Name': student.lastName,
        'Email': student.email,
        'Address Line 1': student.address.addressLine1,
        'Address Line 2': student.address.addressLine2 || '',
        'City': student.address.city,
        'State': student.address.state,
        'Zip Code': student.address.zipCode,
        'Phone Number': student.phoneNumber,
        'Preferred Communication': student.preferredCommunication,
        'Gender': student.gender,
        'Race/Ethnicity': student.raceEthnicity,
        'Primary Language': student.primaryLanguage,
        'Created': new Date(student.createdAt).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        }),
        'Instrument': student.instrument || student.customInstrument,
        'Date of Birth': new Date(student.dateOfBirth).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        }),
        'School': student.school,
        'Grade': student.grade,
        'How Heard About Program': student.howHeardAboutProgram,
        'Parent': student.parentDetails ? `${student.parentDetails.firstName} ${student.parentDetails.lastName}` : '',
        'Primary Instructor': student.instructorDetails ? `${student.instructorDetails.firstName} ${student.instructorDetails.lastName}` : '',
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students.xlsx");
};


/**
 * Helps to display a list of students in a table format.
 * @returns HTML for the Student View tab.
 */
const StudentViewTab = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('/api/students');
                if (!response.ok) throw new Error('Network response was not ok');
                let data = await response.json();

                const studentDetailsPromises = data.map(async (student) => {
                    let parentDetails = {}, instructorDetails = {};
                    if (student.parent) {
                        try {
                            const parentResponse = await fetch(`/api/users/${student.parent}`);
                            if (!parentResponse.ok) throw new Error('Failed to fetch parent details');
                            parentDetails = await parentResponse.json();
                        } catch (error) {
                            console.error('Error fetching parent details:', error);
                            parentDetails = {};
                        }
                    }
                    if (student.primaryInstructor) {
                        try {
                            const instructorResponse = await fetch(`/api/users/${student.primaryInstructor}`);
                            if (!instructorResponse.ok) throw new Error('Failed to fetch instructor details');
                            instructorDetails = await instructorResponse.json();
                        } catch (error) {
                            console.error('Error fetching instructor details:', error);
                            instructorDetails = {};
                        }
                    }
                    return { ...student, parentDetails, instructorDetails };
                });

                const enhancedData = await Promise.all(studentDetailsPromises);
                setStudents(enhancedData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);



    /**
     * Handles a row click event, which will navigate to the user details page.
     * @param {*} studentId 
     */
    const handleRowClick = (studentId) => {
        console.log(`Clicked on student with ID: ${studentId}`);
        navigate(`/user-details/${studentId}`);
    };

    /**
     * Handles when a parent is clicked, in their respective cell.
     * Navigates to the parent's details page.
     * @param {*} e 
     * @param {*} parentId 
     */
    const handleParentClick = (e, parentId) => {
        e.stopPropagation();
        if (!parentId) {
            console.log(`Clicked on parent with ID: ${parentId}`);
            navigate(`/user-details/${parentId}`);
        }
    };

    /**
     * Handles when an instructor is clicked, in their respective cell.
     * Navigates to the instructor's details page.
     * @param {*} e
     * @param {*} instructorId
     */
    const handleInstructorClick = (e, instructorId) => {
        e.stopPropagation();
        if (instructorId) {
            console.log(`Clicked on instructor with ID: ${instructorId}`);
            navigate(`/user-details/${instructorId}`);
        }
    }

    // Filter students based on search term
    const filteredStudents = students.filter(student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;


    return (
        <div className='overall-container'>
            <div className='table-container'>
                <input
                    type="text"
                    className='search-input'
                    placeholder="Search students..."
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
                            <th>Instrument</th>
                            <th>Date of Birth</th>
                            <th>School</th>
                            <th>Grade</th>
                            <th>How Heard About Program</th>
                            <th>Parent</th>
                            <th>Primary Instructor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(student => (
                            <tr key={student._id} onClick={() => handleRowClick(student._id)} style={{ cursor: 'pointer' }}>
                                <td>{student.firstName}</td>
                                <td>{student.lastName}</td>
                                <td>{student.email}</td>
                                <td>{student.address.addressLine1}</td>
                                <td>{student.address.addressLine2}</td>
                                <td>{student.address.city}</td>
                                <td>{student.address.state}</td>
                                <td>{student.address.zipCode}</td>
                                <td>{student.phoneNumber}</td>
                                <td>{student.preferredCommunication}</td>
                                <td>{student.gender}</td>
                                <td>{student.raceEthnicity}</td>
                                <td>{student.primaryLanguage}</td>
                                <td>{new Date(student.createdAt).toLocaleDateString('en-US', {
                                    month: '2-digit',
                                    day: '2-digit',
                                    year: 'numeric',
                                })}</td>

                                {/* Student specific fields */}
                                <td>{student.instrument || student.customInstrument}</td>
                                <td>{new Date(student.dateOfBirth).toLocaleDateString('en-US', {
                                    month: '2-digit',
                                    day: '2-digit',
                                    year: 'numeric',
                                })}</td>
                                <td>{student.school}</td>
                                <td>{student.grade}</td>
                                <td>{student.howHeardAboutProgram}</td>
                                <td onClick={student.parentDetails?._id ? (e) => handleParentClick(e, student.parentDetails._id) : undefined}>
                                    {student.parentDetails ? `${student.parentDetails.firstName ?? ''} ${student.parentDetails.lastName ?? ''}`.trim() : ''}
                                </td>
                                <td onClick={student.instructorDetails?._id ? (e) => handleInstructorClick(e, student.instructorDetails._id) : undefined}>
                                    {student.instructorDetails ? `${student.instructorDetails.firstName ?? ''} ${student.instructorDetails.lastName ?? ''}`.trim() : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={() => exportToExcel(students)} className="export-button">
                <FaFileExcel /> Export to Excel
            </button>
        </div>
    );
};

export default StudentViewTab;