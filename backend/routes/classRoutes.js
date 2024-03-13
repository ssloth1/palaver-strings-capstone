const express = require('express');
const classController = require('../controllers/classController');
const router = express.Router({mergeParams: true});

router.post('/', classController.addClass.bind(classController));
router.get('/', classController.getAllClasses.bind(classController));
router.put('/:id', classController.updateClass.bind(classController));
router.delete('/:id', classController.deleteClass.bind(classController));
router.get('/:classId', classController.getClassById);

module.exports = router;