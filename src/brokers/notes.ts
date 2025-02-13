import { Doctor, Patient, DoctorNote, ActionableStep, sequelize, User } from "../models";
import { sendMessage } from "../queues/Publisher";
import { MutationCreateNoteArgs } from "../types/generated";
import { preprocessFilter, preprocessSort, processPagination } from "../utils";
import { encryptNote } from "../utils/crypto";
import logger from "../utils/logger";

export const createDoctorNote = async (
    { doctorId, patientId, note }: MutationCreateNoteArgs["input"]) => {
    console.time("create_doctor_note");
    try {
        console.time("validate_doctor_patient");
        const doctor = await Doctor.findByPk(doctorId);
        const patient = await Patient.findByPk(patientId);
        console.timeEnd("validate_doctor_patient");

        if (!doctor || !patient) {
            throw new Error("Doctor or patient not found.");
        }

        console.time("encrypt_note");
        const encryptedNote = await encryptNote(note, patient?.userId);
        console.timeEnd("encrypt_note");

        console.time("delete_existing_actionable_steps");
        await ActionableStep.destroy({ where: { doctorNoteId: patientId } });
        console.timeEnd("delete_existing_actionable_steps");

        console.time("create_new_note");
        let newNote: DoctorNote;
        await sequelize.transaction(async (transaction) => {
            newNote = await DoctorNote.create(
                { doctorId, patientId, encryptedNote },
                { transaction }
            );
        });
        console.timeEnd("create_new_note");

        sendMessage(
            "backendtest_process_llm",
            JSON.stringify({
                doctorNoteId: newNote.id,
                patientId: patientId
            })
        );

        return true

    } catch (e) {
        logger.error(`ERROR CREATING DOCTOR NOTE: ${e}`);
        throw new Error("An error occurred while creating the note. Please try again.");
    }
};


export const getDoctorNotes = async ({ filter, sort, pagination, condition }: any) => {
    try {

        const { limit, offset } = processPagination(pagination);
        const where = preprocessFilter(filter, condition, DoctorNote);

        console.log("WHERE", where);

        const sortObj = preprocessSort(sort);

        const notes = await DoctorNote.findAll({
            where,
            limit,
            offset,
            order: sortObj,
            include: [
                {
                    model: Patient,
                    as: "patient",
                    include: [
                        {
                            model: User,
                            as: "user",
                        }
                    ]
                },
                {
                    model: Doctor,
                    as: "doctor",
                    include: [
                        {
                            model: User,
                            as: "user",
                        }
                    ]
                }
            ]
        });

        return notes

    } catch (e) {
        logger.error(`ERROR GETTING DOCTOR NOTES: ${e}`);
        throw e
    }
}
