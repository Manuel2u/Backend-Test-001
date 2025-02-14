import { Model, InferAttributes, InferCreationAttributes, Sequelize, DataTypes, CreationOptional } from "sequelize";

class Reminder extends Model<
    InferAttributes<Reminder>,
    InferCreationAttributes<Reminder>
> {
    declare id: CreationOptional<string>;
    declare actionableStepId: string;
    declare patientId: string;
    declare reminderAt: Date;
    declare acknowledged: boolean;
    declare missedCount: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate(models: any) {
        this.belongsTo(models.ActionableStep, {
            foreignKey: "actionableStepId",
            targetKey: "id",
            as: "actionableStep",
        });

        this.belongsTo(models.Patient, {
            foreignKey: "patientId",
            targetKey: "id",
            as: "patient",
        });
    }
}

export const initReminder = (sequelize: Sequelize) => {
    Reminder.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            actionableStepId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            patientId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            reminderAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            acknowledged: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            missedCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "Reminder",
            tableName: "reminders",
            underscored: true,
        }
    );
};

export default Reminder;
