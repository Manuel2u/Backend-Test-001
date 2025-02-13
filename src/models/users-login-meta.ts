import { Model, InferAttributes, InferCreationAttributes, Sequelize, DataTypes, CreationOptional } from "sequelize";

class UserLoginMeta extends Model<InferAttributes<UserLoginMeta>, InferCreationAttributes<UserLoginMeta>> {
    declare id: CreationOptional<number>;
    declare lastLoginAt: Date;
    declare ownerId: string;

    /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
    static associate(models: any) {
        // define association here
        this.belongsTo(models.User, {
            foreignKey: "ownerId",
            targetKey: "id",
            as: "loginMeta",
        });
    }
}


export const initUserLoginMeta = (sequelize: Sequelize) => {
    UserLoginMeta.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            lastLoginAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            ownerId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "UserLoginMeta",
            tableName: "users_login_meta",
            underscored: true,
        }
    );
};

export default UserLoginMeta