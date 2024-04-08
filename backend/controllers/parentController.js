const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Parent } = require('../models/modelsIndex');

class ParentController {
    //Get all parents
    async getParents(req, res){
        try {
            const parents = await Parent.find({}).sort({createdAt: -1})
            res.status(200).json(parents)
        } catch (err) {
            res.status(400).json({err: err.message})
        }
    }

    // Get a single parent
    async getParent(req, res){
        
        // Get id from params
        const { id } = req.params
        // Check if id is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({err: 'Invalid ID'})
        }
        // Find parent by id
        const parent = await Parent.findById(id) 
        // Check if parent exists
        if (!parent) {
            return res.status(404).json({err: 'Parent not found'})
        }
        res.status(200).json(parent) 
    }


    //create a new parent without a student
    async createParent(req, res){
        const { parentData } = req.body;
        //console.log(req.body);

        try {
            const parent = await Parent.create(req.body);
            res.status(201).json({ parent });
        } catch (error) {
            res.status(400).json({ message: err.message });
        }
    }


    async updateParent(req, res){
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({err: 'Parent not found'})
        }
        const parent = await Parent.findByIdAndUpdate({_id: id}, {
            ...req.body,
        })

        if (!parent) {
            return res.status(404).json({err: 'Parent not found'})
        }

        res.status(200).json(parent)
    }

    async deleteParent (req,res) {
        const { id } = req.params
        if (!mongoos.Types.ObjectId.isValid(id)) {
            return res.status(404).json({err: 'Parent not found'})
        }
        const parent = await Parent.findOneAndDelete({_id: id})
        if (!parent) {
            return res.status(404).json({err: 'Parent not found'})
        }
        res.status(200).json(parent)
    }

    async loginParent(req,res){
        try{
            const { email, password } = req.body;
            //find parent by email
            const parent = await Parent.findOne({ email: email });
            if(!parent) {
                return res.status(404).json({ message:"Parent not found" });
            }

            //Check if password matches hashed password
            const isMatch = await bcrypt.compare(password, parent.hashedPassword);
            if(!isMatch) {
                return res.status(400).json({ message: "Invalid credentials"})
            }

            //Generate the JWT token
            const token = jwt.sign({ id: parent._id, role: parent.role }, 'MY_SECRET_KEY', { expiresIn: '1h' });

            //Send the token in a HTTP-only cookie
            res.status(200).json({ token: token});

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    // Get a parent's children information
    async getChildrenInfo (req, res) {
        const parent = await Parent.findById(req.params.parentId).populate('children');
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }
        res.status(200).json(parent.children);
    };

    async findByEmail(req, res){
        //console.log(req);
        const parent = await Parent.findOne({ email: req.body.email});
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }
        res.status(200).json(parent);
        //console.log(res);
    }

    // Function to add a child to a parent
    async addChild (req, res){
        const { parentId, studentId } = req.params;

        try {
            const parent = await Parent.findById(parentId);
            const student = await Student.findById(studentId);

            if (!parent || !student) {
                return res.status(404).json({ message: 'Parent or Student not found' });
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

}

module.exports = new ParentController;
