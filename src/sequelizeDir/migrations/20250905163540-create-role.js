'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'roles',
        {
          id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
          role: { type: Sequelize.STRING, allowNull: false },
          description: { type: Sequelize.STRING, allowNull: true },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
          updated_at: { type: Sequelize.DATE, allowNull: false },
          deleted_at: { type: Sequelize.DATE },
        },
        { transaction: t }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('roles', { transaction: t, cascade: true });
    });
  },
};
