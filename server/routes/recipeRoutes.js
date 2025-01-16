const express = require('express')
const { authMiddleware } = require('../middleware/authMiddleware')
const { User } = require('../db/db')

const router = express.Router()


// get all recipes




module.exports = router