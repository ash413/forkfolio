const express = require('express');
const cors = require('cors');
const recipeRoutes = require('./routes/recipe');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const { connectToDatabase } = require('./database/index');
require('dotenv').config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

//routes
app.use('api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/recipes', recipeRoutes);

//establish connection to database
connectToDatabase().then(() => {
    const PORT = process.env.PORT || 3000; 
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});