const mongoose = require('mongoose');
const Attendance = require('../models/attendance/attendanceModel');

const recordAttendance = async (req, res) => {
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
};
        

const getAttendanceRecords = async (req, res) => {
    try {
        const records = await Attendance.find().populate('class').populate('students.student');
        res.status(200).send(records);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateAttendanceRecord = async (req, res) => {
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
};

module.exports = {
    recordAttendance,
    getAttendanceRecords,
    updateAttendanceRecord
};