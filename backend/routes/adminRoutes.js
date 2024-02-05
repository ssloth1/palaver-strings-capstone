const express = require('express');
const authenticate = require('../middleware/auth');
const { 

    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    createAdmin,
    getAdmins,
    getAdmin, 
    deleteAdmin,
    updateAdmin,
    loginAdmin,

    assignStudent,
    unassignStudent,

    getInstructor,
    getInstructors,
    createInstructor,
    updateInstructor,
    deleteInstructor,

    getStudent,
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent

} = require('../controllers/adminController');

const router = express.Router({ mergeParams: true });

// General user routes
router.get('/users', getAllUsers); 
router.get('/users/:id', getUser);       
router.delete('/users/:id',deleteUser);
router.patch('/users/:id', updateUser); 

// Admin-specific routes
router.get('/', getAdmins);
router.get('/:id', getAdmin);
router.post('/createAdmin', createAdmin);
router.delete('/:id', deleteAdmin);
router.patch('/:id', updateAdmin);

//Login Admin
router.post('/login', loginAdmin);

//Associate Student with Instructor
router.patch('/:id/assignStudent', assignStudent);
router.patch('/:id/unassignStudent', unassignStudent);

// Instructor-specific routes
router.get('/', getInstructors);
router.get('/:id', getInstructor);
router.post('/createInstructor', createInstructor);
router.patch('/:id', updateInstructor);
router.delete('/:id', deleteInstructor);

// Student-specific routes
router.get('/', getStudents);
router.get('/:id', getStudent);
router.post('/createStudent', createStudent);
router.delete('/:id', deleteStudent);
router.patch('/:id', updateStudent);



module.exports = router;