const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Instructor, Student, Parent } = require('../models/modelsIndex');

const loginInstructor = async (req, res) => {
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


// Create a new instructor
const createInstructor = async (req, res) => {
    try {
        const instructor = await Instructor.create(req.body);
        res.status(201).json(instructor);
    } catch (err) {
        res.status(400).json({ err: err.message });
    }
};

// Get all instructors
const getInstructors = async (req, res) => {
    try {
        const instructors = await Instructor.find({ __t: 'Instructor' }); 
        res.status(200).json(instructors);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a specific instructor by ID
const getInstructor = async (req, res) => {
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
const updateInstructor = async (req, res) => {
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
};

// Delete an instructor by ID
const deleteInstructor = async (req, res) => {
    try {
        const instructor = await Instructor.findByIdAndDelete(req.params.id);
        if (!instructor) {
            return res.status(404).json({ message: "Instructor not found!" });
        }
        res.status(200).json({ message: "Instructor deleted successfully!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {

    /* Instructor-specific routes managed by Admin */
    createInstructor,
    getInstructors,
    getInstructor,
    updateInstructor,
    deleteInstructor,

    loginInstructor

};
