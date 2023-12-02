require('dotenv').config();
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const findUserByUsername = require('../services/findUserByUsernameService');

const loginPOST = async(req, res) => {
    const { username, password } = req.body;

    //validations
    if(!username || !password) return res.status(401).json({message: "username and password are required"});

    //check if user exists
    const foundUser = await findUserByUsername(username);
    if(!foundUser) return res.status(401).json({message: "username not registered"});
    
    //check if password is correct
    const match = await bcrypt.compare(password, foundUser.password);
    if(!match) return res.status(401).json({message: "wrong password"});

    const token = jwt.sign({user_id: foundUser.id}, process.env.SECRET, { expiresIn: 60*60 });
    
    res.cookie('jwt', token, {httpOnly: true, secure:false});

    return res.status(200).redirect('/draw');
}

module.exports = loginPOST;