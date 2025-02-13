import { combineResolvers } from "graphql-resolvers";
import { IResolvers } from "../../type";
import { isAuthenticated } from "../../middlewares/verification";
import { loginUsers, signUpUser } from "../../brokers/auth";

const authResolver: IResolvers = {
    Mutation: {
        signUpUser: async (parent, args, context, info) => {
            console.log(args);
            const response = await signUpUser({
                ...args.input,
            }, { ...context }
            )
            return response;
        },
        loginUser: async (parent, args, context, info) => {
            console.log(args);
            const response = await loginUsers({
                ...args,
            }, { ...context }
            )
            return response;
        },
    },
};

export default authResolver;

