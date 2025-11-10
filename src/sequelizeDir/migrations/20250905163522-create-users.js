'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'users',
        {
          id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
          email: { type: Sequelize.STRING, allowNull: false, unique: true },
          date_of_birth: { type: Sequelize.DATE, allowNull: true },
          first_name: { type: Sequelize.STRING, allowNull: true },
          last_name: { type: Sequelize.STRING, allowNull: true },
          password: { type: Sequelize.STRING, allowNull: true },
          profile_image: { type: Sequelize.STRING, allowNull: true },
          is_active: { type: Sequelize.BOOLEAN },
          phone_number: { type: Sequelize.STRING, allowNull: true },
          address: { type: Sequelize.STRING, allowNull: true },
          last_logged_in: { type: Sequelize.DATE, allowNull: true },
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
      await queryInterface.dropTable('users', { transaction: t, cascade: true });
    });
  },
};
