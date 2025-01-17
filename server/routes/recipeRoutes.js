const express = require('express')
const { authMiddleware } = require('../middleware/authMiddleware')
const { Recipe } = require('../db/db')

const router = express.Router()


// get all recipes
router.get('/feed', authMiddleware, async(req, res) => {
    try {
        const recipe = await Recipe.find()
                .sort({ createdAt: -1 })
                .populate('postedBy', 'name')
                .populate('likes')
        return res.json(recipe)
    } catch (error) {
        return res.status(400).json({
            message: "Error fetching all recipes on feed",
            error: error.message
        })
    }
})


// get a single recipe
router.get('/recipe/:id', authMiddleware, async(req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
                .populate('postedBy', 'name')
                .populate('likes')
        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            })
        }
        res.json(recipe)
    } catch (error) {
        return res.status(400).json({
            message: "Error fetching recipe",
            error: error.message
        })
    }
})

//post a new recipe
router.post('/recipe/create', authMiddleware, async(req, res) => {
    try {
        const {title, ingredients, steps, image} = req.body
        const newRecipe = new Recipe({
            title,
            ingredients,
            steps,
            image,
            postedBy: req.userId
        })
        await newRecipe.save()
        return res.status(201).json({
            message: "New recipe posted successfully!",
            recipe: newRecipe
        })
    } catch (error) {
        return res.status(400).json({
            message: "Error fetching recipe",
            error: error.message
        })
    }
})


//update a recipe
router.put('/recipe/:id', authMiddleware, async(req, res) => {
    const { title, ingredients, steps } = req.body;
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe){
            return res.status(403).json({
                message: "Recipe not found!"
            })
        }
        if (recipe.postedBy.toString() !== req.userId){
            return res.status(403).json({
                message: "Unauthorised user trying to update this recipe!"
            })
        }
        recipe.title = title || recipe.title;
        recipe.ingredients = ingredients || recipe.ingredients;
        recipe.steps = steps || recipe.steps;

        await recipe.save()

        return res.status(200).json({
            message: "Recipe updated successfully",
            recipe
        });
    } catch (error) {
        return res.status(400).json({
            message: "Error updating recipe",
            error: error.message
        })
    }
})


// delete a recipe
router.delete('/recipe/:id', authMiddleware, async(req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
        if (!recipe) {
            return res.status(403).json({
                message: "Recipe not found"
            })
        }
        if (recipe.postedBy.toString() !== req.userId){
            return res.status(403).json({
                message: "Unauthorised to delete this recipe"
            })
        }
        await Recipe.findByIdAndDelete(req.params.id)
        return res.status(201).json({
            message: "Recipe deleted successfully!"
        })
    } catch (error) {
        return res.status(400).json({
            message: "Error deleting recipe",
            error: error.message
        })
    }
})


// like-unlike toggling > a recipe
router.post('/recipe/:id/toggle-like', authMiddleware, async(req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            })
        }

        const alreadyLiked = recipe.likedBy.includes(req.userId)

        if (alreadyLiked){
            //UNLIKE
            recipe.likedBy = recipe.likedBy.filter(id => id.toString() !== req.userId);
            recipe.likes -= 1;
            await recipe.save();

            return res.json({
                message: "Recipe unliked successfully",
                likes: recipe.likes
            });
        }
        else {
            //LIKE
            recipe.likedBy.push(req.userId);
            recipe.likes += 1;
            await recipe.save();

            return res.json({
                message: "Recipe liked successfully",
                likes: recipe.likes
            });
        }

    } catch (error) {
        return res.status(400).json({
            message: "Error toggling state",
            error: error.message
        })
    }
})



module.exports = router