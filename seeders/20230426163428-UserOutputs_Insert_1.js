'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('UserOutputs', [{
      user_id: 1,
      sketch_id: 1,
      probabability: 0.5,
      createdAt: new Date(),
      updatedAt: new Date(),
  }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserOutputs', null, {});
  }
};
