const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');

const parentSchema = new Schema({
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false}],
    parentEmail: { type: String, required: false },
    discountPercentage: { type: Number, required: false, default: 0 },
});

const Parent = User.discriminator('Parent', parentSchema);
module.exports = Parent;