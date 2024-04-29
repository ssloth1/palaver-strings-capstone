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
            <p>Instructor: {ClassDetails.instructor.firstName} {ClassDetails.instructor.lastName}</p>
            <p>Meeting days: {ClassDetails.meetingDay.join(', ')}</p>
            <p>Start time: {ClassDetails.startTime}</p>
            <p>End time: {ClassDetails.endTime}</p>
            <p>Classroom: {ClassDetails.classroom}</p>
            <p>Students: </p>
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