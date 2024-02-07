const User = require('./user/userModel');
const Student = require('./user/studentModel');
const Instructor = require('./user/instructorModel');
const Parent = require('./user/parentModel');
const Admin = require('./user/adminModel');
const Class = require('/class/classModel');
const Message = require('/message/messageModel');

module.exports = {
    User,
    Student,
    Instructor,
    Parent,
    Admin,
    Class,
    Message
};