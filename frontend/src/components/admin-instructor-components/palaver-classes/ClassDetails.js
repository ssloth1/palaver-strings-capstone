import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClassService from "../../../services/classServices";
import Loader from "../../general-components/Loader";
import '../styles/ViewClasses.css';

function ClassDetails () {
    const { classId } = useParams();
    const [ClassDetails, setClassDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        ClassService.getClassById(classId)
        .then(data => {
            console.log(data);
            setClassDetails(data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error("Failed to fetch class details:", error);
            setError('Failed to fetch class details');
            setIsLoading(false);
        });
    }, [classId]);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if(!ClassDetails) {
        return <p>No class details available</p>;
    }

    return (
        <div className="class-details">
            <h2>{ClassDetails.name}</h2>
            <p><span className="label">Instructor:</span> {ClassDetails.instructor.firstName} {ClassDetails.instructor.lastName}</p>
            <p><span className="label">Meeting days:</span> {ClassDetails.meetingDay.join(', ')}</p>
            <p><span className="label">Start time:</span> {ClassDetails.startTime}</p>
            <p><span className="label">End time:</span> {ClassDetails.endTime}</p>
            <p><span className="label">Classroom:</span> {ClassDetails.classroom}</p>
            <p><span className="label">Students</span></p>
            {ClassDetails.students && ClassDetails.students.length > 0 ? (
                <ul>
                    {ClassDetails.students.map(student => (
                        <li key={student._id}>{student.firstName} {student.lastName}</li>
                    ))}
                </ul>
             ) : (
            <p>No students enrolled</p>
            )}
        </div>
    );
}

export default ClassDetails;