const express = require('express');
const auth = require('../middleware/auth');

const attendanceController = require('../controllers/attendanceController');

const router = express.Router({mergeParams: true});

router.post('/', attendanceController.recordAttendance.bind(attendanceController));
router.get('/', attendanceController.getAttendanceRecords.bind(attendanceController));
router.patch('/:attendanceId', attendanceController.updateAttendanceRecord.bind(attendanceController)); 

module.exports = router;

