import { Model, InferAttributes, InferCreationAttributes, Sequelize, DataTypes, CreationOptional } from "sequelize";

class ActionableStep extends Model<
    InferAttributes<ActionableStep>,
    InferCreationAttributes<ActionableStep>
> {
    declare id: CreationOptional<string>;
    declare doctorNoteId: string;
    declare type: "CHECKLIST" | "PLAN";
    declare description: string;
    declare scheduledAt?: Date;
    declare completed: boolean;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate(models: any) {
        this.belongsTo(models.DoctorNote, {
            foreignKey: "doctorNoteId",
            targetKey: "id",
            as: "doctorNote",
        });
    }
}

export const initActionableStep = (sequelize: Sequelize) => {
    ActionableStep.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            doctorNoteId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM("CHECKLIST", "PLAN"),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            scheduledAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            completed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
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
            modelName: "ActionableStep",
            tableName: "actionable_steps",
            underscored: true,
        }
    );
};

export default ActionableStep;
