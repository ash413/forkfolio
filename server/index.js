const express = require('express')
require('dotenv').config() 

const app = express()
const { connectToDatabase } = require('./db/db')



connectToDatabase().then(() => {
    const PORT = process.env.PORT || 8000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
})
})
