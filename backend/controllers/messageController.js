const { User } = require('../models/user/userModel');
const { Message } = require('../models/class/classModel');


//Retrieves all messages
//Unlikely to be relevant/used.  Included for comprehensiveness
const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({});
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Retrieves a specific message
const getMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if(!message) {
            return res.status(404).json({ message: 'Message not found.' });
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Delete a message
//Should be locked to Admin users if fully implemented at all
const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if(!message) {
            return res.status(404).json({ message: 'Message not found.' });
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Create a message
const createMessage = async (req, res) => {
    try {
        const message = await Message.create(req.body);
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//Gets all messages sent to a user
//Request must include user id and user type
//To do: include messages sent to a class that the user is a member of
const getMessagesToUser = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ toUsers: { $in: [req.params.id ]}}, { toCategory: req.params.userType }]
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Gets all messages sent by a user
const getMessagesFromUser = async (req, res) => {
    try {
        const messages = await Message.find({ fromUser: req.params.id }).exec();
        if (!messages) {
            return res.status(404).json({ message: "No messages from the User." });
        }
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

module.exports = {
    getAllMessages,
    getMessage,
    deleteMessage,
    createMessage,
    getMessagesToUser,
    getMessagesFromUser
}