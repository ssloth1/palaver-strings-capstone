import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClassService from '../../../services/classServices';
import '../styles/ViewClasses.css';

// Predefined order for days of the week
const dayOrder = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 7
};

// Function to sort days based on the predefined order
function sortDays(days) {
    return days.sort((a, b) => dayOrder[a] - dayOrder[b]);
}

const classroomOrder = {
    "Studio 1": 1,
    "Studio 2": 2,
    "Studio 3": 3,
    "Studio 4": 4,
    "Studio 5": 5,
    "Studio 6": 6
};

// Function to sort classrooms based on the predefined order
function sortClassrooms(classrooms) {
    return Object.keys(classrooms).sort((a, b) => classroomOrder[a] - classroomOrder[b]);
}


function ViewClasses() {
    const [groupedClasses, setGroupedClasses] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await ClassService.getAllClasses();
                organizeClasses(data);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
                setError(error);
            }
        };

        fetchClasses();
    }, []);

    const organizeClasses = (classes) => {
        const grouped = {};
        classes.forEach(classItem => {
            if (Array.isArray(classItem.meetingDay)) {
                classItem.meetingDay.forEach(day => {
                    if (!grouped[day]) {
                        grouped[day] = {};
                    }
                    const classroom = classItem.classroom || 'Unknown';
                    if (!grouped[day][classroom]) {
                        grouped[day][classroom] = [];
                    }
                    grouped[day][classroom].push(classItem);
                });
            } else {
                console.warn('Invalid or missing meetingDay for:', classItem);
            }
        });
    
        // Sorting classrooms within each day
        Object.keys(grouped).forEach(day => {
            const sortedClassrooms = sortClassrooms(grouped[day]);
            const newClassroomOrder = {};
            sortedClassrooms.forEach(classroom => {
                newClassroomOrder[classroom] = grouped[day][classroom];
                // Sort the classes by startTime within each classroom
                newClassroomOrder[classroom].sort((a, b) => a.startTime.localeCompare(b.startTime));
            });
            grouped[day] = newClassroomOrder;
        });
    
        setGroupedClasses(grouped);
    };
    
    

    if (Object.keys(groupedClasses).length === 0 && !error) {
        return <div>No classes available.</div>;
    } else if (error) {
        return <div>Error fetching classes: {error.message}</div>;
    }

    const sortedDays = sortDays(Object.keys(groupedClasses));  // Get sorted days

    return (
        <div className="viewClasses">
            <h2>schedule</h2>
                <div className="scheduleGrid">
                    {sortedDays.map(day => (
                    <div className="dayColumn" key={day}>
                        <h3>{day}</h3>
                        {Object.entries(groupedClasses[day]).map(([classroom, classes]) => (
                            <div className="class-item" key={classroom}>
                                <h4>{classroom}</h4>
                                {classes.map(classItem => (
                                    <Link to={`/classes/${classItem._id}`} key={classItem._id}>
                                        <div className="class-item">
                                            <h5>{classItem.name}</h5>
                                            <p>{classItem.instructor.firstName} {classItem.instructor.lastName}</p>
                                            <p>{classItem.startTime} - {classItem.endTime}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewClasses;
