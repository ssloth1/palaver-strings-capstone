const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    // Undecided: username
    // We might want to add this if Matt, or someone at Palaver strings, 
    // wants to be able to provide student login information directly
    // instead of having them register themselves. 
    
    //username: {
        //type: String,
        //required: true,
        //unique: true
    //}
    hashedPassword: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Hash the password before saving it to the database
studentSchema.pre('save', async function (next) {
    
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


module.exports = mongoose.model('Student', studentSchema);


    