const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../user/userModel')

const scheduleSchema = new Schema({
    classroom: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, validate: {
        validator: async (v) => {
            const user = await User.findOne({ _id: `${v}`});
            return (user.roles.includes('instructor') || user.role === 'instructor' );
        },
    } }, //Validation needed on user type.
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    meetingDays: [{ type: String, required: true }],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
    
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;