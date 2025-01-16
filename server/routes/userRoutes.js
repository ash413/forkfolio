const express = require('express')
const { authMiddleware } = require('../middleware/authMiddleware')
const { User } = require('../db/db')

const router = express.Router()


// get user profile
router.get('/user/:id', authMiddleware, async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) res.status(404).json({
            message: "User not found"
        })
        res.json(user)
    } catch (error) {
        res.status(400).json({
            message: "Error fetching user profile",
            error
        })
    }
})


// update user profile
router.put('/user/:id', authMiddleware, async(req,res) => {
    if (req.userId != req.params.id) res.status(403).json({
        message: "Unauthorised to update this profile!"
    })
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.json(updatedUser)
    } catch (error) {
        res.status(400).json({
            message: "Error updating user profile",
            error
        })
    }
})


//delete user account
router.delete('/user/:id', authMiddleware, async(req, res) => {
    if (req.userId != req.params.id) res.status(403).json({
        message: "Unauthorised to delete this profile!"
    })
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.json({
            message: "User deleted successfully"
        })
    } catch (error) {
        res.status(400).json({
            message: "Error deleting user profile",
            error
        })
    }
})


module.exports = router