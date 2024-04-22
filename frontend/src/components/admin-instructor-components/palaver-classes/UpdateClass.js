import React, { useState, useEffect} from 'react';
import { useParams, useNavigate} from "react-router-dom";
import axios from 'axios';
import classService from '../../../services/classServices';
import { WEEKDAYS } from '../../../constants/formconstants';
import styles from '../styles/UpdateClass.module.css';


function UpdateClass () {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [allClasses, setAllClasses] = useState([]);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [classData, setClassData] = useState({
        name: '',
        instructor: '',
        meetingDay: [],
        startTime: '',
        students: [],
    });
    const [instructors, setInstructors] = useState([]);
    const [students, setStudents] = useState([]);
    const [submitStatus, setSubmitStatus] = useState('');

    useEffect(() => {
        const fetchAllClasses = async () => {
            try {
                const data = await classService.getAllClasses();
                setAllClasses(data);
            } catch (error) {
                console.error("Failed to fetch class details:", error);
            }
        };

        fetchAllClasses();
    }, []);

    useEffect(() => {
        if(!selectedClassId) return;

        const fetchData = async() => {
            try {
                const ClassDetails = await classService.getClassById(selectedClassId);
                console.log("Selected class details:", ClassDetails);
                setClassData ({
                    name: ClassDetails.name,
                    instructor: ClassDetails.instructor._id,
                    meetingDay: ClassDetails.meetingDay,
                    startTime: ClassDetails.startTime,
                    endTime: ClassDetails.endTime,
                    classroom: ClassDetails.classroom,
                    students: ClassDetails.students.map(student => student._id),
                });
            } catch (error) {
                console.error("Failed to fetch class details:", error);
            }
        };

        fetchData();
    }, [selectedClassId]);

    useEffect(() => {
        const fetchInstructorsAndStudents = async () => {
            try {
                const instructorsData = await axios.get('/api/instructors');
                console.log("instructors fetched:", instructorsData.data);
                setInstructors(instructorsData.data);
                const studentsData = await axios.get('/api/students');
                setStudents(studentsData.data);
            } catch (error) {
                console.error("Failed to fetch instructors or students:", error);
            }
        };

        fetchInstructorsAndStudents();
    }, []);

    const handleDaySelection = (day) => {
        setClassData(prevState => ({
            ...prevState,
            meetingDay: prevState.meetingDay.includes(day)
            ? prevState.meetingDay.filter(d => d !== day)
            : [...prevState.meetingDay, day],
        }));
    };

    const handleStudentSelection = (studentId) => {
        setClassData(prevState => ({
            ...prevState,
            students: prevState.students.includes(studentId)
            ? prevState.students.filter(id => id !== studentId)
            : [...prevState.students, studentId],
        }));
    };

    const handleChange = async (event) => {
        const { name, value } = event.target;
        setClassData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!selectedClassId) {
            console.error("No class selected for update.");
            return;
        }
        setSubmitStatus('Submitting...');
        try {
            const updatedClass = await classService.updateClass(selectedClassId, {
                ...classData,
                meetingDay: classData.meetingDay,
            });
            setSubmitStatus('Class updated successfully!');
            // Displaying a detailed confirmation message
            setConfirmationMessage(`Class '${updatedClass.name}' updated successfully with instructor ${updatedClass.instructor} and meeting time on ${updatedClass.meetingDay.join(", ")} at ${updatedClass.meetingTime}.`);
            // Optional: Clear the form or reset states if needed here
        } catch (error) {
            console.error(error);
            setSubmitStatus(`Error updating class: ${error.message}`);
        }
    };

    console.log("Instructor ID:", classData.instructor, typeof classData.instructor);


    return (
        <div>
            <h2>update class</h2>
            <select onChange={(e) => setSelectedClassId(e.target.value)} value={selectedClassId}>
                <option value="">select a class</option>
                {allClasses.map(cls =>(
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
                </select>        
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
                                className={classData.meetingDay.includes(day) ? styles.selected : '' }
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
                    <button type="submit">update class</button>    
                </form>
                {submitStatus && <p>{submitStatus}</p>}
        </div>
    );

}
      
export default UpdateClass;