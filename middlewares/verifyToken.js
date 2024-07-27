const jwt = require('jsonwebtoken');

// Verify the token
function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

// Verify the token and check if the user is an admin

function verifyTokenAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (!req.user.isAdmin) {
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
            return res.status(403).json({ message: 'Forbidden, and your IP address has been sent to the administrator. ', ipAddress });
        } else {
            next();
        }
    });
}

// Verify the token for user only. This is useful for routes that are meant for only authenticated users.
function verifyTokenUser(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });

        } else {
            next();
        }
    });
}

module.exports = {
    verifyToken,
    verifyTokenAdmin,
    verifyTokenUser,
}