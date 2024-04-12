import React, {useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../general-components/Loader";
import classService from "../../../services/classServices";

function ModifyAttendanceRecord () {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const[dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [attendanceData, setAttendanceData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllClasses = async () => {
            try {
                const response = await classService.getAllClasses();
                setClasses(response);
            } catch (error) {
                console.error("Faiiled to fetch class details:", error);
            }
        };

        fetchAllClasses();
    }, []);

    useEffect(() => {
        const fetchDatesForClass = async () => {
            if (!selectedClass) return;
            try {
                const response = await axios.get(`http://localhost:4000/dates/${selectedClass}`);
                setDates(response.data);
                setSelectedDate('');
            } catch (error) {
                console.error('Error fetching dates:', error);
            }
        };
        
        fetchDatesForClass();
    }, [selectedClass]);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            if (!selectedDate || !selectedClass) return;
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/attendance/${selectedClass}/${selectedDate}`);
                setAttendanceData(response.data);
            } catch (error) {
                console.error('Error fetching attendance record:', error);
                setError('Failed to fetch attendance record.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchAttendanceData();
    }, [selectedDate, selectedClass]);

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

        setAttendanceData({
            ...attendanceData,
            attendance: updatedAttendance
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.put(`https://localhost:4000/attendance/${selectedClass}/${selectedDate}`, attendanceData);
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
    if (!attendanceData) return <p>Select a class and date to view attendance</p>;

    return (
        <div>
            <select value={selectedClass} onChange={handleClassChange}>
                <option value="">select class</option>
                {classes.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>

            <select value={selectedDate} onChange={handleDateChange} disabled={!selectedClass}>
                <option value="">select date</option>
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
                <button type="submit">update attendance</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default ModifyAttendanceRecord;