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
    if (error) return <div>error: {error}</div>;

    return (
        <div className={styles.attendanceRecords}>
            <h2>attendance records</h2>
            {records.length > 0 ? (
                <ul>
                    {records.map((record) => (
                        <li key={record._id}>
                            <p>date: {new Date(record.date).toLocaleDateString()}</p>
                            <p>class id: {record.class && record.class.name}</p>
                            {record.students && record.students.length > 0 ? (
                                <ul>
                                    {record.students.map((att, index) => (
                                        <li key={index}>
                                            <p>student: {att.student.firstName}  {att.student.lastName}</p> 
                                            <p>status: {att.status}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>no attendance data available.</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>no attendance records found.</p>
            )}
        </div>
    );
}

export default ViewAttendanceRecords;