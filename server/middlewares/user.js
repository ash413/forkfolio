const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'secret000';



//zod validation
/*
const userValidation = zod.object({
    username: zod.string().min(3).max(30),
    password: zod.string().min(6),
    email: zod.string().email(),
    bio: zod.string().max(500).optional()
})*/




const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            error: "Unauthorised: No token provided!"
        })    
    }
    const token = authHeader.split('')[1];
    jwt.verify(token, SECRET, (err, user) => {
        if(err){
            return res.status(400).json({
                "msg": "Forbidden: Invalid token!"
            })
        }
        req.userId = user.userId;
        next();
    })
}

module.exports = {
    authenticateJwt,
    SECRET,
}