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
    unassignStudent
} = require('../controllers/adminController');

const router = express.Router({ mergeParams: true });

// Admin-specific routes
router.get('/users', getAllUsers); 
router.get('/users/:id', getUser);       
router.delete('/users/:id',deleteUser);
router.patch('/users/:id', updateUser); 
router.get('/', getAdmins);
router.get('/:id', getAdmin);
router.post('/', createAdmin);
router.delete('/:id', deleteAdmin);
router.patch('/:id', updateAdmin);
router.post('/login', loginAdmin);

//Associate Student with Instructor
router.patch('/:id/assignStudent', assignStudent);
router.patch('/:id/unassignStudent', unassignStudent);


module.exports = router;