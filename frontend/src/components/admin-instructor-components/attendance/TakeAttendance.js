import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import axios from "axios";
import styles from "../styles/TakeAttendance.module.css";
import Loader from "../../general-components/Loader";

function TakeAttendance() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");

    const { isLoggedIn, isAdmin, isInstructor } = useContext(AuthContext);

    const [attendanceData, setAttendanceData] = useState({
        classId: "",
        date: new Date().toISOString().split('T')[0], 
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

    const fetchStudentsFromClass = async (classId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/api/classes/${classId}`);
            const studentsInClass = response.data.students || [];
            console.log(response.data);
            setStudents(studentsInClass);

            // If no students enrolled set default message
            if(studentsInClass.length === 0) {
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
        const localDate = new Date(e.target.value + 'T00:00:00');
        const adjustedDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        setAttendanceData(prevData => ({
            ...prevData,
            date: adjustedDate.toISOString().split('T')[0]
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
                                <span>{student.firstName} {student.lastName} - {student._id}</span>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={attendanceData.attendance.some(item => item.studentId === student._id && item.status === 'present')}
                                        onChange={() => handleAttendanceChange(student._id, 'present')} 
                                    />
                                    present
                                </label>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={attendanceData.attendance.some(item => item.studentId === student._id && item.status === 'late')}
                                        onChange={() => handleAttendanceChange(student._id, 'late')} 
                                    />
                                    late
                                </label>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={attendanceData.attendance.some(item => item.studentId === student._id && item.status === 'absent - excused')}
                                        onChange={() => handleAttendanceChange(student._id, 'absent - excused')} 
                                    />
                                    absent - excused
                                </label>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={attendanceData.attendance.some(item => item.studentId === student._id && item.status === 'absent - unexcused')}
                                        onChange={() => handleAttendanceChange(student._id, 'absent - unexcused')} 
                                    />
                                    absent - unexcused
                                </label>
                            </div>
                        ))}
                    </div>
                )}
                <button type="submit">Record Attendance</button>
                {statusMessage && <p>{statusMessage}</p>}
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default TakeAttendance;


