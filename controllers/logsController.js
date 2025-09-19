const Log = require("../models/Log");
const Account = require("../models/Account");

async function listLogs(req, res, next) {
  try {
    const { accountId } = req.params;

    const account = await Account.findById(accountId);
    if (!account)
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });

    const logs = await Log.find({ account: account._id }).sort({
      received_timestamp: -1,
    });

    res.json({ success: true, logs });
  } catch (err) {
    next(err);
  }
}

module.exports = { listLogs };
