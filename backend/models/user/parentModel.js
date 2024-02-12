const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');

const parentSchema = new Schema({
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true}],
    parentEmail: { type: String, required: true },
    discountPercentage: { type: Number, required: true, default: 0 },
});

const Parent = User.discriminator('Parent', parentSchema);
module.exports = Parent;