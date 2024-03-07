const express = require('express');
const classController = require('../controllers/classController');
const router = express.Router({mergeParams: true});

router.post('/classes', classController.addClass.bind(classController));
router.get('/classes', classController.getAllClasses.bind(classController));
router.put('/classes/:id', classController.updateClass.bind(classController));
router.delete('/classes/:id', classController.deleteClass.bind(classController));

module.exports = router;