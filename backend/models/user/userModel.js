const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const { GENDER, RACE_ETHNICITY, LANGUAGES, COUNTRIES, US_STATES, INSTRUMENTS } = require('../constants');

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true},

    // The following fields are for password reset functionality
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },

    roles: [{ type: String, enum: ['student', 'parent', 'instructor', 'admin'], required: true }],
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

    //This field is for admins only
    //We need to update this: create - split Admin, Student, Instructor, Parent.  What does read mean? We currently don't have update yet. Split delete.
    permissions: { type: [String], default: ['create', 'read', 'update', 'delete'], required: function() { return this.roles.includes('admin')} },

    //This field is for instructors only
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false}], //Replaced by class model?

    //These were originally parent fields - specific comments below
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false}],
    parentEmail: { type: String, required: false }, //Check logic - may make more sense to use single email from above
    discountPercentage: { type: Number, required: false, default: 0 }, //May make more sense to associate with student user specifically, not with parent.

    //These were originally student fields - specific comments below
    instrument: { type: String, enum: INSTRUMENTS, required: function() { return this.isNew && (this.roles.includes('student') || this.roles.includes('instructor')); } }, // Required only when new.  May be useful for instructors as well
    dateOfBirth: { type: Date, required: function() { return this.isNew && this.roles.includes('student'); } }, // Required only when new
    school: { type: String, required: function() { return this.isNew && this.roles.includes('student'); } }, // Required only when new
    grade: { type: Number, required: function() { return this.isNew && this.roles.includes('student'); } }, // Required only when new
    howHeardAboutProgram: { type: String, required: false },
    parent: { type: mongoose.Schema.Types.ObjectID, ref: 'User', required: false },

    //These are all student fields that are currently not used.  Specific comments below
    primaryInstructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, //Replaced by class model?
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, //No mentor module yet
    mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false}], //No mentor module yet
    progressReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProgressReport', required: false }], //Progress reports currently on hold

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


    