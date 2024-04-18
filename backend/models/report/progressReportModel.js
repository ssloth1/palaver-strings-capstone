const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../user/userModel')

const progressReportSchema = new Schema({
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, validate: {
        validator: async (v) => {
            const user = await User.findOne({ _id: `${v}`});
            return (user.roles.includes('instructor') || user.role === 'instructor' );
        },
    } },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, validate: {
        validator: async (v) => {
            const user = await User.findOne({ _id: `${v}`});
            return (user.roles.includes('student') || user.role === 'student' );
        },
    } },
    //Validation needed on instructor and student types
    createdAt: { type: Date, default: Date.now },
    questions: [{question: String, score: Number}], //This is the array of questions and scores
    comments: { type: String, required: false },
    finalScore: { type: Number, required: true }, //This is the overall score for the report
});

const ProgressReport = mongoose.model('ProgressReport', progressReportSchema);

module.exports = ProgressReport;
