// auth.Middleware.js

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 
const BEARER_PREFIX = 'Bearer ';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
        return res.status(401).json({ 
            error: 'Access denied. No token provided or malformed header.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET); 
        req.user = {
            userID: decoded.userID, 
            email: decoded.email
        };
        
        next();
        
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' }); 
    }
};

module.exports = authenticate;