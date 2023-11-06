const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');
const { INSTRUMENTS } = require('../constants');

const studentSchema = new Schema({
    instrument: { type: String, enum: INSTRUMENTS, required: true },
    age: { type: Number, required: true },
    dateOfBirth: { type: Date, required: true },
    school: { type: String, required: true },
    grade: { type: Number, required: true },
    // Might need to make this required, but keeping it optional for now. 
    primaryInstructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: false },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false },
    mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false}],
    howHeardAboutProgram: { type: String, required: false },
});

const Student = User.discriminator('Student', studentSchema);

module.exports = Student;