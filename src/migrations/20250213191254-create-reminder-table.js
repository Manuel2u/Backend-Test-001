"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("reminders", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      actionable_step_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      patient_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      reminder_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      acknowledged: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("reminders");
  },
};
