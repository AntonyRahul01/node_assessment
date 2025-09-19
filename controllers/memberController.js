const Account = require("../models/Account");
const AccountMember = require("../models/AccountMember");
const User = require("../models/User");
const Role = require("../models/Role");

async function inviteMember(req, res, next) {
  try {
    const { accountId } = req.params;
    const { email, role_name } = req.body;
    const account = await Account.findOne({
      $or: [{ account_id: accountId }, { _id: accountId }],
    });
    if (!account)
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        password: Math.random().toString(36).slice(-8),
      });
    }

    const role = await Role.findOne({ role_name: role_name || "Normal user" });
    if (!role)
      return res
        .status(400)
        .json({ success: false, message: "Role not found" });

    const member = await AccountMember.create({
      account: account._id,
      user: user._id,
      role: role._id,
      created_by: req.user._id,
      updated_by: req.user._id,
    });

    res.json({ success: true, member });
  } catch (err) {
    next(err);
  }
}

async function listMembers(req, res, next) {
  try {
    const { accountId } = req.params;
    const account = await Account.findOne({
      $or: [{ account_id: accountId }, { _id: accountId }],
    });
    if (!account)
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    const members = await AccountMember.find({ account: account._id }).populate(
      "user role"
    );
    res.json({ success: true, members });
  } catch (err) {
    next(err);
  }
}

module.exports = { inviteMember, listMembers };
