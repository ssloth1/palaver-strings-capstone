const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Student = require('../models/modelsIndex').Student;



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


    loginStudent
}
