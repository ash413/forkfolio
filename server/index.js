const express = require('express')
require('dotenv').config() 

const app = express()
const { connectToDatabase } = require('./db/db')

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const recipeRouter = require('./routes/recipeRoutes')


//ROUTES
//auth
app.use('/auth', authRouter)
//user
app.use('/user', userRouter)
//recipe
app.use('/recipe', recipeRouter)


connectToDatabase().then(() => {
    const PORT = process.env.PORT || 8000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
})
})
