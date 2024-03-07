const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const { GENDER, RACE_ETHNICITY, LANGUAGES, COUNTRIES, US_STATES, CANADIAN_PROVINCES } = require('../constants');

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true},
    role: { type: String, enum: ['student', 'parent', 'instructor', 'admin'], required: true },
    address: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String, required: false },
        city: { type: String, required: true },
        state: {
            type: String,
            enum: US_STATES,
            required: true,
        },
        zipCode: { type: String, required: true},
    },
    phoneNumber: { type: String, required: false},
    preferredCommunication : { type: String, required: false },
    gender: { type: String, enum: GENDER, required: true },
    raceEthnicity: { type: String, enum: RACE_ETHNICITY, required: true },
    primaryLanguage: { type: String, enum: LANGUAGES, required: true},
}, { timestamps: true });


// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
    
    // We should only hash the password if it is being modified or new. 
    if (!this.isModified('hashedPassword')) {
        return next();
    }

    // Salt the password with a salt of 10 and then hash it
    try {
        const salt = await bcrypt.genSalt(10);
        this.hashedPassword = await bcrypt.hash(this.hashedPassword, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;


    