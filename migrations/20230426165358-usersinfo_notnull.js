'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('UsersInfos', 'username',
      { 
        type: Sequelize.STRING,
        allowNull: false 
    });
    await queryInterface.changeColumn('UsersInfos', 'password',
      { 
        type: Sequelize.STRING,
        allowNull: false 
    });
    await queryInterface.changeColumn('UsersInfos', 'lastTimeVisited',
      { 
        type: Sequelize.DATE,
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
