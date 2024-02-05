const express = require('express');
const auth = require('../middleware/auth');

const { 

    loginInstructor,

} = require('../controllers/instructorController');

const router = express.Router({ mergeParams: true });

router.post('/login', loginInstructor);

module.exports = router;
