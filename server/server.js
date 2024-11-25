const express = require('express');
const recipeRoutes = require('./routes/recipe');
const userRoutes = require('./routes/user')

const app = express();

app.use('/api/recipes', recipeRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT);