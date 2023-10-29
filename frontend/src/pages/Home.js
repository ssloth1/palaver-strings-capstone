import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import StudentDetails from "../components/StudentDetails";

const Home = () => {
    const [students, setStudents] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await fetch('/api/students');
            const json = await response.json();

            if (response.ok) {
                setStudents(json);
            }
        };
        fetchStudents();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <div className="home">
            <header>
                <h1>Welcome Admin</h1>
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
