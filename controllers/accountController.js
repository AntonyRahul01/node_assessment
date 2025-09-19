const Account = require("../models/Account");

async function createAccount(req, res, next) {
  try {
    const { account_name, website } = req.body;
    const account = new Account({
      account_name,
      website,
      created_by: req.user._id,
      updated_by: req.user._id,
    });
    await account.save();
    res.json({ success: true, account });
  } catch (err) {
    next(err);
  }
}

async function listAccounts(req, res, next) {
  try {
    const { q, limit = 20, page = 1 } = req.query;
    const filter = {};
    if (q) filter.account_name = { $regex: q, $options: "i" };
    const accounts = await Account.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));
    res.json({ success: true, accounts });
  } catch (err) {
    next(err);
  }
}

async function getAccount(req, res, next) {
  try {
    const { id } = req.params;
    const account = await Account.findOne({
      $or: [{ account_id: id }, { _id: id }],
    });
    if (!account)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, account });
  } catch (err) {
    next(err);
  }
}

async function updateAccount(req, res, next) {
  try {
    const { id } = req.params;
    const account = await Account.findOne({
      $or: [{ account_id: id }, { _id: id }],
    });
    if (!account)
      return res.status(404).json({ success: false, message: "Not found" });
    account.account_name = req.body.account_name || account.account_name;
    account.website = req.body.website || account.website;
    account.updated_by = req.user._id;
    account.updated_at = new Date();
    await account.save();
    res.json({ success: true, account });
  } catch (err) {
    next(err);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const { id } = req.params;
    const account = await Account.findOne({
      $or: [{ account_id: id }, { _id: id }],
    });
    if (!account)
      return res.status(404).json({ success: false, message: "Not found" });
    await account.remove();
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createAccount,
  listAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
};
