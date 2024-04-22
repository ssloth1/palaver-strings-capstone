import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classService from "../../../services/classServices";
import Loader from "../../general-components/Loader";

function ClassDetails () {
    const { classId } = useParams();
    const [ClassDetails, setClassDetails] = useState(null);

    useEffect(() => {
        classService.getClassById(classId)
        .then(data => {
            console.log(data);
            setClassDetails(data);
        })
        .catch(error => console.error("Failed to fetch class details:", error));
    }, [classId]);

    if (!ClassDetails) {
        return <Loader />;
    }

    return (
        <div>
            <h2>{ClassDetails.name}</h2>
            <p>instructor: {ClassDetails.instructor.firstName} {ClassDetails.instructor.lastName}</p>
            <p>meeting days: {ClassDetails.meetingDay.join(', ')}</p>
            <p>start time: {ClassDetails.startTime}</p>
            <p>end time: {ClassDetails.endTime}</p>
            <p>classroom: {ClassDetails.classroom}</p>
            <p>students: </p>
            <ul>
            {ClassDetails.students && ClassDetails.students.length > 0 ? (
                                <ul>
                                    {ClassDetails.students.map((student) => (
                                        <li key={student._id}>{`${student.firstName} ${student.lastName}`}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>no students enrolled</p>
                            )}
            </ul>
        </div>
    );
}

export default ClassDetails;