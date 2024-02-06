import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

function StudentAssignments() {
    const [students, setStudents] = useState([]);
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const { data } = await axios.get('/api/admins/students');
            setStudents(data);
        };

        const fetchInstructors = async () => {
            const { data } = await axios.get('/api/admins/instructors');
            setInstructors(data);
        };

        fetchStudents();
        fetchInstructors();
    }, []);


    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return; // Stops the process if dropped outside a droppable area
    
        try {
            if (destination.droppableId === 'unassignedStudents') {
                // Call API to unassign the student
                await axios.patch(`/api/admins/instructor/${source.droppableId}/unassignStudent`, {
                    studentId: draggableId,
                });
            } else {
                // Call API to assign the student to an instructor
                await axios.patch(`/api/admins/instructor/${destination.droppableId}/assignStudent`, {
                    studentId: draggableId,
                });
            }
            // Refresh the data to reflect changes
            fetchStudents();
            fetchInstructors();
        } catch (error) {
            console.error('Drag-and-drop operation failed:', error);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div>
                <h1>Student Assignments</h1>
                <Droppable droppableId="unassignedStudents">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            <h2>Unassigned Students</h2>
                            {students.filter(student => !student.primaryInstructor).map((student, index) => (
                                <Draggable key={student._id} draggableId={student._id} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            {student.firstName} {student.lastName}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                {instructors.map((instructor, index) => (
                    <Droppable key={instructor._id} droppableId={instructor._id}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="droppableArea">
                                <h2>{instructor.firstName} {instructor.lastName}</h2>
                                {students.filter(student => student.primaryInstructor === instructor._id).map((student, index) => (
                                    <Draggable key={student._id} draggableId={student._id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                {student.firstName} {student.lastName}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
}

export default StudentAssignments;