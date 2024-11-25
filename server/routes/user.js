const express = require('express');

const router = express.Router();
const { User, Recipe} = require('../database/index')
const auth = require('../middleware/auth');


//get user profile
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

//get users recipes
router.get('/:id/recipes', async (req, res) => {
    try {
        const { page=1, limit=10 } = req.query;

        const recipes = await Recipe.find({ author: req.params.id})
        .sort({ createdAt: -1 })
        .skip((page-1)*limit)
        .limit(limit)
        .populate('author', 'username');

        const total = await Recipe.countDocuments({ author: req.params.id })

        res.json({
            recipes,
            totalPages: Math.ceil(total/limit),
            currentPage: page,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching user's recipes"
        })
    }
})

//get user's liked recipes
router.get('/:id/liked-recipes', async (req, res) => {
    try {
        const { page=1, limit=10 } = req.query;

        const likedRecipes = await Recipe.find({ likes: req.params.id })
        .sort({ createdAt: -1 })
        .skip((page-1)*limit)
        .limit(limit)
        .populate('author', 'username');

        const total = await Recipe.countDocuments({ likes: req.params.id });

        res.json({
            likedRecipes,
            totalPages: Math.ceil(total/limit),
            currentPage: page
        })

    } catch (error) {
        res.status(500).json({
            message: "Error fetching user's liked recipes"
        })
    }

})


//search user
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;

        const users = await User.find({
            $or:[
                { username: { $regex: q, $options: 'i' } },
                { bio: { $regex: q, $options: 'i' } }
            ]
        })
        .select('username bio')
        .limit(10);

        res.json({
            users
        })


    } catch (error) {
        res.status(500).json({
            message: "Error searching user"
        })
    }
})

module.exports = router