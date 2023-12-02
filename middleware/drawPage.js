require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    /* 
        1. Verifica a autenticação do usuário antes de acessar a funcionalidade principal
    */
    const token = req.cookies.jwt;

    if(!token) return res.status(401).redirect('/login');
    try{
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if(err){
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