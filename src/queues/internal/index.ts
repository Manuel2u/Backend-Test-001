import async from 'async';

const q = (job: (arg: any) => void) => {
  return async.queue(function (task: any, callback: any) {
    job(task);
    callback();
  }, 2);
};

const addToQueue = ({
  payload,
  job,
}: {
  payload: Record<string, any>;
  job: (arg: any) => void;
}) => {
  q(job).push(payload);
};

export default addToQueue;
