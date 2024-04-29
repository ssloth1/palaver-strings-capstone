import React, { useState, useEffect } from 'react';
import AttendanceService from '../../../services/attendanceServices';
import ClassService from '../../../services/classServices';
import Loader from '../../general-components/Loader';
import '../styles/UpdateAttendanceRecords.css';

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
                const response = await ClassService.getAllClasses();
                setClasses(response);
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
            const response = await AttendanceService.getAttendanceDates(classId);
            const localDates = response.map(date => {
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
        const localDate = new Date(year, month - 1, day).toISOString().split('T')[0];

        setSelectedDate(dateString);
        fetchAttendance(selectedClass, localDate);
    };

    const fetchAttendance = async (classId, date) => {
        setAttendance([]);
        setAttendanceId('');

        setIsLoading(true);
        try {
            const response = await AttendanceService.getAttendanceByClassDate(classId, date);
            console.log("Received attendance data:", response.data);
            if (response && response._id) {
                setAttendanceId(response._id);
                setAttendance(response.students);
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
        if (!studentId) return;
        console.log(`Changing status for ${studentId} to ${status}`);

        const updatedAttendance = attendance.map(att => {

            if (att.student && att.student._id === studentId) {
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
            const updateResponse = await AttendanceService.updateAttendance(attendanceId, { attendance: formattedAttendance});
            console.log("Attendance updated.", updateResponse);
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
        <div className="UpdateAttendanceRecords">
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
                    <div key={index} className="attendanceEntry">
                        <span className="studentName">{att.student ? `${att.student.firstName} ${att.student.lastName}` : 'Student data not available'}</span>
                        {['present', 'late', 'absent - excused', 'absent - unexcused'].map((status) => (
                            <label key={status} className="radioLabel">
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
                <button type="submit" className="button">Update Attendance</button>
                {statusMessage && <p>{statusMessage}</p>}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default UpdateAttendanceRecords;


