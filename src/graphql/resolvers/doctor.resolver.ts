import { combineResolvers } from "graphql-resolvers";
import { IResolvers } from "../../type";
import { isAuthenticated } from "../../middlewares/verification";
import { MyContext } from "../..";
import { getAllAvailableDoctors, getAllAvailableDoctorsCount, getPatientsAssignedToDoctor, getPatientsAssignedToDoctorCount, selectDoctor, updateDoctor } from "../../brokers/doctor";
const doctorResolver: IResolvers = {
    Query: {
        getAllAvailableDoctors: combineResolvers(
            isAuthenticated,
            async (root, args, context: MyContext) => {
                const response = await getAllAvailableDoctors({
                    ...args,
                });
                return response;
            }
        ),
        getAllAvailableDoctorsCount: combineResolvers(
            isAuthenticated,
            async (root, args, context: MyContext) => {
                const response = await getAllAvailableDoctorsCount({
                    ...args,
                });
                return response
            }
        ),
        getPatientsAssignedToDoctor: combineResolvers(
            isAuthenticated,
            async (root, args, context: MyContext) => {
                const response = await getPatientsAssignedToDoctor({
                    ...args,
                });
                return response
            }
        ),
        getPatientsAssignedToDoctorCount: combineResolvers(
            isAuthenticated,
            async (root, args, context: MyContext) => {
                const response = await getPatientsAssignedToDoctorCount({
                    ...args,
                });
                return response
            }
        ),
    },
    Mutation: {
        updateDoctor: combineResolvers(
            isAuthenticated,
            async (root, args, context: MyContext) => {
                const response = await updateDoctor({
                    ...args,
                });
                return response
            }
        ),
        selectDoctor: combineResolvers(
            isAuthenticated,
            async (root, args, context: MyContext) => {
                const response = await selectDoctor({
                    ...args,
                });
                return response
            }
        ),
    },
};

export default doctorResolver;