import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../general-components/Loader';
import styles from '../styles/UpdateAttendanceRecords.module.css';

function UpdateAttendanceRecords() {
    const [isLoading, setIsLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [dates, setDates] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [attendanceId, setAttendanceId] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');


    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:4000/api/classes');
                setClasses(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching classes:", error);
                setError("Failed to load classes.");
                setIsLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const handleClassChange = async (e) => {
        const classId = e.target.value;
        setSelectedClass(classId);
        fetchDates(classId);
    };

    const fetchDates = async (classId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/api/attendance/dates/${classId}`);
            const localDates = response.data.map(date => {
                const [year, month, day] = date.split('T')[0].split('-');
                return `${month}/${day}/${year}`;
            });
            setDates(localDates);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching dates:", error);
            setError("Failed to load dates.");
            setIsLoading(false);
        }
    };

    const handleDateChange = async (e) => {
        const dateString = e.target.value;
        const [month, day, year] = dateString.split('/');
        const localDate = new Date(year, month - 1, day);

        setSelectedDate(dateString);
        fetchAttendance(selectedClass, localDate.toISOString().split('T')[0]);

        // const localDate = new Date(e.target.value + 'T00:00:00');
        // const adjustedDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        // setSelectedDate(adjustedDate.toISOString().split('T')[0]);
        // fetchAttendance(selectedClass, adjustedDate.toISOString().split('T')[0]);
    };

    const fetchAttendance = async (classId, date) => {
        setAttendance([]);
        setAttendanceId('');

        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/api/attendance/${classId}/${date}`);
            console.log("Received attendance data:", response.data);
            if (response.data && response.data._id) {
                setAttendanceId(response.data._id);
                setAttendance(response.data.students);
            } else {
                setAttendanceId('');
                setAttendance([]);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching attendance record:", error);
            setError("Failed to load attendance record.");
            setIsLoading(false);
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        if(!studentId) return;
        console.log(`Changing status for ${studentId} to ${status}`);

        const updatedAttendance = attendance.map(att => {

            if(att.student && att.student._id === studentId) {
                return { ...att, status: status };
            }
            return att;
        });
        setAttendance(updatedAttendance);
        console.log(updatedAttendance);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!attendanceId) {
            setError('No attendance record selected for the update.');
            return;
        }

        const formattedAttendance = attendance.map(att => ({
            studentId: att.student._id,
            status: att.status,
            _id: att._id
        }));

        console.log("Submitting data:", JSON.stringify(formattedAttendance, null, 2));

        setIsLoading(true);
        try {
            const response = await axios.patch(`http://localhost:4000/api/attendance/${attendanceId}`, { attendance: formattedAttendance });
            console.log("Attendance updated.", response.data);
            setStatusMessage(`Status updated to successfully`);
            setError('');
        } catch (error) {
            console.error("Error updating attendance", error.message);
            setError('Failed to update attendance.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("Attendance data fetched:", attendance);
    }, [attendance]);
    

    if (isLoading) return <Loader />;

    return (
        <div className={styles.UpdateAttendanceRecords}>
            <form onSubmit={onSubmit}>
                <select value={selectedClass} onChange={handleClassChange} required>
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>{cls.name}</option>
                    ))}
                </select>
                <select value={selectedDate} onChange={handleDateChange} required>
                    <option value="">Select Date</option>
                    {dates.map(date => (
                        <option key={date} value={date}>{date}</option>
                    ))}
                </select>
                {attendance.length === 0 && <p>No attendance data available. Please check if the data is correctly loaded.</p>}
                {attendance.map((att, index) => (
                    <div key={index} className={styles.attendanceEntry}>
                        <span className={styles.studentName}>{att.student ? `${att.student.firstName} ${att.student.lastName}` : 'Student data not available'}</span>
                        {['present', 'late', 'absent - excused', 'absent - unexcused'].map((status) => (
                            <label key={status} className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name={`status-${att.student?._id}`}
                                    checked={att.status === status}
                                    onChange={() => handleAttendanceChange(att.student?._id, status)}
                                />
                                {status}
                            </label>
                        ))}
                    </div>
                ))}
                <button type="submit" className={styles.button}>Update Attendance</button>
                {statusMessage && <p>{statusMessage}</p>}
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
}

export default UpdateAttendanceRecords;



