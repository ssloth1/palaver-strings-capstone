const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { User } = require('../user/userModel');
const { USER_TYPES } = require('../constants');
const Class = require('../class/classModel');

const messageSchema = new Schema({
    //Header Info
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
    //toCategory: { type: String, enum: USER_TYPES, required: false}, //I'm replacing this with adding users to the message via controller logic
    //toClass: { type: mongoose.Schema.Types.ObjectID, ref: 'Class', required: false }, //See above
    subjectLine: { type: String, required: false },

    //Message Content
    messageText: { type: String, required: false },

    //Video Content - to be resolved
    messageVideo: { type: String, required: false },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;