const mongoose = require('mongoose');
const Schedule = require('../models/schedule/scheduleModel');

class ScheduleControlller {
    async createSchedule (req, res) {
        try {
            const newSchedule = new Schedule(req.body);
            const savedSchedule = await newSchedule.save();
            res.status(201).json(savedSchedule);
        } catch (error) {
            res.status(400).json({ message: error.message});
        }
    }

    async getAllSchedules(req, res) {
        try {
            const schedules = await Schedule.find().populate('classroom instructor class');
            res.json(schedules);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    }

    async getScheduleById(req, res) {
        try {
            const schedule = await Schedule.findById(req.params.id).populate('classroom instructor class');
            if (!schedule) {
                return res.status(404).json({ message: 'Cannot find schedule.' });
            }
            res.json(schedule);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateSchedule(req, res){
        const { id } = req.params;
        try {
            const schedule = await Schedule.findByIdAndUpdate(id, req.body, { new: true });
            if (!schedule) {
                return res.status(404).json({ message: 'Cannot find schedule' });
            }
            res.json(schedule);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteSchedule(req, res){
        try {
            const schedule = await Schedule.findByIdAndDelete(req.params.id);
            if (!schedule) {
                return res.status(404).json({ message: 'Cannot find schedule' });
            }
            res.json({ message: 'Schedule deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ScheduleControlller;