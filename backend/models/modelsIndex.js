const User = require('./user/userModel');
const Student = require('./user/studentModel');
const Instructor = require('./user/instructorModel');
const Parent = require('./user/parentModel');
const Admin = require('./user/adminModel');
const ProgressReport = require('./report/progressReportModel');

module.exports = {
    User,
    Student,
    Instructor,
    Parent,
    Admin,
    ProgressReport
};