const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Instructor, Student, Parent } = require('../models/modelsIndex');

class InstructorController {
    async loginInstructor (req, res) {
        try {
            
            // Find instructor by email
            const { email, password } = req.body;
            const instructor = await Instructor.findOne({ email: email });

        if (!instructor) {
            return res.status(404).json({ message: "Instructor not found!" });
        }

        // Check if the provided password matches the hased password in the database
        const isMatch = await bcrypt.compare(password, instructor.hashedPassword);
        
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        // Generate the JWT token
        const token = jwt.sign({ id: instructor._id, role: instructor.role }, 'MY_SECRET_KEY', { expiresIn: '1h' });

        // Send the token in a HTTP-only cookie
        res.status(200).json({ token: token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


    async createInstructor(req, res) {
        try {
            const instructor = await Instructor.create(req.body);
            res.status(201).json(instructor);
        } catch (err) {
            res.status(400).json({ err: err.message });
        }
    }

    // Get all instructors
    async getInstructors(req, res) {
        try {
            const instructors = await Instructor.find({ __t: 'Instructor' }); 
            res.status(200).json(instructors);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get a specific instructor by ID
    async getInstructor(req, res){
        try {
            const instructor = await Instructor.findById(req.params.id);
            if (!instructor) {
                return res.status(404).json({ message: "Instructor not found!" });
            }
            res.status(200).json(instructor);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    // Update an instructor by ID
    async updateInstructor(req, res) {
        try {
            const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });
            if (!instructor) {
                return res.status(404).json({ message: "Instructor not found!" });
            }
            res.status(200).json(instructor);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete an instructor by ID
    async deleteInstructor(req, res){
        try {
            const instructor = await Instructor.findByIdAndDelete(req.params.id);
            if (!instructor) {
                return res.status(404).json({ message: "Instructor not found!" });
            }
            res.status(200).json({ message: "Instructor deleted successfully!" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    //find all students for an instructor
    //currently using a post request using locally stored email.
    async getInstuctorByEmail(req, res){
        try{
            const instructor = await Instructor.findOne({ email:req.body.email });
            if (!instructor) {
                return res.status(404).json({ message: "Instructor not found!" });
            }
            res.status(200).json(instructor);
        } catch (error) {
            res.status(400).json({ message:error.message })
        }
    }

    // Associate a student with an instructor
    async assignStudent(req, res){
        const session = await mongoose.startSession();
        console.log("Assigning student to instructor");
        
        // Start transaction to ensure atomicity of the operation
        session.startTransaction();
        try {
            const instructorId = req.params.id;
            const studentId = req.body.studentId;
            console.log("Instructor ID:", instructorId);
            console.log("Student ID:", studentId);

            // Check if the instructor exists
            const instructor = await Instructor.findById(instructorId).session(session);
            if (!instructor) {
                await session.abortTransaction();
                return res.status(404).json({ message: "Instructor not found!" });
            }
            
            // Check if the student exists
            const student = await Student.findById(studentId).session(session);
            if (!student) {
                await session.abortTransaction();
                return res.status(404).json({ message: "Student not found!" });
            }
        
            // Set up the association, save the documents, and commit the transaction
            instructor.students.push(student._id);
            student.primaryInstructor = instructor._id;
            await instructor.save();
            await student.save();
            await session.commitTransaction();
            res.status(200).json(instructor);
        } catch (error) {
            await session.abortTransaction();
            res.status(400).json({ message: error.message });
        } finally {
            session.endSession();
        }
    }

    // Disassociate a student from an instructor
    async unassignStudent(req, res){
        const session = await mongoose.startSession();
        
        // Start transaction to ensure atomicity of the operation
        session.startTransaction();
        try {
            const instructorId = req.params.id;
            const studentId = req.body.studentId;

            // Check if the instructor exists
            const instructor = await Instructor.findById(instructorId).session(session);
            if (!instructor) {
                await session.abortTransaction();
                return res.status(404).json({ message: "Instructor not found!" });
            }
            
            // Check if the student exists
            const student = await Student.findById(studentId).session(session);
            if (!student) {
                await session.abortTransaction();
                return res.status(404).json({ message: "Student not found!" });
            }
            
            // Set up the association, save the documents, and commit the transaction
            instructor.students.pull(student._id);
            student.primaryInstructor = null;
            await instructor.save();
            await student.save();
            await session.commitTransaction();
            res.status(200).json(instructor);
        } catch (error) {
            await session.abortTransaction();
            res.status(400).json({ message: error.message });
        } finally {
            session.endSession();
        };
    }


    async swapStudent(req, res){
        const session = await mongoose.startSession();
        try {
            await session.startTransaction();
            const newInstructorId = req.params.id; // New instructor's ID from URL
            const { studentId } = req.body; // Student's ID from request body
            console.log("Swapping student to new instructor:", newInstructorId);

            // Fetch the student to find their current instructor
            const student = await Student.findById(studentId).session(session);
            if (!student) {
                await session.abortTransaction();
                return res.status(404).json({ message: "Student not found!" });
            }
            
            const currentInstructorId = student.primaryInstructor;

            // If there is a current instructor, remove the student from their list
            if (currentInstructorId) {
                const currentInstructor = await Instructor.findById(currentInstructorId).session(session);
                if (currentInstructor) {
                    currentInstructor.students.pull(student._id);
                    await currentInstructor.save({ session });
                }
            }

            // Assign the student to the new instructor
            const newInstructor = await Instructor.findById(newInstructorId).session(session);
            if (!newInstructor) {
                await session.abortTransaction();
                return res.status(404).json({ message: "New instructor not found!" });
            }
            newInstructor.students.push(student._id);
            await newInstructor.save({ session });

            // Update the student's primary instructor
            student.primaryInstructor = newInstructor._id;
            await student.save({ session });

            await session.commitTransaction();
            res.status(200).json({ message: "Student successfully reassigned to the new instructor." });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({ message: error.message });
        } finally {
            session.endSession();
        }
    }
}


module.exports = new InstructorController;
