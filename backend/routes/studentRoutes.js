const express = require('express');

const studentController = require('../controllers/studentController');

const router = express.Router({ mergeParams: true });

// Student-specific routes
router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudent);
router.post('/', studentController.createStudent);
router.delete('/:id', studentController.deleteStudent);
router.patch('/:id', studentController.updateStudent);
//router.post('/withParent', createStudentWithParent);

// Login route for Student
router.post('/login', studentController.loginStudent);


module.exports = router;
