'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('audit_logs', {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        title: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        slug: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        permission_type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        feature_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'features',
            key: 'id',
          },
        },
        detail: {
          type: Sequelize.JSONB,
          allowNull: true,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        deleted_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      });
      await queryInterface.addConstraint('audit_logs', {
        type: 'foreign key',
        name: 'audit_log_user_id_fk',
        fields: ['user_id'],
        references: {
          table: 'users',
          field: 'id',
        },
        transaction: t,
      });
      await queryInterface.addConstraint('audit_logs', {
        type: 'foreign key',
        name: 'audit_log_feature_id_fk',
        fields: ['feature_id'],
        references: {
          table: 'features',
          field: 'id',
        },
        transaction: t,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('audit_logs', { transaction: t });
    });
  },
};
