const mongoose = require('mongoose');
const Attendance = require('../models/attendance/attendanceModel');

class AttendanceController {

    async recordAttendance(req, res){
    const { classId, date, attendance } = req.body;

        try {
            const newAttendance = new Attendance({
                date: date,
                class: classId,
                students: attendance.map(att => ({
                    student: att.studentId,
                    status: att.status
                }))
            });

            await newAttendance.save();
            res.status(201).send(newAttendance);
        } catch (error) {
            res.status(400).send(error);
        }
    } 

    async getAttendanceRecords(req, res){
        try {
            const records = await Attendance.find().populate('class').populate('students.student');
            res.status(200).send(records);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async getDatesByClass(req, res) {
        const { classId } = req.params;

        try {
            const dates = await Attendance.find({ class: classId }).distinct('date');
            res.status(200).send(dates);
        } catch (error) {
            res.status(500).send({ message: 'Failed to fetch dates', error });
        }
    }

    async getAttendanceByClassAndDate(req, res) {
        const { classId, date } = req.params;

        try {
            const attendanceRecord = await Attendance.findOne({ class: classId, date: date }).populate('students.student');
            if (!attendanceRecord) {
                return res.status(404).send({ message: 'No attendance record found for this class on the specified date' });
            }
            res.status(200).send(attendanceRecord);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching attendance record', error });
        }
    }

    async updateAttendanceRecord(req, res) {
        const { attendanceId } = req.params;
        const updates = req.body;

        try {
            const attendance = await Attendance.findById(attendanceId);

            if(!attendance){
                return res.status(404).send({error: 'Attendance record not found'});
            }

            Object.keys(updates).forEach(update => attendance[update] = updates[update]);
            await attendance.save();

            res.send(attendance);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async deleteAttendanceRecord(req, res) {
        const { attendanceId } = req.params;

        try {
            const deletedAttendance = await Attendance.findByIdAndDelete(attendanceId);
            if (!deletedAttendance) {
                return res.status(404).json({ message: 'Attendance record not found' });
            }
            res.status(204).json({ message: 'Attendance record successfully deleted' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new AttendanceController;