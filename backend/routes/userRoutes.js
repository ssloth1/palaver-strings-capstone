const express = require('express');

const { 
    //createUser,
    //getUsers,
    //getUser, 
    //deleteUser,
    //updateUser,
    requestPasswordReset,
    resetPassword
 } = require('../controllers/userController');


const router = express.Router()

// General user routes
//router.get('/', getUsers);
//router.get('/:id', getUser);
//router.post('/', createUser);
//router.delete('/:id', deleteUser);
//router.patch('/:id', updateUser);


router.use('/:userId/admins', require('./adminRoutes'));
router.use('/:userId/students', require('./studentRoutes'));
router.use('/:userId/instructors', require('./instructorRoutes'));
router.use('/:userId/parents', require('./parentRoutes'));

router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);




module.exports = router


