const express = require('express');
const cors = require('cors');
//const {authenticateJwt, SECRET} = require('./middlewares/user')
const recipeRoutes = require('./routes/recipe');
const userRoutes = require('./routes/user');
const { connectToDatabase } = require('./database/index');
require('dotenv').config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/user', userRoutes);

//establish connection to database
connectToDatabase().then(() => {
    const PORT = process.env.PORT || 3000; 
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});