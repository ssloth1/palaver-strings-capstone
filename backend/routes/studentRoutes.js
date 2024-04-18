const express = require('express');

const studentController = require('../controllers/studentController');
const newUserController = require('../controllers/newUserController');


const router = express.Router({ mergeParams: true });

// Student-specific routes
router.get('/', newUserController.getStudents.bind(newUserController));
//router.get('/:id', studentController.getStudent.bind(studentController));
//router.post('/', studentController.createStudent.bind(studentController));
//router.delete('/:id', studentController.deleteStudent.bind(studentController));
//router.patch('/:id', studentController.updateStudent.bind(studentController));
//router.post('/withParent', createStudentWithParent);

// Login route for Student
router.post('/login', studentController.loginStudent.bind(studentController));

// Get a student's parent
router.get('/:id/parent', newUserController.getParent.bind(newUserController));


module.exports = router;
