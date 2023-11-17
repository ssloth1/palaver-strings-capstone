const express = require('express');
const authenticate = require('../middleware/auth');

const { 
    
    /* Admin-specific routes */
    createAdmin,
    getAdmins,
    getAdmin, 
    deleteAdmin,
    updateAdmin,
    loginAdmin,

} = require('../controllers/adminController');

const router = express.Router({ mergeParams: true });

// Admin-specific routes
router.get('/', getAdmins);
router.get('/:id',getAdmin);
router.post('/', createAdmin);
router.delete('/:id', deleteAdmin);
router.patch('/:id', updateAdmin);
router.post('/login', loginAdmin);



module.exports = router;