const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');
const { INSTRUMENTS } = require('../constants');


const studentSchema = new Schema({
    
    //Basic creational student data
    instrument: { type: String, enum: INSTRUMENTS, required: true },
    age: { type: Number, required: true },
    dateOfBirth: { type: Date, required: true },
    school: { type: String, required: true },
    grade: { type: Number, required: true },
    howHeardAboutProgram: { type: String, required: false },
    //Setting parent to required: false to allow creation of a student for now.
    //My opinion on the business decision is that parent should be a required item for student creation but not vice versa
    //But I am creating student first, so I'll swap this to required when resolving parent creation (when I can create parents.)
    parent: { type: String, required: false },

    //These fields should likely be handled outside of creation: students may not be assigned to an instructor immediately,
    //and the mentor program is not yet implemented at Palaver, let alone in our code.
    primaryInstructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: false },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false },
    mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false}],

});


const Student = User.discriminator('Student', studentSchema);

module.exports = Student;