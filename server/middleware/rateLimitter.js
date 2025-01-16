const rateLimitter = require('express-rate-limit')

const limitter = rateLimitter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        message: "Too many requests from this IP, please try again later."
    }
})

module.exports = {
    limitter
}