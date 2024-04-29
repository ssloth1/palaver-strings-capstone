import React, { useState, useEffect } from "react";
import ClassService from "../../../services/classServices";
import { WEEKDAYS } from "../../../constants/formconstants";
import UserService from "../../../services/userServices";
import '../styles/ViewClasses.css';

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedInstructors = await UserService.getInstructors();
                const fetchedStudents = await UserService.getStudents();
                setInstructors(fetchedInstructors);
                setStudents(fetchedStudents);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setSubmitStatus(`Failed to fetch data: ${error.message || 'Unknown error'}`);
            }
        };
        
        fetchData();
    }, []);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('Submitting...');
        try { 
            const submissionData = { ...classData };
            const response = await ClassService.addClass(submissionData);
            console.log(response);
            setSubmitStatus('Class added successfully!');
        } catch (error) {
            console.error(error);
            setSubmitStatus(`Error adding class: ${error.message || 'Unknown error'}`);
        }
        setIsSubmitting(false);
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
                    <select
                        name="classroom"
                        value={classData.classroom}
                        onChange={handleChange}
                        required
                    >
                        <option value="">select classroom</option>
                        {['Studio 1', 'Studio 2', 'Studio 3', 'Studio 4', 'Studio 5', 'Studio 6'].map((classroom) => (
                            <option key={classroom} value={classroom}>{classroom}</option>
                        ))}
                    </select>
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
                                <label htmlFor={`student-${student._id}`} className="student-label">{`${student.firstName} ${student.lastName}`}</label>
                            </div>
                        ))}
                        </div>
                    <button type="submit" disabled={isSubmitting}>add class</button>    
                </form>
                {submitStatus && <p>{submitStatus}</p>}
        </div>
    );

}


export default CreateClass;