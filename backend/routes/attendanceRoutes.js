const express = require('express');
const auth = require('../middleware/auth');

const attendanceController = require('../controllers/attendanceController');

const router = express.Router({mergeParams: true});

router.post('/', attendanceController.recordAttendance.bind(attendanceController));
router.get('/', attendanceController.getAttendanceRecords.bind(attendanceController));
router.get('/dates/:classId', attendanceController.getDatesByClass.bind(attendanceController));
router.get('/:classId/:date', attendanceController.getAttendanceByClassAndDate.bind(attendanceController));
router.patch('/:attendanceId', attendanceController.updateAttendanceRecord.bind(attendanceController)); 
router.delete('/:attendanceId', attendanceController.deleteAttendanceRecord.bind(attendanceController));

module.exports = router;

