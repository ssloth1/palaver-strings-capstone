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
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

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

}

module.exports = new UserController;