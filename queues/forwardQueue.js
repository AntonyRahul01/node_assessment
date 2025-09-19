const Queue = require("bull");
const { URL } = require("url");

const redisUrl = new URL(process.env.REDIS_URL);

const forwardQueue = new Queue("forwardQueue", {
  redis: {
    host: redisUrl.hostname,
    port: Number(redisUrl.port),
    password: redisUrl.password,
  },
});

forwardQueue.on("failed", (job, err) => {
  console.error("Job failed", job.id, err);
});

forwardQueue.on("active", (job) => {
  console.log(`Job ${job.id} started`, job.data);
});

forwardQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

module.exports = forwardQueue;
