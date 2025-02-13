import { Model, InferAttributes, InferCreationAttributes, Sequelize, DataTypes, CreationOptional } from "sequelize";

class DoctorNote extends Model<
    InferAttributes<DoctorNote>,
    InferCreationAttributes<DoctorNote>
> {
    declare id: CreationOptional<string>;
    declare doctorId: string;
    declare patientId: string;
    declare encryptedNote: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate(models: any) {
        this.belongsTo(models.Doctor, {
            foreignKey: "doctorId",
            targetKey: "id",
            as: "doctor",
        });

        this.belongsTo(models.Patient, {
            foreignKey: "patientId",
            targetKey: "id",
            as: "patient",
        });
    }
}

export const initDoctorNote = (sequelize: Sequelize) => {
    DoctorNote.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            doctorId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            patientId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            encryptedNote: {
                type: DataTypes.TEXT,
                allowNull: false,
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
            modelName: "DoctorNote",
            tableName: "doctor_notes",
            underscored: true,
        }
    );
};

export default DoctorNote;
