const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
    index: true,
  },
  url: { type: String, required: true },
  method: {
    type: String,
    required: true,
    enum: ["POST", "PUT", "PATCH", "GET", "DELETE"],
    default: "POST",
  },
  headers: { type: Map, of: String, required: true, default: {} },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Destination", DestinationSchema);
