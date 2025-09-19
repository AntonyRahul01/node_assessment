const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const LogSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
    index: true,
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
    required: false,
  },
  received_timestamp: { type: Date, required: true, default: Date.now },
  processed_timestamp: { type: Date },
  received_data: { type: mongoose.Schema.Types.Mixed },
  status: {
    type: String,
    enum: ["success", "failed", "queued"],
    default: "queued",
  },
  attempt_count: { type: Number, default: 0 },
  error: { type: String },
});

module.exports = mongoose.model("Log", LogSchema);
