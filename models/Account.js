const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const AccountSchema = new mongoose.Schema({
  account_id: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  account_name: { type: String, required: true },
  app_secret_token: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  website: { type: String },
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

AccountSchema.pre("remove", async function (next) {
  const Destination = mongoose.model("Destination");
  const AccountMember = mongoose.model("AccountMember");
  const Log = mongoose.model("Log");
  await Destination.deleteMany({ account: this._id });
  await AccountMember.deleteMany({ account: this._id });
  await Log.deleteMany({ account: this._id });
  next();
});

module.exports = mongoose.model("Account", AccountSchema);
