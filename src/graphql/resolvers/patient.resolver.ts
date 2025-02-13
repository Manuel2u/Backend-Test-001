import { combineResolvers } from "graphql-resolvers";
import { IResolvers } from "../../type";
import { isAuthenticated } from "../../middlewares/verification";
import { MyContext } from "../..";
import { updatePatient } from "../../brokers/patient";


const patientResolver: IResolvers = {
    Mutation: {
        updatePatient: combineResolvers(
            isAuthenticated,
            async (root, args, context: MyContext) => {
                const response = await updatePatient({
                    ...args,
                });
                return response
            }
        ),
    },
};

export default patientResolver;