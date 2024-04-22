import React, { useState, useEffect } from "react";
import axios from "axios";
import classService from "../../../services/classServices";
import { WEEKDAYS } from "../../../constants/formconstants";

function CreateClass() {
    const [classData, setClassData] = useState({
        name: '',
        instructor: '',
        meetingDay: [],
        startTime: '',
        endTime: '',
        classroom: '',
        students: [],
    });
    const [instructors, setInstructors] = useState([]); 
    const [submitStatus, setSubmitStatus] = useState('');
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchInstructors = async () => {
            // Assuming your backend has a route to fetch instructors
            try {
                const { data } = await axios.get('/api/instructors');
                console.log("Fetched instructors:", data);
                setInstructors(data);
            } catch (error) {
                console.error("Failed to fetch instructors:", error);
            }
        };

        const fetchStudents = async () => {
            try {
                const { data } = await axios.get('/api/students/');
                console.log("Fetched students:", data);
                setStudents(data);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            }
        };
    
        fetchInstructors();
        fetchStudents();
    }, []); // Dependency array is empty to run only once on mount

    
    const handleDaySelection = (day) => {
        console.log("Selected day:", day);
        setClassData(prevState => ({
            ...prevState,
            meetingDay: prevState.meetingDay.includes(day)
            ? prevState.meetingDay.filter(d => d !== day) // remove day if already selected
            : [...prevState.meetingDay, day]
        }));
    }

    const handleStudentSelection = (studentId) => {
        setClassData(prevState => ({
            ...prevState,
            students: prevState.students.includes(studentId)
            ? prevState.students.filter(id => id !== studentId)
            : [...prevState.students, studentId]
        }));
    }

    // Handle input change
    const handleChange = (event) => {
        const { name, value } = event.target;
        setClassData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitStatus('Submitting...');
        try {
            const submissionData = {
                name: classData.name,
                instructor: classData.instructor,
                meetingDay: classData.meetingDay,
                startTime: classData.startTime,
                endTime: classData.endTime,
                classroom: classData.classroom,
                students: classData.students,
            };
            const response = await classService.addClass(submissionData);
            console.log(response);
            setSubmitStatus('Class added successfully!');
        } catch (error) {
            console.error(error);
            setSubmitStatus('Error adding class.');
        }
    };

    return (
        <div>
            <h2>add new class</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={classData.name}
                        placeholder="Class Name"
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="instructor"
                        value={classData.instructor}
                        onChange={handleChange}
                        required
                    >
                        <option value="">select instructor</option>
                        {instructors.map(instructor => (
                            <option key={instructor._id} value={instructor._id}>
                                {`${instructor.firstName} ${instructor.lastName}`} {/* Display full name */}
                            </option>
                        ))}
                    </select>    
                    <input
                        type="time"
                        name="startTime"
                        value={classData.startTime}
                        onChange={handleChange} 
                        required
                    />
                    <input
                        type="time"
                        name="endTime"
                        value={classData.endTime}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="classroom"
                        value={classData.classroom}
                        onChange={handleChange}
                    />
                    <div>
                        {WEEKDAYS.map(day => (
                            <button 
                                type="button"
                                key={day}
                                onClick={()=> handleDaySelection(day)}
                                className={classData.meetingDay.includes(day) ? 'selected' : '' }
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                    <div>
                        {students.map(student => (
                            <div key={student._id}>
                                <input
                                    type="checkbox"
                                    id={`student-${student._id}`}
                                    checked={classData.students.includes(student._id)}
                                    onChange={() => handleStudentSelection(student._id)}
                                />
                                <label htmlFor={`student-${student._id}`}>{`${student.firstName} ${student.lastName}`}</label>
                            </div>
                        ))}
                        </div>
                    <button type="submit">add class</button>    
                </form>
                {submitStatus && <p>{submitStatus}</p>}
        </div>
    );

}


export default CreateClass;