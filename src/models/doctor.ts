import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    Sequelize,
    DataTypes,
    CreationOptional,
} from "sequelize";

class Doctor extends Model<
    InferAttributes<Doctor>,
    InferCreationAttributes<Doctor>
> {
    declare id: CreationOptional<string>;
    declare userId: string
    declare licenseNumber: string;
    declare specialization: string;
    declare bio: string;
    declare available: boolean;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate(models: any) {
        this.belongsTo(models.User, {
            foreignKey: "userId",
            targetKey: "id",
            as: "user"
        })
        this.hasMany(models.DoctorNote, {
            foreignKey: "doctorId",
            as: "notes"
        });
        this.hasMany(models.DoctorPatient, {
            foreignKey: "doctorId",
            as: "patients"
        });
    }
}

export const initDoctor = (sequelize: Sequelize) => {
    Doctor.init(
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
            available: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            licenseNumber: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            specialization: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            bio: {
                type: DataTypes.TEXT,
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
            modelName: "Doctor",
            tableName: "doctors",
            underscored: true,
        }
    );
};

export default Doctor;