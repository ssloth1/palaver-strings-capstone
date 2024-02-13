const express = require('express');
const {
    getAllMessages,
    getMessage,
    deleteMessage,
    createMessage,
    getMessagesToUser,
    getMessagesFromUser
} = require('../controllers/messageController');
const router = express.Router({mergeParams: true});

//Basic Routes
router.get('/', getAllMessages);
router.get('/:id', getMessage);
router.delete('/:id', deleteMessage);
router.post('/', createMessage);

//user functionality routes
router.get('/toUser/:id', getMessagesToUser);
router.get('/fromUser/:id', getMessagesFromUser);

module.exports = router;