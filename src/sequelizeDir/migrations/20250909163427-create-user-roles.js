'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'users_roles',
        {
          id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
          role_id: {
            type: Sequelize.UUID,
            references: {
              model: 'roles',
              key: 'id',
            },
          },
          user_id: {
            type: Sequelize.UUID,
            references: {
              model: 'users',
              key: 'id',
            },
          },
        },
        { transaction: t }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('users_roles', { transaction: t, cascade: true });
    });
  },
};
