const express = require('express');
const jwt = require('jsonwebtoken');
const {authenticateJwt, SECRET} = require('../middlewares/user');
const { User } = require('../database/index')
const bcrypt = require('bcrypt');

const router = express.Router()

//new user signup
router.post('/signup', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const existingUser = await User.findOne({
            $or: [{username}, {email}]
        });
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists! Try to login instead"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
        })
        await newUser.save();

        //creating jwt tokens
        const token = jwt.sign({ userId: newUser._id }, SECRET, {expiresIn: '1h'})
        res.json({"msg": "User created successfully!"})

    } catch (error) {
        res.status(500).json({
            "msg": "Error creating new user"
        })
    }
})

//existing user login
router.post('/login', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const user = await User.findOne({ email })
        if(!user){
            return res.status(400).json({
                "msg": "User not found!"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            return res.status(400).json({
                message: "invalid credentials"
            })
        }

        const token = jwt.sign({userId : user._id}, SECRET, {expiresIn: '1h'});
        res.json({message: "User logged in successfully", token})

    } catch (error) {
        res.status(500).json({
            "msg": "Error signing in"
        })
    }
})


module.exports = router;