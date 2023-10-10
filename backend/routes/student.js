const express = require('express')
const { 
    createStudent,
    getStudents,
    getStudent, 
    deleteStudent,
    updateStudent
 } = require('../controllers/studentController')


const router = express.Router()

// Get all student
router.get('/', getStudents)

// Get a single students
router.get('/:id', getStudent)

// POST a new students
router.post('/', createStudent)

// DELETE a students
router.delete('/:id', deleteStudent) 

// UPDATE a students
router.patch('/:id', updateStudent)


module.exports = router

