const express = require('express');
const { User, Recipe } = require('../database/index');
const { authenticateJwt, SECRET } = require('../middlewares/user');
const router = express();

//const zod = require('zod');
/*const recipeValidation = zod.object({
    title: zod.string().min(3).max(100),
    description: zod.string().min(10).max(1000),
    ingredients: z.array(z.object({
        name: z.string(),
        amount: z.string(),
        unit: z.string().optional()
    })),
    steps: z.array(z.object({
        stepNumber: z.number(),
        instruction: z.string()
    })),
    imageUrl: z.string().optional(),
    cookTime: z.number().optional()
})*/


//get all recipes
router.get('/', async (req, res) => {
    try {
        const { page=1, limit=10, search='', sort='latest' } = req.query;

        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            query = {
                $or: [
                    {title: {$regex: search, $options: 'i'}},
                    {description: {$regex: search, $options: 'i'}}
                ]
            }
        }

        let sortQuery = {};
        if (sort === 'latest'){
            sortQuery = {createdAt: -1}
        } else if (sort === 'trending') {
            sortQuery = { 'likes.length':-1 }
        }

        const recipes = await Recipe.find(query)
        .populate('author', 'username')
        .sort(sortQuery)
        .skip((page-1)*limit)
        .limit(parseInt(limit))

        const total = await Recipe.countDocuments(query);

        res.json({
            recipes,
            currentPage: page,
            totalPages: Math.ceil(total/limit),
            total
        })

    } catch ({error}) {
        res.status(500).json({
            message: "Error fetching recipes"
        })
    }
})

//get single recipe
router.get('/:id', async(req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
        .populate('author', 'username')
        .populate('likes', 'username');

        if(!recipe){
            return res.status(404).json({
                message: "Recipe not found"
            })
        }

        res.json({
            recipe
        })

    } catch (error) {
        res.status(500).json({
            message: "Error fetching recipe"
        })
    }
})


//create recipe
router.post('/', authenticateJwt, async(req, res) => {
    try {
        const {
            title,
            description,
            ingredients,
            steps,
            imageUrl,
            cookTime,
            author
        } = req.body;

        const newRecipe = new Recipe({
            title,
            description,
            ingredients: JSON.parse(ingredients),
            steps: JSON.parse(steps),
            imageUrl,
            cookTime,
            author: req.user._id
        })

        await newRecipe.save()

        res.json({
            recipe: newRecipe
        })

    } catch (error) {
        res.status(500).json({
            message: "Error creating recipe"
        })
    }
})


module.exports = router