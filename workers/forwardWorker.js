require("dotenv").config();
const forwardQueue = require("../queues/forwardQueue");
const Log = require("../models/Log");
const mongoose = require("mongoose");
const { connect } = require("../config/db");
const redis = require("../config/redis");
const { forwardRequest } = require("../utils/httpForwarder");

const MONGO_URI = process.env.MONGO_URI;

async function start() {
  await connect(MONGO_URI);
  console.log("Worker connected to db. Starting worker...");

  forwardQueue.process("forward", 5, async (job) => {
    const { data } = job;
    const { logId, eventId, accountId, destinations } = data;

    for (const d of destinations) {
      try {
        const logEntry = await Log.findById(logId);
        logEntry.destination = d.id;
        logEntry.processed_timestamp = new Date();
        logEntry.attempt_count = (logEntry.attempt_count || 0) + 1;
        await logEntry.save();

        await forwardRequest(
          {
            url: d.url,
            method: d.method,
            headers: d.headers,
          },
          logEntry.received_data
        );

        // success
        logEntry.status = "success";
        logEntry.processed_timestamp = new Date();
        await logEntry.save();
      } catch (err) {
        console.error("Forward error to destination", d.url, err.message);
        // update log
        await Log.findByIdAndUpdate(logId, {
          $set: {
            status: "failed",
            processed_timestamp: new Date(),
            error: err.message,
          },
          $inc: { attempt_count: 1 },
        });
      }
    }
    return Promise.resolve();
  });

  forwardQueue.on("completed", (job, result) => {
    console.log("Job completed", job.id);
  });

  forwardQueue.on("failed", (job, err) => {
    console.error("Job failed", job.id, err);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
