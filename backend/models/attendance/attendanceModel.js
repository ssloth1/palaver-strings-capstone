const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Class = require('../class/classModel');

const attendanceSchema = new Schema ({
    
    date: { type: Date, required: true},
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    students: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //Needs validation for student role.
        status: { type: String, enum: ['present', 'late', 'absent - unexcused', 'absent - excused'], default: 'present'}
    }]
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
