const express = require('express');
const auth = require('../middleware/auth');

const parentController = require('../controllers/parentController');

const router = express.Router({ mergeParams: true });

//parent-specific routes
router.get('/', parentController.getParents.bind(parentController));
router.post('/', parentController.createParent.bind(parentController));
router.get('/:id', parentController.getParent.bind(parentController));
router.patch('/:id', parentController.updateParent.bind(parentController));
router.delete('/:id', parentController.deleteParent.bind(parentController));
router.post('/login', parentController.loginParent.bind(parentController));

// Get a parent's children information
router.get('/:parentId/children', parentController.getChildrenInfo.bind(parentController));

router.post('/find', parentController.findByEmail.bind(parentController));

// Add a child to a parent
router.post('/:parentId/children/:studentId', parentController.addChild.bind(parentController));

module.exports = router;
