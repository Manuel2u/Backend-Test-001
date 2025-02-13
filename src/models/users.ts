import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    Sequelize,
    DataTypes,
    CreationOptional,
} from "sequelize";

class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: CreationOptional<string>;
    declare firstName: string
    declare lastName: string
    declare email: string
    declare tally: string
    declare avatar: string
    declare encryptedPrivateKey: string
    declare publicKey: string
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate(models: any) {
        this.hasOne(models.UserAccountMeta, {
            foreignKey: "ownerId",
            sourceKey: "id",
            as: "accountMeta",
        });

        this.hasOne(models.UserLoginMeta, {
            foreignKey: "ownerId",
            sourceKey: "id",
            as: "loginMeta",
        });
    }
}

export const initUser = (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            tally: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            encryptedPrivateKey: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            publicKey: {
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
            modelName: "User",
            tableName: "users",
            underscored: true,
        }
    );
};

export default User;