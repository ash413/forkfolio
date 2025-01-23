const express = require('express')
require('dotenv').config() 
const cors = require('cors')
const app = express()

const { connectToDatabase } = require('./db/db')

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const recipeRouter = require('./routes/recipeRoutes')


app.use(cors({
    origin: 'https://forkfolio-rho.vercel.app/',
    methods: ['POST', 'GET', 'UPDATE', 'DELETE'],
    credentials: true
}));

app.use(express.json())



//ROUTES
//landing page
app.get('/', async(req, res) => {
    res.json({
        message: "Welcome to ForkFolio - Share and discover amazing recipes!"
    })
})
//auth
app.use('/', authRouter)
//user
app.use('/', userRouter)
//recipe
app.use('/', recipeRouter)


connectToDatabase().then(() => {
    const PORT = process.env.PORT || 8000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
})
})
