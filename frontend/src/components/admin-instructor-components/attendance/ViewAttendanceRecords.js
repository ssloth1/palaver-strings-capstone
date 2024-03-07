import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/ViewAttendanceRecords.module.css';
import Loader from '../../general-components/Loader';

function ViewAttendanceRecords () {
    const [ records, setRecords] = useState ([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect (() => {
        const fetchRecords = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:4000/api/attendance');
                setRecords(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Failed to fetch attendance records:', err);
                setError('Failed to load attendance records. Please try again later.');
                setIsLoading(false);
            }
        };
        
        fetchRecords();
    }, []);

    if (isLoading) return <Loader/>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.attendanceRecords}>
            <h2>Attendance Records</h2>
            {records.length > 0 ? (
                <ul>
                    {records.map((record) => (
                        <li key={record._id}>
                            <p>Date: {new Date(record.date).toLocaleDateString()}</p>
                            <p>Class ID: {record.classId}</p>
                            {record.attendance && Array.isArray(record.attendance) ? (
                                <ul>
                                    {record.attendance.map((att, index) => (
                                        <li key={index}>
                                            Student ID: {att.studentId}, Status: {att.status}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No attendance data available.</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No attendance records found.</p>
            )}
        </div>
    );
}

export default ViewAttendanceRecords;