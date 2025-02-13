import { Model, InferAttributes, InferCreationAttributes, Sequelize, DataTypes, CreationOptional } from "sequelize";

class DoctorPatient extends Model<
    InferAttributes<DoctorPatient>,
    InferCreationAttributes<DoctorPatient>
> {
    declare id: CreationOptional<string>;
    declare doctorId: string;
    declare patientId: string;
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

export const initDoctorPatient = (sequelize: Sequelize) => {
    DoctorPatient.init(
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
            modelName: "DoctorPatient",
            tableName: "doctor_patient",
            underscored: true,
        }
    );
};

export default DoctorPatient;
