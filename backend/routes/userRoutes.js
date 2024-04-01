const express = require('express');

const { 
    requestPasswordReset,
    resetPassword
 } = require('../controllers/userController');

 const userController = require('../controllers/newUserController')


const router = express.Router()

// General user routes
router.get('/', userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUser.bind(userController));
router.post('/', userController.createUser.bind(userController));
router.post('/login', userController.loginUser.bind(userController));
//router.delete('/:id', deleteUser);
//router.patch('/:id', updateUser);


router.use('/:userId/admins', require('./adminRoutes'));
router.use('/:userId/students', require('./studentRoutes'));
router.use('/:userId/instructors', require('./instructorRoutes'));
router.use('/:userId/parents', require('./parentRoutes'));

router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);




module.exports = router


