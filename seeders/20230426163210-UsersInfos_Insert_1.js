'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('UsersInfos', [{
      username: "reidner",
      password: "abcdef",
      lastTimeVisited: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
  }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UsersInfos', null, {});
  }
};
