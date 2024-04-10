const express = require('express');
const authenticate = require('../middleware/auth');

const adminController = require('../controllers/adminController');
const newUserController = require('../controllers/newUserController');
/*
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

} = require('../controllers/adminController');
*/
const router = express.Router({ mergeParams: true });

// Admin-specific routes
//router.get('/users', adminController.getAllUsers.bind(adminController)); 
//router.get('/users/:id', adminController.getUser.bind(adminController));       
//router.delete('/users/:id', adminController.deleteUser.bind(adminController));
//router.patch('/users/:id', adminController.updateUser.bind(adminController)); 
router.get('/', newUserController.getAdmins.bind(newUserController));
//router.get('/:id', adminController.getAdmin.bind(adminController));
//router.post('/', adminController.createAdmin.bind(adminController));
//router.delete('/:id', adminController.deleteAdmin.bind(adminController));
//router.patch('/:id', adminController.updateAdmin.bind(adminController));
router.post('/login', adminController.loginAdmin.bind(adminController));



module.exports = router;