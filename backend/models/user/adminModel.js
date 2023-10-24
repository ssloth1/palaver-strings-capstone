const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('./userModel');

const adminSchema = new Schema({
    permissions: { type: [String], default: ['create', 'read', 'update', 'delete'], required: true },
    orgEmail: { type: String, required: true },
    secondaryEmail: { type: String, required: false },
})

const Admin = User.discriminator('Admin', adminSchema);
module.exports = Admin;