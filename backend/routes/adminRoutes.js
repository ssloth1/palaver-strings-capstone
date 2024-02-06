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
    swapStudent,

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
router.get('/user/:id', getUser);
router.delete('/user/:id', deleteUser);
router.patch('/user/:id', updateUser);

// Admin-specific routes
router.get('/admins', getAdmins);
router.get('/admin/:id', getAdmin);
router.post('/admin', createAdmin);
router.delete('/admin/:id', deleteAdmin);
router.patch('/admin/:id', updateAdmin);
router.post('/admin/login', loginAdmin);

// Student-Instructor Association
router.patch('/instructor/:id/assignStudent', assignStudent);
router.patch('/instructor/:id/unassignStudent', unassignStudent);
router.patch('/instructor/:id/swapStudent', swapStudent);

// Instructor-specific routes
router.get('/instructors', getInstructors);
router.get('/instructor/:id', getInstructor);
router.post('/instructor', createInstructor);
router.patch('/instructor/:id', updateInstructor);
router.delete('/instructor/:id', deleteInstructor);

// Student-specific routes
router.get('/students', getStudents);
router.get('/student/:id', getStudent);
router.post('/student', createStudent);
router.delete('/student/:id', deleteStudent);
router.patch('/student/:id', updateStudent);

module.exports = router;