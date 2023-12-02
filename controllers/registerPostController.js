const findOrCreateUser = require('../services/findOrCreateUserService');
const bcrypt = require('bcrypt');

const registerPost = async(req, res) => {
    const { username, confirm_password, password } = req.body;
    //Missing username, password or confirm password fields
    if(!username || !confirm_password || !password) return res.status(401).json({message: "missing register data"});
    
    //In case of password isn't equal to confirm_password
    if(password !== confirm_password) return res.status(401).json({message: "password and confirm_password does'nt match"});

    const hashpw = await bcrypt.hash(password, 10);
    const { userInfo, created } =  await findOrCreateUser(username, hashpw);
    
    //username is already registered
    if(!created) return res.status(401).json({message: "Username is already registered"});

    res.status(200).redirect('/login');
}

module.exports = registerPost;