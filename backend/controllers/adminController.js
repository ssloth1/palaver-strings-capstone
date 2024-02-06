const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Admin, Parent, Student, Instructor, User } = require('../models/modelsIndex');

// Function to get all users from the database
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Function to get a specific user of any type.
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to delete a specific user of any type
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to update a user of any type.
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

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
        const admins = await Admin.find({ __t: 'Admin' });
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

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found!" });
        }

        // Check if the provided password matches the hased password in the database
        const isMatch = await bcrypt.compare(password, admin.hashedPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        // Generate the JWT token
        const token = jwt.sign({ id: admin._id, role: admin.role }, 'MY_SECRET_KEY', { expiresIn: '1h' });

        // Send the token in a HTTP-only cookie
        res.status(200).json({ token: token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Associate a student with an instructor
const assignStudent = async (req, res) => {
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
        
        console.log("Swapping student from instructor:", currentInstructorId, "to new instructor:", newInstructorId);
        console.log("Student ID:", studentId);

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
};

// Disassociate a student from an instructor
const unassignStudent = async (req, res) => {
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
};


const swapStudent = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        await session.startTransaction();
        const newInstructorId = req.params.id; // New instructor's ID from URL
        const { studentId } = req.body; // Student's ID from request body

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
};


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
const createStudent = async (req, res) => {
    //This had originally been set to try to create a student object and then send that object to the server to save it-- the student object
    //wouldn't send, so I took out the middle step and made the code align with adminController.
    //I suspect that this was tied to the attempt to create parents and students simultaneously.
    const { studentData } = req.body;
    
    //Helpful log for debugging: uncomment this to view raw JSON being sent in to create a student.
    //console.log(req.body);

    try {
        const student = await Student.create(req.body);
        res.status(201).json({ student });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

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
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    createAdmin,
    getAdmins,
    getAdmin,
    deleteAdmin,
    updateAdmin,
    loginAdmin,

    assignStudent,
    unassignStudent,
    swapStudent,

    createInstructor,
    getInstructor,
    getInstructors,
    updateInstructor,
    deleteInstructor,

    createStudent,
    getStudent,
    getStudents,
    updateStudent,
    deleteStudent

};