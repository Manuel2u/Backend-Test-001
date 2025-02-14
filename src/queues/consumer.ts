import _ from "lodash";
import { Job } from "bullmq";
import { getPatientById } from "../brokers/patient";
import { processLLM } from "../utils/openai";
import { ActionableStep, Reminder, sequelize } from "../models";
import { sendMessage } from "./Publisher";
import { parseSchedule } from "../utils";
import { sendReminderQueue } from "./queues";
import logger from "../utils/logger";



export const remindUserConsumer = async (job: Job
  , token: string): Promise<void> => {
  if (job) {
    try {
      const data = JSON.parse(job.data);
      console.log("📌 Processing Reminder Job:", job?.data);

      const reminder = await Reminder.findOne({
        where: { actionableStepId: data.actionableStepId, patientId: data.patientId },
      });

      if (!reminder) {
        throw new Error("Reminder not found.");
      }

      // Check if the reminder was acknowledged
      if (!reminder.acknowledged) {
        await reminder.update({ missedCount: reminder.missedCount + 1 });

        await reminder.save();

        logger.info(`Patient ${data.patientId} missed reminder! Extending schedule.`);

        // Reschedule the reminder if it's missed
        const nextReminderAt = new Date(Date.now() + data.every);

        await sendReminderQueue.add(
          "backendtest_send_reminder",
          { ...data, scheduledAt: nextReminderAt },
          { repeat: { every: data.every } }
        );
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
      console.log('Received Process Actionable step extractions', job?.data);

      job.updateProgress(2)

      if (_.has(data, 'patientId')) {
        const patient = await getPatientById({ id: data.patientId });

        job.updateProgress(10)

        if (!patient) {
          throw new Error("Patient not found.");
        }

        console.time("process_llm");
        const extractedSteps = await processLLM(data.doctorNoteId);
        console.timeEnd("process_llm");

        job.updateProgress(50)

        console.time("create_new_actionable_steps");
        job.updateProgress(70)

        await sequelize.transaction(async (transaction) => {

          await ActionableStep.destroy({ where: { doctorNoteId: data?.doctorNoteId }, transaction });

          await Reminder.destroy({ where: { patientId: data?.patientId }, transaction });

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
            const parsedSchedule = parseSchedule(plan);

            console.log(plan, "plan--->>");


            console.log('Parsed Schedule', parsedSchedule);


            if (parsedSchedule) {
              const step = await ActionableStep.create(
                {
                  doctorNoteId: data.doctorNoteId,
                  type: "PLAN",
                  description: plan.task,
                  scheduledAt: parsedSchedule.ms ? new Date(Date.now() + parsedSchedule.ms) : null,
                  completed: false
                },
                { transaction }
              );

              await Reminder.create(
                {
                  actionableStepId: step?.id,
                  patientId: data?.patientId,
                  reminderAt: parsedSchedule.ms ? new Date(Date.now() + parsedSchedule.ms) : null,
                  acknowledged: false
                },
                { transaction }
              );

              console.log(`🔁 Scheduling Repeatable Reminder: ${plan.task} ${parsedSchedule.cron ? `via cron (${parsedSchedule.cron})` : `every ${parsedSchedule.ms}ms`}`);

              sendMessage(
                "backendtest_send_reminder",
                JSON.stringify({
                  patientId: data.patientId,
                  description: plan.task,
                  doctorNoteId: data.doctorNoteId,
                  scheduledAt: parsedSchedule.ms ? new Date(Date.now() + parsedSchedule.ms) : null,
                  pattern: parsedSchedule.cron ? parsedSchedule.cron : null,
                  every: parsedSchedule.ms ? parsedSchedule.ms : null
                })
              );
            }
          }
        });
        console.timeEnd("create_new_actionable_steps");
        console.log(`✅ LLM processing & reminders scheduled for Patient ${data.patientId}`);
      }
      job.updateProgress(100)
      return job?.data;
    } catch (error) {
      job?.log("Error sending notification");
      job?.moveToFailed(error, token);
    }
  }
}



