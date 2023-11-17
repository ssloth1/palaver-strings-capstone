const express = require('express');

const { 

    createInstructor,
    getInstructors,
    getInstructor,
    updateInstructor,
    deleteInstructor

} = require('../controllers/instructorController');

const router = express.Router({ mergeParams: true });

router.post('/', createInstructor);
router.get('/', getInstructors);
router.get('/:id', getInstructor);
router.patch('/:id', updateInstructor);
router.delete('/:id', deleteInstructor);


module.exports = router;
