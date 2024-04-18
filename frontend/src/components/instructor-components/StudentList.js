import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import Loader from '../general-components/Loader';

const StudentList = () => {

    const navigate = useNavigate();

    const {
        isLoggedIn,
        isInstructor,
        userId
    } = useContext(AuthContext);

    const [studentList, setStudentList] = useState([[]]);
    const [statusMessage, setStatusMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        // Function to get the list of students of the current instructor from the server
        const getStudents = async () => {

            setLoading(true);
            
            // If the user is not logged in, they cannot view students
            if (!isLoggedIn) {
                console.error("Your login has expired. You must be logged in to view students.");
                setStatusMessage("Your login has expired. You must be logged in to view students.");
                setLoading(false);
                return;
            }
            
            // Only instructors can view students
            if (!isInstructor()) {
                console.error("Only instructors can view students.");
                setStatusMessage("Only instructors can view students.");
                setLoading(false);
                return;
            }            

            // Fetch the list of the current instructor's students using their userId as a reference
            try {
                const classes = await axios.get('/api/classes/');
                console.log(classes);
                //const response = await axios.get(`/api/users/${localStorage.getItem('userId')}`);
                const studentArray = new Array();
                for (const item of classes.data) {
                    if (item.instructor._id === localStorage.getItem('userId')){
                        studentArray.push(item.students);
                    }
                }
                console.log(studentArray);
                /*
                for (const student of response.data.students) {
                    var nextStudent = await axios.get(`/api/users/${student}`)
                    studentArray.push(nextStudent.data);
                }
                */
                setStudentList(studentArray);
            } catch (error) {
                console.error("Error retrieving student list: " + error);
                setStatusMessage("Error retrieving student list: " + error);
            } finally {
                setLoading(false);
            }

        };

        // Call getStudents when the component mounts
        getStudents();

    }, [isLoggedIn, isInstructor, userId]); // Dependencies array, re-run the effect if these values change

    // If the data is still loading, display a loading spinner
    if (loading) {
        return <Loader />;
    }

    const handleStudentClick = (studentId) => {
        navigate(`/user/${studentId}`);
    };

    // Modify the return statement to include onClick handler for each student
    return (
        <div>
            <h2>My Students</h2>
            
            <ul>
                {studentList[0].map((student) => (
                    // Correct the function call here to match the defined function name
                    <li key={student._id} onClick={() => handleStudentClick(student._id)}>
                        Name: {student.firstName} {student.lastName}, Email: {student.email}
                    </li>
                ))}
            </ul>
            <p>{statusMessage}</p>
            
        </div>
    );
}

export default StudentList;