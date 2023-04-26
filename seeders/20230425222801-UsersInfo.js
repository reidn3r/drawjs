'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('UsersInfos', [{
      username: "reidn3r",
      password: "root",
      lastTimeVisited: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
},

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
