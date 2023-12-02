const UsersInfo = require('../models/usersinfo');

const findOrCreateUser = async(username, password) => {
    const [userInfo, created] = await UsersInfo.findOrCreate({ 
        where: { username: username},
        defaults:{
            password: password,
            lastTimeVisited: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    });
    return { userInfo, created };
}

module.exports = findOrCreateUser;