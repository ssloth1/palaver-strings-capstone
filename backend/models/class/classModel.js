const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../user/userModel')

const classSchema = new Schema ({
    name: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, validate: {
        validator: async (v) => {
            const user = await User.findOne({ _id: `${v}`});
            return (user.roles.includes('instructor') || user.role === 'instructor' );
        },
    }},
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, validate: {
        validator: async (v) => {
            const user = await User.findOne({ _id: `${v}`});
            return (user.roles.includes('student') || user.role === 'student' );
        },
    }}],
    //Need validation on instructor and student roles

   
    meetingDay: [{ type: String, required: true }],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true},
    classroom: { type: String, required: true, enum: ['Studio 1', 'Studio 2', 'Studio 3', 'Studio 4', 'Studio 5', 'Studio 6']},

    //This field is not used at this time. Included for future functionality
    //We anticipate archiving being useful as an alternative to deleting
    archived: { type: Boolean, default: false, required: true }

}, {timestamps: true});

classSchema.index({ instructor: 1});
classSchema.index({ meetingDay: 1, startTime: 1, endTime: 1});
classSchema.index({ name: 'text' });


const Class = mongoose.model('Class', classSchema);

module.exports = Class;