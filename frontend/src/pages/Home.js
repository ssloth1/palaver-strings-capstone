import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import StudentDetails from "../components/StudentDetails";
import { useAuth } from '../contexts/AuthContext';

const Home = () => {


    const [students, setStudents] = useState(null); // State to hold the list of students fetched from the backend
    const navigate = useNavigate(); // Hook to programmatically navigate to a new page
    const { isLoggedIn, logout } = useAuth(); // Extract isLoggedIn state and logout method from the AuthContext

    // Effect to redirect to the login page if the user is not authenticated
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    // Effect to fetch the list of students from the backend
    useEffect(() => {
        const fetchStudents = async () => {
            const response = await fetch('/api/students');
            const json = await response.json();

            // Update the sutdents state if the API call was successful
            if (response.ok) {
                setStudents(json);
            }
        };
        fetchStudents();
    }, []);

    // Handler for the logout button
    const handleLogout = () => {
        logout();  // Use the logout method from the context
        navigate('/login');
    };

    return (
        <div className="home">
            <header>
                <h1>Welcome!</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>
            <div className="students">
                {students && students.map((student) => (
                    <StudentDetails key={student._id} student={student}/>
                ))}
            </div>
        </div>
    );
}

export default Home;
