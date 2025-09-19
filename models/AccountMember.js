const mongoose = require("mongoose");

const AccountMemberSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
    index: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
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

module.exports = mongoose.model("AccountMember", AccountMemberSchema);
