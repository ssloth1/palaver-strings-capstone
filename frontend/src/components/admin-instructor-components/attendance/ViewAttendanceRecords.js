import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/ViewAttendanceRecords.module.css';
import Loader from '../../general-components/Loader';

function ViewAttendanceRecords() {
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
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

    const displayDate = (utcDateString) => {
        const date = new Date(utcDateString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return date.toLocaleDateString();
    };

    if (isLoading) return <Loader />;
    if (error) return <div>error: {error}</div>;

    return (
        <div className={styles.attendanceRecords}>
            <h2>Attendance Records</h2>
            {records.length > 0 ? (
                records.map((record) => (
                    <div key={record._id} className={styles.recordCard}>
                        <p>Date: {displayDate(record.date)}</p>
                        <p>Class ID: {record.class && record.class.name}</p>
                        {record.students && record.students.length > 0 ? (
                            <ul>
                                {record.students.map((att, index) => (
                                    <li key={index}>
                                        <p>Student: {att.student ? `${att.student.firstName} ${att.student.lastName}` : 'Student data missing'}</p>
                                        <p>Status: {att.status}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No attendance data available.</p>
                        )}
                    </div>
                ))
            ) : (
                <p>No attendance records found.</p>
            )}
        </div>
    );
}

export default ViewAttendanceRecords;