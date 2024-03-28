const express = require('express');
const ScheduleController = require('../controllers/scheduleController');
const scheduleController = require('../controllers/scheduleController');
const router = express.Router();

const ScheduleController = new ScheduleController();

router.post('/', (req, res) => scheduleController.createSchedule(req, res));
router.get('/', (req, res) => scheduleController.getAllSchedules(req, res));
router.get('/:id', (req, res) => scheduleController.getScheduleById(req, res));
router.patch('/:id', (req, res) => scheduleController.updateSchedule(req, res));
router.delete('/:id', (req, res) => scheduleController.deleteSchedule(req, res));

module.exports = router;