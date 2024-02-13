const express = require('express');
const auth = require('../middleware/auth');

const {

    getParents,
    createParent,
    getParent,
    updateParent,
    deleteParent,
    loginParent,
    getChildrenInfo,
    findByEmail
    getChildrenInfo,
    addChild
} = require('../controllers/parentController');

const router = express.Router({ mergeParams: true });

//parent-specific routes
router.get('/',getParents);
router.post('/',createParent);
router.get('/:id', getParent);
router.patch('/:id', updateParent);
router.delete('/:id', deleteParent);
router.post('/login', loginParent);

// Get a parent's children information
router.get('/:parentId/children', getChildrenInfo);

router.post('/find', findByEmail);

// Add a child to a parent
router.post('/:parentId/children/:studentId', addChild);

module.exports = router;
