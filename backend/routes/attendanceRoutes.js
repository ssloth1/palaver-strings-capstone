const express = require('express');
const auth = require('../middleware/auth');

const {
    recordAttendance,
    getAttendanceRecords,
    updateAttendanceRecord
} = require('../controllers/attendanceController');

const router = express.Router({mergeParams: true});

router.post('/', recordAttendance);
router.get('/', getAttendanceRecords);
router.patch('/:attendanceId', updateAttendanceRecord); 

module.exports = router;

