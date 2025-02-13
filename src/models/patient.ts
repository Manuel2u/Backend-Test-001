import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    Sequelize,
    DataTypes,
    CreationOptional,
} from "sequelize";

class Patient extends Model<
    InferAttributes<Patient>,
    InferCreationAttributes<Patient>
> {
    declare id: CreationOptional<string>;
    declare userId: string
    declare dateOfBirth: Date;
    declare bloodType: string;
    declare emergencyContact: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate(models: any) {
        this.belongsTo(models.User, {
            foreignKey: "userId",
            targetKey: "id",
            as: "user"
        })
        this.hasMany(models.DoctorNote, {
            foreignKey: "patientId",
            as: "notes"
        });
        this.hasMany(models.DoctorPatient, {
            foreignKey: "patientId",
            as: "doctors"
        });
    }
}

export const initPatient = (sequelize: Sequelize) => {
    Patient.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            bloodType: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            dateOfBirth: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            emergencyContact: {
                type: DataTypes.STRING,
                allowNull: true,
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
            modelName: "Patient",
            tableName: "patients",
            underscored: true,
        }
    );
};

export default Patient;