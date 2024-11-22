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

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

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
    Users,
    Recipes
}