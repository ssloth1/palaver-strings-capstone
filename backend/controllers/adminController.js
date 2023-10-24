const { Admin, Parent, Student, Instructor } = require('../models/modelsIndex');

// Create a new admin
const createAdmin = async (req, res) => {
    try {
        const admin = await Admin.create(req.body);
        res.status(201).json(admin);
    } catch (err) {
        res.status(400).json({ err: err.message });
    }
}

// Get all admins
const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a specific admin by ID
const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found!" });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an admin by ID
const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found!" });
        }
        res.status(200).json({ message: "Admin deleted successfully!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an admin by ID
const updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found!" });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all subtypes (admins, parents, students, instructors)
const getAllSubtypes = async (req, res) => {
    try {
        const admins = await Admin.find();
        const parents = await Parent.find();
        const students = await Student.find();
        const instructors = await Instructor.find();

        res.status(200).json({
            admins,
            parents,
            students,
            instructors
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create a new student (only by admin)
const createStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Read all students
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Read a single student by ID
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a student by ID
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a student by ID
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(204).send();  // 204: No Content
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    createAdmin,
    getAllSubtypes,
    getAdmins,
    getAdmin,
    deleteAdmin,
    updateAdmin, 
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};