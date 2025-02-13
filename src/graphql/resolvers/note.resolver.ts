import { combineResolvers } from "graphql-resolvers";
import { IResolvers } from "../../type";
import { isAuthenticated } from "../../middlewares/verification";
import { createDoctorNote, getDoctorNotes } from "../../brokers/notes";
import { decryptNote } from "../../utils/crypto";


const notesResolver: IResolvers = {
    Query: {
        getNotes: combineResolvers(
            isAuthenticated,
            async (root, args, context) => {
                const response = await getDoctorNotes({
                    ...args,
                });

                return response;
            }
        ),
    },
    Mutation: {
        createNote: combineResolvers(
            isAuthenticated,
            async (root, args, context) => {
                const response = await createDoctorNote({
                    ...args.input,
                });

                return response;
            }
        ),
    },
    Note: {
        note: async (parent) => {
            const encryptedNote = parent.encryptedNote
            const patientId = parent.patient?.user?.id

            const decryptedNote = await decryptNote(encryptedNote, patientId)

            return decryptedNote
        }
    }
};

export default notesResolver;