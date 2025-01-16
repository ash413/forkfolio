const jwt = require('jsonwebtoken');
require('dotenv').config()

const authMiddleware = (req, res,next) => {
    const token = req.headers['authorisation']
    if (!token) res.status(401).json({
        message: "No token found!"
    })

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({
            error: "Invalid token",
            err
        })
        req.userId = decoded.id
        next();
    })
}

module.exports = {
    authMiddleware
}