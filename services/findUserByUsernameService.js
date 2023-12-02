const UsersInfo = require('../models/usersinfo');

const findUserByUsername = async(username) => {
    return await UsersInfo.findOne({ where: {username: username}});
}

module.exports = findUserByUsername;