const jwt = require('jsonwebtoken');

const deleteToken = (req, res, next) => {
    const foundToken = req.cookies.jwt;
    if(foundToken){
        res.clearCookie("jwt");
    }
    next();
}

module.exports = deleteToken;