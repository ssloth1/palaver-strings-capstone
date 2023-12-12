const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Student = require('../models/modelsIndex').Student;





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

/*
// Create a new student with a parent

//I think we'll want to table this-- we may want to add a parent parameter to student creation, which can do a callback and update the
//linked parent record, but we should probably not try to create both accounts at once.

const createStudentWithParent = async (req, res) => {
    const { studentData, parentData } = req.body;
    
    try {
        // Create parent
        const parent = new Parent(parentData);
        await parent.save();

        // Create student with parent reference
        const student = new Student({
            ...studentData,
            parent: parent._id
        });
        await student.save();

        res.status(201).json({ student, parent });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
*/

const loginStudent = async (req, res) => {
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

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    deleteStudent,
    updateStudent,
    //createStudentWithParent, 

    loginStudent
}
