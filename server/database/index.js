const mongoose = require('mongoose');
const zod = require('zod');
require('dotenv').config();

//connect to mongodb
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected!")        
    } catch (error) {
        console.log("Database not Connected!", error);
        process.exit(1)
    }
}

//zod validation
const userValidation = zod.object({
    username: zod.string().min(3).max(30),
    password: zod.string().min(6),
    email: zod.string().email(),
    bio: zod.string().max(500).optional()
})

const recipeValidation = zod.object({
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
})

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//user schema
const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    bio: String,
    joined_at: {
        type: Date,
        default: Date.now()
    },

    recipes: [{ type: ObjectId, ref: 'Recipe' }],
    likedRecipes: [{ type: ObjectId, ref: 'Recipes' }]
})

//recipe schema
const RecipeSchema = new Schema({
    title: String,
    description: String,
    ingredients: [{
        name: String,
        amount: String,
    }],
    steps: [{
        stepNumber: Number,
        instruction: String
    }],
    imageUrl: String,
    cookTime: Number,
    author: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    createdAt: [{
        type: Date,
        default: Date.now()
    }]
})

const Users = mongoose.model('Users', UserSchema);
const Recipes = mongoose.model('Recipes', RecipeSchema);

module.exports = {
    connectToDatabase,
    userValidation,
    recipeValidation,
    Users,
    Recipes
}