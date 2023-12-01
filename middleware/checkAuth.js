const checkLogin = (req, res, next) => {
    return res.locals.auth ? res.status(200).redirect('/draw') : next(); 
}

module.exports = checkLogin;
