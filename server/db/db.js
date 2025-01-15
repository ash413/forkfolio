const mongoose = require('mongoose')
require('dotenv').config()

const connectToDatabase = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected!")
    } catch (error) {
        console.log("Error connecting to database", error)
        process.exit(1)
    }
}


const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, required: true},
    password: {type: String, required: true},
    bio: String,
    createdAt: {type: Date, default: Date.now()},
})

const User = mongoose.model('User', userSchema)


const recipeSchema = new mongoose.Schema({
    title: String,
    ingredients: [String],
    steps: String,
    image: String,
    likes: { type: Number, default: 0 },
    postedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    likedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
})

const Recipe = mongoose.model('Recipe', recipeSchema)



module.exports = {
    connectToDatabase,
    User,
    Recipe,
}