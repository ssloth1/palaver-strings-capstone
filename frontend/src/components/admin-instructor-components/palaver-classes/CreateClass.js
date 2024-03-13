import React, { useState, useEffect } from "react";
import axios from "axios";
import classService from "../../../services/classServices";
import { WEEKDAYS } from "../../../constants/formconstants";

function CreateClass() {
    const [classData, setClassData] = useState({
        name: '',
        instructor: '',
        meetingDay: [],
        meetingTime: '',
    });
    const [instructors, setInstructors] = useState([]); 
    const [submitStatus, setSubmitStatus] = useState('');

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
    
        fetchInstructors();
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
                meetingTime: classData.meetingTime,
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
            <h2>Add New Class</h2>
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
                        <option value="">Select Instructor</option>
                        {instructors.map(instructor => (
                            <option key={instructor._id} value={instructor._id}>
                                {`${instructor.firstName} ${instructor.lastName}`} {/* Display full name */}
                            </option>
                        ))}
                    </select>    
                    <input
                        type="time"
                        name="meetingTime"
                        value={classData.meetingTime}
                        onChange={handleChange} 
                        required
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
                    <button type="submit">Add Class</button>    
                </form>
                {submitStatus && <p>{submitStatus}</p>}
        </div>
    );

}


export default CreateClass;