const express = require('express');
const messageController = require('../controllers/messageController');
const router = express.Router({mergeParams: true});

//Basic Routes
router.get('/', messageController.getAllMessages.bind(messageController));
router.get('/read/:id', messageController.getMessage.bind(messageController));
router.delete('/:id', messageController.deleteMessage.bind(messageController));
router.post('/', messageController.createMessage.bind(messageController));

//user functionality routes
router.get('/toUser/:id', messageController.getMessagesToUser.bind(messageController));
router.post('/mail', messageController.getMessagesToUserByEmail.bind(messageController));
router.get('/fromUser/', messageController.getMessagesFromUser.bind(messageController));

module.exports = router;