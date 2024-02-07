const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Parent } = require('../models/modelsIndex');

// Get a parent's children information
const getChildrenInfo = async (req, res) => {
    const parent = await Parent.findById(req.params.parentId).populate('children');
    if (!parent) {
        return res.status(404).json({ message: 'Parent not found' });
    }
    res.status(200).json(parent.children);
};


// Function to add a child to a parent
const addChild = async (req, res) => {
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



    

module.exports = {
    getChildrenInfo,
    addChild
};
