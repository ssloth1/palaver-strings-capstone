import React, { useState, useEffect} from 'react';
import { Link} from 'react-router-dom';
import classService from '../../../services/classServices';

function ViewClasses () {
    const [classes, setClasses] = useState([]);

    useEffect (() => {
        const fetchClasses = async () => {
            try {
                const data = await classService.getAllClasses();
                setClasses(data);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
            }
        };

        fetchClasses();
    }, []);

    return (
        <div>
            <h2>all classes</h2>
            <div className="classes-list">
                {classes.map((classItem) => (
                    <Link to={`/classes/${classItem._id}`} key={classItem._id} >
                       <div className="class-item>">
                            <h3>{classItem.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default ViewClasses;