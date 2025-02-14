import { combineResolvers } from "graphql-resolvers";
import { IResolvers } from "../../type";
import { isAuthenticated } from "../../middlewares/verification";
import { checkInReminder, getAllActionableSteps, getAllReminders } from "../../brokers/reminder";

const remindersResolver: IResolvers = {
    Query: {
        getAllActionableSteps: combineResolvers(
            isAuthenticated,
            async (_, args, context) => {
                return await getAllActionableSteps({ ...args })
            }
        ),
        getAllReminders: combineResolvers(
            isAuthenticated,
            async (_, args, context) => {
                return await getAllReminders({ ...args })
            }
        ),
    },
    Mutation: {
        checkInReminder: combineResolvers(
            isAuthenticated,
            async (_, args, context) => {
                return await checkInReminder({ ...args, patientId: context?.user })
            }
        ),
    },
};

export default remindersResolver;