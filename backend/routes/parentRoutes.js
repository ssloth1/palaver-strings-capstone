const express = require('express');
const auth = require('../middleware/auth');

const parentController = require('../controllers/parentController');
const newUserController = require('../controllers/newUserController');


const router = express.Router({ mergeParams: true });

//parent-specific routes
router.get('/', newUserController.getParents.bind(newUserController));
//router.post('/', parentController.createParent.bind(parentController));
//router.get('/:id', parentController.getParent.bind(parentController));
//router.patch('/:id', parentController.updateParent.bind(parentController));
//router.delete('/:id', parentController.deleteParent.bind(parentController));
//router.post('/login', parentController.loginParent.bind(parentController));

// Get a parent's children information
router.get('/:parentId/children', newUserController.getChildrenInfo.bind(newUserController));

router.post('/find', parentController.findByEmail.bind(parentController));

// Add a child to a parent
router.post('/:parentId/children/:studentId', newUserController.addChild.bind(newUserController));

module.exports = router;
