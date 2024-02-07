const express = require('express');
const auth = require('../middleware/auth');

const { 
    createInstructor,
    getInstructors,
    getInstructor,
    updateInstructor,
    deleteInstructor,

    loginInstructor,

    assignStudent,
    unassignStudent,
    swapStudent

} = require('../controllers/instructorController');

const router = express.Router({ mergeParams: true });

// Basic Instructor routes
router.post('/', createInstructor);
router.get('/', getInstructors);
router.get('/:id', getInstructor);
router.patch('/:id', updateInstructor);
router.delete('/:id', deleteInstructor);

// Login route for Instructor
router.post('/login', loginInstructor);

// Student-Instructor Association
router.patch('/:id/assignStudent', assignStudent);
router.patch('/:id/unassignStudent', unassignStudent);
router.patch('/:id/swapStudent', swapStudent);

module.exports = router;
