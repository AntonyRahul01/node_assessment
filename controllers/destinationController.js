const Destination = require("../models/Destination");
const Account = require("../models/Account");

async function createDestination(req, res, next) {
  try {
    const { accountId } = req.params;
    const account = await Account.findOne({
      $or: [{ account_id: accountId }, { _id: accountId }],
    });
    if (!account)
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });

    const { url, method, headers } = req.body;
    const dest = await Destination.create({
      account: account._id,
      url,
      method,
      headers: headers || {},
      created_by: req.user._id,
      updated_by: req.user._id,
    });
    res.json({ success: true, destination: dest });
  } catch (err) {
    next(err);
  }
}

async function listDestinations(req, res, next) {
  try {
    const { accountId } = req.params;
    const account = await Account.findOne({
      $or: [{ account_id: accountId }, { _id: accountId }],
    });
    if (!account)
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    const destinations = await Destination.find({ account: account._id });
    res.json({ success: true, destinations });
  } catch (err) {
    next(err);
  }
}

async function updateDestination(req, res, next) {
  try {
    const { id } = req.params;
    const dest = await Destination.findById(id);
    if (!dest)
      return res.status(404).json({ success: false, message: "Not found" });
    dest.url = req.body.url || dest.url;
    dest.method = req.body.method || dest.method;
    dest.headers = req.body.headers || dest.headers;
    dest.updated_at = new Date();
    dest.updated_by = req.user._id;
    await dest.save();
    res.json({ success: true, dest });
  } catch (err) {
    next(err);
  }
}

async function deleteDestination(req, res, next) {
  try {
    const { id } = req.params;
    const dest = await Destination.findById(id);
    if (!dest)
      return res.status(404).json({ success: false, message: "Not found" });
    await dest.remove();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createDestination,
  listDestinations,
  updateDestination,
  deleteDestination,
};
