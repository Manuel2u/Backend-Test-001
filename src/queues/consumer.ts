import _ from "lodash";
import { Job } from "bullmq";
import { getPatientById } from "../brokers/patient";
import { processLLM } from "../utils/openai";
import { ActionableStep, sequelize } from "../models";
import { parseScheduleToMs } from "../utils";
import { sendMessage } from "./Publisher";



export const remindUserConsumer = async (job: Job
  , token: string): Promise<void> => {
  if (job) {
    try {
      // console.log('Received', msg.content.toString());
      const data = JSON.parse(job.data);
      console.log('Received For Notify User', job?.data);
      if (_.has(data, 'patientId')) {
        const patient = await getPatientById({ id: data.patientId });

      }
      return job?.data;
    } catch (error) {
      job?.log("Error sending notification");
      job?.moveToFailed(error, token);
    }
  }
};


export const processActionableStepsExtraction = async (job: Job, token: string): Promise<void> => {
  if (job) {
    try {
      // console.log('Received', msg.content.toString());
      const data = JSON.parse(job.data);
      console.log('Received For Notify User', job?.data);

      if (_.has(data, 'patientId')) {
        const patient = await getPatientById({ id: data.patientId });


        if (!patient) {
          throw new Error("Patient not found.");
        }

        console.time("process_llm");
        const extractedSteps = await processLLM(data.doctorNoteId);
        console.timeEnd("process_llm");

        console.time("delete_existing_actionable_steps");
        await ActionableStep.destroy({ where: { doctorNoteId: data.doctorNoteId } });
        console.timeEnd("delete_existing_actionable_steps");

        console.time("create_new_actionable_steps");
        await sequelize.transaction(async (transaction) => {
          for (const task of extractedSteps.checklist) {
            await ActionableStep.create(
              {
                doctorNoteId: data.doctorNoteId,
                type: "CHECKLIST",
                description: task,
                completed: false
              },
              { transaction }
            );
          }

          for (const plan of extractedSteps.plan) {
            const delay = parseScheduleToMs(plan.schedule);

            await ActionableStep.create(
              {
                doctorNoteId: data.doctorNoteId,
                type: "PLAN",
                description: plan.task,
                scheduledAt: new Date(Date.now() + delay),
                completed: false
              },
              { transaction }
            );

            sendMessage(
              "backendtest_send_reminder",
              JSON.stringify({
                patientId: data.patientId,
                task: plan.task,
                schedule: plan.schedule,
                delay: delay
              })
            );

          }
        });
        console.timeEnd("create_new_actionable_steps");
        console.log(`✅ LLM processing & reminders scheduled for Patient ${data.patientId}`);
      }
      return job?.data;
    } catch (error) {
      job?.log("Error sending notification");
      job?.moveToFailed(error, token);
    }
  }
}



