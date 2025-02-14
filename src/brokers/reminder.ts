import { ActionableStep, Reminder } from "../models";
import { MutationCheckInReminderArgs, QueryGetAllActionableStepsArgs, QueryGetAllRemindersArgs } from "../types/generated";
import { processPagination } from "../utils";
import logger from "../utils/logger";


export const checkInReminder = async ({ reminderId, patientId }: MutationCheckInReminderArgs & { patientId: string }) => {
    try {
        const reminder = await Reminder.findOne({ where: { id: reminderId, patientId } });

        if (!reminder) {
            throw new Error("Reminder not found.");
        }

        await reminder.update({ acknowledged: true });

        await reminder.save();
        console.log(`Patient ${patientId} checked in for reminder ${reminderId}`);

        return true
    } catch (e) {
        logger.error(`ERROR CHECKING IN REMINDER: ${e}`);
        throw e;
    }
};



export const getAllActionableSteps = async ({ doctorNoteId, pagination }: QueryGetAllActionableStepsArgs) => {
    try {
        const { limit, offset } = processPagination(pagination);

        const steps = await ActionableStep.findAll({
            where: { doctorNoteId },
            limit,
            offset,
        });

        return steps

    } catch (e) {
        logger.error(`ERROR GETTING ACTIONABLE STEPS: ${e}`);
        throw e;
    }
}


export const getAllReminders = async ({ patientId, pagination }: QueryGetAllRemindersArgs) => {
    try {
        const { limit, offset } = processPagination(pagination);

        const reminders = await Reminder.findAll({
            where: { patientId },
            limit,
            offset,
        });

        return reminders;

    } catch (e) {
        logger.error(`ERROR GETTING REMINDERS: ${e}`);
        throw e;
    }
}