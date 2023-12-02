const jwt = require('jsonwebtoken');

const recruiterAuth = (req, res) => {
    const foundToken = req.cookies.jwt;
    if(!foundToken){
        const token = jwt.sign({user_id: -1}, process.env.SECRET, { expiresIn: 60*60 });
        res.cookie('jwt', token, {httpOnly: true, secure:false});
    }
    return res.status(200).redirect('/draw')
}

module.exports = recruiterAuth;