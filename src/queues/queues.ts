import { Queue, Worker } from "bullmq";
import { startRedis, client } from "../redis";
import { processActionableStepsExtraction, remindUserConsumer } from "./consumer";

export interface IQueue {
  queue: Queue;
  name: string;
  worker: Worker;
  description: string;
}

export let sendReminderQueue: Queue;
export let processLLMQueue: Queue;


export let sendReminderQueueWorker: Worker;
export let processLLMQueueWorker: Worker;


export let queues: IQueue[] = [];

export const initializeQueues = async () => {
  if (!client) {
    await startRedis();
  }

  const queueOptions = { connection: client };

  sendReminderQueue = new Queue('backendtest_send_reminder', queueOptions);
  processLLMQueue = new Queue('backendtest_process_llm', queueOptions);


  sendReminderQueueWorker = new Worker('backendtest_send_reminder', remindUserConsumer, queueOptions);
  processLLMQueueWorker = new Worker('backendtest_process_llm', processActionableStepsExtraction, queueOptions);


  queues = [
    {
      name: "backendtest_send_reminder",
      queue: sendReminderQueue,
      worker: sendReminderQueueWorker,
      description: "Listening to send reminders",
    },
    {
      name: "backendtest_process_llm",
      queue: processLLMQueue,
      worker: processLLMQueueWorker,
      description: "Listening to send reminders",
    }
  ];

  console.log("✅ BullMQ Queues and Workers Initialized");
};
