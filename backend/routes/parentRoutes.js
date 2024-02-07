const express = require('express');

const { 
    getChildrenInfo,
    addChild
} = require('../controllers/parentController');

const router = express.Router({ mergeParams: true });

// Get a parent's children information
router.get('/:parentId/children', getChildrenInfo);

// Add a child to a parent
router.post('/:parentId/children/:studentId', addChild);

module.exports = router;
