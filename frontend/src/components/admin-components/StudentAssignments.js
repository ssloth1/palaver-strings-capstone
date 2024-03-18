import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/StudentAssignments.css';
import Loader from '../general-components/Loader';

function StudentAssignments() {
    // State hooks to store the students and instructors data
    const [students, setStudents] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const studentsData = await axios.get('/api/students');
            const instructorsData = await axios.get('/api/instructors');
            setStudents(studentsData.data);
            setInstructors(instructorsData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    // Function to handle the instructor change for a student
    const handleInstructorChange = async (studentId, newInstructorId) => {
        console.log(`Handling instructor change for student ID: ${studentId} to instructor ID: ${newInstructorId}`);
        try {
            // Find the student's current instructor ID from the students state
            const currentInstructorId = students.find(student => student._id === studentId)?.primaryInstructor;
            console.log(`Current instructor ID: ${currentInstructorId}`);

            
            // Check if the student is being reassigned (not just assigned for the first time or unassigned)
            if (currentInstructorId && newInstructorId !== 'unassigned' && currentInstructorId !== newInstructorId) {
                // Construct the endpoint for the swap operation
                const endpoint = `/api/instructors/${newInstructorId}/swapStudent`;
                console.log(`Swapping student ${studentId} from instructor ${currentInstructorId} to instructor ${newInstructorId}`);
    
                // Prepare the request body with the studentId
                const body = { studentId };
                console.log(`Request body:`, body)
    
                // Send the PATCH request to perform the swap
                await axios.patch(endpoint, body);
                console.log('Swap operation successful');
    
                // Optimistically update the students state to reflect the new assignment
                setStudents(prevStudents =>
                    prevStudents.map(student => {
                        if (student._id === studentId) {
                            return { ...student, primaryInstructor: newInstructorId };
                        }
                        return student;
                    }),
                );
            } else {
                // Handle the regular assignment or unassignment if not a swap scenario
                let endpoint = `/api/instructors/${newInstructorId}/assignStudent`;
                console.log(`Assigning student ${studentId} to instructor ${newInstructorId}`);

                let body = { studentId };
                console.log(`Request body:`, body);
    
                if (newInstructorId === 'unassigned') {
                    endpoint = `/api/instructors/${currentInstructorId}/unassignStudent`;
                }
    
                await axios.patch(endpoint, body);
                console.log('Assignment operation successful');
    
                // Update the students state to reflect the change
                setStudents(prevStudents =>
                    prevStudents.map(student => {
                        if (student._id === studentId) {
                            return { ...student, primaryInstructor: newInstructorId !== 'unassigned' ? newInstructorId : null };
                        }
                        return student;
                    }),
                );
            }
        } catch (error) {
            console.error('Assignment operation failed:', error);
        }
    };


    // State hook to store the loading state of the component
    if (loading) {
        return <Loader />;
    }

    return (
        <div className="layout-container">

            {/* Column for student assignments */}
            <div className="column">
                <div className="student-assignments-container">
                    <h1 className="student-assignments-title">assign students</h1>
                    {students.map((student) => (
                        <div key={student._id} className="student-item">
                            <span className="student-name">{student.firstName} {student.lastName} -- {student.instrument || 'Instrument not specified'}</span>
                            <select
                                className="student-dropdown"
                                value={student.primaryInstructor || 'unassigned'}
                                onChange={(e) => handleInstructorChange(student._id, e.target.value)}
                            >
                                <option value="unassigned">Unassigned</option>
                                {instructors.map((instructor) => (
                                    <option key={instructor._id} value={instructor._id}>
                                        {instructor.firstName} {instructor.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* Column for displaying instructors and their assigned students */}
            <div className="layout-container">
                <div className="column">
                    <div className="student-assignments-container">
                        {instructors.map((instructor) => (
                            <div key={instructor._id} className="instructor-assignments-container">
                                <h2 className="student-assignments-title">{instructor.firstName} {instructor.lastName}'s Students</h2>
                                <div className="student-item">
                                    <ul className="student-name">
                                        {students.filter(student => student.primaryInstructor === instructor._id).map(filteredStudent => (
                                            <li key={filteredStudent._id}>{filteredStudent.firstName} {filteredStudent.lastName} -- {filteredStudent.instrument || 'Instrument not specified'}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentAssignments;