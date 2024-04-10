const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    classroom: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //Validation needed on user type.
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    meetingDays: [{ type: String, required: true }],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
    
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;