import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../general-components/Loader';

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
        fetchClasses();
    }, []);

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

    const handleClassChange = async (e) => {
        const classId = e.target.value;
        setSelectedClass(classId);
        fetchDates(classId);
    };

    const fetchDates = async (classId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/api/attendance/dates/${classId}`);
            setDates(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching dates:", error);
            setError("Failed to load dates.");
            setIsLoading(false);
        }
    };

    const handleDateChange = async (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        fetchAttendance(selectedClass, date);
    };

    const fetchAttendance = async (classId, date) => {
        setAttendance([]);
        setAttendanceId('');
        
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/api/attendance/${classId}/${date}`);
            console.log("Received attendance data:", response.data);
            if(response.data && response.data._id){
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
        console.log(`Changing status for ${studentId} to ${status}`);

        const updatedAttendance = attendance.map(att => {
            if(att.student._id === studentId) {
                return { ...att, status: status };
            }
            return att;
        });
        setAttendance(updatedAttendance);
        console.log(updatedAttendance);

        
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if(!attendanceId) {
            setError('No attendance record selected for the update.');
            return;
        }

        const formattedAttendance = attendance.map(att => ({
            studentId: att.student._id,
            status: att.status,
            _id: att._id
        }));

        console.log("Submitting data:", JSON.stringify(formattedAttendance, null, 2)); // Log data being sent

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

    if (isLoading) return <Loader />;

    return (
        <div>
            <h1>update attendance record</h1>
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
                        <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>
                    ))}
                </select>
                {attendance.length === 0 && <p>No attendance data available. Please check if the data is correctly loaded.</p>}
                {attendance.map((att, index) => (
                    <div key={index}>
                        <span>{att.student ? `${att.student.firstName} ${att.student.lastName}` : 'Student data not available'}</span>
                        <select value={att.status} onChange={(e) => handleAttendanceChange(att.student._id, e.target.value)}>
                            <option value="present">Present</option>
                            <option value="late">Late</option>
                            <option value="absent - excused">Absent - Excused</option>
                            <option value="absent - unexcused">Absent - Unexcused</option>
                        </select>
                    </div>
                ))}
                <button type="submit">Update Attendance</button>
                {statusMessage && <p>{statusMessage}</p>}
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default UpdateAttendanceRecords;



/*
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Loader from '../../general-components/Loader';
import classService from '../../../services/classServices';
import { AuthContext } from '../../../contexts/AuthContext';


function UpdateAttendanceRecord() {
    const { attendanceId } = useParams();
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClass] = useState('');
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [attendanceData, setAttendanceData] = useState({
        attendance: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { isLoggedIn, isAdmin, isInstructor } = useContext(AuthContext);

    useEffect(() => {
        const fetchAllClasses = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/classes');
                console.log("Fetched classes:", response);
                if (response && Array.isArray(response.data) && response.data.length > 0) {
                    setClasses(response.data); // Assuming this is correct and response.data is the array of classes
                } else {
                    setClasses([]);
                    console.error("No data returned from getAllClasses");
                }
            } catch (error) {
                console.error("Failed to fetch class details:", error);
                setClasses([]);
            }
        };

        fetchAllClasses();
    }, []);

    useEffect(() => {
        if (!selectedClassId) return;
        const fetchDatesForClass = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/attendance/dates/${selectedClassId}`);
                setDates(response.data);
                setSelectedDate('');
            } catch (error) {
                console.error('Error fetching dates:', error);
                setError("Failed to load dates.");
            }
        };

        fetchDatesForClass();
    }, [selectedClassId]);

    useEffect(() => {
        if (!selectedDate || !selectedClassId) return;
        const fetchAttendanceData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/api/attendance/${selectedClassId}/${selectedDate}`);
                if(response.data && response.data.attendance) {
                    setAttendanceData(response.data);
                } else {
                    setAttendanceData({ attendance: [] });
                }
            } catch (error) {
                console.error('Error fetching attendance record:', error);
                setAttendanceData({ attendance: [] });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendanceData();
    }, [selectedDate, selectedClassId]);

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleStatusChange = (studentId, status) => {
        const updatedAttendance = attendanceData.attendance.map(item => 
            item.studentId === studentId ? { ...item, status } : item
        );

        setAttendanceData(prevData => ({
            ...prevData,
            attendance: updatedAttendance
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.put(`http://localhost:4000/attendance/${selectedClassId}/${selectedDate}`, attendanceData);
            console.log('Attendance updated:', response.data);
            setError('');
        } catch (error) {
            console.error('Error updating attendance:', error.message);
            setError('Failed to update attendance.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <Loader />;
    if (error) return <p className="error">{error}</p>;
    if (!attendanceData) return <p>Select a class and date to view attendance</p>;

    return (
        <div className={UpdateAttendanceRecord}>
            <select value={selectedClassId} onChange={handleClassChange}>
                <option value="">Select Class</option>
                {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
            </select>

            <select value={selectedDate} onChange={handleDateChange} disabled={!selectedClassId}>
                <option value="">Select Date</option>
                {dates.map(date => (
                    <option key={date} value={date}>{date}</option>
                ))}
            </select>

            <form onSubmit={handleSubmit}>
                {attendanceData.attendance.map(student => (
                    <div key={student.studentId}>
                        <span>{student.name} - {student.studentId}</span>
                        {['present', 'late', 'absent - excused', 'absent - unexcused'].map(status => (
                            <label key={status}>
                                <input
                                    type="radio"
                                    checked={student.status === status}
                                    onChange={() => handleStatusChange(student.studentId, status)}
                                />  
                                {status}
                            </label>
                        ))}
                    </div>
                ))}
                <button type="submit">Update Attendance</button>
            </form>
        </div>
    );
}

export default UpdateAttendanceRecord;
*/
