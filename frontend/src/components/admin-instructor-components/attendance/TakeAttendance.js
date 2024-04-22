import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import axios from "axios";
import styles from "../styles/TakeAttendance.module.css";
import Loader from "../../general-components/Loader";
import moment from 'moment';
//import { set } from "mongoose";

function TakeAttendance() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [canSubmit, setCanSubmit] = useState(true);

    const { isLoggedIn, isAdmin, isInstructor } = useContext(AuthContext);

    const [attendanceData, setAttendanceData] = useState({
        classId: "",

        date: moment().format('YYYY-MM-DD'), 
        attendance: []
    });

    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:4000/api/classes');
                setClasses(response.data);
            } catch (error) {
                console.error("Error fetching classes", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClasses();
    }, []);

    useEffect(() => {
        if (attendanceData.classId && attendanceData.date) {
            checkForExistingAttendanceRecord(attendanceData.classId, attendanceData.date);
            fetchStudentsFromClass(attendanceData.classId);
        }
    }, [attendanceData.classId, attendanceData.date]);

    const fetchStudentsFromClass = async (classId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/api/classes/${classId}`);
            const studentsInClass = response.data.students || [];
            console.log(response.data);
            setStudents(studentsInClass);

            // If no students enrolled set default message
            if (studentsInClass.length === 0) {
                setStatusMessage("There are no students currently enrolled in this class. Attendance can't be taken.");
            } else {
                setStatusMessage("");
                const defaultAttendance = studentsInClass.map(student => ({
                    studentId: student._id,
                    status: 'present'
                }));
                setAttendanceData(prevData => ({
                    ...prevData,
                    attendance: defaultAttendance
                }));
            }
        } catch (error) {
            console.error("Error fetching students", error);
            setStatusMessage("Failed to fetch students. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const checkForExistingAttendanceRecord = async (classId, date) => {
        setIsLoading(true);
        console.log(`Checking records for class ${classId} on date ${date}`);
        try {
            const response = await axios.get(`http://localhost:4000/api/attendance/${classId}/${date}`);
            console.log("Check response: ", response.data);
            if (response.data.data === null || response.data.length === 0) {
                console.log("No existing record found, can submit new record.");
                setError('');
                setCanSubmit(true);
            } else {
                console.log("Existing record found, cannot submit.");
                setError("An attendance record for this class and date already exists. Please modify the existing record or select a different date or class.");
                setCanSubmit(false);
            }
        } catch (error) {
            console.error("Error checking existing attendance", error);
            setError("Failed to check for existing attendance. Please try again.");
            setCanSubmit(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAttendanceData(prevData => ({
            ...prevData,
            [name]: value
        }));

        fetchStudentsFromClass(value); // Fetch students for the selected class
    };

    const handleAttendanceChange = (studentId, status) => {
        const filteredAttendance = attendanceData.attendance.filter(item => item.studentId !== studentId);
        const updatedAttendance = [...filteredAttendance, { studentId, status }];


        setAttendanceData(prevData => ({
            ...prevData,
            attendance: updatedAttendance
        }));
    };

    const handleDateChange = (e) => {
        setAttendanceData(prevData => ({
            ...prevData,
            date: e.target.value
        }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        console.log('URL being called:', 'http://localhost:4000/api/attendance');
        console.log("Sending data:", JSON.stringify(attendanceData, null, 2));
        console.log("Date being sent:", attendanceData.date);

        if (!isAdmin && !isInstructor) {
            console.error("Only admins or instructors can take attendance.");
            setStatusMessage("Only admins or instructors can take attendance.");
            return;
        }

        if (!isLoggedIn) {
            console.error("Your login has expired. You must be logged in to take attendance.");
            setStatusMessage("Your login has expired. You must be logged in to take attendance.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:4000/api/attendance', attendanceData);
            console.log("Attendance recorded.", response.data);
            setStatusMessage("Attendance recorded!");
            setError('');
        } catch (error) {
            console.error("Error recording attendance", error.message);
            setStatusMessage("Error recording attendance");
            setError('Failed to record attendance.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className={styles.TakeAttendance}>
            <form onSubmit={onSubmit}>
                <select name="classId" value={attendanceData.classId} onChange={handleChange} required>
                    <option value="">select class</option>
                    {classes.map((classItem) => (
                        <option key={classItem._id} value={classItem._id}>
                            {classItem.name}
                        </option>
                    ))}
                </select>
                <input type="date" name="date" value={attendanceData.date} onChange={handleDateChange} required />
                {students.length > 0 && (
                    <div>
                        {students.map((student) => (
                            <div key={student._id}>
                                <span className={styles.studentName}>{student.firstName} {student.lastName}</span>
                                {['present', 'late', 'absent - excused', 'absent - unexcused'].map(status => (
                                    <label key={status} className={styles.radioLabel}>
                                        <input
                                            type="radio"
                                            name={`attendance-${student._id}`}
                                            checked={attendanceData.attendance.some(item => item.studentId === student._id && item.status === status)}
                                            onChange={() => handleAttendanceChange(student._id, status)}
                                            className={styles.radioInput}
                                        />
                                        {status}
                                    </label>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
                <button type="submit" disabled={!canSubmit}>Record Attendance</button>
                {statusMessage && <p>{statusMessage}</p>}
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
}

export default TakeAttendance;


