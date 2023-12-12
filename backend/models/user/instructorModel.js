const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');

const instructorSchema = new Schema({
    orgEmail: { type: String, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false}],
});

const Instructor = User.discriminator('Instructor', instructorSchema);
module.exports = Instructor;