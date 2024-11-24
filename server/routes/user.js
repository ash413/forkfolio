const express = require('express');

const router = express.Router();
const { User, Recipe} = require('../database/index')
const auth = require('../middleware/auth');

router.get('/:id/profile', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password') // Exclude password
            .lean();

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Get user's recipes count
        const recipesCount = await Recipe.countDocuments({ author: user._id });

        res.json({
            success: true,
            user: {
                ...user,
                recipesCount
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching profile"
        });
    }
});

module.exports = router