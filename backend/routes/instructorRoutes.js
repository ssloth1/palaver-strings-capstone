const express = require('express');
const auth = require('../middleware/auth');

const { 

    createInstructor,
    getInstructors,
    getInstructor,
    updateInstructor,
    deleteInstructor,

    loginInstructor,

    assignStudent,
    unassignStudent,

} = require('../controllers/instructorController');

const router = express.Router({ mergeParams: true });

router.post('/', createInstructor);
router.get('/', getInstructors);
router.get('/:id', getInstructor);
router.patch('/:id', updateInstructor);
router.delete('/:id', deleteInstructor);

router.post('/login', loginInstructor);

//Associate Student with Instructor
router.patch('/:id/assignStudent', assignStudent);
router.patch('/:id/unassignStudent', unassignStudent);



module.exports = router;
