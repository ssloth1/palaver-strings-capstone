const express = require('express');
const {
    getAllMessages,
    getMessage,
    deleteMessage,
    createMessage,
    getMessagesToUser,
    getMessagesFromUser,
    getMessagesToUserByEmail
} = require('../controllers/messageController');
const router = express.Router({mergeParams: true});

//Basic Routes
router.get('/', getAllMessages);
router.get('/read/:id', getMessage);
router.delete('/:id', deleteMessage);
router.post('/', createMessage);

//user functionality routes
router.get('/toUser/:id', getMessagesToUser);
router.post('/mail', getMessagesToUserByEmail);
router.get('/fromUser/:id', getMessagesFromUser);

module.exports = router;