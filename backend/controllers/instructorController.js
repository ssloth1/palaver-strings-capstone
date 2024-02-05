const mongoose = require('mongoose');
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






module.exports = {


    loginInstructor

};
