import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classService from "../../../services/classServices";
import Loader from "../../general-components/Loader";

function ClassDetails () {
    const { classId } = useParams();
    const [ClassDetails, setClassDetails] = useState(null);

    useEffect(() => {
        classService.getClassById(classId)
        .then(data => setClassDetails(data))
        .catch(error => console.error("Failed to fetch class details:", error));
    }, [classId]);

    if (!ClassDetails) {
        return <Loader />;
    }

    return (
        <div>
            <h2>{ClassDetails.name}</h2>
            <p>Instructor: {ClassDetails.instructor.firstName} {ClassDetails.instructor.lastName}</p>
            <p>Meeting Days: {ClassDetails.meetingDay.join(', ')}</p>
            <p>Meeting Time: {ClassDetails.meetingTime}</p>
            <p>Students: </p>
            <ul>
                {ClassDetails.students.map((student) => (
                    <li key={student._id}>{student.firstName} {student.lastName} </li>
                ))}
            </ul>
        </div>
    );
}

export default ClassDetails;