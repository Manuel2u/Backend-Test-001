import { combineResolvers } from "graphql-resolvers";
import { IResolvers } from "../../type";
import { MyContext } from "../..";

const userResolver: IResolvers = {
  User: {
    fullName: (user) => {
      return `${user.firstName} ${user.lastName}`;
    }
  }
};

export default userResolver;
