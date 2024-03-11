const mongoose = require('mongoose');
const Class = require('../models/class/classModel');

class classController {
    async addClass (req, res) {
        const { name, instructor, students, meetingDay, meetingTime } = req.body;

        try {
            const newClass = new Class ({
                name,
                instructor,
                students,
                meetingDay,
                meetingTime,
            });
            await newClass.save();
            res.status(201).json(newClass);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }

    }

    async getAllClasses(req, res){
        try{
            const classes = await Class.find().populate('instructor').populate('students');
            res.status(200).json(classes);
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }

    async updateClass (req, res) {
        const { id } = req.params;
        const update = req.body;

        try {
            const updatedClass = await Class.findByIdAndUpdate(id, update, { new: true});
            if (!updatedClass) {
                return res.status(404).json({ error: 'Class not found' });
            }
            res.status(200).json(updatedClass);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteClass (req, res){
        const { id } = req.params;

        try {
            const deletedClass = await Class.findByIdAndDelete(id);
            if (!deletedClass) {
                return res.status(404).json({error: 'Class not found' });
            }
            res.status(204).json({ message: 'Class successfully deleted' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}

module.exports = new classController;