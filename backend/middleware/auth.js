const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Get the token from the header
    const token = req.header('Authorization').replace('Bearer ', '');

    // If there's no token, return an error
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'MY_SECRET_KEY');

        // Add the user from the payload
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};

module.exports = authenticate;