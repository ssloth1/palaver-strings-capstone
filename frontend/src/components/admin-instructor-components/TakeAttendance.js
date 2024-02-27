import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import styles from "./styles/TakeAttendance.module.css";
import Loader from "../general-components/Loader";

function TakeAttendance () {
    console.log("TakeAttendance");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [students, setStudents] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [classes, setClasses] = useState([]);
    const {
        isLoggedIn,
        isAdmin,
        isInstructor
    } = useContext(AuthContext);

    const [attendanceData, setAttendanceData] = useState({
        classId: "",
        date: "",
        attendance: []
    });

    useEffect (() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:4000/api/students');
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students", error);
            }finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, [attendanceData.classId]);

    useEffect (() => {
        const fetchClasses = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAttendanceData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAttendanceChange = (index, event) => {
        const updatedAttendance = attendanceData.attendance.map((item, i) => {
            if (i === index) {
                return { ...item, [event.target.name]: event.target.value };
            }
            return item;
        });

        setAttendanceData(prevData => ({
            ...prevData,
            attendance: updatedAttendance
        }));
    };

    const addAttendanceRow = () => {
        setAttendanceData(prevData => ({
            ...prevData,
            attendance: [...prevData.attendance, { studentId: "", status: ""}]
        }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        if(!isAdmin && !isInstructor){
            console.error("Only admins or instructors can take attendance.");
            setStatusMessage("Only admins or instructors can take attendance.");
            return;
        }

        if(!isLoggedIn){
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
                <input type="text" name="classId" value={attendanceData.classId} onChange={handleChange} placeholder="Class ID" required/>
                <input type="date" name="date" value={attendanceData.date} onChange={handleChange} required />
                {attendanceData.attendance.map((item, index) => (
                    <div key = {index}>
                        <select name="studentId" value={item.studentId} onChange={(event) => handleAttendanceChange(index, event)} required />
                        <option value=""> Select Student</option>
                        {students.map((student) => (
                            <option key={student._id} value={student._id}>
                                {student.name} - {student.id}
                            </option>
                        ))}
                        <select name="status" value={item.status} onChange={(event) => handleAttendanceChange(index, event)} required>
                            <option value="">Select Status</option>
                            <option value="present">Present</option>
                            <option value="absent - unexcused">Absent - Unexcused</option>
                            <option value="absent - excused">Absent - Excused</option>
                        </select>
                    </div>
                ))}
                <button type="button" onClick={addAttendanceRow}>Add Student</button>
                <button type="submit">Record Attendance</button>
                {statusMessage && <p>{statusMessage}</p>}
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default TakeAttendance;