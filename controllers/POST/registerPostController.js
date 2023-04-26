const bcrypt = require('bcrypt');

const { UsersInfo } = require('../../models');

const registerPost = async(req, res) => {
    const { username, confirm_password, password } = req.body;
    //Missing username, password or confirm password fields
    if(!username || !confirm_password || !password) return res.status(401).json({message: "missing register data"});
    
    //In case of password isn't equal to confirm_password
    if(password !== confirm_password) return res.status(401).json({message: "password and confirm_password does'nt match"});

    const hashpw = await bcrypt.hash(password, 10);
    //username is already registered
    const [userInfo, created] = await UsersInfo.findOrCreate({ 
        where: { username: username},
        defaults:{
            password: hashpw,
            lastTimeVisited: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    });

    if(!created) return res.status(401).json({message: "Username is already registered"});

    res.redirect('/login');
}

module.exports = registerPost;