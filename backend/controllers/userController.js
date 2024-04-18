require('dotenv').config();
const Mailjet = require('node-mailjet');

const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE
});

const User = require('../models/user/userModel');
const crypto = require('crypto');

exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'No user found with that email address.' });
    }

    // Create a reset token and expiration date
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send the email
    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
            From: {
                Email: process.env.MJ_SENDER_EMAIL,
                Name: process.env.MJ_SENDER_NAME,
            },
            To: [{
                Email: user.email,
            }],
            Subject: 'Password Reset Request',
            TextPart: `Hello, ${user.firstName}!

You are receiving this email because you (or someone else) has requested the reset of the password for your account. Please click on the following link, or paste this into your browser to complete the process:

${process.env.FRONTEND_URL}/reset-password/${token}

If you did not request this, please ignore this email and your password will remain unchanged.`,
        }]
    });

    request
        .then(() => {
            res.json({ message: 'Check your email for the password reset link.' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Failed to send password reset email' });
        });
    };


    exports.resetPassword = async (req, res) => {
        const { token } = req.params;
        const { password } = req.body;
    
        try {
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });
            
            if (!user) {
                return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
            }
            
            user.hashedPassword = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            
            res.json({ message: 'Password has been reset successfully.' });
        } catch (error) {
            console.error(error); // Log the error for server-side debugging
            res.status(500).json({ error: 'An error occurred while resetting the password.' });
        }
    };

    exports.getUser = async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };