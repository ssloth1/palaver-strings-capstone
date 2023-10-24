const { Instructor, Student, Parent } = require('../models/modelsIndex');

// Get specific student by their ID
const getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all students assigned to an instructor
const getStudents = async (req, res) => {
    const instructor = await Instructor.findById(req.params.instructorId).populate('students');
    if (!instructor) {
        return res.status(404).json({ message: 'Instructor not found' });
    }
    res.status(200).json(instructor.students);
};

// Get a specific student's parent information
const getStudentParent = async (req, res) => {
    const student = await Student.findById(req.params.studentId).populate('parent');
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student.parent);
};

module.exports = {
    getStudent,
    getStudents,
    getStudentParent,
};