const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { WEEKDAYS } = require('../constants');

const classSchema = new Schema ({
    name: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true, },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false}],

    //Possibly unnecessary
    meetingDay: { type: String, enum: WEEKDAYS, required: true },
    meetingTime: { type: Number, required: true }

})

const Class = mongoose.model('Class', classSchema);

module.exports = Class;