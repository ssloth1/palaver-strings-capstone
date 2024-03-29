const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { Instructor, Student, Parent } = require('../models/modelsIndex');

class StudentController {

        async loginStudent(req, res){
        try {
            const { email, password } = req.body;

            // Find student by email
            const student = await Student.findOne({ email: email });
            if (!student) {
                return res.status(404).json({ message: "Student not found!" });
            }

            // Check if the provided password matches the hased password in the database
            const isMatch = await bcrypt.compare(password, student.hashedPassword);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials!" });
            }

            // Generate the JWT token
            const token = jwt.sign({ id: student._id, role: student.role }, 'MY_SECRET_KEY', { expiresIn: '1h' });

            // Send the token in a HTTP-only cookie
            res.status(200).json({ token: token });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    // Get all students
    async getStudents(req, res){
        try {
            const students = await Student.find({}).sort({createdAt: -1})
            res.status(200).json(students)
        } catch (err) {
            res.status(400).json({err: err.message})
        }
    }

    // Get a single student
    async getStudent(req, res){
        
        // Get id from params
        const { id } = req.params
        // Check if id is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({err: 'Invalid ID'})
        }
        // Find student by id
        const student = await Student.findById(id) 
        // Check if student exists
        if (!student) {
            return res.status(404).json({err: 'Student not found'})
        }
        res.status(200).json(student) 
    }

    // Create a new student without a parent
    async createStudent(req, res){
        console.log("api call received.");
        try {
            const old = await User.findOne({ email : req.body.email });
        if (old) {
            return res.status(400).json({ err:"User already exists "});
        } 
    } catch (err) {
        console.log("passed the duplicate test.")
    }
    //Create the student
        try {
            const student = await Student.create(req.body);
        } catch (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message })
        }
        
        //Start a session - don't want to update any records if any portion fails
        const session = await mongoose.startSession();
        session.startTransaction();
        console.log("session started")
        try {
            console.log("in the try block")
            //Find a parent
            const parent = await Parent.findOne({ email: req.body.parentEmail }).session(session);
            if (!parent) {
                console.log("Couldn't find a parent")
                await session.abortTransaction();
                console.log("session aborted")
                await Student.findOneAndDelete({ email: req.body.email })
                console.log("student deleted.")
                return res.status(404).json({ message: 'Parent not found' });
            }

            //get our newly-created student within the session
            const sessionStudent = await Student.findOne({ email: req.body.email }).session(session);
            if (!sessionStudent) {
                await session.abortTransaction();
                await Student.findOneAndDelete({ email: req.body.email })
                return res.status(404).json({ message: 'Student not created' });
            }

            //Associate student with parent and parent with student.
            sessionStudent.parent = parent._id;
            parent.children.push(sessionStudent._id);

            //Save transactions and then commit session.
            await sessionStudent.save();
            await parent.save();
            await session.commitTransaction();
            res.status(201).json({ sessionStudent });
        } catch (err) {
            console.log(err.message);
            //On error, abort the transaction, delete the student, and notify the user.
            await session.abortTransaction();
            await Student.findOneAndDelete({ email: req.body.email })
            res.status(400).json({ message: err.message });
        } finally {
            session.endSession();
        }


    }

    // Delete a student
    async deleteStudent(req, res){
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
    async updateStudent(req, res){
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

    // Get a student's parent
    async getParent(req, res){
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
        // Find parent by id
        const parent = await Parent.findById(student.parent)
        // Check if parent exists
        if (!parent) {
            return res.status(404).json({err: 'Parent not found'})
        }
        res.status(200).json(parent)
    }
    
}


module.exports = new StudentController;