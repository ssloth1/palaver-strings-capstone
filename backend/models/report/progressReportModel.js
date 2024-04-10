const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const progressReportSchema = new Schema({
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    //Validation needed on instructor and student types
    createdAt: { type: Date, default: Date.now },
    questions: [{question: String, score: Number}], //This is the array of questions and scores
    comments: { type: String, required: false },
    finalScore: { type: Number, required: true }, //This is the overall score for the report
});

const ProgressReport = mongoose.model('ProgressReport', progressReportSchema);

module.exports = ProgressReport;
