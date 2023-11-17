const { Instructor, Student, Parent } = require('../models/modelsIndex');


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
    deleteInstructor

};
