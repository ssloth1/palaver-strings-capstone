const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema ({
    name: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true, },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false}],

    //Possibly unnecessary
    meetingDay: [{ type: String, required: true }],
    meetingTime: { type: String, required: true }

}, {timestamps: true});

classSchema.index({ instructor: 1});
classSchema.index({ meetingDay: 1, meetingTime: 1});
classSchema.index({ name: 'text' });


const Class = mongoose.model('Class', classSchema);

module.exports = Class;