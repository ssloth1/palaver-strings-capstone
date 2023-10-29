const express = require('express');

const { 
    getStudent,
    getStudents,
    getStudentParent
} = require('../controllers/instructorController');

const router = express.Router({ mergeParams: true });

// Get a specific student by ID
router.get('/students/:studentId', getStudent);

// Get all students assigned to a specific instructor
router.get('/:instructorId/students', getStudents);

// Get the parent of a specific student
router.get('/students/:studentId/parent', getStudentParent);

module.exports = router;
