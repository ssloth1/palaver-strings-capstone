
import React, { useState, useEffect} from 'react';
import { useParams, useNavigate} from "react-router-dom";
import axios from 'axios';
import ClassService from '../../../services/classServices';
import UserService from '../../../services/userServices';
import { WEEKDAYS } from '../../../constants/formconstants';
import '../styles/UpdateClass.css';


function UpdateClass() {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [allClasses, setAllClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(classId || '');
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
    const [students, setStudents] = useState([]);
    const [submitStatus, setSubmitStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAllClasses = async () => {
            try {
                const data = await ClassService.getAllClasses();
                setAllClasses(data);
            } catch (error) {
                console.error("Failed to fetch class details:", error);
            }
        };

        fetchAllClasses();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const fetchInitialData = async () => {
            try {
                // const fetchedClasses = await classService.getAllClasses();
                // setAllClasses(fetchedClasses);
                const fetchedInstructors = await UserService.getInstructors();
                const fetchedStudents = await UserService.getStudents();
                setInstructors(fetchedInstructors);
                setStudents(fetchedStudents);
                if(selectedClassId) {
                    const details = await ClassService.getClassById(selectedClassId);
                    setClassData({
                        ...details,
                        instructor: details.instructor._id,
                        students: details.students.map(student => student._id)
                    });
                }

            } catch (error) {
                console.error("Failed to fetch data:", error);
                setSubmitStatus(`Failed to load data: ${error.message || 'Unknown error'}`);
            }
            setIsLoading(false);
        };

        fetchInitialData();
    }, [selectedClassId]);

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
        setClassData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedClassId) {
            console.error("No class selected for update.");
            return;
        }
        setIsLoading(true);
        try {
            const updatedClass = await ClassService.updateClass(selectedClassId, classData);
            setSubmitStatus('Class updated successfully!');
            navigate(`/classes/${updatedClass._id}`);
        } catch (error) {
            console.error("Error updating class:", error);
            setSubmitStatus(`Error updating class: ${error.message}`);
        }
        setIsLoading(false);
    };

    console.log("Instructor ID:", classData.instructor, typeof classData.instructor);

    return (
        <div className="updateClassContainer">
            <h2>update class</h2>
            <select onChange={(e) => setSelectedClassId(e.target.value)} value={selectedClassId}>
                <option value="">select a class</option>
                {allClasses.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
            </select>        
            {isLoading ? <p>loading...</p> : (
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
            )}
                {submitStatus && <p>{submitStatus}</p>}

        </div>
    );
}

export default UpdateClass; 