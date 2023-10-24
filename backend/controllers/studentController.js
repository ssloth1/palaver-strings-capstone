const Student = require('../models/modelsIndex').Student;
const mongoose = require('mongoose')

/*

// Get all students
const getStudents = async (req, res) => {
    try {
        const students = await Student.find({}).sort({createdAt: -1})
        res.status(200).json(students)
    } catch (err) {
        res.status(400).json({err: err.message})
    }
}

// Get a single student
const getStudent = async (req, res) => {
    
    // Get id from params
    const { id } = req.params
    // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({err: 'Student not found'})
    }
    // Find student by id
    const student = await Student.findById(id) 
    // Check if student exists
    if (!student) {
        return res.status(404).json({err: 'Student not found'})
    }
    res.status(200).json(student) 
}

// Create a new student
const createStudent = async (req, res) => {
    const { firstName, lastName, email, hashedPassword } = req.body

    // Add document to database
    try {
        const student = await Student.create({ firstName, lastName, email, hashedPassword })
        res.status(200).json(student)
    } catch (err) {
        res.status(400).json({err: err.message})
    }

}

// Delete a student
const deleteStudent = async (req, res) => {
    // Get id from params
    const { id } = req.params
    // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({err: 'Student not found'})
    }
    // Find student by id and delete it
    const student = await Student.findOneAndDelete({_id: id})
    // Check if student exists
    if (!student) {
        return res.status(404).json({err: 'Student not found'})
    }
    res.status(200).json(student)

}

// Update a student
const updateStudent = async (req, res) => {
    // Get id from params
    const { id } = req.params
    // Check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({err: 'Student not found'})
    }

    const student = await Student.findByIdAndUpdate({_id: id}, {
        ...req.body,
    })

    if (!student) {
        return res.status(404).json({err: 'Student not found'})
    }

    res.status(200).json(student)
    
}


module.exports = {
    getStudents,
    getStudent,
    createStudent,
    deleteStudent,
    updateStudent
}

*/