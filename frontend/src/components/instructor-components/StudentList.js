import React, { useContext, useState } from "react";
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

const StudentList = () => {
    const {
        isLoggedIn,
        isInstructor,
        userId // Access the userId from context
    } = useContext(AuthContext);

    const [studentList, setStudentList] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");

    const getStudents = async () => {
        if (!isLoggedIn) {
            console.error("Your login has expired. You must be logged in to view students.");
            setStatusMessage("Your login has expired. You must be logged in to view students.");
            return;
        }

        if (!isInstructor()) { // Note: isInstructor is a function
            console.error("Only instructors can view students.");
            setStatusMessage("Only instructors can view students.");
            return;
        }

        try {
            const response = await axios.get(`/api/instructors/${userId}/students`); // Use userId in the API call
            console.log(response.data);
            setStudentList(response.data);
        } catch (error) {
            console.error("Error retrieving student list: " + error);
            setStatusMessage("Error retrieving student list: " + error);
        }
    };

    return (
        <div>
            <h2>Student List</h2>
            <button onClick={getStudents}>Get Student List</button>
            <p>{statusMessage}</p>
            <ul>
                {studentList.map((student, index) => (
                    <li key={index}>{student.email}</li>
                ))}
            </ul>
        </div>
    );
}

export default StudentList;