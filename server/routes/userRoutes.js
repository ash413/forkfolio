const express = require('express')
const { authMiddleware } = require('../middleware/authMiddleware')
const { User } = require('../db/db')
const { Recipe } = require('../db/db')

const router = express.Router()


// get user profile
router.get('/user/:username', authMiddleware, async(req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        const recipes = await Recipe.find({ postedBy: user._id }).sort({ createdAt: -1 });
        res.json({user, recipes});
    } catch (error) {
        res.status(400).json({
            message: "Error fetching user profile",
            error: error.message
        })
    }
})


//get search queries of users
router.get('/search', authMiddleware, async(req, res) => {
    try {
        const query = req.query.query;
        const users = await User.find({
            name: { $regex: query, $options: 'i' }  // Case-insensitive search
        }).select('-password');
        
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.json(users);
    } catch (error) {
        res.status(400).json({
            message: "Error searching users",
            error: error.message
        })
    }
})


// update user profile
router.put('/user/:id', authMiddleware, async(req,res) => {
    if (req.userId != req.params.id) {
        return res.status(403).json({
            message: "Unauthorised to update this profile!"
        })
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.json(updatedUser)
    } catch (error) {
        res.status(400).json({
            message: "Error updating user profile",
            error: error.message
        })
    }
})


//delete user account
router.delete('/user/:username', authMiddleware, async(req, res) => {
    /*if (req.userId != req.params.id){
        return res.status(403).json({
            message: "Unauthorised to delete this profile!"
        }) //changed /user/:id to /user/:username
    } */
    try {
        const user = await User.findOne({username : req.params.username})
        if(!user){
            return res.status(404).json({
                message: "User not found!"
            })
        }
        if (req.userId !== user._id.toString()) {
            return res.status(403).json({
                message: "Unauthorized to delete this profile!"
            });
        }
        await User.findByIdAndDelete(user._id);

        res.json({
            message: "User deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error deleting user profile",
            error: error.message
        })
    }
})


// FEATURE UPDATE 1.1
//fetch all bookmarks
router.get('/user/:username/bookmarked', authMiddleware, async(req, res) => {
    try {
        const user = await User.findOne({username: req.params.username})
                            .populate('bookmarkedRecipes')
        return res.json(user.bookmarkedRecipes)

    } catch (error) {
        res.status(500).json({
            message: "Error fetching all bookmarks of user",
            error: error.message
        })
    }
})


module.exports = router