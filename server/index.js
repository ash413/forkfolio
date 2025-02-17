const express = require('express')
require('dotenv').config() 
const cors = require('cors')
const app = express()

const { connectToDatabase } = require('./db/db')

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const recipeRouter = require('./routes/recipeRoutes')
const aiRouter = require('./routes/aiRoutes')


app.use(cors({
    origin: [
        'http://18.188.78.207',
        'https://forkfolio-connect.vercel.app',
        'https://forkfolio.vaishnavikadam.com'
    ],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
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
//ai suggestions
app.use('/', aiRouter)


connectToDatabase().then(() => {
    const PORT = process.env.PORT || 8000
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`)
})
})
