import addToQueue from "./internal";
import chalk from "chalk";
import { queues } from "./queues"


const sendToQueue = async (data: any) => {
  try {
    const queue = (queues.find((q) => q.name === data.channel))["queue"]

    if (!queue) {
      console.log("Queue not found");
      return;
    }

    await queue.add(data?.channel, data.value, {
      attempts: 3,
    });

    console.log(
      chalk.green("Message sent to queue: ")
        .concat(data.channel)
        .concat("🚀")
    );
  } catch (error) {
    console.log(error);
  }
};


export const sendMessage = async (queue: string, message: string) => {
  addToQueue({
    payload: {
      channel: queue,
      data: message,
      value: message,
      env: process.env["NODE-ENV"] || "test",
    },
    job: sendToQueue,
  });
};





