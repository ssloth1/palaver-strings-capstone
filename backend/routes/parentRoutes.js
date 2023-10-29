const express = require('express');

const { 
    getChildrenInfo 
} = require('../controllers/parentController');

const router = express.Router({ mergeParams: true });

// Get a parent's children information
router.get('/:parentId/children', getChildrenInfo);

module.exports = router;
