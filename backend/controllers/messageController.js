const { User } = require('../models/modelsIndex');
const mongoose = require('mongoose');
const Message = require('../models/message/messageModel');
const Class = require('../models/class/classModel');

class messageController {
    //Retrieves all messages
    //Unlikely to be relevant/used.  Included for comprehensiveness
    async getAllMessages(req, res){
        try {
            const messages = await Message.find({});
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    //Retrieves a specific message
    async getMessage(req, res){
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
    async deleteMessage (req, res) {
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
    async createMessage(req, res){
        const foundToUsers = new Array;
        try {
            const foundFromUser = await User.findOne({ email: req.body.fromUser });
            if(!foundFromUser) {
                console.log("Email provided as message author does not match a user in the database.")
            }
            if (req.body.toUsers !== ""){
                foundToUsers.push(await User.findOne({ email: req.body.toUsers }));
                if(!foundToUsers) {
                    console.log("Recipient does not exist in the database.");
                    return res.status(404).json({ message: 'Recipient not found in the database.' });
                }    
                console.log()
            }
            if(req.body.toCategory !== ""){
                const categoryMembers = await User.find({ __t:req.body.toCategory });
                for (const member of categoryMembers) {
                    foundToUsers.push(member);
                }
            }
            if (req.body.toClass !== "") {
                const palaverClass = await Class.findById(req.body.toClass)
                for (const student of palaverClass.students){
                    foundToUsers.push(student);
                } 
            }
            
            const preMessage = {
                ...req.body,
                toUsers: foundToUsers,
                fromUser: foundFromUser
            };
            
            const message = await Message.create(preMessage);
            res.status(201).json(message);
        } catch (error) {
            console.log(error.message);
            res.status(400).json({ message: error.message });
        }
    }

    //Gets all messages sent to a user
    //Request must include user id and user type
    //To do: include messages sent to a class that the user is a member of
    async getMessagesToUser (req, res) {
        try {
            const messages = await Message.find({ toUsers: { $in: [req.params.id ]}});
            res.status(200).json(messages);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    //Gets all messages sent to a user (identified by email)
    //request only needs to send email
    //To do: include messages sent to a class that the user is a member of
    async getMessagesToUserByEmail (req, res){
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(500).json({ message: "logged in user is not a user." });
            }
            const messages = await Message.find({
                $or: [{ toUsers: { $in: [user._id ]}}, { toCategory: user.role }]
            })
            res.status(200).json(messages);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    //Gets all messages sent by a user
    //changing to go by email instead of ID since we're still not passing ID to frontend quite right.
    async getMessagesFromUser (req, res){
        try {
            const messages = await Message.find({ email: req.body.email });
            if (!messages) {
                return res.status(404).json({ message: "No messages from the User." });
            }
            return res.status(200).json(messages);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }
}

module.exports = new messageController;