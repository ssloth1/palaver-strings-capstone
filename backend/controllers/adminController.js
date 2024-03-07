const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Admin, Parent, Student, Instructor, User } = require('../models/modelsIndex');

class AdminController {
    
    // Function to get all users from the database
    async getAllUsers(req, res) {
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Function to get a specific user of any type.
    async getUser(req, res) {
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
    async deleteUser(req, res){
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
    async updateUser (req, res) {
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
    async createAdmin (req, res) {
        try {
            const admin = await Admin.create(req.body);
            res.status(201).json(admin);
        } catch (err) {
            res.status(400).json({ err: err.message });
        }
    }

    // Get all admins
    async getAdmins (req, res){
        try {
            const admins = await Admin.find({ __t: 'Admin' });
            res.status(200).json(admins);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get a specific admin by ID
    async getAdmin(req, res){
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
    async deleteAdmin (req, res) {
        try {
            const admin = await Admin.findByIdAndDelete(req.params.id);
            if (!admin) {
                return res.status(404).json({ message: "Admin not found!" });
            }
            res.status(200).json({ message: "Admin deleted successfully!" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Update an admin by ID
    async updateAdmin(req, res) {
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
    }

    async loginAdmin(req, res) {
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
    }
}

module.exports = new AdminController;