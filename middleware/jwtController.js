require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const token = req.cookies.jwt;
    if(!token) return res.status(401).json({message: "invalid token"});
    try{
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if(err){
                console.log(`ERROR: ${err.message}`);
                res.redirect('/login');
            }
            else{
                next();
            }
        });
    }
    catch(err){
        res.status(401).redirect('/login');
    }
}

module.exports = verifyJWT;