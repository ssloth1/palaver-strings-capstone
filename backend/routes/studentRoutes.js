const express = require('express');
const { 
    createStudent,
    getStudents,
    getStudent, 
    deleteStudent,
    updateStudent
 } = require('../controllers/studentController');

const router = express.Router({ mergeParams: true });

// Student-specific routes
/*
router.get('/', getStudents);
router.get('/:id', getStudent);
router.post('/', createStudent);
router.delete('/:id', deleteStudent);
router.patch('/:id', updateStudent);
*/

module.exports = router;