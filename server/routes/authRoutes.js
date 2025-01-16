const express = require('express')
const { authMiddleware } = require('../middleware/authMiddleware')
const { User } = require('../db/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY

const router = express.Router()

// new user signup
router.post('/auth/signup', async(req, res) => {
    try {
        const [name, email, password] = req.body
        const hashedPassword = await bcrypt.hash(password)
        const user = new User[{name, email, password: hashedPassword}]
        await user.save()
        res.status(201).json({
            message: "User registered successfully!"
        })
    } catch (error) {
        res.status(400).json({
            message: "Error signing up!",
            error
        })
    }
})

// user login
router.post('/auth/login', async(req, res) => {
    try {
        const [email, password] = req.body;
        const user = await User.findOne({ email });
        if (!user) res.status(404).json({
            message: "No user with these credentials"
        })
        const isMatch = bcrypt.compare(password, user.password)
        if (!isMatch) res.status(404).json({
            message: "Invalid credentials!"
        })
        const token = jwt.sign({id:user._id}, SECRET_KEY, {expiresIn: '1h'})
        res.json(token)
    } catch (error) {
        res.status(400).json({
            message: "Error loging in!",
            error
        })
    }
})


module.exports = router