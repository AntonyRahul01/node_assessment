const Account = require("../models/Account");
const Destination = require("../models/Destination");
const Log = require("../models/Log");
const forwardQueue = require("../queues/forwardQueue");

async function incomingData(req, res, next) {
  try {
    if (!req.is("application/json")) {
      return res.status(400).json({ success: false, message: "Invalid Data" });
    }
    const token = req.headers["cl-x-token"];
    const eventId = req.headers["cl-x-event-id"];
    if (!token || !eventId) {
      return res.status(400).json({
        success: false,
        message: "Missing headers CL-X-TOKEN or CL-X-EVENT-ID",
      });
    }

    const account = await Account.findOne({ app_secret_token: token });
    if (!account)
      return res.status(401).json({ success: false, message: "Invalid token" });

    const existing = await Log.findOne({ event_id: eventId });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Duplicate event_id" });

    const log = await Log.create({
      event_id: eventId,
      account: account._id,
      received_data: req.body,
      status: "queued",
      received_timestamp: new Date(),
    });

    const destinations = await Destination.find({ account: account._id });

    await forwardQueue.add(
      "forward",
      {
        logId: log._id,
        eventId,
        accountId: account._id,
        destinations: destinations.map((d) => ({
          id: d._id.toString(),
          url: d.url,
          method: d.method,
          headers: Object.fromEntries(d.headers || []),
        })),
      },
      {
        attempts: 3,
        backoff: { type: "fixed", delay: 2000 },
      }
    );

    res.json({ success: true, message: "Data Received" });
  } catch (err) {
    next(err);
  }
}

module.exports = { incomingData };
