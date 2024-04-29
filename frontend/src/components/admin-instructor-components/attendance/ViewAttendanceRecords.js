import React, { useEffect, useState } from 'react';
import AttendanceService from '../../../services/attendanceServices';
import ClassService from '../../../services/classServices';
import '../styles/ViewAttendanceRecords.css';
import Loader from '../../general-components/Loader';
import UserService from '../../../services/userServices';


function ViewAttendanceRecords() {
    const [records, setRecords] = useState([]);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({ classId: '', studentId: '', dateFrom: '', dateTo: '' });

    useEffect(() => {
        const fetchRecords = async () => {
            setIsLoading(true);
            try {
                const [classData, attendanceData, studentData] = await Promise.all([
                    ClassService.getAllClasses(),
                    AttendanceService.getAllAttendance(),
                    UserService.getStudents(),
                ]);
                setClasses(classData);
                setRecords(attendanceData);
                setStudents(studentData);
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

    const handleFilterChange = e => {
        const { name, value } = e.target;
        setFilter(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const params = {
                classId: filter.classId,
                studentId: filter.studentId,
                dateFrom: filter.dateFrom,
                dateTo: filter.dateTo,
            };
            const response = await AttendanceService.getFilteredAttendance(params);
            setRecords(response);
        } catch (error) {
            console.error('Failed to fetch filtered attendance:', error);
            setError('Failed to load filtered attendance. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <Loader />;
    if (error) return <div>error: {error}</div>;

    return (
        <div className="attendanceRecords">
        <h2>Attendance Records</h2>
        <div>
            <select name="classId" value={filter.classId} onChange={handleFilterChange}>
                <option value="">Select Class</option>
                {classes.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
            <select name="studentId" value={filter.studentId} onChange={handleFilterChange}>
        <option value="">Select Student</option>
        {students.map(s => (
            <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>
        ))}
    </select>
            <input type="date" name="dateFrom" value={filter.dateFrom} onChange={handleFilterChange} />
            <input type="date" name="dateTo" value={filter.dateTo} onChange={handleFilterChange} />
            <button onClick={handleSearch}>Search</button>
        </div>
        {isLoading ? <Loader /> : error ? <div>Error: {error}</div> : records.length > 0 ? (
            records.map((record) => (
                <div key={record._id} className="recordCard">
                    <p>Date: {displayDate(record.date)}</p>
                    <p>Class: {record.class && record.class.name}</p>
                    <p>Instructor: {record.class && record.class.instructor ? `${record.class.instructor.firstName} ${record.class.instructor.lastName}` : 'Instructor not assigned'}</p>
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
        ) : <p>No attendance records found.</p>}
    </div>
);

}

export default ViewAttendanceRecords;