const express = require('express');

const { 
    createAdmin,
    getAdmins,
    getAdmin, 
    deleteAdmin,
    updateAdmin,
    loginAdmin,

    // To-Do/Placeholders
    //createStudent,
    //getAllStudents,
    //getStudentById,
    //updateStudent,
    //deleteStudent
} = require('../controllers/AdminController');

const router = express.Router({ mergeParams: true });

// Admin-specific routes
router.get('/', getAdmins);
router.get('/:id', getAdmin);
router.post('/', createAdmin);
router.delete('/:id', deleteAdmin);
router.patch('/:id', updateAdmin);
router.post('/login', loginAdmin);


// Student-specific routes managed by Admin
//router.post('/students', createStudent);
//router.get('/students', getAllStudents);
//router.get('/students/:id', getStudentById);
//router.put('/students/:id', updateStudent);
//router.delete('/students/:id', deleteStudent);

module.exports = router;