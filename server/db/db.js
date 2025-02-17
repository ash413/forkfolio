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
    email: {type: String, required: true, unique: true},
    username: {type: String, required:true, unique: true},
    password: {type: String, required: true},
    bio: String,
    profilePic: {type: String, default:'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'},
    bookmarkedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    aiUsageCount: { type: Number, default: 0 }
}, {timestamps: true})

const User = mongoose.model('User', userSchema)


const recipeSchema = new mongoose.Schema({
    title: String,
    ingredients: [String],
    steps: [String],
    image: String,
    likes: { type: Number, default: 0 },
    postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},  
    //for remembering purposes - this does not have a [] around it like 
    //'likedBy' since its posted by only one person - the author, whereas 
    //likedby can have multiple people liking that recipe and therefore needs 
    //to be an array of ids
    likedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    bookmarks: {type: Number, default: 0},
    bookmarkedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, {timestamps: true})

recipeSchema.pre('save', function(next) {
    this.ingredients = this.ingredients.map(i => i.toLowerCase().trim());
    next();
});

const Recipe = mongoose.model('Recipe', recipeSchema)



module.exports = {
    connectToDatabase,
    User,
    Recipe,
}