'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('UserOutputs', 'user_id',{
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.changeColumn('UserOutputs', 'sketch_id',{
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.changeColumn('UserOutputs', 'probability',{
      type: Sequelize.REAL,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
