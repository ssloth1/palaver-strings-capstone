const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../models/user/userModel')

class UserController {

    //This function logs in a user.  On a success, a json webtoken is returned with the user's id, role, and permissions.
    async loginUser(req, res){
        try{
            //Process request
            const { email, password } = req.body;
            
            //Find a user who matches the entered email
            const user = await User.findOne({ email: email });

            //404 error if no user is found
            if (!user) {
                return res.status(404).json({ message:"User not found" });
            }

            //check the provided password against the hashed password in the database.
            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials!" });
            }

            // Generate the JWT token
            const token = jwt.sign({ id: user._id, role: user.roles, permissions: user.permissions }, 'MY_SECRET_KEY', { expiresIn: '1h' });

            // Send the token in a HTTP-only cookie
            res.status(200).json({ token: token });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    //This function retrieves all users
    async getAllUsers(req, res){
        try {
            const users = await User.find({}).sort({createdAt: -1})
            res.status(200).json(users)
        } catch (err) {
            res.status(400).json({err: err.message})
        }
    }

    //This function retrieves a single user from the id sent in the request
    async getUser(req, res){
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }
            if (user.roles.includes('student')) {
                console.log(user.age)
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    //Update a user
    async updateUser(req, res) {
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
    }

    // Delete a user by ID
    async deleteUser(req, res){
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }
            res.status(200).json({ message: "User    deleted successfully!" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    //Create a user
    async createUser(req, res){

        console.log(req.body)

        //First, check that no other user with the same email already exists
        try {
            const old = await User.findOne({ email : req.body.email });
            if (old) {
                return res.status(400).json({ err:"User already exists "});
            } 
        } catch (err) {
            console.log("passed the duplicate test.")
        }

        //Create the user
        try {
            const user = await User.create(req.body);
            console.log(user);
            if (!user.roles.includes('student')){
                res.status(200).json(user);
            }
        } catch (error) {
            console.log(error.message);
            return res.status(400).json({ message: error.message })
        }

        //if the user is a student, the parent must be associated with the student
        if (req.body.roles.includes('student')) {

            //Start a session - if any of this fails, all of it should be rolled back
            const session = await mongoose.startSession();
            session.startTransaction();
            console.log("session started")
            try {
                console.log("in the try block")
                //Find a parent
                const parent = await User.findOne({ email: req.body.parentEmail }).session(session);
                if (!parent) {
                    console.log("Couldn't find a parent")
                    await session.abortTransaction();
                    console.log("session aborted")
                    await User.findOneAndDelete({ email: req.body.email })
                    console.log("student deleted.")
                    return res.status(404).json({ message: 'Parent not found' });
                }

                //get our newly-created student within the session
                const sessionStudent = await User.findOne({ email: req.body.email }).session(session);
                if (!sessionStudent) {
                    await session.abortTransaction();
                    await User.findOneAndDelete({ email: req.body.email })
                    return res.status(404).json({ message: 'Student not created' });
                }

                //Associate student with parent and parent with student.
                sessionStudent.parent = parent._id;
                parent.children.push(sessionStudent._id);

                //Save transactions and then commit session.
                await sessionStudent.save();
                await parent.save();
                await session.commitTransaction();
                res.status(200).json(sessionStudent);
            } catch (err) {
                console.log(err.message);
                //On error, abort the transaction, delete the student, and notify the user.
                await session.abortTransaction();
                await User.findOneAndDelete({ email: req.body.email })
                return res.status(400).json({ message: err.message });
            } finally {
                session.endSession();
            }

        }
    }

    //get users by types
    //admins
    async getAdmins(req, res) {
        try {
            const admins=await User.find({ roles: { $in: ['admin' ]}});
            res.status(200).json(admins);
        } catch (err) {
            console.log(err.message);
            res.status(400).json({ message: err.message})
        }
    }

    //instructors
    async getInstructors(req, res) {
        try {
            const instructors=await User.find({ roles: { $in: ['instructor' ]}});
            res.status(200).json(instructors);
        } catch (err) {
            console.log(err.message);
            res.status(400).json({ message: err.message})
        }
    }

    //parents
    async getParents(req, res) {
        try {
            const parents=await User.find({ roles: { $in: ['parent' ]}});
            res.status(200).json(parents);
        } catch (err) {
            console.log(err.message);
            res.status(400).json({ message: err.message})
        }
    }

    //students
    async getStudents(req, res) {
        try {
            const students=await User.find({ roles: { $in: ['student' ]}});
            res.status(200).json(students);
        } catch (err) {
            console.log(err.message);
            res.status(400).json({ message: err.message})
        }
    }

    //functions for specific role interactions

    //get a parent's children
    async getChildrenInfo (req, res) {
        const parent = await User.findById(req.params.parentId).populate('children');
        if (!parent.roles.includes('parent')) {
            return res.status(400).json({ message: 'User is not a parent, no children to display.'})
        }
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }
        res.status(200).json(parent.children);
    };

    // Function to add a child to a parent
    async addChild (req, res){
        const { parentId, studentId } = req.params;

        try {
            const parent = await User.findById(parentId);
            const student = await User.findById(studentId);

            if (!parent || !student) {
                return res.status(404).json({ message: 'Parent or Student not found' });
            }

            if (!parent.roles.includes('parent')) {
                return res.status(400).json({ message: 'User is not a parent, cannot add a child.'})
            }

            if (!student.roles.includes('student')) {
                return res.status(400).json({ message: 'submitted child is not a child, cannot be assigned to a parent.'})
            }

            // Add student to parent's children array if not already present
            if (!parent.children.includes(studentId)) {
                parent.children.push(studentId);
                await parent.save();
            }
            // Optionally, update the student's parent field
            student.parent = parentId;
            await student.save();
            res.status(200).json({ message: 'Child added successfully', parent });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    // Get a student's parent
    async getParent(req, res){
        // Get id from params
        const { id } = req.params
        // Check if id is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({err: 'Student not found'})
        }
        // Find student by id
        const student = await User.findById(id)
        // Check if student exists
        if (!student) {
            return res.status(404).json({err: 'Student not found'})
        }
        //Check to make sure student is a student
        if (!student.roles.includes('student')) {
            return res.status(400).json({ message: 'submitted student is not a student, has no parents to display.'})
        }
        // Find parent by id
        const parent = await User.findById(student.parent)
        // Check if parent exists
        if (!parent) {
            return res.status(404).json({err: 'Parent not found'})
        }
        res.status(200).json(parent)
    }

    requestPasswordReset = async (req, res) => {
        const { email } = req.body;
        const user = await User.findOne({ email });
    
        if (!user) {
            return res.status(404).json({ message: 'No user found with that email address.' });
        }
    
        // Create a reset token and expiration date
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
        await user.save();
    
        // Send the email
        const request = mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [{
                From: {
                    Email: process.env.MJ_SENDER_EMAIL,
                    Name: process.env.MJ_SENDER_NAME,
                },
                To: [{
                    Email: user.email,
                }],
                Subject: 'Password Reset Request',
                TextPart: `Hello, ${user.firstName}!
    
    You are receiving this email because you (or someone else) has requested the reset of the password for your account. Please click on the following link, or paste this into your browser to complete the process:
    
    ${process.env.FRONTEND_URL}/reset-password/${token}
    
    If you did not request this, please ignore this email and your password will remain unchanged.`,
            }]
        });
    
        request
            .then(() => {
                res.json({ message: 'Check your email for the password reset link.' });
            })
            .catch((err) => {
                res.status(500).json({ message: 'Failed to send password reset email' });
        });
    };
    
    
    resetPassword = async (req, res) => {
        const { token } = req.params;
        const { password } = req.body;
    
        try {
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });
            
            if (!user) {
                return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
            }
            
            user.hashedPassword = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            
            res.json({ message: 'Password has been reset successfully.' });
        } catch (error) {
            console.error(error); // Log the error for server-side debugging
            res.status(500).json({ error: 'An error occurred while resetting the password.' });
        }
    };

    loginUser = async(req, res) => {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }

            // Check if the provided password matches the hased password in the database
            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials!" });
            }

            // Generate the JWT token
            const token = jwt.sign({ id: user._id, role: user.roles }, 'MY_SECRET_KEY', { expiresIn: '1h' });

            // Send the token in a HTTP-only cookie
            res.status(200).json({ token: token, roles: user.roles, id: user._id });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new UserController;