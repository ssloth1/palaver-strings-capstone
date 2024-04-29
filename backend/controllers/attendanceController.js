const mongoose = require('mongoose');
const Attendance = require('../models/attendance/attendanceModel');
const { Instructor } = require('../models/modelsIndex');

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
        const { classId, dateFrom, dateTo, studentId } = req.query;
        try{
            let query = {};
            if (classId) query.class = classId;
            if (studentId) query["students.student"] = studentId;
            if (dateFrom || dateTo) {
                query.date = {};
                if(dateFrom) query.date.$gte = new Date(dateFrom);
                if(dateTo) query.date.$lte = new Date(dateTo);
            }
    
            const records = await Attendance.find(query)
                .populate({
                    path: 'class',
                    populate: {
                        path: 'instructor',
                        model: 'User',
                        select: 'firstName lastName'
                    }
                })
                .populate({
                    path: 'students.student',
                    select: 'firstName lastName'
            });
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
            console.log(`Querying attendance for class ${classId} on ${date}`);
            const attendanceRecord = await Attendance.findOne({ class: classId, date: date })
                .populate({
                    path: 'students.student',
                    model: 'User'
                });
            console.log("Populated Attendance Record:", attendanceRecord);
                
            if (!attendanceRecord) {
                return res.status(200).send({ message: 'No attendance record found for this class on the specified date', data: null });
            }
            res.status(200).send(attendanceRecord);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching attendance record', error });
        }
    }

    async updateAttendanceRecord(req, res) {
        console.log(req.body);
        const { attendanceId } = req.params;
        const { attendance } = req.body;

        console.log("Received data for update:", attendance);

        try {
            const attendanceRecord = await Attendance.findById(attendanceId);
            if(!attendanceRecord){
                return res.status(404).send({error: 'Attendance record not found'});
            }

            attendanceRecord.students = attendanceRecord.students.map(student => {
                const update = attendance.find(item => item._id.toString() === student._id.toString());
                if (update) {
                    return { ...student.toObject(), status: update.status };
                }
                return student;
            });
            
            await attendanceRecord.save();
            res.status(200).send(attendanceRecord);
        } catch (error) {
            res.status(400).send({message: 'Error updating attendance record', error });
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