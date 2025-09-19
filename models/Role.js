const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  role_name: { type: String, required: true, unique: true },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Role", RoleSchema);
